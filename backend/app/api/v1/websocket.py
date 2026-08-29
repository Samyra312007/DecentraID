"""
WebSocket endpoint for real-time event notifications.
Clients connect to receive live updates on access requests, anomaly alerts, etc.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Set, Dict, Any
import json
import asyncio
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class ConnectionManager:
    """Manages active WebSocket connections with topic subscriptions."""

    def __init__(self):
        self.active_connections: Dict[WebSocket, Set[str]] = {}
        self._heartbeat_task: asyncio.Task = None

    async def connect(self, websocket: WebSocket, topics: Set[str] = None):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections[websocket] = topics or {"all"}
        logger.info(f"WebSocket connected. Total: {len(self.active_connections)}")

        # Send welcome message
        await websocket.send_json({
            "type": "connected",
            "data": {
                "message": "Connected to DecentraID event stream",
                "topics": list(self.active_connections[websocket])
            }
        })

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection."""
        if websocket in self.active_connections:
            del self.active_connections[websocket]
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict, topic: str = "all"):
        """Broadcast a message to all subscribed clients."""
        disconnected = []
        for connection, topics in self.active_connections.items():
            if "all" in topics or topic in topics:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.append(connection)

        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)

    async def send_personal(self, websocket: WebSocket, message: dict):
        """Send a message to a specific client."""
        try:
            await websocket.send_json(message)
        except Exception:
            self.disconnect(websocket)

    async def heartbeat(self):
        """Send periodic heartbeat to keep connections alive."""
        while True:
            await asyncio.sleep(30)
            disconnected = []
            for connection in list(self.active_connections.keys()):
                try:
                    await connection.send_json({"type": "heartbeat", "data": {}})
                except Exception:
                    disconnected.append(connection)
            for conn in disconnected:
                self.disconnect(conn)

    def start_heartbeat(self):
        """Start the heartbeat task."""
        if self._heartbeat_task is None or self._heartbeat_task.done():
            self._heartbeat_task = asyncio.create_task(self.heartbeat())

    def stop_heartbeat(self):
        """Stop the heartbeat task."""
        if self._heartbeat_task and not self._heartbeat_task.done():
            self._heartbeat_task.cancel()


# Global connection manager
ws_manager = ConnectionManager()


# Event type constants
class EventType:
    ACCESS_REQUEST = "access_request"
    ACCESS_GRANTED = "access_granted"
    ACCESS_DENIED = "access_denied"
    ANOMALY_ALERT = "anomaly_alert"
    DID_CREATED = "did_created"
    DID_UPDATED = "did_updated"
    ASSET_MINTED = "asset_minted"
    ASSET_TRANSFERRED = "asset_transferred"
    POLICY_CREATED = "policy_created"
    SYSTEM = "system"


@router.websocket("/events")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time events.

    Authentication: Client must send a JSON message with {"token": "<jwt>"}
    as the first message after connection. The token is verified before
    accepting subscriptions.

    Client can send JSON messages to subscribe/unsubscribe:
    {"action": "subscribe", "topics": ["anomaly_alert", "access_request"]}
    {"action": "unsubscribe", "topics": ["anomaly_alert"]}
    {"action": "ping"}
    """
    await ws_manager.connect(websocket)
    ws_manager.start_heartbeat()

    # --- Authentication handshake ---
    try:
        raw = await asyncio.wait_for(websocket.receive_text(), timeout=15)
        msg = json.loads(raw)
        token = msg.get("token", "")
        if not token:
            await ws_manager.send_personal(websocket, {
                "type": "error",
                "data": {"message": "Authentication required. Send {\"token\": \"<jwt>\"} as the first message."}
            })
            ws_manager.disconnect(websocket)
            return

        # Verify JWT
        from app.services.auth_service import verify_token
        payload = verify_token(token)
        authenticated_did = payload.get("sub", "")

        await ws_manager.send_personal(websocket, {
            "type": "authenticated",
            "data": {"did": authenticated_did}
        })
    except asyncio.TimeoutError:
        await ws_manager.send_personal(websocket, {
            "type": "error",
            "data": {"message": "Authentication timeout. Send token within 15 seconds."}
        })
        ws_manager.disconnect(websocket)
        return
    except Exception:
        await ws_manager.send_personal(websocket, {
            "type": "error",
            "data": {"message": "Invalid authentication token."}
        })
        ws_manager.disconnect(websocket)
        return
    # --- End authentication handshake ---

    try:
        while True:
            # Receive client messages
            data = await websocket.receive_text()

            try:
                message = json.loads(data)
                action = message.get("action")

                if action == "subscribe":
                    topics = message.get("topics", [])
                    if websocket in ws_manager.active_connections:
                        ws_manager.active_connections[websocket].update(topics)
                    await ws_manager.send_personal(websocket, {
                        "type": "subscribed",
                        "data": {"topics": topics}
                    })

                elif action == "unsubscribe":
                    topics = message.get("topics", [])
                    if websocket in ws_manager.active_connections:
                        ws_manager.active_connections[websocket].difference_update(topics)
                    await ws_manager.send_personal(websocket, {
                        "type": "unsubscribed",
                        "data": {"topics": topics}
                    })

                elif action == "ping":
                    await ws_manager.send_personal(websocket, {
                        "type": "pong",
                        "data": {}
                    })

                elif action == "get_topics":
                    topics = ws_manager.active_connections.get(websocket, set())
                    await ws_manager.send_personal(websocket, {
                        "type": "topics",
                        "data": {"topics": list(topics)}
                    })

            except json.JSONDecodeError:
                await ws_manager.send_personal(websocket, {
                    "type": "error",
                    "data": {"message": "Invalid JSON"}
                })

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        ws_manager.disconnect(websocket)


# Helper functions for broadcasting events
async def broadcast_access_request(resource_id: str, request_id: str, requester: str):
    """Broadcast a new access request event."""
    await ws_manager.broadcast({
        "type": EventType.ACCESS_REQUEST,
        "data": {
            "resource_id": resource_id,
            "request_id": request_id,
            "requester": requester
        }
    }, topic="access_request")


async def broadcast_access_decision(request_id: str, approved: bool, did: str):
    """Broadcast an access decision event."""
    event_type = EventType.ACCESS_GRANTED if approved else EventType.ACCESS_DENIED
    await ws_manager.broadcast({
        "type": event_type,
        "data": {
            "request_id": request_id,
            "approved": approved,
            "did": did
        }
    }, topic="access_" + ("granted" if approved else "denied"))


async def broadcast_anomaly_alert(alert: dict):
    """Broadcast an anomaly alert event."""
    await ws_manager.broadcast({
        "type": EventType.ANOMALY_ALERT,
        "data": alert
    }, topic="anomaly_alert")


async def broadcast_did_event(event_type: str, did_data: dict):
    """Broadcast a DID-related event."""
    await ws_manager.broadcast({
        "type": event_type,
        "data": did_data
    }, topic="did_" + event_type.split("_")[-1])


async def broadcast_asset_event(event_type: str, asset_data: dict):
    """Broadcast an asset-related event."""
    await ws_manager.broadcast({
        "type": event_type,
        "data": asset_data
    }, topic="asset_" + event_type.split("_")[-1])
