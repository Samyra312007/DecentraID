const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentraIDAssets", function () {
  let identity, assets, deployer, alice, bob, charlie;
  const PK_HASH = ethers.keccak256(ethers.toUtf8Bytes("key"));
  const META_HASH = ethers.keccak256(ethers.toUtf8Bytes("meta"));
  const ASSET_TYPE = ethers.keccak256(ethers.toUtf8Bytes("certificate"));
  const ISSUER_DID = ethers.keccak256(ethers.toUtf8Bytes("issuer_did"));
  const IPFS_HASH = ethers.keccak256(ethers.toUtf8Bytes("QmTestHash123"));
  const DOC_HASH = ethers.keccak256(ethers.toUtf8Bytes("document_hash"));
  const TOKEN_URI = "ipfs://QmTestMetadata";
  const JURISDICTION = "India";

  beforeEach(async function () {
    [deployer, alice, bob, charlie] = await ethers.getSigners();

    // Deploy Identity (needed for AccessControl reference in full system)
    const Identity = await ethers.getContractFactory("DecentraIDIdentity");
    identity = await Identity.deploy();
    await identity.waitForDeployment();

    // Deploy Assets
    const Assets = await ethers.getContractFactory("DecentraIDAssets");
    assets = await Assets.deploy();
    await assets.waitForDeployment();

    // Grant ISSUER_ROLE to deployer
    const ISSUER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ISSUER_ROLE"));
    await assets.grantRole(ISSUER_ROLE, deployer.address);
  });

  // ========== DEPLOYMENT ==========

  describe("Deployment", function () {
    it("should set deployer as admin", async function () {
      const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
      expect(await assets.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)).to.be
        .true;
    });

    it("should have correct name and symbol", async function () {
      expect(await assets.name()).to.equal("DecentraID Asset");
      expect(await assets.symbol()).to.equal("DIDNFT");
    });

    it("should start with zero total supply", async function () {
      expect(await assets.totalSupply()).to.equal(0);
    });
  });

  // ========== MINTING ==========

  describe("Minting", function () {
    it("should mint an asset successfully", async function () {
      const tx = await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0, // no expiry
        TOKEN_URI,
        JURISDICTION
      );
      const receipt = await tx.wait();

      expect(await assets.totalSupply()).to.equal(1);
      expect(await assets.ownerOf(0)).to.equal(alice.address);

      const metadata = await assets.getAsset(0);
      expect(metadata.assetType).to.equal(ASSET_TYPE);
      expect(metadata.issuerDID).to.equal(ISSUER_DID);
      expect(metadata.status).to.equal(0); // Active
      expect(metadata.jurisdiction).to.equal(JURISDICTION);
    });

    it("should emit AssetMinted event", async function () {
      await expect(
        assets.mintAsset(
          alice.address,
          ASSET_TYPE,
          ISSUER_DID,
          IPFS_HASH,
          DOC_HASH,
          0,
          TOKEN_URI,
          JURISDICTION
        )
      ).to.emit(assets, "AssetMinted");
    });

    it("should set correct token URI", async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );

      expect(await assets.tokenURI(0)).to.equal(TOKEN_URI);
    });

    it("should track issuer assets", async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );

      const issuerTokens = await assets.getIssuerAssets(ISSUER_DID);
      expect(issuerTokens.length).to.equal(1);
      expect(issuerTokens[0]).to.equal(0);
    });

    it("should track owner assets", async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );

      const aliceDID = ethers.zeroPadValue(alice.address, 32);
      const ownerTokens = await assets.getOwnerAssets(aliceDID);
      expect(ownerTokens.length).to.equal(1);
      expect(ownerTokens[0]).to.equal(0);
    });

    it("should reject minting to zero address", async function () {
      await expect(
        assets.mintAsset(
          ethers.ZeroAddress,
          ASSET_TYPE,
          ISSUER_DID,
          IPFS_HASH,
          DOC_HASH,
          0,
          TOKEN_URI,
          JURISDICTION
        )
      ).to.be.revertedWith("Invalid recipient");
    });

    it("should reject minting with zero IPFS hash", async function () {
      await expect(
        assets.mintAsset(
          alice.address,
          ASSET_TYPE,
          ISSUER_DID,
          ethers.ZeroHash,
          DOC_HASH,
          0,
          TOKEN_URI,
          JURISDICTION
        )
      ).to.be.revertedWith("Invalid IPFS hash");
    });

    it("should reject minting by non-issuer", async function () {
      await expect(
        assets
          .connect(alice)
          .mintAsset(
            bob.address,
            ASSET_TYPE,
            ISSUER_DID,
            IPFS_HASH,
            DOC_HASH,
            0,
            TOKEN_URI,
            JURISDICTION
          )
      ).to.be.reverted;
    });

    it("should increment token IDs", async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );
      await assets.mintAsset(
        bob.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );

      expect(await assets.totalSupply()).to.equal(2);
      expect(await assets.ownerOf(0)).to.equal(alice.address);
      expect(await assets.ownerOf(1)).to.equal(bob.address);
    });

    it("should mint with expiry", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 86400;
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        futureTime,
        TOKEN_URI,
        JURISDICTION
      );

      const metadata = await assets.getAsset(0);
      expect(metadata.expiresAt).to.equal(futureTime);
    });
  });

  // ========== VERIFICATION ==========

  describe("Verification", function () {
    it("should verify a valid asset", async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );

      const [valid, metadata] = await assets.verifyAsset(0);
      expect(valid).to.be.true;
      expect(metadata.status).to.equal(0); // Active
    });

    it("should report invalid for non-existent token", async function () {
      // In OZ v5, ownerOf reverts with custom error for non-existent tokens
      // So verifyAsset will also revert
      await expect(assets.verifyAsset(999)).to.be.reverted;
    });

    it("should report invalid for revoked asset", async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );
      await assets.revokeAsset(0, "Revoked for testing");

      const [valid] = await assets.verifyAsset(0);
      expect(valid).to.be.false;
    });
  });

  // ========== TRANSFER ==========

  describe("Transfer", function () {
    beforeEach(async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );
    });

    it("should transfer asset successfully", async function () {
      await assets.connect(alice).transferAsset(0, bob.address);

      expect(await assets.ownerOf(0)).to.equal(bob.address);

      const metadata = await assets.getAsset(0);
      const bobDID = ethers.zeroPadValue(bob.address, 32);
      expect(metadata.ownerDID).to.equal(bobDID);
      expect(metadata.status).to.equal(2); // Transferred
    });

    it("should emit AssetTransferred event", async function () {
      await expect(assets.connect(alice).transferAsset(0, bob.address)).to.emit(
        assets,
        "AssetTransferred"
      );
    });

    it("should reject transfer by non-owner", async function () {
      await expect(
        assets.connect(bob).transferAsset(0, charlie.address)
      ).to.be.reverted;
    });

    it("should reject transfer of inactive asset", async function () {
      await assets.revokeAsset(0, "Revoked");

      await expect(
        assets.connect(alice).transferAsset(0, bob.address)
      ).to.be.revertedWith("Asset not active");
    });
  });

  // ========== REVOCATION ==========

  describe("Revocation", function () {
    beforeEach(async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );
    });

    it("should revoke an asset", async function () {
      await assets.revokeAsset(0, "Document expired");

      const metadata = await assets.getAsset(0);
      expect(metadata.status).to.equal(1); // Revoked
    });

    it("should emit AssetRevoked event", async function () {
      await expect(assets.revokeAsset(0, "Document expired")).to.emit(
        assets,
        "AssetRevoked"
      );
    });

    it("should reject revocation of non-existent token", async function () {
      // OZ v5 reverts with custom error for non-existent tokens
      await expect(assets.revokeAsset(999, "Does not exist")).to.be.reverted;
    });

    it("should reject revocation of already revoked asset", async function () {
      await assets.revokeAsset(0, "First revocation");

      await expect(assets.revokeAsset(0, "Second revocation")).to.be.revertedWith(
        "Asset not active"
      );
    });

    it("should reject revocation by non-admin", async function () {
      await expect(
        assets.connect(alice).revokeAsset(0, "Unauthorized")
      ).to.be.reverted;
    });
  });

  // ========== VIEW FUNCTIONS ==========

  describe("View Functions", function () {
    it("should return empty arrays for address with no assets", async function () {
      const issuerTokens = await assets.getIssuerAssets(
        ethers.keccak256(ethers.toUtf8Bytes("no_issuer"))
      );
      expect(issuerTokens.length).to.equal(0);

      const ownerTokens = await assets.getOwnerAssets(
        ethers.keccak256(ethers.toUtf8Bytes("no_owner"))
      );
      expect(ownerTokens.length).to.equal(0);
    });

    it("should reject getAsset for non-existent token", async function () {
      // OZ v5 reverts with custom error for non-existent tokens
      await expect(assets.getAsset(999)).to.be.reverted;
    });

    it("should support required interfaces", async function () {
      // ERC721
      expect(await assets.supportsInterface("0x80ac58cd")).to.be.true;
      // ERC721Enumerable
      expect(await assets.supportsInterface("0x780e9d63")).to.be.true;
      // ERC721URIStorage
      expect(await assets.supportsInterface("0x5b5e139f")).to.be.true;
      // AccessControl
      expect(await assets.supportsInterface("0x7965db0b")).to.be.true;
    });
  });

  // ========== ENUMERABLE ==========

  describe("Enumerable", function () {
    it("should track total supply correctly", async function () {
      expect(await assets.totalSupply()).to.equal(0);

      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );
      expect(await assets.totalSupply()).to.equal(1);

      await assets.mintAsset(
        bob.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );
      expect(await assets.totalSupply()).to.equal(2);
    });

    it("should enumerate tokens by owner", async function () {
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );
      await assets.mintAsset(
        alice.address,
        ASSET_TYPE,
        ISSUER_DID,
        IPFS_HASH,
        DOC_HASH,
        0,
        TOKEN_URI,
        JURISDICTION
      );

      expect(await assets.tokenOfOwnerByIndex(alice.address, 0)).to.equal(0);
      expect(await assets.tokenOfOwnerByIndex(alice.address, 1)).to.equal(1);
    });
  });
});
