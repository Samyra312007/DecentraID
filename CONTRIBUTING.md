# Contributing to DecentraID

Thank you for your interest in contributing to DecentraID! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **security@decentraid.io**.

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **Python** >= 3.11
- **Docker** >= 24.0.0
- **Docker Compose** >= 2.20.0
- **Git** >= 2.40.0
- **MetaMask** browser extension (for frontend development)

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/<your-username>/DecentraID.git
cd DecentraID
git remote add upstream https://github.com/DecentraID/DecentraID.git
```

## Development Setup

### Quick Start

```bash
# Run the full setup script
./setup.sh

# Or manually:
# 1. Install contract dependencies
cd contracts && npm install && cd ..

# 2. Install frontend dependencies
cd frontend && npm install && cd ..

# 3. Install backend dependencies
cd backend && pip install -r requirements.txt && cd ..

# 4. Install anomaly detection dependencies
cd anomaly-detection && pip install -r requirements.txt && cd ..

# 5. Start all services
docker-compose up -d
```

### Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js application |
| Backend API | http://localhost:8000/docs | FastAPI Swagger docs |
| Anomaly Detection | http://localhost:8001/docs | ML service docs |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |
| IPFS | localhost:5001 | IPFS node |

## Project Structure

```
DecentraID/
├── contracts/              # Solidity smart contracts
│   ├── contracts/          # Contract source files
│   ├── test/               # Hardhat tests
│   ├── scripts/            # Deployment scripts
│   └── hardhat.config.js   # Hardhat configuration
├── backend/                # FastAPI backend
│   ├── app/                # Application code
│   │   ├── api/            # API endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Custom middleware
│   └── tests/              # Backend tests
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── anomaly-detection/      # AI/ML service
│   ├── app/                # ML application code
│   │   ├── models/         # Detection models
│   │   └── tests/          # ML tests
│   └── notebooks/          # Jupyter notebooks
├── infra/                  # Infrastructure configs
│   └── nginx/              # Nginx configurations
├── docs/                   # Documentation
└── docker-compose.yml      # Docker orchestration
```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:

- **Clear and descriptive title**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, browser, Node version, etc.)
- **Screenshots** if applicable
- **Logs or error messages**

### Suggesting Features

Feature requests are welcome. Please provide:

- **Clear description** of the proposed feature
- **Use case** — why is this feature needed?
- **Technical approach** if you have one in mind
- **Willingness to implement** — would you submit a PR?

### Contributing Code

1. Find an issue to work on, or create one
2. Comment on the issue to claim it
3. Fork the repository
4. Create a feature branch from `main`
5. Make your changes
6. Write or update tests
7. Ensure all tests pass
8. Submit a pull request

## Pull Request Process

### Before Submitting

1. **Update your fork** with the latest changes from `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run the full test suite**:
   ```bash
   # Smart contracts
   cd contracts && npx hardhat test

   # Backend
   cd backend && python3 -m pytest tests/ -v

   # Anomaly detection
   cd anomaly-detection && python3 -m pytest tests/ -v

   # Frontend
   cd frontend && npm test
   ```

3. **Verify the build**:
   ```bash
   cd frontend && npm run build
   ```

### PR Title Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`

Examples:
```
feat(backend): add DID rotation endpoint
fix(frontend): resolve wallet connection timeout
docs(api): update endpoint documentation
test(contracts): add access control test cases
chore(deps): update Python dependencies
```

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Related Issues
Closes #<issue_number>

## Testing
Describe the tests you ran to verify your changes.

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] Any dependent changes have been merged and published
```

## Coding Standards

### Solidity (Contracts)

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use Solidity 0.8.28
- All functions must have NatSpec comments
- Maximum function complexity: 10 cyclomatic complexity
- 100% test coverage for new contracts
- Use OpenZeppelin libraries where possible

### Python (Backend & Anomaly Detection)

- Follow [PEP 8](https://peps.python.org/pep-0008/) style guide
- Use type hints for all function signatures
- Maximum line length: 88 characters (Black formatter)
- Use async/await for database operations
- All public functions must have docstrings
- Use Pydantic for data validation

```bash
# Format Python code
black .
isort .

# Lint Python code
flake8 .
mypy .
```

### TypeScript (Frontend)

- Follow [Next.js ESLint rules](https://nextjs.org/docs/basic-features/eslint)
- Use strict TypeScript (`strict: true`)
- Prefer functional components with hooks
- Use Tailwind CSS classes (no inline styles)
- Maximum line length: 100 characters

```bash
# Format TypeScript code
npm run lint -- --fix

# Type check
npx tsc --noEmit
```

### General

- **No hard-coded secrets** — use environment variables
- **No `console.log` in production code** — use proper logging
- **No emojis in UI components** — use icons from Lucide or similar
- **No `any` type in TypeScript** — always type properly
- **No raw SQL queries** — use ORM/parameterized queries
- **No synchronous file operations** in async contexts

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Rules

1. **Subject line**: 72 characters max, imperative mood ("add feature" not "added feature")
2. **Body**: Explain *what* and *why*, not *how*
3. **Footer**: Reference issues: `Closes #123`, `Fixes #456`
4. **Type**: Must be one of the Conventional Commits types

### Examples

```
feat(did): implement DID document rotation

Add endpoint to rotate DID keys with cryptographic verification.
Supports both ECDSA and Ed25519 key types.

Closes #42
```

```
fix(access): prevent race condition in access decision

Use database-level locking to prevent concurrent access decisions
from creating inconsistent state.

Fixes #128
```

## Testing

### Running Tests

```bash
# All tests across all services
./setup.sh --test

# Individual services
cd contracts && npx hardhat test
cd backend && python3 -m pytest tests/ -v
cd anomaly-detection && python3 -m pytest tests/ -v
cd frontend && npm test
```

### Writing Tests

- **Unit tests**: Test individual functions/methods in isolation
- **Integration tests**: Test component interactions
- **End-to-end tests**: Test complete user flows

### Test Coverage

- Aim for **80%+ code coverage** on new code
- All bug fixes must include a regression test
- All new features must include both happy-path and error-path tests

### Test File Naming

```
# Backend (pytest)
tests/test_<module>.py

# Frontend (Jest)
src/__tests__/<Component>.test.tsx
src/hooks/__tests__/use<Something>.test.ts

# Contracts (Hardhat)
test/<ContractName>.test.js
```

## Security

### Reporting Vulnerabilities

**Do not** open a public GitHub issue for security vulnerabilities.

Instead, please report security vulnerabilities by emailing **samayra312007@gmail.com**.

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You should receive a response within 48 hours. We will work with you to understand and address the issue before any public disclosure.

### Security Best Practices

- Never commit private keys, API keys, or secrets
- Use `.env` files for configuration (already in `.gitignore`)
- Validate all user inputs on both client and server
- Use parameterized queries to prevent SQL injection
- Follow the principle of least privilege
- Keep dependencies updated

## License

By contributing to DecentraID, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Questions?

If you have questions about contributing, feel free to:

1. Check the [README](README.md) for project overview
2. Read the [Architecture Documentation](docs/architecture.md)
3. Review the [API Reference](docs/api-reference.md)
4. Open a [Discussion](https://github.com/DecentraID/DecentraID/discussions) on GitHub

Thank you for contributing to DecentraID!
