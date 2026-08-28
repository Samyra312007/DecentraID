"""
Application configuration using Pydantic Settings.
All configuration is loaded from environment variables / .env file.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "DecentraID"
    app_version: str = "1.0.0"
    debug: bool = True

    # Database
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/decentraid"
    database_host: str = "localhost"
    database_port: int = 5432
    database_name: str = "decentraid"
    database_user: str = "user"
    database_password: str = "password"

    # Redis
    redis_url: str = "redis://localhost:6379"
    redis_host: str = "localhost"
    redis_port: int = 6379

    # Blockchain
    polygon_amoy_rpc_url: str = "https://rpc-amoy.polygon.technology"
    polygon_amoy_chain_id: int = 80002
    private_key: str = ""

    # Contract addresses (set after deployment)
    identity_contract_address: str = ""
    access_control_contract_address: str = ""
    asset_contract_address: str = ""

    # IPFS
    ipfs_api_url: str = "/dns/localhost/tcp/5001"
    ipfs_gateway_url: str = "http://localhost:8080"

    # Security
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    encryption_key: str = "change-me-in-production"

    # Anomaly Detection
    anomaly_service_url: str = "http://localhost:8001"

    # CORS
    cors_origins: str = "http://localhost:3000"

    # Logging
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings singleton."""
    return Settings()
