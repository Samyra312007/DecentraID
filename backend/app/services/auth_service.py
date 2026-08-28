"""
JWT Authentication service.
Creates and verifies JWT tokens for user authentication.
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import get_settings

settings = get_settings()
security = HTTPBearer()


def create_access_token(did: str, address: str) -> str:
    """
    Create a JWT access token.
    Token contains DID as subject and wallet address.
    """
    expire = datetime.utcnow() + timedelta(hours=settings.jwt_expiration_hours)

    payload = {
        "sub": did,
        "address": address,
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def verify_token(token: str) -> dict:
    """
    Verify and decode a JWT token.
    Raises HTTPException if token is invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    FastAPI dependency that extracts the current user from JWT.
    Returns dict with 'did' and 'address' keys.
    """
    payload = verify_token(credentials.credentials)

    return {
        "did": payload["sub"],
        "address": payload["address"],
    }
