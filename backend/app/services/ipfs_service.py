"""
IPFS Service — manages document storage on IPFS.
Documents are content-addressed — the CID is derived from content.
"""

import hashlib
import json
import logging
from typing import Dict, Optional
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class IPFSService:
    """
    Manages document storage on IPFS.
    Uploads, retrieves, and verifies documents.
    """

    def __init__(self) -> None:
        self._client = None

    @property
    def client(self):
        """Lazy-load IPFS client."""
        if self._client is None:
            try:
                import ipfshttpclient
                self._client = ipfshttpclient.connect(settings.ipfs_api_url)
            except Exception as e:
                logger.warning(f"IPFS client not available: {e}")
                self._client = None
        return self._client

    async def upload_document(self, content: bytes, metadata: dict) -> Dict:
        """
        Upload document to IPFS.
        Returns CID, document hash, and metadata CID.
        """
        # Calculate document hash
        document_hash = hashlib.sha256(content).hexdigest()

        if not self.client:
            from app.config import get_settings
            _settings = get_settings()
            if not _settings.debug:
                raise RuntimeError(
                    "IPFS client not available and not in debug mode. "
                    "Configure IPFS_API_URL or run in debug mode for mock storage."
                )
            # Mock fallback for local development only
            return {
                "cid": f"QmMock{document_hash[:16]}",
                "metadata_cid": f"QmMockMeta{document_hash[:16]}",
                "document_hash": document_hash,
                "size": len(content),
            }

        # Upload document
        doc_cid = self.client.add_bytes(content)

        # Create and upload metadata
        metadata.update({
            "document_hash": document_hash,
            "document_cid": doc_cid,
            "content_type": metadata.get("content_type", "application/octet-stream"),
        })

        metadata_json = json.dumps(metadata).encode()
        metadata_cid = self.client.add_bytes(metadata_json)

        return {
            "cid": doc_cid,
            "metadata_cid": metadata_cid,
            "document_hash": document_hash,
            "size": len(content),
        }

    async def retrieve_document(self, cid: str) -> bytes:
        """Retrieve document from IPFS by CID."""
        if not self.client:
            raise ValueError("IPFS client not available")

        return self.client.cat(cid)

    async def verify_content(self, cid: str, expected_hash: str) -> bool:
        """Verify IPFS content matches expected hash."""
        content = await self.retrieve_document(cid)
        actual_hash = hashlib.sha256(content).hexdigest()
        return actual_hash == expected_hash

    async def pin_document(self, cid: str) -> None:
        """Pin document to ensure availability."""
        if self.client:
            self.client.pin.add(cid)

    async def get_document_info(self, cid: str) -> Optional[Dict]:
        """Get document info from IPFS."""
        if not self.client:
            return None

        try:
            info = self.client.object.stat(cid)
            return {
                "cid": cid,
                "size": info["CumulativeSize"],
                "links": info["Links"],
            }
        except Exception:
            return None
