"""
AccessService — manages access control operations on the blockchain.
Wraps the DecentraIDAccessControl smart contract.
"""

from typing import Optional, Dict
from web3 import Web3
from app.services.blockchain.web3_client import Web3Client


class AccessService:
    """Service for access control operations on the DecentraIDAccessControl contract."""

    def __init__(self) -> None:
        self.client = Web3Client()

    async def request_access(
        self, did: str, resource_id: str, action: str, reason: str
    ) -> str:
        """
        Submit an access request on-chain.
        Returns the request ID.
        """
        if not self.client.access_contract:
            raise ValueError("AccessControl contract not deployed")

        resource_hash = Web3.keccak(text=resource_id)
        action_hash = Web3.keccak(text=action)

        contract_fn = self.client.access_contract.functions.requestAccess(
            resource_hash, action_hash, reason
        )
        tx_hash = self.client.send_transaction(contract_fn)
        return tx_hash

    async def decide_access(
        self, request_id: str, approve: bool, manager_did: str
    ) -> str:
        """
        Approve or deny an access request on-chain.
        Returns the transaction hash.
        """
        if not self.client.access_contract:
            raise ValueError("AccessControl contract not deployed")

        request_id_bytes = bytes.fromhex(request_id) if len(request_id) == 64 else Web3.keccak(text=request_id)

        contract_fn = self.client.access_contract.functions.decideAccess(
            request_id_bytes, approve
        )
        tx_hash = self.client.send_transaction(contract_fn)
        return tx_hash

    async def check_access(
        self, did: str, resource_id: str, action: str
    ) -> bool:
        """
        Check if a DID has access to a resource.
        Returns True if access is granted.
        """
        if not self.client.access_contract:
            return False

        address = did.split(":")[-1]
        resource_hash = Web3.keccak(text=resource_id)
        action_hash = Web3.keccak(text=action)

        try:
            return self.client.access_contract.functions.checkAccess(
                Web3.to_checksum_address(address),
                resource_hash,
                action_hash,
            ).call()
        except Exception:
            return False

    async def verify_manager_role(self, did: str) -> bool:
        """Check if a DID has the MANAGER_ROLE."""
        if not self.client.access_contract:
            return False

        address = did.split(":")[-1]
        manager_role = Web3.keccak(text="MANAGER_ROLE")

        try:
            return self.client.access_contract.functions.hasRole(
                manager_role,
                Web3.to_checksum_address(address),
            ).call()
        except Exception:
            return False
