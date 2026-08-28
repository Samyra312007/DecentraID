"""
Cryptographic utilities for hashing and encryption.
Used for public key hashing, document hashing, and data encryption.
"""

import hashlib
from typing import Optional
from app.config import get_settings

settings = get_settings()


def hash_public_key(public_key: str) -> bytes:
    """
    Hash a public key for on-chain storage.
    Returns 32-byte keccak256 hash.
    """
    from web3 import Web3
    return Web3.keccak(text=public_key)


def hash_metadata(metadata: dict) -> bytes:
    """
    Hash metadata dictionary for on-chain storage.
    Returns 32-byte keccak256 hash.
    """
    import json
    from web3 import Web3
    metadata_str = json.dumps(metadata, sort_keys=True, default=str)
    return Web3.keccak(text=metadata_str)


def hash_document(content: bytes) -> str:
    """
    Hash document content using SHA-256.
    Returns hex-encoded hash string.
    """
    return hashlib.sha256(content).hexdigest()


def derive_address_from_public_key(public_key: str) -> str:
    """
    Derive Ethereum address from public key.
    Returns checksummed address.
    """
    from web3 import Web3
    account = Web3().eth.account.from_key(public_key)
    return account.address


def encrypt_data(data: str) -> bytes:
    """
    Encrypt data using AES-256-GCM with the configured encryption key.
    Returns encrypted bytes.
    """
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    import os

    key = hashlib.sha256(settings.encryption_key.encode()).digest()
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, data.encode(), None)
    return nonce + ciphertext


def decrypt_data(encrypted_data: bytes) -> str:
    """
    Decrypt AES-256-GCM encrypted data.
    Returns decrypted string.
    """
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM

    key = hashlib.sha256(settings.encryption_key.encode()).digest()
    nonce = encrypted_data[:12]
    ciphertext = encrypted_data[12:]
    aesgcm = AESGCM(key)
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return plaintext.decode()
