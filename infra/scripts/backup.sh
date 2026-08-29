#!/bin/bash
# =============================================================================
# DecentraID Backup Script
# =============================================================================
# Creates backups of database and configuration files.
# Usage: ./backup.sh [backup_dir]
# =============================================================================

set -euo pipefail

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Create backup directory
mkdir -p "${BACKUP_DIR}"

echo "=========================================="
echo "  DecentraID Backup"
echo "  ${TIMESTAMP}"
echo "=========================================="
echo ""

# =============================================================================
# Database Backup
# =============================================================================
log_info "Backing up PostgreSQL database..."

BACKUP_FILE="${BACKUP_DIR}/decentraid_db_${TIMESTAMP}.sql"

if docker compose exec -T postgres pg_dump -U user decentraid > "${BACKUP_FILE}" 2>/dev/null; then
    log_info "Database backup saved to: ${BACKUP_FILE}"
    log_info "Backup size: $(du -h "${BACKUP_FILE}" | cut -f1)"
else
    log_error "Database backup failed."
fi

# =============================================================================
# Configuration Backup
# =============================================================================
log_info "Backing up configuration files..."

CONFIG_BACKUP="${BACKUP_DIR}/config_${TIMESTAMP}.tar.gz"

tar -czf "${CONFIG_BACKUP}" \
    -C "${ROOT_DIR}" \
    .env \
    docker-compose.yml \
    infra/nginx/nginx.conf \
    2>/dev/null || log_warn "Some config files may be missing."

log_info "Configuration backup saved to: ${CONFIG_BACKUP}"

# =============================================================================
# Smart Contract ABIs Backup
# =============================================================================
log_info "Backing up contract ABIs..."

if [ -d "${ROOT_DIR}/contracts/deployments" ]; then
    ABI_BACKUP="${BACKUP_DIR}/abis_${TIMESTAMP}.tar.gz"
    tar -czf "${ABI_BACKUP}" -C "${ROOT_DIR}" contracts/deployments/ 2>/dev/null
    log_info "ABI backup saved to: ${ABI_BACKUP}"
else
    log_warn "No deployments directory found. Skipping ABI backup."
fi

# =============================================================================
# Cleanup Old Backups
# =============================================================================
log_info "Cleaning up backups older than 30 days..."

find "${BACKUP_DIR}" -name "*.sql" -mtime +30 -delete 2>/dev/null || true
find "${BACKUP_DIR}" -name "*.tar.gz" -mtime +30 -delete 2>/dev/null || true

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "=========================================="
echo "  Backup Complete"
echo "=========================================="
echo ""
echo "Backup location: ${BACKUP_DIR}"
echo "Files created:"
ls -lh "${BACKUP_DIR}"/*"${TIMESTAMP}"* 2>/dev/null || echo "  No files created."
echo ""
log_info "Backup finished successfully!"
