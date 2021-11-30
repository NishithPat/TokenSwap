import getWeb3 from "./getWeb3";
import Token from "./contracts/Token";
import Exchange from "./contracts/Exchange.json";
import React, { useEffect, useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import "./App.css";
import Navbar from "./components/Navbar";
import Tabsbar from "./components/Tabsbar";
import EthToToken from "./components/EthToToken";
import TokenToEth from "./components/TokenToEth";
import { Link } from "@material-ui/core";
import SimpleBackdrop from "./components/SimpleBackdrop";

let theme = createTheme({
  typography: {
    fontFamily: [
      'Ubuntu Condensed',
      'sans-serif'
    ].join(','),
  }
})

theme = responsiveFontSizes(theme);

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [exchangeContract, setExchangeContract] = useState([]);
  const [TokenContract, setTokenContract] = useState([]);

  const [loading, setLoading] = useState(false);
  const [ethExchange, setEthExchange] = useState(true);

  const [getTokenValue, getTokenValueSetter] = useState(0); //ethToDareToken
  const [getEthValue, getEthValueSetter] = useState(0); //DareTokenToEth

  useEffect(() => {
    const loadDapp = async () => {
      try {
        const web3Instance = await getWeb3();
        const accountsInstance = await web3Instance.eth.getAccounts();

        const networkId = await web3Instance.eth.net.getId();
        const deployedExchangeNetwork = Exchange.networks[networkId];
        const deployedTokenNetwork = Token.networks[networkId];

        //console.log(Exchange.abi);
        console.log("exchange address", deployedExchangeNetwork.address);
        console.log("token address", deployedTokenNetwork.address);

        const exchangeInstance = new web3Instance.eth.Contract(
          Exchange.abi,
          deployedExchangeNetwork && deployedExchangeNetwork.address,
        );

        const tokenInstance = new web3Instance.eth.Contract(
          Token.abi,
          deployedTokenNetwork && deployedTokenNetwork.address,
        );

        console.log(accountsInstance);

        setWeb3(web3Instance);
        setAccounts(accountsInstance);
        setExchangeContract(exchangeInstance);
        setTokenContract(tokenInstance);

        await listenMMAccount(web3Instance);
        await chainchange(web3Instance);

      } catch (error) {
        console.log(error);
      }
    }

    loadDapp();
  }, [])

  async function listenMMAccount(web3Obj) {
    window.ethereum.on("accountsChanged", async () => {
      // Time to reload your interface with accounts[0]!
      const accountsInstance = await web3Obj.eth.getAccounts();
      // accounts = await web3.eth.getAccounts();
      console.log(accountsInstance);
      setAccounts(accountsInstance);
    });
  }

  async function chainchange(web3Obj) {
    window.ethereum.on("chainChanged", async () => {
      const networkId = await web3Obj.eth.net.getId();
      const deployedExchangeNetwork = Exchange.networks[networkId];
      const deployedTokenNetwork = Token.networks[networkId];

      console.log("exchange address", deployedExchangeNetwork.address);
      console.log("token address", deployedTokenNetwork.address);

      const exchangeInstance = new web3Obj.eth.Contract(
        Exchange.abi,
        deployedExchangeNetwork && deployedExchangeNetwork.address,
      );

      const tokenInstance = new web3Obj.eth.Contract(
        Token.abi,
        deployedTokenNetwork && deployedTokenNetwork.address,
      );

      setExchangeContract(exchangeInstance);
      setTokenContract(tokenInstance);
    })
  }
  //for ethToDareToken exchange
  const giveEthValue = async (ethValue) => {
    const ethReserve = await exchangeContract.methods.getEtherReserve().call({ from: accounts[0] });
    const tokenReserve = await exchangeContract.methods.getTokenReserve().call({ from: accounts[0] });
    const tokenAmount = await exchangeContract.methods.getTokenAmount(web3.utils.toWei(ethValue, "ether"), ethReserve.toString(), tokenReserve.toString()).call({ from: accounts[0] });
    getTokenValueSetter(tokenAmount.toString());
  }

  const exchangeEthValueToDare = async (etherValue) => {
    setLoading(true);
    try {
      await exchangeContract.methods.changeEtherToToken().send({ from: accounts[0], value: web3.utils.toWei(etherValue, "ether") });
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  }

  //for DareTokenToEth exchange
  const giveTokenValue = async (tokenValue) => {
    const tokenReserve = await exchangeContract.methods.getTokenReserve().call({ from: accounts[0] });
    const ethReserve = await exchangeContract.methods.getEtherReserve().call({ from: accounts[0] });
    const ethAmount = await exchangeContract.methods.getEtherAmount(web3.utils.toWei(tokenValue), tokenReserve.toString(), ethReserve.toString()).call({ from: accounts[0] });
    getEthValueSetter(ethAmount.toString());
  }

  const approveToken = async (tokenValue) => {
    setLoading(true);
    try {
      await TokenContract.methods.approve(exchangeContract._address, web3.utils.toWei(tokenValue)).send({ from: accounts[0] });
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  }

  const transferToken = async (tokenValue) => {
    setLoading(true);
    try {
      await exchangeContract.methods.changeTokenToEther(tokenValue).send({ from: accounts[0] });
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  }

  if (!web3) {
    return (
      <>
        <CssBaseline />
        <ThemeProvider theme={theme} />
        <Container maxWidth="md">
          <Box mt="1.5rem">
            <Typography variant="h5" align="center">Loading Web3, accounts, and contract...</Typography>
          </Box>
          <Box mt="1.5rem">
            <Typography variant="h5" align="center">Please use the rinkeby testnet. If you are using another network, then please switch over to rinkeby and refresh the page!</Typography>
          </Box>
          <Box mt="2rem" component="span">
            <Typography variant="h6" align="center">If you do not have an etherum wallet, you can install it from here: </Typography>
          </Box>
          <Box mt="2rem" component="span">
            <Typography variant="h6" align="center" color="secondary"><Link href="https://metamask.io/">MetaMask</Link></Typography>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Navbar accounts={accounts} />
        {loading && <SimpleBackdrop />}
        <Container maxWidth="md">
          <Box mt="1.25rem">
            <Typography variant="h2" align="center" color="primary">Swap tokens!</Typography>
          </Box>
          <Box mt="1.25rem">
            <Typography variant="h6" align="center" color="textSecondary">Exchange contract address: {exchangeContract._address}</Typography>
          </Box>
          <Box mb="1.25rem">
            <Typography variant="h6" align="center" color="textSecondary">DareToken contract address: {TokenContract._address}</Typography>
          </Box>
          <Tabsbar ethExchange={ethExchange} setEthExchange={setEthExchange} />
          {ethExchange && <Box m="1.5rem">
            <EthToToken getTokenValue={getTokenValue} giveEthValue={giveEthValue} web3={web3} exchangeEthValueToDare={exchangeEthValueToDare} />
          </Box>}
          {!ethExchange && <Box m="1.5rem">
            <TokenToEth getEthValue={getEthValue} giveTokenValue={giveTokenValue} web3={web3} approveToken={approveToken} transferToken={transferToken} />
          </Box>}
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App;
