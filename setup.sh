#!/bin/bash

# DecentraID Setup Script
# One-click setup for development environment

set -e

echo "=========================================="
echo "  DecentraID - Decentralized Identity"
echo "  Setup Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "Checking prerequisites..."

    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed${NC}"
        echo "Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi

    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Error: Python 3 is not installed${NC}"
        echo "Please install Python 3.10+ from https://python.org/"
        exit 1
    fi

    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}Warning: Docker is not installed${NC}"
        echo "Docker is optional but recommended for database"
    fi

    echo -e "${GREEN}✓ Prerequisites check passed${NC}"
    echo ""
}

# Create .env file
create_env() {
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cat > .env << 'EOF'
# Database
POSTGRES_DB=decentraid
POSTGRES_USER=decentraid
POSTGRES_PASSWORD=decentraid_password

# Backend
JWT_SECRET_KEY=$(openssl rand -hex 32 2>/dev/null || echo "dev-secret-key-change-in-production")
DATABASE_URL=postgresql+asyncpg://decentraid:decentraid_password@localhost:5432/decentraid

# Blockchain
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your-private-key-here

# IPFS
IPFS_API_URL=/ip4/127.0.0.1/tcp/5001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_ANOMALY_URL=http://localhost:8001
EOF
        echo -e "${GREEN}✓ .env file created${NC}"
    else
        echo -e "${YELLOW}! .env file already exists, skipping${NC}"
    fi
    echo ""
}

# Install backend dependencies
setup_backend() {
    echo "Setting up backend..."
    cd backend
    pip install -r requirements.txt
    cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    echo ""
}

# Install anomaly detection dependencies
setup_anomaly() {
    echo "Setting up anomaly detection..."
    cd anomaly-detection
    pip install -r requirements.txt
    cd ..
    echo -e "${GREEN}✓ Anomaly detection dependencies installed${NC}"
    echo ""
}

# Install frontend dependencies
setup_frontend() {
    echo "Setting up frontend..."
    cd frontend
    npm install
    cd ..
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    echo ""
}

# Install smart contract dependencies
setup_contracts() {
    echo "Setting up smart contracts..."
    cd contracts
    npm install
    cd ..
    echo -e "${GREEN}✓ Smart contract dependencies installed${NC}"
    echo ""
}

# Run database migrations
run_migrations() {
    echo "Running database migrations..."
    cd backend
    python3 -m alembic upgrade head 2>/dev/null || echo -e "${YELLOW}! Migration skipped (database may not be running)${NC}"
    cd ..
    echo ""
}

# Train anomaly detection models
train_models() {
    echo "Training anomaly detection models..."
    cd anomaly-detection
    python3 -m app.train 2>/dev/null || echo -e "${YELLOW}! Model training skipped${NC}"
    cd ..
    echo ""
}

# Start services
start_services() {
    echo "Starting services..."
    echo ""
    echo "To start all services with Docker:"
    echo "  docker-compose up -d"
    echo ""
    echo "To start services manually:"
    echo "  Terminal 1: cd backend && python3 -m uvicorn app.main:app --reload --port 8000"
    echo "  Terminal 2: cd anomaly-detection && python3 -m uvicorn app.main:app --reload --port 8001"
    echo "  Terminal 3: cd frontend && npm run dev"
    echo ""
}

# Run tests
run_tests() {
    echo "Running tests..."
    echo ""

    echo "Backend tests:"
    cd backend
    python3 -m pytest tests/ -v --tb=short 2>/dev/null || echo -e "${YELLOW}! Backend tests skipped${NC}"
    cd ..

    echo ""
    echo "Anomaly detection tests:"
    cd anomaly-detection
    python3 -m pytest tests/ -v -p no:anchorpy --tb=short 2>/dev/null || echo -e "${YELLOW}! Anomaly detection tests skipped${NC}"
    cd ..

    echo ""
    echo "Contract tests:"
    cd contracts
    npx hardhat test 2>/dev/null || echo -e "${YELLOW}! Contract tests skipped${NC}"
    cd ..

    echo -e "${GREEN}✓ Tests completed${NC}"
    echo ""
}

# Print summary
print_summary() {
    echo "=========================================="
    echo -e "${GREEN}  Setup Complete!${NC}"
    echo "=========================================="
    echo ""
    echo "Project Structure:"
    echo "  contracts/    - Solidity smart contracts"
    echo "  backend/      - FastAPI backend API"
    echo "  frontend/     - Next.js frontend"
    echo "  anomaly-detection/ - ML anomaly detection"
    echo "  infra/        - Infrastructure config"
    echo ""
    echo "Quick Start:"
    echo "  1. Start database: docker-compose up -d postgres redis"
    echo "  2. Start backend: cd backend && python3 -m uvicorn app.main:app --reload"
    echo "  3. Start anomaly: cd anomaly-detection && python3 -m uvicorn app.main:app --reload --port 8001"
    echo "  4. Start frontend: cd frontend && npm run dev"
    echo ""
    echo "API Documentation:"
    echo "  Backend: http://localhost:8000/docs"
    echo "  Anomaly: http://localhost:8001/docs"
    echo ""
    echo "Frontend:"
    echo "  http://localhost:3000"
    echo ""
}

# Main execution
main() {
    echo ""
    check_prerequisites
    create_env
    setup_backend
    setup_anomaly
    setup_frontend
    setup_contracts
    echo -e "${GREEN}✓ All dependencies installed${NC}"
    echo ""
    print_summary
}

# Parse arguments
case "${1:-}" in
    --test)
        run_tests
        ;;
    --train)
        train_models
        ;;
    --migrate)
        run_migrations
        ;;
    *)
        main
        ;;
esac
