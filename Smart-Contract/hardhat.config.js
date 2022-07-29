require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.15",
  // paths:{
  //   artifacts: "./src/artifacts"
  // },
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/af98e00ee19e4af9a7b8c6edff85f7cd", //Infura url with projectId
      accounts: ["7c8a72c1844ea09d44a54695cd6bcac327aa80651c3bed34488f0d672e6b10fe"], // add the account that will deploy the contract (private key)
    },
  },
};


//Deployed to: 0x2527ac1408C866735F655A3A857E27874516C723
// Deploying contracts with the account: 0xd42E30f8E8baCD00744ce6100c74050B697bE03c

// 0x916082b7fe020dfac5d61663734094144a229ec5