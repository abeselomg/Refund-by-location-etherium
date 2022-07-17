require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.15",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/e9445f523f0940059e14a148a598ef3d", //Infura url with projectId
      accounts: ["7c8a72c1844ea09d44a54695cd6bcac327aa80651c3bed34488f0d672e6b10fe"], // add the account that will deploy the contract (private key)
    },
  },
};
