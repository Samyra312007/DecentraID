"""
Anomaly Detection API endpoints — view alerts, dashboard, and behavior profiles.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.services.auth_service import get_current_user
from app.services.anomaly_service import AnomalyService
from app.schemas.anomaly import (
    AnomalyAlertResponse,
    AnomalyDashboardResponse,
    AnomalyAlertListResponse,
    AnomalyAcknowledgeResponse,
    BehaviorPattern,
)
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/dashboard", response_model=AnomalyDashboardResponse)
async def anomaly_dashboard(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get anomaly detection dashboard data."""

    anomaly_service = AnomalyService(db)

    alerts = await anomaly_service.get_recent_alerts(
        user_did=current_user["did"],
        limit=50,
    )

    risk_score = await anomaly_service.calculate_risk_score(
        user_did=current_user["did"],
    )

    patterns = await anomaly_service.get_behavior_patterns(
        user_did=current_user["did"],
    )

    return AnomalyDashboardResponse(
        risk_score=risk_score,
        alerts=[
            AnomalyAlertResponse(
                id=str(a.id),
                user_did=a.user_did,
                risk_score=a.risk_score,
                severity=a.severity,
                anomaly_type=a.anomaly_type,
                description=a.description,
                acknowledged=a.acknowledged,
                created_at=a.created_at,
            )
            for a in alerts
        ],
        behavior_patterns=BehaviorPattern(**patterns),
        monitoring_since=patterns.get("first_seen"),
        total_access_events=patterns.get("total_events", 0),
    )


@router.get("/alerts", response_model=AnomalyAlertListResponse)
async def get_alerts(
    severity: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get filtered anomaly alerts."""

    anomaly_service = AnomalyService(db)

    alerts = await anomaly_service.get_alerts(
        severity=severity,
        limit=limit,
    )

    return AnomalyAlertListResponse(
        alerts=[
            AnomalyAlertResponse(
                id=str(a.id),
                user_did=a.user_did,
                risk_score=a.risk_score,
                severity=a.severity,
                anomaly_type=a.anomaly_type,
                description=a.description,
                acknowledged=a.acknowledged,
                created_at=a.created_at,
            )
            for a in alerts
        ],
        count=len(alerts),
    )


@router.post("/alerts/{alert_id}/acknowledge", response_model=AnomalyAcknowledgeResponse)
async def acknowledge_alert(
    alert_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Acknowledge an anomaly alert."""

    anomaly_service = AnomalyService(db)

    await anomaly_service.acknowledge_alert(
        alert_id=alert_id,
        acknowledged_by=current_user["did"],
    )

    return AnomalyAcknowledgeResponse(status="acknowledged")


@router.get("/profile")
async def get_behavior_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user's behavioral profile."""

    anomaly_service = AnomalyService(db)

    profile = await anomaly_service.get_profile(
        user_did=current_user["did"],
    )

    if not profile:
        return {"message": "No profile yet", "user_did": current_user["did"]}

    return {
        "user_did": profile.user_did,
        "sample_count": profile.sample_count,
        "first_seen": profile.first_seen,
        "last_updated": profile.last_updated,
        "baseline_mean": profile.baseline_mean,
        "baseline_std": profile.baseline_std,
    }
