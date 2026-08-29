// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IIdentity.sol";

/**
 * @title DecentraIDIdentity
 * @notice Decentralized Identity management on Polygon
 * @dev Creates, resolves, updates, suspends, and deactivates DIDs
 */
contract DecentraIDIdentity is IIdentity, AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    mapping(address => DIDDocument) private didRegistry;
    mapping(address => mapping(bytes32 => bool)) private authorizedMethods;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Create a new DID for the caller
     * @dev Each address can only have one DID
     * @param _publicKeyHash Hash of the DID public key
     * @param _metadataHash Hash of the DID metadata
     */
    function createDID(
        bytes32 _publicKeyHash,
        bytes32 _metadataHash
    ) external nonReentrant {
        require(
            didRegistry[msg.sender].controller == address(0),
            "DID already exists"
        );
        require(_publicKeyHash != bytes32(0), "Invalid public key hash");

        didRegistry[msg.sender] = DIDDocument({
            controller: msg.sender,
            publicKeyHash: _publicKeyHash,
            metadataHash: _metadataHash,
            created: block.timestamp,
            updated: block.timestamp,
            status: DIDStatus.Active
        });

        // Grant default verification methods
        authorizedMethods[msg.sender][keccak256("Authentication")] = true;
        authorizedMethods[msg.sender][keccak256("Assertion")] = true;

        emit DIDCreated(msg.sender, _publicKeyHash, block.timestamp);
    }

    /**
     * @notice Resolve a DID to its document
     * @param _controller The controller address of the DID
     * @return The DID document
     */
    function resolveDID(address _controller)
        external
        view
        override
        returns (DIDDocument memory)
    {
        require(
            didRegistry[_controller].controller != address(0),
            "DID not found"
        );
        require(
            didRegistry[_controller].status == DIDStatus.Active,
            "DID not active"
        );
        return didRegistry[_controller];
    }

    /**
     * @notice Update DID metadata
     * @dev Only the controller can update their DID
     * @param _newMetadataHash New metadata hash
     */
    function updateDID(bytes32 _newMetadataHash) external nonReentrant {
        require(
            didRegistry[msg.sender].controller == msg.sender,
            "Not DID controller"
        );
        require(
            didRegistry[msg.sender].status == DIDStatus.Active,
            "DID not active"
        );

        didRegistry[msg.sender].metadataHash = _newMetadataHash;
        didRegistry[msg.sender].updated = block.timestamp;

        emit DIDUpdated(msg.sender, _newMetadataHash, block.timestamp);
    }

    /**
     * @notice Suspend a DID (admin only)
     * @param _controller The controller address of the DID
     */
    function suspendDID(address _controller) external onlyRole(ADMIN_ROLE) {
        require(
            didRegistry[_controller].created > 0,
            "DID not found"
        );
        require(
            didRegistry[_controller].status == DIDStatus.Active,
            "DID not active"
        );
        didRegistry[_controller].status = DIDStatus.Suspended;
        didRegistry[_controller].updated = block.timestamp;

        emit DIDSuspended(_controller, block.timestamp);
    }

    /**
     * @notice Reactivate a suspended DID (admin only)
     * @param _controller The controller address of the DID
     */
    function reactivateDID(address _controller)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(
            didRegistry[_controller].status == DIDStatus.Suspended,
            "DID not suspended"
        );
        didRegistry[_controller].status = DIDStatus.Active;
        didRegistry[_controller].updated = block.timestamp;

        emit DIDReactivated(_controller, block.timestamp);
    }

    /**
     * @notice Deactivate a DID permanently
     * @dev Only the controller can deactivate their DID
     */
    function deactivateDID() external nonReentrant {
        require(
            didRegistry[msg.sender].controller == msg.sender,
            "Not DID controller"
        );
        require(
            didRegistry[msg.sender].status != DIDStatus.Deactivated,
            "Already deactivated"
        );

        didRegistry[msg.sender].status = DIDStatus.Deactivated;
        didRegistry[msg.sender].updated = block.timestamp;

        emit DIDDeactivated(msg.sender, block.timestamp);
    }

    /**
     * @notice Check if a DID is active
     * @param _controller The controller address of the DID
     * @return True if the DID is active
     */
    function isDIDActive(address _controller)
        external
        view
        override
        returns (bool)
    {
        return didRegistry[_controller].created > 0 &&
            didRegistry[_controller].status == DIDStatus.Active;
    }

    /**
     * @notice Check if an address has a specific verification method
     * @param _controller The controller address
     * @param _method The verification method hash
     * @return True if authorized
     */
    function hasVerificationMethod(
        address _controller,
        bytes32 _method
    ) external view returns (bool) {
        return authorizedMethods[_controller][_method];
    }


}
