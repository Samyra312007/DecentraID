"""
Pytest configuration and fixtures for DecentraID backend tests.
"""

import os

# Set test-mode environment BEFORE any app imports.
# This overrides the production-safe defaults in config.py so
# tests can run without a full .env file.
os.environ["DEBUG"] = "true"
os.environ["JWT_SECRET"] = "test-jwt-secret-not-for-production"
os.environ["ENCRYPTION_KEY"] = "test-encryption-key-not-for-production"

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def sample_did_data():
    """Sample DID creation data."""
    return {
        "public_key": "0x1234567890abcdef1234567890abcdef12345678",
        "metadata": {
            "name": "Test DID",
            "description": "A test decentralized identifier"
        }
    }


@pytest.fixture
def sample_asset_data():
    """Sample asset minting data."""
    return {
        "asset_type": "credential",
        "jurisdiction": "US",
        "metadata": {
            "name": "Test Credential",
            "description": "A test credential"
        }
    }


@pytest.fixture
def sample_access_request_data():
    """Sample access request data."""
    return {
        "resource_id": "did:decentraid:0x1234567890abcdef",
        "action": "read",
        "reason": "Need to verify identity"
    }


@pytest.fixture
def sample_policy_data():
    """Sample policy creation data."""
    return {
        "resource_type": "did",
        "action": "read",
        "allowed_roles": ["admin", "viewer"]
    }


@pytest.fixture
def sample_anomaly_event():
    """Sample event for anomaly detection."""
    return {
        "user_id": "user_001",
        "action": "read",
        "resource": "dashboard",
        "ip_address": "192.168.1.100",
        "success": True
    }


@pytest.fixture
def sample_login_data():
    """Sample login data."""
    return {
        "address": "0x1234567890abcdef1234567890abcdef12345678",
        "signature": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678"
    }
