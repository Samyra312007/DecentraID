"""
Pydantic schemas for Policy operations.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class PolicyCreateRequest(BaseModel):
    """Request to create an access policy."""
    resource_type: str = Field(..., description="Resource type")
    action: str = Field(..., description="Allowed action")
    allowed_roles: list[str] = Field(..., description="Role IDs that are allowed")
    valid_until: Optional[int] = Field(None, description="Expiration timestamp (0 = never)")


class PolicyResponse(BaseModel):
    """Response for policy operations."""
    policy_id: str
    resource_type: str
    action: str
    allowed_roles: list[str]
    valid_until: Optional[int] = None
    active: bool
    created_at: Optional[datetime] = None


class PolicyListResponse(BaseModel):
    """Response for listing policies."""
    policies: list[PolicyResponse]
    total: int
