"""
Tests for DID API endpoints.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock


class TestDIDEndpoints:
    """Test suite for DID create, resolve, and update endpoints."""

    @pytest.mark.asyncio
    async def test_resolve_did_not_found(self, client):
        """Test resolving a non-existent DID returns 404."""
        response = await client.get("/api/v1/did/did:decentraid:0xNonExistent")
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_resolve_did_invalid_format(self, client):
        """Test resolving an invalid DID format."""
        response = await client.get("/api/v1/did/invalid-did")
        # May return 404 or other error depending on implementation
        assert response.status_code in [400, 404, 422]

    @pytest.mark.asyncio
    async def test_health_check(self, client):
        """Test the health check endpoint."""
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "DecentraID API"

    @pytest.mark.asyncio
    async def test_api_docs_accessible(self, client):
        """Test that API documentation is accessible."""
        response = await client.get("/docs")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_unauthenticated_access_to_protected_endpoint(self, client):
        """Test that protected endpoints require authentication."""
        response = await client.get("/api/v1/did/list")
        # Should return 401 or similar
        assert response.status_code in [401, 403, 422]
