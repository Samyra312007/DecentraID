"""
AnomalyService — orchestrates anomaly detection operations.
Communicates with the ML service and queries the database.
"""

import logging
from datetime import datetime
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.anomaly_alert import AnomalyAlert
from app.models.behavior_profile import BehaviorProfile
from app.models.access_log import AccessLog

logger = logging.getLogger(__name__)


class AnomalyService:
    """Orchestrates anomaly detection operations."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_recent_alerts(
        self, user_did: str, limit: int = 50
    ) -> list[AnomalyAlert]:
        """Get recent anomaly alerts for a user."""
        query = (
            select(AnomalyAlert)
            .where(AnomalyAlert.user_did == user_did)
            .order_by(AnomalyAlert.created_at.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_alerts(
        self, severity: Optional[str] = None, limit: int = 100
    ) -> list[AnomalyAlert]:
        """Get filtered anomaly alerts."""
        query = select(AnomalyAlert)

        if severity:
            query = query.where(AnomalyAlert.severity == severity)

        query = query.order_by(AnomalyAlert.created_at.desc()).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def calculate_risk_score(self, user_did: str) -> float:
        """Calculate current risk score for a user."""
        query = (
            select(func.max(AnomalyAlert.risk_score))
            .where(AnomalyAlert.user_did == user_did)
            .where(
                AnomalyAlert.created_at > func.now() - func.interval("24 hours")
            )
        )
        result = await self.db.execute(query)
        max_score = result.scalar()
        return float(max_score) if max_score else 0.0

    async def get_behavior_patterns(self, user_did: str) -> dict:
        """Get behavior pattern data for a user."""
        query = select(BehaviorProfile).where(
            BehaviorProfile.user_did == user_did
        )
        result = await self.db.execute(query)
        profile = result.scalar_one_or_none()

        if not profile:
            return {
                "first_seen": None,
                "last_updated": None,
                "total_events": 0,
                "sample_count": 0,
            }

        # Count total access events
        count_query = (
            select(func.count(AccessLog.id))
            .where(AccessLog.did == user_did)
        )
        count_result = await self.db.execute(count_query)
        total_events = count_result.scalar() or 0

        return {
            "first_seen": profile.first_seen,
            "last_updated": profile.last_updated,
            "total_events": total_events,
            "sample_count": profile.sample_count,
        }

    async def acknowledge_alert(
        self, alert_id: str, acknowledged_by: str
    ) -> None:
        """Acknowledge an anomaly alert."""
        query = select(AnomalyAlert).where(AnomalyAlert.id == alert_id)
        result = await self.db.execute(query)
        alert = result.scalar_one_or_none()

        if alert:
            alert.acknowledged = True
            alert.acknowledged_by = acknowledged_by
            await self.db.flush()

    async def get_profile(self, user_did: str) -> Optional[BehaviorProfile]:
        """Get the behavioral profile for a user."""
        query = select(BehaviorProfile).where(
            BehaviorProfile.user_did == user_did
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
