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
    description="Blockchain-based Identity, Access Control & Asset Management",
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ========== Middleware ==========

# CORS
origins = [origin.strip() for origin in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers
app.add_middleware(SecurityMiddleware)

# Rate limiting
app.add_middleware(RateLimitMiddleware, requests_per_minute=60)

# ========== Routers ==========

app.include_router(api_router, prefix="/api/v1")
app.include_router(health_router)


# ========== WebSocket ==========

class ConnectionManager:
    """Global WebSocket connection manager."""

    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass


ws_manager = ConnectionManager()


@app.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time event notifications."""
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
