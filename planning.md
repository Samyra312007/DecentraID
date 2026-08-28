# SIH26125 — DecentraID: End-to-End Project Plan

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Team Structure & Roles](#2-team-structure--roles)
3. [Tech Stack](#3-tech-stack)
4. [Repository Structure](#4-repository-structure)
5. [Environment Setup](#5-environment-setup)
6. [Manual Configurations](#6-manual-configurations)
7. [Smart Contracts](#7-smart-contracts)
8. [Backend API](#8-backend-api)
9. [Frontend](#9-frontend)
10. [AI/ML Anomaly Detection](#10-aiml-anomaly-detection)
11. [IPFS Integration](#11-ipfs-integration)
12. [Database Schema](#12-database-schema)
13. [Docker & Deployment](#13-docker--deployment)
14. [Testing Strategy](#14-testing-strategy)
15. [Security Audit Checklist](#15-security-audit-checklist)
16. [Timeline & Milestones](#16-timeline--milestones)
17. [Cost Breakdown](#17-cost-breakdown)
18. [Risk Register](#18-risk-register)
19. [Appendix](#19-appendix)

---

## 1. Project Overview

### 1.1 Problem Statement

Organizations rely on centralized IAM systems creating single points of failure. No integrated solution exists combining Decentralized Identity + NFT-based Asset Ownership + Smart Contract Access Control.

### 1.2 Solution

DecentraID — a blockchain-based platform where users own their identity (DID), organizations enforce access rules via smart contracts, and digital assets are verifiable NFTs on Polygon.

### 1.3 Scope

| In Scope | Out of Scope |
|----------|-------------|
| DID creation and resolution on Polygon | Mainnet deployment (testnet for prototype) |
| Smart contracts (Identity, Access, NFT) | Formal smart contract audit (planned post-SIH) |
| FastAPI backend with full REST API | Mobile app (Flutter prototype only) |
| React.js web dashboard | Multi-chain support (Phase 2) |
| AI/ML anomaly detection model | Aadhaar integration (Phase 3) |
| IPFS document storage | Production-grade monitoring (Prometheus/Grafana) |
| PostgreSQL + Redis data layer | Enterprise SSO/LDAP (Phase 2) |
| Docker Compose deployment | CI/CD pipeline (post-SIH) |

### 1.4 Success Criteria

| Criterion | Metric |
|-----------|--------|
| DID Creation | DID created and resolvable on Polygon testnet in < 5s |
| Access Control | RBAC + ABAC policy evaluation in < 200ms |
| NFT Minting | Asset minted with IPFS metadata in < 5s |
| Anomaly Detection | Risk score calculated in < 50ms |
| False Positive Rate | < 10% for anomaly detection |
| Uptime | 99.9% during demo |
| Cost | Near Rs 0 for entire prototype |

---

## 2. Team Structure & Roles

### 2.1 Team Composition (5-6 Members)

| Role | Responsibilities | Skills Required |
|------|-----------------|-----------------|
| **Team Lead / Blockchain Architect** | Smart contract design, architecture decisions, code reviews | Solidity, Hardhat, Web3.js, system design |
| **Backend Developer** | FastAPI server, API endpoints, database, Redis, WebSocket | Python, FastAPI, PostgreSQL, Redis, asyncio |
| **Frontend Developer** | React dashboard, UI/UX, wallet integration, responsive design | React.js, Next.js, Tailwind CSS, ethers.js |
| **AI/ML Engineer** | Anomaly detection model, behavior profiling, feature engineering | Python, TensorFlow, scikit-learn, numpy |
| **DevOps / Smart Contract Tester** | Docker setup, testing, deployment, contract security | Docker, Hardhat testing, Slither, CI |

### 2.2 Communication

- Daily standup at 10:00 AM (15 minutes max)
- Shared Slack/Discord channel for real-time updates
- GitHub Issues for task tracking
- Weekly code review every Friday

---

## 3. Tech Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18.x | UI framework |
| Next.js | 14.x | SSR, routing, API routes |
| Tailwind CSS | 3.x | Styling |
| ethers.js | 6.x | Ethereum/Polygon interaction |
| wagmi | 2.x | React hooks for Ethereum |
| viem | 2.x | TypeScript Ethereum interface |
| Web3Modal | 3.x | Wallet connection UI |

### 3.2 Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Runtime |
| FastAPI | 0.110+ | Web framework |
| Uvicorn | 0.29+ | ASGI server |
| SQLAlchemy | 2.0+ | ORM |
| Alembic | 1.13+ | Database migrations |
| Pydantic | 2.x | Data validation |
| web3.py | 6.x | Blockchain interaction |
| Redis (aioredis) | 5.x | Caching, pub/sub |
| python-jose | 3.x | JWT tokens |
| passlib | 1.7+ | Password hashing |

### 3.3 Smart Contracts

| Technology | Version | Purpose |
|-----------|---------|---------|
| Solidity | 0.8.20 | Smart contract language |
| Hardhat | 2.20+ | Development framework |
| OpenZeppelin | 5.x | Contract libraries |
| ethers.js | 6.x | Contract interaction |
| Slither | 0.10+ | Static analysis |
| Mocha/Chai | 10.x | Contract testing |

### 3.4 AI/ML

| Technology | Version | Purpose |
|-----------|---------|---------|
| TensorFlow | 2.15+ | Deep learning (autoencoder) |
| scikit-learn | 1.4+ | Isolation Forest, preprocessing |
| numpy | 1.26+ | Numerical computation |
| pandas | 2.1+ | Data manipulation |
| joblib | 1.3+ | Model serialization |

### 3.5 Infrastructure

| Technology | Version | Purpose |
|-----------|---------|---------|
| Docker | 24.x | Containerization |
| Docker Compose | 2.24+ | Multi-container orchestration |
| PostgreSQL | 16 | Primary database |
| Redis | 7.x | Caching, WebSocket pub/sub |
| IPFS (Kubo) | 0.27+ | Decentralized storage |
| Polygon (Amoy Testnet) | - | Blockchain (testnet) |

### 3.6 Polygon Testnet Details

| Parameter | Value |
|-----------|-------|
| Network Name | Polygon Amoy Testnet |
| Chain ID | 80002 |
| RPC URL | https://rpc-amoy.polygon.technology |
| Block Explorer | https://amoy.polygonscan.com |
| Native Token | POL (testnet) |
| Faucet | https://faucet.polygon.technology |

---

## 4. Repository Structure

```
decentraid/
├── README.md
├── planning.md
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── contracts/                          # Smart Contracts
│   ├── hardhat.config.js
│   ├── package.json
│   ├── contracts/
│   │   ├── Identity/
│   │   │   └── DecentraIDIdentity.sol
│   │   ├── AccessControl/
│   │   │   └── DecentraIDAccessControl.sol
│   │   ├── Assets/
│   │   │   └── DecentraIDAssets.sol
│   │   └── interfaces/
│   │       ├── IIdentity.sol
│   │       ├── IAccessControl.sol
│   │       └── IAssets.sol
│   ├── scripts/
│   │   ├── deploy.js
│   │   ├── deploy-all.js
│   │   └── verify.js
│   ├── test/
│   │   ├── Identity.test.js
│   │   ├── AccessControl.test.js
│   │   ├── Assets.test.js
│   │   └── Integration.test.js
│   └── deployments/
│       └── amoy/
│           ├── DecentraIDIdentity.json
│           ├── DecentraIDAccessControl.json
│           └── DecentraIDAssets.json
│
├── backend/                            # Python Backend
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       ├── 001_initial.py
│   │       └── 002_add_indexes.py
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI app entry
│   │   ├── config.py                   # Settings & env vars
│   │   ├── dependencies.py             # Dependency injection
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   ├── security.py             # JWT, auth middleware
│   │   │   ├── rate_limiter.py         # Rate limiting
│   │   │   └── cors.py                # CORS configuration
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── did.py                  # DID database model
│   │   │   ├── organization.py         # Organization model
│   │   │   ├── asset.py                # Asset metadata model
│   │   │   ├── access_log.py           # Audit log model
│   │   │   ├── policy.py              # Policy model
│   │   │   ├── anomaly_alert.py        # Anomaly alert model
│   │   │   └── behavior_profile.py     # Behavior profile model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── did.py                  # DID request/response schemas
│   │   │   ├── asset.py                # Asset schemas
│   │   │   ├── access.py               # Access control schemas
│   │   │   ├── policy.py              # Policy schemas
│   │   │   └── anomaly.py             # Anomaly schemas
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── router.py           # API v1 router
│   │   │   │   ├── did.py              # DID endpoints
│   │   │   │   ├── assets.py           # Asset endpoints
│   │   │   │   ├── access.py           # Access control endpoints
│   │   │   │   ├── policy.py          # Policy endpoints
│   │   │   │   ├── anomaly.py          # Anomaly endpoints
│   │   │   │   ├── ipfs.py            # IPFS endpoints
│   │   │   │   └── websocket.py       # WebSocket handler
│   │   │   └── health.py              # Health check
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── blockchain/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── web3_client.py      # Web3 connection manager
│   │   │   │   ├── identity_service.py # DID blockchain operations
│   │   │   │   ├── access_service.py   # Access control blockchain ops
│   │   │   │   ├── asset_service.py    # NFT blockchain operations
│   │   │   │   └── event_listener.py   # Blockchain event listener
│   │   │   ├── ipfs_service.py         # IPFS upload/retrieve
│   │   │   ├── anomaly_service.py      # Anomaly detection orchestration
│   │   │   ├── audit_service.py        # Audit logging
│   │   │   ├── notification_service.py # WebSocket notifications
│   │   │   └── auth_service.py         # JWT authentication
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── security.py            # Encryption, hashing
│   │   │   ├── exceptions.py          # Custom exceptions
│   │   │   └── constants.py           # App constants
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── did_utils.py           # DID generation helpers
│   │       ├── crypto_utils.py        # Cryptographic utilities
│   │       └── validators.py          # Input validators
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py                # Pytest fixtures
│   │   ├── test_api/
│   │   │   ├── test_did.py
│   │   │   ├── test_assets.py
│   │   │   ├── test_access.py
│   │   │   └── test_anomaly.py
│   │   └── test_services/
│   │       ├── test_blockchain.py
│   │       └── test_ipfs.py
│   └── scripts/
│       ├── seed_data.py               # Seed test data
│       └── create_roles.py            # Initialize default roles
│
├── frontend/                           # React Frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.svg
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── globals.css
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx           # Main dashboard
│   │   │   ├── did/
│   │   │   │   ├── create/page.tsx    # DID creation
│   │   │   │   └── [did]/page.tsx     # DID detail view
│   │   │   ├── assets/
│   │   │   │   ├── page.tsx           # Asset list
│   │   │   │   ├── mint/page.tsx      # Mint new asset
│   │   │   │   └── [tokenId]/page.tsx # Asset detail
│   │   │   ├── access/
│   │   │   │   ├── page.tsx           # Access management
│   │   │   │   ├── request/page.tsx   # Request access
│   │   │   │   └── policies/page.tsx  # Manage policies
│   │   │   ├── anomaly/
│   │   │   │   └── page.tsx           # Anomaly dashboard
│   │   │   └── settings/
│   │   │       └── page.tsx           # User settings
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── did/
│   │   │   │   ├── DIDCard.tsx
│   │   │   │   ├── DIDCreateForm.tsx
│   │   │   │   └── DIDDetail.tsx
│   │   │   ├── assets/
│   │   │   │   ├── AssetCard.tsx
│   │   │   │   ├── AssetGrid.tsx
│   │   │   │   ├── MintForm.tsx
│   │   │   │   └── TransferModal.tsx
│   │   │   ├── access/
│   │   │   │   ├── AccessRequestCard.tsx
│   │   │   │   ├── PolicyForm.tsx
│   │   │   │   ├── RoleManager.tsx
│   │   │   │   └── AccessMatrix.tsx
│   │   │   ├── anomaly/
│   │   │   │   ├── RiskGauge.tsx
│   │   │   │   ├── AlertList.tsx
│   │   │   │   ├── BehaviorChart.tsx
│   │   │   │   └── AnomalyDetail.tsx
│   │   │   └── common/
│   │   │       ├── WalletConnect.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       ├── TxHash.tsx
│   │   │       └── ConfirmModal.tsx
│   │   ├── hooks/
│   │   │   ├── useDecentraID.ts       # Main hook
│   │   │   ├── useDID.ts             # DID operations
│   │   │   ├── useAssets.ts          # Asset operations
│   │   │   ├── useAccess.ts          # Access control ops
│   │   │   ├── useAnomaly.ts         # Anomaly detection
│   │   │   └── useWebSocket.ts       # Real-time events
│   │   ├── lib/
│   │   │   ├── api.ts                # API client
│   │   │   ├── contracts.ts          # Contract ABIs & addresses
│   │   │   ├── web3.ts              # Web3 provider setup
│   │   │   └── utils.ts             # Utility functions
│   │   ├── types/
│   │   │   ├── did.ts               # DID types
│   │   │   ├── asset.ts             # Asset types
│   │   │   ├── access.ts            # Access types
│   │   │   └── anomaly.ts           # Anomaly types
│   │   └── styles/
│   │       └── globals.css
│   └── tests/
│       ├── components/
│       │   ├── DIDCard.test.tsx
│       │   └── WalletConnect.test.tsx
│       └── hooks/
│           └── useDecentraID.test.ts
│
├── anomaly-detection/                  # AI/ML Module
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI app for ML service
│   │   ├── config.py
│   │   ├── feature_engine.py           # Feature extraction
│   │   ├── detector.py                 # Anomaly detection model
│   │   ├── behavior_profiler.py        # Behavior profiling
│   │   ├── pipeline.py                 # Real-time detection pipeline
│   │   ├── model_trainer.py            # Model training script
│   │   └── utils.py
│   ├── models/
│   │   ├── autoencoder.keras           # Trained autoencoder
│   │   ├── isolation_forest.pkl        # Trained Isolation Forest
│   │   ├── scaler.pkl                  # Feature scaler
│   │   └── threshold.pkl              # Anomaly threshold
│   ├── notebooks/
│   │   ├── 01_data_exploration.ipynb
│   │   ├── 02_model_training.ipynb
│   │   └── 03_evaluation.ipynb
│   ├── data/
│   │   ├── synthetic_access_data.csv
│   │   └── normal_behavior_data.csv
│   └── tests/
│       ├── test_detector.py
│       └── test_pipeline.py
│
├── infra/                              # Infrastructure
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── ssl/
│   ├── scripts/
│   │   ├── setup.sh                    # One-click setup
│   │   ├── deploy.sh                   # Deployment script
│   │   ├── backup.sh                   # Database backup
│   │   └── health_check.sh            # Health monitoring
│   └── monitoring/
│       └── docker-compose.monitoring.yml
│
└── docs/
    ├── architecture.md
    ├── api-reference.md
    ├── deployment.md
    └── smart-contracts.md
```

---

## 5. Environment Setup

### 5.1 Prerequisites

```bash
# System requirements
- Node.js 20.x LTS
- Python 3.11+
- Docker & Docker Compose
- Git 2.40+
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space
- GPU (NVIDIA RTX 3060 or better) for ML training
```

### 5.2 One-Click Setup Script

```bash
#!/bin/bash
# scripts/setup.sh

set -e

echo "=== DecentraID Setup ==="

# 1. Check prerequisites
echo "[1/8] Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "Node.js required. Install from https://nodejs.org"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python 3.11+ required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker required. Install from https://docker.com"; exit 1; }

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "Node.js 20+ required. Current: $(node -v)"
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "Python version: $PYTHON_VERSION"
echo "Node.js version: $(node -v)"

# 2. Clone and install
echo "[2/8] Installing dependencies..."

# Smart contracts
cd contracts
npm install
cd ..

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Frontend
cd frontend
npm install
cd ..

# Anomaly detection
cd anomaly-detection
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# 3. Copy environment files
echo "[3/8] Setting up environment..."
cp .env.example .env

# 4. Generate encryption keys
echo "[4/8] Generating encryption keys..."
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

# Write to .env
cat >> .env << EOF
JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}
EOF

echo "Generated JWT_SECRET and ENCRYPTION_KEY"

# 5. Install Docker containers
echo "[5/8] Starting Docker services..."
docker compose up -d postgres redis ipfs-node

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
sleep 5
until docker compose exec postgres pg_isready -U user -d decentraid; do
    sleep 1
done

# 6. Run database migrations
echo "[6/8] Running database migrations..."
cd backend
source venv/bin/activate
alembic upgrade head
cd ..

# 7. Deploy smart contracts
echo "[7/8] Deploying smart contracts to Polygon Amoy..."
cd contracts
npx hardhat run scripts/deploy-all.js --network amoy
cd ..

# 8. Seed initial data
echo "[8/8] Seeding initial data..."
cd backend
source venv/bin/activate
python scripts/create_roles.py
python scripts/seed_data.py
cd ..

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Services:"
echo "  Frontend:    http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo "  API Docs:    http://localhost:8000/docs"
echo "  IPFS:        http://localhost:5001"
echo ""
echo "Next steps:"
echo "  1. Add Polygon Amoy testnet to MetaMask"
echo "  2. Get testnet POL from faucet"
echo "  3. Run: docker compose up"
echo ""
```

### 5.3 MetaMask Configuration

```
Network Name:     Polygon Amoy Testnet
New RPC URL:      https://rpc-amoy.polygon.technology
Chain ID:         80002
Currency Symbol:  POL
Block Explorer:   https://amoy.polygonscan.com
```

### 5.4 Getting Testnet POL

1. Visit https://faucet.polygon.technology
2. Select "Amoy" testnet
3. Connect MetaMask wallet
4. Request 0.5 POL (enough for ~500 transactions)
5. Wait 30-60 seconds for confirmation

---

## 6. Manual Configurations

### 6.1 Environment Variables (.env)

```bash
# ========== BLOCKCHAIN ==========
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_AMOY_CHAIN_ID=80002
PRIVATE_KEY=your_wallet_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Contract addresses (filled after deployment)
IDENTITY_CONTRACT_ADDRESS=
ACCESS_CONTROL_CONTRACT_ADDRESS=
ASSET_CONTRACT_ADDRESS=

# ========== DATABASE ==========
DATABASE_URL=postgresql://user:password@localhost:5432/decentraid
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=decentraid
DATABASE_USER=user
DATABASE_PASSWORD=password

# ========== REDIS ==========
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# ========== IPFS ==========
IPFS_API_URL=/dns/localhost/tcp/5001
IPFS_GATEWAY_URL=http://localhost:8080

# ========== SECURITY ==========
JWT_SECRET=your_generated_jwt_secret_here
ENCRYPTION_KEY=your_generated_encryption_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# ========== ANOMALY DETECTION ==========
ANOMALY_SERVICE_URL=http://localhost:8001
ANOMALY_MODEL_PATH=./models
ANOMALY_THRESHOLD=0.5

# ========== APPLICATION ==========
APP_NAME=DecentraID
APP_VERSION=1.0.0
DEBUG=true
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=INFO
```

### 6.2 Hardhat Configuration

```javascript
// contracts/hardhat.config.js

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    amoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
      gasPrice: 30000000000  // 30 Gwei
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
```

### 6.3 Backend Configuration

```python
# backend/app/config.py

from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Application
    app_name: str = "DecentraID"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Database
    database_url: str = "postgresql://user:password@localhost:5432/decentraid"
    database_host: str = "localhost"
    database_port: int = 5432
    database_name: str = "decentraid"
    database_user: str = "user"
    database_password: str = "password"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    redis_host: str = "localhost"
    redis_port: int = 6379
    
    # Blockchain
    polygon_amoy_rpc_url: str = "https://rpc-amoy.polygon.technology"
    polygon_amoy_chain_id: int = 80002
    private_key: str = ""
    
    # Contract addresses
    identity_contract_address: str = ""
    access_control_contract_address: str = ""
    asset_contract_address: str = ""
    
    # IPFS
    ipfs_api_url: str = "/dns/localhost/tcp/5001"
    ipfs_gateway_url: str = "http://localhost:8080"
    
    # Security
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    encryption_key: str = "change-me-in-production"
    
    # Anomaly Detection
    anomaly_service_url: str = "http://localhost:8001"
    
    # CORS
    cors_origins: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
```

### 6.4 Contract Deployment Script

```javascript
// contracts/scripts/deploy-all.js

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Deploying DecentraID contracts to Polygon Amoy...\n");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "POL\n");
    
    // Deploy Identity Contract
    console.log("1. Deploying DecentraIDIdentity...");
    const Identity = await hre.ethers.getContractFactory("DecentraIDIdentity");
    const identity = await Identity.deploy();
    await identity.waitForDeployment();
    const identityAddress = await identity.getAddress();
    console.log("   Identity Contract:", identityAddress);
    
    // Deploy Access Control Contract
    console.log("2. Deploying DecentraIDAccessControl...");
    const AccessControl = await hre.ethers.getContractFactory("DecentraIDAccessControl");
    const accessControl = await AccessControl.deploy(identityAddress);
    await accessControl.waitForDeployment();
    const accessAddress = await accessControl.getAddress();
    console.log("   Access Control Contract:", accessAddress);
    
    // Deploy Asset Contract
    console.log("3. Deploying DecentraIDAssets...");
    const Assets = await hre.ethers.getContractFactory("DecentraIDAssets");
    const assets = await Assets.deploy();
    await assets.waitForDeployment();
    const assetsAddress = await assets.getAddress();
    console.log("   Asset Contract:", assetsAddress);
    
    // Grant roles
    console.log("\n4. Setting up roles...");
    const ADMIN_ROLE = hre.ethers.keccak256(
        hre.ethers.toUtf8Bytes("ADMIN_ROLE")
    );
    const ISSUER_ROLE = hre.ethers.keccak256(
        hre.ethers.toUtf8Bytes("ISSUER_ROLE")
    );
    
    await assets.grantRole(ISSUER_ROLE, deployer.address);
    console.log("   Granted ISSUER_ROLE to deployer on Asset Contract");
    
    // Save deployment addresses
    const deploymentDir = path.join(__dirname, "..", "deployments", "amoy");
    if (!fs.existsSync(deploymentDir)) {
        fs.mkdirSync(deploymentDir, { recursive: true });
    }
    
    const deployments = {
        network: "polygon-amoy",
        chainId: 80002,
        deployer: deployer.address,
        contracts: {
            DecentraIDIdentity: identityAddress,
            DecentraIDAccessControl: accessAddress,
            DecentraIDAssets: assetsAddress
        },
        timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
        path.join(deploymentDir, "addresses.json"),
        JSON.stringify(deployments, null, 2)
    );
    
    // Save ABIs
    const identityArtifact = await hre.artifacts.readArtifact("DecentraIDIdentity");
    const accessArtifact = await hre.artifacts.readArtifact("DecentraIDAccessControl");
    const assetArtifact = await hre.artifacts.readArtifact("DecentraIDAssets");
    
    fs.writeFileSync(
        path.join(deploymentDir, "DecentraIDIdentity.json"),
        JSON.stringify({
            address: identityAddress,
            abi: identityArtifact.abi
        }, null, 2)
    );
    
    fs.writeFileSync(
        path.join(deploymentDir, "DecentraIDAccessControl.json"),
        JSON.stringify({
            address: accessAddress,
            abi: accessArtifact.abi
        }, null, 2)
    );
    
    fs.writeFileSync(
        path.join(deploymentDir, "DecentraIDAssets.json"),
        JSON.stringify({
            address: assetsAddress,
            abi: assetArtifact.abi
        }, null, 2)
    );
    
    console.log("\n5. Deployment saved to deployments/amoy/");
    
    // Update .env with contract addresses
    const envPath = path.join(__dirname, "..", "..", ".env");
    let envContent = fs.readFileSync(envPath, "utf8");
    
    envContent = envContent.replace(
        /IDENTITY_CONTRACT_ADDRESS=.*/,
        `IDENTITY_CONTRACT_ADDRESS=${identityAddress}`
    );
    envContent = envContent.replace(
        /ACCESS_CONTROL_CONTRACT_ADDRESS=.*/,
        `ACCESS_CONTROL_CONTRACT_ADDRESS=${accessAddress}`
    );
    envContent = envContent.replace(
        /ASSET_CONTRACT_ADDRESS=.*/,
        `ASSET_CONTRACT_ADDRESS=${assetsAddress}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log("6. Updated .env with contract addresses\n");
    
    console.log("=== Deployment Complete ===");
    console.log(JSON.stringify(deployments, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

### 6.5 Database Migration

```python
# backend/alembic/versions/001_initial.py

"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2024-01-01
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET

revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # DID Documents
    op.create_table(
        'did_documents',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('did', sa.String(100), unique=True, nullable=False, index=True),
        sa.Column('address', sa.String(42), unique=True, nullable=False, index=True),
        sa.Column('public_key', sa.Text, nullable=False),
        sa.Column('encrypted_private_key', JSONB, nullable=True),
        sa.Column('metadata', JSONB, server_default='{}'),
        sa.Column('status', sa.String(20), server_default='active'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('tx_hash', sa.String(66), nullable=True)
    )
    
    # Organizations
    op.create_table(
        'organizations',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('admin_did', sa.String(100), sa.ForeignKey('did_documents(did)'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('settings', JSONB, server_default='{}')
    )
    
    # Organization Members
    op.create_table(
        'org_members',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('org_id', UUID(as_uuid=True), sa.ForeignKey('organizations(id)'), nullable=False),
        sa.Column('did', sa.String(100), sa.ForeignKey('did_documents(did)'), nullable=False),
        sa.Column('role', sa.String(100), nullable=True),
        sa.Column('joined_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('attributes', JSONB, server_default='{}'),
        sa.UniqueConstraint('org_id', 'did', name='uq_org_member')
    )
    
    # Assets
    op.create_table(
        'assets',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('token_id', sa.Integer, nullable=True),
        sa.Column('issuer_did', sa.String(100), sa.ForeignKey('did_documents(did)'), nullable=False, index=True),
        sa.Column('owner_did', sa.String(100), sa.ForeignKey('did_documents(did)'), nullable=False, index=True),
        sa.Column('asset_type', sa.String(50), nullable=False),
        sa.Column('ipfs_hash', sa.String(100), nullable=False),
        sa.Column('document_hash', sa.String(66), nullable=False),
        sa.Column('metadata_uri', sa.Text, nullable=True),
        sa.Column('jurisdiction', sa.String(50), server_default='India'),
        sa.Column('status', sa.String(20), server_default='active'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('tx_hash', sa.String(66), nullable=True)
    )
    
    # Access Logs
    op.create_table(
        'access_logs',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('did', sa.String(100), nullable=False, index=True),
        sa.Column('resource_id', sa.String(100), nullable=False),
        sa.Column('action', sa.String(50), nullable=False),
        sa.Column('granted', sa.Boolean, nullable=False),
        sa.Column('reason', sa.Text, nullable=True),
        sa.Column('request_id', sa.String(100), nullable=True),
        sa.Column('tx_hash', sa.String(66), nullable=True),
        sa.Column('timestamp', sa.DateTime, server_default=sa.func.now(), index=True),
        sa.Column('ip_address', INET, nullable=True),
        sa.Column('user_agent', sa.Text, nullable=True)
    )
    
    # Anomaly Alerts
    op.create_table(
        'anomaly_alerts',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_did', sa.String(100), nullable=False, index=True),
        sa.Column('risk_score', sa.Float, nullable=False),
        sa.Column('anomaly_type', sa.String(50), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('severity', sa.String(20), server_default='medium', index=True),
        sa.Column('anomalous_features', JSONB, server_default='[]'),
        sa.Column('acknowledged', sa.Boolean, server_default='false'),
        sa.Column('acknowledged_by', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    
    # Behavior Profiles
    op.create_table(
        'behavior_profiles',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_did', sa.String(100), unique=True, nullable=False),
        sa.Column('feature_vector', sa.ARRAY(sa.Float), nullable=False),
        sa.Column('baseline_mean', sa.ARRAY(sa.Float), nullable=False),
        sa.Column('baseline_std', sa.ARRAY(sa.Float), nullable=False),
        sa.Column('sample_count', sa.Integer, server_default='0'),
        sa.Column('first_seen', sa.DateTime, nullable=True),
        sa.Column('last_updated', sa.DateTime, server_default=sa.func.now())
    )
    
    # Composite indexes for common queries
    op.create_index('idx_access_logs_did_time', 'access_logs', ['did', 'timestamp'])
    op.create_index('idx_assets_owner_status', 'assets', ['owner_did', 'status'])
    op.create_index('idx_anomaly_time', 'anomaly_alerts', ['created_at'])

def downgrade() -> None:
    op.drop_table('behavior_profiles')
    op.drop_table('anomaly_alerts')
    op.drop_table('access_logs')
    op.drop_table('assets')
    op.drop_table('org_members')
    op.drop_table('organizations')
    op.drop_table('did_documents')
```

---

## 7. Smart Contracts

### 7.1 Identity Contract

```solidity
// contracts/contracts/Identity/DecentraIDIdentity.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DecentraIDIdentity is AccessControl, ReentrancyGuard {
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    
    struct DIDDocument {
        address controller;
        bytes32 publicKeyHash;
        bytes32 metadataHash;
        uint256 created;
        uint256 updated;
        DIDStatus status;
    }
    
    enum DIDStatus { Active, Suspended, Deactivated }
    
    mapping(address => DIDDocument) private didRegistry;
    mapping(address => mapping(bytes32 => bool)) private authorizedMethods;
    mapping(address => uint256) private nonces;
    
    event DIDCreated(address indexed controller, bytes32 publicKeyHash, uint256 timestamp);
    event DIDUpdated(address indexed controller, bytes32 newMetadataHash, uint256 timestamp);
    event DIDSuspended(address indexed controller, uint256 timestamp);
    event DIDReactivated(address indexed controller, uint256 timestamp);
    event DIDDeactivated(address indexed controller, uint256 timestamp);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    function createDID(bytes32 _publicKeyHash, bytes32 _metadataHash) external nonReentrant {
        require(didRegistry[msg.sender].controller == address(0), "DID already exists");
        require(_publicKeyHash != bytes32(0), "Invalid public key hash");
        
        didRegistry[msg.sender] = DIDDocument({
            controller: msg.sender,
            publicKeyHash: _publicKeyHash,
            metadataHash: _metadataHash,
            created: block.timestamp,
            updated: block.timestamp,
            status: DIDStatus.Active
        });
        
        authorizedMethods[msg.sender][keccak256("Authentication")] = true;
        authorizedMethods[msg.sender][keccak256("Assertion")] = true;
        
        emit DIDCreated(msg.sender, _publicKeyHash, block.timestamp);
    }
    
    function resolveDID(address _controller) external view returns (DIDDocument memory) {
        require(didRegistry[_controller].controller != address(0), "DID not found");
        require(didRegistry[_controller].status == DIDStatus.Active, "DID not active");
        return didRegistry[_controller];
    }
    
    function updateDID(bytes32 _newMetadataHash) external nonReentrant {
        require(didRegistry[msg.sender].controller == msg.sender, "Not DID controller");
        require(didRegistry[msg.sender].status == DIDStatus.Active, "DID not active");
        
        didRegistry[msg.sender].metadataHash = _newMetadataHash;
        didRegistry[msg.sender].updated = block.timestamp;
        
        emit DIDUpdated(msg.sender, _newMetadataHash, block.timestamp);
    }
    
    function suspendDID(address _controller) external onlyRole(ADMIN_ROLE) {
        require(didRegistry[_controller].status == DIDStatus.Active, "DID not active");
        didRegistry[_controller].status = DIDStatus.Suspended;
        didRegistry[_controller].updated = block.timestamp;
        emit DIDSuspended(_controller, block.timestamp);
    }
    
    function reactivateDID(address _controller) external onlyRole(ADMIN_ROLE) {
        require(didRegistry[_controller].status == DIDStatus.Suspended, "DID not suspended");
        didRegistry[_controller].status = DIDStatus.Active;
        didRegistry[_controller].updated = block.timestamp;
        emit DIDReactivated(_controller, block.timestamp);
    }
    
    function deactivateDID() external nonReentrant {
        require(didRegistry[msg.sender].controller == msg.sender, "Not DID controller");
        require(didRegistry[msg.sender].status != DIDStatus.Deactivated, "Already deactivated");
        
        didRegistry[msg.sender].status = DIDStatus.Deactivated;
        didRegistry[msg.sender].updated = block.timestamp;
        
        emit DIDDeactivated(msg.sender, block.timestamp);
    }
    
    function isDIDActive(address _controller) external view returns (bool) {
        return didRegistry[_controller].status == DIDStatus.Active;
    }
}
```

### 7.2 Access Control Contract

```solidity
// contracts/contracts/AccessControl/DecentraIDAccessControl.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IIdentity {
    function isDIDActive(address _controller) external view returns (bool);
    function resolveDID(address _controller) external view returns (
        address controller,
        bytes32 publicKeyHash,
        bytes32 metadataHash,
        uint256 created,
        uint256 updated,
        uint8 status
    );
}

contract DecentraIDAccessControl is ReentrancyGuard, Pausable {
    
    IIdentity public immutable identityContract;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    
    struct Role {
        bytes32 roleId;
        string name;
        string description;
        uint256 createdAt;
        address createdBy;
        bool active;
    }
    
    struct Policy {
        bytes32 policyId;
        bytes32 resourceType;
        bytes32 action;
        bytes32[] allowedRoles;
        AttributeCondition[] conditions;
        uint256 validUntil;
        bool active;
    }
    
    struct AttributeCondition {
        bytes32 attributeKey;
        bytes32 operator;
        bytes32[] values;
    }
    
    struct AccessGrant {
        address did;
        bytes32 resourceId;
        bytes32 action;
        uint256 grantedAt;
        uint256 expiresAt;
        bool revoked;
    }
    
    struct AccessRequest {
        address requester;
        bytes32 resourceId;
        bytes32 action;
        uint256 requestedAt;
        uint8 status;
        string reason;
    }
    
    mapping(bytes32 => Role) private roles;
    mapping(address => mapping(bytes32 => bool)) private userRoles;
    mapping(bytes32 => Policy) private policies;
    mapping(bytes32 => AccessGrant) private grants;
    mapping(bytes32 => AccessRequest) private requests;
    mapping(address => uint256) private nonces;
    
    bytes32[] private allRoleIds;
    bytes32[] private allPolicyIds;
    
    uint256 private requestNonce;
    
    event RoleCreated(bytes32 indexed roleId, string name, uint256 timestamp);
    event RoleAssigned(address indexed did, bytes32 indexed roleId, uint256 timestamp);
    event RoleRevoked(address indexed did, bytes32 indexed roleId, uint256 timestamp);
    event PolicyCreated(bytes32 indexed policyId, bytes32 resourceType, uint256 timestamp);
    event PolicyDeactivated(bytes32 indexed policyId, uint256 timestamp);
    event AccessRequested(bytes32 indexed requestId, address indexed requester, bytes32 resourceId, uint256 timestamp);
    event AccessDecided(bytes32 indexed requestId, bool approved, uint256 timestamp);
    event AccessGranted(bytes32 indexed grantId, address indexed did, bytes32 resourceId, uint256 timestamp);
    event AccessRevoked(bytes32 indexed grantId, uint256 timestamp);
    
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "Unauthorized");
        _;
    }
    
    modifier onlyManagerOrAdmin() {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || hasRole(MANAGER_ROLE, msg.sender),
            "Not manager or admin"
        );
        _;
    }
    
    constructor(address _identityContract) {
        identityContract = IIdentity(_identityContract);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // ========== ROLE MANAGEMENT ==========
    
    function createRole(string memory _name, string memory _description)
        external onlyRole(ADMIN_ROLE) returns (bytes32)
    {
        bytes32 roleId = keccak256(abi.encodePacked(_name, block.timestamp, msg.sender));
        
        roles[roleId] = Role({
            roleId: roleId,
            name: _name,
            description: _description,
            createdAt: block.timestamp,
            createdBy: msg.sender,
            active: true
        });
        
        allRoleIds.push(roleId);
        emit RoleCreated(roleId, _name, block.timestamp);
        return roleId;
    }
    
    function assignRole(address _did, bytes32 _roleId)
        external onlyManagerOrAdmin
    {
        require(roles[_roleId].active, "Role not active");
        require(identityContract.isDIDActive(_did), "DID not active");
        require(!userRoles[_did][_roleId], "Already has role");
        
        userRoles[_did][_roleId] = true;
        emit RoleAssigned(_did, _roleId, block.timestamp);
    }
    
    function revokeRole(address _did, bytes32 _roleId)
        external onlyManagerOrAdmin
    {
        require(userRoles[_did][_roleId], "Does not have role");
        
        userRoles[_did][_roleId] = false;
        emit RoleRevoked(_did, _roleId, block.timestamp);
    }
    
    // ========== POLICY MANAGEMENT ==========
    
    function createPolicy(
        bytes32 _resourceType,
        bytes32 _action,
        bytes32[] memory _allowedRoles,
        AttributeCondition[] memory _conditions,
        uint256 _validUntil
    ) external onlyRole(ADMIN_ROLE) returns (bytes32) {
        bytes32 policyId = keccak256(
            abi.encodePacked(_resourceType, _action, block.timestamp)
        );
        
        policies[policyId] = Policy({
            policyId: policyId,
            resourceType: _resourceType,
            action: _action,
            allowedRoles: _allowedRoles,
            conditions: _conditions,
            validUntil: _validUntil,
            active: true
        });
        
        allPolicyIds.push(policyId);
        emit PolicyCreated(policyId, _resourceType, block.timestamp);
        return policyId;
    }
    
    function deactivatePolicy(bytes32 _policyId) external onlyRole(ADMIN_ROLE) {
        require(policies[_policyId].active, "Policy not active");
        policies[_policyId].active = false;
        emit PolicyDeactivated(_policyId, block.timestamp);
    }
    
    // ========== ACCESS REQUEST FLOW ==========
    
    function requestAccess(
        bytes32 _resourceId,
        bytes32 _action,
        string memory _reason
    ) external nonReentrant whenNotPaused returns (bytes32) {
        require(identityContract.isDIDActive(msg.sender), "DID not active");
        
        bytes32 requestId = keccak256(
            abi.encodePacked(msg.sender, _resourceId, _action, block.timestamp, requestNonce++)
        );
        
        requests[requestId] = AccessRequest({
            requester: msg.sender,
            resourceId: _resourceId,
            action: _action,
            requestedAt: block.timestamp,
            status: 0, // Pending
            reason: _reason
        });
        
        emit AccessRequested(requestId, msg.sender, _resourceId, block.timestamp);
        return requestId;
    }
    
    function decideAccess(bytes32 _requestId, bool _approve)
        external onlyManagerOrAdmin nonReentrant
    {
        AccessRequest storage request = requests[_requestId];
        require(request.status == 0, "Request not pending");
        
        request.status = _approve ? 1 : 2; // Approved or Denied
        
        if (_approve) {
            bytes32 grantId = keccak256(
                abi.encodePacked(request.requester, request.resourceId, request.action, block.timestamp)
            );
            
            grants[grantId] = AccessGrant({
                did: request.requester,
                resourceId: request.resourceId,
                action: request.action,
                grantedAt: block.timestamp,
                expiresAt: 0,
                revoked: false
            });
            
            emit AccessGranted(grantId, request.requester, request.resourceId, block.timestamp);
        }
        
        emit AccessDecided(_requestId, _approve, block.timestamp);
    }
    
    // ========== ACCESS CHECK ==========
    
    function checkAccess(address _did, bytes32 _resourceId, bytes32 _action)
        public view returns (bool)
    {
        if (!identityContract.isDIDActive(_did)) return false;
        
        bytes32 policyId = _findMatchingPolicy(_resourceId, _action);
        if (policyId == bytes32(0)) return false;
        
        Policy storage policy = policies[policyId];
        
        if (!policy.active) return false;
        if (policy.validUntil > 0 && block.timestamp > policy.validUntil) return false;
        
        bool hasRole = false;
        for (uint256 i = 0; i < policy.allowedRoles.length; i++) {
            if (userRoles[_did][policy.allowedRoles[i]]) {
                hasRole = true;
                break;
            }
        }
        
        return hasRole;
    }
    
    function _findMatchingPolicy(bytes32 _resourceId, bytes32 _action)
        internal view returns (bytes32)
    {
        for (uint256 i = 0; i < allPolicyIds.length; i++) {
            Policy storage policy = policies[allPolicyIds[i]];
            if (policy.active &&
                policy.resourceType == _resourceId &&
                policy.action == _action &&
                (policy.validUntil == 0 || block.timestamp <= policy.validUntil))
            {
                return allPolicyIds[i];
            }
        }
        return bytes32(0);
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    function getRole(bytes32 _roleId) external view returns (Role memory) {
        return roles[_roleId];
    }
    
    function getUserRoles(address _did) external view returns (bytes32[] memory) {
        bytes32[] memory userRolesList = new bytes32[](allRoleIds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allRoleIds.length; i++) {
            if (userRoles[_did][allRoleIds[i]]) {
                userRolesList[count] = allRoleIds[i];
                count++;
            }
        }
        
        bytes32[] memory result = new bytes32[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = userRolesList[i];
        }
        
        return result;
    }
    
    function getRequest(bytes32 _requestId) external view returns (AccessRequest memory) {
        return requests[_requestId];
    }
    
    function getAllRoleIds() external view returns (bytes32[] memory) {
        return allRoleIds;
    }
    
    function getAllPolicyIds() external view returns (bytes32[] memory) {
        return allPolicyIds;
    }
}
```

### 7.3 NFT Asset Contract

```solidity
// contracts/contracts/Assets/DecentraIDAssets.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DecentraIDAssets is ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl, ReentrancyGuard {
    
    struct AssetMetadata {
        bytes32 assetType;
        bytes32 issuerDID;
        bytes32 ownerDID;
        uint256 issuedAt;
        uint256 expiresAt;
        bytes32 ipfsHash;
        bytes32 documentHash;
        AssetStatus status;
        string jurisdiction;
    }
    
    enum AssetStatus { Active, Revoked, Transferred, Expired }
    
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    
    uint256 private _tokenIdCounter;
    mapping(uint256 => AssetMetadata) private assets;
    mapping(bytes32 => uint256[]) private issuerAssets;
    mapping(bytes32 => uint256[]) private ownerAssets;
    
    event AssetMinted(uint256 indexed tokenId, bytes32 indexed issuerDID, bytes32 assetType, uint256 timestamp);
    event AssetTransferred(uint256 indexed tokenId, bytes32 indexed fromDID, bytes32 indexed toDID, uint256 timestamp);
    event AssetRevoked(uint256 indexed tokenId, bytes32 indexed revokedBy, string reason, uint256 timestamp);
    
    constructor() ERC721("DecentraID Asset", "DIDNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function mintAsset(
        address _to,
        bytes32 _assetType,
        bytes32 _issuerDID,
        bytes32 _ipfsHash,
        bytes32 _documentHash,
        uint256 _expiresAt,
        string memory _uri,
        string memory _jurisdiction
    ) external onlyRole(ISSUER_ROLE) nonReentrant returns (uint256) {
        require(_to != address(0), "Invalid recipient");
        require(_ipfsHash != bytes32(0), "Invalid IPFS hash");
        
        uint256 tokenId = _tokenIdCounter++;
        
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
        
        assets[tokenId] = AssetMetadata({
            assetType: _assetType,
            issuerDID: _issuerDID,
            ownerDID: bytes32(uint256(uint160(_to))),
            issuedAt: block.timestamp,
            expiresAt: _expiresAt,
            ipfsHash: _ipfsHash,
            documentHash: _documentHash,
            status: AssetStatus.Active,
            jurisdiction: _jurisdiction
        });
        
        issuerAssets[_issuerDID].push(tokenId);
        ownerAssets[bytes32(uint256(uint160(_to)))].push(tokenId);
        
        emit AssetMinted(tokenId, _issuerDID, _assetType, block.timestamp);
        return tokenId;
    }
    
    function transferAsset(uint256 _tokenId, address _to)
        public override onlyOwnerOf(_tokenId) nonReentrant
    {
        require(assets[_tokenId].status == AssetStatus.Active, "Asset not active");
        require(
            assets[_tokenId].expiresAt == 0 || block.timestamp < assets[_tokenId].expiresAt,
            "Asset expired"
        );
        
        bytes32 fromDID = assets[_tokenId].ownerDID;
        bytes32 toDID = bytes32(uint256(uint160(_to)));
        
        super.transferFrom(ownerOf(_tokenId), _to, _tokenId);
        
        assets[_tokenId].ownerDID = toDID;
        assets[_tokenId].status = AssetStatus.Transferred;
        
        emit AssetTransferred(_tokenId, fromDID, toDID, block.timestamp);
    }
    
    function revokeAsset(uint256 _tokenId, string memory _reason)
        external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant
    {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        require(assets[_tokenId].status == AssetStatus.Active, "Asset not active");
        
        assets[_tokenId].status = AssetStatus.Revoked;
        
        emit AssetRevoked(
            _tokenId,
            bytes32(uint256(uint160(msg.sender))),
            _reason,
            block.timestamp
        );
    }
    
    function verifyAsset(uint256 _tokenId)
        external view returns (bool valid, AssetMetadata memory metadata)
    {
        metadata = assets[_tokenId];
        
        bool isActive = metadata.status == AssetStatus.Active;
        bool notExpired = metadata.expiresAt == 0 || block.timestamp < metadata.expiresAt;
        bool exists = ownerOf(_tokenId) != address(0);
        
        valid = isActive && notExpired && exists;
    }
    
    function getAsset(uint256 _tokenId) external view returns (AssetMetadata memory) {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        return assets[_tokenId];
    }
    
    function getIssuerAssets(bytes32 _issuerDID) external view returns (uint256[] memory) {
        return issuerAssets[_issuerDID];
    }
    
    function getOwnerAssets(bytes32 _ownerDID) external view returns (uint256[] memory) {
        return ownerAssets[_ownerDID];
    }
    
    // Required overrides
    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721, ERC721Enumerable) returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value)
        internal override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
    
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

### 7.4 Contract Tests

```javascript
// contracts/test/Identity.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentraIDIdentity", function () {
    let identity, deployer, alice, bob;
    const PUBLIC_KEY_HASH = ethers.keccak256(ethers.toUtf8Bytes("alice_public_key"));
    const METADATA_HASH = ethers.keccak256(ethers.toUtf8Bytes("alice_metadata"));

    beforeEach(async function () {
        [deployer, alice, bob] = await ethers.getSigners();
        const Identity = await ethers.getContractFactory("DecentraIDIdentity");
        identity = await Identity.deploy();
        await identity.waitForDeployment();
    });

    describe("DID Creation", function () {
        it("should create a DID successfully", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            const doc = await identity.resolveDID(alice.address);
            
            expect(doc.controller).to.equal(alice.address);
            expect(doc.publicKeyHash).to.equal(PUBLIC_KEY_HASH);
            expect(doc.status).to.equal(0); // Active
        });

        it("should emit DIDCreated event", async function () {
            await expect(identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH))
                .to.emit(identity, "DIDCreated")
                .withArgs(alice.address, PUBLIC_KEY_HASH, await getBlockTimestamp());
        });

        it("should reject duplicate DID creation", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            
            await expect(
                identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH)
            ).to.be.revertedWith("DID already exists");
        });

        it("should reject zero public key hash", async function () {
            await expect(
                identity.connect(alice).createDID(ethers.ZeroHash, METADATA_HASH)
            ).to.be.revertedWith("Invalid public key hash");
        });
    });

    describe("DID Resolution", function () {
        it("should resolve existing active DID", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            const doc = await identity.resolveDID(alice.address);
            
            expect(doc.controller).to.equal(alice.address);
        });

        it("should reject resolution of non-existent DID", async function () {
            await expect(
                identity.resolveDID(alice.address)
            ).to.be.revertedWith("DID not found");
        });
    });

    describe("DID Update", function () {
        it("should update DID metadata", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            
            const newMetadata = ethers.keccak256(ethers.toUtf8Bytes("new_metadata"));
            await identity.connect(alice).updateDID(newMetadata);
            
            const doc = await identity.resolveDID(alice.address);
            expect(doc.metadataHash).to.equal(newMetadata);
        });

        it("should reject update by non-controller", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            
            await expect(
                identity.connect(bob).updateDID(METADATA_HASH)
            ).to.be.revertedWith("Not DID controller");
        });
    });

    describe("DID Suspension", function () {
        it("should suspend DID by admin", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            await identity.suspendDID(alice.address);
            
            await expect(
                identity.resolveDID(alice.address)
            ).to.be.revertedWith("DID not active");
        });

        it("should reactivate suspended DID", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            await identity.suspendDID(alice.address);
            await identity.reactivateDID(alice.address);
            
            const doc = await identity.resolveDID(alice.address);
            expect(doc.status).to.equal(0); // Active
        });

        it("should reject suspension by non-admin", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            
            await expect(
                identity.connect(alice).suspendDID(alice.address)
            ).to.be.reverted;
        });
    });

    describe("DID Deactivation", function () {
        it("should deactivate DID by controller", async function () {
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            await identity.connect(alice).deactivateDID();
            
            await expect(
                identity.resolveDID(alice.address)
            ).to.be.revertedWith("DID not active");
        });
    });

    describe("View Functions", function () {
        it("should correctly report active status", async function () {
            expect(await identity.isDIDActive(alice.address)).to.be.false;
            
            await identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH);
            expect(await identity.isDIDActive(alice.address)).to.be.true;
        });
    });
});

// contracts/test/AccessControl.test.js

describe("DecentraIDAccessControl", function () {
    let identity, accessControl, deployer, alice, bob, charlie;
    let engineerRole, managerRole;
    const RESOURCE_ID = ethers.keccak256(ethers.toUtf8Bytes("project_x"));
    const READ_ACTION = ethers.keccak256(ethers.toUtf8Bytes("read"));

    beforeEach(async function () {
        [deployer, alice, bob, charlie] = await ethers.getSigners();
        
        // Deploy Identity
        const Identity = await ethers.getContractFactory("DecentraIDIdentity");
        identity = await Identity.deploy();
        await identity.waitForDeployment();
        
        // Deploy AccessControl
        const AccessControl = await ethers.getContractFactory("DecentraIDAccessControl");
        accessControl = await AccessControl.deploy(await identity.getAddress());
        await accessControl.waitForDeployment();
        
        // Create DIDs
        const pkHash = ethers.keccak256(ethers.toUtf8Bytes("key"));
        const metaHash = ethers.keccak256(ethers.toUtf8Bytes("meta"));
        
        await identity.connect(alice).createDID(pkHash, metaHash);
        await identity.connect(bob).createDID(pkHash, metaHash);
        await identity.connect(charlie).createDID(pkHash, metaHash);
        
        // Create roles
        const tx1 = await accessControl.createRole("Engineer", "Software engineer");
        const receipt1 = await tx1.wait();
        engineerRole = receipt1.logs[0].args.roleId;
        
        const tx2 = await accessControl.createRole("Manager", "Team manager");
        const receipt2 = await tx2.wait();
        managerRole = receipt2.logs[0].args.roleId;
    });

    describe("Role Management", function () {
        it("should create a role", async function () {
            const tx = await accessControl.createRole("Tester", "QA tester");
            const receipt = await tx.wait();
            const roleId = receipt.logs[0].args.roleId;
            
            const role = await accessControl.getRole(roleId);
            expect(role.name).to.equal("Tester");
        });

        it("should assign role to user", async function () {
            await accessControl.assignRole(bob.address, engineerRole);
            const roles = await accessControl.getUserRoles(bob.address);
            expect(roles).to.include(engineerRole);
        });

        it("should revoke role from user", async function () {
            await accessControl.assignRole(bob.address, engineerRole);
            await accessControl.revokeRole(bob.address, engineerRole);
            const roles = await accessControl.getUserRoles(bob.address);
            expect(roles).to.not.include(engineerRole);
        });
    });

    describe("Access Request Flow", function () {
        it("should create access request", async function () {
            await accessControl.connect(bob).requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
            const requestId = await accessControl.getRequest(...);
            // Verify request was created
        });

        it("should approve access request", async function () {
            await accessControl.connect(bob).requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
            // Get request ID from event
            // Approve as manager
            // Verify grant was created
        });

        it("should deny access request", async function () {
            await accessControl.connect(bob).requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
            // Deny as manager
            // Verify no grant was created
        });
    });

    describe("Access Check", function () {
        it("should grant access when user has required role", async function () {
            // Create policy requiring Engineer role
            await accessControl.createPolicy(
                RESOURCE_ID, READ_ACTION, [engineerRole], [], 0
            );
            
            // Assign Engineer role to bob
            await accessControl.assignRole(bob.address, engineerRole);
            
            // Check access
            const hasAccess = await accessControl.checkAccess(bob.address, RESOURCE_ID, READ_ACTION);
            expect(hasAccess).to.be.true;
        });

        it("should deny access when user lacks required role", async function () {
            await accessControl.createPolicy(
                RESOURCE_ID, READ_ACTION, [engineerRole], [], 0
            );
            
            // charlie has no role
            const hasAccess = await accessControl.checkAccess(charlie.address, RESOURCE_ID, READ_ACTION);
            expect(hasAccess).to.be.false;
        });

        it("should deny access when DID is not active", async function () {
            await accessControl.createPolicy(
                RESOURCE_ID, READ_ACTION, [engineerRole], [], 0
            );
            await accessControl.assignRole(alice.address, engineerRole);
            await identity.suspendDID(alice.address);
            
            const hasAccess = await accessControl.checkAccess(alice.address, RESOURCE_ID, READ_ACTION);
            expect(hasAccess).to.be.false;
        });

        it("should deny access when policy is expired", async function () {
            const futureTime = Math.floor(Date.now() / 1000) + 3600;
            
            await accessControl.createPolicy(
                RESOURCE_ID, READ_ACTION, [engineerRole], [], futureTime
            );
            await accessControl.assignRole(bob.address, engineerRole);
            
            // Access should work initially
            expect(await accessControl.checkAccess(bob.address, RESOURCE_ID, READ_ACTION)).to.be.true;
        });
    });
});
```

---

## 8. Backend API

### 8.1 Main Application

```python
# backend/app/main.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.api.v1.router import api_router
from app.api.health import health_router
from app.middleware.security import SecurityMiddleware
from app.services.blockchain.event_listener import EventListener
from app.core.database import engine, SessionLocal

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    
    # Startup
    print("Starting DecentraID API...")
    
    # Initialize blockchain connection
    event_listener = EventListener()
    await event_listener.connect()
    app.state.event_listener = event_listener
    
    yield
    
    # Shutdown
    print("Shutting down DecentraID API...")
    await event_listener.disconnect()

app = FastAPI(
    title="DecentraID API",
    description="Blockchain-based Identity, Access Control & Asset Management",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SecurityMiddleware)

# Routers
app.include_router(api_router, prefix="/api/v1")
app.include_router(health_router)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

ws_manager = ConnectionManager()

@app.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle client messages if needed
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 8.2 API Router

```python
# backend/app/api/v1/router.py

from fastapi import APIRouter
from app.api.v1 import did, assets, access, policy, anomaly, ipfs, websocket

api_router = APIRouter()

api_router.include_router(did.router, prefix="/did", tags=["DID"])
api_router.include_router(assets.router, prefix="/asset", tags=["Assets"])
api_router.include_router(access.router, prefix="/access", tags=["Access Control"])
api_router.include_router(policy.router, prefix="/policy", tags=["Policies"])
api_router.include_router(anomaly.router, prefix="/anomaly", tags=["Anomaly Detection"])
api_router.include_router(ipfs.router, prefix="/ipfs", tags=["IPFS"])
api_router.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])
```

### 8.3 DID Endpoints

```python
# backend/app/api/v1/did.py

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.did import DIDCreateRequest, DIDResponse, DIDUpdateRequest
from app.services.blockchain.identity_service import IdentityService
from app.services.auth_service import get_current_user
from app.core.security import hash_public_key

router = APIRouter()

@router.post("/create", response_model=DIDResponse)
async def create_did(
    request: DIDCreateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Create a new decentralized identity on Polygon"""
    
    identity_service = IdentityService()
    
    # Check if DID already exists
    address = derive_address(request.public_key)
    did = f"did:decentraid:{address}"
    
    existing = await db.execute(
        select(DIDDocument).where(DIDDocument.did == did)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(400, "DID already exists")
    
    # Hash public key for on-chain storage
    pk_hash = hash_public_key(request.public_key)
    metadata_hash = hash_metadata(request.metadata)
    
    # Register on blockchain
    tx_hash = await identity_service.create_did(pk_hash, metadata_hash)
    
    # Store off-chain metadata
    did_record = DIDDocument(
        did=did,
        address=address,
        public_key=request.public_key,
        metadata=request.metadata,
        status="active",
        tx_hash=tx_hash
    )
    db.add(did_record)
    await db.commit()
    
    return DIDResponse(
        did=did,
        document=await identity_service.resolve_did(did),
        created=did_record.created_at,
        status="active"
    )

@router.get("/{did}", response_model=DIDResponse)
async def resolve_did(did: str, db: AsyncSession = Depends(get_db)):
    """Resolve a DID to its document"""
    
    identity_service = IdentityService()
    document = await identity_service.resolve_did(did)
    
    if not document:
        raise HTTPException(404, "DID not found")
    
    return DIDResponse(
        did=did,
        document=document,
        created=document["created"],
        status=document["status"]
    )

@router.put("/{did}")
async def update_did(
    did: str,
    request: DIDUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update DID metadata"""
    
    if current_user["did"] != did:
        raise HTTPException(403, "Not DID controller")
    
    identity_service = IdentityService()
    new_metadata_hash = hash_metadata(request.metadata)
    
    tx_hash = await identity_service.update_did(new_metadata_hash)
    
    # Update off-chain record
    await db.execute(
        update(DIDDocument)
        .where(DIDDocument.did == did)
        .values(metadata=request.metadata, tx_hash=tx_hash)
    )
    await db.commit()
    
    return {"tx_hash": tx_hash, "status": "updated"}
```

### 8.4 Asset Endpoints

```python
# backend/app/api/v1/assets.py

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.asset import AssetMintRequest, AssetResponse, AssetVerifyResponse
from app.services.blockchain.asset_service import AssetService
from app.services.ipfs_service import IPFSService
from app.services.auth_service import get_current_user
from app.core.security import hash_document

router = APIRouter()

@router.post("/mint")
async def mint_asset(
    request: AssetMintRequest,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mint a new digital asset as NFT"""
    
    # Verify caller is authorized issuer
    if not await verify_issuer_role(current_user["did"], db):
        raise HTTPException(403, "Not authorized as issuer")
    
    # Upload document to IPFS
    ipfs_service = IPFSService()
    content = await file.read()
    document_hash = hash_document(content)
    
    upload_result = await ipfs_service.upload_document(content, {
        "asset_type": request.asset_type,
        "jurisdiction": request.jurisdiction,
        "uploaded_by": current_user["did"]
    })
    
    # Mint NFT on blockchain
    asset_service = AssetService()
    tx_hash = await asset_service.mint_asset(
        to_address=current_user["address"],
        asset_type=request.asset_type,
        issuer_did=current_user["did"],
        ipfs_hash=upload_result["cid"],
        document_hash=document_hash,
        expires_at=request.expires_at,
        metadata_uri=f"ipfs://{upload_result['metadata_cid']}",
        jurisdiction=request.jurisdiction
    )
    
    # Store off-chain metadata
    asset_record = Asset(
        issuer_did=current_user["did"],
        owner_did=current_user["did"],
        asset_type=request.asset_type,
        ipfs_hash=upload_result["cid"],
        document_hash=document_hash,
        jurisdiction=request.jurisdiction,
        tx_hash=tx_hash
    )
    db.add(asset_record)
    await db.commit()
    
    return {"tx_hash": tx_hash, "ipfs_hash": upload_result["cid"]}

@router.get("/{token_id}/verify")
async def verify_asset(token_id: int):
    """Verify asset authenticity on-chain"""
    
    asset_service = AssetService()
    valid, metadata = await asset_service.verify_asset(token_id)
    
    return AssetVerifyResponse(
        token_id=token_id,
        valid=valid,
        owner=metadata["ownerDID"],
        issuer=metadata["issuerDID"],
        status=metadata["status"],
        issued_at=metadata["issuedAt"],
        expires_at=metadata["expiresAt"]
    )

@router.post("/{token_id}/transfer")
async def transfer_asset(
    token_id: int,
    to_did: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Transfer asset ownership"""
    
    asset_service = AssetService()
    
    # Verify current owner
    owner = await asset_service.get_asset_owner(token_id)
    if owner != current_user["did"]:
        raise HTTPException(403, "Not asset owner")
    
    # Resolve recipient DID
    identity_service = IdentityService()
    recipient = await identity_service.resolve_did(to_did)
    if not recipient:
        raise HTTPException(404, "Recipient DID not found")
    
    # Transfer on blockchain
    tx_hash = await asset_service.transfer_asset(
        token_id=token_id,
        to_address=recipient["controller"]
    )
    
    # Update off-chain records
    await db.execute(
        update(Asset)
        .where(Asset.token_id == token_id)
        .values(owner_did=to_did, tx_hash=tx_hash)
    )
    await db.commit()
    
    return {"tx_hash": tx_hash, "status": "transferred"}
```

### 8.5 Access Control Endpoints

```python
# backend/app/api/v1/access.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.access import AccessRequestModel, AccessCheckResponse
from app.services.blockchain.access_service import AccessService
from app.services.auth_service import get_current_user
from app.services.notification_service import NotificationService

router = APIRouter()

@router.post("/request")
async def request_access(
    request: AccessRequestModel,
    current_user: dict = Depends(get_current_user)
):
    """Request access to a resource"""
    
    access_service = AccessService()
    
    request_id = await access_service.request_access(
        did=current_user["did"],
        resource_id=request.resource_id,
        action=request.action,
        reason=request.reason
    )
    
    # Notify managers
    notification_service = NotificationService()
    await notification_service.notify_managers(
        resource_id=request.resource_id,
        request_id=request_id,
        requester=current_user["did"]
    )
    
    return {"request_id": request_id, "status": "pending"}

@router.post("/decide")
async def decide_access(
    request_id: str,
    approve: bool,
    current_user: dict = Depends(get_current_user)
):
    """Approve or deny an access request (manager only)"""
    
    access_service = AccessService()
    
    # Verify manager role
    if not await access_service.verify_manager_role(current_user["did"]):
        raise HTTPException(403, "Not authorized as manager")
    
    tx_hash = await access_service.decide_access(
        request_id=request_id,
        approve=approve,
        manager_did=current_user["did"]
    )
    
    return {"tx_hash": tx_hash, "decision": "approved" if approve else "denied"}

@router.get("/check", response_model=AccessCheckResponse)
async def check_access(
    did: str,
    resource_id: str,
    action: str
):
    """Check if a DID has access to a resource"""
    
    access_service = AccessService()
    
    has_access = await access_service.check_access(
        did=did,
        resource_id=resource_id,
        action=action
    )
    
    return AccessCheckResponse(
        did=did,
        resource_id=resource_id,
        action=action,
        granted=has_access
    )

@router.get("/logs")
async def get_access_logs(
    did: str = None,
    resource_id: str = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get access logs (audit trail)"""
    
    query = select(AccessLog)
    
    if did:
        query = query.where(AccessLog.did == did)
    if resource_id:
        query = query.where(AccessLog.resource_id == resource_id)
    
    query = query.order_by(AccessLog.timestamp.desc()).limit(limit)
    
    result = await db.execute(query)
    logs = result.scalars().all()
    
    return {"logs": logs, "count": len(logs)}
```

### 8.6 Anomaly Detection Endpoints

```python
# backend/app/api/v1/anomaly.py

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from app.services.auth_service import get_current_user
from app.services.anomaly_service import AnomalyService

router = APIRouter()

@router.get("/dashboard")
async def anomaly_dashboard(
    current_user: dict = Depends(get_current_user)
):
    """Get anomaly detection dashboard data"""
    
    anomaly_service = AnomalyService()
    
    alerts = await anomaly_service.get_recent_alerts(
        user_did=current_user["did"],
        limit=50
    )
    
    risk_score = await anomaly_service.calculate_risk_score(
        user_did=current_user["did"]
    )
    
    patterns = await anomaly_service.get_behavior_patterns(
        user_did=current_user["did"]
    )
    
    return {
        "risk_score": risk_score,
        "alerts": alerts,
        "behavior_patterns": patterns,
        "monitoring_since": patterns.get("first_seen"),
        "total_access_events": patterns.get("total_events", 0)
    }

@router.get("/alerts")
async def get_alerts(
    severity: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    current_user: dict = Depends(get_current_user)
):
    """Get filtered anomaly alerts"""
    
    anomaly_service = AnomalyService()
    
    alerts = await anomaly_service.get_alerts(
        severity=severity,
        limit=limit
    )
    
    return {"alerts": alerts, "count": len(alerts)}

@router.post("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(
    alert_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Acknowledge an anomaly alert"""
    
    anomaly_service = AnomalyService()
    
    await anomaly_service.acknowledge_alert(
        alert_id=alert_id,
        acknowledged_by=current_user["did"]
    )
    
    return {"status": "acknowledged"}

@router.get("/profile")
async def get_behavior_profile(
    current_user: dict = Depends(get_current_user)
):
    """Get user's behavioral profile"""
    
    anomaly_service = AnomalyService()
    
    profile = await anomaly_service.get_profile(
        user_did=current_user["did"]
    )
    
    return profile
```

### 8.7 Blockchain Service

```python
# backend/app/services/blockchain/web3_client.py

from web3 import Web3
from web3.middleware import geth_poa_middleware
from typing import Optional
import json
import os

class Web3Client:
    """Manages Web3 connection to Polygon Amoy"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        from app.config import get_settings
        settings = get_settings()
        
        self.w3 = Web3(Web3.HTTPProvider(settings.polygon_amoy_rpc_url))
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        # Load contract ABIs
        deployments_dir = os.path.join(
            os.path.dirname(__file__), 
            "..", "..", "..", "..", 
            "contracts", "deployments", "amoy"
        )
        
        with open(os.path.join(deployments_dir, "DecentraIDIdentity.json")) as f:
            identity_data = json.load(f)
            self.identity_contract = self.w3.eth.contract(
                address=identity_data["address"],
                abi=identity_data["abi"]
            )
        
        with open(os.path.join(deployments_dir, "DecentraIDAccessControl.json")) as f:
            access_data = json.load(f)
            self.access_contract = self.w3.eth.contract(
                address=access_data["address"],
                abi=access_data["abi"]
            )
        
        with open(os.path.join(deployments_dir, "DecentraIDAssets.json")) as f:
            asset_data = json.load(f)
            self.asset_contract = self.w3.eth.contract(
                address=asset_data["address"],
                abi=asset_data["abi"]
            )
        
        # Account for sending transactions
        self.account = self.w3.eth.account.from_key(settings.private_key)
        
        self._initialized = True
    
    def get_balance(self) -> float:
        """Get POL balance of deployer account"""
        balance = self.w3.eth.get_balance(self.account.address)
        return float(self.w3.from_wei(balance, 'ether'))
    
    def get_gas_price(self) -> int:
        """Get current gas price in wei"""
        return self.w3.eth.gas_price
    
    def send_transaction(self, contract_function) -> str:
        """Build, sign, and send a transaction"""
        
        from app.config import get_settings
        settings = get_settings()
        
        tx = contract_function.build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 500000,
            'gasPrice': self.w3.eth.gas_price,
            'chainId': settings.polygon_amoy_chain_id
        })
        
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # Wait for receipt
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        
        return receipt.transactionHash.hex()
```

```python
# backend/app/services/blockchain/identity_service.py

from app.services.blockchain.web3_client import Web3Client
from typing import Optional, Dict

class IdentityService:
    """Service for DID operations on blockchain"""
    
    def __init__(self):
        self.client = Web3Client()
    
    async def create_did(self, public_key_hash: bytes, metadata_hash: bytes) -> str:
        """Create a new DID on-chain"""
        
        contract_fn = self.client.identity_contract.functions.createDID(
            public_key_hash,
            metadata_hash
        )
        
        tx_hash = self.client.send_transaction(contract_fn)
        return tx_hash
    
    async def resolve_did(self, did: str) -> Optional[Dict]:
        """Resolve a DID to its document"""
        
        address = did.split(":")[-1]
        
        try:
            result = self.client.identity_contract.functions.resolveDID(
                Web3.to_checksum_address(address)
            ).call()
            
            return {
                "controller": result[0],
                "publicKeyHash": result[1].hex(),
                "metadataHash": result[2].hex(),
                "created": result[3],
                "updated": result[4],
                "status": ["Active", "Suspended", "Deactivated"][result[5]]
            }
        except Exception as e:
            return None
    
    async def update_did(self, new_metadata_hash: bytes) -> str:
        """Update DID metadata on-chain"""
        
        contract_fn = self.client.identity_contract.functions.updateDID(
            new_metadata_hash
        )
        
        tx_hash = self.client.send_transaction(contract_fn)
        return tx_hash
    
    async def is_did_active(self, did: str) -> bool:
        """Check if a DID is active"""
        
        address = did.split(":")[-1]
        
        try:
            return self.client.identity_contract.functions.isDIDActive(
                Web3.to_checksum_address(address)
            ).call()
        except:
            return False
```

### 8.8 Authentication Service

```python
# backend/app/services/auth_service.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

from app.config import get_settings

security = HTTPBearer()
settings = get_settings()

def create_access_token(did: str, address: str) -> str:
    """Create JWT access token"""
    
    expire = datetime.utcnow() + timedelta(hours=settings.jwt_expiration_hours)
    
    payload = {
        "sub": did,
        "address": address,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)

def verify_token(token: str) -> dict:
    """Verify and decode JWT token"""
    
    try:
        payload = jwt.decode(
            token, 
            settings.jwt_secret, 
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """Extract current user from JWT token"""
    
    payload = verify_token(credentials.credentials)
    
    return {
        "did": payload["sub"],
        "address": payload["address"]
    }
```

---

## 9. Frontend

### 9.1 Main Layout

```tsx
// frontend/src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DecentraID — Decentralized Identity Platform',
  description: 'Blockchain-based Identity, Access Control & Digital Asset Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### 9.2 Dashboard Page

```tsx
// frontend/src/app/dashboard/page.tsx

'use client'

import { useDecentraID } from '@/hooks/useDecentraID'
import { DIDCard } from '@/components/did/DIDCard'
import { AssetGrid } from '@/components/assets/AssetGrid'
import { RiskGauge } from '@/components/anomaly/RiskGauge'
import { AlertList } from '@/components/anomaly/AlertList'
import { WalletConnect } from '@/components/common/WalletConnect'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function Dashboard() {
  const {
    did,
    assets,
    alerts,
    loading,
    error,
    connectWallet,
    fetchAssets,
    fetchAlerts
  } = useDecentraID()

  if (loading) return <LoadingSpinner />
  
  if (!did) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to DecentraID
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to create your decentralized identity
          </p>
          <WalletConnect onClick={connectWallet} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🛡️</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">DecentraID</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {did.id.slice(0, 20)}...
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="text-sm text-gray-500">Total Assets</div>
            <div className="text-3xl font-bold text-gray-900">{assets.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="text-sm text-gray-500">Active Policies</div>
            <div className="text-3xl font-bold text-blue-600">12</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="text-sm text-gray-500">Access Requests</div>
            <div className="text-3xl font-bold text-orange-600">5</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="text-sm text-gray-500">Risk Score</div>
            <div className="text-3xl font-bold text-green-600">12/100</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* DID Card */}
          <div className="col-span-2">
            <DIDCard did={did} />
          </div>

          {/* Risk Gauge */}
          <div>
            <RiskGauge score={12} />
          </div>
        </div>

        {/* Assets Grid */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Digital Assets
          </h2>
          <AssetGrid assets={assets} />
        </div>

        {/* Recent Alerts */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Security Alerts
          </h2>
          <AlertList alerts={alerts} />
        </div>
      </main>
    </div>
  )
}
```

### 9.3 Wallet Connect Component

```tsx
// frontend/src/components/common/WalletConnect.tsx

'use client'

import { useState } from 'react'

interface WalletConnectProps {
  onClick: () => void
}

export function WalletConnect({ onClick }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleClick = async () => {
    setIsConnecting(true)
    try {
      await onClick()
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                 py-3 px-8 rounded-xl shadow-lg transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center gap-3"
    >
      {isConnecting ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" 
                    stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Connect MetaMask
        </>
      )}
    </button>
  )
}
```

### 9.4 DID Card Component

```tsx
// frontend/src/components/did/DIDCard.tsx

import { DIDDocument } from '@/types/did'

interface DIDCardProps {
  did: DIDDocument
}

export function DIDCard({ did }: DIDCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Identity</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${did.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
          }`}>
          {did.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* DID */}
        <div>
          <label className="text-sm text-gray-500">DID</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm 
                           font-mono flex-1 overflow-x-auto">
              {did.id}
            </code>
            <button 
              onClick={() => copyToClipboard(did.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Copy DID"
            >
              📋
            </button>
          </div>
        </div>

        {/* Controller */}
        <div>
          <label className="text-sm text-gray-500">Controller Address</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm 
                           font-mono flex-1 overflow-x-auto">
              {did.controller}
            </code>
            <button 
              onClick={() => copyToClipboard(did.controller)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              📋
            </button>
          </div>
        </div>

        {/* Verification Methods */}
        <div>
          <label className="text-sm text-gray-500">Verification Methods</label>
          <div className="mt-2 space-y-2">
            {did.verificationMethod.map((method, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">{method.type}</div>
                <div className="text-sm font-mono mt-1 truncate">
                  {method.id}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Created */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
          <span>Created: {new Date(did.created).toLocaleDateString()}</span>
          <span>Updated: {new Date(did.updated).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
```

### 9.5 Asset Grid Component

```tsx
// frontend/src/components/assets/AssetGrid.tsx

import { Asset } from '@/types/asset'
import { AssetCard } from './AssetCard'

interface AssetGridProps {
  assets: Asset[]
}

export function AssetGrid({ assets }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-900">No Assets Yet</h3>
        <p className="text-gray-500 mt-2">
          Mint your first digital asset as an NFT
        </p>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg 
                         hover:bg-blue-700 transition">
          Mint Asset
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {assets.map((asset) => (
        <AssetCard key={asset.tokenId} asset={asset} />
      ))}
    </div>
  )
}
```

### 9.6 Asset Card Component

```tsx
// frontend/src/components/assets/AssetCard.tsx

import { Asset } from '@/types/asset'

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    revoked: 'bg-red-100 text-red-800',
    transferred: 'bg-blue-100 text-blue-800',
    expired: 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">#{asset.tokenId}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[asset.status]}`}>
            {asset.status}
          </span>
        </div>
        <div className="text-white/80 text-sm mt-2 capitalize">
          {asset.assetType.replace('_', ' ')}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-500">Issuer</label>
          <div className="text-sm font-mono truncate">{asset.issuerDID}</div>
        </div>
        <div>
          <label className="text-xs text-gray-500">Owner</label>
          <div className="text-sm font-mono truncate">{asset.ownerDID}</div>
        </div>
        <div>
          <label className="text-xs text-gray-500">IPFS Hash</label>
          <div className="text-sm font-mono truncate text-blue-600">
            {asset.ipfsHash}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
          <span>{asset.jurisdiction}</span>
          <span>{new Date(asset.issuedAt * 1000).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm 
                         hover:bg-blue-700 transition">
          Transfer
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm 
                         hover:bg-gray-200 transition">
          Verify
        </button>
      </div>
    </div>
  )
}
```

### 9.7 Risk Gauge Component

```tsx
// frontend/src/components/anomaly/RiskGauge.tsx

interface RiskGaugeProps {
  score: number // 0-100
}

export function RiskGauge({ score }: RiskGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-orange-600'
    if (score >= 40) return 'text-yellow-600'
    if (score >= 20) return 'text-blue-600'
    return 'text-green-600'
  }

  const getLabel = (score: number) => {
    if (score >= 80) return 'Critical'
    if (score >= 60) return 'High'
    if (score >= 40) return 'Medium'
    if (score >= 20) return 'Low'
    return 'Normal'
  }

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Security Risk Score
      </h3>
      
      <div className="flex items-center justify-center">
        <svg width="150" height="150" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={score >= 60 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#22c55e'}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000"
          />
          {/* Score text */}
          <text
            x="50" y="45"
            textAnchor="middle"
            className={`text-3xl font-bold ${getColor(score)}`}
          >
            {score}
          </text>
          <text
            x="50" y="60"
            textAnchor="middle"
            className="text-sm text-gray-500"
          >
            / 100
          </text>
        </svg>
      </div>

      <div className="text-center mt-4">
        <span className={`text-lg font-semibold ${getColor(score)}`}>
          {getLabel(score)}
        </span>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Last 24h events</span>
          <span className="font-medium">847</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Anomalies detected</span>
          <span className="font-medium text-orange-600">3</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">False positives</span>
          <span className="font-medium text-green-600">1</span>
        </div>
      </div>
    </div>
  )
}
```

### 9.8 Main Hook

```tsx
// frontend/src/hooks/useDecentraID.ts

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { DIDDocument, Asset, AnomalyAlert } from '@/types/did'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export function useDecentraID() {
  const [did, setDID] = useState<DIDDocument | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed')
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      // Sign message for authentication
      const signature = await signer.signMessage(
        'Authenticate with DecentraID'
      )
      
      // Login to get JWT
      const loginResponse = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature })
      })
      
      if (!loginResponse.ok) {
        throw new Error('Authentication failed')
      }
      
      const { access_token, did: didDoc } = await loginResponse.json()
      setToken(access_token)
      setDID(didDoc)
      
      // Fetch assets
      await fetchAssets(access_token)
      await fetchAlerts(access_token)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch assets
  const fetchAssets = useCallback(async (authToken?: string) => {
    const useToken = authToken || token
    if (!useToken) return
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/asset/`, {
        headers: { 'Authorization': `Bearer ${useToken}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAssets(data.assets)
      }
    } catch (err) {
      console.error('Failed to fetch assets:', err)
    }
  }, [token])

  // Fetch alerts
  const fetchAlerts = useCallback(async (authToken?: string) => {
    const useToken = authToken || token
    if (!useToken) return
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/anomaly/alerts?limit=20`, {
        headers: { 'Authorization': `Bearer ${useToken}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts)
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    }
  }, [token])

  // Mint asset
  const mintAsset = useCallback(async (params: {
    assetType: string
    file: File
    jurisdiction: string
    expiresAt?: number
  }) => {
    if (!token) throw new Error('Not authenticated')
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('asset_type', params.assetType)
      formData.append('jurisdiction', params.jurisdiction)
      if (params.expiresAt) {
        formData.append('expires_at', params.expiresAt.toString())
      }
      
      const response = await fetch(`${API_BASE}/api/v1/asset/mint`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Minting failed')
      }
      
      const result = await response.json()
      await fetchAssets()
      return result
      
    } finally {
      setLoading(false)
    }
  }, [token, fetchAssets])

  // Request access
  const requestAccess = useCallback(async (
    resourceId: string,
    action: string,
    reason: string
  ) => {
    if (!token) throw new Error('Not authenticated')
    
    const response = await fetch(`${API_BASE}/api/v1/access/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        resource_id: resourceId,
        action,
        reason
      })
    })
    
    return await response.json()
  }, [token])

  // WebSocket for real-time events
  useEffect(() => {
    if (!token) return
    
    const ws = new WebSocket(
      `${API_BASE.replace('http', 'ws')}/ws/events`
    )
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'anomaly_alert') {
        setAlerts(prev => [data.data, ...prev])
      }
      
      if (data.type === 'access_granted' || data.type === 'access_denied') {
        // Refresh data
        fetchAssets()
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    return () => ws.close()
  }, [token, fetchAssets])

  return {
    did,
    assets,
    alerts,
    loading,
    error,
    connectWallet,
    fetchAssets,
    fetchAlerts,
    mintAsset,
    requestAccess
  }
}
```

### 9.9 Types

```typescript
// frontend/src/types/did.ts

export interface DIDDocument {
  id: string
  controller: string
  verificationMethod: VerificationMethod[]
  authentication: string[]
  assertionMethod: string[]
  created: string
  updated: string
  status: 'active' | 'suspended' | 'deactivated'
}

export interface VerificationMethod {
  id: string
  type: string
  controller: string
  publicKeyMultibase: string
}

export interface Asset {
  tokenId: number
  assetType: string
  issuerDID: string
  ownerDID: string
  ipfsHash: string
  documentHash: string
  jurisdiction: string
  issuedAt: number
  expiresAt: number
  status: 'active' | 'revoked' | 'transferred' | 'expired'
}

export interface AnomalyAlert {
  id: string
  userDID: string
  riskScore: number
  severity: 'normal' | 'low' | 'medium' | 'high' | 'critical'
  anomalyType: string
  description: string
  acknowledged: boolean
  createdAt: string
}

export interface AccessRequest {
  requestId: string
  requester: string
  resourceId: string
  action: string
  status: 'pending' | 'approved' | 'denied'
  reason: string
  requestedAt: string
}

export interface Policy {
  policyId: string
  resourceType: string
  action: string
  allowedRoles: string[]
  conditions: AttributeCondition[]
  validUntil: number
  active: boolean
}

export interface AttributeCondition {
  attributeKey: string
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains'
  values: string[]
}
```

---

## 10. AI/ML Anomaly Detection

### 10.1 Requirements

```txt
# anomaly-detection/requirements.txt

tensorflow>=2.15.0
scikit-learn>=1.4.0
numpy>=1.26.0
pandas>=2.1.0
joblib>=1.3.0
fastapi>=0.110.0
uvicorn>=0.29.0
sqlalchemy>=2.0.0
asyncpg>=0.29.0
redis>=5.0.0
pydantic>=2.0.0
python-dotenv>=1.0.0
```

### 10.2 Feature Extraction

```python
# anomaly-detection/app/feature_engine.py

import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from collections import defaultdict

class FeatureExtractor:
    """
    Extracts 15-dimensional feature vectors from access events.
    Features capture temporal, frequency, geographic, and behavioral patterns.
    """
    
    FEATURE_NAMES = [
        "hour_of_day",
        "day_of_week",
        "access_frequency_1h",
        "access_frequency_24h",
        "unique_resources_1h",
        "unique_resources_24h",
        "avg_access_interval",
        "std_access_interval",
        "new_resource_ratio",
        "geo_distance",
        "device_fingerprint",
        "action_type_encoded",
        "resource_sensitivity",
        "concurrent_sessions",
        "time_since_last_login",
    ]
    
    def __init__(self, db_session):
        self.db = db_session
    
    async def extract_features(
        self, 
        user_did: str, 
        current_event: dict
    ) -> np.ndarray:
        """Extract feature vector from current access event"""
        
        now = datetime.utcnow()
        
        # Time features
        hour_of_day = now.hour / 23.0
        day_of_week = now.weekday() / 6.0
        
        # Frequency features
        access_frequency_1h = await self._count_events(
            user_did, now - timedelta(hours=1), now
        )
        access_frequency_24h = await self._count_events(
            user_did, now - timedelta(hours=24), now
        )
        
        # Resource diversity
        unique_resources_1h = await self._count_unique_resources(
            user_did, now - timedelta(hours=1), now
        )
        unique_resources_24h = await self._count_unique_resources(
            user_did, now - timedelta(hours=24), now
        )
        
        # Temporal patterns
        intervals = await self._get_intervals(user_did, limit=50)
        avg_interval = float(np.mean(intervals)) if intervals else 0.0
        std_interval = float(np.std(intervals)) if intervals else 0.0
        
        # New resource detection
        known = await self._get_known_resources(user_did)
        new_resource_ratio = 1.0 if current_event["resource_id"] not in known else 0.0
        
        # Geographic
        geo_distance = await self._calc_distance(
            user_did, current_event.get("ip_address")
        )
        
        # Device
        known_devices = await self._get_known_devices(user_did)
        device_fingerprint = 1.0 if current_event.get("device_id") not in known_devices else 0.0
        
        # Action encoding
        action_map = {"read": 0.0, "write": 0.33, "delete": 0.66, "approve": 1.0}
        action_type_encoded = action_map.get(current_event["action"], 0.5)
        
        # Resource sensitivity
        resource_sensitivity = await self._get_sensitivity(
            current_event["resource_id"]
        )
        
        # Concurrent sessions
        concurrent_sessions = await self._count_sessions(user_did)
        
        # Time since login
        last_login = await self._get_last_login(user_did)
        time_since = (now - last_login).total_seconds() / 3600.0 if last_login else 24.0
        
        return np.array([
            hour_of_day,
            day_of_week,
            min(access_frequency_1h / 10.0, 1.0),
            min(access_frequency_24h / 100.0, 1.0),
            min(unique_resources_1h / 20.0, 1.0),
            min(unique_resources_24h / 50.0, 1.0),
            min(avg_interval / 3600.0, 1.0),
            min(std_interval / 1800.0, 1.0),
            new_resource_ratio,
            min(geo_distance / 10000.0, 1.0),
            device_fingerprint,
            action_type_encoded,
            resource_sensitivity,
            min(concurrent_sessions / 10.0, 1.0),
            min(time_since / 24.0, 1.0),
        ])
    
    async def _count_events(
        self, user_did: str, start: datetime, end: datetime
    ) -> int:
        """Count access events in time window"""
        result = await self.db.execute(
            "SELECT COUNT(*) FROM access_logs WHERE did = :did "
            "AND timestamp BETWEEN :start AND :end",
            {"did": user_did, "start": start, "end": end}
        )
        return result.scalar() or 0
    
    async def _count_unique_resources(
        self, user_did: str, start: datetime, end: datetime
    ) -> int:
        """Count unique resources accessed in time window"""
        result = await self.db.execute(
            "SELECT COUNT(DISTINCT resource_id) FROM access_logs "
            "WHERE did = :did AND timestamp BETWEEN :start AND :end",
            {"did": user_did, "start": start, "end": end}
        )
        return result.scalar() or 0
    
    async def _get_intervals(self, user_did: str, limit: int) -> List[float]:
        """Get intervals between consecutive accesses"""
        result = await self.db.execute(
            "SELECT timestamp FROM access_logs WHERE did = :did "
            "ORDER BY timestamp DESC LIMIT :limit",
            {"did": user_did, "limit": limit + 1}
        )
        timestamps = [row[0] for row in result.fetchall()]
        
        if len(timestamps) < 2:
            return []
        
        intervals = []
        for i in range(len(timestamps) - 1):
            diff = (timestamps[i] - timestamps[i + 1]).total_seconds()
            intervals.append(diff)
        
        return intervals
    
    async def _get_known_resources(self, user_did: str) -> set:
        """Get set of resources user has previously accessed"""
        result = await self.db.execute(
            "SELECT DISTINCT resource_id FROM access_logs WHERE did = :did",
            {"did": user_did}
        )
        return {row[0] for row in result.fetchall()}
    
    async def _calc_distance(
        self, user_did: str, current_ip: Optional[str]
    ) -> float:
        """Calculate geographic distance from usual location"""
        # Simplified: use IP geolocation
        # In production, use MaxMind GeoIP2
        return 0.0
    
    async def _get_known_devices(self, user_did: str) -> set:
        """Get set of known device fingerprints"""
        result = await self.db.execute(
            "SELECT DISTINCT user_agent FROM access_logs WHERE did = :did",
            {"did": user_did}
        )
        return {row[0] for row in result.fetchall()}
    
    async def _get_sensitivity(self, resource_id: str) -> float:
        """Get resource sensitivity level (0-1)"""
        # Map resource types to sensitivity
        sensitivity_map = {
            "public": 0.0,
            "internal": 0.3,
            "confidential": 0.6,
            "secret": 0.8,
            "top_secret": 1.0
        }
        return sensitivity_map.get("internal", 0.5)
    
    async def _count_sessions(self, user_did: str) -> int:
        """Count concurrent active sessions"""
        result = await self.db.execute(
            "SELECT COUNT(DISTINCT user_agent) FROM access_logs "
            "WHERE did = :did AND timestamp > NOW() - INTERVAL '30 minutes'",
            {"did": user_did}
        )
        return result.scalar() or 0
    
    async def _get_last_login(self, user_did: str) -> Optional[datetime]:
        """Get timestamp of last login"""
        result = await self.db.execute(
            "SELECT timestamp FROM access_logs WHERE did = :did "
            "AND action = 'login' ORDER BY timestamp DESC LIMIT 1",
            {"did": user_did}
        )
        row = result.fetchone()
        return row[0] if row else None
```

### 10.3 Anomaly Detection Model

```python
# anomaly-detection/app/detector.py

import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os
from typing import Dict

class AnomalyDetector:
    """
    Ensemble anomaly detection combining:
    1. Autoencoder (reconstruction-based anomaly detection)
    2. Isolation Forest (statistical outlier detection)
    
    Risk score is weighted average of both models.
    """
    
    def __init__(self, input_dim: int = 15, model_path: str = "./models"):
        self.input_dim = input_dim
        self.model_path = model_path
        self.autoencoder = None
        self.isolation_forest = None
        self.scaler = None
        self.threshold = None
        self._loaded = False
    
    def _build_autoencoder(self) -> keras.Model:
        """Build autoencoder architecture"""
        
        encoder_input = keras.Input(shape=(self.input_dim,), name='input')
        
        # Encoder
        x = keras.layers.Dense(32, activation='relu', name='enc_1')(encoder_input)
        x = keras.layers.BatchNormalization(name='bn_1')(x)
        x = keras.layers.Dropout(0.2, name='drop_1')(x)
        x = keras.layers.Dense(16, activation='relu', name='enc_2')(x)
        x = keras.layers.BatchNormalization(name='bn_2')(x)
        encoded = keras.layers.Dense(8, activation='relu', name='bottleneck')(x)
        
        # Decoder
        x = keras.layers.Dense(16, activation='relu', name='dec_1')(encoded)
        x = keras.layers.BatchNormalization(name='bn_3')(x)
        x = keras.layers.Dense(32, activation='relu', name='dec_2')(x)
        x = keras.layers.BatchNormalization(name='bn_4')(x)
        decoded = keras.layers.Dense(self.input_dim, activation='sigmoid', name='output')(x)
        
        model = keras.Model(encoder_input, decoded, name='anomaly_autoencoder')
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        return model
    
    def train(
        self, 
        normal_data: np.ndarray,
        epochs: int = 100,
        batch_size: int = 32,
        validation_split: float = 0.2
    ) -> Dict:
        """Train the ensemble on normal behavior data"""
        
        # Initialize models
        self.autoencoder = self._build_autoencoder()
        self.isolation_forest = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=200,
            max_samples='auto'
        )
        self.scaler = StandardScaler()
        
        # Scale features
        scaled_data = self.scaler.fit_transform(normal_data)
        
        # Train autoencoder
        print("Training autoencoder...")
        history = self.autoencoder.fit(
            scaled_data, scaled_data,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=validation_split,
            callbacks=[
                keras.callbacks.EarlyStopping(
                    patience=10,
                    restore_best_weights=True,
                    monitor='val_loss'
                ),
                keras.callbacks.ReduceLROnPlateau(
                    factor=0.5,
                    patience=5,
                    min_lr=1e-6
                )
            ],
            verbose=1
        )
        
        # Calculate threshold from reconstruction errors
        reconstructed = self.autoencoder.predict(scaled_data, verbose=0)
        mse = np.mean(np.power(scaled_data - reconstructed, 2), axis=1)
        self.threshold = float(np.percentile(mse, 95))
        
        print(f"Training threshold (95th percentile): {self.threshold:.6f}")
        
        # Train Isolation Forest
        print("Training Isolation Forest...")
        self.isolation_forest.fit(scaled_data)
        
        # Save models
        self.save()
        
        return {
            "autoencoder_loss": float(history.history['loss'][-1]),
            "val_loss": float(history.history['val_loss'][-1]),
            "threshold": self.threshold,
            "training_samples": len(normal_data),
            "epochs_trained": len(history.history['loss'])
        }
    
    def predict(self, features: np.ndarray) -> Dict:
        """
        Predict anomaly score for a single feature vector.
        Returns risk_score (0-100), severity, and model details.
        """
        
        if not self._loaded:
            self.load()
        
        # Scale features
        scaled = self.scaler.transform(features.reshape(1, -1))
        
        # Autoencoder reconstruction error
        reconstructed = self.autoencoder.predict(scaled, verbose=0)
        reconstruction_error = float(np.mean(np.power(scaled - reconstructed, 2)))
        autoencoder_score = min((reconstruction_error / self.threshold) * 50, 100)
        
        # Isolation Forest score
        anomaly_label = self.isolation_forest.predict(scaled)[0]
        anomaly_score_raw = self.isolation_forest.decision_function(scaled)[0]
        isolation_score = max(0, min((0.5 - anomaly_score_raw) * 100, 100))
        
        # Ensemble: weighted average
        risk_score = 0.5 * autoencoder_score + 0.5 * isolation_score
        risk_score = round(min(max(risk_score, 0), 100), 2)
        
        # Determine severity
        if risk_score >= 80:
            severity = "critical"
        elif risk_score >= 60:
            severity = "high"
        elif risk_score >= 40:
            severity = "medium"
        elif risk_score >= 20:
            severity = "low"
        else:
            severity = "normal"
        
        return {
            "risk_score": risk_score,
            "severity": severity,
            "is_anomaly": risk_score >= 50,
            "details": {
                "autoencoder_score": round(autoencoder_score, 2),
                "isolation_forest_score": round(isolation_score, 2),
                "reconstruction_error": round(reconstruction_error, 6),
                "threshold": round(self.threshold, 6),
                "anomaly_label": int(anomaly_label)
            }
        }
    
    def save(self):
        """Save all model components to disk"""
        os.makedirs(self.model_path, exist_ok=True)
        
        self.autoencoder.save(os.path.join(self.model_path, 'autoencoder.keras'))
        joblib.dump(self.isolation_forest, os.path.join(self.model_path, 'isolation_forest.pkl'))
        joblib.dump(self.scaler, os.path.join(self.model_path, 'scaler.pkl'))
        joblib.dump(self.threshold, os.path.join(self.model_path, 'threshold.pkl'))
        
        print(f"Models saved to {self.model_path}")
    
    def load(self):
        """Load all model components from disk"""
        self.autoencoder = keras.models.load_model(
            os.path.join(self.model_path, 'autoencoder.keras')
        )
        self.isolation_forest = joblib.load(
            os.path.join(self.model_path, 'isolation_forest.pkl')
        )
        self.scaler = joblib.load(
            os.path.join(self.model_path, 'scaler.pkl')
        )
        self.threshold = joblib.load(
            os.path.join(self.model_path, 'threshold.pkl')
        )
        
        self._loaded = True
        print(f"Models loaded from {self.model_path}")
```

### 10.4 Model Training Script

```python
# anomaly-detection/app/model_trainer.py

import numpy as np
import pandas as pd
from detector import AnomalyDetector
from feature_engine import FeatureExtractor
import asyncio

async def generate_synthetic_data(n_samples: int = 10000) -> np.ndarray:
    """
    Generate synthetic normal behavior data for training.
    In production, this would come from actual access logs.
    """
    
    np.random.seed(42)
    
    data = np.zeros((n_samples, 15))
    
    # Hour of day: mostly 9-18 (work hours)
    data[:, 0] = np.random.normal(0.5, 0.2, n_samples).clip(0, 1)
    
    # Day of week: mostly weekdays
    data[:, 1] = np.random.uniform(0, 0.7, n_samples)
    
    # Access frequency 1h: typically 2-10
    data[:, 2] = np.random.poisson(5, n_samples) / 10.0
    
    # Access frequency 24h: typically 20-80
    data[:, 3] = np.random.poisson(50, n_samples) / 100.0
    
    # Unique resources 1h: typically 1-5
    data[:, 4] = np.random.poisson(3, n_samples) / 20.0
    
    # Unique resources 24h: typically 5-20
    data[:, 5] = np.random.poisson(10, n_samples) / 50.0
    
    # Average interval: typically 300-1800 seconds
    data[:, 6] = np.random.lognormal(7, 0.5, n_samples) / 3600.0
    
    # Std interval: typically smaller than mean
    data[:, 7] = np.random.lognormal(5, 0.5, n_samples) / 1800.0
    
    # New resource ratio: mostly 0 (accessing known resources)
    data[:, 8] = np.random.choice([0, 0, 0, 0, 0, 0, 0, 0, 0, 1], n_samples)
    
    # Geo distance: mostly 0 (same location)
    data[:, 9] = np.random.exponential(0.05, n_samples)
    
    # Device fingerprint: mostly 0 (known device)
    data[:, 10] = np.random.choice([0, 0, 0, 0, 0, 0, 0, 0, 0, 1], n_samples)
    
    # Action type: mostly reads
    data[:, 11] = np.random.choice([0, 0, 0, 0, 0, 0, 0, 0.33, 0.66, 1.0], n_samples)
    
    # Resource sensitivity: varies
    data[:, 12] = np.random.uniform(0, 0.7, n_samples)
    
    # Concurrent sessions: usually 1
    data[:, 13] = np.random.poisson(1, n_samples) / 10.0
    
    # Time since login: typically 0-8 hours
    data[:, 14] = np.random.exponential(2, n_samples) / 24.0
    
    return data.clip(0, 1)

async def main():
    """Main training pipeline"""
    
    print("=== Anomaly Detection Model Training ===\n")
    
    # Generate synthetic data (replace with real data in production)
    print("1. Generating training data...")
    normal_data = await generate_synthetic_data(n_samples=10000)
    print(f"   Generated {len(normal_data)} samples with {normal_data.shape[1]} features\n")
    
    # Initialize and train detector
    print("2. Training anomaly detector...")
    detector = AnomalyDetector(input_dim=15, model_path="./models")
    results = detector.train(
        normal_data=normal_data,
        epochs=100,
        batch_size=32,
        validation_split=0.2
    )
    
    print(f"\n3. Training results:")
    print(f"   Autoencoder loss: {results['autoencoder_loss']:.6f}")
    print(f"   Validation loss: {results['val_loss']:.6f}")
    print(f"   Threshold: {results['threshold']:.6f}")
    print(f"   Training samples: {results['training_samples']}")
    print(f"   Epochs trained: {results['epochs_trained']}\n")
    
    # Test with normal data
    print("4. Testing with normal data...")
    test_normal = normal_data[:100]
    normal_scores = [detector.predict(x)["risk_score"] for x in test_normal]
    print(f"   Normal data - Mean risk: {np.mean(normal_scores):.2f}, "
          f"Max risk: {np.max(normal_scores):.2f}\n")
    
    # Test with anomalous data
    print("5. Testing with anomalous data...")
    anomalous_data = np.random.uniform(0.7, 1.0, (100, 15))
    anomaly_scores = [detector.predict(x)["risk_score"] for x in anomalous_data]
    print(f"   Anomalous data - Mean risk: {np.mean(anomaly_scores):.2f}, "
          f"Max risk: {np.max(anomaly_scores):.2f}\n")
    
    # Calculate metrics
    true_positives = sum(1 for s in anomaly_scores if s >= 50)
    true_negatives = sum(1 for s in normal_scores if s < 50)
    
    accuracy = (true_positives + true_negatives) / 200
    print(f"6. Evaluation metrics:")
    print(f"   Accuracy: {accuracy:.2%}")
    print(f"   True positive rate: {true_positives}/100")
    print(f"   True negative rate: {true_negatives}/100")
    
    print("\n=== Training Complete ===")

if __name__ == "__main__":
    asyncio.run(main())
```

### 10.5 Anomaly Detection Pipeline

```python
# anomaly-detection/app/pipeline.py

import asyncio
from datetime import datetime
from typing import Dict, Optional
from feature_engine import FeatureExtractor
from detector import AnomalyDetector

class AnomalyDetectionPipeline:
    """
    Real-time pipeline that processes access events
    and generates anomaly alerts.
    """
    
    def __init__(
        self,
        detector: AnomalyDetector,
        feature_extractor: FeatureExtractor,
        db_session,
        alert_callback=None
    ):
        self.detector = detector
        self.feature_extractor = feature_extractor
        self.db = db_session
        self.alert_callback = alert_callback
    
    async def process_event(self, event: Dict) -> Dict:
        """
        Process a single access event.
        Returns detection result with risk score and details.
        """
        
        user_did = event["did"]
        
        # Step 1: Extract features
        features = await self.feature_extractor.extract_features(user_did, event)
        
        # Step 2: Get anomaly prediction
        prediction = self.detector.predict(features)
        
        # Step 3: Calculate z-scores for explainability
        profile = await self._get_profile(user_did)
        z_scores = np.zeros(15)
        if profile:
            mean = np.array(profile["baseline_mean"])
            std = np.array(profile["baseline_std"])
            z_scores = (features - mean) / std
        
        # Step 4: Identify anomalous features
        feature_names = self.feature_extractor.FEATURE_NAMES
        anomalous_features = []
        for name, z in zip(feature_names, z_scores):
            if abs(z) > 2.0:
                anomalous_features.append({
                    "feature": name,
                    "z_score": round(float(z), 2),
                    "direction": "above" if z > 0 else "below"
                })
        
        # Step 5: Build result
        result = {
            "user_did": user_did,
            "event_type": event.get("action", "unknown"),
            "resource_id": event.get("resource_id", "unknown"),
            "risk_score": prediction["risk_score"],
            "severity": prediction["severity"],
            "is_anomaly": prediction["is_anomaly"],
            "anomalous_features": anomalous_features,
            "model_scores": prediction["details"],
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Step 6: Store result
        await self._store_result(result)
        
        # Step 7: Update profile
        await self._update_profile(user_did, features)
        
        # Step 8: Generate alert if anomaly
        if prediction["is_anomaly"]:
            alert = await self._generate_alert(result)
            if self.alert_callback:
                await self.alert_callback(alert)
        
        return result
    
    async def _get_profile(self, user_did: str) -> Optional[Dict]:
        """Get behavioral profile for user"""
        result = await self.db.execute(
            "SELECT * FROM behavior_profiles WHERE user_did = :did",
            {"did": user_did}
        )
        row = result.fetchone()
        if row:
            return {
                "baseline_mean": row.baseline_mean,
                "baseline_std": row.baseline_std,
                "sample_count": row.sample_count
            }
        return None
    
    async def _store_result(self, result: Dict):
        """Store detection result in database"""
        await self.db.execute(
            """INSERT INTO anomaly_alerts 
               (user_did, risk_score, anomaly_type, description, 
                severity, anomalous_features)
               VALUES (:did, :risk, :type, :desc, :severity, :features)""",
            {
                "did": result["user_did"],
                "risk": result["risk_score"],
                "type": self._classify_type(result),
                "desc": self._generate_description(result),
                "severity": result["severity"],
                "features": result["anomalous_features"]
            }
        )
        await self.db.commit()
    
    async def _update_profile(self, user_did: str, features):
        """Update behavioral profile with new observation"""
        
        profile = await self._get_profile(user_did)
        
        if not profile:
            # Create new profile
            await self.db.execute(
                """INSERT INTO behavior_profiles 
                   (user_did, feature_vector, baseline_mean, baseline_std, sample_count)
                   VALUES (:did, :fv, :mean, :std, 1)""",
                {
                    "did": user_did,
                    "fv": features.tolist(),
                    "mean": features.tolist(),
                    "std": np.ones(15).tolist()
                }
            )
        else:
            # Update with exponential moving average
            old_mean = np.array(profile["baseline_mean"])
            old_std = np.array(profile["baseline_std"])
            n = profile["sample_count"]
            
            decay = 0.95
            new_mean = decay * old_mean + (1 - decay) * features
            new_std = decay * old_std + (1 - decay) * np.abs(features - new_mean)
            
            await self.db.execute(
                """UPDATE behavior_profiles 
                   SET baseline_mean = :mean, baseline_std = :std, 
                       sample_count = sample_count + 1, last_updated = NOW()
                   WHERE user_did = :did""",
                {
                    "did": user_did,
                    "mean": new_mean.tolist(),
                    "std": new_std.tolist()
                }
            )
        
        await self.db.commit()
    
    async def _generate_alert(self, result: Dict) -> Dict:
        """Generate alert record"""
        
        alert = {
            "user_did": result["user_did"],
            "risk_score": result["risk_score"],
            "severity": result["severity"],
            "anomaly_type": self._classify_type(result),
            "description": self._generate_description(result),
            "anomalous_features": result["anomalous_features"],
            "created_at": datetime.utcnow()
        }
        
        return alert
    
    def _classify_type(self, result: Dict) -> str:
        """Classify anomaly type based on features"""
        
        features = [f["feature"] for f in result["anomalous_features"]]
        
        if "geo_distance" in features:
            return "geographic_anomaly"
        elif "device_fingerprint" in features:
            return "new_device"
        elif "hour_of_day" in features:
            return "unusual_time"
        elif "access_frequency_1h" in features:
            return "excessive_access"
        elif "new_resource_ratio" in features:
            return "unauthorized_resource_access"
        elif "concurrent_sessions" in features:
            return "session_anomaly"
        return "behavioral_anomaly"
    
    def _generate_description(self, result: Dict) -> str:
        """Generate human-readable description"""
        
        anomaly_type = self._classify_type(result)
        score = result["risk_score"]
        
        descriptions = {
            "geographic_anomaly": f"Access from unusual location. Risk: {score}/100",
            "new_device": f"Access from unrecognized device. Risk: {score}/100",
            "unusual_time": f"Access at unusual hour. Risk: {score}/100",
            "excessive_access": f"Abnormally high access frequency. Risk: {score}/100",
            "unauthorized_resource_access": f"Accessing never-before-seen resources. Risk: {score}/100",
            "session_anomaly": f"Multiple concurrent sessions detected. Risk: {score}/100",
            "behavioral_anomaly": f"Overall behavioral deviation. Risk: {score}/100"
        }
        
        return descriptions.get(anomaly_type, f"Unknown anomaly. Risk: {score}/100")
```

---

## 11. IPFS Integration

### 11.1 IPFS Service

```python
# backend/app/services/ipfs_service.py

import ipfshttpclient
import hashlib
import json
from typing import Dict, Optional
from app.config import get_settings

class IPFSService:
    """
    Manages document storage on IPFS.
    Documents are content-addressed — the CID is derived from content.
    """
    
    def __init__(self):
        settings = get_settings()
        self.client = ipfshttpclient.connect(settings.ipfs_api_url)
    
    async def upload_document(self, content: bytes, metadata: dict) -> Dict:
        """
        Upload document to IPFS.
        Returns CID, document hash, and metadata CID.
        """
        
        # Calculate document hash
        document_hash = hashlib.sha256(content).hexdigest()
        
        # Upload document
        doc_cid = self.client.add_bytes(content)
        
        # Create and upload metadata
        metadata.update({
            "document_hash": document_hash,
            "document_cid": doc_cid,
            "content_type": metadata.get("content_type", "application/octet-stream")
        })
        
        metadata_json = json.dumps(metadata).encode()
        metadata_cid = self.client.add_bytes(metadata_json)
        
        return {
            "cid": doc_cid,
            "metadata_cid": metadata_cid,
            "document_hash": document_hash,
            "size": len(content)
        }
    
    async def retrieve_document(self, cid: str) -> bytes:
        """Retrieve document from IPFS by CID"""
        return self.client.cat(cid)
    
    async def verify_content(self, cid: str, expected_hash: str) -> bool:
        """Verify IPFS content matches expected hash"""
        content = await self.retrieve_document(cid)
        actual_hash = hashlib.sha256(content).hexdigest()
        return actual_hash == expected_hash
    
    async def pin_document(self, cid: str):
        """Pin document to ensure availability"""
        self.client.pin.add(cid)
    
    async def get_document_info(self, cid: str) -> Optional[Dict]:
        """Get document info from IPFS"""
        try:
            info = self.client.object.stat(cid)
            return {
                "cid": cid,
                "size": info["CumulativeSize"],
                "links": info["Links"]
            }
        except:
            return None
```

---

## 12. Database Schema

Already covered in Section 6.5 (Migration). Here is the summary:

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| did_documents | DID metadata (off-chain) | did, address, public_key, status |
| organizations | Organization info | name, admin_did |
| org_members | User-org membership | org_id, did, role, attributes |
| assets | NFT metadata (off-chain) | token_id, issuer_did, owner_did, ipfs_hash |
| access_logs | Immutable audit trail | did, resource_id, action, granted, timestamp |
| anomaly_alerts | Security alerts | user_did, risk_score, severity |
| behavior_profiles | ML behavior baselines | user_did, baseline_mean, baseline_std |

---

## 13. Docker & Deployment

### 13.1 Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: decentraid
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d decentraid"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  ipfs-node:
    image: ipfs/kubo:latest
    ports:
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ipfs-data:/data/ipfs

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/decentraid
      - REDIS_URL=redis://redis:6379
      - POLYGON_AMOY_RPC_URL=${POLYGON_AMOY_RPC_URL}
      - PRIVATE_KEY=${PRIVATE_KEY}
      - IDENTITY_CONTRACT_ADDRESS=${IDENTITY_CONTRACT_ADDRESS}
      - ACCESS_CONTROL_CONTRACT_ADDRESS=${ACCESS_CONTROL_CONTRACT_ADDRESS}
      - ASSET_CONTRACT_ADDRESS=${ASSET_CONTRACT_ADDRESS}
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - IPFS_API_URL=/dns/ipfs-node/tcp/5001
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      ipfs-node:
        condition: service_started

  anomaly-detector:
    build:
      context: ./anomaly-detection
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/decentraid
      - REDIS_URL=redis://redis:6379
      - MODEL_PATH=/models
    volumes:
      - model-data:/models
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/events

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./infra/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

volumes:
  postgres-data:
  redis-data:
  ipfs-data:
  model-data:
```

### 13.2 Backend Dockerfile

```dockerfile
# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run migrations
RUN alembic upgrade head

# Start server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 13.3 Frontend Dockerfile

```dockerfile
# frontend/Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
```

### 13.4 Anomaly Detection Dockerfile

```dockerfile
# anomaly-detection/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8001

# Start server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 13.5 Nginx Configuration

```nginx
# infra/nginx/nginx.conf

events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    upstream anomaly {
        server anomaly-detector:8001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=60r/m;

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }

        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # WebSocket
        location /ws/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_read_timeout 86400;
        }

        # Anomaly Detection
        location /anomaly/ {
            proxy_pass http://anomaly;
            proxy_set_header Host $host;
        }

        # API Documentation
        location /docs {
            proxy_pass http://backend;
        }

        location /redoc {
            proxy_pass http://backend;
        }
    }
}
```

---

## 14. Testing Strategy

### 14.1 Smart Contract Tests

```bash
# Run contract tests
cd contracts
npx hardhat test

