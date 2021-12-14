# TokenSwap based on Uniswap

The project has been made using the React truffle box and Material UI. 

Note the contracts have been deployed on the Rinkeby test network. So, to use the React app, please switch
over to the Rinkeby test network on your Metamask wallet.

You can find it here - https://swapperrr.netlify.app/

## How it works?

Exchange smart contract uses the constant product function, xy = k(constant) to facilitate the exchange of an ERC20 token with Ether. 

Assume that there are 2 tokens A and B in an exchange contract. Let x be the number of A tokens and y be the number of B tokens in the contract. A user wants to swap dx number of A tokens, to get dy number of B tokens back. This swapping of tokens would happen in such a way that even after the trade takes place the product of the amount of both the tokens would still be the same constant - k.

So, (x + dx)(y - dy) = k

=> xy - xdy + ydx - dxdy = xy (as xy = k)

=> dy(dx + x) = ydx

=> dy = y(dx/(dx + x))

dy = y(dx/(dx + x)) is the formula which is being used here to facilitate the swaps.

## Getting Started

### Deploying Contracts

Before proceeding, ensure that you have truffle installed. You can install it using the following command

```bash
npm install -g truffle
```

After cloning the repo, the following changes need to be made -

Rename ```.secretExample``` as ```.secret``` and replace ```insert your Mnemonic phrase``` with the Mnemonic phrase of your MetaMask account

Rename ```.envExample``` as ```.env``` and replace ```YOUR_INFURA_KEY``` with your Infura key for the Rinkeby Test network.

Then install the neccessary dependencies. To do this, start a new terminal in the repo. Inside the terminal, type the following commands -

```bash
cd TokenSwap
```

```bash
npm install
```

Next compile the solidity files -

```bash
truffle compile
```

You can now deploy the files locally using Ganache -

```bash
truffle migrate
```
You can download Ganache from [here](http://trufflesuite.com/ganache/)

You can also test the files using the command -

```bash
truffle test
```

To deploy the contracts on Rinkeby -

```bash
truffle migrate --network rinkeby
```

### Frontend 

Go to the client folder -

```bash
cd client
```

Install packages - 

```bash
npm install
```

To start the React App -

```bash
npm start
```