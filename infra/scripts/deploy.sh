#!/bin/bash
# =============================================================================
# DecentraID Production Deployment Script
# =============================================================================
# Usage: ./deploy.sh [environment]
# Environments: dev, staging, production
# =============================================================================

set -euo pipefail

ENVIRONMENT="${1:-dev}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# =============================================================================
# Pre-flight Checks
# =============================================================================
echo "=========================================="
echo "  DecentraID Deployment - ${ENVIRONMENT}"
echo "=========================================="
echo ""

# Check prerequisites
command -v docker >/dev/null 2>&1 || { log_error "Docker required. Install from https://docker.com"; exit 1; }
command -v docker compose >/dev/null 2>&1 || { log_error "Docker Compose required."; exit 1; }

# Check .env file
if [ ! -f "${ROOT_DIR}/.env" ]; then
    log_error ".env file not found. Copy from .env.example and configure."
    exit 1
fi

# Source environment
source "${ROOT_DIR}/.env"

# Validate required variables
required_vars=(
    "POLYGON_AMOY_RPC_URL"
    "PRIVATE_KEY"
    "DATABASE_URL"
    "JWT_SECRET"
    "ENCRYPTION_KEY"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        log_error "Required environment variable ${var} is not set."
        exit 1
    fi
done

log_info "All required environment variables are set."

# =============================================================================
# Build
# =============================================================================
log_info "Building Docker images..."

cd "${ROOT_DIR}"

# Build all services
docker compose build --no-cache

log_info "Build complete."

# =============================================================================
# Database Migrations
# =============================================================================
log_info "Running database migrations..."

# Start database first
docker compose up -d postgres redis
sleep 5

# Wait for PostgreSQL
until docker compose exec postgres pg_isready -U user -d decentraid; do
    log_warn "Waiting for PostgreSQL..."
    sleep 2
done

log_info "PostgreSQL is ready."

# Run migrations
docker compose run --rm backend alembic upgrade head

log_info "Migrations complete."

# =============================================================================
# Deploy
# =============================================================================
log_info "Starting all services..."

# Stop existing containers
docker compose down

# Start all services
docker compose up -d

# Wait for health checks
log_info "Waiting for services to be healthy..."
sleep 10

# Check health
for service in backend frontend anomaly-detector; do
    if docker compose ps "$service" | grep -q "Up"; then
        log_info "${service} is running."
    else
        log_error "${service} failed to start."
        docker compose logs "$service" | tail -20
    fi
done

# =============================================================================
# Verification
# =============================================================================
log_info "Verifying deployment..."

# Health check
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/health 2>/dev/null || echo "000")
if [ "$HEALTH_STATUS" = "200" ]; then
    log_info "Backend API: HEALTHY"
else
    log_warn "Backend API: UNHEALTHY (HTTP ${HEALTH_STATUS})"
fi

# Frontend check
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    log_info "Frontend: HEALTHY"
else
    log_warn "Frontend: UNHEALTHY (HTTP ${FRONTEND_STATUS})"
fi

# Anomaly detection check
ANOMALY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/health 2>/dev/null || echo "000")
if [ "$ANOMALY_STATUS" = "200" ]; then
    log_info "Anomaly Detection: HEALTHY"
else
    log_warn "Anomaly Detection: UNHEALTHY (HTTP ${ANOMALY_STATUS})"
fi

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "=========================================="
echo "  Deployment Complete"
echo "=========================================="
echo ""
echo "Services:"
echo "  Frontend:         http://localhost:3000"
echo "  Backend API:      http://localhost:8000"
echo "  API Documentation: http://localhost:8000/docs"
echo "  Anomaly Detection: http://localhost:8001"
echo ""
echo "Environment: ${ENVIRONMENT}"
echo ""
log_info "Deployment finished successfully!"
