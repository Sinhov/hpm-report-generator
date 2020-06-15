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

export default function Internal(args) {
    const dfBathing = args.dfServices.filter(row => (row.get("Service Name") === "\"B&T Program | Lesson at" +
        " HPM\"") || (row.get("Service Name") === "\"B&T Program | In-Home Lesson\"") ||
        (row.get("Service Name") === "\"Car Service | Drop Off\""));

    const bathing = dfBathing.toDict();
    let appointments = [], startDates = [];

    const getStartDate = (date) => {
        if (date.getHours() < 10){
            date.setHours(16);
            date.setMinutes(30);
            date.setDate(date.getDate() - 1);
        }
        if (date.getHours() > 17 || (date.getHours() === 17  && date.getMinutes() === 30)){
            date.setHours(16);
            date.setMinutes(30);
        }
        while (startDates.includes(date.getTime())){
            if (date.getMinutes(30)){
                date.setMinutes(0);
            } else {
                date.setHours(date.getHours() - 1);
                date.setMinutes(30);
                if (date.getHours() < 10){
                    date.setHours(16);
                    date.setDate(date.getDate() - 1);
                }
            }
        }
        return date;
    };

    for (let i = 0; i < bathing["Scheduled At"].length; i++){
        let date = new Date(bathing["Scheduled At"][i].substring(1, bathing["Scheduled At"][i].length-1));
        let tempJSON = {
            id: i,
            members: 2,
            title: bathing["Animal Name"][i] + " " + bathing["Owner Last Name"][i],
            startDate: getStartDate(date)
        };
        startDates.push(tempJSON.startDate.getTime());
        tempJSON.endDate = new Date(tempJSON.startDate.getTime() + 30*60000);
        appointments.push(tempJSON);
    }

    const owners = [{
        text: 'Swim',
        id: 1,
        color: lightBlue,
    }, {
        text: 'Bath',
        id: 2,
        color: green,
    }, {
        text: 'Grooming',
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

