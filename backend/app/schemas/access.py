"""
Pydantic schemas for Access Control operations.
"""

from typing import Optional
from pydantic import BaseModel, Field


class AccessRequestModel(BaseModel):
    """Request to access a resource."""
    resource_id: str = Field(..., description="Resource identifier")
    action: str = Field(..., description="Action to perform (read, write, delete)")
    reason: str = Field(default="", description="Reason for the request")


class AccessCheckResponse(BaseModel):
    """Response for access check."""
    did: str
    resource_id: str
    action: str
    granted: bool


class AccessLogEntry(BaseModel):
    """Access log entry."""
    id: str
    did: str
    resource_id: str
    action: str
    granted: bool
    reason: Optional[str] = None
    timestamp: str
    tx_hash: Optional[str] = None


class AccessLogsResponse(BaseModel):
    """Response for access logs."""
    logs: list[AccessLogEntry]
    count: int


class RoleCreateRequest(BaseModel):
    """Request to create a role."""
    name: str = Field(..., description="Role name")
    description: str = Field(default="", description="Role description")


class RoleAssignmentRequest(BaseModel):
    """Request to assign a role."""
    did: str = Field(..., description="DID to assign role to")
    role_id: str = Field(..., description="Role ID to assign")
