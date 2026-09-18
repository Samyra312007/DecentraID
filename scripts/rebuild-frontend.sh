#!/bin/sh
# =============================================================================
# DecentraID Frontend — Rebuild & Run
# =============================================================================
# Rebuilds the frontend image from the CURRENT source and starts it.
# Use this whenever frontend code changes and Docker shows the old UI.
#
# Usage:
#   sh ./scripts/rebuild-frontend.sh            # rebuild + start frontend
#   sh ./scripts/rebuild-frontend.sh --no-cache # full rebuild, ignore layer cache
# =============================================================================
set -eu

cd "$(dirname "$0")/.."

echo "==> Rebuilding frontend image (source: current working tree)"
if [ "${1:-}" = "--no-cache" ]; then
    echo "==> Cache disabled: forcing full rebuild"
    docker compose build --no-cache frontend
else
    docker compose build frontend
fi

echo "==> Restarting frontend container"
docker compose up -d frontend

echo ""
echo "==> Done. Frontend served at:"
echo "    http://localhost:3000  (direct)"
echo "    http://localhost       (via nginx)"
echo ""
echo "If the page still looks stale:"
echo "  1. Hard-refresh the browser (Ctrl+Shift+R) to bypass browser cache"
echo "  2. Run: sh ./scripts/rebuild-frontend.sh --no-cache"
echo "  3. Verify the running image matches the build: docker compose images frontend"
