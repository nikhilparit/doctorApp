import React, { useState, useEffect } from "react";
import { View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Alert, Dimensions, Linking } from 'react-native';
import {
    FormControl,
    Input,
    Text,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    Modal,
    HStack,
    Center,
    NativeBaseProvider,
    Radio,
    Popover,
    Image,
    Fab
} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import { IconButton, MD3Colors, Searchbar } from 'react-native-paper';
import moment from 'moment-timezone';
import CalendarStrip from "react-native-calendar-strip";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import Api from '../../api/Api';
import Loader from "../../components/Loader";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
const { height, width } = Dimensions.get('window');
//import Snackbar from "react-native-snackbar";

//const timeZone = moment().tz("Asia/Kolkata").format();
//console.log('TIMEZONE....', timeZone);

const TodayAppointment = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalViewType, setModalmodalViewType] = useState(false);
    const [modalAction, setmodalAction] = useState(false);
    const [value, setValue] = useState("");
    const [view, setView] = useState("");
    const [appointmentslist, setAppointmentList] = useState([]);
    const [drList, setDrList] = useState([]);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [patientDetails, setPatientDetails] = useState({});
    const [appointmentDetails, setAppointmentDetails] = useState({});
    const [show, setShow] = useState(false);
    //Handle date in view
    const [todayDate, setTodayDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [weekDate, setWeekDate] = useState('');
    const [currentDate, setCurrentDate] = useState(moment());
    const [viewType, setviewType] = useState('');
    const [WeekEndDate, setWeekEndDate] = useState('');
    const [countNumber, setcountNumber] = useState([]);
    const [date, setDate] = useState(new Date());
    //handle State For Week View
    const [weekDateStart, setweekDateStart] = useState('');
    const [weekDateEnd, setweekDateEnd] = useState('');
    //handle PatientID in actionModal
    const [SelectedPatientID, setSelectedPatientID] = useState('');
    const [SelectedAppointmentID, setSelectedAppointmentID] = useState('');
    const [MobileNumber, setMobileNumber] = useState('');
    //double calender selection
    const [startDate1, setStartDate1] = useState(null);
    const [endDate1, setEndDate1] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDateType, setSelectedDateType] = useState(null);
    const [customDate1, setcustomDate1] = useState('');
    const [customDate2, setcustomDate2] = useState('');
    const [mystartDate1, setmystartDate1] = useState('');
    const [myendDate1, setmyendDate1] = useState('');
    const mystartDate = moment(route.params.startDate).format('YYYY-MM-DD');
    const myendDate = moment(route.params.endDate).format('YYYY-MM-DD');
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const [confirmationWindow1, setconfirmationWindow1] = useState(false);
    console.log("My DATES", mystartDate, myendDate);
    //Calculations of count
    const [allCount, setAllCount] = useState(0);
    const [scheduledCount, setScheduledCount] = useState(0);
    const [missedCount, setMissedCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [waitingCount, setWaitingCount] = useState(0);
    const [engagedCount, setEngagedCount] = useState(0);
    const resetCount = () => {
        setAllCount(0);
        setScheduledCount(0);
        setMissedCount(0);
        setCompletedCount(0);
        setWaitingCount(0);
        setEngagedCount(0);
    }
    const myCount = () => {
        const sDate = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
        setTodayDate(moment(sDate).format('DD-MMM-YYYY'));
        //// console.log("S DATE", sDate);
        const myDate = moment(sDate).add(1, 'days');
        const eDate = moment(myDate).format('YYYY-MM-DD');
        //// console.log("E DATE", eDate);
        setStartDate(sDate);
        setEndDate(eDate);
        const formData =
        {
            clinicID: myClinicID,
            providerID: "00000000-0000-0000-0000-000000000000",
            searchTerm: "",
            searchBy: "",
            pageIndex: 0,
            pageSize: 0,
            startDate: sDate,
            endDate: eDate,
            recordCount: 0,
            userID: "00000000-0000-0000-0000-000000000000",
            status: "",
            userClinicInfoID: "00000000-0000-0000-0000-000000000000"
        }
        //// console.log('Data To Pass Count', formData);
        try {
            Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                //console.log('countNumber Appointments List', resp.data);
                setcountNumber(resp.data);
            });
        } catch (error) {
            // console.log(error);
        }
    }
    const readData = () => {
        resetData();
        resetCount();
        // console.log("START DATE", mystartDate);
        // console.log("END DATE", myendDate);
        if (mystartDate == myendDate) {
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: moment(mystartDate).format('YYYY-MM-DD'),
                endDate: moment(mystartDate).add(1, 'days').format('YYYY-MM-DD'),
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            console.log('Data To Pass TODAY Apoointment in if condition', formData);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    // console.log('Appointments List', resp.data);
                    const data = resp.data;
                    setAppointmentList(resp.data);
                    console.log("appointment length", data[0].getAllAppointmentInfoResultDTOList.length);
                    let allappointmentcount = 0;
                    let statusText = '';
                    let scheduleCountnvr = 0;
                    let waitingCountnvr = 0;
                    let engagedCountnvr = 0;
                    let completeCountnvr = 0;
                    let missedCount = 0;
                    if (data[0].getAllAppointmentInfoResultDTOList.length > 0) {
                        for (let i = 0; i < data[0].getAllAppointmentInfoResultDTOList.length; i++) {
                            statusText = data[0].getAllAppointmentInfoResultDTOList[i].status;
                            console.log("STATUS TEXT", statusText);
                            if (statusText == 'Scheduled') {
                                scheduleCountnvr++;
                            }
                            if (statusText == 'Waiting') {
                                waitingCountnvr++;
                            }
                            if (statusText == 'Engaged') {
                                engagedCountnvr++;
                            }
                            if (statusText == 'Completed') {
                                completeCountnvr++
                            }
                            if (statusText == 'Missed') {
                                missedCount++
                            }
                            allappointmentcount++;
                        }
                        console.log("allapointemnt:", allappointmentcount);
                        console.log("scheduleCountnvr:", scheduleCountnvr);
                        setAllCount(allappointmentcount);
                        setScheduledCount(scheduleCountnvr);
                        setWaitingCount(waitingCountnvr);
                        setEngagedCount(engagedCountnvr);
                        setMissedCount(missedCount);
                        setCompletedCount(completeCountnvr);
                    }
                });
            } catch (error) {
                // console.log(error);
            }
        } else {
            resetData();
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: myendDate,
                endDate: mystartDate,
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            console.log('Data To Pass TODAY Apoointment in else condintion', formData);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    // console.log('Appointments List in else', resp.data);
                    setAppointmentList(resp.data);
                    setStartDate1(null);
                    setEndDate1(null);
                    setmystartDate1(mystartDate);
                    setmyendDate1(myendDate);
                    console.log("appointment length", data[0].getAllAppointmentInfoResultDTOList.length);
                    let allappointmentcount = 0;
                    let statusText = '';
                    let scheduleCountnvr = 0;
                    let waitingCountnvr = 0;
                    let engagedCountnvr = 0;
                    let completeCountnvr = 0;
                    let missedCount = 0;
                    if (data[0].getAllAppointmentInfoResultDTOList.length > 0) {
                        for (let i = 0; i < data[0].getAllAppointmentInfoResultDTOList.length; i++) {
                            statusText = data[0].getAllAppointmentInfoResultDTOList[i].status;
                            console.log("STATUS TEXT", statusText);
                            if (statusText == 'Scheduled') {
                                scheduleCountnvr++;
                            }
                            if (statusText == 'Waiting') {
                                waitingCountnvr++;
                            }
                            if (statusText == 'Engaged') {
                                engagedCountnvr++;
                            }
                            if (statusText == 'Completed') {
                                completeCountnvr++
                            }
                            if (statusText == 'Missed') {
                                missedCount++
                            }
                            allappointmentcount++;
                        }
                        console.log("allapointemnt:", allappointmentcount);
                        console.log("scheduleCountnvr:", scheduleCountnvr);
                        setAllCount(allappointmentcount);
                        setScheduledCount(scheduleCountnvr);
                        setWaitingCount(waitingCountnvr);
                        setEngagedCount(engagedCountnvr);
                        setMissedCount(missedCount);
                        setCompletedCount(completeCountnvr);
                    }
                });
            } catch (error) {
                // console.log(error);
            }
        }

        const myformData =
        {
            clinicID: myClinicID,
            showAllProviders: true,
            userClinicInfoID: "00000000-0000-0000-0000-000000000000"
        }
        //// console.log('Data To Pass', myformData);
        try {
            Axios.post(`${Api}Setting/GetProviderInfoByParameterForMobile`, myformData).then(resp => {
                //// console.log('Doctor List', resp.data);
                setDrList(resp.data);
            });
        } catch (error) {
            // console.log(error);
        }
    };
    const resetData = () => {
        setmystartDate1('');
        setmyendDate1('');
        setStartDate1('');
        setEndDate1('');
        setcustomDate1('');
        setcustomDate2('');
        setTodayDate('');
        setStartDate('');
        setEndDate('');
        setWeekEndDate('');
        setWeekDate('');
        setmystartDate1('');
        setmyendDate1('');
        setviewType('');
        setSelectedDateType('');
    }
    useEffect(() => {
        readData();
        myCount();
    }, [isFocused]);
    const openMissedConfirmation = () => {
        setmodalAction(false);
        setconfirmationWindow(true);
    }
    const openCancelConfirmation = () => {
        setmodalAction(false);
        setconfirmationWindow1(true);
    }
    const searchByDoctor = (id) => {
        //console.log(id);
        //console.log(endDate);
        const myStartDate = moment(startDate).format('YYYY-MM-DD').toString();
        const myendDate = moment(endDate).format('YYYY-MM-DD').toString();
        //console.log(myStartDate, myendDate);
        const formData =
        {
            clinicID: myClinicID,
            providerID: id,
            searchTerm: null,
            searchBy: null,
            pageIndex: 0,
            pageSize: 0,
            startDate: myStartDate,
            endDate: myendDate
        }
        //console.log("FormData at search", formData);
        try {
            Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                //console.log('Appointments List', resp.data);
                const data = resp.data
                setAppointmentList(data);
                setStartDate1(null);
                setEndDate1(null);
            });
        } catch (error) {
            //console.log(error);
        }

        setModalVisible(false)
    }
    const handleView = (viewType) => {
        setviewType(viewType);
        //console.log(startDate1);
        //console.log(endDate1);
        const today = moment().format('L');
        switch (viewType) {
            case 'Custom View':
                //console.log(viewType);
                break;
            case 'Week View':
                //console.log(viewType);
                setcustomDate1('');
                setcustomDate2('');
                // setmystartDate('');
                // setmyendDate('');
                setCurrentDate(moment(new Date()).format('YYYY-MM-DD').toString());
                const myDay = moment().format('DD-MMM-YYYY');
                const sweekDay = moment().format('YYYY-MM-DD');
                //console.log("S WEEK DAY", sweekDay);
                //console.log("MY DAY", myDay);
                const startDate = moment(sweekDay).startOf('week').format('YYYY-MM-DD').toString();
                const endDate = moment(sweekDay).endOf('week').format('YYYY-MM-DD').toString();
                //console.log("WEEK DAY", startDate, endDate);
                setTodayDate(startDate);
                setWeekEndDate(endDate);
                setStartDate(startDate);
                setEndDate(endDate);
                const formData2 =
                {
                    clinicID: myClinicID,
                    providerID: "00000000-0000-0000-0000-000000000000",
                    searchTerm: "",
                    searchBy: "",
                    pageIndex: 0,
                    pageSize: 0,
                    startDate: startDate,
                    endDate: endDate,
                    recordCount: 0,
                    userID: "00000000-0000-0000-0000-000000000000",
                    status: "",
                    userClinicInfoID: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData2);
                try {
                    Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData2).then(resp => {
                        //console.log('Appointments List', resp.data);
                        setAppointmentList(resp.data);
                    });
                } catch (error) {
                    //console.log(error.message);
                }
                setModalmodalViewType(!modalViewType);
                break;
            case 'Month View':
                setcustomDate1('');
                setcustomDate2('');
                // setmystartDate('');
                // setmyendDate('');
                setCurrentDate(moment(new Date()).tz("Asia/Kolkata").format('YYYY-MM-DD').toString());
                //console.log(viewType);
                const month = moment().tz("Asia/Kolkata").format('MMMM YYYY');
                setTodayDate(month);
                const startOfMonth = moment(startDate).tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
                const endOfMonth = moment(startDate).tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
                setEndDate(endOfMonth);
                setStartDate(startOfMonth);
                setEndDate(endOfMonth);
                //console.log(startOfMonth, endOfMonth);
                const formData1 =
                {
                    clinicID: myClinicID,
                    providerID: "00000000-0000-0000-0000-000000000000",
                    searchTerm: "",
                    searchBy: "",
                    pageIndex: 0,
                    pageSize: 0,
                    startDate: startOfMonth,
                    endDate: endOfMonth,
                    recordCount: 0,
                    userID: "00000000-0000-0000-0000-000000000000",
                    status: "",
                    userClinicInfoID: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData1);
                try {
                    Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData1).then(resp => {
                        //console.log('Appointments List', resp.data);
                        setAppointmentList(resp.data);
                    });
                } catch (error) {
                    //console.log(error.message);
                }
                setModalmodalViewType(!modalViewType);
                break;
            case 'Day View':
                setcustomDate1('');
                setcustomDate2('');
                setmystartDate1('');
                setmyendDate1('');
                setCurrentDate(moment(new Date()).format('YYYY-MM-DD').toString());
                //console.log(viewType);
                const day = moment().tz("Asia/Kolkata").format('DD-MMM-YYYY');
                const currentDay = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
                setStartDate(currentDay);
                //console.log('Current Day', currentDay);
                //console.log('Day View Date', day);
                setTodayDate(day);
                const newdateFormat = moment(currentDay).format('YYYY-MM-DD').toString();
                const myDate = moment(currentDay).add(1, 'days').format('YYYY-MM-DD').toString();
                const eDate = moment(myDate).format('YYYY-MM-DD').toString();
                //console.log("MYDATE & EDATE", newdateFormat, myDate, eDate);
                setEndDate(eDate);
                setWeekDate('');
                const formData =
                {
                    clinicID: myClinicID,
                    providerID: "00000000-0000-0000-0000-000000000000",
                    searchTerm: "",
                    searchBy: "",
                    pageIndex: 0,
                    pageSize: 0,
                    startDate: newdateFormat,
                    endDate: eDate,
                    recordCount: 0,
                    userID: "00000000-0000-0000-0000-000000000000",
                    status: "",
                    userClinicInfoID: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData);
                try {
                    Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                        //console.log('Appointments List', resp.data);
                        setAppointmentList(resp.data);
                    });
                } catch (error) {
                    //console.log(error.message);
                }
                setModalmodalViewType(!modalViewType);
                break;
            default:
                //console.log(viewType);
                break;
        }
    }
    const datePlus = () => {
        //console.log(todayDate);
        //console.log(WeekEndDate);
        //console.log("S DATE", startDate);
        //console.log("E DATE", endDate);

        if (viewType == 'Day View' || viewType == '') {

            const nextDate = moment(startDate).tz("Asia/Kolkata").add(1, 'days').format('YYYY-MM-DD').toString();
            const myendDate = moment(startDate).tz("Asia/Kolkata").add(2, 'days').format('YYYY-MM-DD').toString();
            //console.log("START & END DATE", nextDate, myendDate);
            setStartDate(nextDate);
            setEndDate(myendDate);
            setCurrentDate(moment(nextDate).format('DD-MMM-YYYY').toString());
            setTodayDate(moment(nextDate).format('DD-MMM-YYYY').toString());
            //setEndDate(moment(myendDate).format('DD-MMM-YYYY').toString());
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: moment(nextDate).tz("Asia/Kolkata").format('YYYY-MM-DD').toString(),
                endDate: moment(myendDate).tz("Asia/Kolkata").format('YYYY-MM-DD').toString(),
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    //console.log('Appointments List', resp.data);
                    setAppointmentList(resp.data);
                });
            } catch (error) {
                //console.log(error.message);
            }
        }
        if (viewType == 'Month View') {
            const nextDate = moment(startDate).tz("Asia/Kolkata").add(1, 'month').format('MMMM YYYY');
            //console.log("Month", nextDate);
            const startOfMonth = moment(nextDate, 'MMMM YYYY').tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
            const endOfMonth = moment(nextDate, 'MMMM YYYY').tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
            //console.log(startOfMonth, endOfMonth);
            setStartDate(startOfMonth);
            setEndDate(endOfMonth);
            setCurrentDate(moment(nextDate).tz("Asia/Kolkata").format('MMMM YYYY'));
            setTodayDate(nextDate);
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: startOfMonth,
                endDate: endOfMonth,
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    //console.log('Appointments List', resp.data);
                    setAppointmentList(resp.data);
                });
            } catch (error) {
                //console.log(error.message);
            }
        }
        if (viewType == 'Week View') {
            //console.log(WeekEndDate);
            //console.log(todayDate);
            //console.log("SD", startDate);
            //console.log("ED", endDate);
            const nextWeekSDate = moment(new Date(WeekEndDate), 'YYYY-MM-DD').tz("Asia/Kolkata").add(1, 'day').format('YYYY-MM-DD').toString();
            const nextWeekEDate = moment(new Date(nextWeekSDate), 'YYYY-MM-DD').tz("Asia/Kolkata").add(6, 'day').format('YYYY-MM-DD').toString();
            //console.log("nextWeekSDate", nextWeekSDate);
            //console.log("nextWeekEDate", nextWeekEDate);
            setTodayDate(nextWeekSDate);
            setWeekEndDate(nextWeekEDate);
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: nextWeekSDate,
                endDate: nextWeekEDate,
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    //console.log('Appointments List', resp.data);
                    setAppointmentList(resp.data);
                });
            } catch (error) {
                //console.log(error.message);
            }
        }

    }
    const dateMinus = () => {
        //console.log(todayDate);
        //console.log(WeekEndDate);
        //console.log("S DATE", startDate);
        //console.log("E DATE", endDate);
        if (viewType == 'Day View' || viewType == '') {
            const nextDate = moment(startDate).tz("Asia/Kolkata").subtract(1, 'days').format('YYYY-MM-DD').toString();
            //console.log(nextDate);
            const eDate = moment(startDate).tz("Asia/Kolkata").format('YYYY-MM-DD').toString();
            //console.log("edate", eDate);
            setStartDate(nextDate);
            setEndDate(startDate);
            setCurrentDate(moment(nextDate).tz("Asia/Kolkata").format('DD-MMM-YYYY'));
            setTodayDate(moment(nextDate).tz("Asia/Kolkata").format('DD-MMM-YYYY'));
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: moment(nextDate).tz("Asia/Kolkata").format('YYYY-MM-DD'),
                endDate: moment(eDate).tz("Asia/Kolkata").format('YYYY-MM-DD'),
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "87aff216-f353-4f9b-87d3-6dd9268f509a"
            }
            //console.log('Data To Pass', formData);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    //console.log('Appointments List', resp.data);
                    setAppointmentList(resp.data);
                });
            } catch (error) {
                //console.log(error.message);
            }

        }
        if (viewType == 'Month View') {
            const nextDate = moment(startDate).tz("Asia/Kolkata").subtract(1, 'month').format('MMMM YYYY');
            //console.log("Month", nextDate);
            const startOfMonth = moment(nextDate, 'MMMM YYYY').tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
            const endOfMonth = moment(nextDate, 'MMMM YYYY').tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
            //console.log(startOfMonth, endOfMonth);
            setStartDate(startOfMonth);
            setEndDate(endOfMonth);
            setCurrentDate(moment(nextDate).tz("Asia/Kolkata").format('MMMM YYYY'));
            setTodayDate(nextDate);
            //console.log(startOfMonth, endOfMonth);
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: startOfMonth,
                endDate: endOfMonth,
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    //console.log('Appointments List', resp.data);
                    setAppointmentList(resp.data);
                });
            } catch (error) {
                //console.log(error.message);
            }
        }
        if (viewType == 'Week View') {
            //console.log(WeekEndDate);
            //console.log(todayDate);
            const nextWeekSDate = moment(new Date(WeekEndDate), 'YYYY-MM-DD').tz("Asia/Kolkata").subtract(1, 'day').format('YYYY-MM-DD').toString();
            const nextWeekEDate = moment(new Date(nextWeekSDate), 'YYYY-MM-DD').tz("Asia/Kolkata").subtract(6, 'day').format('YYYY-MM-DD').toString();
            //console.log("nextWeekSDate", nextWeekSDate);
            //console.log("nextWeekEDate", nextWeekEDate);
            setTodayDate(nextWeekSDate);
            setWeekEndDate(nextWeekEDate);
            setStartDate(nextWeekEDate);
            setEndDate(nextWeekSDate);
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: nextWeekEDate,
                endDate: nextWeekSDate,
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    //console.log('Appointments List', resp.data);
                    setAppointmentList(resp.data);
                });
            } catch (error) {
                //console.log(error.message);
            }
        }
    }
    const openActionModal = (id, appID, mobileNumber) => {
        setmodalAction(!modalAction);
        //console.log(id, appID, mobileNumber);
        setSelectedPatientID(id);
        setSelectedAppointmentID(appID);
        setMobileNumber(mobileNumber);
    }
    const viewPatientDetails = () => {
        //console.log(SelectedPatientID);
        navigation.navigate('PatientDetails', {
            patientID: SelectedPatientID,
            clinicID: myClinicID
        });
    }
    const missedAppointment = () => {
        //console.log("Selected AppointmentID", SelectedAppointmentID);
        const formData =
        {
            status: "Missed",
            appointmentID: SelectedAppointmentID,
            clinicID: myClinicID,
            patientId: SelectedPatientID,
        }
        //console.log("Missed APP. formDate", formData);
        try {
            Axios.post(`${Api}Appointment/UpdateAppointmentStatus`, formData).then(resp => {
                //console.log(resp.data);
                if (resp.data) {
                    setconfirmationWindow(false);
                    readData();
                }
            })
        } catch (error) {
            //console.log(error.message);
        }
    }
    const cancelAppointment = () => {
        //console.log(SelectedAppointmentID);
        try {
            Axios.post(`${Api}Appointment/GetAppointmentByAppointmentID?AppointmentID=${SelectedAppointmentID}`, {
                headers: {
                    'accept': 'text/plain'
                }
            }).then(resp => {
                const myData = resp.data
                //console.log(myData);
                const formData =
                {
                    appointmentID: SelectedAppointmentID,
                    startDateTime: myData.startDateTime,
                    endDateTime: myData.startDateTime,
                    cancelledOn: moment().toISOString(),
                    cancelledBy: "",
                    comments: "",
                    cancellationReason: ""
                }
                //console.log("Cancel Appointment FormData", formData);
                try {
                    Axios.post(`${Api}Appointment/CancelAppointment`, formData).then(resp => {
                        //console.log(resp.data);
                        if (resp.data) {
                            setconfirmationWindow1(false);
                            readData();
                        }
                    })

                } catch (error) {
                    //console.log(error.message);
                }
            })
        } catch (error) {
            //console.log(error.message);
        }
    }
    const callNumber = (phoneNumber) => {
        //console.log(phoneNumber);
        Linking.openURL(`tel:${phoneNumber}`);
    };
    const callNumberfromModal = () => {
        //console.log(MobileNumber);
        Linking.openURL(`tel:${MobileNumber}`);
    };
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || (selectedDateType === 'start' ? startDate1 : endDate1);
        setShowPicker(false);
        setStartDate1(null);
        setEndDate1(null);
        setcustomDate1('');
        setcustomDate2('');
        // setmystartDate('');
        // setmyendDate('');
        if (selectedDateType === 'start') {
            setStartDate1(currentDate);
            setSelectedDateType('end');
            setShowPicker(true);
            //console.log(currentDate);
            const finalDate1 = moment(currentDate).format('YYYY-MM-DD').toString();
            setStartDate(finalDate1);
            //console.log("Final Date", finalDate1);
        } else {
            setEndDate1(currentDate);
            setSelectedDateType(null);
            //console.log(currentDate);
            const finalDate2 = moment(currentDate).format('YYYY-MM-DD').toString();
            setEndDate(finalDate2);
            //console.log("Final Date", finalDate2);
            const formData =
            {
                clinicID: myClinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: moment(startDate1).format('YYYY-MM-DD').toString(),
                endDate: moment(currentDate).format('YYYY-MM-DD').toString(),
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            setcustomDate1(formData.startDate);
            setcustomDate2(formData.endDate);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                    //console.log('Appointments List', resp.data);
                    setAppointmentList(resp.data);
                });
            } catch (error) {
                //console.log(error.message);
            }
            setModalmodalViewType(!modalViewType);
        }
    };
    const handlePress = () => {
        setviewType('Custom View');
        setStartDate1(null);
        setEndDate1(null);
        setcustomDate1('');
        setcustomDate2('');
        if (!startDate1) {
            setSelectedDateType('start');
            setShowPicker(true);
        } else {
            setSelectedDateType('end');
            setShowPicker(true);
        }
    };
    const changeAppointmentState = (appointmentid, patientID, status, startDateTime, endDateTime, providerID) => {
        const selectedAppointmentID = appointmentid;
        //console.log("Appoitment ID", selectedAppointmentID);
        const selectedPatientID = patientID;
        //console.log("Patient ID", selectedPatientID);
        //console.log("SDate", startDateTime);
        //console.log("EDate", endDateTime);
        //console.log("ProviderID", providerID);

        const time = moment(startDateTime).format('LT');
        //console.log("Time", time);

        const finalStatus = (
            (status == 'Scheduled') ? 'Waiting'
                : (status == 'Waiting') ? 'Engaged'
                    : (status == 'Engaged') ? 'Complete'
                        : (status == 'Complete') ? ' Complete'
                            : (status == 'Missed') ? 'Rescheduled' :
                                '');
        //console.log("Final Status", finalStatus);

        try {
            Axios.post(`${Api}Appointment/PatientAppointmentCheckIn?appointmentID=${selectedAppointmentID}`, {
                headers: {
                    'accept': 'text/plain'
                }
            }).then(resp => {
                //console.log(resp.data);
                readData();
            });
        } catch (error) {
            //console.log(error);
        }
    }
    const changeAppointmentStateAfterScheduled = (waitingAreaID, appointmentid, patientID, status, startDateTime, endDateTime, providerID) => {
        resetData();
        const selectedAppointmentID = appointmentid;
        //console.log("Appoitment ID", selectedAppointmentID);
        const selectedPatientID = patientID;
        //console.log("Patient ID", selectedPatientID);
        //console.log("SDate", startDateTime);
        //console.log("EDate", endDateTime);
        //console.log("ProviderID", providerID);
        //console.log("waitingAreaID", waitingAreaID);

        const time = moment(startDateTime).format('LT');
        //console.log("Time", time);

        try {
            Axios.post(`${Api}Appointment/PatientAppointmentEngagedCompleted?waitingAreaID=${waitingAreaID}&status=${(status)}`, {
                headers: {
                    'accept': 'text/plain'
                }
            }).then(resp => {
                //console.log(resp.data);
                readData();
            });
        } catch (error) {
            //console.log(error);
        }
    }
    const handleStatusWiseView = (status) => {
        console.log('STSTUS', status);
        const sDate = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
        setTodayDate(moment(sDate).format('DD-MMM-YYYY'));
        console.log("S DATE", sDate);
        const myDate = moment(sDate).add(1, 'days');
        const eDate = moment(myDate).format('YYYY-MM-DD');
        console.log("E DATE", eDate);
        setStartDate(sDate);
        setEndDate(eDate);
        setcustomDate1('');
        setcustomDate2('');
        const formData =
        {
            clinicID: myClinicID,
            providerID: "00000000-0000-0000-0000-000000000000",
            searchTerm: "",
            searchBy: "",
            pageIndex: 0,
            pageSize: 0,
            startDate: sDate,
            endDate: eDate,
            recordCount: 0,
            userID: "00000000-0000-0000-0000-000000000000",
            status: status,
            userClinicInfoID: "00000000-0000-0000-0000-000000000000"
        }
        console.log('Data To Pass AT APP. LIST', formData);
        try {
            Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData).then(resp => {
                console.log('Appointments List', resp.data);
                setAppointmentList(resp.data);
                setStartDate1(null);
                setEndDate1(null);
            });
        } catch (error) {
            console.log(error);
        }

    }
    return (

        <>
            <Modal isOpen={confirmationWindow1} onClose={() => setconfirmationWindow1(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStylesheet.Text}>Confirmation</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <Text style={CommonStylesheet.Text}>Are you sure want to cancel this appointment ?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setconfirmationWindow1(false);
                            }}>
                                No
                            </Button>
                            <Button onPress={() => {
                                cancelAppointment();
                            }}>
                                Yes
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStylesheet.Text}>Confirmation</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <Text style={CommonStylesheet.Text}>Are you sure want to mark this appointment as missed ?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setconfirmationWindow(false);
                            }}>
                                No
                            </Button>
                            <Button onPress={() => {
                                missedAppointment();
                            }}>
                                Yes
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStylesheet.Text}>Select Doctor</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        {/* <TouchableOpacity onPress={() => {
                            readData();
                            setModalVisible(false);
                        }}>
                            <Text style={CommonStylesheet.Text}>All</Text>
                        </TouchableOpacity> */}
                        {drList.map(item => (
                            <View style={{ marginVertical: 10 }}>
                                <TouchableOpacity onPress={() => searchByDoctor(item.providerID)}>
                                    <Text style={CommonStylesheet.Text} key={item.providerName}>{item.providerName}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={modalViewType} onClose={() => setModalmodalViewType(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStylesheet.Text}>Select View Type</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => handleView('Day View')}>
                                <Text style={CommonStylesheet.Text}>Day View</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ margin: 10 }}>
                            <TouchableOpacity onPress={() => handleView('Week View')}>
                                <Text style={CommonStylesheet.Text}>Week View</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => handleView('Month View')}>
                                <Text style={CommonStylesheet.Text}>Month View</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ margin: 10 }}>
                            {showPicker && (
                                <DateTimePicker
                                    value={selectedDateType === 'start' ? new Date() : endDate1 || startDate1}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                            <TouchableOpacity onPress={handlePress}>
                                <Text style={CommonStylesheet.Text}>Custom View</Text>
                            </TouchableOpacity>
                        </View>



                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={modalAction} onClose={() => setmodalAction(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStylesheet.Text}>Actions</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <View style={{ margin: 10 }}>
                            <TouchableOpacity onPress={() => callNumberfromModal()}>
                                <Text style={CommonStylesheet.Text}>Call</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ margin: 10 }}>
                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <Text style={CommonStylesheet.Text}>Send SMS</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => openCancelConfirmation()}>
                                <Text style={CommonStylesheet.Text}>Cancel Appointment</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => viewPatientDetails()}>
                                <Text style={CommonStylesheet.Text}>View Patient Details</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => Alert.alert('Work is in process...')}>
                                <Text style={CommonStylesheet.Text}>Reminder On Whats App</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => openMissedConfirmation()}>
                                <Text style={CommonStylesheet.Text}>Mark As Missed</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <ScrollView>
                <SafeAreaView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ marginLeft: 10 }}>
                            <Button bgColor={'#2196f3'} onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>

                                <Text style={[CommonStylesheet.Text, Styles.alldoctorText]}>All Doctors</Text>
                            </Button>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Button bgColor={'#2196f3'} onPress={() => {
                                setModalmodalViewType(!modalViewType);
                            }}>

                                {viewType ? <Text style={[CommonStylesheet.Text, Styles.alldoctorText]}>{viewType}</Text> : <Text style={[CommonStylesheet.Text, Styles.alldoctorText]}>View Type</Text>}

                            </Button>
                        </View>
                    </View>
                    {
                        customDate1 && customDate2 ? (
                            <View>
                                <View style={{ marginTop: 7, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={Styles.TextDate}>
                                        {moment(customDate1).format('DD-MMM-YYYY').toString()} TO {moment(customDate2).format('DD-MMM-YYYY').toString()}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            mystartDate1 && myendDate1 !== "Invalid date" ? (
                                <View style={{ marginTop: 7, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={Styles.TextDate}>
                                        {moment(myendDate1).format('DD-MMM-YYYY').toString()} TO {moment(mystartDate1).format('DD-MMM-YYYY').toString()}
                                    </Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <TouchableOpacity onPress={() => dateMinus()}>
                                        <Icon
                                            name="chevron-left"
                                            size={30}
                                            color={'#2196f3'}
                                            style={{ marginLeft: 20 }}
                                        />
                                    </TouchableOpacity>
                                    {viewType == 'Week View' ? (
                                        <View style={{ marginTop: 7 }}>
                                            <Text style={Styles.TextDate}>
                                                {moment(todayDate).format('DD-MMM-YYYY').toString()} TO {moment(WeekEndDate).format('DD-MMM-YYYY').toString()}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ marginTop: 7 }}>
                                            <Text style={Styles.TextDate}>{todayDate || moment(mystartDate).format('DD-MMM-YYYY').toString()}</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity onPress={() => datePlus()}>
                                        <Icon
                                            name="chevron-right"
                                            size={30}
                                            color={'#2196f3'}
                                            style={{ marginRight: 20 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                        )
                    }

                    {appointmentslist.length == 0 ? <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                        <Text style={CommonStylesheet.Text}>There is no appointment scheduled. Please add new appointment by clicking (+) button.</Text>
                    </View> : appointmentslist && appointmentslist.map(item => item.getAllAppointmentInfoResultDTOList.map(item2 => (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }} key={item2.appointmentID}>

                            <View style={CommonStylesheet.borderforcardatAppointmentListScreen}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: 20, marginLeft: 10 }}>
                                        <Image
                                            source={require('../../assets/images/clock.png')}
                                            alt="logo.png"
                                            style={CommonStylesheet.imageofwatchatappointment}
                                        />
                                        <Text style={CommonStylesheet.Text}>{moment(item2.startDateTime).format('LT')}</Text>
                                        <Text style={CommonStylesheet.Text}>{moment(item2.endDateTime).format('LT')}</Text>
                                        <View style={{ marginVertical: 10 }}>
                                            {item2.status == 'Engaged' ? <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)} ><View style={{ width: 90, height: 30, backgroundColor: '#EF5354', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}><Text style={Styles.Text1}>Engaged</Text></View></TouchableOpacity> :
                                                ((item2.status == 'Completed') ? <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)}><View style={{ width: 90, height: 30, backgroundColor: '#1FAA59', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}><Text style={Styles.Text1}>Completed</Text></View></TouchableOpacity> :
                                                    ((item2.status == 'Scheduled') ? <TouchableOpacity onPress={() => changeAppointmentState(item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)}><View style={{ width: 90, height: 30, backgroundColor: '#383CC1', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}><Text style={Styles.Text1}>Scheduled</Text></View></TouchableOpacity> :
                                                        ((item2.status == 'Waiting') ? <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)} ><View style={{ width: 90, height: 30, backgroundColor: '#E8BD0D', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}><Text style={Styles.Text1}>Waiting</Text></View></TouchableOpacity> :
                                                            <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)}><View style={{ width: 90, height: 30, backgroundColor: '#35BDD0', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}><Text style={Styles.Text1}>Missed</Text></View></TouchableOpacity>)))}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate('EditAppointments', {
                                        appointmentID: item2.appointmentID,
                                        clinicID: myClinicID,
                                        patientID: item2.patientID

                                    })}>
                                        <View
                                            style={{

                                                justifyContent: 'center',
                                                alignItems: 'flex-start',
                                                marginHorizontal: 30,
                                                flex: 1,
                                                marginTop: -10
                                            }}>

                                            <Text style={CommonStylesheet.headertext16}>
                                                {item2.patientName}
                                            </Text>

                                            <Text style={CommonStylesheet.textPatientList}>
                                                {item2.mobileNumber}
                                            </Text>
                                            <Text style={CommonStylesheet.textPatientList}>
                                                {item2.providerName}
                                            </Text>
                                            <Text style={CommonStylesheet.textPatientList}>
                                                {moment(item2.startDateTime).format('dddd')} {moment(item2.startDateTime).format('LL')}
                                            </Text>

                                        </View>
                                    </TouchableOpacity>
                                    {/* <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginHorizontal: -10 }}>
                                        <IconButton
                                            icon="phone"
                                            iconColor={'#2196F3'}
                                            size={25}
                                            containerColor={'white'}
                                            onPress={() => callNumber(item2.mobileNumber)}
                                        />
                                    </View> */}
                                </View>
                                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginVertical: -120 }}>
                                    <TouchableOpacity onPress={() => {
                                        openActionModal(item2.patientID, item2.appointmentID, item2.mobileNumber)
                                    }}>
                                        <Icon

                                            name="ellipsis-v"
                                            size={18}
                                            color={'#576067'}
                                            style={Styles.iconDot}
                                        />
                                    </TouchableOpacity>
                                    {/* <IconButton
                                            icon="phone"
                                            iconColor={'#2196F3'}
                                            size={25}
                                            containerColor={'white'}
                                            style={{marginTop:40}}
                                            onPress={() =>Alert.alert('Work is in process...')}
                                        /> */}
                                </View>
                            </View>
                        </View>
                    )))}
                </SafeAreaView>
            </ScrollView >
            <View style={{ marginTop: -15 }}>
                <Fab renderInPortal={false} size={'md'} bgColor={"#2196f3"} icon={<Icon
                    name="plus"
                    size={20}
                    color={"white"}
                />} onPress={() => navigation.navigate('AddAppointments', {
                    clinicID: myClinicID
                })} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => handleStatusWiseView('')}>
                    <View style={Styles.containerBottom}>
                        <View style={Styles.countContainerall}>

                            <Text style={Styles.textCount}>
                                {allCount}
                            </Text>

                        </View>
                        <Text style={Styles.textall}>All</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusWiseView('Scheduled')}>
                    <View style={Styles.containerBottom}>
                        <View style={Styles.countContainerschedule}>
                            <Text style={Styles.textCount}>
                                {scheduledCount}
                            </Text>
                        </View>
                        <Text style={Styles.textall}>Scheduled</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusWiseView('Waiting')}>
                    <View style={Styles.containerBottom}>
                        <View style={Styles.countContainerwaiting}>
                            <Text style={Styles.textCount}>
                                {waitingCount}
                            </Text>
                        </View>
                        <Text style={Styles.textall}>Waiting</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusWiseView('Engaged')}>
                    <View style={Styles.containerBottom}>
                        <View style={Styles.countContainerengaged}>
                            <Text style={Styles.textCount}>
                                {engagedCount}
                            </Text>
                        </View>
                        <Text style={Styles.textall}>Engaged</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusWiseView('Completed')}>
                    <View style={Styles.containerBottom}>
                        <View style={Styles.countContainercomplete}>
                            <Text style={Styles.textCount}>
                                {completedCount}
                            </Text>
                        </View>
                        <Text style={Styles.textall}>Complete</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusWiseView('Missed')}>
                    <View style={Styles.containerBottom}>
                        <View style={Styles.countContainermissed}>
                            <Text style={Styles.textCount}>
                                {missedCount}
                            </Text>
                        </View>
                        <Text style={Styles.textall}>Missed</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>

    );
};

