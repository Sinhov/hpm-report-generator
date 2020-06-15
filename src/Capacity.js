import React from 'react';
import {
    ViewState, EditingState, GroupingState, IntegratedGrouping, IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Resources,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    GroupingPanel,
    WeekView,
    MonthView,
    Toolbar,
    ViewSwitcher,
    DateNavigator,
    TodayButton, ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
    lightBlue, green, orange,
} from '@material-ui/core/colors';

export default function Capacity(args) {
    const services = args.dfServices.toDict();
    let appointments = [], boardAndTrain = {}, boarding = {}, carTrips = {};

    for (let i = 0; i < services["Start Date"].length && services["Start Date"][i] !== undefined; i++){
        let date = new Date(services["Start Date"][i].substring(1, services["Start Date"][i].length-1));
        let dateStr = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear();
        if (services["Reservation Type"][i] === "\"Board & Train | 10 Day Program\"" ||
            services["Reservation Type"][i] === "\"Board & Train | 28+ Day Program\""){
            if (boardAndTrain.hasOwnProperty(dateStr)){
                boardAndTrain[dateStr] = boardAndTrain[dateStr] + 1;
            } else {
                boardAndTrain[dateStr] = 1;
            }
        } else if (services["Reservation Type"][i] === "\"Boarding | Luxury Boarding\""){
            if (boarding.hasOwnProperty(dateStr)){
                boarding[dateStr] = boarding[dateStr] + 1;
            } else {
                boarding[dateStr] = 1;
            }
        } else if (services["Reservation Type"][i] === "\"Car Service | Pick Up\"" ||
            services["Reservation Type"][i] === "\"Car Service | Drop Off\""){
            if (carTrips.hasOwnProperty(dateStr)){
                carTrips[dateStr] = carTrips[dateStr] + 1;
            } else {
                carTrips[dateStr] = 1;
            }
        }
    }

    let i = 0;
    Object.keys(boardAndTrain).forEach(function(key) {
        let tempJSON = {
            id: i,
            members: 1,
            title: "Board & Train: " + boardAndTrain[key],
            startDate: new Date(key),
        };
        tempJSON.endDate = new Date(tempJSON.startDate.getTime() + 86400000 - 1);
        appointments.push(tempJSON);
        i++;
    });
    Object.keys(boarding).forEach(function(key) {
        let tempJSON = {
            id: i,
            members: 2,
            title: "Boarding: " + boarding[key],
            startDate: new Date(key),
        };
        tempJSON.endDate = new Date(tempJSON.startDate.getTime() + 86400000 - 1);
        appointments.push(tempJSON);
        i++;
    });
    Object.keys(carTrips).forEach(function(key) {
        let tempJSON = {
            id: i,
            members: 3,
            title: "Car Trips: " + carTrips[key],
            startDate: new Date(key),
        };
        tempJSON.endDate = new Date(tempJSON.startDate.getTime() + 86400000 - 1);
        appointments.push(tempJSON);
        i++;
    });
    console.log(appointments);

    const owners = [{
        text: 'Board & Train',
        id: 1,
        color: lightBlue,
    }, {
        text: 'Boarding',
        id: 2,
        color: green,
    }, {
        text: 'Car Service',
        id: 3,
        color: orange,
    }];
    const resources = [{
        fieldName: 'members',
        title: 'Members',
        instances: owners,
        allowMultiple: false,
    }];
    const grouping = [ {
        resourceName: 'members',
    }];

    const [data, setData] = React.useState(appointments);
    const [currentDate, setCurrentDate] = React.useState(new Date());

    const commitChanges = ({ added, changed, deleted }) => {
        let tempData = data;
        if (added) {
            const startingAddedId = tempData.length > 0 ? tempData[tempData.length - 1].id + 1 : 0;
            tempData = [...tempData, { id: startingAddedId, ...added }];
        }
        if (changed) {
            tempData = tempData.map(appointment => (
                changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
        }
        if (deleted !== undefined) {
            tempData = tempData.filter(appointment => appointment.id !== deleted);
        }
        setData(tempData);
        return tempData;
    };

    return (
        <div>
            <Scheduler
                data={data}
                height={1400}
            >
                <ViewState
                    currentDate={currentDate}
                    onCurrentDateChange={setCurrentDate}
                />
                <EditingState
                    onCommitChanges={commitChanges}
                />
                <GroupingState
                    grouping={grouping}
                    groupByDate={() => true}
                />

                <MonthView />
                <WeekView
                    startDayHour={9}
                    endDayHour={21.5}
                />


                <Appointments />
                <Resources
                    data={resources}
                    mainResourceName="members"
                />
                <IntegratedGrouping />
                <IntegratedEditing />

                <AppointmentTooltip />
                <AppointmentForm />

                <Toolbar />
                <DateNavigator/>
                <TodayButton />
                <ViewSwitcher />
                <GroupingPanel />
                <ConfirmationDialog/>
            </Scheduler>
        </div>
    );
}

