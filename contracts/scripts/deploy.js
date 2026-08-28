const hre = require("hardhat");

async function main() {
  const contractName = process.env.CONTRACT_NAME || "DecentraIDIdentity";

  console.log(`Deploying ${contractName}...\n`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(
    "Balance:",
    hre.ethers.formatEther(balance),
    "POL\n"
  );

  let deployArgs = [];

  if (contractName === "DecentraIDAccessControl") {
    // AccessControl needs the Identity contract address
    const identityAddress = process.env.IDENTITY_CONTRACT_ADDRESS;
    if (!identityAddress) {
      throw new Error(
        "IDENTITY_CONTRACT_ADDRESS env var required for AccessControl"
      );
    }
    deployArgs = [identityAddress];
  }

  const ContractFactory = await hre.ethers.getContractFactory(contractName);
  const contract = await ContractFactory.deploy(...deployArgs);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`${contractName} deployed to:`, address);

  // Save deployment info
  const fs = require("fs");
  const path = require("path");

  const deploymentDir = path.join(__dirname, "..", "deployments", "amoy");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const artifact = await hre.artifacts.readArtifact(contractName);
  fs.writeFileSync(
    path.join(deploymentDir, `${contractName}.json`),
    JSON.stringify({ address, abi: artifact.abi }, null, 2)
  );

  console.log(`\nDeployment saved to deployments/amoy/${contractName}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
