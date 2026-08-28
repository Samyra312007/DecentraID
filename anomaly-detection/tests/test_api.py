"""
Tests for Anomaly Detection API Endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


class TestHealthEndpoint:
    """Tests for health check endpoint."""
    
    def test_health_check(self):
        """Test health check returns healthy status."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
        assert data['service'] == 'anomaly-detection'
        assert 'models_initialized' in data


class TestDetectEndpoint:
    """Tests for anomaly detection endpoint."""
    
    def test_detect_normal_event(self):
        """Test detection of normal event."""
        event = {
            'user_id': 'user_001',
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True
        }
        
        response = client.post("/detect", json=event)
        
        assert response.status_code == 200
        data = response.json()
        assert 'is_anomaly' in data
        assert 'risk_score' in data
        assert 'severity' in data
        assert 'reasons' in data
        assert 'recommendations' in data
    
    def test_detect_with_timestamp(self):
        """Test detection with explicit timestamp."""
        event = {
            'user_id': 'user_001',
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True,
            'timestamp': '2024-01-15T10:30:00'
        }
        
        response = client.post("/detect", json=event)
        
        assert response.status_code == 200
        data = response.json()
        assert data['timestamp'] is not None
    
    def test_detect_missing_fields(self):
        """Test detection with missing required fields."""
        event = {
            'user_id': 'user_001'
        }
        
        response = client.post("/detect", json=event)
        
        assert response.status_code == 422  # Validation error


class TestBatchDetectEndpoint:
    """Tests for batch detection endpoint."""
    
    def test_batch_detect(self):
        """Test batch detection."""
        events = {
            'events': [
                {
                    'user_id': 'user_001',
                    'action': 'read',
                    'resource': 'dashboard',
                    'ip_address': '192.168.1.100',
                    'success': True
                },
                {
                    'user_id': 'user_002',
                    'action': 'write',
                    'resource': 'settings',
                    'ip_address': '192.168.1.101',
                    'success': True
                }
            ]
        }
        
        response = client.post("/detect/batch", json=events)
        
        assert response.status_code == 200
        data = response.json()
        assert 'results' in data
        assert 'summary' in data
        assert len(data['results']) == 2
        assert data['summary']['total_events'] == 2
    
    def test_batch_detect_empty(self):
        """Test batch detection with empty list."""
        events = {'events': []}
        
        response = client.post("/detect/batch", json=events)
        
        assert response.status_code == 200
        data = response.json()
        assert data['summary']['total_events'] == 0


class TestProfileEndpoint:
    """Tests for user profile endpoint."""
    
    def test_get_profile(self):
        """Test getting user profile."""
        response = client.get("/profile/user_001")
        
        assert response.status_code == 200
        data = response.json()
        assert data['user_id'] == 'user_001'
        assert 'total_events' in data
        assert 'typical_hour' in data
        assert 'top_resources' in data


class TestFeaturesEndpoint:
    """Tests for features info endpoint."""
    
    def test_get_features(self):
        """Test getting feature information."""
        response = client.get("/features")
        
        assert response.status_code == 200
        data = response.json()
        assert data['dimensions'] == 15
        assert len(data['features']) == 15
        assert all('name' in f for f in data['features'])


class TestStatsEndpoint:
    """Tests for statistics endpoint."""
    
    def test_get_stats(self):
        """Test getting pipeline statistics."""
        response = client.get("/stats")
        
        assert response.status_code == 200
        data = response.json()
        assert 'events_processed' in data
        assert 'models_initialized' in data
        assert 'users_profiled' in data


class TestInitializeEndpoint:
    """Tests for model initialization endpoint."""
    
    def test_initialize_without_data(self):
        """Test initialization without training data."""
        response = client.post("/initialize")
        
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'success'
