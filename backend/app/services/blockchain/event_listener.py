"""
EventListener — monitors blockchain events and triggers callbacks.
Polls for new events from the Identity, AccessControl, and Asset contracts.
"""

import asyncio
import logging
from typing import Callable, Optional
from app.services.blockchain.web3_client import Web3Client

logger = logging.getLogger(__name__)


class EventListener:
    """
    Blockchain event listener that polls for new events.
    Used to sync on-chain state with the off-chain database.
    """

    def __init__(self) -> None:
        self.client = Web3Client()
        self._callbacks: dict[str, list[Callable]] = {}
        self._running = False
        self._poll_interval = 5  # seconds

    def on_event(self, event_name: str, callback: Callable) -> None:
        """Register a callback for a specific event name."""
        if event_name not in self._callbacks:
            self._callbacks[event_name] = []
        self._callbacks[event_name].append(callback)

    async def connect(self) -> None:
        """Start the event listener."""
        self._running = True
        logger.info("Event listener connected")

    async def disconnect(self) -> None:
        """Stop the event listener."""
        self._running = False
        logger.info("Event listener disconnected")

    async def poll_events(self) -> None:
        """
        Poll for new events from all contracts.
        This is called periodically to check for new events.
        """
        if not self._running:
            return

        try:
            # Poll identity events
            if self.client.identity_contract:
                events = self.client.identity_contract.events.DIDCreated.get_logs(
                    fromBlock="latest"
                )
                for event in events:
                    await self._dispatch("DIDCreated", event)

            # Poll access control events
            if self.client.access_contract:
                events = self.client.access_contract.events.AccessRequested.get_logs(
                    fromBlock="latest"
                )
                for event in events:
                    await self._dispatch("AccessRequested", event)

            # Poll asset events
            if self.client.asset_contract:
                events = self.client.asset_contract.events.AssetMinted.get_logs(
                    fromBlock="latest"
                )
                for event in events:
                    await self._dispatch("AssetMinted", event)

        except Exception as e:
            logger.error(f"Error polling events: {e}")

    async def _dispatch(self, event_name: str, event_data) -> None:
        """Dispatch an event to registered callbacks."""
        callbacks = self._callbacks.get(event_name, [])
        for callback in callbacks:
            try:
                await callback(event_data)
            except Exception as e:
                logger.error(f"Error in event callback for {event_name}: {e}")
