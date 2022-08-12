require('babel-register');
require('babel-polyfill');

var HDWalletProvider = require("truffle-hdwallet-provider")
var mnemonic = ""

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },

    //Connect with Infura
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/b153f1ff428b4eb0aa97e21ad290fa81")
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },
  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.5.17",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
