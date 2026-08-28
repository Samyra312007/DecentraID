// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../interfaces/IIdentity.sol";
import "../interfaces/IDecentraAccess.sol";

/**
 * @title DecentraIDAccessControl
 * @notice Role-Based and Attribute-Based Access Control
 * @dev Manages roles, policies, access requests, and grants
 */
contract DecentraIDAccessControl is IDecentraAccess, AccessControl, ReentrancyGuard, Pausable {
    IIdentity public immutable identityContract;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    mapping(bytes32 => Role) private roles;
    mapping(address => mapping(bytes32 => bool)) private userRoles;
    mapping(bytes32 => Policy) private policies;
    mapping(bytes32 => AccessGrant) private grants;
    mapping(bytes32 => AccessRequest) private requests;
    mapping(address => uint256) private nonces;

    bytes32[] private allRoleIds;
    bytes32[] private allPolicyIds;

    uint256 private requestNonce;

    modifier onlyAppRole(bytes32 role) {
        require(hasRole(role, msg.sender), "Unauthorized");
        _;
    }

    modifier onlyManagerOrAdmin() {
        require(
            hasRole(ADMIN_ROLE, msg.sender) ||
                hasRole(MANAGER_ROLE, msg.sender),
            "Not manager or admin"
        );
        _;
    }

    constructor(address _identityContract) {
        require(_identityContract != address(0), "Invalid identity contract");
        identityContract = IIdentity(_identityContract);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // ========== ROLE MANAGEMENT ==========

    /**
     * @notice Create a new role
     * @param _name Role name
     * @param _description Role description
     * @return roleId The created role ID
     */
    function createRole(string memory _name, string memory _description)
        external
        onlyRole(ADMIN_ROLE)
        returns (bytes32)
    {
        bytes32 roleId = keccak256(
            abi.encodePacked(_name, block.timestamp, msg.sender)
        );

        roles[roleId] = Role({
            roleId: roleId,
            name: _name,
            description: _description,
            createdAt: block.timestamp,
            createdBy: msg.sender,
            active: true
        });

        allRoleIds.push(roleId);
        emit RoleCreated(roleId, _name, block.timestamp);
        return roleId;
    }

    /**
     * @notice Assign a role to a user
     * @param _did The DID address to assign the role to
     * @param _roleId The role ID to assign
     */
    function assignRole(address _did, bytes32 _roleId)
        external
        onlyManagerOrAdmin
    {
        require(roles[_roleId].active, "Role not active");
        require(identityContract.isDIDActive(_did), "DID not active");
        require(!userRoles[_did][_roleId], "Already has role");

        userRoles[_did][_roleId] = true;
        emit RoleAssigned(_did, _roleId, block.timestamp);
    }

    /**
     * @notice Revoke a role from a user
     * @param _did The DID address to revoke the role from
     * @param _roleId The role ID to revoke
     */
    function revokeUserRole(address _did, bytes32 _roleId)
        external
        onlyManagerOrAdmin
    {
        require(userRoles[_did][_roleId], "Does not have role");

        userRoles[_did][_roleId] = false;
        emit UserRoleRevoked(_did, _roleId, block.timestamp);
    }

    // ========== POLICY MANAGEMENT ==========

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
    ) external onlyAppRole(ADMIN_ROLE) returns (bytes32) {
        bytes32 policyId = keccak256(
            abi.encodePacked(_resourceType, _action, block.timestamp)
        );

        policies[policyId] = Policy({
            policyId: policyId,
            resourceType: _resourceType,
            action: _action,
            allowedRoles: _allowedRoles,
            conditions: _conditions,
            validUntil: _validUntil,
            active: true
        });

        allPolicyIds.push(policyId);
        emit PolicyCreated(policyId, _resourceType, block.timestamp);
        return policyId;
    }

    /**
     * @notice Deactivate a policy
     * @param _policyId The policy ID to deactivate
     */
    function deactivatePolicy(bytes32 _policyId)
        external
        onlyAppRole(ADMIN_ROLE)
    {
        require(policies[_policyId].active, "Policy not active");
        policies[_policyId].active = false;
        emit PolicyDeactivated(_policyId, block.timestamp);
    }

    // ========== ACCESS REQUEST FLOW ==========

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
    ) external nonReentrant whenNotPaused returns (bytes32) {
        require(
            identityContract.isDIDActive(msg.sender),
            "DID not active"
        );

        bytes32 requestId = keccak256(
            abi.encodePacked(
                msg.sender,
                _resourceId,
                _action,
                block.timestamp,
                requestNonce++
            )
        );

        requests[requestId] = AccessRequest({
            requester: msg.sender,
            resourceId: _resourceId,
            action: _action,
            requestedAt: block.timestamp,
            status: 0, // Pending
            reason: _reason
        });

        emit AccessRequested(requestId, msg.sender, _resourceId, block.timestamp);
        return requestId;
    }

    /**
     * @notice Approve or deny an access request
     * @param _requestId The request ID
     * @param _approve True to approve, false to deny
     */
    function decideAccess(bytes32 _requestId, bool _approve)
        external
        onlyManagerOrAdmin
        nonReentrant
    {
        AccessRequest storage accessRequest = requests[_requestId];
        require(accessRequest.status == 0, "Request not pending");

        accessRequest.status = _approve ? uint8(1) : uint8(2); // Approved or Denied

        if (_approve) {
            bytes32 grantId = keccak256(
                abi.encodePacked(
                    accessRequest.requester,
                    accessRequest.resourceId,
                    accessRequest.action,
                    block.timestamp
                )
            );

            grants[grantId] = AccessGrant({
                did: accessRequest.requester,
                resourceId: accessRequest.resourceId,
                action: accessRequest.action,
                grantedAt: block.timestamp,
                expiresAt: 0,
                revoked: false
            });

            emit AccessGranted(
                grantId,
                accessRequest.requester,
                accessRequest.resourceId,
                block.timestamp
            );
        }

        emit AccessDecided(_requestId, _approve, block.timestamp);
    }

    // ========== ACCESS CHECK ==========

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
    ) public view returns (bool) {
        // DID must be active
        if (!identityContract.isDIDActive(_did)) return false;

        // Find matching policy
        bytes32 policyId = _findMatchingPolicy(_resourceId, _action);
        if (policyId == bytes32(0)) return false;

        Policy storage policy = policies[policyId];

        // Policy must be active and not expired
        if (!policy.active) return false;
        if (policy.validUntil > 0 && block.timestamp > policy.validUntil)
            return false;

        // Check if user has any of the allowed roles
        bool hasRequiredRole = false;
        for (uint256 i = 0; i < policy.allowedRoles.length; i++) {
            if (userRoles[_did][policy.allowedRoles[i]]) {
                hasRequiredRole = true;
                break;
            }
        }

        return hasRequiredRole;
    }

    /**
     * @dev Internal function to find a matching policy
     */
    function _findMatchingPolicy(
        bytes32 _resourceId,
        bytes32 _action
    ) internal view returns (bytes32) {
        for (uint256 i = 0; i < allPolicyIds.length; i++) {
            Policy storage policy = policies[allPolicyIds[i]];
            if (
                policy.active &&
                policy.resourceType == _resourceId &&
                policy.action == _action &&
                (policy.validUntil == 0 || block.timestamp <= policy.validUntil)
            ) {
                return allPolicyIds[i];
            }
        }
        return bytes32(0);
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @notice Get a role by ID
     * @param _roleId The role ID
     * @return The role struct
     */
    function getRole(bytes32 _roleId)
        external
        view
        override
        returns (Role memory)
    {
        return roles[_roleId];
    }

    /**
     * @notice Get all roles assigned to a DID
     * @param _did The DID address
     * @return Array of role IDs
     */
    function getUserRoles(address _did)
        external
        view
        override
        returns (bytes32[] memory)
    {
        bytes32[] memory userRolesList = new bytes32[](allRoleIds.length);
        uint256 count = 0;

        for (uint256 i = 0; i < allRoleIds.length; i++) {
            if (userRoles[_did][allRoleIds[i]]) {
                userRolesList[count] = allRoleIds[i];
                count++;
            }
        }

        bytes32[] memory result = new bytes32[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = userRolesList[i];
        }

        return result;
    }

    /**
     * @notice Get an access request by ID
     * @param _requestId The request ID
     * @return The access request struct
     */
    function getRequest(bytes32 _requestId)
        external
        view
        override
        returns (AccessRequest memory)
    {
        return requests[_requestId];
    }

    /**
     * @notice Get all role IDs
     * @return Array of role IDs
     */
    function getAllRoleIds()
        external
        view
        override
        returns (bytes32[] memory)
    {
        return allRoleIds;
    }

    /**
     * @notice Get all policy IDs
     * @return Array of policy IDs
     */
    function getAllPolicyIds()
        external
        view
        override
        returns (bytes32[] memory)
    {
        return allPolicyIds;
    }

    /**
     * @notice Get an access grant by ID
     * @param _grantId The grant ID
     * @return The access grant struct
     */
    function getGrant(bytes32 _grantId)
        external
        view
        returns (AccessGrant memory)
    {
        return grants[_grantId];
    }

    /**
     * @notice Pause the contract (admin only)
     */
    function pause() external onlyAppRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause the contract (admin only)
     */
    function unpause() external onlyAppRole(ADMIN_ROLE) {
        _unpause();
    }
}
