"""
DID Document model — stores off-chain DID metadata.
The on-chain state lives in the DecentraIDIdentity smart contract.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class DIDDocument(Base):
    """Decentralized Identity Document stored off-chain."""

    __tablename__ = "did_documents"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    did: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    address: Mapped[str] = mapped_column(
        String(42), unique=True, nullable=False, index=True
    )
    public_key: Mapped[str] = mapped_column(Text, nullable=False)
    encrypted_private_key: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    did_metadata: Mapped[dict] = mapped_column("metadata", JSONB, server_default="{}")
    status: Mapped[str] = mapped_column(String(20), server_default="active")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )
    tx_hash: Mapped[str | None] = mapped_column(String(66), nullable=True)

    def __repr__(self) -> str:
        return f"<DIDDocument {self.did}>"
