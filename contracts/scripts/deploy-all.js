const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying DecentraID contracts to Polygon Amoy...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(
    "Balance:",
    hre.ethers.formatEther(balance),
    "POL\n"
  );

  // ========== 1. Deploy Identity Contract ==========
  console.log("1. Deploying DecentraIDIdentity...");
  const Identity = await hre.ethers.getContractFactory("DecentraIDIdentity");
  const identity = await Identity.deploy();
  await identity.waitForDeployment();
  const identityAddress = await identity.getAddress();
  console.log("   Identity Contract:", identityAddress);

  // ========== 2. Deploy Access Control Contract ==========
  console.log("2. Deploying DecentraIDAccessControl...");
  const AccessControl = await hre.ethers.getContractFactory(
    "DecentraIDAccessControl"
  );
  const accessControl = await AccessControl.deploy(identityAddress);
  await accessControl.waitForDeployment();
  const accessAddress = await accessControl.getAddress();
  console.log("   Access Control Contract:", accessAddress);

  // ========== 3. Deploy Asset Contract ==========
  console.log("3. Deploying DecentraIDAssets...");
  const Assets = await hre.ethers.getContractFactory("DecentraIDAssets");
  const assets = await Assets.deploy();
  await assets.waitForDeployment();
  const assetsAddress = await assets.getAddress();
  console.log("   Asset Contract:", assetsAddress);

  // ========== 4. Setup Roles ==========
  console.log("\n4. Setting up roles...");
  const ISSUER_ROLE = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("ISSUER_ROLE")
  );

  await assets.grantRole(ISSUER_ROLE, deployer.address);
  console.log("   Granted ISSUER_ROLE to deployer on Asset Contract");

  // ========== 5. Save Deployment Info ==========
  const deploymentDir = path.join(__dirname, "..", "deployments", "amoy");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deployments = {
    network: "polygon-amoy",
    chainId: 80002,
    deployer: deployer.address,
    contracts: {
      DecentraIDIdentity: identityAddress,
      DecentraIDAccessControl: accessAddress,
      DecentraIDAssets: assetsAddress,
    },
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(deploymentDir, "addresses.json"),
    JSON.stringify(deployments, null, 2)
  );

  // ========== 6. Save ABIs ==========
  console.log("\n5. Saving ABIs...");

  const identityArtifact = await hre.artifacts.readArtifact(
    "DecentraIDIdentity"
  );
  const accessArtifact = await hre.artifacts.readArtifact(
    "DecentraIDAccessControl"
  );
  const assetArtifact = await hre.artifacts.readArtifact("DecentraIDAssets");

  fs.writeFileSync(
    path.join(deploymentDir, "DecentraIDIdentity.json"),
    JSON.stringify(
      { address: identityAddress, abi: identityArtifact.abi },
      null,
      2
    )
  );

  fs.writeFileSync(
    path.join(deploymentDir, "DecentraIDAccessControl.json"),
    JSON.stringify(
      { address: accessAddress, abi: accessArtifact.abi },
      null,
      2
    )
  );

  fs.writeFileSync(
    path.join(deploymentDir, "DecentraIDAssets.json"),
    JSON.stringify(
      { address: assetsAddress, abi: assetArtifact.abi },
      null,
      2
    )
  );

  console.log("   ABIs saved to deployments/amoy/");

  // ========== 7. Update .env ==========
  console.log("\n6. Updating .env with contract addresses...");

  const envPath = path.join(__dirname, "..", "..", ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");

    envContent = envContent.replace(
      /IDENTITY_CONTRACT_ADDRESS=.*/,
      `IDENTITY_CONTRACT_ADDRESS=${identityAddress}`
    );
    envContent = envContent.replace(
      /ACCESS_CONTROL_CONTRACT_ADDRESS=.*/,
      `ACCESS_CONTROL_CONTRACT_ADDRESS=${accessAddress}`
    );
    envContent = envContent.replace(
      /ASSET_CONTRACT_ADDRESS=.*/,
      `ASSET_CONTRACT_ADDRESS=${assetsAddress}`
    );

    fs.writeFileSync(envPath, envContent);
    console.log("   Updated .env with contract addresses");
  } else {
    console.log("   .env file not found, skipping update");
  }

  // ========== Summary ==========
  console.log("\n=== Deployment Complete ===");
  console.log(JSON.stringify(deployments, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
