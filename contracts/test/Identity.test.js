const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentraIDIdentity", function () {
  let identity, deployer, alice, bob, charlie;
  const PUBLIC_KEY_HASH = ethers.keccak256(
    ethers.toUtf8Bytes("alice_public_key")
  );
  const METADATA_HASH = ethers.keccak256(ethers.toUtf8Bytes("alice_metadata"));
  const PK_HASH_BOB = ethers.keccak256(ethers.toUtf8Bytes("bob_public_key"));
  const META_HASH_BOB = ethers.keccak256(
    ethers.toUtf8Bytes("bob_metadata")
  );

  beforeEach(async function () {
    [deployer, alice, bob, charlie] = await ethers.getSigners();
    const Identity = await ethers.getContractFactory("DecentraIDIdentity");
    identity = await Identity.deploy();
    await identity.waitForDeployment();
  });

  // ========== DEPLOYMENT ==========

  describe("Deployment", function () {
    it("should set deployer as admin", async function () {
      const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
      expect(await identity.hasRole(ADMIN_ROLE, deployer.address)).to.be.true;
    });

    it("should set deployer as default admin", async function () {
      const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
      expect(
        await identity.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)
      ).to.be.true;
    });
  });

  // ========== DID CREATION ==========

  describe("DID Creation", function () {
    it("should create a DID successfully", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      const doc = await identity.resolveDID(alice.address);

      expect(doc.controller).to.equal(alice.address);
      expect(doc.publicKeyHash).to.equal(PUBLIC_KEY_HASH);
      expect(doc.metadataHash).to.equal(METADATA_HASH);
      expect(doc.status).to.equal(0); // Active
      expect(doc.created).to.be.gt(0);
      expect(doc.updated).to.equal(doc.created);
    });

    it("should emit DIDCreated event", async function () {
      const tx = await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(identity, "DIDCreated")
        .withArgs(alice.address, PUBLIC_KEY_HASH, block.timestamp);
    });

    it("should reject duplicate DID creation", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      await expect(
        identity.connect(alice).createDID(PUBLIC_KEY_HASH, METADATA_HASH)
      ).to.be.revertedWith("DID already exists");
    });

    it("should reject zero public key hash", async function () {
      await expect(
        identity
          .connect(alice)
          .createDID(ethers.ZeroHash, METADATA_HASH)
      ).to.be.revertedWith("Invalid public key hash");
    });

    it("should allow different addresses to create DIDs", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity
        .connect(bob)
        .createDID(PK_HASH_BOB, META_HASH_BOB);

      const aliceDoc = await identity.resolveDID(alice.address);
      const bobDoc = await identity.resolveDID(bob.address);

      expect(aliceDoc.controller).to.equal(alice.address);
      expect(bobDoc.controller).to.equal(bob.address);
    });

    it("should grant default verification methods", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      const authMethod = ethers.keccak256(ethers.toUtf8Bytes("Authentication"));
      const assertMethod = ethers.keccak256(ethers.toUtf8Bytes("Assertion"));

      expect(
        await identity.hasVerificationMethod(alice.address, authMethod)
      ).to.be.true;
      expect(
        await identity.hasVerificationMethod(alice.address, assertMethod)
      ).to.be.true;
    });
  });

  // ========== DID RESOLUTION ==========

  describe("DID Resolution", function () {
    it("should resolve existing active DID", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      const doc = await identity.resolveDID(alice.address);

      expect(doc.controller).to.equal(alice.address);
    });

    it("should reject resolution of non-existent DID", async function () {
      await expect(identity.resolveDID(alice.address)).to.be.revertedWith(
        "DID not found"
      );
    });

    it("should reject resolution of suspended DID", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.suspendDID(alice.address);

      await expect(identity.resolveDID(alice.address)).to.be.revertedWith(
        "DID not active"
      );
    });

    it("should reject resolution of deactivated DID", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.connect(alice).deactivateDID();

      await expect(identity.resolveDID(alice.address)).to.be.revertedWith(
        "DID not active"
      );
    });
  });

  // ========== DID UPDATE ==========

  describe("DID Update", function () {
    it("should update DID metadata", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      const newMetadata = ethers.keccak256(
        ethers.toUtf8Bytes("new_metadata")
      );
      await identity.connect(alice).updateDID(newMetadata);

      const doc = await identity.resolveDID(alice.address);
      expect(doc.metadataHash).to.equal(newMetadata);
      expect(doc.updated).to.be.gt(doc.created);
    });

    it("should emit DIDUpdated event", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      const newMetadata = ethers.keccak256(
        ethers.toUtf8Bytes("new_metadata")
      );
      const tx = await identity.connect(alice).updateDID(newMetadata);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(identity, "DIDUpdated")
        .withArgs(alice.address, newMetadata, block.timestamp);
    });

    it("should reject update by non-controller", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      await expect(
        identity.connect(bob).updateDID(METADATA_HASH)
      ).to.be.revertedWith("Not DID controller");
    });

    it("should reject update of suspended DID", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.suspendDID(alice.address);

      await expect(
        identity.connect(alice).updateDID(METADATA_HASH)
      ).to.be.revertedWith("DID not active");
    });
  });

  // ========== DID SUSPENSION ==========

  describe("DID Suspension", function () {
    it("should suspend DID by admin", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.suspendDID(alice.address);

      await expect(identity.resolveDID(alice.address)).to.be.revertedWith(
        "DID not active"
      );
    });

    it("should emit DIDSuspended event", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      const tx = await identity.suspendDID(alice.address);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(identity, "DIDSuspended")
        .withArgs(alice.address, block.timestamp);
    });

    it("should reject suspension of non-existent DID", async function () {
      await expect(identity.suspendDID(alice.address)).to.be.revertedWith(
        "DID not found"
      );
    });

    it("should reject suspension by non-admin", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      await expect(
        identity.connect(alice).suspendDID(alice.address)
      ).to.be.reverted;
    });
  });

  // ========== DID REACTIVATION ==========

  describe("DID Reactivation", function () {
    it("should reactivate suspended DID", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.suspendDID(alice.address);
      await identity.reactivateDID(alice.address);

      const doc = await identity.resolveDID(alice.address);
      expect(doc.status).to.equal(0); // Active
    });

    it("should emit DIDReactivated event", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.suspendDID(alice.address);

      const tx = await identity.reactivateDID(alice.address);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(identity, "DIDReactivated")
        .withArgs(alice.address, block.timestamp);
    });

    it("should reject reactivation of active DID", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      await expect(identity.reactivateDID(alice.address)).to.be.revertedWith(
        "DID not suspended"
      );
    });
  });

  // ========== DID DEACTIVATION ==========

  describe("DID Deactivation", function () {
    it("should deactivate DID by controller", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.connect(alice).deactivateDID();

      await expect(identity.resolveDID(alice.address)).to.be.revertedWith(
        "DID not active"
      );
    });

    it("should emit DIDDeactivated event", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      const tx = await identity.connect(alice).deactivateDID();
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(identity, "DIDDeactivated")
        .withArgs(alice.address, block.timestamp);
    });

    it("should reject deactivation by non-controller", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      await expect(
        identity.connect(bob).deactivateDID()
      ).to.be.revertedWith("Not DID controller");
    });

    it("should reject double deactivation", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.connect(alice).deactivateDID();

      await expect(
        identity.connect(alice).deactivateDID()
      ).to.be.revertedWith("Already deactivated");
    });
  });

  // ========== VIEW FUNCTIONS ==========

  describe("View Functions", function () {
    it("should correctly report active status", async function () {
      expect(await identity.isDIDActive(alice.address)).to.be.false;

      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      expect(await identity.isDIDActive(alice.address)).to.be.true;
    });

    it("should return false for suspended DID", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);
      await identity.suspendDID(alice.address);

      expect(await identity.isDIDActive(alice.address)).to.be.false;
    });

    it("should check verification method", async function () {
      await identity
        .connect(alice)
        .createDID(PUBLIC_KEY_HASH, METADATA_HASH);

      const method = ethers.keccak256(ethers.toUtf8Bytes("Authentication"));
      expect(
        await identity.hasVerificationMethod(alice.address, method)
      ).to.be.true;

      const unknownMethod = ethers.keccak256(
        ethers.toUtf8Bytes("UnknownMethod")
      );
      expect(
        await identity.hasVerificationMethod(alice.address, unknownMethod)
      ).to.be.false;
    });
  });
});
