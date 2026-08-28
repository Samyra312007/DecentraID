"""
Pydantic schemas for NFT Asset operations.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AssetMintRequest(BaseModel):
    """Request to mint a new digital asset as NFT."""
    asset_type: str = Field(..., description="Type of asset (certificate, license, etc.)")
    jurisdiction: str = Field(default="India", description="Jurisdiction of the asset")
    expires_at: Optional[int] = Field(None, description="Expiration timestamp (0 = no expiry)")


class AssetMetadata(BaseModel):
    """On-chain asset metadata."""
    assetType: str
    issuerDID: str
    ownerDID: str
    issuedAt: int
    expiresAt: int
    ipfsHash: str
    documentHash: str
    status: str
    jurisdiction: str


class AssetResponse(BaseModel):
    """Response for asset operations."""
    id: Optional[str] = None
    token_id: Optional[int] = None
    asset_type: str
    issuer_did: str
    owner_did: str
    ipfs_hash: str
    document_hash: str
    jurisdiction: str
    status: str
    tx_hash: Optional[str] = None
    created_at: Optional[datetime] = None


class AssetVerifyResponse(BaseModel):
    """Response for asset verification."""
    token_id: int
    valid: bool
    owner: str
    issuer: str
    status: str
    issued_at: int
    expires_at: int


class AssetTransferRequest(BaseModel):
    """Request to transfer asset ownership."""
    to_did: str = Field(..., description="Recipient DID")


class AssetListResponse(BaseModel):
    """Response for listing assets."""
    assets: list[AssetResponse]
    total: int
