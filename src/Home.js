import React from 'react';
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container/Container";
import DataFrame  from 'dataframe-js';
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        backgroundImage: "url(http://www.happypupmanor.com/wp-content/uploads/2019/11/Home-Slider-1.jpg)",
        backgroundSize: "cover"
    },
    card: {
        maxWidth: 345,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    container: {
        marginTop: 200,
        textAlign: "center",
    },
    input: {
        display: 'none',
    },
    button: {
      marginLeft: 20
    },
    typography: {
        textDecoration: "none",
    },
    date: {
      marginLeft: 20,
      width: 200
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
    },
    toolbar: theme.mixins.toolbar
}));

export default function Home(args) {
    const classes = useStyles();
    const [safe, setSafe] = React.useState(false);

    const servicesUpload = (selectorFiles) => {
        if (selectorFiles[0].name.endsWith(".csv")) {
            getAsTextServices(selectorFiles[0]);
        } else {
            setMsg("File could not be uploaded or wrong file uploaded, please try again and select the csv file.");
            setOpen(true);
            setSafe(false);
        }
    };

    // const reservationsUpload = (selectorFiles) => {
    //     getAsTextReservations(selectorFiles[0]);
    // };

    const getAsTextServices = (fileToRead) => {
        var reader = new FileReader();
        // Read file into memory as UTF-8
        reader.readAsText(fileToRead);
        // Handle errors load
        reader.onload = fileReadingFinishedServices;
        reader.onerror = errorHandler;
    };

    const processDataServices = (csv) => {
        var allTextLines = csv.split(/\r\n|\n/);
        var labels = allTextLines[0].split(",");
        for (let i = 0; i < labels.length; i++) {
            let str = labels[i].substring(1,labels[i].length-1);
            labels[i] = str;
        }
        let tempList = [];
        for (let i = 1; i < allTextLines.length; i++) {
            let tempJson = {};
            for (let j = 0; j <labels.length; j++){
                tempJson[labels[j]] = allTextLines[i].split(",")[j];
            }
            tempList.push(tempJson);
        }
        if(tempList.length !== 0){
            setOpen(true);
            setSafe(true);
            setMsg("File uploaded successfully");
        } else {
            setSafe(false);
            setOpen(true);
            setMsg("File could not be uploaded, please try again.");
        }
        args.setDfServices(new DataFrame(tempList, labels));
        // console.log(dfServices.show());
    };

    const fileReadingFinishedServices = (event) => {
        var csv = event.target.result;
        processDataServices(csv);
    };

    // const getAsTextReservations = (fileToRead) => {
    //     var reader = new FileReader();
    //     // Read file into memory as UTF-8
    //     reader.readAsText(fileToRead);
    //     // Handle errors load
    //     reader.onload = fileReadingFinishedReservations;
    //     reader.onerror = errorHandler;
    // };

    // const processDataReservations = (csv) => {
    //     var allTextLines = csv.split(/\r\n|\n/);
    //     var labels = allTextLines[0].split(",");
    //     labels[0] = "Reservation ID";
    //     let tempList = [];
    //     for (let i = 1; i < allTextLines.length; i++) {
    //         let tempJson = {};
    //         for (let j = 0; j <labels.length; j++){
    //             tempJson[labels[j]] = allTextLines[i].split(",")[j];
    //         }
    //         tempList.push(tempJson);
    //     }
    //     args.setDfReservations(new DataFrame(tempList, labels));
    //     // console.log(dfReservations.show());
    // };

    // const fileReadingFinishedReservations = (event) => {
    //     var csv = event.target.result;
    //     processDataReservations(csv);
    // };

    const  errorHandler = (event) => {
        if (event.target.error.name === "NotReadableError") {
            alert("Cannot read file!");
        }
    };

    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState("");

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

  return (
    <div className={classes.root}>
        <div className={classes.toolbar} />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
        }}>
            <Alert onClose={handleClose} severity={safe ? "success" : "error"} >
                {msg}
            </Alert>
        </Snackbar>
        <main className={classes.content}>
            <Container maxWidth="xs" className={classes.container}>
                <Paper className={classes.paper}>
                    <Typography variant="h5" style={{display: 'inline-block'}}>
                        Provide Input Files
                    </Typography>
                    <div style={{paddingTop: 30}}>
                        <Typography variant="body1" style={{display: 'inline-block'}}>
                            Select Services By Date CSV File
                        </Typography>
                        <input
                            className={classes.input}
                            id="services-upload"
                            type="file"
                            onChange={ (e) => servicesUpload(e.target.files) }
                        />
                        <label htmlFor="services-upload">
                            <Button variant="outlined" color="primary" component="span" className={classes.button}>
                                Upload
                            </Button>
                        </label>
                    </div>
                    <br/>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Icon>send</Icon>}
                        component={Link}
                        to={"/views"}
                        disabled={!safe}
                    >
                        Submit
                    </Button>
                    {/*<div>*/}
                    {/*    <Typography variant="body1" style={{display: 'inline-block'}}>*/}
                    {/*        Select Reservations By Date*/}
                    {/*    </Typography>*/}
                    {/*    <input*/}
                    {/*        className={classes.input}*/}
                    {/*        id="reservations-upload"*/}
                    {/*        type="file"*/}
                    {/*        onChange={(e) => reservationsUpload(e.target.files)}*/}
                    {/*    />*/}
                    {/*    <label htmlFor="reservations-upload">*/}
                    {/*        <Button variant="contained" color="primary" component="span" className={classes.button}>*/}
                    {/*            Upload*/}
                    {/*        </Button>*/}
                    {/*    </label>*/}
                    {/*</div>*/}
                </Paper>
            </Container>
        </main>
    </div>
  );
}
