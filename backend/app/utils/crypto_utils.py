"""
Cryptographic utility functions — hashing, signing, encryption.
"""

import hashlib
import os
from typing import Optional
from web3 import Web3


def keccak256(data: str) -> bytes:
    """Compute keccak256 hash of a string."""
    return Web3.keccak(text=data)


def sha256(data: bytes) -> str:
    """Compute SHA-256 hash of bytes, return hex string."""
    return hashlib.sha256(data).hexdigest()


def generate_random_bytes(n: int) -> bytes:
    """Generate n random bytes."""
    return os.urandom(n)


def to_bytes32(data: str) -> bytes:
    """Convert a string to bytes32."""
    return Web3.keccak(text=data)


def from_bytes32(data: bytes) -> str:
    """Convert bytes32 to hex string."""
    return data.hex()
