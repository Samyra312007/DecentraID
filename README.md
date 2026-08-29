# DecentraID

**Blockchain-Based Secure Platform for Identity, Access Control & Digital Asset Management**

> Your Identity. Your Assets. Your Control.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue.svg)](https://soliditylang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-green.svg)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Backend API](#backend-api)
- [Frontend](#frontend)
- [Anomaly Detection (AI/ML)](#anomaly-detection-aiml)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [Cost Breakdown](#cost-breakdown)
- [References](#references)
- [License](#license)

---

## Problem Statement

**Problem Statement ID:** SIH26125  
**Organization:** Bharat Electronics Limited (BEL)  
**Theme:** Blockchain & Cybersecurity  
**Category:** Software

Every organization today relies on centralized Identity and Access Management (IAM) systems. This creates a single point of failure. When that one server is compromised, ALL user identities and access rights are at risk. Additionally, there is no tamper-proof way to prove who owns what digital asset such as documents, licenses, or certificates.

### The Broken System (Current State)

- One server equals one organization
- Password database becomes the prime target for attackers
- If hacked, ALL accounts are compromised simultaneously
- No cross-organization verification possible
- Digital asset ownership tracked in spreadsheets with no proof

### What Should Exist

- User owns their own identity (self-sovereign)
- Cryptographic proof instead of passwords
- Tamper-proof blockchain record
- Cross-organization verification built in
- Digital assets represented as NFTs on-chain

### Real-World Impact

| Metric | Data |
|--------|------|
| Data breaches involving human element | 74% (Verizon 2024) |
| Average cost of a data breach | $4.88 million (IBM 2024) |
| Identity fraud losses in India annually | Rs 50,000 Crore |
| Average time to detect a breach | 194 days |
| Organizations with weak IAM systems | 67% |

---

## Solution Overview

DecentraID is a blockchain-based platform where users own their identity (DID), organizations control access through smart contracts, and digital assets are verifiable NFTs -- all without a central authority.

### How DecentraID Addresses the Problem

| Problem | Our Solution | Result |
|---------|-------------|--------|
| Centralized identity equals single point of failure | Decentralized DID where user owns keys | No single point of failure |
| No reliable asset ownership proof | NFT-based digital assets on-chain | Verifiable, transferable assets |
| Manual access control equals human error | Smart contract RBAC plus ABAC | Automated, auditable access |
| No cross-org trust verification | Blockchain-verified credentials | Instant trust verification |

### Key Innovations

1. **Unified Architecture** -- Identity, Access Control, and Assets combined into a single platform. Most projects do only one or two of these.

2. **Smart Contract Access Control** -- RBAC and ABAC enforced on-chain, not just in a database. Access rules become tamper-proof code that cannot be altered by administrators.

3. **NFT-Based Digital Assets** -- Every digital asset has provable, transferable ownership. Not just a database entry -- a real blockchain record that anyone can verify independently.

4. **AI-Powered Anomaly Detection** -- Machine learning models detect unusual access patterns. Proactive security instead of reactive. Learns each user's normal behavior and flags deviations.

5. **W3C DID Standard** -- Interoperable with global standards. Vendor-agnostic. Cross-organization verification built into the protocol.

### Comparison with Traditional IAM

| Feature | Traditional IAM | DecentraID |
|---------|----------------|-----------|
| Identity Storage | Central server | Blockchain (decentralized) |
| Access Control | Database rules | Smart contracts (on-chain) |
| Asset Ownership | Spreadsheet or Database | NFTs (verifiable) |
| Cross-org Trust | Manual verification | Cryptographic proof |
| Anomaly Detection | None or Rule-based | AI/ML powered |
| Tamper Evidence | Logs (can be altered) | Blockchain (immutable) |

---

## Architecture

```
+-----------------------------------------------------------+
|                  Presentation Layer                        |
|          Next.js 14  |  React 18  |  Tailwind CSS          |
+-----------------------------------------------------------+
|                     API Gateway                            |
|              Python FastAPI  |  JWT Auth  |  WebSocket     |
+-----------------------------------------------------------+
|                  Smart Contract Layer                      |
|   Identity  |  Access Control (RBAC/ABAC)  |  NFT Assets   |
|              Solidity 0.8.28  |  OpenZeppelin 5.x          |
+-----------------------------------------------------------+
|                    Blockchain Layer                        |
|           Polygon L2 (Amoy Testnet)                        |
|           65,000 TPS  |  < Rs 1 per transaction            |
+-----------------------------------------------------------+
|                    AI/ML Layer                             |
|       Anomaly Detection  |  Behavioral Profiling           |
|              TensorFlow  |  scikit-learn                   |
+-----------------------------------------------------------+
|                      Data Layer                            |
|         PostgreSQL  |  Redis  |  IPFS                      |
+-----------------------------------------------------------+
```

### End-to-End Workflow

**Step 1 -- Identity Creation:**  
User generates DID and cryptographic key pair. DID is stored on blockchain (example: `did:decentraid:0x...`). User controls their own private key.

**Step 2 -- Organization Onboarding:**  
Organization registers on platform, defines roles. Creates access control policies as smart contracts. Deploys on-chain (example: "Engineer" can access repos, "Manager" can approve transfers).

**Step 3 -- Asset Tokenization:**  
Digital asset such as document, license, or certificate is minted as NFT with metadata on blockchain. Ownership is linked to user's DID. Transfer and revocation recorded on-chain.

**Step 4 -- Access Request:**  
User requests access to a resource. System verifies DID and checks smart contract rules. Access is granted or denied based on on-chain policies. Response in seconds, not days.

**Step 5 -- Monitoring and Audit:**  
AI/ML monitors access patterns. Detects anomalies such as unusual time, location, or behavior. Alerts generated. Immutable audit trail maintained on blockchain.

---

## Quick Start

### Prerequisites

- Node.js 20.x LTS
- Python 3.11+
- Docker and Docker Compose
- MetaMask browser extension
- Git 2.40+

### Option A: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Samyra312007/DecentraID.git
cd DecentraID

# Copy and configure environment
cp .env.example .env
# Edit .env with your values (see Configuration section below)

# Start all services
docker compose up -d

# Verify services are running
docker compose ps
```

### Option B: Manual Setup

```bash
# Clone the repository
git clone https://github.com/Samyra312007/DecentraID.git
cd DecentraID

# Smart contracts
cd contracts
npm install
npx hardhat compile
npx hardhat test

# Backend
cd ../backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev

# Anomaly detection (in a new terminal)
cd anomaly-detection
pip install -r requirements.txt
python -m app.train  # Train the model first
uvicorn app.main:app --reload --port 8001
```

### Service Endpoints

| Service | URL | Description |
|---------|-----|-------------|
| Frontend Dashboard | http://localhost:3000 | Next.js web application |
| Backend API | http://localhost:8000 | FastAPI REST endpoints |
| API Documentation | http://localhost:8000/docs | Swagger/OpenAPI docs |
| Anomaly Detection | http://localhost:8001 | ML inference service |
| IPFS | http://localhost:5001 | Decentralized storage |
| Nginx (via Docker) | http://localhost:80 | Reverse proxy |

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

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

# ========== REDIS ==========
REDIS_URL=redis://localhost:6379

# ========== IPFS ==========
IPFS_API_URL=/ip4/127.0.0.1/tcp/5001
IPFS_GATEWAY_URL=http://localhost:8080

# ========== SECURITY ==========
JWT_SECRET=generate_with_openssl_rand_hex_32
ENCRYPTION_KEY=generate_with_openssl_rand_hex_32
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# ========== ANOMALY DETECTION ==========
ANOMALY_SERVICE_URL=http://localhost:8001

# ========== APPLICATION ==========
APP_NAME=DecentraID
APP_VERSION=1.0.0
DEBUG=true
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

### Generating Secret Keys

```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate ENCRYPTION_KEY
openssl rand -hex 32
```

### MetaMask Configuration

| Parameter | Value |
|-----------|-------|
| Network Name | Polygon Amoy Testnet |
| RPC URL | https://rpc-amoy.polygon.technology |
| Chain ID | 80002 |
| Currency Symbol | POL |
| Block Explorer | https://amoy.polygonscan.com |

Get testnet POL from [Polygon Faucet](https://faucet.polygon.technology).

---

## Project Structure

```
DecentraID/
|-- contracts/                          # Solidity Smart Contracts
|   |-- contracts/
|   |   |-- Identity/
|   |   |   `-- DecentraIDIdentity.sol  # DID management (create, resolve, suspend)
|   |   |-- AccessControl/
|   |   |   `-- DecentraIDAccessControl.sol  # RBAC + ABAC on-chain
|   |   |-- Assets/
|   |   |   `-- DecentraIDAssets.sol    # ERC-721 NFT for digital assets
|   |   `-- interfaces/
|   |       |-- IIdentity.sol
|   |       |-- IAccessControl.sol
|   |       `-- IAssets.sol
|   |-- scripts/
|   |   |-- deploy-all.js               # Deploy all 3 contracts
|   |   |-- deploy.js                   # Deploy individual contracts
|   |   `-- verify.js                   # Verify on Polygonscan
|   |-- test/                           # 106 passing tests
|   |   |-- Identity.test.js
|   |   |-- AccessControl.test.js
|   |   |-- Assets.test.js
|   |   `-- Integration.test.js
|   |-- hardhat.config.js
|   `-- package.json
|
|-- backend/                            # Python FastAPI Backend
|   |-- app/
|   |   |-- main.py                     # FastAPI entry point
|   |   |-- config.py                   # Pydantic settings
|   |   |-- api/
|   |   |   |-- v1/
|   |   |   |   |-- router.py           # API v1 router
|   |   |   |   |-- did.py              # DID endpoints
|   |   |   |   |-- assets.py           # Asset endpoints
|   |   |   |   |-- access.py           # Access control endpoints
|   |   |   |   |-- policy.py           # Policy endpoints
|   |   |   |   |-- anomaly.py          # Anomaly endpoints
|   |   |   |   |-- ipfs.py             # IPFS endpoints
|   |   |   |   |-- auth.py             # Wallet authentication
|   |   |   |   `-- websocket.py        # WebSocket handler
|   |   |   `-- health.py               # Health check
|   |   |-- services/
|   |   |   |-- blockchain/
|   |   |   |   |-- web3_client.py      # Web3 connection manager
|   |   |   |   |-- identity_service.py # DID blockchain operations
|   |   |   |   |-- access_service.py   # Access control blockchain ops
|   |   |   |   |-- asset_service.py    # NFT blockchain operations
|   |   |   |   `-- event_listener.py   # Blockchain event listener
|   |   |   |-- anomaly_service.py      # Anomaly detection orchestration
|   |   |   |-- audit_service.py        # Audit logging
|   |   |   |-- auth_service.py         # JWT authentication
|   |   |   |-- ipfs_service.py         # IPFS upload/retrieve
|   |   |   `-- notification_service.py # WebSocket notifications
|   |   |-- models/                     # SQLAlchemy ORM models
|   |   |-- schemas/                    # Pydantic request/response schemas
|   |   |-- middleware/                 # Security, rate limiting, CORS
|   |   |-- core/                       # Database, security, exceptions
|   |   `-- utils/                      # DID utils, crypto utils, validators
|   |-- alembic/                        # Database migrations
|   |   `-- versions/
|   |       |-- 001_initial.py          # Initial schema
|   |       `-- 002_add_indexes.py      # Performance indexes
|   |-- tests/                          # 46 backend tests
|   |-- requirements.txt
|   `-- Dockerfile
|
|-- frontend/                           # Next.js Frontend
|   |-- src/
|   |   |-- app/                        # Pages (App Router)
|   |   |   |-- layout.tsx             # Root layout with sidebar
|   |   |   |-- page.tsx               # Landing page
|   |   |   |-- dashboard/page.tsx     # Main dashboard
|   |   |   |-- did/                   # DID management pages
|   |   |   |-- assets/                # NFT asset pages
|   |   |   |-- access/                # Access control pages
|   |   |   |-- anomaly/               # Anomaly dashboard
|   |   |   `-- settings/              # User settings
|   |   |-- components/
|   |   |   |-- layout/                # Sidebar, Header, Footer
|   |   |   |-- did/                   # DIDCard, DIDCreateForm
|   |   |   |-- assets/                # AssetCard, MintForm, TransferModal
|   |   |   |-- access/                # AccessRequestCard, PolicyForm, RoleManager
|   |   |   |-- anomaly/               # RiskGauge, AlertList, BehaviorChart
|   |   |   `-- common/                # WalletConnect, LoadingSpinner, ErrorBoundary
|   |   |-- hooks/
|   |   |   |-- useDecentraID.ts       # Main hook (wallet, DID, assets, alerts)
|   |   |   |-- useDID.ts              # DID operations
|   |   |   |-- useAssets.ts           # Asset operations
|   |   |   |-- useAccess.ts           # Access control operations
|   |   |   |-- useAnomaly.ts          # Anomaly detection
|   |   |   `-- useWebSocket.ts        # Real-time events
|   |   |-- lib/
|   |   |   |-- api.ts                 # API client
|   |   |   |-- contracts.ts           # Contract ABIs and addresses
|   |   |   |-- web3.ts                # Web3 provider setup
|   |   |   `-- utils.ts               # Utility functions
|   |   `-- types/                      # TypeScript type definitions
|   |-- tests/                          # 28 frontend tests
|   |-- package.json
|   |-- next.config.js
|   |-- tsconfig.json
|   `-- Dockerfile
|
|-- anomaly-detection/                  # AI/ML Service
|   |-- app/
|   |   |-- main.py                     # FastAPI service (port 8001)
|   |   |-- config.py                   # Service configuration
|   |   |-- feature_extraction.py       # 15-dimensional feature vectors
|   |   |-- detection_pipeline.py       # Real-time detection pipeline
|   |   |-- behavioral_profiling.py     # User behavior profiling
|   |   |-- synthetic_data.py           # Synthetic data generator
|   |   `-- train.py                    # Model training script
|   |-- app/models/
|   |   |-- ensemble.py                 # Ensemble detector (AE + IF)
|   |   |-- autoencoder.py             # TensorFlow autoencoder
|   |   `-- isolation_forest.py        # scikit-learn Isolation Forest
|   |-- models/                         # Trained model files
|   |-- notebooks/                      # Jupyter notebooks
|   |   |-- 01_data_exploration.ipynb
|   |   |-- 02_model_training.ipynb
|   |   `-- 03_evaluation.ipynb
|   |-- data/                           # Synthetic training data
|   |-- tests/                          # 66 ML tests
|   |-- requirements.txt
|   `-- Dockerfile
|
|-- infra/                              # Infrastructure
|   |-- nginx/
|   |   |-- default.conf                # Reverse proxy config
|   |   `-- ssl/                        # SSL certificates
|   |-- scripts/
|   |   |-- deploy.sh                   # One-click deployment
|   |   |-- health_check.sh             # Service health monitoring
|   |   `-- backup.sh                   # Database backup automation
|   `-- monitoring/
|       |-- docker-compose.monitoring.yml  # Prometheus + Grafana stack
|       |-- prometheus.yml
|       `-- grafana/                    # Dashboard configs
|
|-- docs/                               # Documentation
|   |-- architecture.md                 # System architecture
|   |-- api-reference.md                # Full API documentation
|   |-- deployment.md                   # Deployment guide
|   |-- smart-contracts.md              # Contract documentation
|   |-- security-checklist.md           # Security audit checklist
|   `-- demo-walkthrough.md             # Step-by-step demo guide
|
|-- .github/workflows/
|   `-- ci.yml                          # GitHub Actions CI pipeline
|
|-- docker-compose.yml                  # Multi-container setup
|-- .env.example                        # Environment template
|-- setup.sh                            # One-click setup script
|-- loadtest.js                         # k6 load testing script
`-- LICENSE                             # MIT License
```

---

## Smart Contracts

### DecentraIDIdentity

The identity contract manages decentralized identifiers (DIDs) on Polygon. Each Ethereum address can create exactly one DID, which stores a public key hash and metadata hash on-chain.

**Key Functions:**
- `createDID(publicKeyHash, metadataHash)` -- Register a new DID
- `resolveDID(controller)` -- Look up a DID document
- `updateDID(newMetadataHash)` -- Update DID metadata (controller only)
- `suspendDID(controller)` -- Suspend a DID (admin only)
- `reactivateDID(controller)` -- Reactivate a suspended DID
- `deactivateDID()` -- Permanently deactivate (controller only)

### DecentraIDAccessControl

The access control contract implements both Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) entirely on-chain. It links to the Identity contract to verify DID status.

**Key Functions:**
- `createRole(name, description)` -- Define a new role
- `assignRole(did, roleId)` -- Assign role to a user
- `revokeUserRole(did, roleId)` -- Remove a role from a user
- `createPolicy(resourceType, action, allowedRoles, conditions, validUntil)` -- Create an access policy
- `requestAccess(resourceId, action, reason)` -- Request access to a resource
- `decideAccess(requestId, approve)` -- Manager approves or denies
- `checkAccess(did, resourceId, action)` -- Verify if a user has access

### DecentraIDAssets

An ERC-721 NFT contract for digital assets. Each asset is minted with metadata linking it to the issuer's DID, IPFS hash, and document hash. Assets can be transferred, revoked, and verified on-chain.

**Key Functions:**
- `mintAsset(to, assetType, issuerDID, ipfsHash, ...)` -- Mint a new NFT asset
- `transferAsset(tokenId, to)` -- Transfer ownership
- `revokeAsset(tokenId, reason)` -- Revoke an asset (admin only)
- `verifyAsset(tokenId)` -- Check if an asset is valid, active, and not expired

### Contract Testing

```bash
cd contracts
npx hardhat test           # Run all 106 tests
npx hardhat coverage       # Generate coverage report
```

Test categories: Deployment (8), DID Lifecycle (18), Role Management (12), Policy Management (8), Access Request Flow (8), Access Check (7), Asset Operations (20), Integration (7), View Functions (8), Pause/Unpause (3), Enumeration (2), Edge Cases (5).

---

## Backend API

### Authentication

All protected endpoints require a JWT Bearer token obtained via wallet signature authentication.

```bash
# Login with wallet signature
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"address": "0x...", "signature": "0x..."}'
```

### REST API Endpoints

#### DID Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/did/create` | No | Create new DID |
| GET | `/api/v1/did/{did}` | No | Resolve DID |
| PUT | `/api/v1/did/{did}` | Yes | Update DID metadata |

#### Asset Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/asset/mint` | Yes | Mint NFT asset |
| GET | `/api/v1/asset/list` | Yes | List user assets |
| GET | `/api/v1/asset/{id}/verify` | No | Verify asset authenticity |
| POST | `/api/v1/asset/{id}/transfer` | Yes | Transfer asset ownership |

#### Access Control

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/access/request` | Yes | Request access to resource |
| POST | `/api/v1/access/decide` | Yes | Approve or deny access request |
| GET | `/api/v1/access/check` | No | Check if DID has access |
| GET | `/api/v1/access/logs` | Yes | Retrieve audit logs |

#### Policy Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/policy/create` | Yes | Create access policy |
| GET | `/api/v1/policy/list` | Yes | List all policies |
| DELETE | `/api/v1/policy/{id}` | Yes | Deactivate policy |

#### Anomaly Detection

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/anomaly/dashboard` | Yes | Get anomaly dashboard data |
| GET | `/api/v1/anomaly/alerts` | Yes | Get filtered alerts |
| POST | `/api/v1/anomaly/alerts/{id}/acknowledge` | Yes | Acknowledge an alert |
| GET | `/api/v1/anomaly/profile` | Yes | Get behavioral profile |

#### IPFS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/ipfs/upload` | Yes | Upload document to IPFS |
| GET | `/api/v1/ipfs/{cid}` | No | Retrieve document from IPFS |

#### Infrastructure

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Service health check |
| WS | `/ws/events` | No | Real-time event notifications |

### Anomaly Detection Service (port 8001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |
| POST | `/detect` | Detect single event anomaly |
| POST | `/detect/batch` | Batch anomaly detection |
| GET | `/profile/{user_id}` | Get user behavioral profile |
| GET | `/features` | Get feature dimension info |
| GET | `/stats` | Pipeline statistics |
| POST | `/initialize` | Initialize or retrain models |

---

## Frontend

The frontend is built with Next.js 14 (App Router), React 18, Tailwind CSS v4, and ethers.js for blockchain interaction.

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Welcome page with wallet connect |
| Dashboard | `/dashboard` | Overview with stats, assets, alerts |
| DID Create | `/did/create` | Create a new decentralized identity |
| DID Detail | `/did/[did]` | DID document view |
| Asset List | `/assets` | NFT asset gallery |
| Asset Mint | `/assets/mint` | Mint new digital asset |
| Asset Detail | `/assets/[tokenId]` | Asset details and transfer |
| Access Management | `/access` | Manage roles and policies |
| Access Request | `/access/request` | Request resource access |
| Anomaly Dashboard | `/anomaly` | Risk score, alerts, behavior chart |
| Settings | `/settings` | User settings |

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useDecentraID` | Main hook: wallet connection, DID, assets, alerts |
| `useDID` | DID creation and resolution |
| `useAssets` | Asset minting, transfer, verification |
| `useAccess` | Access requests and policy management |
| `useAnomaly` | Anomaly dashboard, alerts, profiles |
| `useWebSocket` | Real-time event subscription |

---

## Anomaly Detection (AI/ML)

The anomaly detection system uses an **ensemble approach** combining two complementary models:

1. **Autoencoder** -- A neural network trained on normal behavior data. Detects anomalies by measuring reconstruction error. High reconstruction error means the input pattern deviates from normal.

2. **Isolation Forest** -- A statistical algorithm that isolates outliers by randomly partitioning feature space. Anomalies are isolated in fewer partitions, giving them shorter path lengths.

### 15 Feature Dimensions

| Feature | Description | Normal Range |
|---------|-------------|-------------|
| hour_of_day | Hour of access (0-23, normalized to 0-1) | 0.39-0.78 (9AM-6PM) |
| day_of_week | Day of week (0-6, normalized to 0-1) | 0-0.71 (weekdays) |
| is_weekend | Weekend flag (0 or 1) | 0 (weekdays) |
| time_since_last_event | Minutes since last event (log-normalized) | 0-0.8 |
| events_last_hour | Events in last hour (normalized) | 0-0.2 |
| events_last_24h | Events in last 24 hours (normalized) | 0-0.5 |
| unique_resources_24h | Distinct resources accessed (normalized) | 0-0.5 |
| unique_actions_24h | Distinct actions performed (normalized) | 0-0.6 |
| unique_ips_24h | Distinct IP addresses (normalized) | 0-0.3 |
| new_ip_ratio | Ratio of new IPs to total | 0-0.2 |
| geo_distance_from_home | Distance from typical location | 0-0.1 |
| action_diversity | Shannon entropy of action distribution | 0.3-0.8 |
| resource_access_pattern | Deviation from typical pattern | 0-0.3 |
| avg_session_duration | Average session length (normalized) | 0-0.5 |
| failed_attempt_ratio | Ratio of failed to total attempts | 0-0.05 |

### Risk Score Calculation

```
risk_score = 0.6 x autoencoder_score + 0.4 x isolation_forest_score
```

| Score Range | Severity | Recommended Action |
|-------------|----------|-------------------|
| 0-20 | Normal | No action required |
| 20-40 | Low | Log for review |
| 40-60 | Medium | Send notification to user |
| 60-80 | High | Flag for admin review, require MFA |
| 80-100 | Critical | Temporary account lockout |

### Training the Model

```bash
cd anomaly-detection

# Generate synthetic training data
python scripts/generate_data.py

# Train the ensemble model
python -m app.train

# Models are saved to models/ directory
```

### Model Files

| File | Description |
|------|-------------|
| `models/ensemble_autoencoder` | Trained TensorFlow autoencoder |
| `models/ensemble_iforest` | Trained Isolation Forest (joblib) |
| `models/ensemble_ensemble_config.json` | Threshold and weight configuration |

---

## Testing

### Smart Contracts -- 106 Tests

```bash
cd contracts
npx hardhat test                    # Run all tests
npx hardhat coverage                # Generate coverage report
```

| Category | Tests | Coverage |
|----------|-------|----------|
| DecentraIDIdentity | 32 | 100% functions, 95% branches |
| DecentraIDAccessControl | 37 | 100% functions, 90% branches |
| DecentraIDAssets | 30 | 100% functions, 95% branches |
| Integration Tests | 7 | All user flows |

### Backend -- 46 Tests

```bash
cd backend
pytest -v                          # Run all tests
pytest --cov=app --cov-report=html # With coverage
```

| Category | Tests |
|----------|-------|
| DID API | 3 |
| Health Check | 2 |
| Integration | 8 |
| Middleware | 6 |
| Blockchain Services | 15 |
| Utilities | 12 |

### Anomaly Detection -- 66 Tests

```bash
cd anomaly-detection
pytest tests/ -v                    # Run all tests
pytest tests/ -v --cov=app         # With coverage
```

| Category | Tests |
|----------|-------|
| API Endpoints | 12 |
| Feature Extraction | 10 |
| Model Training | 8 |
| Detection Pipeline | 15 |
| Behavioral Profiling | 10 |
| Synthetic Data | 11 |

### Frontend -- 28 Tests

```bash
cd frontend
npm test                           # Run all tests
```

| Category | Tests |
|----------|-------|
| DIDCard Component | 13 |
| WalletConnect Component | 6 |
| useDecentraID Hook | 9 |

### Load Testing

```bash
# Install k6: https://k6.io/
k6 run loadtest.js                 # Run load test (50-100 concurrent users)
```

---

## Security

### Smart Contract Security

- All state-changing functions protected by `ReentrancyGuard`
- Role-based access control via OpenZeppelin `AccessControl`
- Zero address checks on all creation functions
- Event emissions for all state changes (audit trail)
- Solidity 0.8.28 (built-in overflow/underflow protection)
- Slither static analysis compatible
- No `tx.origin`, no `delegatecall` to untrusted contracts

### API Security

- JWT authentication with configurable expiry
- Rate limiting: 60 requests per minute per IP
- Input validation via Pydantic schemas
- SQL injection prevention (parameterized queries)
- CORS configured for allowed origins only
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

### Data Security

- Private keys encrypted with AES-256-GCM
- Database connections encrypted (SSL)
- Redis password protected
- IPFS content verified by hash
- No secrets in version control

### Infrastructure Security

- Docker containers run as non-root
- Nginx rate limiting and security headers
- Health check endpoints for all services
- Automated backup scripts

---

## Deployment

### Docker Compose

```bash
docker compose up -d                # Start all services
docker compose ps                   # Check status
docker compose logs -f backend      # View backend logs
docker compose down                 # Stop all services
```

### Polygon Testnet Deployment

```bash
cd contracts
npx hardhat run scripts/deploy-all.js --network amoy
```
---

## Cost Breakdown

| Item | Cost |
|------|------|
| Polygon Amoy testnet | Free |
| IPFS (Pinata free tier) | Free |
| Domain name | ~Rs 500/year |
| Frontend hosting (Vercel free tier) | Free |
| PostgreSQL (Supabase free tier) | Free |
| Redis (Upstash free tier) | Free |
| GPU for ML training (already owned) | Rs 0 |
| **Total** | **~Rs 500/year** |

### Production Costs (Estimated)

| Item | Monthly Cost | Annual Cost |
|------|-------------|-------------|
| Polygon mainnet gas | ~Rs 1,000 | ~Rs 12,000 |
| IPFS (4GB storage) | ~Rs 500 | ~Rs 6,000 |
| VPS (4 vCPU, 8GB RAM) | ~Rs 2,000 | ~Rs 24,000 |
| Domain + SSL | ~Rs 50 | ~Rs 600 |
| Monitoring (optional) | ~Rs 500 | ~Rs 6,000 |
| **Total** | **~Rs 4,050/month** | **~Rs 48,600/year** |

---

## References

| Resource | Link |
|----------|------|
| W3C DID Standard | [w3.org/TR/did-core](https://www.w3.org/TR/did-core/) |
| ERC-721 Standard | [eips.ethereum.org/EIPS/eip-721](https://eips.ethereum.org/EIPS/eip-721) |
| OpenZeppelin Contracts | [openzeppelin.com/contracts](https://docs.openzeppelin.com/contracts/) |
| Polygon Documentation | [polygon.technology/developer](https://wiki.polygon.technology/) |
| IPFS Documentation | [docs.ipfs.tech](https://docs.ipfs.tech/) |
| NIST Zero Trust Architecture | [NIST SP 800-207](https://csrc.nist.gov/publications/detail/sp/800-207/final) |
| Self-Sovereign Identity Principles | [self-sovereign.id](https://www.self-sovereign.id/) |
| Decentralized Identity Foundation | [identity.foundation](https://www.identity.foundation/) |
| MITRE ATT&CK Framework | [attack.mitre.org](https://attack.mitre.org/) |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
