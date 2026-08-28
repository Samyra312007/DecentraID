"""
Pydantic schemas for Anomaly Detection operations.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AnomalyAlertResponse(BaseModel):
    """Response for anomaly alert."""
    id: str
    user_did: str
    risk_score: float
    severity: str
    anomaly_type: str
    description: Optional[str] = None
    acknowledged: bool = False
    created_at: Optional[datetime] = None


class BehaviorPattern(BaseModel):
    """User behavior pattern."""
    first_seen: Optional[datetime] = None
    last_updated: Optional[datetime] = None
    total_events: int = 0
    sample_count: int = 0


class AnomalyDashboardResponse(BaseModel):
    """Response for anomaly dashboard."""
    risk_score: float
    alerts: list[AnomalyAlertResponse]
    behavior_patterns: BehaviorPattern
    monitoring_since: Optional[datetime] = None
    total_access_events: int = 0


class AnomalyAlertListResponse(BaseModel):
    """Response for listing anomaly alerts."""
    alerts: list[AnomalyAlertResponse]
    count: int


class AnomalyAcknowledgeResponse(BaseModel):
    """Response for acknowledging an alert."""
    status: str = "acknowledged"
