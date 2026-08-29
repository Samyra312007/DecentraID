# Changelog

All notable changes to DecentraID will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete project scaffolding and monorepo structure
- Smart contracts for DID, Access Control, and Asset Management
- FastAPI backend with 23 REST API endpoints
- Next.js 14 frontend with Coinbase-inspired design system
- AI/ML anomaly detection service with ensemble models
- WebSocket real-time event system
- Docker Compose orchestration for full stack
- Nginx reverse proxy with rate limiting and security headers
- Comprehensive test suite (218+ tests across all services)
- Security middleware (XSS prevention, input sanitization, CSP headers)
- In-memory caching layer with TTL support
- Input validation utilities for Ethereum addresses, DIDs, and actions

### Changed
- Merged all branches into single `main` branch

## [0.5.0] - 2026-08-29

### Added

#### Smart Contracts (Solidity 0.8.28)
- `DecentraIDIdentity.sol` — DID document creation, update, resolution, and rotation
- `AccessControl.sol` — Role-based access control with policy management
- `AssetManagement.sol` — NFT-based digital asset minting, transfer, and ownership verification
- Hardhat test suite with 106 passing tests
- Deployment scripts for local, testnet, and mainnet

#### Backend API (Python 3.11+ / FastAPI)
- 23 REST API endpoints across 6 resource groups:
  - Authentication (wallet signature login)
  - DID Management (create, resolve, update)
  - NFT Assets (mint, list, verify, transfer)
  - Access Control (request, decide, check, logs)
  - Policies (create, list, deactivate)
  - Anomaly Detection (dashboard, alerts, acknowledge, profile)
  - IPFS (upload, retrieve, document info)
- Async SQLAlchemy with PostgreSQL
- JWT authentication with wallet signature verification
- Alembic database migrations
- WebSocket event system with topic subscriptions
- IPFS integration for document storage
- Blockchain service layer (Web3 client, identity, access, asset services)
- 46 backend tests

#### Frontend (Next.js 14 / TypeScript)
- 6 application pages: Dashboard, DIDs, Assets, Access, Anomaly, Settings
- 20+ React components across 5 feature domains
- Coinbase-inspired design system (DESIGN.md)
- Custom hooks: useDecentraID, useDID, useAssets, useAccess, useWebSocket
- Wagmi + Viem wallet integration
- Tailwind CSS with custom design tokens
- Responsive layout with sidebar navigation

#### Anomaly Detection (Python / scikit-learn)
- 15-dimensional feature extraction engine
- Autoencoder model (MLPRegressor)
- Isolation Forest model
- Ensemble detector (weighted average: 60% AE + 40% IF)
- Behavioral profiling with exponential moving averages
- Real-time detection pipeline
- Synthetic data generator for training
- FastAPI service (port 8001) with 7 endpoints
- 66 anomaly detection tests

#### Infrastructure
- Docker Compose with 7 services (PostgreSQL, Redis, Backend, Anomaly, Frontend, Nginx, IPFS)
- Nginx reverse proxy with rate limiting and security headers
- GitHub Actions CI pipeline with 4 parallel jobs
- Prometheus and Grafana monitoring stack
- k6 load testing script
- One-click setup script (`setup.sh`)

#### Documentation
- Architecture overview (`docs/architecture.md`)
- API reference (`docs/api-reference.md`)
- Deployment guide (`docs/deployment.md`)
- Smart contract documentation (`docs/smart-contracts.md`)
- Demo walkthrough (`docs/demo-walkthrough.md`)
- Security audit checklist

### Security
- Content Security Policy (CSP) headers
- XSS prevention and input sanitization
- SQL injection detection patterns
- Rate limiting (30 req/min API, 10 req/s WebSocket)
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- In-memory cache with TTL to prevent cache poisoning

## [0.1.0] - 2026-08-28

### Added
- Initial project structure
- Problem statement definition (SIH26125 — Bharat Electronics Limited)
- Design system specification (DESIGN.md)
- Project planning document (planning.md)
- MIT License
- README with comprehensive documentation

---

## Versioning Policy

### Semantic Versioning

- **Major** (X.0.0): Breaking changes to API, smart contracts, or data models
- **Minor** (0.X.0): New features, backwards compatible
- **Patch** (0.0.X): Bug fixes, security patches, documentation updates

### Release Cadence

- **Major releases**: As needed, with migration guides
- **Minor releases**: Every 2-4 weeks during active development
- **Patch releases**: As needed for critical fixes

### Smart Contract Versioning

Smart contract versions are immutable once deployed. New versions are deployed as new contracts with data migration utilities.