# Run with coverage
npx hardhat coverage

# Run Slither static analysis
slither ./contracts --checklist
```

**Test Coverage Targets:**

| Component | Target Coverage |
|-----------|----------------|
| Identity Contract | 100% functions, 95% branches |
| Access Control Contract | 100% functions, 90% branches |
| NFT Asset Contract | 100% functions, 95% branches |
| Integration Tests | All user flows |

### 14.2 Backend Tests

```bash
# Run all backend tests
cd backend
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api/test_did.py -v
```

**Test Categories:**

```python
# backend/tests/conftest.py

import pytest
from httpx import AsyncClient
from app.main import app
from app.core.database import get_db, engine

@pytest.fixture(scope="session")
def event_loop():
    import asyncio
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def db_session():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        yield conn
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
def auth_headers():
    """Generate valid JWT for testing"""
    from app.services.auth_service import create_access_token
    token = create_access_token(
        did="did:decentraid:0xTestAddress",
        address="0xTestAddress"
    )
    return {"Authorization": f"Bearer {token}"}
```

### 14.3 Frontend Tests

```bash
# Run frontend tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests (if Cypress/Playwright installed)
npm run test:e2e
```

### 14.4 Load Testing

```bash
# Using k6 for load testing
k6 run --vus 50 --duration 30s loadtest.js
```

```javascript
// loadtest.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // Test access check endpoint
  const res = http.get(
    'http://localhost:8000/api/v1/access/check?did=did:decentraid:0x...&resource_id=test&action=read'
  );
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

