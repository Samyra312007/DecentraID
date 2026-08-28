"""
Comprehensive tests for DID API endpoints.
"""

import pytest


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
        assert response.status_code in [400, 404, 422]

    @pytest.mark.asyncio
    async def test_update_did_requires_auth(self, client):
        """Test that DID update requires authentication."""
        response = await client.put(
            "/api/v1/did/did:decentraid:0x123",
            json={"metadata": {"name": "test"}},
        )
        assert response.status_code in [401, 403, 422]


class TestHealthEndpoint:
    """Test suite for health check endpoint."""

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
    async def test_openapi_schema_accessible(self, client):
        """Test that OpenAPI schema is accessible."""
        response = await client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "openapi" in schema
        assert schema["info"]["title"] == "DecentraID API"


class TestAuthEndpoint:
    """Test suite for authentication endpoints."""

    @pytest.mark.asyncio
    async def test_login_missing_fields(self, client):
        """Test login with missing fields."""
        response = await client.post(
            "/api/v1/auth/login",
            json={},
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_login_invalid_signature(self, client):
        """Test login with invalid signature."""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
                "signature": "invalid_signature",
            },
        )
        assert response.status_code == 401


class TestIPFSEndpoints:
    """Test suite for IPFS endpoints."""

    @pytest.mark.asyncio
    async def test_upload_requires_auth(self, client):
        """Test that IPFS upload requires authentication."""
        response = await client.post("/api/v1/ipfs/upload")
        assert response.status_code in [401, 422]

    @pytest.mark.asyncio
    async def test_retrieve_nonexistent_cid(self, client):
        """Test retrieving a non-existent CID."""
        response = await client.get("/api/v1/ipfs/QmNonExistent123456789")
        assert response.status_code == 404


class TestAccessEndpoints:
    """Test suite for access control endpoints."""

    @pytest.mark.asyncio
    async def test_check_access_missing_params(self, client):
        """Test access check with missing parameters."""
        response = await client.get("/api/v1/access/check")
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_access_logs_requires_auth(self, client):
        """Test that access logs require authentication."""
        response = await client.get("/api/v1/access/logs")
        assert response.status_code in [401, 422]


class TestAnomalyEndpoints:
    """Test suite for anomaly detection endpoints."""

    @pytest.mark.asyncio
    async def test_anomaly_dashboard_requires_auth(self, client):
        """Test that anomaly dashboard requires authentication."""
        response = await client.get("/api/v1/anomaly/dashboard")
        assert response.status_code in [401, 422]

    @pytest.mark.asyncio
    async def test_anomaly_alerts_requires_auth(self, client):
        """Test that anomaly alerts require authentication."""
        response = await client.get("/api/v1/anomaly/alerts")
        assert response.status_code in [401, 422]


class TestPolicyEndpoints:
    """Test suite for policy endpoints."""

    @pytest.mark.asyncio
    async def test_policy_list_requires_auth(self, client):
        """Test that policy list requires authentication."""
        response = await client.get("/api/v1/policy/list")
        assert response.status_code in [401, 422]
