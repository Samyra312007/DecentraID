"""
Input validation utilities for DecentraID.
Provides comprehensive validation for all input types.
"""

import re
from typing import Any, Optional
from web3 import Web3


class InputValidator:
    """Validates user input for security and correctness."""

    # Ethereum address pattern
    ETH_ADDRESS_PATTERN = re.compile(r'^0x[0-9a-fA-F]{40}$')

    # DID pattern
    DID_PATTERN = re.compile(r'^did:decentraid:0x[0-9a-fA-F]{40}$')

    # Safe characters for names (alphanumeric, spaces, hyphens, underscores)
    SAFE_NAME_PATTERN = re.compile(r'^[a-zA-Z0-9\s\-_.]{1,100}$')

    @staticmethod
    def is_valid_eth_address(address: str) -> bool:
        """Validate Ethereum address format."""
        if not address or not isinstance(address, str):
            return False
        return bool(InputValidator.ETH_ADDRESS_PATTERN.match(address))

    @staticmethod
    def is_valid_did(did: str) -> bool:
        """Validate DID format."""
        if not did or not isinstance(did, str):
            return False
        return bool(InputValidator.DID_PATTERN.match(did))

    @staticmethod
    def is_safe_name(name: str) -> bool:
        """Validate name is safe (no special characters)."""
        if not name or not isinstance(name, str):
            return False
        return bool(InputValidator.SAFE_NAME_PATTERN.match(name))

    @staticmethod
    def validate_eth_address(address: str) -> tuple[bool, str]:
        """
        Validate Ethereum address and return error message if invalid.

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not address:
            return False, "Address is required"
        if not isinstance(address, str):
            return False, "Address must be a string"
        if not InputValidator.ETH_ADDRESS_PATTERN.match(address):
            return False, "Invalid Ethereum address format"
        if not Web3.is_address(address):
            return False, "Invalid Ethereum address"
        return True, ""

    @staticmethod
    def validate_did(did: str) -> tuple[bool, str]:
        """Validate DID format."""
        if not did:
            return False, "DID is required"
        if not isinstance(did, str):
            return False, "DID must be a string"
        if not InputValidator.DID_PATTERN.match(did):
            return False, "Invalid DID format (expected: did:decentraid:0x...)"
        return True, ""

    @staticmethod
    def validate_name(name: str, max_length: int = 100) -> tuple[bool, str]:
        """Validate name field."""
        if not name:
            return False, "Name is required"
        if not isinstance(name, str):
            return False, "Name must be a string"
        if len(name) > max_length:
            return False, f"Name must be {max_length} characters or less"
        if not InputValidator.SAFE_NAME_PATTERN.match(name):
            return False, "Name contains invalid characters"
        return True, ""

    @staticmethod
    def validate_description(description: str, max_length: int = 1000) -> tuple[bool, str]:
        """Validate description field."""
        if description and not isinstance(description, str):
            return False, "Description must be a string"
        if description and len(description) > max_length:
            return False, f"Description must be {max_length} characters or less"
        return True, ""

    @staticmethod
    def validate_action(action: str) -> tuple[bool, str]:
        """Validate action field."""
        valid_actions = ["read", "write", "delete", "share", "admin", "authenticate"]
        if not action:
            return False, "Action is required"
        if action not in valid_actions:
            return False, f"Invalid action. Must be one of: {', '.join(valid_actions)}"
        return True, ""

    @staticmethod
    def validate_resource_type(resource_type: str) -> tuple[bool, str]:
        """Validate resource type field."""
        valid_types = ["did", "asset", "document", "policy", "all"]
        if not resource_type:
            return False, "Resource type is required"
        if resource_type not in valid_types:
            return False, f"Invalid resource type. Must be one of: {', '.join(valid_types)}"
        return True, ""

    @staticmethod
    def validate_ip_address(ip: str) -> tuple[bool, str]:
        """Validate IP address format."""
        if not ip:
            return False, "IP address is required"

        # IPv4 pattern
        ipv4_pattern = re.compile(
            r'^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}'
            r'(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
        )

        if ipv4_pattern.match(ip):
            return True, ""

        # Basic IPv6 check
        if ':' in ip:
            return True, ""  # Simplified IPv6 validation

        return False, "Invalid IP address format"

    @staticmethod
    def validate_file_size(size: int, max_size_mb: int = 10) -> tuple[bool, str]:
        """Validate file size."""
        max_bytes = max_size_mb * 1024 * 1024
        if size > max_bytes:
            return False, f"File size exceeds maximum of {max_size_mb}MB"
        return True, ""

    @staticmethod
    def validate_content_type(content_type: str) -> tuple[bool, str]:
        """Validate content type."""
        allowed_types = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/gif",
            "text/plain",
            "application/json",
        ]
        if content_type and content_type not in allowed_types:
            return False, f"Content type not allowed: {content_type}"
        return True, ""

    @staticmethod
    def sanitize_string(value: str) -> str:
        """Sanitize string input."""
        if not isinstance(value, str):
            return value
        # Remove null bytes
        value = value.replace('\x00', '')
        # Strip whitespace
        value = value.strip()
        return value

    @staticmethod
    def validate_pagination(
        offset: int = 0,
        limit: int = 100,
        max_limit: int = 1000
    ) -> tuple[bool, str, int, int]:
        """Validate pagination parameters."""
        if offset < 0:
            return False, "Offset must be non-negative", 0, 100
        if limit < 1:
            return False, "Limit must be positive", 0, 100
        if limit > max_limit:
            limit = max_limit
        return True, "", offset, limit


# Convenience functions
def validate_did_input(data: dict) -> dict:
    """Validate DID creation/update input."""
    errors = []

    if "public_key" in data:
        valid, msg = InputValidator.validate_eth_address(data["public_key"])
        if not valid:
            errors.append(f"public_key: {msg}")

    if "metadata" in data and isinstance(data["metadata"], dict):
        if "name" in data["metadata"]:
            valid, msg = InputValidator.validate_name(data["metadata"]["name"])
            if not valid:
                errors.append(f"metadata.name: {msg}")

    return {"valid": len(errors) == 0, "errors": errors}


def validate_asset_input(data: dict) -> dict:
    """Validate asset creation input."""
    errors = []

    if "asset_type" in data:
        valid_types = ["credential", "certificate", "license", "document"]
        if data["asset_type"] not in valid_types:
            errors.append(f"asset_type must be one of: {', '.join(valid_types)}")

    if "jurisdiction" in data:
        valid, msg = InputValidator.validate_name(data["jurisdiction"], 10)
        if not valid:
            errors.append(f"jurisdiction: {msg}")

    return {"valid": len(errors) == 0, "errors": errors}


def validate_access_input(data: dict) -> dict:
    """Validate access request input."""
    errors = []

    if "resource_id" in data:
        if not data["resource_id"]:
            errors.append("resource_id is required")

    if "action" in data:
        valid, msg = InputValidator.validate_action(data["action"])
        if not valid:
            errors.append(f"action: {msg}")

    return {"valid": len(errors) == 0, "errors": errors}


# Legacy function aliases for backward compatibility
def validate_ethereum_address(address: str) -> bool:
    """Validate Ethereum address (legacy alias)."""
    valid, _ = InputValidator.validate_eth_address(address)
    return valid


def validate_did_format(did: str) -> bool:
    """Validate DID format (legacy alias)."""
    valid, _ = InputValidator.validate_did(did)
    return valid


def validate_asset_type(asset_type: str) -> bool:
    """Validate asset type (legacy alias)."""
    valid_types = ["certificate", "license", "degree", "credential", "document"]
    return asset_type in valid_types


def validate_action(action: str) -> bool:
    """Validate action (legacy alias)."""
    valid, _ = InputValidator.validate_action(action)
    return valid
