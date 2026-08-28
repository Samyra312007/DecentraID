"""
Health check endpoint — returns service status.
"""

from fastapi import APIRouter
from app.services.blockchain.web3_client import Web3Client

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    client = Web3Client()

    return {
        "status": "healthy",
        "service": "DecentraID API",
        "version": "1.0.0",
        "blockchain": {
            "connected": client.is_connected(),
            "block_number": client.get_block_number() if client.is_connected() else None,
        },
    }
