"""
Auth API endpoint — wallet signature based authentication.
Users sign a message with their Ethereum wallet to authenticate.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from web3 import Web3

from app.services.auth_service import create_access_token
from app.core.constants import DID_PREFIX

router = APIRouter()


class LoginRequest(BaseModel):
    """Login request with wallet address and signature."""
    address: str = Field(..., description="Ethereum wallet address")
    signature: str = Field(..., description="Signed message")


class LoginResponse(BaseModel):
    """Login response with JWT token."""
    access_token: str
    token_type: str = "bearer"
    did: str
    address: str


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Authenticate with wallet signature.
    User signs 'Authenticate with DecentraID' and submits the signature.
    """
    # Verify the signature
    message = "Authenticate with DecentraID"

    try:
        recovered_address = Web3().eth.account.recover_message(
            {"message": message, "signature": request.signature}
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Check recovered address matches provided address
    if recovered_address.lower() != request.address.lower():
        raise HTTPException(status_code=401, detail="Signature does not match address")

    # Generate DID from address
    did = f"{DID_PREFIX}:{request.address}"

    # Create JWT token
    access_token = create_access_token(did=did, address=request.address)

    return LoginResponse(
        access_token=access_token,
        did=did,
        address=request.address,
    )
