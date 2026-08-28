// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IIdentity
 * @notice Interface for the DecentraID Identity contract
 * @dev Manages Decentralized Identifiers (DIDs) on-chain
 */
interface IIdentity {
    // ========== ENUMS ==========

    enum DIDStatus {
        Active,
        Suspended,
        Deactivated
    }

    // ========== STRUCTS ==========

    struct DIDDocument {
        address controller;
        bytes32 publicKeyHash;
        bytes32 metadataHash;
        uint256 created;
        uint256 updated;
        DIDStatus status;
    }

    // ========== EVENTS ==========

    event DIDCreated(
        address indexed controller,
        bytes32 publicKeyHash,
        uint256 timestamp
    );

    event DIDUpdated(
        address indexed controller,
        bytes32 newMetadataHash,
        uint256 timestamp
    );

    event DIDSuspended(address indexed controller, uint256 timestamp);

    event DIDReactivated(address indexed controller, uint256 timestamp);

    event DIDDeactivated(address indexed controller, uint256 timestamp);

    // ========== FUNCTIONS ==========

    /**
     * @notice Create a new DID for the caller
     * @param _publicKeyHash Hash of the DID public key
     * @param _metadataHash Hash of the DID metadata
     */
    function createDID(
        bytes32 _publicKeyHash,
        bytes32 _metadataHash
    ) external;

    /**
     * @notice Resolve a DID to its document
     * @param _controller The controller address of the DID
     * @return The DID document
     */
    function resolveDID(address _controller)
        external
        view
        returns (DIDDocument memory);

    /**
     * @notice Update DID metadata
     * @param _newMetadataHash New metadata hash
     */
    function updateDID(bytes32 _newMetadataHash) external;

    /**
     * @notice Suspend a DID (admin only)
     * @param _controller The controller address of the DID
     */
    function suspendDID(address _controller) external;

    /**
     * @notice Reactivate a suspended DID (admin only)
     * @param _controller The controller address of the DID
     */
    function reactivateDID(address _controller) external;

    /**
     * @notice Deactivate a DID permanently
     */
    function deactivateDID() external;

    /**
     * @notice Check if a DID is active
     * @param _controller The controller address of the DID
     * @return True if the DID is active
     */
    function isDIDActive(address _controller) external view returns (bool);
}
