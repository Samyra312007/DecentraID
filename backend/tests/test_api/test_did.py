"""
Tests for DID management endpoints.
"""

import pytest


class TestDIDEndpoints:
    """Tests for DID CRUD operations."""

    def test_create_did_endpoint_exists(self, client):
        """Test DID create endpoint exists."""
        response = client.post("/api/v1/did/create", json={})
        # Should get validation error (422), not 404
        assert response.status_code in [401, 403, 422]

    def test_did_create_requires_body(self, client):
        """Test DID creation requires request body."""
        response = client.post("/api/v1/did/create")
        # Should get 422 (no body) or 401/403 (no auth)
        assert response.status_code in [401, 403, 422]

    def test_did_endpoint_not_404(self, client):
        """Test DID endpoints are registered (not returning 404)."""
        # POST to create endpoint should not return 404
        response = client.post("/api/v1/did/create", json={"test": True})
        assert response.status_code != 404
