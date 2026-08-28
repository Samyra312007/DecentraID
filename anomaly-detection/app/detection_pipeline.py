"""
Real-time Anomaly Detection Pipeline.

Orchestrates feature extraction, model prediction, and behavioral profiling
for real-time anomaly detection on access events.
"""

import numpy as np
from datetime import datetime
from typing import Dict, Optional, Tuple
from .feature_extraction import FeatureExtractor
from .models.ensemble import EnsembleDetector
from .behavioral_profiling import BehavioralProfiler
from .config import settings


class AnomalyDetectionPipeline:
    """
    End-to-end anomaly detection pipeline.
    
    Pipeline flow:
    1. Extract features from incoming event
    2. Get behavioral profile deviation
    3. Run ensemble model prediction
    4. Combine scores for final decision
    5. Update behavioral profile
    """
    
    def __init__(self):
        self.feature_extractor = FeatureExtractor()
        self.ensemble = EnsembleDetector(
            autoencoder_weight=settings.ENSEMBLE_WEIGHT_AUTOENCODER,
            iforest_weight=settings.ENSEMBLE_WEIGHT_IFOREST
        )
        self.profiler = BehavioralProfiler(alpha=settings.EMA_ALPHA)
        
        self.is_initialized = False
        self.event_count = 0
    
    def initialize(self, training_data: Optional[np.ndarray] = None) -> Dict:
        """
        Initialize the pipeline with optional training data.
        
        Args:
            training_data: Optional pre-training data
            
        Returns:
            Initialization status
        """
        if training_data is not None and len(training_data) > 100:
            # Train models on provided data
            split_idx = int(len(training_data) * 0.8)
            X_train = training_data[:split_idx]
            X_val = training_data[split_idx:]
            
            training_result = self.ensemble.fit(X_train, X_val)
            self.is_initialized = True
            
            return {
                'status': 'trained',
                'training_samples': len(X_train),
                'validation_samples': len(X_val),
                'training_result': training_result
            }
        else:
            # Initialize with default parameters
            self.ensemble.autoencoder.build()
            self.ensemble.iforest.build()
            self.is_initialized = True
            
            return {
                'status': 'initialized',
                'note': 'Models initialized but not trained. Using default thresholds.'
            }
    
    def detect(self, event: Dict) -> Dict:
        """
        Run anomaly detection on a single event.
        
        Args:
            event: Event dictionary with keys:
                - user_id: User identifier
                - action: Action performed
                - resource: Resource accessed
                - ip_address: Source IP
                - success: Whether action succeeded
                - timestamp: Event timestamp (optional)
                
        Returns:
            Detection result with:
                - is_anomaly: Boolean
                - risk_score: 0-100 risk score
                - severity: low/medium/high/critical
                - details: Detailed scores and reasons
                - recommendations: Suggested actions
        """
        user_id = event.get('user_id', 'unknown')
        timestamp = event.get('timestamp', datetime.utcnow())
        
        if isinstance(timestamp, str):
            timestamp = datetime.fromisoformat(timestamp)
        
        # Step 1: Extract features
        features = self.feature_extractor.extract_features(
            event, user_id, timestamp
        )
        
        # Step 2: Calculate behavioral deviation
        behavioral_deviation = self.profiler.calculate_deviation(user_id, features)
        
        # Step 3: Run ensemble prediction
        if self.is_initialized:
            try:
                ensemble_score, is_anomaly, model_details = self.ensemble.predict_single(features)
            except Exception as e:
                # Fallback if models not properly trained
                ensemble_score = behavioral_deviation
                is_anomaly = behavioral_deviation > 0.7
                model_details = {'error': str(e)}
        else:
            ensemble_score = behavioral_deviation
            is_anomaly = behavioral_deviation > 0.7
            model_details = {'note': 'Using behavioral deviation only'}
        
        # Step 4: Combine scores
        # Weight: 60% model, 40% behavioral deviation
        combined_score = 0.6 * ensemble_score + 0.4 * behavioral_deviation
        risk_score = min(combined_score * 100, 100)
        
        # Step 5: Determine severity
        severity = self._calculate_severity(risk_score, event, behavioral_deviation)
        
        # Step 6: Generate reasons
        reasons = self._generate_reasons(
            features, behavioral_deviation, model_details, event
        )
        
        # Step 7: Generate recommendations
        recommendations = self._generate_recommendations(
            risk_score, severity, reasons, event
        )
        
        # Step 8: Update profile
        self.profiler.update_profile(user_id, event, features, timestamp)
        self.event_count += 1
        
        return {
            'is_anomaly': is_anomaly,
            'risk_score': round(risk_score, 2),
            'severity': severity,
            'details': {
                'ensemble_score': round(ensemble_score, 4),
                'behavioral_deviation': round(behavioral_deviation, 4),
                'combined_score': round(combined_score, 4),
                'model_details': model_details
            },
            'reasons': reasons,
            'recommendations': recommendations,
            'user_id': user_id,
            'timestamp': timestamp.isoformat()
        }
    
    def _calculate_severity(
        self,
        risk_score: float,
        event: Dict,
        behavioral_deviation: float
    ) -> str:
        """Calculate severity level based on risk score and context."""
        # Base severity from risk score
        if risk_score < 30:
            base_severity = 'low'
        elif risk_score < 60:
            base_severity = 'medium'
        elif risk_score < 80:
            base_severity = 'high'
        else:
            base_severity = 'critical'
        
        # Escalate if failed attempts
        if event.get('success') == False:
            if base_severity == 'low':
                base_severity = 'medium'
            elif base_severity == 'medium':
                base_severity = 'high'
        
        # Escalate if high behavioral deviation
        if behavioral_deviation > 2.0:
            if base_severity in ['low', 'medium']:
                base_severity = 'high'
        
        return base_severity
    
    def _generate_reasons(
        self,
        features: np.ndarray,
        behavioral_deviation: float,
        model_details: Dict,
        event: Dict
    ) -> list:
        """Generate human-readable reasons for anomaly score."""
        reasons = []
        
        # Temporal anomalies (features 0-3)
        hour = features[0] * 23
        if hour < 6 or hour > 22:
            reasons.append(f"Unusual access time: {int(hour)}:00")
        
        if features[2] == 1.0:  # is_weekend
            user_id = event.get('user_id', 'unknown')
            typical_day = self.profiler.get_typical_day(user_id)
            if typical_day < 5:  # Usually weekday user
                reasons.append("Weekend access by typically weekday user")
        
        # Frequency anomalies (features 4-7)
        if features[4] > 0.5:  # High events_last_hour
            reasons.append("High frequency of recent events")
        
        if features[5] > 0.6:  # High events_last_24h
            reasons.append("Unusually high daily activity")
        
        # Geographic anomalies (features 8-10)
        if features[8] > 0.3:  # Multiple IPs
            reasons.append(f"Multiple IP addresses used: {int(features[8] * 10)}+")
        
        if features[9] > 0.5:  # High new IP ratio
            reasons.append("High proportion of new IP addresses")
        
        # Behavioral anomalies (features 11-14)
        if behavioral_deviation > 1.5:
            reasons.append(f"Significant deviation from normal behavior ({behavioral_deviation:.1f}x)")
        
        if features[11] > 0.7:  # High action diversity
            reasons.append("Unusually diverse set of actions")
        
        if features[14] > 0.3:  # High failed attempt ratio
            reasons.append(f"Elevated failed attempt ratio: {int(features[14] * 100)}%")
        
        # Model-specific reasons
        if model_details.get('autoencoder_anomaly'):
            reasons.append("Pattern does not match learned normal behavior")
        
        if model_details.get('iforest_anomaly'):
            reasons.append("Detected as outlier by isolation forest")
        
        if not reasons:
            reasons.append("Minor deviations from baseline patterns")
        
        return reasons
    
    def _generate_recommendations(
        self,
        risk_score: float,
        severity: str,
        reasons: list,
        event: Dict
    ) -> list:
        """Generate recommended actions based on detection results."""
        recommendations = []
        
        if severity == 'critical':
            recommendations.append("Immediately block access and require re-authentication")
            recommendations.append("Notify security team")
            recommendations.append("Log detailed audit trail")
        elif severity == 'high':
            recommendations.append("Require additional verification (MFA)")
            recommendations.append("Limit access scope")
            recommendations.append("Monitor subsequent actions closely")
        elif severity == 'medium':
            recommendations.append("Flag for review")
            recommendations.append("Send notification to user")
        else:
            recommendations.append("Continue monitoring")
        
        # Specific recommendations based on reasons
        for reason in reasons:
            if 'time' in reason.lower():
                recommendations.append("Verify user identity for off-hours access")
            elif 'ip' in reason.lower():
                recommendations.append("Check if new IP is from expected location")
            elif 'failed' in reason.lower():
                recommendations.append("Consider temporary account lockout")
        
        return list(set(recommendations))  # Remove duplicates
    
    def get_user_summary(self, user_id: str) -> Dict:
        """Get summary of user's behavioral profile."""
        profile = self.profiler.get_or_create_profile(user_id)
        
        return {
            'user_id': user_id,
            'total_events': profile['total_events'],
            'typical_hour': self.profiler.get_typical_hour(user_id),
            'typical_day': self.profiler.get_typical_day(user_id),
            'top_resources': self.profiler.get_top_resources(user_id),
            'top_actions': self.profiler.get_top_actions(user_id),
            'known_ips': len(profile['known_ips']),
            'first_seen': profile['first_seen'].isoformat() if profile['first_seen'] else None,
            'last_seen': profile['last_seen'].isoformat() if profile['last_seen'] else None
        }
    
    def save(self, base_path: str) -> None:
        """Save all pipeline components."""
        self.ensemble.save(f"{base_path}/models")
        self.profiler.save(f"{base_path}/behavior_profiles.json")
    
    def load(self, base_path: str) -> None:
        """Load all pipeline components."""
        self.ensemble.load(f"{base_path}/models")
        self.profiler.load(f"{base_path}/behavior_profiles.json")
        self.is_initialized = self.ensemble.is_fitted
