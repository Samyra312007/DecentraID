# Security Policy

## Reporting a Vulnerability

The DecentraID team takes security seriously. We appreciate your efforts to responsibly disclose any security vulnerabilities you find.

**Do not open a public GitHub issue for security vulnerabilities.**

### How to Report

Send an email to **samayra312007@gmail.com** with:

- **Subject**: `[SECURITY] <brief description>`
- **Description**: Clear description of the vulnerability
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Impact assessment**: What an attacker could achieve
- **Suggested fix**: If you have a recommendation (optional)
- **Proof of concept**: Code or screenshots demonstrating the issue

### What to Include

```
Vulnerability Type: (e.g., SQL Injection, XSS, Reentrancy, etc.)
Component: (e.g., Backend API, Smart Contract, Frontend)
Severity: (Critical / High / Medium / Low)
Affected Version: (e.g., v1.0.0)
```

## Response Timeline

| Stage | Timeline |
|-------|----------|
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix development | Depends on severity |
| Public disclosure | After fix is deployed |

## Severity Classification

### Critical

- Smart contract vulnerabilities leading to fund loss
- Authentication bypass allowing unauthorized access
- Remote code execution
- Private key exposure

### High

- SQL injection or NoSQL injection
- Cross-site scripting (XSS) on sensitive pages
- Access control bypass
- Denial of service on critical services

### Medium

- Information disclosure
- CSRF attacks
- Insecure direct object references
- Missing rate limiting on sensitive endpoints

### Low

- Minor information leakage
- Missing security headers
- Verbose error messages
- Outdated dependencies with known CVEs

## Scope

### In Scope

- Smart contracts (`contracts/`)
- Backend API (`backend/`)
- Frontend application (`frontend/`)
- Anomaly detection service (`anomaly-detection/`)
- Docker configurations
- Infrastructure configuration
- Authentication and authorization mechanisms
- Data encryption and privacy

### Out of Scope

- Third-party services and dependencies
- Social engineering attacks
- Physical attacks
- Denial of service via network flooding
- Issues requiring root/admin access to the server

## Bug Bounty

We are currently evaluating a bug bounty program. Details will be announced on our GitHub repository once finalized.

### Exclusions

- Theoretical attacks without practical impact
- Issues already reported by another researcher
- Issues in deprecated or end-of-life versions
- Issues requiring privileged access that would not be available to a normal user

## Security Best Practices for Contributors

### Smart Contracts

- Use OpenZeppelin battle-tested libraries
- Follow checks-effects-interactions pattern
- Implement reentrancy guards on all state-changing external calls
- Use `require()` with descriptive error messages
- Test for overflow/underflow (Solidity 0.8+ has built-in checks)
- Conduct formal verification where possible

### Backend

- Validate all inputs with Pydantic schemas
- Use parameterized SQL queries (SQLAlchemy ORM handles this)
- Implement rate limiting on all public endpoints
- Use bcrypt/argon2 for password hashing
- Rotate JWT secrets regularly
- Use HTTPS in production
- Set secure cookie flags (HttpOnly, Secure, SameSite)

### Frontend

- Sanitize all user-generated content
- Use Content Security Policy (CSP) headers
- Store sensitive data in httpOnly cookies, not localStorage
- Validate wallet signatures on both client and server
- Never expose private keys in client-side code

### Infrastructure

- Use Docker with non-root users
- Keep all dependencies updated
- Use environment variables for secrets
- Enable logging and monitoring
- Regular backup and disaster recovery testing

## Security Audits

| Audit Date | Auditor | Scope | Status |
|------------|---------|-------|--------|
| TBD | TBD | Smart Contracts | Planned |
| TBD | TBD | Full Stack | Planned |

## Compliance

DecentraID is designed with the following standards in mind:

- **GDPR** — Data minimization, right to erasure
- **SOC 2** — Security controls (planned)
- **ISO 27001** — Information security management (planned)

## Contact

- **Security email**: samayra312007@gmail.com
- **GitHub**: https://github.com/Samyra312007/DecentraID

