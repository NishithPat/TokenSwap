// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Exchange {
    address private tokenAddress;
    
    constructor (address _tokenAddress) {
        require(_tokenAddress != address(0), "address(0) cannot be used");
        tokenAddress = _tokenAddress;
    }
    
    function getTotalSupplyOfToken() public view returns(uint) {
        return IERC20(tokenAddress).totalSupply();
    }

    function getTokenAddress() public view returns(address) {
        return tokenAddress;
    }
    
    // //approveSpender //approve from outside (through ui)
    
    //addLiquidity
    function addLiquidity(uint _tokenAmount) public payable {
        //addLiquidity such that 1 ether equals 10000 tokens(in tests or UI)
        require(IERC20(tokenAddress).balanceOf(msg.sender) > 0, "The account does not have any tokens");
        if(getTokenReserve() == 0) {
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokenAmount * 10**18);
        } else {
            uint ethReserveBefore = address(this).balance - msg.value;
            uint tokenReserve = getTokenReserve();
            uint tokenAmountToAdd = msg.value * tokenReserve / ethReserveBefore;
            require(tokenAmountToAdd < _tokenAmount * 10 ** 18, "not enough tokens sent for adding liquidity");
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenAmountToAdd);
        }
        
    }
    
    //getTokenReserve
    function getTokenReserve() public view returns(uint) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
    
    //getEtherReserve
    function getEtherReserve() public view returns(uint) {
        return address(this).balance;
    }
        
    //getTokenAmount
    function getTokenAmount(uint _inputEthAmount, uint EthReserve, uint tokenReserve) public pure returns(uint) {
        uint numerator = _inputEthAmount * tokenReserve; //eth will be in wei(10**18)
        uint denominator = EthReserve + _inputEthAmount;
        require(denominator > 0, "division by zero is not allowed");
        return numerator/denominator;
    }
    
    //getEthAmount
    function getEtherAmount(uint _inputTokenAmount, uint tokenReserve, uint EthReserve) public pure returns(uint) {
        uint numerator = _inputTokenAmount * EthReserve;  //token will also be in wei(10**18)
        uint denominator = tokenReserve + _inputTokenAmount;
        require(denominator > 0, "division by zero is not allowed");
        return numerator/denominator;
    }

    //swapEtherForToken
    function changeEtherToToken() public payable {
        uint tokenReserve = getTokenReserve();
        uint amountOfTokens = getTokenAmount(msg.value, address(this).balance - msg.value, tokenReserve);
        IERC20(tokenAddress).transfer(msg.sender, amountOfTokens);
    }
    
    //swapTokenForEther
    function changeTokenToEther(uint _inputTokenAmount) public {
        uint tokenReserve = getTokenReserve();
        uint amountOfEthers = getEtherAmount(_inputTokenAmount * 10**18, tokenReserve, address(this).balance);
        
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _inputTokenAmount * 10**18);
        (bool sent, ) = payable(msg.sender).call{value: amountOfEthers}("");
        require(sent, "Failed to send Ether");
    }
    
}