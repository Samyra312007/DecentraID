"""
Health check endpoint — returns service status.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    # Check database connectivity
    db_status = "unknown"
    try:
        from app.core.database import engine
        async with engine.connect() as conn:
            await conn.execute(__import__('sqlalchemy').text("SELECT 1"))
            db_status = "connected"
    except Exception:
        db_status = "unavailable"

    # Check blockchain connectivity (optional — may not be configured in CI)
    blockchain = {"connected": False, "block_number": None}
    try:
        from app.services.blockchain.web3_client import Web3Client
        client = Web3Client()
        if client.is_connected():
            blockchain = {
                "connected": True,
                "block_number": client.get_block_number(),
            }
    except Exception:
        pass  # Blockchain not configured — that's fine for health check

    return {
        "status": "healthy",
        "service": "DecentraID API",
        "version": "1.0.0",
        "database": db_status,
        "blockchain": blockchain,
    }
