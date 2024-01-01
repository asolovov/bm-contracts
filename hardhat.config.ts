import "@nomicfoundation/hardhat-toolbox";

module.exports = {
  solidity: "0.8.21",
  mocha: {
    timeout: 200000,
  },
  networks: {
    goerli: {
      url: process.env.PROVIDER_URL_GOERLI,
      accounts: [process.env.PRIVATE_KEY_GOERLI as string],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY_GOERLI as string,
    }
  },
};