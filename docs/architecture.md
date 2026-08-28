# DecentraID Architecture

## Overview

DecentraID is a decentralized identity management platform built on the Polygon blockchain. It combines self-sovereign identity (SSI) principles with AI-powered anomaly detection to provide secure, privacy-preserving identity management.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Dashboard │ │  DID Mgmt│ │ Assets   │ │ Anomaly  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                           │
│              (Rate Limiting, SSL, Load Balancing)                │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Backend API     │ │ Anomaly Detection│ │   IPFS Node      │
│  (FastAPI)       │ │   (FastAPI)      │ │  (Kubo)          │
│  Port: 8000      │ │  Port: 8001      │ │ Port: 5001       │
└──────────────────┘ └──────────────────┘ └──────────────────┘
              │               │
              │               │
              ▼               ▼
┌──────────────────┐ ┌──────────────────┐
│   PostgreSQL     │ │    Redis         │
│   Database       │ │    Cache         │
│  Port: 5432      │ │  Port: 6379      │
└──────────────────┘ └──────────────────┘
              │
              │ Web3 Provider
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Polygon Blockchain (Amoy)                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  DecentraID  │ │  DecentraID  │ │  DecentraID  │            │
│  │   Identity   │ │ AccessControl│ │    Assets    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Smart Contracts (Solidity)

Three core contracts on Polygon blockchain:

- **DecentraIDIdentity**: DID creation, resolution, and management
- **DecentraIDAccessControl**: Role-based and attribute-based access control
- **DecentraIDAssets**: ERC721 NFT-based credential management

### 2. Backend API (FastAPI)

RESTful API providing:

- **Authentication**: JWT-based with wallet signature verification
- **DID Management**: CRUD operations for decentralized identifiers
- **Asset Management**: NFT minting, transfer, and verification
- **Access Control**: Request, approve, deny access
- **Policy Management**: Define and enforce access policies
- **IPFS Integration**: Document storage and retrieval
- **WebSocket**: Real-time event notifications

### 3. Anomaly Detection (FastAPI)

AI-powered anomaly detection:

- **Feature Extraction**: 15-dimensional feature vectors
- **Autoencoder**: Neural network for pattern learning
- **Isolation Forest**: Unsupervised anomaly detection
- **Ensemble**: Weighted combination of both models
- **Behavioral Profiling**: EMA-based user baselines

### 4. Frontend (Next.js)

Modern web application:

- **Dashboard**: Overview of identity metrics
- **DID Management**: Create and manage DIDs
- **Asset Management**: Mint and view NFT credentials
- **Access Control**: Request and manage access
- **Anomaly Dashboard**: Monitor security alerts

### 5. Infrastructure

- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions
- **IPFS**: Decentralized document storage
- **Nginx**: Reverse proxy with rate limiting

## Data Flow

### DID Creation Flow

```
1. User connects MetaMask wallet
2. Frontend calls POST /api/v1/did/create
3. Backend creates DID on blockchain
4. DID document stored in PostgreSQL
5. WebSocket broadcasts DID_created event
6. Frontend updates UI
```

### Access Request Flow

```
1. User requests access to resource
2. Frontend calls POST /api/v1/access/request
3. Backend creates access request record
4. Backend calls anomaly detection service
5. If anomaly detected, request flagged
6. Manager receives WebSocket notification
7. Manager approves/denies request
8. Blockchain records access decision
```

### Anomaly Detection Flow

```
1. Access event received
2. Feature extraction (15 dimensions)
3. Behavioral profile lookup
4. Autoencoder reconstruction error
5. Isolation Forest anomaly score
6. Ensemble combines scores
7. Severity determined
8. Alert created if needed
9. WebSocket broadcasts alert
```

## Security

### Authentication

- Wallet-based authentication (MetaMask)
- JWT tokens for session management
- Message signing for identity verification

### Authorization

- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Smart contract-level permissions

### Data Protection

- End-to-end encryption for sensitive data
- IPFS content addressing for integrity
- Blockchain immutability for audit trail

## Scalability

### Horizontal Scaling

- Multiple backend API instances
- Load balancing via Nginx
- Database connection pooling

### Caching Strategy

- Redis for session data
- Response caching for read-heavy endpoints
- WebSocket connection management

### Performance

- Async database operations
- Background task processing
- Efficient feature extraction

## Monitoring

### Metrics

- API response times
- Error rates
- Anomaly detection accuracy
- Blockchain transaction costs

### Logging

- Structured JSON logging
- Request/response logging
- Error tracking

### Alerting

- Anomaly detection alerts
- System health monitoring
- Performance degradation alerts

## Deployment

### Development

```bash
./setup.sh
docker-compose up -d
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

See `.env.example` for required configuration.
