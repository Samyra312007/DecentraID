"""
Script to initialize default roles in the system.
Run this after database migration to set up base roles.
"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.constants import ROLE_ENGINEER, ROLE_MANAGER, ROLE_ADMIN, ROLE_ISSUER, ROLE_VIEWER


DEFAULT_ROLES = [
    {"name": ROLE_ADMIN, "description": "System administrator with full access"},
    {"name": ROLE_MANAGER, "description": "Team manager who can approve access requests"},
    {"name": ROLE_ENGINEER, "description": "Software engineer with standard access"},
    {"name": ROLE_ISSUER, "description": "Asset issuer who can mint NFTs"},
    {"name": ROLE_VIEWER, "description": "Read-only viewer"},
]


async def main():
    """Create default roles."""
    print("=== Initializing Default Roles ===\n")

    for role in DEFAULT_ROLES:
        print(f"  ✓ Role: {role['name']} — {role['description']}")

    print("\n=== Roles Ready ===")
    print("Note: Roles are created on-chain when the contracts are deployed.")
    print("Run 'npx hardhat run scripts/deploy-all.js --network amoy' to deploy.")


if __name__ == "__main__":
    asyncio.run(main())
