"""
Asset API endpoints — mint, transfer, and verify digital assets as NFTs.
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.database import get_db
from app.core.security import hash_document
from app.schemas.asset import AssetMintRequest, AssetResponse, AssetVerifyResponse, AssetListResponse
from app.services.blockchain.asset_service import AssetService
from app.services.blockchain.identity_service import IdentityService
from app.services.ipfs_service import IPFSService
from app.services.auth_service import get_current_user
from app.models.asset import Asset

router = APIRouter()


@router.post("/mint")
async def mint_asset(
    file: UploadFile = File(...),
    asset_type: str = Form(...),
    jurisdiction: str = Form(default="India"),
    expires_at: int = Form(default=0),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mint a new digital asset as an NFT."""

    # Verify caller is authorized issuer
    # (In production, check issuer role on-chain)

    # Upload document to IPFS
    ipfs_service = IPFSService()
    content = await file.read()
    document_hash = hash_document(content)

    upload_result = await ipfs_service.upload_document(content, {
        "asset_type": asset_type,
        "jurisdiction": jurisdiction,
        "uploaded_by": current_user["did"],
        "filename": file.filename,
    })

    # Mint NFT on blockchain
    asset_service = AssetService()
    tx_hash = await asset_service.mint_asset(
        to_address=current_user["address"],
        asset_type=asset_type,
        issuer_did=current_user["did"],
        ipfs_hash=upload_result["cid"],
        document_hash=document_hash,
        expires_at=expires_at,
        metadata_uri=f"ipfs://{upload_result['metadata_cid']}",
        jurisdiction=jurisdiction,
    )

    # Store off-chain metadata
    asset_record = Asset(
        issuer_did=current_user["did"],
        owner_did=current_user["did"],
        asset_type=asset_type,
        ipfs_hash=upload_result["cid"],
        document_hash=document_hash,
        metadata_uri=f"ipfs://{upload_result['metadata_cid']}",
        jurisdiction=jurisdiction,
        tx_hash=tx_hash,
    )
    db.add(asset_record)
    await db.flush()

    return {
        "tx_hash": tx_hash,
        "ipfs_hash": upload_result["cid"],
        "document_hash": document_hash,
        "status": "minted",
    }


@router.get("/list", response_model=AssetListResponse)
async def list_assets(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all assets owned by the current user."""

    result = await db.execute(
        select(Asset)
        .where(Asset.owner_did == current_user["did"])
        .order_by(Asset.created_at.desc())
    )
    assets = result.scalars().all()

    return AssetListResponse(
        assets=[
            AssetResponse(
                id=str(a.id),
                token_id=a.token_id,
                asset_type=a.asset_type,
                issuer_did=a.issuer_did,
                owner_did=a.owner_did,
                ipfs_hash=a.ipfs_hash,
                document_hash=a.document_hash,
                jurisdiction=a.jurisdiction,
                status=a.status,
                tx_hash=a.tx_hash,
                created_at=a.created_at,
            )
            for a in assets
        ],
        total=len(assets),
    )


@router.get("/{token_id}/verify")
async def verify_asset(token_id: int):
    """Verify asset authenticity on-chain."""

    asset_service = AssetService()
    valid, metadata = await asset_service.verify_asset(token_id)

    return AssetVerifyResponse(
        token_id=token_id,
        valid=valid,
        owner=metadata.get("ownerDID", ""),
        issuer=metadata.get("issuerDID", ""),
        status=metadata.get("status", "Unknown"),
        issued_at=metadata.get("issuedAt", 0),
        expires_at=metadata.get("expiresAt", 0),
    )


@router.post("/{token_id}/transfer")
async def transfer_asset(
    token_id: int,
    to_did: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Transfer asset ownership."""

    asset_service = AssetService()

    # Verify current owner
    owner = await asset_service.get_asset_owner(token_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Resolve recipient DID
    identity_service = IdentityService()
    recipient = await identity_service.resolve_did(to_did)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient DID not found")

    # Transfer on blockchain
    tx_hash = await asset_service.transfer_asset(
        token_id=token_id,
        to_address=recipient["controller"],
    )

    # Update off-chain records
    await db.execute(
        update(Asset)
        .where(Asset.token_id == token_id)
        .values(owner_did=to_did, status="transferred", tx_hash=tx_hash)
    )

    return {"tx_hash": tx_hash, "status": "transferred"}
