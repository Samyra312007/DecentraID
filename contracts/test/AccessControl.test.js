const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentraIDAccessControl", function () {
  let identity, accessControl, deployer, alice, bob, charlie;
  let engineerRole, managerRole;
  const RESOURCE_ID = ethers.keccak256(ethers.toUtf8Bytes("project_x"));
  const READ_ACTION = ethers.keccak256(ethers.toUtf8Bytes("read"));
  const WRITE_ACTION = ethers.keccak256(ethers.toUtf8Bytes("write"));
  const PK_HASH = ethers.keccak256(ethers.toUtf8Bytes("key"));
  const META_HASH = ethers.keccak256(ethers.toUtf8Bytes("meta"));

  beforeEach(async function () {
    [deployer, alice, bob, charlie] = await ethers.getSigners();

    // Deploy Identity
    const Identity = await ethers.getContractFactory("DecentraIDIdentity");
    identity = await Identity.deploy();
    await identity.waitForDeployment();

    // Deploy AccessControl
    const AccessControl = await ethers.getContractFactory(
      "DecentraIDAccessControl"
    );
    accessControl = await AccessControl.deploy(await identity.getAddress());
    await accessControl.waitForDeployment();

    // Create DIDs for all users
    await identity.connect(alice).createDID(PK_HASH, META_HASH);
    await identity.connect(bob).createDID(PK_HASH, META_HASH);
    await identity.connect(charlie).createDID(PK_HASH, META_HASH);

    // Create roles
    const tx1 = await accessControl.createRole("Engineer", "Software engineer");
    const receipt1 = await tx1.wait();
    engineerRole = receipt1.logs[0].args.roleId;

    const tx2 = await accessControl.createRole("Manager", "Team manager");
    const receipt2 = await tx2.wait();
    managerRole = receipt2.logs[0].args.roleId;
  });

  // ========== DEPLOYMENT ==========

  describe("Deployment", function () {
    it("should set deployer as admin", async function () {
      const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
      expect(await accessControl.hasRole(ADMIN_ROLE, deployer.address)).to.be
        .true;
    });

    it("should set deployer as default admin", async function () {
      const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
      expect(
        await accessControl.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)
      ).to.be.true;
    });

    it("should store identity contract address", async function () {
      expect(await accessControl.identityContract()).to.equal(
        await identity.getAddress()
      );
    });

    it("should reject zero address for identity contract", async function () {
      const AccessControl = await ethers.getContractFactory(
        "DecentraIDAccessControl"
      );
      await expect(
        AccessControl.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid identity contract");
    });
  });

  // ========== ROLE MANAGEMENT ==========

  describe("Role Management", function () {
    it("should create a role", async function () {
      const tx = await accessControl.createRole("Tester", "QA tester");
      const receipt = await tx.wait();
      const roleId = receipt.logs[0].args.roleId;

      const role = await accessControl.getRole(roleId);
      expect(role.name).to.equal("Tester");
      expect(role.description).to.equal("QA tester");
      expect(role.active).to.be.true;
      expect(role.createdBy).to.equal(deployer.address);
    });

    it("should emit RoleCreated event", async function () {
      await expect(accessControl.createRole("Tester", "QA tester")).to.emit(
        accessControl,
        "RoleCreated"
      );
    });

    it("should assign role to user", async function () {
      await accessControl.assignRole(bob.address, engineerRole);
      const roles = await accessControl.getUserRoles(bob.address);
      expect(roles).to.include(engineerRole);
    });

    it("should emit RoleAssigned event", async function () {
      const tx = await accessControl.assignRole(bob.address, engineerRole);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(accessControl, "RoleAssigned")
        .withArgs(bob.address, engineerRole, block.timestamp);
    });

    it("should revoke role from user", async function () {
      await accessControl.assignRole(bob.address, engineerRole);
      await accessControl.revokeUserRole(bob.address, engineerRole);
      const roles = await accessControl.getUserRoles(bob.address);
      expect(roles).to.not.include(engineerRole);
    });

    it("should emit RoleRevoked event", async function () {
      await accessControl.assignRole(bob.address, engineerRole);
      const tx = await accessControl.revokeUserRole(bob.address, engineerRole);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(accessControl, "UserRoleRevoked")
        .withArgs(bob.address, engineerRole, block.timestamp);
    });

    it("should reject duplicate role assignment", async function () {
      await accessControl.assignRole(bob.address, engineerRole);
      await expect(
        accessControl.assignRole(bob.address, engineerRole)
      ).to.be.revertedWith("Already has role");
    });

    it("should reject role assignment by non-admin/manager", async function () {
      await expect(
        accessControl.connect(alice).assignRole(bob.address, engineerRole)
      ).to.be.revertedWith("Not manager or admin");
    });

    it("should reject revoking role user doesn't have", async function () {
      await expect(
        accessControl.revokeUserRole(bob.address, engineerRole)
      ).to.be.revertedWith("Does not have role");
    });

    it("should allow manager to assign roles", async function () {
      // Grant MANAGER_ROLE on AccessControl to alice
      const MANAGER_ROLE = ethers.keccak256(
        ethers.toUtf8Bytes("MANAGER_ROLE")
      );
      await accessControl.grantRole(MANAGER_ROLE, alice.address);

      // Now alice can assign roles
      await accessControl.connect(alice).assignRole(bob.address, engineerRole);
      const roles = await accessControl.getUserRoles(bob.address);
      expect(roles).to.include(engineerRole);
    });

    it("should return all role IDs", async function () {
      const roleIds = await accessControl.getAllRoleIds();
      expect(roleIds.length).to.equal(2); // engineer + manager
      expect(roleIds).to.include(engineerRole);
      expect(roleIds).to.include(managerRole);
    });
  });

  // ========== POLICY MANAGEMENT ==========

  describe("Policy Management", function () {
    it("should create a policy", async function () {
      const tx = await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        0
      );
      const receipt = await tx.wait();
      const policyId = receipt.logs[0].args.policyId;

      const policyIds = await accessControl.getAllPolicyIds();
      expect(policyIds).to.include(policyId);
    });

    it("should emit PolicyCreated event", async function () {
      await expect(
        accessControl.createPolicy(
          RESOURCE_ID,
          READ_ACTION,
          [engineerRole],
          [],
          0
        )
      ).to.emit(accessControl, "PolicyCreated");
    });

    it("should deactivate a policy", async function () {
      const tx = await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        0
      );
      const receipt = await tx.wait();
      const policyId = receipt.logs[0].args.policyId;

      await expect(accessControl.deactivatePolicy(policyId)).to.emit(
        accessControl,
        "PolicyDeactivated"
      );
    });

    it("should reject deactivation of inactive policy", async function () {
      const tx = await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        0
      );
      const receipt = await tx.wait();
      const policyId = receipt.logs[0].args.policyId;

      await accessControl.deactivatePolicy(policyId);
      await expect(accessControl.deactivatePolicy(policyId)).to.be.revertedWith(
        "Policy not active"
      );
    });

    it("should reject policy creation by non-admin", async function () {
      await expect(
        accessControl
          .connect(alice)
          .createPolicy(RESOURCE_ID, READ_ACTION, [engineerRole], [], 0)
      ).to.be.revertedWith("Unauthorized");
    });

    it("should return all policy IDs", async function () {
      await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        0
      );
      await accessControl.createPolicy(
        RESOURCE_ID,
        WRITE_ACTION,
        [managerRole],
        [],
        0
      );

      const policyIds = await accessControl.getAllPolicyIds();
      expect(policyIds.length).to.equal(2);
    });
  });

  // ========== ACCESS REQUEST FLOW ==========

  describe("Access Request Flow", function () {
    it("should create access request", async function () {
      const tx = await accessControl
        .connect(bob)
        .requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
      const receipt = await tx.wait();

      const requestId = receipt.logs[0].args.requestId;
      const request = await accessControl.getRequest(requestId);

      expect(request.requester).to.equal(bob.address);
      expect(request.resourceId).to.equal(RESOURCE_ID);
      expect(request.action).to.equal(READ_ACTION);
      expect(request.status).to.equal(0); // Pending
      expect(request.reason).to.equal("Need access");
    });

    it("should emit AccessRequested event", async function () {
      await expect(
        accessControl
          .connect(bob)
          .requestAccess(RESOURCE_ID, READ_ACTION, "Need access")
      ).to.emit(accessControl, "AccessRequested");
    });

    it("should approve access request", async function () {
      const tx = await accessControl
        .connect(bob)
        .requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
      const receipt = await tx.wait();
      const requestId = receipt.logs[0].args.requestId;

      const decideTx = await accessControl.decideAccess(requestId, true);
      const decideReceipt = await decideTx.wait();
      const block = await ethers.provider.getBlock(decideReceipt.blockNumber);

      await expect(decideTx)
        .to.emit(accessControl, "AccessDecided")
        .withArgs(requestId, true, block.timestamp);

      const request = await accessControl.getRequest(requestId);
      expect(request.status).to.equal(1); // Approved
    });

    it("should deny access request", async function () {
      const tx = await accessControl
        .connect(bob)
        .requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
      const receipt = await tx.wait();
      const requestId = receipt.logs[0].args.requestId;

      const decideTx = await accessControl.decideAccess(requestId, false);
      const decideReceipt = await decideTx.wait();
      const block = await ethers.provider.getBlock(decideReceipt.blockNumber);

      await expect(decideTx)
        .to.emit(accessControl, "AccessDecided")
        .withArgs(requestId, false, block.timestamp);

      const request = await accessControl.getRequest(requestId);
      expect(request.status).to.equal(2); // Denied
    });

    it("should reject request from non-active DID", async function () {
      // Deactivate charlie's DID
      await identity.connect(charlie).deactivateDID();

      await expect(
        accessControl
          .connect(charlie)
          .requestAccess(RESOURCE_ID, READ_ACTION, "Need access")
      ).to.be.revertedWith("DID not active");
    });

    it("should reject deciding on non-pending request", async function () {
      const tx = await accessControl
        .connect(bob)
        .requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
      const receipt = await tx.wait();
      const requestId = receipt.logs[0].args.requestId;

      await accessControl.decideAccess(requestId, true);

      await expect(
        accessControl.decideAccess(requestId, false)
      ).to.be.revertedWith("Request not pending");
    });

    it("should reject decision by non-manager/admin", async function () {
      const tx = await accessControl
        .connect(bob)
        .requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
      const receipt = await tx.wait();
      const requestId = receipt.logs[0].args.requestId;

      await expect(
        accessControl.connect(charlie).decideAccess(requestId, true)
      ).to.be.revertedWith("Not manager or admin");
    });
  });

  // ========== ACCESS CHECK ==========

  describe("Access Check", function () {
    it("should grant access when user has required role", async function () {
      await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        0
      );

      await accessControl.assignRole(bob.address, engineerRole);

      const hasAccess = await accessControl.checkAccess(
        bob.address,
        RESOURCE_ID,
        READ_ACTION
      );
      expect(hasAccess).to.be.true;
    });

    it("should deny access when user lacks required role", async function () {
      await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        0
      );

      // charlie has no role
      const hasAccess = await accessControl.checkAccess(
        charlie.address,
        RESOURCE_ID,
        READ_ACTION
      );
      expect(hasAccess).to.be.false;
    });

    it("should deny access when DID is not active", async function () {
      await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        0
      );
      await accessControl.assignRole(alice.address, engineerRole);
      await identity.suspendDID(alice.address);

      const hasAccess = await accessControl.checkAccess(
        alice.address,
        RESOURCE_ID,
        READ_ACTION
      );
      expect(hasAccess).to.be.false;
    });

    it("should deny access when policy is expired", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const futureTime = currentBlock.timestamp + 3600;

      await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        futureTime
      );
      await accessControl.assignRole(bob.address, engineerRole);

      // Access should work initially
      expect(
        await accessControl.checkAccess(bob.address, RESOURCE_ID, READ_ACTION)
      ).to.be.true;
    });

    it("should deny access when no matching policy exists", async function () {
      await accessControl.assignRole(bob.address, engineerRole);

      const hasAccess = await accessControl.checkAccess(
        bob.address,
        RESOURCE_ID,
        READ_ACTION
      );
      expect(hasAccess).to.be.false;
    });

    it("should deny access when policy is deactivated", async function () {
      const tx = await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole],
        [],
        0
      );
      const receipt = await tx.wait();
      const policyId = receipt.logs[0].args.policyId;

      await accessControl.assignRole(bob.address, engineerRole);
      await accessControl.deactivatePolicy(policyId);

      const hasAccess = await accessControl.checkAccess(
        bob.address,
        RESOURCE_ID,
        READ_ACTION
      );
      expect(hasAccess).to.be.false;
    });

    it("should allow access with multiple allowed roles", async function () {
      await accessControl.createPolicy(
        RESOURCE_ID,
        READ_ACTION,
        [engineerRole, managerRole],
        [],
        0
      );

      await accessControl.assignRole(bob.address, engineerRole);
      await accessControl.assignRole(alice.address, managerRole);

      expect(
        await accessControl.checkAccess(bob.address, RESOURCE_ID, READ_ACTION)
      ).to.be.true;
      expect(
        await accessControl.checkAccess(alice.address, RESOURCE_ID, READ_ACTION)
      ).to.be.true;
    });
  });

  // ========== PAUSE / UNPAUSE ==========

  describe("Pause / Unpause", function () {
    it("should pause the contract", async function () {
      await accessControl.pause();

      // In OZ v5, paused() is a public view, requestAccess should revert
      await expect(
        accessControl
          .connect(bob)
          .requestAccess(RESOURCE_ID, READ_ACTION, "Need access")
      ).to.be.reverted;
    });

    it("should unpause the contract", async function () {
      await accessControl.pause();
      await accessControl.unpause();

      // Should work after unpause
      await accessControl
        .connect(bob)
        .requestAccess(RESOURCE_ID, READ_ACTION, "Need access");
    });

    it("should reject pause by non-admin", async function () {
      await expect(
        accessControl.connect(alice).pause()
      ).to.be.revertedWith("Unauthorized");
    });
  });
});
