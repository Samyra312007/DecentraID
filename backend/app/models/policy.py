"""
Policy model — stores access control policies off-chain.
Policies define which roles can access which resources.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Policy(Base):
    """Access control policy."""

    __tablename__ = "policies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    policy_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False)
    action: Mapped[str] = mapped_column(String(50), nullable=False)
    allowed_roles: Mapped[dict] = mapped_column(JSONB, server_default="[]")
    conditions: Mapped[dict] = mapped_column(JSONB, server_default="[]")
    valid_until: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, server_default="true")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    created_by: Mapped[str | None] = mapped_column(String(100), nullable=True)

    def __repr__(self) -> str:
        return f"<Policy {self.policy_id} resource={self.resource_type}>"
