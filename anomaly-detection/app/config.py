from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configuration for Anomaly Detection Service."""
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    DEBUG: bool = False
    
    # Model paths
    AUTOENCODER_PATH: str = "models/autoencoder.keras"
    ISOLATION_FOREST_PATH: str = "models/isolation_forest.joblib"
    FEATURE_SCALER_PATH: str = "models/feature_scaler.joblib"
    BEHAVIOR_PROFILE_PATH: str = "models/behavior_profiles.joblib"
    
    # Detection thresholds
    AUTOENCODER_THRESHOLD: float = 0.1  # Reconstruction error threshold
    ISOLATION_FOREST_CONTAMINATION: float = 0.1  # Expected anomaly ratio
    ENSEMBLE_WEIGHT_AUTOENCODER: float = 0.6  # Weight for autoencoder
    ENSEMBLE_WEIGHT_IFOREST: float = 0.4  # Weight for isolation forest
    
    # Behavioral profiling
    EMA_ALPHA: float = 0.1  # Exponential moving average smoothing factor
    PROFILE_UPDATE_INTERVAL: int = 100  # Update profile every N events
    
    # Backend API
    BACKEND_API_URL: str = "http://localhost:8000"
    
    # Feature extraction
    FEATURE_DIMENSIONS: int = 15
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