---

## 15. Security Audit Checklist

### 15.1 Smart Contract Security

- [ ] All external calls use ReentrancyGuard
- [ ] Access control checked on every state-changing function
- [ ] No integer overflow/underflow (Solidity 0.8.x)
- [ ] Slither static analysis passes with no high-severity issues
- [ ] All functions have event emissions for audit trail
- [ ] External input validation on all parameters
- [ ] Gas limits considered for all loops
- [ ] No hardcoded addresses or values
- [ ] Testnet deployment before mainnet
- [ ] Formal verification of critical functions

### 15.2 API Security

- [ ] JWT authentication on all protected endpoints
- [ ] Rate limiting: 60 requests/minute per IP
- [ ] Input validation via Pydantic schemas
- [ ] SQL injection prevention (parameterized queries)
- [ ] CORS configured for allowed origins only
- [ ] HTTPS enforced in production
- [ ] Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- [ ] Request body size limit (10MB)
- [ ] No sensitive data in logs
- [ ] Error messages don't leak internal details

### 15.3 Data Security

- [ ] Private keys encrypted with AES-256-GCM
- [ ] Encryption key derived via PBKDF2 (600K iterations)
- [ ] Database connections encrypted (SSL)
- [ ] Redis password protected
- [ ] IPFS content verified by hash
- [ ] No private keys in version control
- [ ] Environment variables for all secrets
- [ ] Database backups encrypted

