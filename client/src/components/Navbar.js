import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    title: {
        flexGrow: 1,
        textAlign: "right"
    },
}));

export default function Navbar(props) {
    const matches1 = useMediaQuery('(min-width:750px)');
    const classes = useStyles();

    const { accounts } = props;
    return (
        <div className={classes.root}>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" >
                        Swapper (ETH&lt;---&gt;DARE)
                    </Typography>
                    {matches1 && <Typography variant="h6" className={classes.title}>
                        user account: {accounts[0]}
                    </Typography>}

                </Toolbar>
            </AppBar>
        </div>
    );
}
