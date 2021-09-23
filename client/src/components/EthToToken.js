import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import SimpleBackdrop from './SimpleBackdrop';
import CustomizedDialogsForEthToDareTokenExchange from './CustomizedDialogsForEthToDareTokenExchange';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 40,
    },
    pos: {
        marginBottom: 12,
    },
    inputStyle: {
        width: "50%",
    },
    outputStyle: {
        width: "25%"
    }
});

export default function EthToToken(props) {
    const classes = useStyles();
    const [ethValue, setEthValue] = useState(0);
    const [tokenValue, setTokenValue] = useState("DareToken");
    const { getTokenValue, giveEthValue, web3, exchangeEthValueToDare } = props;

    const handleEthChange = (event) => {
        setTokenValue("DareToken");
        setEthValue(event.target.value);
        if (event.target.value != "" && event.target.value >= 0) {
            giveEthValue(event.target.value);
        }
    }

    const showData = () => {
        if (ethValue == 0) {
            setTokenValue(0);
        } else {
            setTokenValue(web3.utils.fromWei(getTokenValue, "ether"));
        }
    }

    const formSubmission = (event) => {
        event.preventDefault();
        //console.log(event);
        if (ethValue >= 0) {
            exchangeEthValueToDare(ethValue);
        } else {
            console.log("negative values cannot be exchanged");
        }

        setTokenValue(0);
        setEthValue(0);
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h3" color="primary" gutterBottom>
                    Ether to DareToken
                </Typography>
                <Typography variant="h4">
                    <form onSubmit={formSubmission}>
                        <Box mb="1.5rem">
                            <Typography variant="h6" align="left" gutterBottom>Enter Ethers</Typography>
                            <TextField id="ethInput"
                                type="number"
                                label="ETH"
                                variant="outlined"
                                size="medium"
                                className={classes.inputStyle}
                                inputProps={{ style: { fontSize: "1.5rem" }, min: 0, step: 0.001 }}
                                InputLabelProps={{ style: { fontSize: "1.25rem" } }}
                                onChange={handleEthChange}
                                value={ethValue}
                            />
                        </Box>
                        <Box>
                            <Typography variant="h6">
                                <Box component="span" mr="2rem">
                                    <Button color="primary" variant="outlined" onClick={showData}>DareTokens exchangeable for Ether in input</Button>
                                </Box>
                                <TextField value={tokenValue} className={classes.outputStyle} color="primary"></TextField>
                            </Typography>
                        </Box>
                        {/*<Box mt="2.5rem">
                            <SimpleBackdrop/>
                        </Box>*/}
                        <Box mt="2.5rem">
                            <Button color="secondary" variant="contained" size="large" type="submit">swap ETH to DARE</Button>
                        </Box>
                    </form>
                </Typography>
            </CardContent>
            <CardActions>
                <CustomizedDialogsForEthToDareTokenExchange />
            </CardActions>
        </Card>
    );
}
