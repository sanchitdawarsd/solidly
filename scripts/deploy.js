// to deploy locally
// run: npx hardhat node on a terminal
// then run: npx hardhat run --network localhost scripts/12_deploy_all.js
var hre,{ ethers } = require("hardhat");

async function main(network) {
  const { WMATICTESTNET } = require("../addresses_common");

  console.log("network: ", network.name);

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log(`Deployer's address: `, deployerAddress);

  //Stable coins DEPLOYMENT
  const Token = await ethers.getContractFactory("Token");

  const ust = await Token.deploy("ust", "ust", 6, deployerAddress);
  await ust.mint(deployerAddress, ethers.BigNumber.from("1000000000000000000"));
  const mim = await Token.deploy("MIM", "MIM", 18, deployerAddress);
  await mim.mint(
    deployerAddress,
    ethers.BigNumber.from("1000000000000000000000000000000")
  );
  const dai = await Token.deploy("DAI", "DAI", 18, deployerAddress);
  await dai.mint(
    deployerAddress,
    ethers.BigNumber.from("1000000000000000000000000000000")
  );

  await ust.deployed();
  await mim.deployed();
  await dai.deployed();

  console.log(
    "TOKENS ADDRESSES: UST,MIM,DAI respectivly:",
    ust.address,
    mim.address,
    dai.address
  );

  ////////////

  //underlying token
  const token = await Token.deploy("VE", "VE", 18, deployerAddress);
  await token.deployed();
  console.log("Underlying Token deployed at", token.address);

  ////////////

  const Ve = await ethers.getContractFactory("contracts/ve.sol:ve");
  const ve = await Ve.deploy(token.address);
  await ve.deployed();
  console.log("ve deployed at", ve.address);

  ///////////

  const BaseV1Factory = await ethers.getContractFactory("BaseV1Factory");
  const baseV1Factory = await BaseV1Factory.deploy();
  await baseV1Factory.deployed();
  console.log("baseV1Factory deployed at", baseV1Factory.address);

  ///////////

  const BaseV1Router = await ethers.getContractFactory("BaseV1Router01");
  const baseV1Router = await BaseV1Router.deploy(
    baseV1Factory.address,
    WMATICTESTNET
  );
  await baseV1Router.deployed();
  console.log("baseV1Router deployed at", baseV1Router.address);

  //DEPLOYING PAIRS

  const ust_1 = ethers.BigNumber.from("1000000");
  const mim_1 = ethers.BigNumber.from("1000000000000000000");
  const dai_1 = ethers.BigNumber.from("1000000000000000000");
  await mim.approve(baseV1Router.address, mim_1);
  await ust.approve(baseV1Router.address, ust_1);
  await baseV1Router.addLiquidity(
    mim.address,
    ust.address,
    true,
    mim_1,
    ust_1,
    0,
    0,
    deployerAddress,
    Date.now()
  );
  await dai.approve(baseV1Router.address, dai_1);
  await ust.approve(baseV1Router.address, ust_1);
  await baseV1Router.addLiquidity(
    dai.address,
    ust.address,
    false,
    dai_1,
    ust_1,
    0,
    0,
    deployerAddress,
    Date.now()
  );
  await mim.approve(baseV1Router.address, mim_1);
  await dai.approve(baseV1Router.address, dai_1);
  await baseV1Router.addLiquidity(
    mim.address,
    dai.address,
    true,
    mim_1,
    dai_1,
    0,
    0,
    deployerAddress,
    Date.now()
  );

  const BaseV1Pair = await ethers.getContractFactory("BaseV1Pair");
  const address = await baseV1Factory.getPair(mim.address, ust.address, true);
  const pair = await BaseV1Pair.attach(address);
  const address2 = await baseV1Factory.getPair(dai.address, ust.address, false);
  const pair2 = await BaseV1Pair.attach(address2);
  const address3 = await baseV1Factory.getPair(mim.address, dai.address, true);
  const pair3 = await BaseV1Pair.attach(address3);

  console.log(
    "PAIRS addresses MIM,UST & DAI,UST & MIM,DAI",
    address,
    address2,
    address3
  );

  ///////////

  // maybe not needed to deploy
  //   const BaseV1Pair = await ethers.getContractFactory("BaseV1Pair");
  //   const baseV1Pair = await BaseV1Pair.deploy();
  //   await baseV1Pair.deployed();
  //   console.log("baseV1Pair deployed at", baseV1Pair.address);

  ///////////

  const BaseV1GaugeFactory = await ethers.getContractFactory(
    "BaseV1GaugeFactory"
  );
  const gauge_factory = await BaseV1GaugeFactory.deploy();
  await gauge_factory.deployed();

  const BaseV1Voter = await ethers.getContractFactory("BaseV1Voter");
  const baseV1Voter = await BaseV1Voter.deploy(
    ve.address,
    baseV1Factory.address,
    gauge_factory.address
  );
  await baseV1Voter.deployed();

  console.log(
    "gauge_factory ||||| baseV1Voter deployed at",
    gauge_factory.address,
    "|||||",
    baseV1Voter.address
  );

  ///////////

  const VeDist = await ethers.getContractFactory(
    "contracts/ve_dist.sol:ve_dist"
  );
  const ve_dist = await VeDist.deploy(ve.address, token.address, deployerAddress);
  await ve_dist.deployed();

  console.log("ve_dist deployed at", ve_dist.address);

  ///////////

  const BaseV1Minter = await ethers.getContractFactory("BaseV1Minter");
  const minter = await BaseV1Minter.deploy(
    baseV1Voter.address,
    ve.address,
    ve_dist.address
  );
  await minter.deployed();

  console.log("minter deployed at", minter.address);

  ///////////
  //STAKING DEPLOYMENT OF PAIR ON WHICH UNDERLYING ASSET WILL BE GIVEN AS REWARD

  //   const Staking = await ethers.getContractFactory("StakingRewards");
  //   const staking = await Staking.deploy("Insert pairAddress", token.address);
  //   await staking.deployed();

  //   console.log("staking deployed at", staking.address);

  ///////////

//   const metadata = await pair.metadata();
//   const roots = await ethers.getContractFactory("roots");
//   root = await roots.deploy(
//     metadata.dec0,
//     metadata.dec1,
//     metadata.st,
//     metadata.t0,
//     metadata.t1
//   );
//   await root.deployed();

//   console.log("root Address: ", root.address);

  ////////// VERIFY ADDRESSES

//   await hre.run("verify:verify", {
//     address: token.address,
//     constructorArguments: ["VE", "VE", 18, deployerAddress],
//   });
//   await hre.run("verify:verify", {
//     address: ve.address,
//   });
//   await hre.run("verify:verify", {
//     address: baseV1Factory.address,
//   });
//   await hre.run("verify:verify", {
//     address: baseV1Router.address,
//     constructorArguments: [baseV1Factory.address, WMATICTESTNET],
//   });
//   await hre.run("verify:verify", {
//     address: gauge_factory.address,
//   });
//   await hre.run("verify:verify", {
//     address: baseV1Router.address,
//     constructorArguments: [
//       ve.address,
//       baseV1Factory.address,
//       gauge_factory.address,
//     ],
//   });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(network)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
