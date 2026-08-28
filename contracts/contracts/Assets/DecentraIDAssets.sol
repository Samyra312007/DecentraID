// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IAssets.sol";

/**
 * @title DecentraIDAssets
 * @notice ERC721 NFT for digital asset management
 * @dev Mints, transfers, revokes, and verifies digital assets
 */
contract DecentraIDAssets is
    IAssets,
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    AccessControl,
    ReentrancyGuard
{
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    uint256 private _tokenIdCounter;
    mapping(uint256 => AssetMetadata) private assets;
    mapping(bytes32 => uint256[]) private issuerAssets;
    mapping(bytes32 => uint256[]) private ownerAssets;

    constructor() ERC721("DecentraID Asset", "DIDNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

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
    ) external onlyRole(ISSUER_ROLE) nonReentrant returns (uint256) {
        require(_to != address(0), "Invalid recipient");
        require(_ipfsHash != bytes32(0), "Invalid IPFS hash");

        uint256 tokenId = _tokenIdCounter++;

        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);

        assets[tokenId] = AssetMetadata({
            assetType: _assetType,
            issuerDID: _issuerDID,
            ownerDID: bytes32(uint256(uint160(_to))),
            issuedAt: block.timestamp,
            expiresAt: _expiresAt,
            ipfsHash: _ipfsHash,
            documentHash: _documentHash,
            status: AssetStatus.Active,
            jurisdiction: _jurisdiction
        });

        issuerAssets[_issuerDID].push(tokenId);
        ownerAssets[bytes32(uint256(uint160(_to)))].push(tokenId);

        emit AssetMinted(tokenId, _issuerDID, _assetType, block.timestamp);
        return tokenId;
    }

    /**
     * @notice Transfer asset ownership
     * @param _tokenId Token to transfer
     * @param _to New owner address
     */
    function transferAsset(uint256 _tokenId, address _to)
        public
        override
        nonReentrant
    {
        require(ownerOf(_tokenId) == _msgSender(), "Not token owner");
        require(
            assets[_tokenId].status == AssetStatus.Active,
            "Asset not active"
        );
        require(
            assets[_tokenId].expiresAt == 0 ||
                block.timestamp < assets[_tokenId].expiresAt,
            "Asset expired"
        );

        bytes32 fromDID = assets[_tokenId].ownerDID;
        bytes32 toDID = bytes32(uint256(uint160(_to)));

        super.transferFrom(ownerOf(_tokenId), _to, _tokenId);

        assets[_tokenId].ownerDID = toDID;
        assets[_tokenId].status = AssetStatus.Transferred;

        emit AssetTransferred(_tokenId, fromDID, toDID, block.timestamp);
    }

    /**
     * @notice Revoke an asset (admin only)
     * @param _tokenId Token to revoke
     * @param _reason Revocation reason
     */
    function revokeAsset(uint256 _tokenId, string memory _reason)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        nonReentrant
    {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        require(
            assets[_tokenId].status == AssetStatus.Active,
            "Asset not active"
        );

        assets[_tokenId].status = AssetStatus.Revoked;

        emit AssetRevoked(
            _tokenId,
            bytes32(uint256(uint160(msg.sender))),
            _reason,
            block.timestamp
        );
    }

    /**
     * @notice Verify an asset's authenticity
     * @param _tokenId Token to verify
     * @return valid Whether the asset is valid
     * @return metadata The asset metadata
     */
    function verifyAsset(uint256 _tokenId)
        external
        view
        override
        returns (bool valid, AssetMetadata memory metadata)
    {
        metadata = assets[_tokenId];

        bool isActive = metadata.status == AssetStatus.Active;
        bool notExpired =
            metadata.expiresAt == 0 || block.timestamp < metadata.expiresAt;
        bool exists = ownerOf(_tokenId) != address(0);

        valid = isActive && notExpired && exists;
    }

    /**
     * @notice Get asset metadata
     * @param _tokenId Token ID
     * @return The asset metadata
     */
    function getAsset(uint256 _tokenId)
        external
        view
        override
        returns (AssetMetadata memory)
    {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");
        return assets[_tokenId];
    }

    /**
     * @notice Get all assets issued by a DID
     * @param _issuerDID Issuer DID
     * @return Array of token IDs
     */
    function getIssuerAssets(bytes32 _issuerDID)
        external
        view
        override
        returns (uint256[] memory)
    {
        return issuerAssets[_issuerDID];
    }

    /**
     * @notice Get all assets owned by a DID
     * @param _ownerDID Owner DID
     * @return Array of token IDs
     */
    function getOwnerAssets(bytes32 _ownerDID)
        external
        view
        override
        returns (uint256[] memory)
    {
        return ownerAssets[_ownerDID];
    }

    /**
     * @notice Get total supply of minted assets
     * @return Total token count
     */
    function totalSupply() public view override(ERC721Enumerable) returns (uint256) {
        return super.totalSupply();
    }

    // ========== REQUIRED OVERRIDES ==========

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