### 15.4 Infrastructure Security

- [ ] Docker containers run as non-root
- [ ] No exposed ports except 80, 443, 3000
- [ ] SSH key-based authentication only
- [ ] Firewall rules configured
- [ ] Regular dependency updates
- [ ] Log rotation configured
- [ ] Monitoring and alerting active

---

## 16. Timeline & Milestones

### 16.1 8-Week Development Plan

```
WEEK 1: FOUNDATION
├── Day 1-2: Repository setup, environment configuration
├── Day 3-4: Smart contract development (Identity + Access Control)
├── Day 5-6: Smart contract development (NFT Asset)
├── Day 7: Contract testing and Slither analysis
└── Deliverable: Working smart contracts on local Hardhat

WEEK 2: BLOCKCHAIN DEPLOYMENT
├── Day 1-2: Deploy contracts to Polygon Amoy testnet
├── Day 3-4: Backend project setup, database schema, migrations
├── Day 5-6: Web3 client service, contract interaction
├── Day 7: Integration testing (backend + contracts)
└── Deliverable: Backend can create/resolve DIDs on Polygon

WEEK 3: CORE API
├── Day 1-2: DID API endpoints (create, resolve, update)
├── Day 3-4: Asset API endpoints (mint, transfer, verify)
├── Day 5-6: Access Control API endpoints (request, decide, check)
├── Day 7: API documentation and testing
└── Deliverable: Full REST API functional

WEEK 4: FRONTEND CORE
├── Day 1-2: Project setup, wallet connection, DID creation
├── Day 3-4: Dashboard layout, DID card, asset grid
├── Day 5-6: Asset minting form, transfer modal
├── Day 7: Access request and policy management UI
└── Deliverable: Frontend can interact with all API endpoints

WEEK 5: AI/ML
├── Day 1-2: Feature extraction pipeline
├── Day 3-4: Autoencoder model training
├── Day 5-6: Isolation Forest training, ensemble integration
├── Day 7: Real-time detection pipeline
└── Deliverable: Anomaly detection model trained and serving

WEEK 6: INTEGRATION
├── Day 1-2: WebSocket real-time events
├── Day 3-4: Anomaly dashboard UI
├── Day 5-6: IPFS integration end-to-end
├── Day 7: Security middleware and rate limiting
└── Deliverable: Full system integrated

WEEK 7: TESTING & POLISH
├── Day 1-2: Smart contract test coverage >95%
├── Day 3-4: Backend API test coverage >90%
├── Day 5-6: Frontend component testing
├── Day 7: Load testing, performance optimization
└── Deliverable: All tests passing, performance acceptable

WEEK 8: DEMO PREPARATION
├── Day 1-2: Docker Compose deployment
├── Day 3-4: Demo data seeding, sample scenarios
├── Day 5: End-to-end demo walkthrough
├── Day 6: Bug fixes, edge case handling
├── Day 7: Final review, backup demo recording
└── Deliverable: Demo-ready system
```

