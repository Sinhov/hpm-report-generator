import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography/Typography";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import Box from "@material-ui/core/Box/Box";
import Transportation from "./Transportation";
import Internal from "./Internal";
import Capacity from "./Capacity";
import ReservationDetails from "./ReservationDetails";
import DayDetail from "./DayDetail";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";

export const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    container: {
        width: '70%',
        textAlign: "center",
    },
    toolbar: theme.mixins.toolbar
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Views(args) {
    const classes = useStyles();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Container className={classes.container}>
                <Paper className={classes.paper}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        scrollButtons="auto"
                        variant="scrollable"
                    >
                        <Tab label="Transportation Overview" {...a11yProps(0)} />
                        <Tab label="Internal Services"  {...a11yProps(1)} />
                        <Tab label="Capacity Report"  {...a11yProps(2)} />
                        <Tab label="Day Detail" {...a11yProps(3)} />
                        <Tab label="Full Reservation Detail"  {...a11yProps(4)} />
                    </Tabs>
                </Paper>
                </Container>
                <TabPanel value={value} index={0}>
                    <Transportation dfServices={args.dfServices}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Internal dfServices={args.dfServices}/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Capacity dfServices={args.dfServices}/>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <DayDetail dfServices={args.dfServices}/>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <ReservationDetails dfServices={args.dfServices}/>
                </TabPanel>
            </main>
        </div>
    );
}

