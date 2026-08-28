"""
IdentityService — manages DID operations on the blockchain.
Wraps the DecentraIDIdentity smart contract.
"""

from typing import Optional, Dict
from web3 import Web3
from app.services.blockchain.web3_client import Web3Client


class IdentityService:
    """Service for DID operations on the DecentraIDIdentity contract."""

    def __init__(self) -> None:
        self.client = Web3Client()

    async def create_did(self, public_key_hash: bytes, metadata_hash: bytes) -> str:
        """
        Create a new DID on-chain.
        Returns the transaction hash.
        """
        if not self.client.identity_contract:
            raise ValueError("Identity contract not deployed")

        contract_fn = self.client.identity_contract.functions.createDID(
            public_key_hash,
            metadata_hash,
        )
        tx_hash = self.client.send_transaction(contract_fn)
        return tx_hash

    async def resolve_did(self, did: str) -> Optional[Dict]:
        """
        Resolve a DID to its on-chain document.
        Returns the document dict or None if not found.
        """
        if not self.client.identity_contract:
            return None

        address = did.split(":")[-1]

        try:
            result = self.client.identity_contract.functions.resolveDID(
                Web3.to_checksum_address(address)
            ).call()

            return {
                "controller": result[0],
                "publicKeyHash": result[1].hex() if isinstance(result[1], bytes) else result[1],
                "metadataHash": result[2].hex() if isinstance(result[2], bytes) else result[2],
                "created": result[3],
                "updated": result[4],
                "status": ["Active", "Suspended", "Deactivated"][result[5]],
            }
        except Exception:
            return None

    async def update_did(self, new_metadata_hash: bytes) -> str:
        """
        Update DID metadata on-chain.
        Returns the transaction hash.
        """
        if not self.client.identity_contract:
            raise ValueError("Identity contract not deployed")

        contract_fn = self.client.identity_contract.functions.updateDID(
            new_metadata_hash,
        )
        tx_hash = self.client.send_transaction(contract_fn)
        return tx_hash

    async def is_did_active(self, did: str) -> bool:
        """Check if a DID is active on-chain."""
        if not self.client.identity_contract:
            return False

        address = did.split(":")[-1]

        try:
            return self.client.identity_contract.functions.isDIDActive(
                Web3.to_checksum_address(address)
            ).call()
        except Exception:
            return False
