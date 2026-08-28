# DecentraID Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- MetaMask wallet with Polygon Amoy testnet

## Quick Start (Docker)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd DecentraID
./setup.sh
```

### 2. Configure Environment

Edit `.env` file with your settings:

```bash
# Database
POSTGRES_DB=decentraid
POSTGRES_USER=decentraid
POSTGRES_PASSWORD=your-secure-password

# Blockchain
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your-private-key

# JWT
JWT_SECRET_KEY=your-jwt-secret
```

### 3. Start Services

```bash
# Start all services
docker-compose up -d

# Or start specific services
docker-compose up -d postgres redis backend
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec backend python3 -m alembic upgrade head

# Seed data (optional)
docker-compose exec backend python3 scripts/seed_data.py
```

### 5. Deploy Contracts

```bash
cd contracts
npm install
npx hardhat run scripts/deploy-all.js --network amoy
```

### 6. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Anomaly Detection**: http://localhost:8001/docs

## Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000
```

### Anomaly Detection

```bash
cd anomaly-detection
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```bash
# Database (use a managed service like AWS RDS)
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname

# Redis (use a managed service like AWS ElastiCache)
REDIS_URL=redis://host:6379/0

# Security
JWT_SECRET_KEY=<strong-random-secret>
CORS_ORIGINS=https://yourdomain.com

# Blockchain
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=<your-deployment-key>

# IPFS (use Pinata or Infura)
IPFS_API_URL=https://api.pinata.cloud
IPFS_API_KEY=<your-api-key>
IPFS_SECRET_KEY=<your-secret-key>
```

### Docker Compose (Production)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### SSL/TLS

1. Obtain SSL certificate (Let's Encrypt)
2. Update Nginx configuration
3. Mount certificates in Docker

```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ...
}
```

### Database Migration

```bash
# Create migration
docker-compose exec backend python3 -m alembic revision --autogenerate -m "description"

# Apply migration
docker-compose exec backend python3 -m alembic upgrade head
```

### Contract Verification

```bash
cd contracts
npx hardhat verify --network amoy <contract-address> <constructor-args>
```

## Monitoring

### Health Checks

```bash
# Backend
curl http://localhost:8000/health

# Anomaly Detection
curl http://localhost:8001/health
```

### Logs

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f anomaly-detection

# Specific service
docker-compose logs --tail=100 backend
```

### Metrics

- API response times
- Error rates
- Database connection pool
- Anomaly detection accuracy

## Troubleshooting

### Database Connection Issues

```bash
# Check database is running
docker-compose ps postgres

# Test connection
docker-compose exec backend python3 -c "from app.core.database import engine; print('Connected')"

# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend python3 -m alembic upgrade head
```

### Contract Deployment Issues

```bash
# Check account balance
npx hardhat account --network amoy

# Verify contract
npx hardhat verify --network amoy <address>
```

### Frontend Build Issues

```bash
# Clear cache
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Anomaly Detection Model Issues

```bash
# Retrain models
cd anomaly-detection
python3 -m app.train

# Check model files
ls -la models/
```

## Backup

### Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U decentraid decentraid > backup.sql

# Restore
docker-compose exec -T postgres psql -U decentraid decentraid < backup.sql
```

### Model Backup

```bash
# Backup trained models
tar -czf models-backup.tar.gz anomaly-detection/models/
```

## Scaling

### Horizontal Scaling

```bash
# Scale backend
docker-compose up -d --scale backend=3

# Scale anomaly detection
docker-compose up -d --scale anomaly-detection=2
```

### Load Balancing

Update Nginx upstream configuration for multiple backend instances.

## Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Regular security audits
- [ ] Monitor for anomalies
- [ ] Backup database regularly