### 16.2 Milestones

| Milestone | Week | Deliverable |
|-----------|------|-------------|
| M1: Smart Contracts | 1 | Contracts deployed on Amoy testnet |
| M2: Backend API | 3 | Full REST API functional |
| M3: Frontend MVP | 4 | Dashboard with wallet, DID, assets |
| M4: AI/ML Model | 5 | Anomaly detection trained and serving |
| M5: Integration | 6 | All components connected |
| M6: Testing | 7 | >90% test coverage |
| M7: Demo Ready | 8 | Deployed and demo-able |

---

## 17. Cost Breakdown

### 17.1 Development Costs

| Item | Cost | Notes |
|------|------|-------|
| Polygon Amoy testnet | Free | Testnet POL from faucet |
| IPFS (Pinata free tier) | Free | 1GB storage, 100GB bandwidth |
| Domain name | ~Rs 500/year | .com or .in |
| Hosting (Vercel free) | Free | For frontend |
| PostgreSQL (Supabase free) | Free | 500MB database |
| Redis (Upstash free) | Free | 10K commands/day |
| GPU (already owned) | Rs 0 | RTX 3060 6GB |
| **Total** | **~Rs 500/year** | |

### 17.2 Production Costs (Estimated)

| Item | Monthly Cost | Annual Cost |
|------|-------------|-------------|
| Polygon mainnet gas | ~Rs 1,000 | ~Rs 12,000 |
| IPFS (4GB storage) | ~Rs 500 | ~Rs 6,000 |
| VPS (4 vCPU, 8GB RAM) | ~Rs 2,000 | ~Rs 24,000 |
| Domain + SSL | ~Rs 50 | ~Rs 600 |
| Monitoring (optional) | ~Rs 500 | ~Rs 6,000 |
| **Total** | **~Rs 4,050/month** | **~Rs 48,600/year** |

