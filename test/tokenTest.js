const Token = artifacts.require("./Token.sol");

contract("Token", accounts => {
    it("should check that name of the token is DareToken", async () => {
        const tokenInstance = await Token.deployed();
        const name = await tokenInstance.name();
        console.log(name);
        assert.equal(name, "DareToken");
    });

    it("should check that symbol of the token is DARE", async () => {
        const tokenInstance = await Token.deployed();
        const symbol = await tokenInstance.symbol();
        console.log(symbol);
        assert.equal(symbol, "DARE");
    });

    it("should check that the inital supply of the token is 1_000_000", async () => {
        const tokenInstance = await Token.deployed();
        const totalSupply = await tokenInstance.totalSupply();
        console.log(typeof totalSupply);
        console.log(totalSupply.toString());
        assert.equal(totalSupply.toString(), "1000000000000000000000000");
    })
});