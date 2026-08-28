// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IDecentraAccess
 * @notice Interface for the DecentraID Access Control contract
 * @dev Manages roles, policies, and access requests
 */
interface IDecentraAccess {
    // ========== STRUCTS ==========

    struct Role {
        bytes32 roleId;
        string name;
        string description;
        uint256 createdAt;
        address createdBy;
        bool active;
    }

    struct Policy {
        bytes32 policyId;
        bytes32 resourceType;
        bytes32 action;
        bytes32[] allowedRoles;
        AttributeCondition[] conditions;
        uint256 validUntil;
        bool active;
    }

    struct AttributeCondition {
        bytes32 attributeKey;
        bytes32 operator;
        bytes32[] values;
    }

    struct AccessGrant {
        address did;
        bytes32 resourceId;
        bytes32 action;
        uint256 grantedAt;
        uint256 expiresAt;
        bool revoked;
    }

    struct AccessRequest {
        address requester;
        bytes32 resourceId;
        bytes32 action;
        uint256 requestedAt;
        uint8 status;
        string reason;
    }

    // ========== EVENTS ==========

    event RoleCreated(
        bytes32 indexed roleId,
        string name,
        uint256 timestamp
    );

    event RoleAssigned(
        address indexed did,
        bytes32 indexed roleId,
        uint256 timestamp
    );

    event UserRoleRevoked(
        address indexed did,
        bytes32 indexed roleId,
        uint256 timestamp
    );

    event PolicyCreated(
        bytes32 indexed policyId,
        bytes32 resourceType,
        uint256 timestamp
    );

    event PolicyDeactivated(bytes32 indexed policyId, uint256 timestamp);

    event AccessRequested(
        bytes32 indexed requestId,
        address indexed requester,
        bytes32 resourceId,
        uint256 timestamp
    );

    event AccessDecided(
        bytes32 indexed requestId,
        bool approved,
        uint256 timestamp
    );

    event AccessGranted(
        bytes32 indexed grantId,
        address indexed did,
        bytes32 resourceId,
        uint256 timestamp
    );

    event AccessRevoked(bytes32 indexed grantId, uint256 timestamp);

    // ========== FUNCTIONS ==========

    /**
     * @notice Create a new role
     * @param _name Role name
     * @param _description Role description
     * @return roleId The created role ID
     */
    function createRole(string memory _name, string memory _description)
        external
        returns (bytes32);

    /**
     * @notice Assign a role to a user
     * @param _did The DID address to assign the role to
     * @param _roleId The role ID to assign
     */
    function assignRole(address _did, bytes32 _roleId) external;

    /**
     * @notice Revoke a role from a user
     * @param _did The DID address to revoke the role from
     * @param _roleId The role ID to revoke
     */
    function revokeUserRole(address _did, bytes32 _roleId) external;

    /**
     * @notice Create an access policy
     * @param _resourceType The resource type the policy applies to
     * @param _action The action the policy allows
     * @param _allowedRoles Array of role IDs that are allowed
     * @param _conditions Array of attribute conditions
     * @param _validUntil Timestamp when the policy expires (0 = never)
     * @return policyId The created policy ID
     */
    function createPolicy(
        bytes32 _resourceType,
        bytes32 _action,
        bytes32[] memory _allowedRoles,
        AttributeCondition[] memory _conditions,
        uint256 _validUntil
    ) external returns (bytes32);

    /**
     * @notice Deactivate a policy
     * @param _policyId The policy ID to deactivate
     */
    function deactivatePolicy(bytes32 _policyId) external;

    /**
     * @notice Request access to a resource
     * @param _resourceId The resource ID
     * @param _action The action requested
     * @param _reason Reason for the request
     * @return requestId The created request ID
     */
    function requestAccess(
        bytes32 _resourceId,
        bytes32 _action,
        string memory _reason
    ) external returns (bytes32);

    /**
     * @notice Approve or deny an access request
     * @param _requestId The request ID
     * @param _approve True to approve, false to deny
     */
    function decideAccess(bytes32 _requestId, bool _approve) external;

    /**
     * @notice Check if a DID has access to a resource
     * @param _did The DID address
     * @param _resourceId The resource ID
     * @param _action The action to check
     * @return True if access is granted
     */
    function checkAccess(
        address _did,
        bytes32 _resourceId,
        bytes32 _action
    ) external view returns (bool);

    /**
     * @notice Get a role by ID
     * @param _roleId The role ID
     * @return The role struct
     */
    function getRole(bytes32 _roleId) external view returns (Role memory);

    /**
     * @notice Get all roles assigned to a DID
     * @param _did The DID address
     * @return Array of role IDs
     */
    function getUserRoles(address _did)
        external
        view
        returns (bytes32[] memory);

    /**
     * @notice Get an access request by ID
     * @param _requestId The request ID
     * @return The access request struct
     */
    function getRequest(bytes32 _requestId)
        external
        view
        returns (AccessRequest memory);

    /**
     * @notice Get all role IDs
     * @return Array of role IDs
     */
    function getAllRoleIds() external view returns (bytes32[] memory);

    /**
     * @notice Get all policy IDs
     * @return Array of policy IDs
     */
    function getAllPolicyIds() external view returns (bytes32[] memory);
}
