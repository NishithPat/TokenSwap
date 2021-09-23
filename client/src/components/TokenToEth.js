import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import HorizontalLabelPositionBelowStepper from './HorizontalLabelPositionBelowStepper';
import CustomizedDialogsForDareTokenToEthExchnage from './CustomizedDialogsForDareTokenToEthExchnage';

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
    }
});

export default function TokenToEth(props) {
    const classes = useStyles();
    const [tokenValue, setTokenValue] = useState(0);
    const [ethValue, setEthValue] = useState("Ether");
    const [allowInput, setAllowInput] = useState(false);
    const { getEthValue, giveTokenValue, web3, approveToken, transferToken } = props;

    const handleTokenChange = (event) => {
        setEthValue("Ether");
        setTokenValue(event.target.value);
        if (event.target.value != "" && event.target.value >= 0) {
            giveTokenValue(event.target.value);
        }
    }

    const showData = () => {
        if (tokenValue == 0) {
            setEthValue(0);
        } else {
            setEthValue(web3.utils.fromWei(getEthValue, "ether"));
        }
    }

    const approved = () => {
        console.log("approved", tokenValue);
        if (tokenValue >= 0) {
            approveToken(tokenValue);
            setAllowInput(true);
        }
    }

    const transferred = () => {
        console.log("transferred", tokenValue);
        transferToken(tokenValue);
        setEthValue(0);
        setTokenValue(0);
        setAllowInput(false);
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h3" color="primary" gutterBottom>
                    DareToken to Ether
                </Typography>
                <Typography variant="h4">
                    <Box mb="1.5rem">
                        <Typography variant="h6" align="left" gutterBottom>Enter DareTokens</Typography>
                        <TextField id="ethInput"
                            type="number"
                            label="DARE"
                            variant="outlined"
                            size="medium"
                            className={classes.inputStyle}
                            inputProps={{ style: { fontSize: "1.5rem" }, min: 0, step: 0.001 }}
                            InputLabelProps={{ style: { fontSize: "1.25rem" } }}
                            onChange={handleTokenChange}
                            value={tokenValue}
                            disabled={allowInput}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h6">
                            <Box component="span" mr="2rem">
                                <Button color="primary" variant="outlined" onClick={showData}>Ethers exchangeable for DareTokens in input</Button>
                            </Box>
                            <TextField className={classes.outputStyle} color="primary" value={ethValue}></TextField>
                        </Typography>
                    </Box>
                    <Box mt="1.5rem">
                        <HorizontalLabelPositionBelowStepper approved={approved} transferred={transferred} />
                    </Box>
                </Typography>
            </CardContent>
            <CardActions>
                <CustomizedDialogsForDareTokenToEthExchnage />
            </CardActions>
        </Card>
    );
}
