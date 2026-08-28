"""
Input validation utilities.
"""

import re
from typing import Optional
from app.core.constants import (
    ASSET_TYPE_CERTIFICATE,
    ASSET_TYPE_LICENSE,
    ASSET_TYPE_DEGREE,
    ASSET_TYPE_PASSPORT,
    ASSET_TYPE_ID_CARD,
)

VALID_ASSET_TYPES = {
    ASSET_TYPE_CERTIFICATE,
    ASSET_TYPE_LICENSE,
    ASSET_TYPE_DEGREE,
    ASSET_TYPE_PASSPORT,
    ASSET_TYPE_ID_CARD,
}

VALID_ACTIONS = {"read", "write", "delete", "approve"}


def validate_ethereum_address(address: str) -> bool:
    """Validate an Ethereum address format."""
    return bool(re.match(r"^0x[0-9a-fA-F]{40}$", address))


def validate_asset_type(asset_type: str) -> bool:
    """Validate an asset type."""
    return asset_type in VALID_ASSET_TYPES


def validate_action(action: str) -> bool:
    """Validate an access action."""
    return action in VALID_ACTIONS


def validate_did_format(did: str) -> bool:
    """Validate DID format: did:decentraid:0x..."""
    return bool(re.match(r"^did:decentraid:0x[0-9a-fA-F]{40}$", did))


def validate_ipfs_hash(ipfs_hash: str) -> bool:
    """Validate an IPFS hash format (CIDv0 or CIDv1)."""
    # CIDv0: starts with Qm
    # CIDv1: starts with b
    return bool(re.match(r"^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Z2-7]{58})$", ipfs_hash))
