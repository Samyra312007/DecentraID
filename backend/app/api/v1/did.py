"""
DID API endpoints — CRUD operations for Decentralized Identifiers.
"""

from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.database import get_db
from app.core.security import hash_public_key, hash_metadata
from app.core.constants import DID_PREFIX
from app.core.exceptions import did_not_found, did_already_exists, bad_request
from app.schemas.did import DIDCreateRequest, DIDResponse, DIDUpdateRequest, DIDDocument, VerificationMethod
from app.services.blockchain.identity_service import IdentityService
from app.services.auth_service import get_current_user
from app.models.did import DIDDocument as DIDDocumentModel

router = APIRouter()


def derive_address_from_pk(public_key: str) -> str:
    """Derive Ethereum address from public key."""
    from web3 import Web3
    account = Web3().eth.account.from_key(public_key)
    return account.address


@router.post("/create", response_model=DIDResponse)
async def create_did(
    request: DIDCreateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Create a new decentralized identity on Polygon."""

    identity_service = IdentityService()

    # Derive address and DID
    try:
        address = derive_address_from_pk(request.public_key)
    except Exception as e:
        raise bad_request(f"Invalid public key: {str(e)}")

    did = f"{DID_PREFIX}:{address}"

    # Check if DID already exists
    existing = await db.execute(
        select(DIDDocumentModel).where(DIDDocumentModel.did == did)
    )
    if existing.scalar_one_or_none():
        raise did_already_exists(did)

    # Hash public key for on-chain storage
    pk_hash = hash_public_key(request.public_key)
    metadata_hash = hash_metadata(request.metadata)

    # Register on blockchain
    tx_hash = await identity_service.create_did(pk_hash, metadata_hash)

    # Store off-chain metadata
    did_record = DIDDocumentModel(
        did=did,
        address=address,
        public_key=request.public_key,
        did_metadata=request.metadata,
        status="active",
        tx_hash=tx_hash,
    )
    db.add(did_record)
    await db.flush()

    # Build response
    document = DIDDocument(
        id=did,
        controller=address,
        verificationMethod=[
            VerificationMethod(
                id=f"{did}#key-1",
                type="EcdsaSecp256k1VerificationKey2019",
                controller=did,
                publicKeyMultibase=request.public_key,
            )
        ],
        authentication=[f"{did}#key-1"],
        assertionMethod=[f"{did}#key-1"],
        created=did_record.created_at.isoformat(),
        updated=did_record.updated_at.isoformat(),
        status="active",
    )

    return DIDResponse(
        did=did,
        document=document,
        created=did_record.created_at,
        status="active",
        tx_hash=tx_hash,
    )


@router.get("/{did}", response_model=DIDResponse)
async def resolve_did(did: str, db: AsyncSession = Depends(get_db)):
    """Resolve a DID to its document."""

    identity_service = IdentityService()

    # Try on-chain resolution first
    on_chain_doc = await identity_service.resolve_did(did)

    # Also get off-chain data
    result = await db.execute(
        select(DIDDocumentModel).where(DIDDocumentModel.did == did)
    )
    did_record = result.scalar_one_or_none()

    if not did_record:
        raise did_not_found(did)

    status = on_chain_doc["status"].lower() if on_chain_doc else did_record.status

    document = DIDDocument(
        id=did,
        controller=did_record.address,
        verificationMethod=[
            VerificationMethod(
                id=f"{did}#key-1",
                type="EcdsaSecp256k1VerificationKey2019",
                controller=did,
                publicKeyMultibase=did_record.public_key,
            )
        ],
        authentication=[f"{did}#key-1"],
        assertionMethod=[f"{did}#key-1"],
        created=did_record.created_at.isoformat(),
        updated=did_record.updated_at.isoformat(),
        status=status,
    )

    return DIDResponse(
        did=did,
        document=document,
        created=did_record.created_at,
        status=status,
        tx_hash=did_record.tx_hash,
    )


@router.put("/{did}")
async def update_did(
    did: str,
    request: DIDUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update DID metadata."""

    if current_user["did"] != did:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not DID controller")

    identity_service = IdentityService()
    new_metadata_hash = hash_metadata(request.metadata)

    tx_hash = await identity_service.update_did(new_metadata_hash)

    # Update off-chain record
    await db.execute(
        update(DIDDocumentModel)
        .where(DIDDocumentModel.did == did)
        .values(did_metadata=request.metadata, tx_hash=tx_hash)
    )

    return {"tx_hash": tx_hash, "status": "updated"}
