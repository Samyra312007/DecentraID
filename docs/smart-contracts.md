# DecentraID Smart Contracts

## Overview

DecentraID uses three Solidity smart contracts on the Polygon blockchain:

1. **DecentraIDIdentity** - DID management
2. **DecentraIDAccessControl** - Role and attribute-based access control
3. **DecentraIDAssets** - ERC721 NFT credential management

## Contracts

### DecentraIDIdentity

Manages Decentralized Identifiers (DIDs) on-chain.

#### Functions

```solidity
// Create a new DID
function createDID(
    string calldata _did,
    string calldata _metadata
) external onlyAppRole(ADMIN_ROLE);

// Resolve DID document
function resolveDID(address _controller) 
    external view returns (DIDDocument memory);

// Update DID metadata
function updateDID(
    address _controller,
    string calldata _newMetadata
) external onlyControllerOrRole(_controller, ADMIN_ROLE);

// Suspend DID
function suspendDID(address _controller) 
    external onlyAppRole(ADMIN_ROLE);

// Reactivate DID
function reactivateDID(address _controller) 
    external onlyAppRole(ADMIN_ROLE);

// Deactivate DID permanently
function deactivateDID(address _controller) 
    external onlyControllerOrRole(_controller, ADMIN_ROLE);

// Check if DID is active
function isDIDActive(address _controller) 
    external view returns (bool);
```

#### Events

```solidity
event DIDCreated(address indexed controller, string did, string metadata);
event DIDUpdated(address indexed controller, string newMetadata);
event DIDSuspended(address indexed controller, uint256 timestamp);
event DIDReactivated(address indexed controller, uint256 timestamp);
event DIDDeactivated(address indexed controller, uint256 timestamp);
```

### DecentraIDAccessControl

Role-based and attribute-based access control.

#### Functions

```solidity
// Create a new role
function createRole(
    bytes32 roleId,
    string calldata name,
    string calldata description
) external onlyAppRole(ADMIN_ROLE);

// Assign role to DID
function assignRole(
    address did,
    bytes32 roleId
) external onlyAppRole(ADMIN_ROLE);

// Revoke role from DID
function revokeUserRole(
    address did,
    bytes32 roleId
) external onlyAppRole(ADMIN_ROLE);

// Create access policy
function createPolicy(
    bytes32 policyId,
    Resource resource,
    Action action,
    bytes32[] calldata allowedRoles,
    uint256 validUntil
) external onlyAppRole(ADMIN_ROLE);

// Request access
function requestAccess(
    bytes32 requestId,
    address resource,
    Action action,
    string calldata reason
) external returns (bytes32);

// Decide on access request
function decideAccess(
    bytes32 requestId,
    bool approved
) external onlyAppRole(MANAGER_ROLE);

// Check access permission
function checkAccess(
    address did,
    address resource,
    Action action
) external view returns (bool);
```

#### Events

```solidity
event RoleCreated(bytes32 indexed roleId, string name);
event UserRoleAssigned(address indexed did, bytes32 indexed roleId);
event UserRoleRevoked(address indexed did, bytes32 indexed roleId);
event PolicyCreated(bytes32 indexed policyId);
event PolicyDeactivated(bytes32 indexed policyId);
event AccessRequested(bytes32 indexed requestId, address indexed requester);
event AccessDecided(bytes32 indexed requestId, bool approved);
```

### DecentraIDAssets

ERC721 NFT-based credential management.

#### Functions

```solidity
// Mint new asset
function mintAsset(
    address to,
    string calldata tokenURI,
    string calldata documentHash,
    string calldata ipfsHash
) external onlyAppRole(ISSUER_ROLE) returns (uint256);

// Transfer asset
function transferAsset(
    uint256 tokenId,
    address to
) external onlyOwnerOf(tokenId);

// Revoke asset
function revokeAsset(uint256 tokenId) 
    external onlyAppRole(ADMIN_ROLE);

// Verify asset
function verifyAsset(uint256 tokenId) 
    external view returns (bool valid, address owner);

// Get asset details
function getAsset(uint256 tokenId) 
    external view returns (AssetMemory memory);

// Get all assets for issuer
function getIssuerAssets(address issuer) 
    external view returns (uint256[] memory);

// Get all assets for owner
function getOwnerAssets(address owner) 
    external view returns (uint256[] memory);
```

#### Events

```solidity
event AssetMinted(uint256 indexed tokenId, address indexed to, string documentHash);
event AssetTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
event AssetRevoked(uint256 indexed tokenId);
```

## Deployment

### Prerequisites

- Node.js 18+
- npm or yarn
- Polygon Amoy testnet ETH

### Setup

```bash
cd contracts
npm install
```

### Configure Environment

Create `.env` file:

```bash
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your-private-key
POLYGONSCAN_API_KEY=your-api-key
```

### Deploy

```bash
# Deploy all contracts
npx hardhat run scripts/deploy-all.js --network amoy

# Deploy single contract
npx hardhat run scripts/deploy.js --network amoy
```

### Verify

```bash
npx hardhat run scripts/verify.js --network amoy
```

## Testing

```bash
# Run all tests
npx hardhat test

# Run specific test
npx hardhat test test/Identity.test.js

# Run with coverage
npx hardhat coverage
```

## Security

### Access Control

- Admin role: Full system access
- Manager role: Access request management
- Issuer role: Asset minting
- Controller: DID owner

### Best Practices

1. Use `onlyRole` modifiers for privileged functions
2. Validate inputs thoroughly
3. Emit events for all state changes
4. Use ReentrancyGuard for external calls
5. Pausable for emergency stops

### Audit Checklist

- [ ] Reentrancy protection
- [ ] Integer overflow protection
- [ ] Access control properly configured
- [ ] Events emitted correctly
- [ ] Gas optimization
- [ ] Input validation

## Gas Optimization

- Use `calldata` instead of `memory` for read-only parameters
- Cache storage variables in memory
- Use `unchecked` for safe arithmetic
- Minimize storage writes

## Integration

### Backend Integration

```python
from web3 import Web3

# Load contract
contract = w3.eth.contract(
    address=CONTRACT_ADDRESS,
    abi=CONTRACT_ABI
)

# Create DID
tx = contract.functions.createDID(
    did,
    metadata
).build_transaction({
    'from': sender_address,
    'nonce': w3.eth.get_transaction_count(sender_address),
    'gas': 500000,
    'gasPrice': w3.eth.gas_price
})
```

### Frontend Integration

```typescript
import { ethers } from 'ethers';

const contract = new ethers.Contract(
  contractAddress,
  abi,
  signer
);

// Create DID
const tx = await contract.createDID(did, metadata);
await tx.wait();
```
