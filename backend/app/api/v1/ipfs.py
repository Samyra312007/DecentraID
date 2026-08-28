"""
IPFS API endpoints — upload and retrieve documents from IPFS.
Documents are content-addressed and verifiable.
"""

import io
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import hash_document
from app.services.ipfs_service import IPFSService
from app.services.auth_service import get_current_user
from app.models.asset import Asset

router = APIRouter()


@router.post("/upload")
async def upload_to_ipfs(
    file: UploadFile = File(...),
    asset_type: str = Query(default="document", description="Type of document"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a document to IPFS.
    Returns the CID (Content Identifier) and document hash.
    """
    content = await file.read()

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    if len(content) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    ipfs_service = IPFSService()

    upload_result = await ipfs_service.upload_document(content, {
        "asset_type": asset_type,
        "uploaded_by": current_user["did"],
        "filename": file.filename,
        "content_type": file.content_type or "application/octet-stream",
    })

    return {
        "cid": upload_result["cid"],
        "metadata_cid": upload_result["metadata_cid"],
        "document_hash": upload_result["document_hash"],
        "size": upload_result["size"],
        "filename": file.filename,
    }


@router.get("/{cid}")
async def retrieve_from_ipfs(cid: str):
    """
    Retrieve a document from IPFS by its CID.
    Returns the raw document content.
    """
    ipfs_service = IPFSService()

    try:
        content = await ipfs_service.retrieve_document(cid)
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"Document not found on IPFS: {cid}",
        )

    from fastapi.responses import Response
    return Response(
        content=content,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"inline; filename={cid}"},
    )


@router.get("/{cid}/info")
async def get_ipfs_info(cid: str):
    """Get information about an IPFS document."""
    ipfs_service = IPFSService()

    info = await ipfs_service.get_document_info(cid)

    if not info:
        raise HTTPException(
            status_code=404,
            detail=f"Document info not available: {cid}",
        )

    return info