---

## 18. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Smart contract bug | Medium | High | OpenZeppelin templates, 95%+ test coverage, Slither analysis |
| Polygon network congestion | Low | Medium | Polygon L2 handles 65K TPS, Redis caching |
| AI/ML false positives | Medium | Medium | Ensemble model, feedback loop, configurable thresholds |
| User loses private key | Medium | High | Social recovery, encrypted backup, wallet abstraction |
| IPFS content unavailable | Low | Medium | Pinning service, fallback to centralized storage |
| GPU unavailable for demo | Low | High | Pre-record backup demo, CPU inference fallback |
| Team member unavailable | Medium | Medium | Cross-training, documentation, pair programming |
| API rate limiting issues | Low | Low | Configurable limits, Redis caching |

---

## 19. Appendix

### 19.1 Polygon Amoy Testnet Setup

```
1. Open MetaMask
2. Click Network dropdown → Add Network
3. Click "Add a network manually"
4. Enter:
   - Network Name: Polygon Amoy Testnet
   - RPC URL: https://rpc-amoy.polygon.technology
   - Chain ID: 80002
   - Currency Symbol: POL
   - Block Explorer URL: https://amoy.polygonscan.com
5. Click Save
6. Visit https://faucet.polygon.technology
7. Select Amoy testnet
8. Connect MetaMask
9. Request 0.5 POL
10. Wait for confirmation (~30 seconds)
```

