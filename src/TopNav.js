import React from 'react';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Typography from "@material-ui/core/Typography/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: "#252F3D",
    },
    typography: {
        textDecoration: "none",
        color: "#FFFFFF",
    },
}));

export default function TopNav() {
    const classes = useStyles();

    return (
        <div>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h5" component={Link} to={"/"} className={classes.typography}>
                        Report Generator
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}
