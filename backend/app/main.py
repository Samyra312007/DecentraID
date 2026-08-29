"""
DecentraID Backend — FastAPI Application Entry Point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api.v1.router import api_router
from app.api.health import router as health_router
from app.middleware.security import SecurityMiddleware
from app.middleware.rate_limiter import RateLimitMiddleware

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager — startup and shutdown hooks."""
    # Startup
    print(f"Starting {settings.app_name} v{settings.app_version}...")

    yield

    # Shutdown
    print(f"Shutting down {settings.app_name}...")


app = FastAPI(
    title=f"{settings.app_name} API",
    description="""DecentraID — Blockchain-based Decentralized Identity Platform""",
    version=settings.app_version,
    lifespan=lifespan,
    # Only expose API docs in debug/development mode
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
    openapi_tags=[
        {"name": "Authentication", "description": "Wallet signature based login"},
        {"name": "DID", "description": "Decentralized Identity management"},
        {"name": "Assets", "description": "NFT asset minting and management"},
        {"name": "Access Control", "description": "Role-based access control"},
        {"name": "Policies", "description": "Access policy management"},
        {"name": "Anomaly Detection", "description": "Security anomaly monitoring"},
        {"name": "IPFS", "description": "Decentralized document storage"},
        {"name": "WebSocket", "description": "Real-time event notifications"},
    ],
)

# ========== Middleware ==========

# CORS — restrictive policy to prevent credential theft
origins = [origin.strip() for origin in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
    expose_headers=["X-Request-ID"],
    max_age=600,
)

# Security headers
app.add_middleware(SecurityMiddleware)

# Rate limiting
app.add_middleware(RateLimitMiddleware, requests_per_minute=60)

# ========== Routers ==========

app.include_router(api_router, prefix="/api/v1")
app.include_router(health_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