### 19.2 Useful Commands

```bash
# Smart Contracts
cd contracts
npx hardhat compile                    # Compile contracts
npx hardhat test                       # Run tests
npx hardhat run scripts/deploy-all.js --network amoy  # Deploy
npx hardhat verify --network amoy CONTRACT_ADDRESS     # Verify

# Backend
cd backend
alembic upgrade head                   # Run migrations
alembic revision --autogenerate -m "description"  # Create migration
uvicorn app.main:app --reload          # Start dev server
pytest                                 # Run tests

# Frontend
cd frontend
npm run dev                            # Start dev server
npm run build                          # Build for production
npm test                               # Run tests

# Anomaly Detection
cd anomaly-detection
python app/model_trainer.py            # Train models
uvicorn app.main:app --reload --port 8001  # Start dev server

# Docker
docker compose up -d                   # Start all services
docker compose logs -f backend         # View backend logs
docker compose down                    # Stop all services
docker compose ps                      # View running services
```

### 19.3 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/did/create | No | Create new DID |
| GET | /api/v1/did/{did} | No | Resolve DID |
| PUT | /api/v1/did/{did} | Yes | Update DID |
| POST | /api/v1/asset/mint | Yes | Mint NFT asset |
| GET | /api/v1/asset/{id}/verify | No | Verify asset |
| POST | /api/v1/asset/{id}/transfer | Yes | Transfer asset |
| POST | /api/v1/access/request | Yes | Request access |
| POST | /api/v1/access/decide | Yes | Approve/deny request |
| GET | /api/v1/access/check | No | Check access |
| GET | /api/v1/access/logs | Yes | Get audit logs |
| POST | /api/v1/policy/create | Yes | Create policy |
| GET | /api/v1/anomaly/dashboard | Yes | Anomaly dashboard |
| GET | /api/v1/anomaly/alerts | Yes | Get alerts |
| POST | /api/v1/anomaly/alerts/{id}/acknowledge | Yes | Acknowledge alert |
| POST | /api/v1/ipfs/upload | Yes | Upload to IPFS |
| GET | /api/v1/ipfs/{cid} | No | Retrieve from IPFS |
| GET | /api/v1/health | No | Health check |
| WS | /ws/events | No | Real-time events |

### 19.4 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| POLYGON_AMOY_RPC_URL | Yes | - | Polygon Amoy RPC endpoint |
| PRIVATE_KEY | Yes | - | Deployer wallet private key |
| IDENTITY_CONTRACT_ADDRESS | Yes | - | Deployed Identity contract |
| ACCESS_CONTROL_CONTRACT_ADDRESS | Yes | - | Deployed Access Control contract |
| ASSET_CONTRACT_ADDRESS | Yes | - | Deployed Asset contract |
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| REDIS_URL | Yes | - | Redis connection string |
| JWT_SECRET | Yes | - | JWT signing secret |
| ENCRYPTION_KEY | Yes | - | Data encryption key |
| IPFS_API_URL | Yes | - | IPFS API endpoint |
| POLYGONSCAN_API_KEY | No | - | For contract verification |
| ANOMALY_SERVICE_URL | No | http://localhost:8001 | ML service URL |
| CORS_ORIGINS | No | http://localhost:3000 | Allowed CORS origins |
| LOG_LEVEL | No | INFO | Logging level |

---

**End of Planning Document**
