"""
Policy API endpoints — manage access control policies.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.schemas.policy import PolicyCreateRequest, PolicyResponse, PolicyListResponse
from app.services.auth_service import get_current_user
from app.services.blockchain.access_service import AccessService
from app.models.policy import Policy

router = APIRouter()


@router.post("/create", response_model=PolicyResponse)
async def create_policy(
    request: PolicyCreateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new access policy."""

    # Store policy off-chain
    policy_record = Policy(
        resource_type=request.resource_type,
        action=request.action,
        allowed_roles=request.allowed_roles,
        valid_until=None,
        active=True,
        created_by=current_user["did"],
    )
    db.add(policy_record)
    await db.flush()

    return PolicyResponse(
        policy_id=str(policy_record.id),
        resource_type=policy_record.resource_type,
        action=policy_record.action,
        allowed_roles=policy_record.allowed_roles,
        active=policy_record.active,
        created_at=policy_record.created_at,
    )


@router.get("/list", response_model=PolicyListResponse)
async def list_policies(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active policies."""

    result = await db.execute(
        select(Policy)
        .where(Policy.active == True)
        .order_by(Policy.created_at.desc())
    )
    policies = result.scalars().all()

    return PolicyListResponse(
        policies=[
            PolicyResponse(
                policy_id=str(p.id),
                resource_type=p.resource_type,
                action=p.action,
                allowed_roles=p.allowed_roles,
                valid_until=p.valid_until.timestamp() if p.valid_until else None,
                active=p.active,
                created_at=p.created_at,
            )
            for p in policies
        ],
        total=len(policies),
    )


@router.delete("/{policy_id}")
async def deactivate_policy(
    policy_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate a policy."""

    result = await db.execute(
        select(Policy).where(Policy.id == policy_id)
    )
    policy = result.scalar_one_or_none()

    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    policy.active = False
    await db.flush()

    return {"status": "deactivated", "policy_id": policy_id}
