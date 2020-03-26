require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = 'joke mango rug thing blouse catch filter educate champion also abstract broom'



module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/014d15901aa348c4ae68f91e032474a5");
      },
      network_id: '3',
      from: '0x57D08a4bf6E3865be2B3b27d4f63b79eD76d1Fb3'
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
