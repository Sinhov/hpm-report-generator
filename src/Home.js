import React from 'react';
import Card from "@material-ui/core/Card/Card";
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid/Grid";
import Container from "@material-ui/core/Container/Container";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DataFrame  from 'dataframe-js';
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 345,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    container: {
        marginTop: 200
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
    toolbar: theme.mixins.toolbar
}));

export default function Home(args) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        const dfResults = args.dfServices.outerJoin(args.dfReservations, "Reservation ID");
        // console.log(dfResults.toCSV());
    };

    const servicesUpload = (selectorFiles) => {
        getAsTextServices(selectorFiles[0]);
    };

    const reservationsUpload = (selectorFiles) => {
        getAsTextReservations(selectorFiles[0]);
    };

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
        args.setDfServices(new DataFrame(tempList, labels));
        // console.log(dfServices.show());
    };

    const fileReadingFinishedServices = (event) => {
        var csv = event.target.result;
        processDataServices(csv);
    };

    const getAsTextReservations = (fileToRead) => {
        var reader = new FileReader();
        // Read file into memory as UTF-8
        reader.readAsText(fileToRead);
        // Handle errors load
        reader.onload = fileReadingFinishedReservations;
        reader.onerror = errorHandler;
    };

    const processDataReservations = (csv) => {
        var allTextLines = csv.split(/\r\n|\n/);
        var labels = allTextLines[0].split(",");
        labels[0] = "Reservation ID";
        let tempList = [];
        for (let i = 1; i < allTextLines.length; i++) {
            let tempJson = {};
            for (let j = 0; j <labels.length; j++){
                tempJson[labels[j]] = allTextLines[i].split(",")[j];
            }
            tempList.push(tempJson);
        }
        args.setDfReservations(new DataFrame(tempList, labels));
        // console.log(dfReservations.show());
    };

    const fileReadingFinishedReservations = (event) => {
        var csv = event.target.result;
        processDataReservations(csv);
    };

    const  errorHandler = (event) => {
        if (event.target.error.name === "NotReadableError") {
            alert("Cannot read file!");
        }
    };



  return (
    <div>
        <div className={classes.toolbar} />
        <main className={classes.content}>
            <Container maxWidth="md" className={classes.container}>
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <Card className={classes.card}>
                    <CardActionArea onClick={handleClickOpen}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Data Ingestion
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                >
                    <DialogTitle>{"Provide input files"}</DialogTitle>
                    <DialogContent>
                        <div>
                        <Typography variant="body1" style={{display: 'inline-block'}}>
                            Select Services By Date
                        </Typography>
                        <input
                            className={classes.input}
                            id="services-upload"
                            type="file"
                            onChange={ (e) => servicesUpload(e.target.files) }
                        />
                        <label htmlFor="services-upload">
                            <Button variant="contained" color="primary" component="span" className={classes.button}>
                                Upload
                            </Button>
                        </label>
                        </div>
                        <br/>
                        <div>
                            <Typography variant="body1" style={{display: 'inline-block'}}>
                                Select Reservations By Date
                            </Typography>
                            <input
                                className={classes.input}
                                id="reservations-upload"
                                type="file"
                                onChange={(e) => reservationsUpload(e.target.files)}
                            />
                            <label htmlFor="reservations-upload">
                                <Button variant="contained" color="primary" component="span" className={classes.button}>
                                    Upload
                                </Button>
                            </label>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
            <Grid item xs={6}>
                <Link to={"/views"} className={classes.typography}>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Results
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                </Link>
            </Grid>
        </Grid>
            </Container>
        </main>
    </div>
  );
}
