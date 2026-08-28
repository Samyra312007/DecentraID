# 🛡️ DecentraID

**Blockchain-Based Secure Platform for Identity, Access Control & Digital Asset Management**

> *Your Identity. Your Assets. Your Control.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue.svg)](https://soliditylang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-green.svg)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

---

## 📋 Problem Statement — SIH26125

**Organization:** Bharat Electronics Limited (BEL)  
**Theme:** Blockchain & Cybersecurity  
**Category:** Software

Every organization relies on centralized IAM systems — a single point of failure. When that server is compromised, ALL identities and access rights are at risk. There is no tamper-proof way to prove ownership of digital assets like documents, licenses, or certificates.

**DecentraID** solves this by combining:
- 🔐 **Decentralized Identity (DID)** — Users own their identity via cryptographic keys
- 🏢 **Smart Contract Access Control** — RBAC + ABAC enforced on-chain
- 🎨 **NFT-Based Digital Assets** — Provable, transferable asset ownership
- 🤖 **AI-Powered Anomaly Detection** — ML-based behavioral analysis

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│          React.js / Next.js  ·  Tailwind CSS            │
├─────────────────────────────────────────────────────────┤
│                     API Gateway                          │
│              Python FastAPI  ·  JWT Auth                 │
├─────────────────────────────────────────────────────────┤
│                  Smart Contract Layer                    │
│     Identity  ·  Access Control  ·  NFT Assets          │
│              Solidity  ·  OpenZeppelin                   │
├─────────────────────────────────────────────────────────┤
│                    Blockchain Layer                      │
│           Polygon L2 (Amoy Testnet)                     │
├─────────────────────────────────────────────────────────┤
│                    AI/ML Layer                           │
│       Anomaly Detection  ·  Behavioral Profiling        │
│              TensorFlow  ·  scikit-learn                 │
├─────────────────────────────────────────────────────────┤
│                      Data Layer                          │
│         PostgreSQL  ·  Redis  ·  IPFS                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x LTS
- Python 3.11+
- Docker & Docker Compose
- MetaMask browser extension

### 1. Clone & Setup

```bash
git clone https://github.com/Samyra312007/DecentraID.git
cd DecentraID
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values (see Configuration section below)
```

### 3. Deploy Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy-all.js --network amoy
```

### 4. Start with Docker

```bash
docker compose up -d
```

### 5. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Anomaly Detection | http://localhost:8001 |
| IPFS | http://localhost:5001 |

---

## ⚙️ Configuration

### Environment Variables

```bash
# ========== BLOCKCHAIN ==========
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_AMOY_CHAIN_ID=80002
PRIVATE_KEY=your_wallet_private_key_here

# Contract addresses (filled after deployment)
IDENTITY_CONTRACT_ADDRESS=
ACCESS_CONTROL_CONTRACT_ADDRESS=
ASSET_CONTRACT_ADDRESS=

# ========== DATABASE ==========
DATABASE_URL=postgresql://user:password@localhost:5432/decentraid

# ========== REDIS ==========
REDIS_URL=redis://localhost:6379

# ========== SECURITY ==========
JWT_SECRET=generate_with_openssl_rand_hex_32
ENCRYPTION_KEY=generate_with_openssl_rand_hex_32
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

## 📁 Project Structure

```
DecentraID/
├── contracts/                  # Solidity Smart Contracts
│   ├── contracts/
│   │   ├── Identity/          # DID management contract
│   │   ├── AccessControl/     # RBAC/ABAC contract
│   │   ├── Assets/            # ERC-721 NFT contract
│   │   └── interfaces/        # Contract interfaces
│   ├── scripts/               # Deployment scripts
│   ├── test/                  # 106 contract tests
│   └── hardhat.config.js
│
├── backend/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── api/v1/            # REST API endpoints
│   │   ├── services/          # Business logic
│   │   ├── models/            # SQLAlchemy models
│   │   └── middleware/        # Security, rate limiting
│   ├── alembic/               # Database migrations
│   └── tests/                 # Backend tests
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   └── lib/               # Utilities & API client
│   └── tests/                 # Frontend tests
│
├── anomaly-detection/          # AI/ML Service
│   ├── app/
│   │   ├── feature_extraction.py
│   │   ├── detection_pipeline.py
│   │   ├── behavioral_profiling.py
│   │   └── main.py            # FastAPI service
│   ├── models/                # Trained models
│   └── tests/                 # ML tests
│
├── infra/                      # Infrastructure
│   └── nginx/                 # Reverse proxy config
│
├── docs/                       # Documentation
│   ├── architecture.md
│   ├── api-reference.md
│   ├── deployment.md
│   ├── smart-contracts.md
│   └── demo-walkthrough.md
│
├── docker-compose.yml          # Multi-container setup
└── setup.sh                    # One-click setup
```

---

## 🔗 API Endpoints

### Identity

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/did/create` | No | Create new DID |
| GET | `/api/v1/did/{did}` | No | Resolve DID |
| PUT | `/api/v1/did/{did}` | Yes | Update DID |

### Assets

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/asset/mint` | Yes | Mint NFT asset |
| GET | `/api/v1/asset/{id}/verify` | No | Verify asset |
| POST | `/api/v1/asset/{id}/transfer` | Yes | Transfer asset |

### Access Control

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/access/request` | Yes | Request access |
| POST | `/api/v1/access/decide` | Yes | Approve/deny |
| GET | `/api/v1/access/check` | No | Check access |
| GET | `/api/v1/access/logs` | Yes | Audit logs |

### Anomaly Detection

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/anomaly/dashboard` | Yes | Dashboard data |
| GET | `/api/v1/anomaly/alerts` | Yes | Get alerts |
| POST | `/api/v1/anomaly/alerts/{id}/acknowledge` | Yes | Acknowledge alert |

### Anomaly Detection Service (port 8001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/detect` | Detect single event anomaly |
| POST | `/detect/batch` | Batch anomaly detection |
| GET | `/profile/{user_id}` | Get user behavioral profile |
| GET | `/features` | Feature info |
| GET | `/stats` | Pipeline statistics |
| POST | `/initialize` | Initialize/retrain models |

---

## 🧪 Testing

### Smart Contracts (106 tests)

```bash
cd contracts
npx hardhat test
npx hardhat coverage
```

### Backend

```bash
cd backend
pytest -v
pytest --cov=app --cov-report=html
```

### Anomaly Detection (66 tests)

```bash
cd anomaly-detection
python -m pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm test
```

---

## 🤖 AI/ML Anomaly Detection

The anomaly detection system uses an **ensemble approach** combining:

1. **Autoencoder** — Reconstruction-based anomaly detection
2. **Isolation Forest** — Statistical outlier detection

### 15 Feature Dimensions

| Feature | Description |
|---------|-------------|
| hour_of_day | Hour of access (normalized) |
| day_of_week | Day of week (normalized) |
| is_weekend | Weekend flag |
| time_since_last_event | Minutes since last event |
| events_last_hour | Events in last hour |
| events_last_24h | Events in last 24 hours |
| unique_resources_24h | Distinct resources accessed |
| unique_actions_24h | Distinct actions |
| unique_ips_24h | Distinct IP addresses |
| new_ip_ratio | New IP ratio |
| geo_distance_from_home | Distance from typical location |
| action_diversity | Shannon entropy of actions |
| resource_access_pattern | Pattern deviation |
| avg_session_duration | Session length |
| failed_attempt_ratio | Failed attempt ratio |

### Risk Score Calculation

```
risk_score = 0.5 × autoencoder_score + 0.5 × isolation_forest_score
```

| Score Range | Severity |
|-------------|----------|
| 0-20 | Normal |
| 20-40 | Low |
| 40-60 | Medium |
| 60-80 | High |
| 80-100 | Critical |

---

## 🔒 Security

- ✅ OpenZeppelin battle-tested contracts
- ✅ ReentrancyGuard on all state-changing functions
- ✅ Role-based access control (RBAC)
- ✅ JWT authentication with expiry
- ✅ Rate limiting (60 req/min)
- ✅ Input validation via Pydantic
- ✅ SQL injection prevention
- ✅ CORS configured
- ✅ Private keys encrypted with AES-256-GCM

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Polygon Amoy testnet | Free |
| IPFS (Pinata free tier) | Free |
| Domain name | ~Rs 500/year |
| Frontend hosting (Vercel free) | Free |
| PostgreSQL (Supabase free) | Free |
| Redis (Upstash free) | Free |
| **Total** | **~Rs 500/year** |

---

## 🛣️ Roadmap

### Phase 1 — Current (Prototype)
- [x] Core platform on Polygon testnet
- [x] DID + Access Control + NFT basics
- [x] AI anomaly detection model
- [x] Working demo with sample organization

### Phase 2 — 6 Months (Production)
- [ ] Mainnet deployment on Polygon
- [ ] Enterprise SSO/LDAP integration
- [ ] Mobile application (iOS/Android)
- [ ] Compliance certifications

### Phase 3 — 12 Months (Scale)
- [ ] Multi-chain support
- [ ] Government adoption
- [ ] Cross-border identity verification
- [ ] Enterprise marketplace

---

## 👥 Team

| Name | Role | Expertise |
|------|------|-----------|
| Team Lead | Blockchain Architect | Solidity, Smart Contracts, Web3 |
| Member 2 | Backend Developer | Python, Node.js, API Design |
| Member 3 | Frontend Developer | React.js, Next.js, UI/UX |
| Member 4 | AI/ML Engineer | Anomaly Detection, Python |
| Member 5 | DevOps / Auditor | Docker, Testing, Security |

---

## 📚 References

| Resource | Link |
|----------|------|
| W3C DID Standard | [w3.org/TR/did-core](https://www.w3.org/TR/did-core/) |
| ERC-721 Standard | [eips.ethereum.org/EIPS/eip-721](https://eips.ethereum.org/EIPS/eip-721) |
| OpenZeppelin | [openzeppelin.com/contracts](https://docs.openzeppelin.com/contracts/) |
| Polygon Documentation | [polygon.technology/developer](https://wiki.polygon.technology/) |
| IPFS Documentation | [docs.ipfs.tech](https://docs.ipfs.tech/) |
| NIST Zero Trust | [NIST SP 800-207](https://csrc.nist.gov/publications/detail/sp/800-207/final) |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for SIH 2026 | Problem Statement SIH26125 | Bharat Electronics Limited**
