"""
Behavioral Profiling Module.

Uses exponential moving averages to build user behavior baselines.
Detects deviations from established patterns.
"""

import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from collections import defaultdict
import json
import os


class BehavioralProfiler:
    """
    Builds and maintains behavioral profiles for users.
    
    Uses exponential moving averages (EMA) to track:
    - Typical access times
    - Resource access frequencies
    - Action patterns
    - Session characteristics
    
    Anomalies are detected when current behavior deviates significantly
    from the established baseline.
    """
    
    def __init__(self, alpha: float = 0.1, decay_hours: float = 168):
        """
        Args:
            alpha: EMA smoothing factor (0-1). Lower = slower adaptation
            decay_hours: Hours of history to maintain (default: 1 week)
        """
        self.alpha = alpha
        self.decay_hours = decay_hours
        self.profiles: Dict[str, Dict] = {}
    
    def get_or_create_profile(self, user_id: str) -> Dict:
        """Get existing profile or create new one."""
        if user_id not in self.profiles:
            self.profiles[user_id] = self._create_empty_profile()
        return self.profiles[user_id]
    
    def _create_empty_profile(self) -> Dict:
        """Create an empty behavioral profile."""
        return {
            # Temporal patterns
            'hour_distribution': np.zeros(24),  # Activity by hour
            'day_distribution': np.zeros(7),    # Activity by day
            
            # Frequency patterns
            'events_per_hour_ema': 0.0,         # Avg events per hour
            'events_per_day_ema': 0.0,          # Avg events per day
            
            # Resource patterns
            'resource_frequencies': defaultdict(float),  # Resource access freq
            'action_frequencies': defaultdict(float),    # Action freq
            
            # Session patterns
            'avg_session_duration_ema': 0.0,    # Avg session length
            'avg_events_per_session_ema': 0.0,  # Avg events per session
            
            # Network patterns
            'known_ips': set(),
            'ip_frequencies': defaultdict(float),
            
            # Statistical baselines
            'feature_means': np.zeros(15),
            'feature_stds': np.ones(15),
            'feature_counts': 0,
            
            # Metadata
            'total_events': 0,
            'first_seen': None,
            'last_seen': None,
            'last_updated': None
        }
    
    def update_profile(
        self,
        user_id: str,
        event: Dict,
        features: np.ndarray,
        timestamp: Optional[datetime] = None
    ) -> Dict:
        """
        Update user profile with new event.
        
        Args:
            user_id: User identifier
            event: Event data
            features: 15-dimensional feature vector
            timestamp: Event timestamp
            
        Returns:
            Updated profile
        """
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        profile = self.get_or_create_profile(user_id)
        
        # Update temporal patterns
        hour = timestamp.hour
        day = timestamp.weekday()
        
        # EMA update for hour distribution
        hour_vec = np.zeros(24)
        hour_vec[hour] = 1.0
        profile['hour_distribution'] = (
            (1 - self.alpha) * profile['hour_distribution'] +
            self.alpha * hour_vec
        )
        
        # EMA update for day distribution
        day_vec = np.zeros(7)
        day_vec[day] = 1.0
        profile['day_distribution'] = (
            (1 - self.alpha) * profile['day_distribution'] +
            self.alpha * day_vec
        )
        
        # Update frequency EMAs
        if profile['last_seen'] is not None:
            hours_since_last = (timestamp - profile['last_seen']).total_seconds() / 3600
            if hours_since_last > 0:
                events_this_hour = 1.0 / hours_since_last
                profile['events_per_hour_ema'] = (
                    (1 - self.alpha) * profile['events_per_hour_ema'] +
                    self.alpha * events_this_hour
                )
        
        profile['events_per_day_ema'] = (
            (1 - self.alpha) * profile['events_per_day_ema'] +
            self.alpha * 1.0  # One event today
        )
        
        # Update resource/action frequencies
        resource = event.get('resource', 'unknown')
        action = event.get('action', 'unknown')
        
        profile['resource_frequencies'][resource] = (
            (1 - self.alpha) * profile['resource_frequencies'][resource] +
            self.alpha * 1.0
        )
        
        profile['action_frequencies'][action] = (
            (1 - self.alpha) * profile['action_frequencies'][action] +
            self.alpha * 1.0
        )
        
        # Update network patterns
        ip = event.get('ip_address', 'unknown')
        profile['known_ips'].add(ip)
        profile['ip_frequencies'][ip] = (
            (1 - self.alpha) * profile['ip_frequencies'][ip] +
            self.alpha * 1.0
        )
        
        # Update feature statistics (for normalization)
        if profile['feature_counts'] == 0:
            profile['feature_means'] = features.copy()
            profile['feature_stds'] = np.ones(15)
        else:
            # Incremental mean and std update
            n = profile['feature_counts']
            old_mean = profile['feature_means']
            new_mean = old_mean + (features - old_mean) / (n + 1)
            profile['feature_means'] = new_mean
            
            if n > 0:
                old_var = profile['feature_stds'] ** 2
                new_var = old_var + ((features - old_mean) ** 2 - old_var) / (n + 1)
                profile['feature_stds'] = np.sqrt(np.maximum(new_var, 1e-8))
        
        profile['feature_counts'] += 1
        
        # Update metadata
        profile['total_events'] += 1
        profile['last_seen'] = timestamp
        if profile['first_seen'] is None:
            profile['first_seen'] = timestamp
        profile['last_updated'] = timestamp
        
        return profile
    
    def calculate_deviation(
        self,
        user_id: str,
        features: np.ndarray
    ) -> float:
        """
        Calculate how much current behavior deviates from baseline.
        
        Args:
            user_id: User identifier
            features: Current feature vector
            
        Returns:
            Deviation score (0 = normal, higher = more anomalous)
        """
        profile = self.get_or_create_profile(user_id)
        
        if profile['feature_counts'] < 10:
            # Not enough data for meaningful comparison
            return 0.5
        
        # Calculate z-scores for each feature
        z_scores = np.abs(features - profile['feature_means']) / (profile['feature_stds'] + 1e-8)
        
        # Clip extreme z-scores
        z_scores = np.clip(z_scores, 0, 5)
        
        # Average z-score as deviation measure
        deviation = float(np.mean(z_scores))
        
        return deviation
    
    def get_typical_hour(self, user_id: str) -> int:
        """Get user's most typical activity hour."""
        profile = self.get_or_create_profile(user_id)
        return int(np.argmax(profile['hour_distribution']))
    
    def get_typical_day(self, user_id: str) -> int:
        """Get user's most typical activity day."""
        profile = self.get_or_create_profile(user_id)
        return int(np.argmax(profile['day_distribution']))
    
    def get_top_resources(self, user_id: str, n: int = 5) -> List[str]:
        """Get user's most frequently accessed resources."""
        profile = self.get_or_create_profile(user_id)
        resources = profile['resource_frequencies']
        sorted_resources = sorted(resources.items(), key=lambda x: x[1], reverse=True)
        return [r[0] for r in sorted_resources[:n]]
    
    def get_top_actions(self, user_id: str, n: int = 5) -> List[str]:
        """Get user's most frequent actions."""
        profile = self.get_or_create_profile(user_id)
        actions = profile['action_frequencies']
        sorted_actions = sorted(actions.items(), key=lambda x: x[1], reverse=True)
        return [a[0] for a in sorted_actions[:n]]
    
    def is_known_ip(self, user_id: str, ip: str) -> bool:
        """Check if IP is known for user."""
        profile = self.get_or_create_profile(user_id)
        return ip in profile['known_ips']
    
    def save(self, path: str) -> None:
        """Save all profiles to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Convert sets and defaultdicts for JSON serialization
        serializable_profiles = {}
        for user_id, profile in self.profiles.items():
            serializable_profiles[user_id] = {
                'hour_distribution': profile['hour_distribution'].tolist(),
                'day_distribution': profile['day_distribution'].tolist(),
                'events_per_hour_ema': profile['events_per_hour_ema'],
                'events_per_day_ema': profile['events_per_day_ema'],
                'resource_frequencies': dict(profile['resource_frequencies']),
                'action_frequencies': dict(profile['action_frequencies']),
                'avg_session_duration_ema': profile['avg_session_duration_ema'],
                'avg_events_per_session_ema': profile['avg_events_per_session_ema'],
                'known_ips': list(profile['known_ips']),
                'ip_frequencies': dict(profile['ip_frequencies']),
                'feature_means': profile['feature_means'].tolist(),
                'feature_stds': profile['feature_stds'].tolist(),
                'feature_counts': profile['feature_counts'],
                'total_events': profile['total_events'],
                'first_seen': profile['first_seen'].isoformat() if profile['first_seen'] else None,
                'last_seen': profile['last_seen'].isoformat() if profile['last_seen'] else None,
                'last_updated': profile['last_updated'].isoformat() if profile['last_updated'] else None
            }
        
        with open(path, 'w') as f:
            json.dump(serializable_profiles, f)
    
    def load(self, path: str) -> None:
        """Load profiles from disk."""
        if not os.path.exists(path):
            return
        
        with open(path, 'r') as f:
            data = json.load(f)
        
        for user_id, profile_data in data.items():
            profile = self._create_empty_profile()
            profile['hour_distribution'] = np.array(profile_data['hour_distribution'])
            profile['day_distribution'] = np.array(profile_data['day_distribution'])
            profile['events_per_hour_ema'] = profile_data['events_per_hour_ema']
            profile['events_per_day_ema'] = profile_data['events_per_day_ema']
            profile['resource_frequencies'] = defaultdict(float, profile_data['resource_frequencies'])
            profile['action_frequencies'] = defaultdict(float, profile_data['action_frequencies'])
            profile['avg_session_duration_ema'] = profile_data['avg_session_duration_ema']
            profile['avg_events_per_session_ema'] = profile_data['avg_events_per_session_ema']
            profile['known_ips'] = set(profile_data['known_ips'])
            profile['ip_frequencies'] = defaultdict(float, profile_data['ip_frequencies'])
            profile['feature_means'] = np.array(profile_data['feature_means'])
            profile['feature_stds'] = np.array(profile_data['feature_stds'])
            profile['feature_counts'] = profile_data['feature_counts']
            profile['total_events'] = profile_data['total_events']
            profile['first_seen'] = datetime.fromisoformat(profile_data['first_seen']) if profile_data['first_seen'] else None
            profile['last_seen'] = datetime.fromisoformat(profile_data['last_seen']) if profile_data['last_seen'] else None
            profile['last_updated'] = datetime.fromisoformat(profile_data['last_updated']) if profile_data['last_updated'] else None
            
            self.profiles[user_id] = profile
