"""
Access Control API endpoints — request, decide, and check access.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.access import AccessRequestModel, AccessCheckResponse, AccessLogsResponse, AccessLogEntry
from app.services.blockchain.access_service import AccessService
from app.services.auth_service import get_current_user
from app.services.audit_service import AuditService

router = APIRouter()


@router.post("/request")
async def request_access(
    request: AccessRequestModel,
    current_user: dict = Depends(get_current_user),
):
    """Request access to a resource."""

    access_service = AccessService()

    request_id = await access_service.request_access(
        did=current_user["did"],
        resource_id=request.resource_id,
        action=request.action,
        reason=request.reason,
    )

    return {"request_id": request_id, "status": "pending"}


@router.post("/decide")
async def decide_access(
    request_id: str = Query(...),
    approve: bool = Query(...),
    current_user: dict = Depends(get_current_user),
):
    """Approve or deny an access request (manager only)."""

    access_service = AccessService()

    # Verify manager role
    if not await access_service.verify_manager_role(current_user["did"]):
        raise HTTPException(status_code=403, detail="Not authorized as manager")

    tx_hash = await access_service.decide_access(
        request_id=request_id,
        approve=approve,
        manager_did=current_user["did"],
    )

    return {"tx_hash": tx_hash, "decision": "approved" if approve else "denied"}


@router.get("/check", response_model=AccessCheckResponse)
async def check_access(
    did: str = Query(...),
    resource_id: str = Query(...),
    action: str = Query(...),
    current_user: dict = Depends(get_current_user),
):
    """Check if a DID has access to a resource.\n\n    Only the DID controller or an admin can check access for a DID.
    """
    # Enforce: you can only check your own access (or be admin)
    if current_user["did"] != did:
        from app.services.blockchain.access_service import AccessService
        access_svc = AccessService()
        if not await access_svc.verify_manager_role(current_user["did"]):
            raise HTTPException(status_code=403, detail="Can only check your own access")

    access_service = AccessService()

    has_access = await access_service.check_access(
        did=did,
        resource_id=resource_id,
        action=action,
    )

    return AccessCheckResponse(
        did=did,
        resource_id=resource_id,
        action=action,
        granted=has_access,
    )


@router.get("/logs", response_model=AccessLogsResponse)
async def get_access_logs(
    did: str = Query(None),
    resource_id: str = Query(None),
    limit: int = Query(100, le=500),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get access logs (audit trail)."""

    audit_service = AuditService(db)
    logs = await audit_service.get_logs(
        did=did,
        resource_id=resource_id,
        limit=limit,
    )

    return AccessLogsResponse(
        logs=[
            AccessLogEntry(
                id=str(log.id),
                did=log.did,
                resource_id=log.resource_id,
                action=log.action,
                granted=log.granted,
                reason=log.reason,
                timestamp=log.timestamp.isoformat() if log.timestamp else "",
                tx_hash=log.tx_hash,
            )
            for log in logs
        ],
        count=len(logs),
    )
