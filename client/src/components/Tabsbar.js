import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const Tabsbar = props => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { ethExchange, setEthExchange } = props;

    const handleChange = (event, newValue) => {
        console.log(newValue);
        setValue(newValue);
        if (newValue === 0) {
            setEthExchange(true);
        } else {
            setEthExchange(false);
        }
    };

    return (
        <Paper className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="ETH ---> DARE" />
                <Tab label="DARE ---> ETH" />
            </Tabs>
        </Paper>
    );
};

export default Tabsbar;