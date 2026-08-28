"""
Training Script for Anomaly Detection Models.

Trains the ensemble detector on synthetic data and saves models to disk.
"""

import os
import sys
import numpy as np
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.ensemble import EnsembleDetector
from app.synthetic_data import SyntheticDataGenerator
from app.config import settings


def train_models(
    n_samples: int = 10000,
    save_path: str = "models"
):
    """
    Train all anomaly detection models.
    
    Args:
        n_samples: Number of training samples
        save_path: Path to save trained models
    """
    print("=" * 60)
    print("Anomaly Detection Model Training")
    print("=" * 60)
    
    # Generate synthetic data
    print("\n1. Generating synthetic data...")
    generator = SyntheticDataGenerator(seed=42)
    
    # Generate normal-only data for autoencoder
    print("   Generating normal behavior data...")
    X_normal = generator.generate_normal_only_data(n_samples=n_samples)
    print(f"   Generated {len(X_normal)} normal samples")
    
    # Generate mixed data for evaluation
    print("   Generating mixed data with anomalies...")
    X_mixed, y_mixed = generator.generate_dataset(
        n_users=n_samples // 100,
        events_per_user=100,
        anomaly_ratio=0.1
    )
    X_mixed = X_mixed[:n_samples]
    print(f"   Generated {len(X_mixed)} mixed samples")
    
    # Initialize ensemble
    print("\n2. Initializing ensemble detector...")
    ensemble = EnsembleDetector(
        autoencoder_weight=settings.ENSEMBLE_WEIGHT_AUTOENCODER,
        iforest_weight=settings.ENSEMBLE_WEIGHT_IFOREST
    )
    
    # Train ensemble
    print("\n3. Training ensemble detector...")
    print("   Training autoencoder...")
    print("   Training isolation forest...")
    
    # Split data
    split_idx = int(len(X_normal) * 0.8)
    X_train = X_normal[:split_idx]
    X_val = X_normal[split_idx:]
    
    training_result = ensemble.fit(
        X_train,
        X_val,
        autoencoder_epochs=50,
        autoencoder_batch_size=32
    )
    
    print(f"   Training complete!")
    print(f"   - Autoencoder final loss: {training_result['autoencoder_history']['loss'][-1]:.4f}")
    print(f"   - Ensemble threshold: {training_result['ensemble_threshold']:.4f}")
    
    # Evaluate on mixed data
    print("\n4. Evaluating on test data...")
    test_features = X_mixed[:1000]  # Use subset for quick evaluation
    
    try:
        scores, is_anomaly, details = ensemble.predict(test_features)
        
        # Calculate metrics
        # Note: y_mixed contains event dicts, not labels
        # For evaluation, we'll use the anomaly scores
        n_detected = np.sum(is_anomaly)
        print(f"   - Detected {n_detected} anomalies out of {len(test_features)} samples")
        print(f"   - Detection rate: {n_detected/len(test_features)*100:.1f}%")
        print(f"   - Mean anomaly score: {np.mean(scores):.4f}")
        print(f"   - Max anomaly score: {np.max(scores):.4f}")
    except Exception as e:
        print(f"   Evaluation skipped: {e}")
    
    # Save models
    print("\n5. Saving models...")
    os.makedirs(save_path, exist_ok=True)
    
    ensemble.save(f"{save_path}/ensemble")
    print(f"   Models saved to {save_path}/")
    
    # Print model info
    print("\n6. Model Information:")
    info = ensemble.get_model_info()
    print(f"   - Autoencoder input dim: {info['autoencoder_params']['input_dim']}")
    print(f"   - Autoencoder latent dim: {info['autoencoder_params']['latent_dim']}")
    print(f"   - Isolation Forest estimators: {info['iforest_params']['n_estimators']}")
    print(f"   - Ensemble weights: AE={info['weights']['autoencoder']}, IF={info['weights']['iforest']}")
    
    print("\n" + "=" * 60)
    print("Training complete!")
    print("=" * 60)
    
    return ensemble


if __name__ == "__main__":
    train_models()
