"""
NotificationService — broadcasts real-time events via WebSocket.
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Manages WebSocket connections and broadcasts events to connected clients.
    Used to push real-time notifications (anomaly alerts, access decisions, etc.).
    """

    def __init__(self) -> None:
        self.active_connections: list = []

    async def connect(self, websocket) -> None:
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket) -> None:
        """Remove a WebSocket connection."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict) -> None:
        """Broadcast a message to all connected clients."""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)

        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)

    async def notify_managers(
        self, resource_id: str, request_id: str, requester: str
    ) -> None:
        """Notify all connected managers about a new access request."""
        await self.broadcast({
            "type": "access_request",
            "data": {
                "resource_id": resource_id,
                "request_id": request_id,
                "requester": requester,
            },
        })

    async def notify_anomaly_alert(self, alert: dict) -> None:
        """Broadcast an anomaly alert to all connected clients."""
        await self.broadcast({
            "type": "anomaly_alert",
            "data": alert,
        })

    async def notify_access_decision(
        self, request_id: str, approved: bool, did: str
    ) -> None:
        """Notify about an access decision."""
        await self.broadcast({
            "type": "access_granted" if approved else "access_denied",
            "data": {
                "request_id": request_id,
                "approved": approved,
                "did": did,
            },
        })
