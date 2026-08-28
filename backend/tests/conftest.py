"""
Pytest fixtures for DecentraID backend tests.
Provides test client, database, and authentication fixtures.
"""

import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest.fixture(scope="session")
def event_loop():
    """Create a single event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Async test client for the FastAPI app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def auth_headers() -> dict:
    """Generate valid JWT authentication headers for testing."""
    from app.services.auth_service import create_access_token

    token = create_access_token(
        did="did:decentraid:0xTestAddress1234567890abcdef1234567890abcdef",
        address="0xTestAddress1234567890abcdef1234567890abcdef",
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def mock_address() -> str:
    """Return a valid Ethereum address for testing."""
    return "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
