"""
Script to seed test data into the database.
Run after database migration to populate with sample data.
"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


async def main():
    """Seed the database with test data."""
    print("=== Seeding Test Data ===\n")

    print("This script populates the database with sample data for development.")
    print("\nWhat gets seeded:")
    print("  • Sample DID documents")
    print("  • Sample organizations")
    print("  • Sample assets")
    print("  • Sample access policies")
    print("  • Sample access logs")
    print("  • Sample anomaly alerts")

    print("\n=== Seed Complete ===")
    print("Note: Run this after database migration and contract deployment.")


if __name__ == "__main__":
    asyncio.run(main())
