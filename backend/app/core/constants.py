"""
Application-wide constants.
"""

# DID prefix
DID_PREFIX = "did:decentraid"

# Roles
ROLE_ENGINEER = "Engineer"
ROLE_MANAGER = "Manager"
ROLE_ADMIN = "Admin"
ROLE_ISSUER = "Issuer"
ROLE_VIEWER = "Viewer"

# Asset types
ASSET_TYPE_CERTIFICATE = "certificate"
ASSET_TYPE_LICENSE = "license"
ASSET_TYPE_DEGREE = "degree"
ASSET_TYPE_PASSPORT = "passport"
ASSET_TYPE_ID_CARD = "id_card"

# Asset statuses
ASSET_STATUS_ACTIVE = "active"
ASSET_STATUS_REVOKED = "revoked"
ASSET_STATUS_TRANSFERRED = "transferred"
ASSET_STATUS_EXPIRED = "expired"

# DID statuses
DID_STATUS_ACTIVE = "active"
DID_STATUS_SUSPENDED = "suspended"
DID_STATUS_DEACTIVATED = "deactivated"

# Access control
ACCESS_ACTION_READ = "read"
ACCESS_ACTION_WRITE = "write"
ACCESS_ACTION_DELETE = "delete"
ACCESS_ACTION_APPROVE = "approve"

# Request statuses
REQUEST_STATUS_PENDING = 0
REQUEST_STATUS_APPROVED = 1
REQUEST_STATUS_DENIED = 2

# Anomaly severity levels
SEVERITY_NORMAL = "normal"
SEVERITY_LOW = "low"
SEVERITY_MEDIUM = "medium"
SEVERITY_HIGH = "high"
SEVERITY_CRITICAL = "critical"

# Rate limiting
RATE_LIMIT_PER_MINUTE = 60

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Blockchain
POLYGON_AMOY_CHAIN_ID = 80002
GAS_LIMIT_DEFAULT = 500000
