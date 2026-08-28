"""
Ensemble Detector for Anomaly Detection.

Combines Autoencoder and Isolation Forest predictions using weighted averaging.
Provides more robust anomaly detection than individual models.
"""

import numpy as np
from typing import Tuple, Optional, Dict
from .autoencoder import AutoencoderModel
from .isolation_forest import IsolationForestModel


class EnsembleDetector:
    """
    Ensemble detector combining Autoencoder and Isolation Forest.
    
    Uses weighted averaging of anomaly scores from both models.
    The ensemble is more robust than individual models because:
    - Autoencoder captures reconstruction-based anomalies
    - Isolation Forest captures point anomalies
    - Different models may catch different types of anomalies
    """
    
    def __init__(
        self,
        autoencoder_weight: float = 0.6,
        iforest_weight: float = 0.4,
        threshold: float = 0.5
    ):
        self.autoencoder_weight = autoencoder_weight
        self.iforest_weight = iforest_weight
        self.threshold = threshold
        
        self.autoencoder = AutoencoderModel()
        self.iforest = IsolationForestModel()
        
        self.is_fitted = False
    
    def fit(
        self,
        X_train: np.ndarray,
        X_val: Optional[np.ndarray] = None,
        autoencoder_epochs: int = 100,
        autoencoder_batch_size: int = 32
    ) -> Dict:
        """
        Train both models on normal data.
        
        Args:
            X_train: Training data (normal events only)
            X_val: Validation data
            autoencoder_epochs: Training epochs for autoencoder
            autoencoder_batch_size: Batch size for autoencoder
            
        Returns:
            Training metadata from both models
        """
        # Build and train autoencoder
        self.autoencoder.build()
        ae_history = self.autoencoder.fit(
            X_train,
            X_val,
            epochs=autoencoder_epochs,
            batch_size=autoencoder_batch_size
        )
        
        # Train Isolation Forest
        iforest_meta = self.iforest.fit(X_train)
        
        # Calibrate ensemble threshold
        self._calibrate_threshold(X_train)
        
        self.is_fitted = True
        
        return {
            'autoencoder_history': ae_history,
            'iforest_metadata': iforest_meta,
            'ensemble_threshold': self.threshold,
            'weights': {
                'autoencoder': self.autoencoder_weight,
                'iforest': self.iforest_weight
            }
        }
    
    def _calibrate_threshold(self, X: np.ndarray) -> None:
        """Calibrate ensemble threshold based on training data."""
        # Get scores from both models
        ae_scores, _ = self.autoencoder.predict(X)
        if_scores, _ = self.iforest.predict(X)
        
        # Normalize scores to 0-1 range
        ae_scores_norm = self._normalize_scores(ae_scores)
        if_scores_norm = self._normalize_scores(if_scores)
        
        # Combined scores
        combined = (
            self.autoencoder_weight * ae_scores_norm +
            self.iforest_weight * if_scores_norm
        )
        
        # Set threshold at 95th percentile
        self.threshold = float(np.percentile(combined, 95))
    
    def _normalize_scores(self, scores: np.ndarray) -> np.ndarray:
        """Normalize scores to 0-1 range."""
        min_score = np.min(scores)
        max_score = np.max(scores)
        if max_score - min_score < 1e-10:
            return np.zeros_like(scores)
        return (scores - min_score) / (max_score - min_score)
    
    def predict(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray, Dict]:
        """
        Predict anomalies using ensemble.
        
        Args:
            X: Input features
            
        Returns:
            Tuple of (ensemble_scores, is_anomaly, details)
            - ensemble_scores: Combined anomaly scores (0-1)
            - is_anomaly: Boolean array
            - details: Individual model scores
        """
        if not self.is_fitted:
            raise ValueError("Ensemble not fitted. Call fit() first.")
        
        # Get predictions from both models
        ae_scores, ae_anomalies = self.autoencoder.predict(X)
        if_scores, if_anomalies = self.iforest.predict(X)
        
        # Normalize scores to 0-1 range
        ae_scores_norm = self._normalize_scores(ae_scores)
        if_scores_norm = self._normalize_scores(if_scores)
        
        # Weighted combination
        ensemble_scores = (
            self.autoencoder_weight * ae_scores_norm +
            self.iforest_weight * if_scores_norm
        )
        
        # Determine anomalies
        is_anomaly = ensemble_scores > self.threshold
        
        details = {
            'autoencoder_scores': ae_scores_norm.tolist(),
            'iforest_scores': if_scores_norm.tolist(),
            'autoencoder_anomalies': ae_anomalies.tolist(),
            'iforest_anomalies': if_anomalies.tolist(),
            'threshold': self.threshold
        }
        
        return ensemble_scores, is_anomaly, details
    
    def predict_single(self, x: np.ndarray) -> Tuple[float, bool, Dict]:
        """
        Predict for a single sample.
        
        Args:
            x: Single feature vector
            
        Returns:
            Tuple of (ensemble_score, is_anomaly, details)
        """
        x = x.reshape(1, -1)
        scores, is_anomaly, details = self.predict(x)
        
        # Extract single sample details
        single_details = {
            'autoencoder_score': details['autoencoder_scores'][0],
            'iforest_score': details['iforest_scores'][0],
            'autoencoder_anomaly': details['autoencoder_anomalies'][0],
            'iforest_anomaly': details['iforest_anomalies'][0],
            'threshold': details['threshold']
        }
        
        return float(scores[0]), bool(is_anomaly[0]), single_details
    
    def save(self, base_path: str) -> None:
        """Save both models."""
        self.autoencoder.save(f"{base_path}_autoencoder")
        self.iforest.save(f"{base_path}_iforest")
        
        # Save ensemble config
        import json
        config = {
            'autoencoder_weight': self.autoencoder_weight,
            'iforest_weight': self.iforest_weight,
            'threshold': self.threshold,
            'is_fitted': self.is_fitted
        }
        with open(f"{base_path}_ensemble_config.json", 'w') as f:
            json.dump(config, f)
    
    def load(self, base_path: str) -> None:
        """Load both models."""
        self.autoencoder.load(f"{base_path}_autoencoder")
        self.iforest.load(f"{base_path}_iforest")
        
        # Load ensemble config
        import json
        with open(f"{base_path}_ensemble_config.json", 'r') as f:
            config = json.load(f)
        
        self.autoencoder_weight = config['autoencoder_weight']
        self.iforest_weight = config['iforest_weight']
        self.threshold = config['threshold']
        self.is_fitted = config['is_fitted']
    
    def get_model_info(self) -> Dict:
        """Get information about the ensemble."""
        return {
            'is_fitted': self.is_fitted,
            'weights': {
                'autoencoder': self.autoencoder_weight,
                'iforest': self.iforest_weight
            },
            'threshold': self.threshold,
            'autoencoder_params': {
                'input_dim': self.autoencoder.input_dim,
                'latent_dim': self.autoencoder.latent_dim,
                'has_model': self.autoencoder.model is not None
            },
            'iforest_params': {
                'contamination': self.iforest.contamination,
                'n_estimators': self.iforest.n_estimators,
                'has_model': self.iforest.model is not None
            }
        }
