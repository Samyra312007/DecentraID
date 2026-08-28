"""
AuditService — records all access events to the database.
Provides an immutable audit trail for compliance and anomaly detection.
"""

import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.access_log import AccessLog

logger = logging.getLogger(__name__)


class AuditService:
    """Records access control events to the database."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def log_access(
        self,
        did: str,
        resource_id: str,
        action: str,
        granted: bool,
        reason: str = None,
        request_id: str = None,
        tx_hash: str = None,
        ip_address: str = None,
        user_agent: str = None,
    ) -> AccessLog:
        """
        Record an access event to the audit log.
        Returns the created log entry.
        """
        log_entry = AccessLog(
            did=did,
            resource_id=resource_id,
            action=action,
            granted=granted,
            reason=reason,
            request_id=request_id,
            tx_hash=tx_hash,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        self.db.add(log_entry)
        await self.db.flush()

        logger.info(f"Audit: {did} {action} on {resource_id} -> {'granted' if granted else 'denied'}")
        return log_entry

    async def get_logs(
        self,
        did: str = None,
        resource_id: str = None,
        limit: int = 100,
    ) -> list[AccessLog]:
        """
        Retrieve access logs with optional filters.
        """
        query = select(AccessLog)

        if did:
            query = query.where(AccessLog.did == did)
        if resource_id:
            query = query.where(AccessLog.resource_id == resource_id)

        query = query.order_by(AccessLog.timestamp.desc()).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())
