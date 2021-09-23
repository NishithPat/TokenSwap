const Token = artifacts.require("./Token.sol");
const Exchange = artifacts.require("./Exchange.sol");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  await deployer.deploy(Token, 1_000_000, "DareToken", "DARE", { from: accounts[0] });
  const tokenInstance = await Token.deployed();

  await deployer.deploy(Exchange, tokenInstance.address);
  const exchangeInstance = await Exchange.deployed();

  await tokenInstance.approve(exchangeInstance.address, "100000000000000000000000", { from: accounts[0] });
  await exchangeInstance.addLiquidity("100000", { from: accounts[0], value: web3.utils.toWei("10", "ether") });
};
