"""
Autoencoder Model for Anomaly Detection.

Uses scikit-learn's MLPRegressor as a neural network-based autoencoder
to learn normal access patterns and detect anomalies via reconstruction error.
"""

import numpy as np
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
from typing import Tuple, Optional
import joblib
import os


class AutoencoderModel:
    """
    Neural network autoencoder for anomaly detection.
    
    Uses MLPRegressor with symmetric architecture to learn normal patterns.
    Anomalies are detected based on high reconstruction error.
    
    Architecture:
    - Encoder: 15 → 32 → 16 → 8
    - Decoder: 8 → 16 → 32 → 15
    """
    
    def __init__(self, input_dim: int = 15, latent_dim: int = 8):
        self.input_dim = input_dim
        self.latent_dim = latent_dim
        self.model: Optional[MLPRegressor] = None
        self.threshold: float = 0.1
        self.scaler: Optional[StandardScaler] = None
    
    def build(self) -> MLPRegressor:
        """Build the autoencoder architecture using MLPRegressor."""
        # Architecture: 15 → 32 → 16 → 8 → 16 → 32 → 15
        hidden_layers = (32, 16, self.latent_dim, 16, 32)
        
        self.model = MLPRegressor(
            hidden_layer_sizes=hidden_layers,
            activation='relu',
            solver='adam',
            learning_rate_init=0.001,
            max_iter=1000,
            early_stopping=True,
            validation_fraction=0.1,
            n_iter_no_change=10,
            random_state=42,
            verbose=False
        )
        
        self.scaler = StandardScaler()
        
        return self.model
    
    def fit(
        self,
        X_train: np.ndarray,
        X_val: Optional[np.ndarray] = None,
        epochs: int = 100,
        batch_size: int = 32
    ) -> dict:
        """
        Train the autoencoder on normal data.
        
        Args:
            X_train: Training data (normal events only)
            X_val: Validation data (not used directly, MLP handles internally)
            epochs: Not used (MLP handles iteration internally)
            batch_size: Not used (MLP handles batching internally)
            
        Returns:
            Training history
        """
        if self.model is None:
            self.build()
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X_train)
        
        # Train model (autoencoder learns to reconstruct input)
        self.model.fit(X_scaled, X_scaled)
        
        # Calculate threshold from training data
        train_predictions = self.model.predict(X_scaled)
        train_mse = np.mean(np.power(X_scaled - train_predictions, 2), axis=1)
        self.threshold = np.percentile(train_mse, 95)  # 95th percentile
        
        return {
            'loss': float(np.mean(train_mse)),
            'n_iterations': self.model.n_iter_,
            'threshold': float(self.threshold)
        }
    
    def predict(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Predict reconstruction error for input data.
        
        Args:
            X: Input features
            
        Returns:
            Tuple of (reconstruction_errors, is_anomaly)
        """
        if self.model is None or self.scaler is None:
            raise ValueError("Model not built. Call build() or load() first.")
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Get reconstructions
        X_reconstructed = self.model.predict(X_scaled)
        
        # Calculate MSE for each sample
        mse = np.mean(np.power(X_scaled - X_reconstructed, 2), axis=1)
        
        # Determine anomalies
        is_anomaly = mse > self.threshold
        
        return mse, is_anomaly
    
    def predict_single(self, x: np.ndarray) -> Tuple[float, bool]:
        """
        Predict for a single sample.
        
        Args:
            x: Single feature vector
            
        Returns:
            Tuple of (reconstruction_error, is_anomaly)
        """
        x = x.reshape(1, -1)
        error, is_anomaly = self.predict(x)
        return float(error[0]), bool(is_anomaly[0])
    
    def save(self, path: str) -> None:
        """Save model to disk."""
        if self.model is None:
            raise ValueError("No model to save.")
        
        os.makedirs(os.path.dirname(path) if os.path.dirname(path) else '.', exist_ok=True)
        
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'threshold': self.threshold,
            'input_dim': self.input_dim,
            'latent_dim': self.latent_dim
        }, path)
    
    def load(self, path: str) -> None:
        """Load model from disk."""
        data = joblib.load(path)
        self.model = data['model']
        self.scaler = data['scaler']
        self.threshold = data['threshold']
        self.input_dim = data.get('input_dim', 15)
        self.latent_dim = data.get('latent_dim', 8)
    
    def summary(self) -> dict:
        """Get model summary information."""
        if self.model is None:
            return {"status": "Model not built"}
        
        return {
            "input_dim": self.input_dim,
            "latent_dim": self.latent_dim,
            "hidden_layers": self.model.hidden_layer_sizes,
            "threshold": self.threshold,
            "n_iterations": self.model.n_iter_,
            "loss": float(self.model.loss_) if hasattr(self.model, 'loss_') else None
        }
