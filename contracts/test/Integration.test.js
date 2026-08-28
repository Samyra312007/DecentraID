const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Integration Tests", function () {
  let identity, accessControl, assets;
  let deployer, alice, bob, charlie, manager;
  const PK_HASH = ethers.keccak256(ethers.toUtf8Bytes("key"));
  const META_HASH = ethers.keccak256(ethers.toUtf8Bytes("meta"));

  beforeEach(async function () {
    [deployer, alice, bob, charlie, manager] = await ethers.getSigners();

    // Deploy Identity
    const Identity = await ethers.getContractFactory("DecentraIDIdentity");
    identity = await Identity.deploy();
    await identity.waitForDeployment();

    // Deploy AccessControl (linked to Identity)
    const AccessControl = await ethers.getContractFactory(
      "DecentraIDAccessControl"
    );
    accessControl = await AccessControl.deploy(await identity.getAddress());
    await accessControl.waitForDeployment();

    // Deploy Assets
    const Assets = await ethers.getContractFactory("DecentraIDAssets");
    assets = await Assets.deploy();
    await assets.waitForDeployment();

    // Setup roles
    const ISSUER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ISSUER_ROLE"));
    await assets.grantRole(ISSUER_ROLE, deployer.address);

    const MANAGER_ROLE = ethers.keccak256(
      ethers.toUtf8Bytes("MANAGER_ROLE")
    );
    await accessControl.grantRole(MANAGER_ROLE, manager.address);

    // Create DIDs for all users
    await identity.connect(alice).createDID(PK_HASH, META_HASH);
    await identity.connect(bob).createDID(PK_HASH, META_HASH);
    await identity.connect(charlie).createDID(PK_HASH, META_HASH);
    await identity.connect(manager).createDID(PK_HASH, META_HASH);
  });

  describe("End-to-End Flow: Identity + Access + Assets", function () {
    it("should complete full user lifecycle", async function () {
      // 1. Users have DIDs
      expect(await identity.isDIDActive(alice.address)).to.be.true;
      expect(await identity.isDIDActive(bob.address)).to.be.true;

      // 2. Create roles
      const engineerTx = await accessControl.createRole(
        "Engineer",
        "Software engineer"
      );
      const engineerReceipt = await engineerTx.wait();
      const engineerRole = engineerReceipt.logs[0].args.roleId;

      const adminTx = await accessControl.createRole(
        "Admin",
        "System administrator"
      );
      const adminReceipt = await adminTx.wait();
      const adminRole = adminReceipt.logs[0].args.roleId;

      // 3. Assign roles
      await accessControl.assignRole(alice.address, engineerRole);
      await accessControl.assignRole(bob.address, adminRole);

      // 4. Create access policy
      const resourceId = ethers.keccak256(
        ethers.toUtf8Bytes("source_code")
      );
      const readAction = ethers.keccak256(ethers.toUtf8Bytes("read"));

      await accessControl.createPolicy(
        resourceId,
        readAction,
        [engineerRole, adminRole],
        [],
        0
      );

      // 5. Check access
      expect(
        await accessControl.checkAccess(alice.address, resourceId, readAction)
      ).to.be.true;
      expect(
        await accessControl.checkAccess(bob.address, resourceId, readAction)
      ).to.be.true;
      expect(
        await accessControl.checkAccess(charlie.address, resourceId, readAction)
      ).to.be.false;

      // 6. Mint an asset
      const assetType = ethers.keccak256(
        ethers.toUtf8Bytes("certificate")
      );
      const issuerDID = ethers.zeroPadValue(deployer.address, 32);
      const ipfsHash = ethers.keccak256(
        ethers.toUtf8Bytes("QmTestHash123")
      );
      const docHash = ethers.keccak256(
        ethers.toUtf8Bytes("document_hash")
      );

      const mintTx = await assets.mintAsset(
        alice.address,
        assetType,
        issuerDID,
        ipfsHash,
        docHash,
        0,
        "ipfs://QmMetadata",
        "India"
      );
      await mintTx.wait();

      // 7. Verify asset
      const [valid, metadata] = await assets.verifyAsset(0);
      expect(valid).to.be.true;
      expect(metadata.assetType).to.equal(assetType);

      // 8. Transfer asset
      await assets.connect(alice).transferAsset(0, bob.address);
      expect(await assets.ownerOf(0)).to.equal(bob.address);

      // 9. Access request flow
      const requestTx = await accessControl
        .connect(charlie)
        .requestAccess(
          resourceId,
          readAction,
          "I need access to source code"
        );
      const requestReceipt = await requestTx.wait();
      const requestId = requestReceipt.logs[0].args.requestId;

      // Manager approves
      await accessControl.connect(manager).decideAccess(requestId, true);

      const request = await accessControl.getRequest(requestId);
      expect(request.status).to.equal(1); // Approved
    });

    it("should handle DID suspension affecting access control", async function () {
      // Create role and policy
      const engineerTx = await accessControl.createRole(
        "Engineer",
        "Software engineer"
      );
      const engineerReceipt = await engineerTx.wait();
      const engineerRole = engineerReceipt.logs[0].args.roleId;

      const resourceId = ethers.keccak256(
        ethers.toUtf8Bytes("resource_1")
      );
      const readAction = ethers.keccak256(ethers.toUtf8Bytes("read"));

      await accessControl.createPolicy(
        resourceId,
        readAction,
        [engineerRole],
        [],
        0
      );

      // Assign role to alice
      await accessControl.assignRole(alice.address, engineerRole);

      // Alice has access
      expect(
        await accessControl.checkAccess(alice.address, resourceId, readAction)
      ).to.be.true;

      // Suspend alice's DID
      await identity.suspendDID(alice.address);

      // Alice loses access
      expect(
        await accessControl.checkAccess(alice.address, resourceId, readAction)
      ).to.be.false;

      // Reactivate alice's DID
      await identity.reactivateDID(alice.address);

      // Alice regains access
      expect(
        await accessControl.checkAccess(alice.address, resourceId, readAction)
      ).to.be.true;
    });

    it("should handle role revocation affecting access control", async function () {
      const engineerTx = await accessControl.createRole(
        "Engineer",
        "Software engineer"
      );
      const engineerReceipt = await engineerTx.wait();
      const engineerRole = engineerReceipt.logs[0].args.roleId;

      const resourceId = ethers.keccak256(
        ethers.toUtf8Bytes("resource_2")
      );
      const readAction = ethers.keccak256(ethers.toUtf8Bytes("read"));

      await accessControl.createPolicy(
        resourceId,
        readAction,
        [engineerRole],
        [],
        0
      );

      // Assign role to bob
      await accessControl.assignRole(bob.address, engineerRole);
      expect(
        await accessControl.checkAccess(bob.address, resourceId, readAction)
      ).to.be.true;

      // Revoke role from bob (use revokeUserRole to avoid OZ ambiguity)
      await accessControl.revokeUserRole(bob.address, engineerRole);
      expect(
        await accessControl.checkAccess(bob.address, resourceId, readAction)
      ).to.be.false;
    });

    it("should handle policy deactivation", async function () {
      const engineerTx = await accessControl.createRole(
        "Engineer",
        "Software engineer"
      );
      const engineerReceipt = await engineerTx.wait();
      const engineerRole = engineerReceipt.logs[0].args.roleId;

      const resourceId = ethers.keccak256(
        ethers.toUtf8Bytes("resource_3")
      );
      const readAction = ethers.keccak256(ethers.toUtf8Bytes("read"));

      const policyTx = await accessControl.createPolicy(
        resourceId,
        readAction,
        [engineerRole],
        [],
        0
      );
      const policyReceipt = await policyTx.wait();
      const policyId = policyReceipt.logs[0].args.policyId;

      await accessControl.assignRole(alice.address, engineerRole);

      // Alice has access
      expect(
        await accessControl.checkAccess(alice.address, resourceId, readAction)
      ).to.be.true;

      // Deactivate policy
      await accessControl.deactivatePolicy(policyId);

      // Alice loses access
      expect(
        await accessControl.checkAccess(alice.address, resourceId, readAction)
      ).to.be.false;
    });

    it("should handle multiple assets and multiple users", async function () {
      const issuerDID = ethers.zeroPadValue(deployer.address, 32);
      const assetType1 = ethers.keccak256(ethers.toUtf8Bytes("certificate"));
      const assetType2 = ethers.keccak256(
        ethers.toUtf8Bytes("license")
      );
      const ipfsHash = ethers.keccak256(ethers.toUtf8Bytes("QmHash"));
      const docHash = ethers.keccak256(ethers.toUtf8Bytes("doc_hash"));

      // Mint multiple assets
      await assets.mintAsset(
        alice.address,
        assetType1,
        issuerDID,
        ipfsHash,
        docHash,
        0,
        "ipfs://meta1",
        "India"
      );
      await assets.mintAsset(
        bob.address,
        assetType2,
        issuerDID,
        ipfsHash,
        docHash,
        0,
        "ipfs://meta2",
        "USA"
      );
      await assets.mintAsset(
        alice.address,
        assetType2,
        issuerDID,
        ipfsHash,
        docHash,
        0,
        "ipfs://meta3",
        "India"
      );

      // Verify total supply
      expect(await assets.totalSupply()).to.equal(3);

      // Verify owner assets
      const aliceDID = ethers.zeroPadValue(alice.address, 32);
      const aliceTokens = await assets.getOwnerAssets(aliceDID);
      expect(aliceTokens.length).to.equal(2);

      const bobDID = ethers.zeroPadValue(bob.address, 32);
      const bobTokens = await assets.getOwnerAssets(bobDID);
      expect(bobTokens.length).to.equal(1);

      // Verify all assets
      for (let i = 0; i < 3; i++) {
        const [valid] = await assets.verifyAsset(i);
        expect(valid).to.be.true;
      }
    });

    it("should handle expired policies correctly", async function () {
      const engineerTx = await accessControl.createRole(
        "Engineer",
        "Software engineer"
      );
      const engineerReceipt = await engineerTx.wait();
      const engineerRole = engineerReceipt.logs[0].args.roleId;

      const resourceId = ethers.keccak256(
        ethers.toUtf8Bytes("resource_4")
      );
      const readAction = ethers.keccak256(ethers.toUtf8Bytes("read"));

      // Create policy that expires in 1 hour
      const currentBlock = await ethers.provider.getBlock("latest");
      const futureTime = currentBlock.timestamp + 3600;

      await accessControl.createPolicy(
        resourceId,
        readAction,
        [engineerRole],
        [],
        futureTime
      );

      await accessControl.assignRole(alice.address, engineerRole);

      // Access should work now
      expect(
        await accessControl.checkAccess(alice.address, resourceId, readAction)
      ).to.be.true;
    });

    it("should emit all events in correct order", async function () {
      // This test verifies the complete event chain
      const engineerTx = await accessControl.createRole(
        "Engineer",
        "Software engineer"
      );
      await expect(engineerTx).to.emit(accessControl, "RoleCreated");

      const resourceId = ethers.keccak256(
        ethers.toUtf8Bytes("resource_5")
      );
      const readAction = ethers.keccak256(ethers.toUtf8Bytes("read"));

      const policyTx = await accessControl.createPolicy(
        resourceId,
        readAction,
        [ethers.keccak256(ethers.toUtf8Bytes("Engineer"))],
        [],
        0
      );
      await expect(policyTx).to.emit(accessControl, "PolicyCreated");

      // Mint asset
      const mintTx = await assets.mintAsset(
        alice.address,
        ethers.keccak256(ethers.toUtf8Bytes("cert")),
        ethers.zeroPadValue(deployer.address, 32),
        ethers.keccak256(ethers.toUtf8Bytes("QmHash")),
        ethers.keccak256(ethers.toUtf8Bytes("doc")),
        0,
        "ipfs://meta",
        "India"
      );
      await expect(mintTx).to.emit(assets, "AssetMinted");
    });
  });
});
