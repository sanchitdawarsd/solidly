require("dotenv").config();
const { utils, ethers } = require("ethers");
const fs = require("fs");
const chalk = require("chalk");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

const defaultNetwork = "localhost"; // "hardhat" for tests
const API = process.env.NODE_API;
const PRIVATE_KEY = process.env.PRIVATEKEY;
const PRIVATE_KEY2 = process.env.PRIVATEKEY2;
const PRIVATE_KEY3 = process.env.PRIVATEKEY3;

module.exports = {
  defaultNetwork,
  networks: {
    localhost: {
      url: "http://localhost:8545", // uses account 0 of the hardhat node to deploy
    },
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/zrGuVBntYhj9Y5wY_xRfExYtS3CwISv3",
      accounts: [`0x${PRIVATE_KEY}`,`0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`],
    },
    rinkeby: {
      url: API,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    kovan: {
      url: API,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    goerli: {
      url: "https://goerli.infura.io/v3/19de54b594234ffb978a4e81f18a9827",
      accounts: [`0x${PRIVATE_KEY}`,`0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`],
    },
    ftmtestnet: {
      url: `https://rpc.testnet.fantom.network/`,
      accounts: [`0x${PRIVATE_KEY}`,`0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/5pRr0lzXltpqOfMV92aaHImC69sKCcub`,
      accounts: [`0x${PRIVATE_KEY}`,`0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`],
      // gas: 19000000,
      // gasPrice: 100000000000,
    },
    bsctestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    bscmainnet: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

task("accounts", "Prints the list of accounts", async () => {
  if (defaultNetwork === "localhost") {
    const provider = new ethers.providers.JsonRpcProvider(
      "http://127.0.0.1:8545/"
    );
    const accounts = await provider.listAccounts();
    for (let i = 0; i < accounts.length; i++) {
      const accountBalance = await provider.getBalance(accounts[i]);
      console.log(
        "📄",
        chalk.cyan(accounts[i]),
        "💸",
        chalk.magenta(utils.formatEther(accountBalance), "ETH")
      );
    }
    console.log("\n");
  } else {
    console.log(
      " ⚠️  This task only runs on JsonRpcProvider running a node at " +
        chalk.magenta("localhost:8545") +
        "\n"
    );
  }
});