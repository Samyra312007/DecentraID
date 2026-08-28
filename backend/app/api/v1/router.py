"""
API v1 router — aggregates all endpoint modules.
"""

from fastapi import APIRouter
from app.api.v1 import did, assets, access, policy, anomaly, ipfs, auth, websocket

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(did.router, prefix="/did", tags=["DID"])
api_router.include_router(assets.router, prefix="/asset", tags=["Assets"])
api_router.include_router(access.router, prefix="/access", tags=["Access Control"])
api_router.include_router(policy.router, prefix="/policy", tags=["Policies"])
api_router.include_router(anomaly.router, prefix="/anomaly", tags=["Anomaly Detection"])
api_router.include_router(ipfs.router, prefix="/ipfs", tags=["IPFS"])
api_router.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])
