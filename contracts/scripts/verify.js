const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentDir = path.join(__dirname, "..", "deployments", "amoy");
  const addressesPath = path.join(deploymentDir, "addresses.json");

  if (!fs.existsSync(addressesPath)) {
    console.error("No deployment found. Run deploy-all.js first.");
    process.exit(1);
  }

  const deployments = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  console.log("Verifying contracts on Polygonscan...\n");

  // Verify Identity Contract
  console.log("1. Verifying DecentraIDIdentity...");
  try {
    await hre.run("verify:verify", {
      address: deployments.contracts.DecentraIDIdentity,
      constructorArguments: [],
    });
    console.log("   ✅ Identity contract verified\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("   ℹ️  Already verified\n");
    } else {
      console.log("   ❌ Verification failed:", error.message, "\n");
    }
  }

  // Verify Access Control Contract
  console.log("2. Verifying DecentraIDAccessControl...");
  try {
    await hre.run("verify:verify", {
      address: deployments.contracts.DecentraIDAccessControl,
      constructorArguments: [deployments.contracts.DecentraIDIdentity],
    });
    console.log("   ✅ Access Control contract verified\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("   ℹ️  Already verified\n");
    } else {
      console.log("   ❌ Verification failed:", error.message, "\n");
    }
  }

  // Verify Asset Contract
  console.log("3. Verifying DecentraIDAssets...");
  try {
    await hre.run("verify:verify", {
      address: deployments.contracts.DecentraIDAssets,
      constructorArguments: [],
    });
    console.log("   ✅ Asset contract verified\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("   ℹ️  Already verified\n");
    } else {
      console.log("   ❌ Verification failed:", error.message, "\n");
    }
  }

  console.log("=== Verification Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
