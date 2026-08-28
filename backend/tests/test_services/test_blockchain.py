"""
Tests for blockchain service layer.
"""

import pytest
from unittest.mock import patch, MagicMock


class TestWeb3Client:
    """Test suite for Web3Client singleton."""

    def test_singleton_pattern(self):
        """Web3Client should follow singleton pattern."""
        from app.services.blockchain.web3_client import Web3Client

        # Reset singleton for test
        Web3Client._instance = None
        Web3Client._initialized = False

        client1 = Web3Client()
        client2 = Web3Client()

        assert client1 is client2

        # Cleanup
        Web3Client._instance = None
        Web3Client._initialized = False


class TestIdentityService:
    """Test suite for IdentityService."""

    def test_service_initialization(self):
        """IdentityService should initialize with Web3Client."""
        from app.services.blockchain.identity_service import IdentityService

        service = IdentityService()
        assert service.client is not None


class TestAccessService:
    """Test suite for AccessService."""

    def test_service_initialization(self):
        """AccessService should initialize with Web3Client."""
        from app.services.blockchain.access_service import AccessService

        service = AccessService()
        assert service.client is not None


class TestAssetService:
    """Test suite for AssetService."""

    def test_service_initialization(self):
        """AssetService should initialize with Web3Client."""
        from app.services.blockchain.asset_service import AssetService

        service = AssetService()
        assert service.client is not None


class TestSecurityModule:
    """Test suite for security module."""

    def test_hash_document(self):
        """Document hashing should produce consistent results."""
        from app.core.security import hash_document

        content = b"test document content"
        hash1 = hash_document(content)
        hash2 = hash_document(content)

        assert hash1 == hash2
        assert len(hash1) == 64  # SHA-256 hex length

    def test_hash_document_different_content(self):
        """Different content should produce different hashes."""
        from app.core.security import hash_document

        hash1 = hash_document(b"content 1")
        hash2 = hash_document(b"content 2")

        assert hash1 != hash2


class TestConstants:
    """Test suite for application constants."""

    def test_did_prefix(self):
        """DID prefix should be correct."""
        from app.core.constants import DID_PREFIX
        assert DID_PREFIX == "did:decentraid"

    def test_asset_types(self):
        """Asset types should be defined."""
        from app.core.constants import (
            ASSET_TYPE_CERTIFICATE,
            ASSET_TYPE_LICENSE,
            ASSET_TYPE_DEGREE,
        )
        assert ASSET_TYPE_CERTIFICATE == "certificate"
        assert ASSET_TYPE_LICENSE == "license"
        assert ASSET_TYPE_DEGREE == "degree"


class TestValidators:
    """Test suite for input validators."""

    def test_validate_ethereum_address_valid(self):
        """Valid Ethereum addresses should pass validation."""
        from app.utils.validators import validate_ethereum_address

        assert validate_ethereum_address("0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18")
        assert validate_ethereum_address("0x0000000000000000000000000000000000000000")

    def test_validate_ethereum_address_invalid(self):
        """Invalid Ethereum addresses should fail validation."""
        from app.utils.validators import validate_ethereum_address

        assert not validate_ethereum_address("not-an-address")
        assert not validate_ethereum_address("0x123")
        assert not validate_ethereum_address("")

    def test_validate_did_format(self):
        """Valid DID format should pass validation."""
        from app.utils.validators import validate_did_format

        assert validate_did_format(
            "did:decentraid:0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
        )

    def test_validate_did_format_invalid(self):
        """Invalid DID format should fail validation."""
        from app.utils.validators import validate_did_format

        assert not validate_did_format("invalid-did")
        assert not validate_did_format("did:other:0x123")


class TestDIDUtils:
    """Test suite for DID utility functions."""

    def test_generate_did(self):
        """DID generation should follow the correct format."""
        from app.utils.did_utils import generate_did_from_address

        address = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
        did = generate_did_from_address(address)

        assert did == f"did:decentraid:{address}"

    def test_extract_address(self):
        """Address extraction from DID should work correctly."""
        from app.utils.did_utils import extract_address_from_did

        address = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
        did = f"did:decentraid:{address}"

        assert extract_address_from_did(did) == address
