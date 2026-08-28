"""
Asset model — stores off-chain metadata for minted NFT assets.
The on-chain state lives in the DecentraIDAssets smart contract.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Asset(Base):
    """Digital asset metadata stored off-chain."""

    __tablename__ = "assets"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    token_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    issuer_did: Mapped[str] = mapped_column(
        String(100), ForeignKey("did_documents.did"), nullable=False, index=True
    )
    owner_did: Mapped[str] = mapped_column(
        String(100), ForeignKey("did_documents.did"), nullable=False, index=True
    )
    asset_type: Mapped[str] = mapped_column(String(50), nullable=False)
    ipfs_hash: Mapped[str] = mapped_column(String(100), nullable=False)
    document_hash: Mapped[str] = mapped_column(String(66), nullable=False)
    metadata_uri: Mapped[str | None] = mapped_column(String(500), nullable=True)
    jurisdiction: Mapped[str] = mapped_column(String(50), server_default="India")
    status: Mapped[str] = mapped_column(String(20), server_default="active")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    tx_hash: Mapped[str | None] = mapped_column(String(66), nullable=True)

    def __repr__(self) -> str:
        return f"<Asset token={self.token_id} type={self.asset_type}>"
