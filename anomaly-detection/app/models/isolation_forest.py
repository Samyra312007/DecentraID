"""
Isolation Forest Model for Anomaly Detection.

Uses scikit-learn's Isolation Forest for unsupervised anomaly detection.
Good at detecting point anomalies in high-dimensional data.
"""

import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from typing import Tuple, Optional
import joblib
import os


class IsolationForestModel:
    """
    Isolation Forest for anomaly detection.
    
    Isolation Forest works by:
    1. Randomly selecting a feature
    2. Randomly selecting a split value
    3. Anomalies are isolated faster (shorter path lengths)
    
    Advantages:
    - No need for labeled data
    - Handles high-dimensional data well
    - Fast training and inference
    """
    
    def __init__(
        self,
        contamination: float = 0.1,
        n_estimators: int = 100,
        max_samples: str = 'auto',
        random_state: int = 42
    ):
        self.contamination = contamination
        self.n_estimators = n_estimators
        self.max_samples = max_samples
        self.random_state = random_state
        
        self.model: Optional[IsolationForest] = None
        self.scaler: Optional[StandardScaler] = None
    
    def build(self) -> IsolationForest:
        """Build the Isolation Forest model."""
        self.model = IsolationForest(
            contamination=self.contamination,
            n_estimators=self.n_estimators,
            max_samples=self.max_samples,
            random_state=self.random_state,
            n_jobs=-1
        )
        
        self.scaler = StandardScaler()
        
        return self.model
    
    def fit(self, X_train: np.ndarray) -> dict:
        """
        Train the Isolation Forest on data.
        
        Args:
            X_train: Training data
            
        Returns:
            Training metadata
        """
        if self.model is None:
            self.build()
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X_train)
        
        # Fit model
        self.model.fit(X_scaled)
        
        # Get training scores
        train_scores = self.model.decision_function(X_scaled)
        
        return {
            'n_samples': len(X_train),
            'mean_score': float(np.mean(train_scores)),
            'std_score': float(np.std(train_scores)),
            'min_score': float(np.min(train_scores)),
            'max_score': float(np.max(train_scores))
        }
    
    def predict(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Predict anomalies in data.
        
        Args:
            X: Input features
            
        Returns:
            Tuple of (anomaly_scores, is_anomaly)
            - anomaly_scores: Negative scores (more negative = more anomalous)
            - is_anomaly: Boolean array (True = anomaly)
        """
        if self.model is None or self.scaler is None:
            raise ValueError("Model not fitted. Call fit() or load() first.")
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Get predictions
        # Isolation Forest returns -1 for anomalies, 1 for normal
        predictions = self.model.predict(X_scaled)
        is_anomaly = predictions == -1
        
        # Get anomaly scores (more negative = more anomalous)
        scores = self.model.decision_function(X_scaled)
        
        # Convert to positive scores (higher = more anomalous)
        anomaly_scores = -scores
        
        return anomaly_scores, is_anomaly
    
    def predict_single(self, x: np.ndarray) -> Tuple[float, bool]:
        """
        Predict for a single sample.
        
        Args:
            x: Single feature vector
            
        Returns:
            Tuple of (anomaly_score, is_anomaly)
        """
        x = x.reshape(1, -1)
        scores, is_anomaly = self.predict(x)
        return float(scores[0]), bool(is_anomaly[0])
    
    def score_samples(self, X: np.ndarray) -> np.ndarray:
        """
        Get anomaly scores for samples.
        
        Args:
            X: Input features
            
        Returns:
            Anomaly scores (higher = more anomalous)
        """
        if self.model is None or self.scaler is None:
            raise ValueError("Model not fitted.")
        
        X_scaled = self.scaler.transform(X)
        scores = self.model.decision_function(X_scaled)
        return -scores  # Negate so higher = more anomalous
    
    def save(self, path: str) -> None:
        """Save model to disk."""
        if self.model is None:
            raise ValueError("No model to save.")
        
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Save model and scaler together
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'contamination': self.contamination,
            'n_estimators': self.n_estimators
        }, path)
    
    def load(self, path: str) -> None:
        """Load model from disk."""
        data = joblib.load(path)
        self.model = data['model']
        self.scaler = data['scaler']
        self.contamination = data.get('contamination', self.contamination)
        self.n_estimators = data.get('n_estimators', self.n_estimators)
    
    def get_feature_importance(self) -> Optional[np.ndarray]:
        """
        Get feature importance (based on average path length).
        
        Returns:
            Array of feature importance scores or None
        """
        if self.model is None:
            return None
        
        # Isolation Forest doesn't directly provide feature importance
        # but we can estimate it from tree structure
        importances = np.zeros(self.model.n_features_in_)
        
        for tree in self.model.estimators_:
            # Count feature usage in splits
            feature_counts = np.zeros(self.model.n_features_in_)
            for node in tree.tree_.feature:
                if node >= 0:  # Not a leaf
                    feature_counts[node] += 1
            importances += feature_counts
        
        # Normalize
        importances = importances / importances.sum()
        
        return importances
