"""
Custom exception classes for the DecentraID application.
Provides structured error handling across the backend.
"""

from fastapi import HTTPException, status


class DecentraIDException(Exception):
    """Base exception for DecentraID application."""
    pass


class DIDNotFoundException(DecentraIDException):
    """Raised when a DID is not found."""
    pass


class DIDAlreadyExistsException(DecentraIDException):
    """Raised when attempting to create a DID that already exists."""
    pass


class DIDNotActiveException(DecentraIDException):
    """Raised when attempting operations on an inactive DID."""
    pass


class UnauthorizedException(DecentraIDException):
    """Raised when user is not authorized for the operation."""
    pass


class AssetNotFoundException(DecentraIDException):
    """Raised when an asset is not found."""
    pass


class AssetNotActiveException(DecentraIDException):
    """Raised when attempting operations on an inactive asset."""
    pass


class AccessDeniedException(DecentraIDException):
    """Raised when access check fails."""
    pass


class BlockchainException(DecentraIDException):
    """Raised when a blockchain operation fails."""
    pass


class IPFSException(DecentraIDException):
    """Raised when an IPFS operation fails."""
    pass


class ValidationException(DecentraIDException):
    """Raised when input validation fails."""
    pass


def did_not_found(did: str) -> HTTPException:
    """Return HTTP 404 for DID not found."""
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"DID not found: {did}"
    )


def did_already_exists(did: str) -> HTTPException:
    """Return HTTP 400 for duplicate DID."""
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"DID already exists: {did}"
    )


def unauthorized(message: str = "Not authorized") -> HTTPException:
    """Return HTTP 403 for unauthorized access."""
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=message
    )


def bad_request(message: str) -> HTTPException:
    """Return HTTP 400 for bad request."""
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=message
    )


def internal_error(message: str = "Internal server error") -> HTTPException:
    """Return HTTP 500 for internal errors."""
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=message
    )
