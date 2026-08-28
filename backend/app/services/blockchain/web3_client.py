"""
Web3Client singleton — manages Web3 connection to Polygon Amoy.
Loads contract ABIs and provides transaction signing.
"""

import json
import os
from typing import Optional
from web3 import Web3
from app.config import get_settings

settings = get_settings()


class Web3Client:
    """
    Singleton Web3 client for Polygon Amoy testnet.
    Manages connection, contract instances, and transaction signing.
    """

    _instance: Optional["Web3Client"] = None
    _initialized: bool = False

    def __new__(cls) -> "Web3Client":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return

        self.w3 = Web3(Web3.HTTPProvider(settings.polygon_amoy_rpc_url))

        # Load contract ABIs
        deployments_dir = os.path.join(
            os.path.dirname(__file__),
            "..", "..", "..", "..",
            "contracts", "deployments", "amoy",
        )

        self.identity_contract = None
        self.access_contract = None
        self.asset_contract = None

        # Load identity contract
        identity_path = os.path.join(deployments_dir, "DecentraIDIdentity.json")
        if os.path.exists(identity_path):
            with open(identity_path) as f:
                data = json.load(f)
                self.identity_contract = self.w3.eth.contract(
                    address=data["address"],
                    abi=data["abi"],
                )

        # Load access control contract
        access_path = os.path.join(deployments_dir, "DecentraIDAccessControl.json")
        if os.path.exists(access_path):
            with open(access_path) as f:
                data = json.load(f)
                self.access_contract = self.w3.eth.contract(
                    address=data["address"],
                    abi=data["abi"],
                )

        # Load asset contract
        asset_path = os.path.join(deployments_dir, "DecentraIDAssets.json")
        if os.path.exists(asset_path):
            with open(asset_path) as f:
                data = json.load(f)
                self.asset_contract = self.w3.eth.contract(
                    address=data["address"],
                    abi=data["abi"],
                )

        # Account for sending transactions
        self.account = None
        if settings.private_key:
            self.account = self.w3.eth.account.from_key(settings.private_key)

        self._initialized = True

    def get_balance(self) -> float:
        """Get POL balance of deployer account."""
        if not self.account:
            return 0.0
        balance = self.w3.eth.get_balance(self.account.address)
        return float(self.w3.from_wei(balance, "ether"))

    def get_gas_price(self) -> int:
        """Get current gas price in wei."""
        return self.w3.eth.gas_price

    def send_transaction(self, contract_function) -> str:
        """
        Build, sign, and send a transaction.
        Returns the transaction hash as hex string.
        """
        if not self.account:
            raise ValueError("No private key configured")

        tx = contract_function.build_transaction({
            "from": self.account.address,
            "nonce": self.w3.eth.get_transaction_count(self.account.address),
            "gas": 500000,
            "gasPrice": self.w3.eth.gas_price,
            "chainId": settings.polygon_amoy_chain_id,
        })

        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        # Wait for receipt
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

        return receipt.transactionHash.hex()

    def is_connected(self) -> bool:
        """Check if connected to the blockchain."""
        return self.w3.is_connected()

    def get_block_number(self) -> int:
        """Get the latest block number."""
        return self.w3.eth.block_number
