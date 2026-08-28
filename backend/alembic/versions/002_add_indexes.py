"""Add additional performance indexes for common query patterns.

Revision ID: 002
Revises: 001
Create Date: 2024-02-01
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ========== DID Documents ==========
    # Index for looking up DIDs by status
    op.create_index(
        "idx_did_documents_status",
        "did_documents",
        ["status"],
    )
    # Index for looking up DIDs by creation time
    op.create_index(
        "idx_did_documents_created",
        "did_documents",
        ["created_at"],
    )

    # ========== Organizations ==========
    # Index for looking up orgs by admin DID
    op.create_index(
        "idx_organizations_admin_did",
        "organizations",
        ["admin_did"],
    )

    # ========== Organization Members ==========
    # Index for looking up members by DID
    op.create_index(
        "idx_org_members_did",
        "org_members",
        ["did"],
    )
    # Composite index for org membership lookups
    op.create_index(
        "idx_org_members_org_role",
        "org_members",
        ["org_id", "role"],
    )

    # ========== Assets ==========
    # Index for looking up assets by issuer
    op.create_index(
        "idx_assets_issuer_did",
        "assets",
        ["issuer_did"],
    )
    # Index for looking up assets by IPFS hash
    op.create_index(
        "idx_assets_ipfs_hash",
        "assets",
        ["ipfs_hash"],
    )
    # Index for looking up assets by type
    op.create_index(
        "idx_assets_type",
        "assets",
        ["asset_type"],
    )
    # Index for looking up assets by token_id (for blockchain lookups)
    op.create_index(
        "idx_assets_token_id",
        "assets",
        ["token_id"],
    )

    # ========== Access Logs ==========
    # Index for looking up logs by action
    op.create_index(
        "idx_access_logs_action",
        "access_logs",
        ["action"],
    )
    # Index for looking up logs by resource
    op.create_index(
        "idx_access_logs_resource",
        "access_logs",
        ["resource_id"],
    )
    # Index for looking up logs by granted status
    op.create_index(
        "idx_access_logs_granted",
        "access_logs",
        ["granted"],
    )
    # Composite index for audit queries
    op.create_index(
        "idx_access_logs_did_action_time",
        "access_logs",
        ["did", "action", "timestamp"],
    )

    # ========== Anomaly Alerts ==========
    # Index for looking up alerts by severity
    op.create_index(
        "idx_anomaly_alerts_severity",
        "anomaly_alerts",
        ["severity"],
    )
    # Index for looking up alerts by anomaly type
    op.create_index(
        "idx_anomaly_alerts_type",
        "anomaly_alerts",
        ["anomaly_type"],
    )
    # Composite index for user-specific alert queries
    op.create_index(
        "idx_anomaly_alerts_user_time",
        "anomaly_alerts",
        ["user_did", "created_at"],
    )
    # Index for unacknowledged alerts
    op.create_index(
        "idx_anomaly_alerts_unack",
        "anomaly_alerts",
        ["acknowledged", "created_at"],
    )

    # ========== Behavior Profiles ==========
    # Index for looking up profiles by sample count
    op.create_index(
        "idx_behavior_profiles_samples",
        "behavior_profiles",
        ["sample_count"],
    )
    # Index for looking up profiles by last update time
    op.create_index(
        "idx_behavior_profiles_updated",
        "behavior_profiles",
        ["last_updated"],
    )


def downgrade() -> None:
    op.drop_index("idx_behavior_profiles_updated", table_name="behavior_profiles")
    op.drop_index("idx_behavior_profiles_samples", table_name="behavior_profiles")
    op.drop_index("idx_anomaly_alerts_unack", table_name="anomaly_alerts")
    op.drop_index("idx_anomaly_alerts_user_time", table_name="anomaly_alerts")
    op.drop_index("idx_anomaly_alerts_type", table_name="anomaly_alerts")
    op.drop_index("idx_anomaly_alerts_severity", table_name="anomaly_alerts")
    op.drop_index("idx_access_logs_did_action_time", table_name="access_logs")
    op.drop_index("idx_access_logs_granted", table_name="access_logs")
    op.drop_index("idx_access_logs_resource", table_name="access_logs")
    op.drop_index("idx_access_logs_action", table_name="access_logs")
    op.drop_index("idx_assets_token_id", table_name="assets")
    op.drop_index("idx_assets_type", table_name="assets")
    op.drop_index("idx_assets_ipfs_hash", table_name="assets")
    op.drop_index("idx_assets_issuer_did", table_name="assets")
    op.drop_index("idx_org_members_org_role", table_name="org_members")
    op.drop_index("idx_org_members_did", table_name="org_members")
    op.drop_index("idx_organizations_admin_did", table_name="organizations")
    op.drop_index("idx_did_documents_created", table_name="did_documents")
    op.drop_index("idx_did_documents_status", table_name="did_documents")
