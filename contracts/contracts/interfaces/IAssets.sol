// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IAssets
 * @notice Interface for the DecentraID NFT Asset contract
 * @dev Manages digital assets as ERC721 NFTs
 */
interface IAssets {
    // ========== ENUMS ==========

    enum AssetStatus {
        Active,
        Revoked,
        Transferred,
        Expired
    }

    // ========== STRUCTS ==========

    struct AssetMetadata {
        bytes32 assetType;
        bytes32 issuerDID;
        bytes32 ownerDID;
        uint256 issuedAt;
        uint256 expiresAt;
        bytes32 ipfsHash;
        bytes32 documentHash;
        AssetStatus status;
        string jurisdiction;
    }

    // ========== EVENTS ==========

    event AssetMinted(
        uint256 indexed tokenId,
        bytes32 indexed issuerDID,
        bytes32 assetType,
        uint256 timestamp
    );

    event AssetTransferred(
        uint256 indexed tokenId,
        bytes32 indexed fromDID,
        bytes32 indexed toDID,
        uint256 timestamp
    );

    event AssetRevoked(
        uint256 indexed tokenId,
        bytes32 indexed revokedBy,
        string reason,
        uint256 timestamp
    );

    // ========== FUNCTIONS ==========

    /**
     * @notice Mint a new asset as an NFT
     * @param _to Recipient address
     * @param _assetType Type of asset
     * @param _issuerDID Issuer DID
     * @param _ipfsHash IPFS content hash
     * @param _documentHash Document content hash
     * @param _expiresAt Expiration timestamp (0 = no expiry)
     * @param _uri Token URI for metadata
     * @param _jurisdiction Jurisdiction of the asset
     * @return tokenId The minted token ID
     */
    function mintAsset(
        address _to,
        bytes32 _assetType,
        bytes32 _issuerDID,
        bytes32 _ipfsHash,
        bytes32 _documentHash,
        uint256 _expiresAt,
        string memory _uri,
        string memory _jurisdiction
    ) external returns (uint256);

    /**
     * @notice Transfer asset ownership
     * @param _tokenId Token to transfer
     * @param _to New owner address
     */
    function transferAsset(uint256 _tokenId, address _to) external;

    /**
     * @notice Revoke an asset (admin only)
     * @param _tokenId Token to revoke
     * @param _reason Revocation reason
     */
    function revokeAsset(uint256 _tokenId, string memory _reason) external;

    /**
     * @notice Verify an asset's authenticity
     * @param _tokenId Token to verify
     * @return valid Whether the asset is valid
     * @return metadata The asset metadata
     */
    function verifyAsset(uint256 _tokenId)
        external
        view
        returns (bool valid, AssetMetadata memory metadata);

    /**
     * @notice Get asset metadata
     * @param _tokenId Token ID
     * @return The asset metadata
     */
    function getAsset(uint256 _tokenId)
        external
        view
        returns (AssetMetadata memory);

    /**
     * @notice Get all assets issued by a DID
     * @param _issuerDID Issuer DID
     * @return Array of token IDs
     */
    function getIssuerAssets(bytes32 _issuerDID)
        external
        view
        returns (uint256[] memory);

    /**
     * @notice Get all assets owned by a DID
     * @param _ownerDID Owner DID
     * @return Array of token IDs
     */
    function getOwnerAssets(bytes32 _ownerDID)
        external
        view
        returns (uint256[] memory);
}
