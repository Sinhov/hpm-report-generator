import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

function createData(date, dogName, ownerName, reservation, address, city, state, ownerPhone, driver) {
    return { date, dogName, ownerName, reservation, address, city, state, ownerPhone, driver };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'date', numeric: false, disablePadding: true, label: 'Date' },
    { id: 'dogName', numeric: false, disablePadding: false, label: 'Dog Name' },
    { id: 'ownerName', numeric: false, disablePadding: false, label: 'Owner Name' },
    { id: 'reservation', numeric: false, disablePadding: false, label: 'Type of Reservation' },
    { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
    { id: 'city', numeric: false, disablePadding: false, label: 'City' },
    { id: 'state', numeric: true, disablePadding: false, label: 'State' },
    { id: 'ownerPhone', numeric: true, disablePadding: false, label: 'Owner Phone' },
    { id: 'driver', numeric: true, disablePadding: false, label: 'Driver' }
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = () => {
    const classes = useToolbarStyles();

    return (
        <Toolbar className={classes.root}>
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                Details
            </Typography>
        </Toolbar>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2)
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    date: {
        marginLeft: 20,
    }
}));

const strip = (str) => {
    if (str === undefined){
        return "-";
    }
    return str.substring(1, str.length-1);
};

export default function DayDetail(args) {
    const [selectedDate, handleDateChange] = React.useState(new Date());
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        const services = args.dfServices.toDict();
        let tempRows = [];
        for (let i = 0; services["Owner First Name"] !== undefined && i < services["Owner First Name"].length; i++){
            if (services["Scheduled At"][i] !== "") {
                let scheduledAt = new Date(strip(services["Scheduled At"][i]));
                let schDate = new Date(scheduledAt.getMonth() + 1 + "/" + scheduledAt.getDate() + "/" + scheduledAt.getFullYear()).getTime();
                let selDate = new Date(selectedDate.getMonth() + 1 + "/" + selectedDate.getDate() + "/" + selectedDate.getFullYear()).getTime();
                if (schDate === selDate) {
                    tempRows.push(createData(strip(services["Scheduled At"][i]), services["Animal Name"][i], services["Owner" +
                        " First Name"][i]
                        + " " + services["Owner Last Name"][i], strip(services["Reservation Type"][i]), strip(services["Address 1"][i]),
                        services["it"][i], services["tat"][i], strip(services["Cell Phone"][i]), strip(services["Service Assigned To"][i])));
                }
            }
        }
        setRows(tempRows);
    }, [selectedDate, args.dfServices]);

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Typography variant={"body1"} style={{display: 'inline-block', marginTop:5}}>
                Enter Date:
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    value={selectedDate}
                    onChange={date => handleDateChange(date)}
                    format="yyyy/MM/dd"
                    className={classes.date}
                />
            </MuiPickersUtilsProvider>
            <br/>
            <br/>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={index}
                                        >
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {row.date}
                                            </TableCell>
                                            <TableCell align="right">{row.dogName}</TableCell>
                                            <TableCell align="right">{row.ownerName}</TableCell>
                                            <TableCell align="right">{row.reservation}</TableCell>
                                            <TableCell align="right">{row.address}</TableCell>
                                            <TableCell align="right">{row.city}</TableCell>
                                            <TableCell align="right">{row.state}</TableCell>
                                            <TableCell align="right">{row.ownerPhone}</TableCell>
                                            <TableCell align="right">{row.driver}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </div>
    );
}

