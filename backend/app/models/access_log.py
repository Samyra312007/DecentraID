"""
AccessLog model — immutable audit trail for all access events.
Every access check, grant, and denial is logged here.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Text, DateTime, Index, func
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class AccessLog(Base):
    """Immutable audit log for access control events."""

    __tablename__ = "access_logs"
    __table_args__ = (
        Index("idx_access_logs_did_time", "did", "timestamp"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    did: Mapped[str] = mapped_column(
        String(100), nullable=False, index=True
    )
    resource_id: Mapped[str] = mapped_column(String(100), nullable=False)
    action: Mapped[str] = mapped_column(String(50), nullable=False)
    granted: Mapped[bool] = mapped_column(Boolean, nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    request_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    tx_hash: Mapped[str | None] = mapped_column(String(66), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), index=True
    )
    ip_address: Mapped[str | None] = mapped_column(INET, nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<AccessLog did={self.did} action={self.action} granted={self.granted}>"
