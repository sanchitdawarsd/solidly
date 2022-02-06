import { config as dotEnvConfig } from "dotenv";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-solhint";
import '@openzeppelin/hardhat-upgrades';
import "@typechain/hardhat";
import "hardhat-docgen";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "hardhat-tracer";
import "hardhat-etherscan-abi";
import "solidity-coverage"

dotEnvConfig();

const defaultNetwork = "localhost"; // "hardhat" for tests
const API = process.env.NODE_API;
const PRIVATE_KEY = process.env.PRIVATEKEY;
const PRIVATE_KEY2 = process.env.PRIVATEKEY2;
const PRIVATE_KEY3 = process.env.PRIVATEKEY3;

export default {
  defaultNetwork,
  networks: {
    localhost: {
      url: "http://localhost:8545", // uses account 0 of the hardhat node to deploy
    },
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/zrGuVBntYhj9Y5wY_xRfExYtS3CwISv3",
      accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`],
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
      accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`],
    },
    ftmtestnet: {
      url: `https://rpc.testnet.fantom.network/`,
      accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`],
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`],
      timeout: 99999,
      chainId: 137,
      gas: 19_000_000,
      gasPrice: 100_000_000_000,
      gasMultiplier: 1.3,
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
            runs: 9999,
          },
        },
      }
    ],
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v5",
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
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 9999999999
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
    except: ['contracts/third_party', 'contracts/test']
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  gasReporter: {
    enabled: false,
    currency: 'USD',
    gasPrice: 21
  },
  tenderly: {
    project: "",
    username: "sanchit",
  }

};