const Styles = StyleSheet.create({
    alldoctorContainer: {
        backgroundColor: '#D3D3D3',
        height: 30,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,

    },
    monthviewContainer: {
        backgroundColor: '#D3D3D3',
        height: 30,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10

    },
    alldoctorText: {
        color: 'white'
    },
    containerBottom: {
        width: 50,
        height: 50,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
        borderRadius: 10,
        marginBottom: 5
    },
    countContainerall: {
        height: 20,
        width: 20,
        backgroundColor: 'pink',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    countContainerschedule: {
        height: 20,
        width: 20,
        backgroundColor: '#383CC1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    countContainerwaiting: {
        height: 20,
        width: 20,
        backgroundColor: '#E5D68A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    countContainerengaged: {
        height: 20,
        width: 20,
        backgroundColor: '#EF5354',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    countContainercomplete: {
        height: 20,
        width: 20,
        backgroundColor: '#1FAA59',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    countContainermissed: {
        height: 20,
        width: 20,
        backgroundColor: '#35BDD0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    countContainer6: {
        height: 20,
        width: 20,
        backgroundColor: '#EF5354',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    textCount: {
        fontSize: 10,
        color: 'white',
        fontFamily: 'Poppins-Medium'
    },
    textall: {
        fontSize: 9,
        color: 'white',
        fontFamily: 'Poppins-Medium'
    },
    iconPhone: {
        marginLeft: 50,
        marginTop: 10
    },
    iconDot: {
        marginRight: 15,
        marginTop: 10
    },
    Text1: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Poppins-Medium'

    },
    TextDate: {
        fontSize: 12,
        color: '#2196f3',
        fontFamily: 'Poppins-Bold'
    },
    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 300,
        height: 260,
        display: 'flex',
    },
})

export default TodayAppointment;