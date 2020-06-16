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
import Paper from "@material-ui/core/Paper";

export default function Transportation(args) {
    const dfTransportation = args.dfServices.filter(row => (row.get("Service Name") === "\"B&T Program | Lesson at" +
        " HPM\"") || (row.get("Service Name") === "\"B&T Program | In-Home Lesson\"") ||
        (row.get("Service Name") === "\"Car Service | Pick Up\"") ||
        (row.get("Service Name") === "\"Car Service | Drop Off\""));

    const transportation = dfTransportation.toDict();
    let appointments = [];
    for (let i = 0; transportation["Service Assigned To"] !== undefined && i < transportation["Service Assigned To"].length; i++){
        let str = transportation["Service Assigned To"][i];
        let tempJSON = {
            id: i,
            title: transportation["Service Name"][i] + " for " + transportation["Animal Name"][i] + " " +
                transportation["Owner Last Name"][i] + " in " + transportation["it"][i],
            startDate: new Date(transportation["Scheduled At"][i].substring(1, transportation["Scheduled At"][i].length-1))
        };
        tempJSON.endDate = new Date(tempJSON.startDate.getTime() + 30*60000);
        // gabby
        if (str === ""){
            tempJSON.members = 1;
        } else if (str.substring(1, str.length-1).trim() === "Unscheduled Services"){
            tempJSON.members = 3;
        } else {
            tempJSON.members = 2;
            tempJSON.title =tempJSON.title + " assigned to " + str.substring(1, str.length-1).trim();
        }
        appointments.push(tempJSON);
    }

    const owners = [{
        text: 'Gabby',
        id: 1,
        color: lightBlue,
    }, {
        text: 'Driver',
        id: 2,
        color: green,
    }, {
        text: 'Un - scheduled',
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
        <Paper>
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

                <WeekView
                    startDayHour={9}
                    endDayHour={21.5}
                />
                <MonthView />


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
        </Paper>
    );
}

