const hre = require("hardhat");

async function main() {
  const FundTracker = await hre.ethers.getContractFactory("FundTracker");
  const fundTracker = await FundTracker.deploy();

  await fundTracker.waitForDeployment();

  console.log("✅ FundTracker deployed to:", fundTracker.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
