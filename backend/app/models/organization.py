"""
Organization and OrgMember models.
Organizations manage groups of DID holders with shared access policies.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Organization(Base):
    """Organization that groups DID holders."""

    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    admin_did: Mapped[str | None] = mapped_column(
        String(100), ForeignKey("did_documents.did"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    settings: Mapped[dict] = mapped_column(JSONB, server_default="{}")

    # Relationships
    members: Mapped[list["OrgMember"]] = relationship(
        "OrgMember", back_populates="organization", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Organization {self.name}>"


class OrgMember(Base):
    """Membership record linking a DID to an Organization."""

    __tablename__ = "org_members"
    __table_args__ = (
        UniqueConstraint("org_id", "did", name="uq_org_member"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False
    )
    did: Mapped[str] = mapped_column(
        String(100), ForeignKey("did_documents.did"), nullable=False
    )
    role: Mapped[str | None] = mapped_column(String(100), nullable=True)
    joined_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    attributes: Mapped[dict] = mapped_column(JSONB, server_default="{}")

    # Relationships
    organization: Mapped["Organization"] = relationship(
        "Organization", back_populates="members"
    )

    def __repr__(self) -> str:
        return f"<OrgMember {self.did} in {self.org_id}>"
