"""Initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ========== DID Documents ==========
    op.create_table(
        "did_documents",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("did", sa.String(100), unique=True, nullable=False, index=True),
        sa.Column("address", sa.String(42), unique=True, nullable=False, index=True),
        sa.Column("public_key", sa.Text, nullable=False),
        sa.Column("encrypted_private_key", JSONB, nullable=True),
        sa.Column("metadata", JSONB, server_default="{}"),
        sa.Column("status", sa.String(20), server_default="active"),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("tx_hash", sa.String(66), nullable=True),
    )

    # ========== Organizations ==========
    op.create_table(
        "organizations",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column(
            "admin_did",
            sa.String(100),
            sa.ForeignKey("did_documents.did"),
            nullable=True,
        ),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("settings", JSONB, server_default="{}"),
    )

    # ========== Organization Members ==========
    op.create_table(
        "org_members",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "org_id",
            UUID(as_uuid=True),
            sa.ForeignKey("organizations.id"),
            nullable=False,
        ),
        sa.Column(
            "did",
            sa.String(100),
            sa.ForeignKey("did_documents.did"),
            nullable=False,
        ),
        sa.Column("role", sa.String(100), nullable=True),
        sa.Column("joined_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("attributes", JSONB, server_default="{}"),
        sa.UniqueConstraint("org_id", "did", name="uq_org_member"),
    )

    # ========== Assets ==========
    op.create_table(
        "assets",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("token_id", sa.Integer, nullable=True),
        sa.Column(
            "issuer_did",
            sa.String(100),
            sa.ForeignKey("did_documents.did"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "owner_did",
            sa.String(100),
            sa.ForeignKey("did_documents.did"),
            nullable=False,
            index=True,
        ),
        sa.Column("asset_type", sa.String(50), nullable=False),
        sa.Column("ipfs_hash", sa.String(100), nullable=False),
        sa.Column("document_hash", sa.String(66), nullable=False),
        sa.Column("metadata_uri", sa.Text, nullable=True),
        sa.Column("jurisdiction", sa.String(50), server_default="India"),
        sa.Column("status", sa.String(20), server_default="active"),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("tx_hash", sa.String(66), nullable=True),
    )

    # ========== Access Logs ==========
    op.create_table(
        "access_logs",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("did", sa.String(100), nullable=False, index=True),
        sa.Column("resource_id", sa.String(100), nullable=False),
        sa.Column("action", sa.String(50), nullable=False),
        sa.Column("granted", sa.Boolean, nullable=False),
        sa.Column("reason", sa.Text, nullable=True),
        sa.Column("request_id", sa.String(100), nullable=True),
        sa.Column("tx_hash", sa.String(66), nullable=True),
        sa.Column(
            "timestamp",
            sa.DateTime,
            server_default=sa.func.now(),
            index=True,
        ),
        sa.Column("ip_address", INET, nullable=True),
        sa.Column("user_agent", sa.Text, nullable=True),
    )

    # ========== Anomaly Alerts ==========
    op.create_table(
        "anomaly_alerts",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("user_did", sa.String(100), nullable=False, index=True),
        sa.Column("risk_score", sa.Float, nullable=False),
        sa.Column("anomaly_type", sa.String(50), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column(
            "severity", sa.String(20), server_default="medium", index=True
        ),
        sa.Column("anomalous_features", JSONB, server_default="[]"),
        sa.Column("acknowledged", sa.Boolean, server_default="false"),
        sa.Column("acknowledged_by", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    # ========== Behavior Profiles ==========
    op.create_table(
        "behavior_profiles",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("user_did", sa.String(100), unique=True, nullable=False),
        sa.Column("feature_vector", sa.ARRAY(sa.Float), nullable=False),
        sa.Column("baseline_mean", sa.ARRAY(sa.Float), nullable=False),
        sa.Column("baseline_std", sa.ARRAY(sa.Float), nullable=False),
        sa.Column("sample_count", sa.Integer, server_default="0"),
        sa.Column("first_seen", sa.DateTime, nullable=True),
        sa.Column("last_updated", sa.DateTime, server_default=sa.func.now()),
    )

    # ========== Composite Indexes ==========
    op.create_index(
        "idx_access_logs_did_time",
        "access_logs",
        ["did", "timestamp"],
    )
    op.create_index(
        "idx_assets_owner_status",
        "assets",
        ["owner_did", "status"],
    )
    op.create_index(
        "idx_anomaly_time",
        "anomaly_alerts",
        ["created_at"],
    )


def downgrade() -> None:
    op.drop_table("behavior_profiles")
    op.drop_table("anomaly_alerts")
    op.drop_table("access_logs")
    op.drop_table("assets")
    op.drop_table("org_members")
    op.drop_table("organizations")
    op.drop_table("did_documents")
