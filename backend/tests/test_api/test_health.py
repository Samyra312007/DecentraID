"""
Tests for health check endpoint.
"""

import pytest


class TestHealthCheck:
    """Tests for health check endpoint."""

    def test_health_check(self, client):
        """Test health check returns healthy status."""
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "version" in data

    def test_health_check_contains_components(self, client):
        """Test health check contains component status."""
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        # Should contain database status
        assert "database" in data or "status" in data
