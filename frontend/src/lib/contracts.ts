// Contract addresses (filled after deployment)
export const CONTRACTS = {
  IDENTITY: process.env.NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS || '',
  ACCESS_CONTROL: process.env.NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT_ADDRESS || '',
  ASSETS: process.env.NEXT_PUBLIC_ASSET_CONTRACT_ADDRESS || '',
};

// Minimal ABIs for key functions
export const IDENTITY_ABI = [
  'function createDID(bytes32 publicKeyHash, bytes32 metadataHash) external',
  'function resolveDID(address controller) external view returns (address controller, bytes32 publicKeyHash, bytes32 metadataHash, uint256 created, uint256 updated, uint8 status)',
  'function updateDID(bytes32 newMetadataHash) external',
  'function isDIDActive(address controller) external view returns (bool)',
  'event DIDCreated(address indexed controller, bytes32 publicKeyHash, uint256 timestamp)',
  'event DIDUpdated(address indexed controller, bytes32 newMetadataHash, uint256 timestamp)',
];

export const ASSET_ABI = [
  'function mintAsset(address to, bytes32 assetType, bytes32 issuerDID, bytes32 ipfsHash, bytes32 documentHash, uint256 expiresAt, string uri, string jurisdiction) external returns (uint256)',
  'function transferAsset(uint256 tokenId, address to) external',
  'function verifyAsset(uint256 tokenId) external view returns (bool valid, tuple)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function totalSupply() external view returns (uint256)',
  'event AssetMinted(uint256 indexed tokenId, bytes32 indexed issuerDID, bytes32 assetType, uint256 timestamp)',
];

export const ACCESS_CONTROL_ABI = [
  'function requestAccess(bytes32 resourceId, bytes32 action, string reason) external returns (bytes32)',
  'function decideAccess(bytes32 requestId, bool approve) external',
  'function checkAccess(address did, bytes32 resourceId, bytes32 action) external view returns (bool)',
  'function createRole(string name, string description) external returns (bytes32)',
  'function assignRole(address did, bytes32 roleId) external',
  'function revokeUserRole(address did, bytes32 roleId) external',
  'event AccessRequested(bytes32 indexed requestId, address indexed requester, bytes32 resourceId, uint256 timestamp)',
  'event AccessDecided(bytes32 indexed requestId, bool approved, uint256 timestamp)',
];
