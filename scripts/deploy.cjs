const hre = require("hardhat");

async function main() {
  const lotteryName = "Lottery";
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(lotteryName);

  await lottery.deployed();

  console.log("Lottery contract deployed to:", lottery.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
