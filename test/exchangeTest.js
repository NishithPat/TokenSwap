const Token = artifacts.require("./Token.sol");
const Exchange = artifacts.require("./Exchange.sol");
const BN = web3.utils.BN;

contract("exchange", accounts => {
    describe("token details", () => {
        let tokenInstance, exchangeInstance;

        beforeEach(async () => {
            tokenInstance = await Token.deployed();
            exchangeInstance = await Exchange.deployed();
        })

        it("matches the token address", async () => {
            const tokenAddress = await exchangeInstance.getTokenAddress();
            console.log(tokenAddress);

            assert.equal(tokenAddress, tokenInstance.address);
        })

        it("checks the totalSupply of the token", async () => {
            const tokenTotalSupply = await exchangeInstance.getTotalSupplyOfToken();
            console.log(tokenTotalSupply.toString());

            assert.equal(tokenTotalSupply.toString(), web3.utils.toWei("1000000"));
        })
    })

    describe("adds initial liquidity", () => {
        let tokenInstance, exchangeInstance;

        beforeEach(async () => {
            tokenInstance = await Token.deployed();
            exchangeInstance = await Exchange.deployed();
        })

        it("adds 100000 tokens", async () => {
            const tokenBalanceInExchange = await exchangeInstance.getTokenReserve();
            assert.equal(tokenBalanceInExchange.toString(), web3.utils.toWei("100000"));
        })

        it("adds 10 ether", async () => {
            const ethBalanceInExchange = await exchangeInstance.getEtherReserve();
            assert.equal(ethBalanceInExchange.toString(), web3.utils.toWei("10"));
        })

        it("ratio of tokens to eth is 10000:1", async () => {
            const tokenBalanceInExchange = await exchangeInstance.getTokenReserve();
            const ethBalanceInExchange = await exchangeInstance.getEtherReserve();
            console.log(tokenBalanceInExchange / ethBalanceInExchange);
            assert.equal(tokenBalanceInExchange / ethBalanceInExchange, "10000");
        })

        it("checks that after adding liquidity the allowance of the exchangeInstance is 0", async () => {
            const updatedTokenAllowanceOFExchange = await tokenInstance.allowance(accounts[0], exchangeInstance.address);
            console.log(updatedTokenAllowanceOFExchange.toString());

            assert.equal(updatedTokenAllowanceOFExchange.toString(), 0)
        })
    })

    describe("checks getTokenAmount and getEtherAmount functions", () => {
        let tokenInstance, exchangeInstance, tokenBalanceInExchange, ethBalanceInExchange;

        beforeEach(async () => {
            tokenInstance = await Token.deployed();
            exchangeInstance = await Exchange.deployed();

            tokenBalanceInExchange = await exchangeInstance.getTokenReserve();
            ethBalanceInExchange = await exchangeInstance.getEtherReserve();
        })

        it("checks getTokenAmount", async () => {
            //for 1 ether
            let actualTokenAmount = await exchangeInstance.getTokenAmount(web3.utils.toWei("1", "ether"), ethBalanceInExchange, tokenBalanceInExchange);
            console.log(actualTokenAmount.toString());

            let numerator = new BN(10).pow(new BN(18)).mul(new BN(100000)).mul(new BN(10).pow(new BN(18)));
            console.log(numerator.toString());
            let denominator = new BN(10).pow(new BN(18)).mul(new BN(10)).add(new BN(10).pow(new BN(18)));
            console.log(denominator.toString());

            let expectedTokenAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedTokenAmount.toString());

            assert.equal(actualTokenAmount.toString(), expectedTokenAmount.toString());
            assert.equal(actualTokenAmount.toString(), 9.090909090909091e21);

            console.log("**************************************************************");
            //for 5 ether
            actualTokenAmount = await exchangeInstance.getTokenAmount(web3.utils.toWei("5", "ether"), ethBalanceInExchange, tokenBalanceInExchange);
            console.log(actualTokenAmount.toString());

            numerator = new BN(5).mul(new BN(10).pow(new BN(18))).mul(new BN(100000)).mul(new BN(10).pow(new BN(18)));
            console.log(numerator.toString());
            denominator = new BN(10).pow(new BN(18)).mul(new BN(10)).add(new BN(5).mul(new BN(10).pow(new BN(18))));
            console.log(denominator.toString());

            expectedTokenAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedTokenAmount.toString());

            console.log("**************************************************************");
            //for 10 ether
            actualTokenAmount = await exchangeInstance.getTokenAmount(web3.utils.toWei("10", "ether"), ethBalanceInExchange, tokenBalanceInExchange);
            console.log(actualTokenAmount.toString());

            numerator = new BN(10).mul(new BN(10).pow(new BN(18))).mul(new BN(100000)).mul(new BN(10).pow(new BN(18)));
            console.log(numerator.toString());
            denominator = new BN(10).pow(new BN(18)).mul(new BN(10)).add(new BN(10).mul(new BN(10).pow(new BN(18))));
            console.log(denominator.toString());

            expectedTokenAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedTokenAmount.toString());
            //whats interesting is that reserves are never empty as xy = k, is a hyperbola
        })

        it("checks getEtherAmount", async () => {
            //for 10000 tokens
            let actualEthAmount = await exchangeInstance.getEtherAmount(web3.utils.toWei("10000"), tokenBalanceInExchange, ethBalanceInExchange);
            console.log(actualEthAmount.toString());

            let numerator = new BN(10000).mul(new BN(10).pow(new BN(18))).mul(new BN(10).mul(new BN(10).pow(new BN(18)))); //_inputTokenAmount * EthReserve
            console.log(numerator.toString());
            let denominator = new BN(100000).mul(new BN(10).pow(new BN(18))).add(new BN(10000).mul(new BN(10).pow(new BN(18))));
            console.log(denominator.toString());

            let expectedEthAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedEthAmount.toString());
            console.log(web3.utils.fromWei(expectedEthAmount.toString(), "ether"));

            assert.equal(actualEthAmount.toString(), expectedEthAmount.toString());
            assert.equal(web3.utils.fromWei(actualEthAmount.toString(), "ether"), web3.utils.fromWei(expectedEthAmount.toString(), "ether"));

            console.log("***********************************************************");
            //for 50000 tokens
            actualEthAmount = await exchangeInstance.getEtherAmount(web3.utils.toWei("50000"), tokenBalanceInExchange, ethBalanceInExchange);
            console.log(actualEthAmount.toString());

            numerator = new BN(50000).mul(new BN(10).pow(new BN(18))).mul(new BN(10).mul(new BN(10).pow(new BN(18)))); //_inputTokenAmount * EthReserve
            console.log(numerator.toString());
            denominator = new BN(100000).mul(new BN(10).pow(new BN(18))).add(new BN(50000).mul(new BN(10).pow(new BN(18))));
            console.log(denominator.toString());

            expectedEthAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedEthAmount.toString());
            console.log(web3.utils.fromWei(expectedEthAmount.toString(), "ether"));

            assert.equal(actualEthAmount.toString(), expectedEthAmount.toString());
            assert.equal(web3.utils.fromWei(actualEthAmount.toString(), "ether"), web3.utils.fromWei(expectedEthAmount.toString(), "ether"));

            console.log("***********************************************************");
            //for 100000 tokens
            actualEthAmount = await exchangeInstance.getEtherAmount(web3.utils.toWei("100000"), tokenBalanceInExchange, ethBalanceInExchange);
            console.log(actualEthAmount.toString());

            numerator = new BN(100000).mul(new BN(10).pow(new BN(18))).mul(new BN(10).mul(new BN(10).pow(new BN(18)))); //_inputTokenAmount * EthReserve
            console.log(numerator.toString());
            denominator = new BN(100000).mul(new BN(10).pow(new BN(18))).add(new BN(100000).mul(new BN(10).pow(new BN(18))));
            console.log(denominator.toString());

            expectedEthAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedEthAmount.toString());
            console.log(web3.utils.fromWei(expectedEthAmount.toString(), "ether"));

            assert.equal(actualEthAmount.toString(), expectedEthAmount.toString());
            assert.equal(web3.utils.fromWei(actualEthAmount.toString(), "ether"), web3.utils.fromWei(expectedEthAmount.toString(), "ether"));

            console.log("************************************************************");
            //for 5000 tokens
            actualEthAmount = await exchangeInstance.getEtherAmount(web3.utils.toWei("5000"), tokenBalanceInExchange, ethBalanceInExchange);
            console.log(actualEthAmount.toString());

            numerator = new BN(5000).mul(new BN(10).pow(new BN(18))).mul(new BN(10).mul(new BN(10).pow(new BN(18)))); //_inputTokenAmount * EthReserve
            console.log(numerator.toString());
            denominator = new BN(100000).mul(new BN(10).pow(new BN(18))).add(new BN(5000).mul(new BN(10).pow(new BN(18))));
            console.log(denominator.toString());

            expectedEthAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedEthAmount.toString());
            console.log(web3.utils.fromWei(expectedEthAmount.toString(), "ether"));

            assert.equal(actualEthAmount.toString(), expectedEthAmount.toString());
            assert.equal(web3.utils.fromWei(actualEthAmount.toString(), "ether"), web3.utils.fromWei(expectedEthAmount.toString(), "ether"));
            //5000 tokens with different reserves
            // actualEthAmount = await exchangeInstance.getEtherAmount(web3.utils.toWei("5000"), "90909090909090909090910", "11000000000000000000");
            // console.log(actualEthAmount.toString());

        })
    })

    describe("checks swap functions", () => {
        let tokenInstance, exchangeInstance;

        beforeEach(async () => {
            tokenInstance = await Token.deployed();
            exchangeInstance = await Exchange.deployed();
        })

        it("changes ether to token", async () => {
            const ethBeforeSwapInExchange = await exchangeInstance.getEtherReserve();
            await exchangeInstance.changeEtherToToken({ value: web3.utils.toWei("1", "ether"), from: accounts[1] });
            const tokensWithAccount1 = await tokenInstance.balanceOf(accounts[1]);
            console.log(tokensWithAccount1.toString());
            const ethAfterSwapInExchange = await exchangeInstance.getEtherReserve();

            let numerator = new BN(10).pow(new BN(18)).mul(new BN(100000)).mul(new BN(10).pow(new BN(18)));
            console.log(numerator.toString());
            let denominator = new BN(10).pow(new BN(18)).mul(new BN(10)).add(new BN(10).pow(new BN(18)));
            console.log(denominator.toString());

            let expectedTokenAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedTokenAmount.toString());

            assert.equal(tokensWithAccount1.toString(), expectedTokenAmount.toString());
            assert.equal((new BN(ethAfterSwapInExchange).sub(new BN(ethBeforeSwapInExchange))).toString(), web3.utils.toWei("1", "ether"));
        })

        it("changes tokens to ether", async () => {
            let tokensWithAccount1 = await tokenInstance.balanceOf(accounts[1]);
            console.log("original amount of tokens with accounts[1]", tokensWithAccount1.toString());
            let tokensWithExchangeBefore = await tokenInstance.balanceOf(exchangeInstance.address);
            console.log(`tokens with exchange before ${tokensWithExchangeBefore.toString()}`);
            let ethWithExchangeBefore = await exchangeInstance.getEtherReserve();
            console.log(`ether with exchange before ${ethWithExchangeBefore.toString()}`);

            await tokenInstance.approve(exchangeInstance.address, web3.utils.toWei("5000"), { from: accounts[1] });

            await exchangeInstance.changeTokenToEther(5000, { from: accounts[1] });
            let tokensWithExchangeAfter = await tokenInstance.balanceOf(exchangeInstance.address);
            console.log(`tokens with exchange after ${tokensWithExchangeAfter.toString()}`);

            const differenceOfTokens = new BN(tokensWithExchangeAfter).sub(new BN(tokensWithExchangeBefore));

            assert.equal(web3.utils.fromWei(differenceOfTokens.toString()), 5000);

            let ethWithExchangeAfter = await exchangeInstance.getEtherReserve();
            console.log(`ether with exchange after ${ethWithExchangeAfter.toString()}`);

            // let numerator = new BN(5000).mul(new BN(10).pow(new BN(18))).mul(new BN(11).mul(new BN(10).pow(new BN(18)))); //_inputTokenAmount * EthReserve
            // console.log(numerator.toString());
            // let denominator = new BN(90909.09090909091).mul(new BN(10).pow(new BN(18))).add(new BN(5000).mul(new BN(10).pow(new BN(18))));
            // console.log(denominator.toString());

            let numerator = new BN(5000).mul(new BN(10).pow(new BN(18))).mul(new BN(new BN(ethWithExchangeBefore).div(new BN(10).pow(new BN(18)))).mul(new BN(10).pow(new BN(18)))); //_inputTokenAmount * EthReserve
            console.log(numerator.toString());
            let denominator = new BN(new BN(tokensWithExchangeBefore).div(new BN(10).pow(new BN(18)))).mul(new BN(10).pow(new BN(18))).add(new BN(5000).mul(new BN(10).pow(new BN(18))));
            console.log(denominator.toString());

            let expectedEthAmount = new BN(numerator).div(new BN(denominator));
            console.log(expectedEthAmount.toString());

            const differenceOfEth = new BN(ethWithExchangeBefore).sub(new BN(ethWithExchangeAfter));
            console.log(differenceOfEth.toString());

            const difference = new BN(expectedEthAmount).sub(new BN(differenceOfEth));
            const differenceInDecimals = new BN(difference).div(new BN(10).pow(new BN(18)));

            console.log(difference.toString());
            console.log(differenceInDecimals.toString());
            assert.equal(differenceInDecimals.toString(), "0");
        })
    })

    describe("adds liquidity later", () => {
        let tokenInstance, exchangeInstance;

        beforeEach(async () => {
            tokenInstance = await Token.deployed();
            exchangeInstance = await Exchange.deployed();
        })

        it("adds liquidity after initially it was added", async () => {
            let ethInExchangeBeforeAddingMoreLiquidity = await exchangeInstance.getEtherReserve();
            console.log(`eth in exchange before adding more liquidity: ${ethInExchangeBeforeAddingMoreLiquidity}`);
            let tokenInExchangeBeforeAddingMoreLiquidity = await exchangeInstance.getTokenReserve();
            console.log(`token in exchange before adding more liquidity: ${tokenInExchangeBeforeAddingMoreLiquidity}`);

            await tokenInstance.approve(exchangeInstance.address, web3.utils.toWei("100000"), { from: accounts[0] });
            await exchangeInstance.addLiquidity("100000", { value: web3.utils.toWei("8"), from: accounts[0] }); //adding 8 ethers

            let ethInExchangeAfterAddingMoreLiquidity = await exchangeInstance.getEtherReserve();
            console.log(`eth in exchange after adding more liquidity: ${ethInExchangeAfterAddingMoreLiquidity}`);
            let tokeInExchangeAfterAddingMoreLiquidity = await exchangeInstance.getTokenReserve();
            console.log(`token in exchange after adding more liquidity: ${tokeInExchangeAfterAddingMoreLiquidity}`);

            let ethDifference = new BN(ethInExchangeAfterAddingMoreLiquidity).sub(new BN(ethInExchangeBeforeAddingMoreLiquidity));
            assert.equal(ethDifference.toString(), web3.utils.toWei("8", "ether"));

            //uint tokenAmountToAdd = msg.value * tokenReserve / ethReserveBefore;
            let tokenAmountToAdd = new BN(8).mul(new BN(10).pow(new BN(18))).mul(new BN(tokenInExchangeBeforeAddingMoreLiquidity)).div(new BN(ethInExchangeBeforeAddingMoreLiquidity));
            let tokenDifference = new BN(tokeInExchangeAfterAddingMoreLiquidity).sub(new BN(tokenInExchangeBeforeAddingMoreLiquidity));
            console.log(tokenAmountToAdd.toString(), tokenDifference.toString());
            assert.equal(tokenAmountToAdd.toString(), tokenDifference.toString());
        })
    })

})