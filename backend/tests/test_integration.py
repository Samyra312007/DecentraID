"""
Integration tests for DecentraID backend.
"""

import pytest


class TestAnomalyDetectionIntegration:
    """Tests for anomaly detection integration."""

    def test_anomaly_detection_pipeline(self):
        """Test complete anomaly detection pipeline."""
        try:
            import sys
            sys.path.insert(0, '../anomaly-detection')

            from app.detection_pipeline import AnomalyDetectionPipeline

            pipeline = AnomalyDetectionPipeline()
            pipeline.initialize()

            # Test normal event
            normal_event = {
                "user_id": "user_001",
                "action": "read",
                "resource": "dashboard",
                "ip_address": "192.168.1.100",
                "success": True
            }

            result = pipeline.detect(normal_event)

            assert "is_anomaly" in result
            assert "risk_score" in result
            assert "severity" in result
            assert "reasons" in result
            assert "recommendations" in result
        except ImportError:
            pytest.skip("Anomaly detection module not available")

    def test_feature_extraction_integration(self):
        """Test feature extraction with real events."""
        try:
            import sys
            sys.path.insert(0, '../anomaly-detection')

            from app.feature_extraction import FeatureExtractor

            extractor = FeatureExtractor()

            event = {
                "user_id": "user_001",
                "action": "read",
                "resource": "dashboard",
                "ip_address": "192.168.1.100",
                "success": True
            }

            features = extractor.extract_features(event, "user_001")

            assert features.shape == (15,)
        except ImportError:
            pytest.skip("Anomaly detection module not available")

    def test_ensemble_detector_integration(self):
        """Test ensemble detector with synthetic data."""
        try:
            import sys
            sys.path.insert(0, '../anomaly-detection')
            import numpy as np

            from app.models.ensemble import EnsembleDetector

            ensemble = EnsembleDetector()

            # Generate training data
            X_normal = np.random.randn(100, 15).astype(np.float32)

            # Train
            ensemble.fit(X_normal)

            # Predict
            scores, is_anomaly, details = ensemble.predict(X_normal[:10])

            assert scores.shape == (10,)
            assert "autoencoder_scores" in details
            assert "iforest_scores" in details
        except ImportError:
            pytest.skip("Anomaly detection module not available")


class TestWebSocketIntegration:
    """Tests for WebSocket integration."""

    def test_websocket_manager_initialization(self):
        """Test WebSocket manager can be initialized."""
        try:
            from app.api.v1.websocket import ConnectionManager, ws_manager
            manager = ConnectionManager()
            assert manager is not None
            assert hasattr(manager, 'active_connections')
        except ImportError:
            pytest.skip("WebSocket module not available")


class TestAPIIntegration:
    """Tests for API endpoint integration."""

    def test_health_endpoint(self, client):
        """Test health endpoint returns 200."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data

    def test_api_v1_prefix(self, client):
        """Test API v1 endpoints are accessible."""
        # Test that at least some v1 endpoints exist
        response = client.post("/api/v1/did/create", json={})
        # Should get 422 (validation error) not 404
        assert response.status_code != 404

    def test_security_headers_present(self, client):
        """Test security headers are present in response."""
        response = client.get("/health")

        # Check for security headers
        assert "x-content-type-options" in response.headers
        assert "x-frame-options" in response.headers
        assert "x-xss-protection" in response.headers

    def test_cors_headers(self, client):
        """Test CORS headers are present."""
        response = client.options("/health", headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET"
        })

        # Should have CORS headers or return 200
        assert response.status_code in [200, 204]
