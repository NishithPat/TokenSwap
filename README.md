# TokenSwap based on Uniswap

You can find it here - https://swapperrr.netlify.app/

Exchange smart contract uses the constant product function, xy = k(constant) to facilitate the exchange of an ERC20 token with Ether. 

Assume that there are 2 tokens A and B in an exchange contract. Let x be the number of A tokens and y be the number of B tokens in the contract. A user wants to swap dx number of A tokens, to get dy number of B tokens back. This swapping of tokens would happen in such a way that even after the trade takes place the product of the amount of both the tokens would still be the same constant - k.

So, (x + dx)(y - dy) = k
=> xy - xdy + ydx - dxdy = xy (as xy = k)
=> dy(dx + x) = ydx
=> dy = y(dx/(dx + x))

dy = y(dx/(dx + x)) is the formula which is being used here to facilitate the swaps.

The project has been made using the React truffle box and Material UI. 

Note the contracts have been deployed on the Rinkeby test network. So, to use the React app, please switch
over to the Rinkeby test network on your Metamask wallet.