"""
Pydantic schemas for DID (Decentralized Identity) operations.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class DIDCreateRequest(BaseModel):
    """Request to create a new DID."""
    public_key: str = Field(
        ...,
        description="Public key for the DID",
        min_length=1,
        max_length=512,
    )
    metadata: dict = Field(default_factory=dict, description="Optional DID metadata")

    # Prevent excessively large metadata payloads
    def model_post_init(self, __context) -> None:
        import json
        if len(json.dumps(self.metadata, default=str)) > 10_000:
            raise ValueError("Metadata payload too large (max 10KB)")


class DIDUpdateRequest(BaseModel):
    """Request to update DID metadata."""
    metadata: dict = Field(..., description="Updated metadata")

    def model_post_init(self, __context) -> None:
        import json
        if len(json.dumps(self.metadata, default=str)) > 10_000:
            raise ValueError("Metadata payload too large (max 10KB)")


class VerificationMethod(BaseModel):
    """DID verification method."""
    id: str
    type: str
    controller: str
    publicKeyMultibase: str


class DIDDocument(BaseModel):
    """DID Document returned by the API."""
    id: str = Field(..., description="DID identifier (did:decentraid:...)")
    controller: str = Field(..., description="Controller Ethereum address")
    verificationMethod: list[VerificationMethod] = Field(default_factory=list)
    authentication: list[str] = Field(default_factory=list)
    assertionMethod: list[str] = Field(default_factory=list)
    created: str
    updated: str
    status: str = Field(..., description="DID status: active, suspended, deactivated")


class DIDResponse(BaseModel):
    """Response for DID operations."""
    did: str
    document: Optional[DIDDocument] = None
    created: Optional[datetime] = None
    status: str
    tx_hash: Optional[str] = None


class DIDListResponse(BaseModel):
    """Response for listing DIDs."""
    dids: list[DIDResponse]
    total: int
