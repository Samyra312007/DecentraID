"""
AssetService — manages NFT asset operations on the blockchain.
Wraps the DecentraIDAssets smart contract.
"""

from typing import Optional, Dict
from web3 import Web3
from app.services.blockchain.web3_client import Web3Client


class AssetService:
    """Service for NFT asset operations on the DecentraIDAssets contract."""

    def __init__(self) -> None:
        self.client = Web3Client()

    async def mint_asset(
        self,
        to_address: str,
        asset_type: str,
        issuer_did: str,
        ipfs_hash: str,
        document_hash: str,
        expires_at: int,
        metadata_uri: str,
        jurisdiction: str,
    ) -> str:
        """
        Mint a new digital asset as an NFT on-chain.
        Returns the transaction hash.
        """
        if not self.client.asset_contract:
            raise ValueError("Asset contract not deployed")

        asset_type_hash = Web3.keccak(text=asset_type)
        issuer_hash = Web3.keccak(text=issuer_did)
        ipfs_hash_bytes = Web3.keccak(text=ipfs_hash)
        doc_hash_bytes = bytes.fromhex(document_hash) if len(document_hash) == 64 else Web3.keccak(text=document_hash)

        contract_fn = self.client.asset_contract.functions.mintAsset(
            Web3.to_checksum_address(to_address),
            asset_type_hash,
            issuer_hash,
            ipfs_hash_bytes,
            doc_hash_bytes,
            expires_at,
            metadata_uri,
            jurisdiction,
        )
        tx_hash = self.client.send_transaction(contract_fn)
        return tx_hash

    async def verify_asset(self, token_id: int) -> tuple:
        """
        Verify an asset's authenticity on-chain.
        Returns (valid: bool, metadata: dict).
        """
        if not self.client.asset_contract:
            raise ValueError("Asset contract not deployed")

        try:
            result = self.client.asset_contract.functions.verifyAsset(token_id).call()

            valid = result[0]
            metadata = {
                "assetType": result[1].hex() if isinstance(result[1], bytes) else result[1],
                "issuerDID": result[2].hex() if isinstance(result[2], bytes) else result[2],
                "ownerDID": result[3].hex() if isinstance(result[3], bytes) else result[3],
                "issuedAt": result[4],
                "expiresAt": result[5],
                "ipfsHash": result[6].hex() if isinstance(result[6], bytes) else result[6],
                "documentHash": result[7].hex() if isinstance(result[7], bytes) else result[7],
                "status": ["Active", "Revoked", "Transferred", "Expired"][result[8]],
                "jurisdiction": result[9],
            }

            return valid, metadata
        except Exception:
            return False, {}

    async def transfer_asset(self, token_id: int, to_address: str) -> str:
        """
        Transfer asset ownership on-chain.
        Returns the transaction hash.
        """
        if not self.client.asset_contract:
            raise ValueError("Asset contract not deployed")

        contract_fn = self.client.asset_contract.functions.transferAsset(
            token_id,
            Web3.to_checksum_address(to_address),
        )
        tx_hash = self.client.send_transaction(contract_fn)
        return tx_hash

    async def get_asset_owner(self, token_id: int) -> Optional[str]:
        """Get the owner address of an asset."""
        if not self.client.asset_contract:
            return None

        try:
            return self.client.asset_contract.functions.ownerOf(token_id).call()
        except Exception:
            return None

    async def get_asset(self, token_id: int) -> Optional[Dict]:
        """Get asset metadata on-chain."""
        if not self.client.asset_contract:
            return None

        try:
            result = self.client.asset_contract.functions.getAsset(token_id).call()
            return {
                "assetType": result[0].hex() if isinstance(result[0], bytes) else result[0],
                "issuerDID": result[1].hex() if isinstance(result[1], bytes) else result[1],
                "ownerDID": result[2].hex() if isinstance(result[2], bytes) else result[2],
                "issuedAt": result[3],
                "expiresAt": result[4],
                "ipfsHash": result[5].hex() if isinstance(result[5], bytes) else result[5],
                "documentHash": result[6].hex() if isinstance(result[6], bytes) else result[6],
                "status": ["Active", "Revoked", "Transferred", "Expired"][result[7]],
                "jurisdiction": result[8],
            }
        except Exception:
            return None
