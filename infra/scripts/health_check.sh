#!/bin/bash
# =============================================================================
# DecentraID Health Check Script
# =============================================================================
# Checks the health of all services and reports status.
# Usage: ./health_check.sh
# =============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_count=0
pass_count=0
fail_count=0

check_service() {
    local name="$1"
    local url="$2"
    local timeout="${3:-5}"

    check_count=$((check_count + 1))

    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" 2>/dev/null || echo "000")

    if [ "$status" = "200" ]; then
        echo -e "  ${GREEN}✓${NC} ${name}: ${GREEN}HEALTHY${NC} (HTTP ${status})"
        pass_count=$((pass_count + 1))
    else
        echo -e "  ${RED}✗${NC} ${name}: ${RED}UNHEALTHY${NC} (HTTP ${status})"
        fail_count=$((fail_count + 1))
    fi
}

check_docker_service() {
    local name="$1"
    local container="$2"

    check_count=$((check_count + 1))

    if docker compose ps "$container" 2>/dev/null | grep -q "Up"; then
        echo -e "  ${GREEN}✓${NC} ${name}: ${GREEN}RUNNING${NC}"
        pass_count=$((pass_count + 1))
    else
        echo -e "  ${RED}✗${NC} ${name}: ${RED}STOPPED${NC}"
        fail_count=$((fail_count + 1))
    fi
}

echo "=========================================="
echo "  DecentraID Health Check"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

# Check Docker containers
echo "Docker Containers:"
check_docker_service "PostgreSQL" "postgres"
check_docker_service "Redis" "redis"
check_docker_service "Backend API" "backend"
check_docker_service "Frontend" "frontend"
check_docker_service "Anomaly Detection" "anomaly-detector"
echo ""

# Check HTTP endpoints
echo "HTTP Endpoints:"
check_service "Backend API" "http://localhost:8000/api/v1/health"
check_service "Frontend" "http://localhost:3000"
check_service "Anomaly Detection" "http://localhost:8001/health"
check_service "API Documentation" "http://localhost:8000/docs"
echo ""

# Check database connectivity
echo "Database:"
check_count=$((check_count + 1))
if docker compose exec -T postgres pg_isready -U user -d decentraid 2>/dev/null | grep -q "accepting"; then
    echo -e "  ${GREEN}✓${NC} PostgreSQL: ${GREEN}CONNECTED${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "  ${RED}✗${NC} PostgreSQL: ${RED}DISCONNECTED${NC}"
    fail_count=$((fail_count + 1))
fi

check_count=$((check_count + 1))
if docker compose exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
    echo -e "  ${GREEN}✓${NC} Redis: ${GREEN}CONNECTED${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "  ${RED}✗${NC} Redis: ${RED}DISCONNECTED${NC}"
    fail_count=$((fail_count + 1))
fi
echo ""

# Summary
echo "=========================================="
echo "  Results: ${pass_count}/${check_count} checks passed"
echo "=========================================="

if [ "$fail_count" -gt 0 ]; then
    echo -e "${RED}  ${fail_count} service(s) are unhealthy!${NC}"
    exit 1
else
    echo -e "${GREEN}  All services are healthy!${NC}"
    exit 0
fi
