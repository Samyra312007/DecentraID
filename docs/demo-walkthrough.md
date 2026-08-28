# DecentraID Demo Walkthrough

## Overview

This guide walks through the complete DecentraID workflow, from setting up a DID to detecting anomalies.

## Prerequisites

1. MetaMask browser extension
2. Polygon Amoy testnet configured
3. Test ETH in wallet (get from faucet)
4. DecentraID application running

## Setup

### 1. Start Services

```bash
# Start database
docker-compose up -d postgres redis

# Start backend
cd backend
python3 -m uvicorn app.main:app --reload --port 8000

# Start anomaly detection
cd anomaly-detection
python3 -m uvicorn app.main:app --reload --port 8001

# Start frontend
cd frontend
npm run dev
```

### 2. Configure MetaMask

1. Open MetaMask
2. Add Polygon Amoy network:
   - Network Name: Polygon Amoy
   - RPC URL: https://rpc-amoy.polygon.technology
   - Chain ID: 80002
   - Currency Symbol: MATIC
3. Import or create wallet
4. Get test MATIC from faucet

### 3. Access Application

Open http://localhost:3000 in your browser.

## Demo Flow

### Step 1: Connect Wallet

1. Click "Connect Wallet" button
2. Select MetaMask
3. Approve connection
4. Sign authentication message

**Expected Result:**
- Wallet connected indicator shows green
- Address displayed in header
- Dashboard loads with stats

### Step 2: Create DID

1. Navigate to "DIDs" page
2. Click "+ Create DID"
3. Enter DID details:
   - Name: "My Identity"
   - Description: "Personal decentralized identity"
   - Service Endpoint: "https://example.com/messaging"
4. Click "Create DID"
5. Approve transaction in MetaMask

**Expected Result:**
- DID created successfully
- DID appears in list
- Status shows "Active"

### Step 3: Mint Asset

1. Navigate to "Assets" page
2. Click "+ Mint Asset"
3. Fill form:
   - Name: "Driver License"
   - Description: "Valid driver license credential"
   - Asset Type: "Credential"
4. Optionally upload document
5. Click "Mint Asset"
6. Approve transaction

**Expected Result:**
- Asset minted successfully
- Asset appears in grid
- Token ID assigned

### Step 4: Request Access

1. Navigate to "Access" page
2. Click "Request Access"
3. Select resource type
4. Enter reason
5. Submit request

**Expected Result:**
- Access request created
- Status shows "Pending"
- Manager notified via WebSocket

### Step 5: Approve Access

1. Login as manager (different wallet)
2. Navigate to "Access" page
3. View pending requests
4. Click "Approve" on request
5. Confirm decision

**Expected Result:**
- Access granted
- Status updates to "Approved"
- Requester notified

### Step 6: Monitor Anomalies

1. Navigate to "Anomaly" page
2. View dashboard:
   - Risk score gauge
   - Recent alerts
   - Behavior chart
3. Click on alert for details

**Expected Result:**
- Risk score displayed
- Alerts listed with severity
- Behavior patterns visualized

### Step 7: Simulate Anomaly

1. Access from unusual IP (use VPN)
2. Access at unusual time (late night)
3. Multiple failed attempts

**Expected Result:**
- Anomaly detected
- Alert created
- Risk score increases
- Notification sent

## Features Demo

### Real-time Updates

1. Open two browser windows
2. Create DID in window 1
3. Observe update in window 2

**Expected Result:**
- WebSocket connection established
- Real-time updates received
- No page refresh needed

### Access Matrix

1. Navigate to "Access" → "Roles"
2. View permission matrix
3. Toggle permissions

**Expected Result:**
- Matrix displays roles vs resources
- Permissions clearly shown
- Changes saved immediately

### Behavioral Profiling

1. Use application normally for a while
2. Check "Anomaly" → "Profile"
3. View typical patterns

**Expected Result:**
- Typical hours shown
- Common resources listed
- IP history tracked

## API Demo

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"address": "0x...", "signature": "0x..."}'

# Create DID
curl -X POST http://localhost:8000/api/v1/did/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"public_key": "0x...", "metadata": {"name": "My DID"}}'

# Detect anomaly
curl -X POST http://localhost:8001/detect \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user_001", "action": "read", "resource": "dashboard", "ip_address": "192.168.1.100", "success": true}'
```

### Using WebSocket

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/events');

ws.onopen = () => {
  // Subscribe to events
  ws.send(JSON.stringify({
    action: 'subscribe',
    topics: ['anomaly_alert', 'access_request']
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};
```

## Troubleshooting

### Wallet Not Connecting

1. Check MetaMask is installed
2. Verify network is Polygon Amoy
3. Ensure wallet is unlocked
4. Check browser console for errors

### Transaction Failing

1. Ensure sufficient MATIC balance
2. Check gas price settings
3. Verify contract addresses
4. Review transaction in Polygonscan

### WebSocket Not Working

1. Check backend is running
2. Verify WebSocket URL
3. Check firewall settings
4. Review browser console

### Anomaly Detection Not Working

1. Verify anomaly service is running
2. Check model files exist
3. Review service logs
4. Test with known anomalies

## Performance Metrics

Track these during demo:

- **Transaction Speed**: ~2-5 seconds
- **API Response Time**: <100ms
- **WebSocket Latency**: <50ms
- **Anomaly Detection**: <200ms

## Next Steps

After demo:

1. Review codebase
2. Check test coverage
3. Read architecture docs
4. Plan production deployment
