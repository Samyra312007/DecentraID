"""
BehaviorProfile model — stores behavioral baselines for each user.
Used by the AI/ML anomaly detection pipeline to detect deviations.
"""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class BehaviorProfile(Base):
    """Behavioral profile for ML-based anomaly detection."""

    __tablename__ = "behavior_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    user_did: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False
    )
    feature_vector: Mapped[list[float]] = mapped_column(
        ARRAY(float), nullable=False
    )
    baseline_mean: Mapped[list[float]] = mapped_column(
        ARRAY(float), nullable=False
    )
    baseline_std: Mapped[list[float]] = mapped_column(
        ARRAY(float), nullable=False
    )
    sample_count: Mapped[int] = mapped_column(
        Integer, server_default="0"
    )
    first_seen: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_updated: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<BehaviorProfile did={self.user_did} samples={self.sample_count}>"
