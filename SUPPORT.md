# Getting Help

Welcome to DecentraID! If you need help, here are the available resources.

## Documentation

- [README](README.md) — Project overview, features, and quick start guide
- [Architecture](docs/architecture.md) — System architecture and data flows
- [API Reference](docs/api-reference.md) — Complete REST API documentation
- [Deployment Guide](docs/deployment.md) — Production deployment instructions
- [Smart Contracts](docs/smart-contracts.md) — Contract functions and integration
- [Demo Walkthrough](docs/demo-walkthrough.md) — Step-by-step demo guide

## Community

- **GitHub Discussions**: [DecentraID Discussions](https://github.com/Samyra312007/DecentraID/discussions) — Ask questions, share ideas, and discuss the project
- **GitHub Issues**: [Report Bugs](https://github.com/Samyra312007/DecentraID/issues) — Report bugs or request features

## Quick Help

### Common Issues

#### "Cannot connect to MetaMask"
1. Make sure MetaMask is installed and unlocked
2. Ensure you are on the correct network (local Hardhat node or testnet)
3. Check that the network RPC URL matches your configuration

#### "Docker Compose fails to start"
1. Ensure Docker and Docker Compose are installed and running
2. Check if ports 3000, 5432, 6379, 8000, 8001 are available
3. Run `docker-compose down -v` to clear volumes and try again

#### "Backend returns 500 errors"
1. Ensure PostgreSQL is running: `docker-compose up -d postgres`
2. Run database migrations: `cd backend && alembic upgrade head`
3. Check the backend logs: `docker-compose logs backend`

#### "Frontend build fails"
1. Clear node_modules: `cd frontend && rm -rf node_modules && npm install`
2. Check TypeScript errors: `npx tsc --noEmit`
3. Verify environment variables are set

#### "Anomaly detection models not found"
1. Train the models first: `cd anomaly-detection && python3 app/train.py`
2. Ensure the `models/` directory exists with trained artifacts

### Development Workflow

1. Fork and clone the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes following the [Contributing Guide](CONTRIBUTING.md)
4. Run the full test suite: `./setup.sh --test`
5. Submit a pull request

### Running Tests

```bash
# All services
./setup.sh --test

# Individual services
cd contracts && npx hardhat test
cd backend && python3 -m pytest tests/ -v
cd anomaly-detection && python3 -m pytest tests/ -v
cd frontend && npm test
```

## Security

**Do not** open public GitHub issues for security vulnerabilities.

Please report security issues privately to **security@decentraid.io**.

See [SECURITY.md](SECURITY.md) for details.

## Contact

- **Email**: samayra312007@gmail.com
- **Security**: samayra312007@gmail.com
- **GitHub**: https://github.com/Samyra312007/DecentraID

## Response Times

| Type | Expected Response Time |
|------|----------------------|
| Security vulnerabilities | Within 48 hours |
| Bug reports | Within 5 business days |
| Feature requests | Within 10 business days |
| Pull request reviews | Within 5 business days |
| General questions | Within 3 business days |
