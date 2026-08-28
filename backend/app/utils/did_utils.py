"""
DID utility functions — generation, parsing, and validation.
"""

from web3 import Web3
from app.core.constants import DID_PREFIX


def generate_did_from_address(address: str) -> str:
    """Generate a DID from an Ethereum address."""
    return f"{DID_PREFIX}:{address}"


def extract_address_from_did(did: str) -> str:
    """Extract the Ethereum address from a DID."""
    if not did.startswith(f"{DID_PREFIX}:"):
        raise ValueError(f"Invalid DID format: {did}")
    return did.split(":")[-1]


def is_valid_did(did: str) -> bool:
    """Validate a DID string format."""
    if not did.startswith(f"{DID_PREFIX}:"):
        return False
    address = did.split(":")[-1]
    try:
        Web3.to_checksum_address(address)
        return True
    except Exception:
        return False


def derive_address_from_public_key(public_key: str) -> str:
    """Derive Ethereum address from a private key hex string."""
    account = Web3().eth.account.from_key(public_key)
    return account.address
