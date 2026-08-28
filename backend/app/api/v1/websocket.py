"""
WebSocket endpoint for real-time event notifications.
Clients connect to receive live updates on access requests, anomaly alerts, etc.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

# Global connection manager
class ConnectionManager:
    """Manages active WebSocket connections."""

    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        for conn in disconnected:
            self.disconnect(conn)


ws_manager = ConnectionManager()


@router.websocket("/events")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time events.
    Clients receive notifications for:
    - access_request: New access request received
    - access_granted: Access was granted
    - access_denied: Access was denied
    - anomaly_alert: New anomaly detected
    """
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive, receive client messages if needed
            data = await websocket.receive_text()
            # Handle client messages (e.g., subscription preferences)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
