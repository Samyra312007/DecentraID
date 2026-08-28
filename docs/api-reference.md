# DecentraID API Reference

## Base URLs

- **Backend API**: `http://localhost:8000`
- **Anomaly Detection**: `http://localhost:8001`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "address": "0x...",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "did": "did:decentraid:0x..."
}
```

## DID Endpoints

### Create DID

```http
POST /api/v1/did/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "public_key": "0x...",
  "metadata": {
    "name": "My DID"
  }
}
```

**Response:**
```json
{
  "did": "did:decentraid:0x...",
  "document": {
    "id": "did:decentraid:0x...",
    "controller": "0x...",
    "verificationMethod": [...],
    "authentication": [...]
  }
}
```

### Resolve DID

```http
GET /api/v1/did/{did}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "did": "did:decentraid:0x...",
  "document": {...},
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Update DID

```http
PUT /api/v1/did/{did}
Authorization: Bearer <token>
Content-Type: application/json

{
  "metadata": {
    "name": "Updated Name"
  }
}
```

## Asset Endpoints

### Mint Asset

```http
POST /api/v1/asset/mint
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
asset_type: credential
jurisdiction: US
```

**Response:**
```json
{
  "token_id": 1,
  "name": "Driver License",
  "asset_type": "credential",
  "issuer_did": "did:decentraid:0x...",
  "owner_did": "did:decentraid:0x...",
  "ipfs_hash": "Qm..."
}
```

### List Assets

```http
GET /api/v1/asset/list
Authorization: Bearer <token>
```

**Response:**
```json
{
  "assets": [
    {
      "token_id": 1,
      "name": "Driver License",
      "asset_type": "credential"
    }
  ]
}
```

### Verify Asset

```http
GET /api/v1/asset/{token_id}/verify
Authorization: Bearer <token>
```

### Transfer Asset

```http
POST /api/v1/asset/{token_id}/transfer?to_did=did:decentraid:0x...
Authorization: Bearer <token>
```

## Access Control Endpoints

### Request Access

```http
POST /api/v1/access/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "resource_id": "did:decentraid:0x...",
  "action": "read",
  "reason": "Need to verify identity"
}
```

**Response:**
```json
{
  "request_id": "req_123",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Decide Access

```http
POST /api/v1/access/decide?request_id=req_123&approve=true
Authorization: Bearer <token>
```

### Check Access

```http
GET /api/v1/access/check?did=did:decentraid:0x...&resource_id=resource_123&action=read
Authorization: Bearer <token>
```

**Response:**
```json
{
  "allowed": true,
  "reason": "Role-based access granted"
}
```

### Get Access Logs

```http
GET /api/v1/access/logs?limit=100
Authorization: Bearer <token>
```

## Policy Endpoints

### Create Policy

```http
POST /api/v1/policy/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "resource_type": "did",
  "action": "read",
  "allowed_roles": ["admin", "viewer"]
}
```

### List Policies

```http
GET /api/v1/policy/list
Authorization: Bearer <token>
```

### Deactivate Policy

```http
DELETE /api/v1/policy/{policy_id}
Authorization: Bearer <token>
```

## IPFS Endpoints

### Upload Document

```http
POST /api/v1/ipfs/upload?asset_type=document
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
```

**Response:**
```json
{
  "cid": "Qm...",
  "metadata_cid": "Qm...",
  "document_hash": "abc123...",
  "size": 1024
}
```

### Retrieve Document

```http
GET /api/v1/ipfs/{cid}
Authorization: Bearer <token>
```

### Get Document Info

```http
GET /api/v1/ipfs/{cid}/info
Authorization: Bearer <token>
```

## Anomaly Detection Endpoints

Base URL: `http://localhost:8001`

### Detect Anomaly

```http
POST /detect
Content-Type: application/json

{
  "user_id": "user_001",
  "action": "read",
  "resource": "dashboard",
  "ip_address": "192.168.1.100",
  "success": true
}
```

**Response:**
```json
{
  "is_anomaly": false,
  "risk_score": 15.2,
  "severity": "low",
  "details": {
    "ensemble_score": 0.152,
    "behavioral_deviation": 0.12
  },
  "reasons": ["Minor deviations from baseline"],
  "recommendations": ["Continue monitoring"]
}
```

### Batch Detection

```http
POST /detect/batch
Content-Type: application/json

{
  "events": [...]
}
```

### Get User Profile

```http
GET /profile/{user_id}
```

**Response:**
```json
{
  "user_id": "user_001",
  "total_events": 150,
  "typical_hour": 10,
  "typical_day": 1,
  "top_resources": ["dashboard", "settings"],
  "top_actions": ["read", "write"],
  "known_ips": 3
}
```

### Get Feature Info

```http
GET /features
```

### Initialize Models

```http
POST /initialize
```

### Get Statistics

```http
GET /stats
```

## WebSocket Events

Connect to `ws://localhost:8000/ws/events`

### Subscribe to Topics

```json
{
  "action": "subscribe",
  "topics": ["anomaly_alert", "access_request"]
}
```

### Event Types

- `access_request`: New access request
- `access_granted`: Access approved
- `access_denied`: Access denied
- `anomaly_alert`: Security alert
- `did_created`: New DID created
- `asset_minted`: New asset minted

### Event Format

```json
{
  "type": "anomaly_alert",
  "data": {
    "alert_id": "alert_123",
    "severity": "high",
    "message": "Unusual access pattern detected"
  }
}
```

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "decentraid-backend",
  "version": "1.0.0",
  "database": "connected"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized

```json
{
  "detail": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "detail": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error"
}
```
