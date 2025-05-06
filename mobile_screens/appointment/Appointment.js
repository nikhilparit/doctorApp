import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Alert, Dimensions, Linking, FlatList } from 'react-native';
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
    Fab,
    Divider
} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import Api from "../../api/Api";
import Loader from "../../components/Loader";
import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
const { height, width } = Dimensions.get('window');
import { getHeaders } from "../../utils/apiHeaders";
//import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import {
    fetchAppointments,
    setViewType,
    fetchAppointmentsByViewType,
    setProviderName,
    setStartDate,
    setEndDate,
    fetchAppointmentsByProvider,
    PatientAppointmentEngagedCompleted,
    PatientAppointmentCheckIn,
    handleStatusWiseViewForAppointmentList,
    UpdateAppointmentStatus,
} from "../../features/appointmentSlice";


//const timeZone = moment().tz("Asia/Kolkata").format();
//console.log('TIMEZONE', timeZone);
const fontForDate = Math.min(width, height) * 0.02
const regularFontSize = width < 600 ? 12 : 18;
const widthSizePerScreen = width < 600 ? 60 : 100;
const HeightSizePerScreen = width < 600 ? 150 : 160;
const utcOffsetMinutes = moment().utcOffset();
const MaxWidth = width < 600 ? 80 : 80;

const Appointment = ({ route }) => {
    const {
        dashboardStartDate = null,
        dashboardEndDate = null,
        keyParam: initialKeyParam = null
    } = route.params || {};
    let keyParam = initialKeyParam;
    // console.log(keyParam);
    const dispatch = useDispatch();
    const appointmentslist = useSelector((state) => state.appointment.appointmentList) || [];
    const providerName = useSelector((state) => state.appointment.providerName);
    const drList = useSelector((state) => state.appointment.provider);
    const allCount = useSelector((state) => state.appointment.allCount);
    const scheduledCount = useSelector((state) => state.appointment.scheduledCount);
    const missedCount = useSelector((state) => state.appointment.missedCount);
    const completedCount = useSelector((state) => state.appointment.completedCount);
    const waitingCount = useSelector((state) => state.appointment.waitingCount);
    const engagedCount = useSelector((state) => state.appointment.engagedCount);
    const startDate = useSelector((state) => state.appointment.startDate);
    const endDate = useSelector((state) => state.appointment.endDate);
    const viewType = useSelector((state) => state.appointment.viewType);
    const appointmentCounts = useMemo(() => ({
        allCount,
        scheduledCount,
        missedCount,
        completedCount,
        waitingCount,
        engagedCount,
    }), [allCount, scheduledCount, missedCount, completedCount, waitingCount, engagedCount]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalViewType, setModalmodalViewType] = useState(false);
    const [modalAction, setmodalAction] = useState(false);
    const [isloading, setIsloading] = useState(false);
    //const [appointmentslist, setAppointmentList] = useState([]);
    // const [drList, setDrList] = useState([]);
    //Handle date in view
    const [todayDate, setTodayDate] = useState('');
    // const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDate] = useState('');

    // const [viewType, setviewType] = useState('');
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const [confirmationWindow1, setconfirmationWindow1] = useState(false);
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
    const [myClinicID, setstoredClinicID] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState("");
    // const [providerName, setProviderName] = useState('');
    const [token, setToken] = useState('');
    const [clinicName, setclinicName] = useState('');
    const [confirmationWindow2, setconfirmationWindow2] = useState(false);
    const [reason, setReason] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [doctorID, setDoctorID] = useState('');
    const [appointmentStatus, setappointmentStatus] = useState('');

    const readData = async () => {
        setLoading(true);
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            const formDataForProvider = {
                clinicID: user.clinicID,
                showAllProviders: true,
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            };

            let formDataForAppointmentList = {}

            if (keyParam) {
                formDataForAppointmentList = {
                    clinicID: user.clinicID,
                    providerID: "00000000-0000-0000-0000-000000000000",
                    searchTerm: "",
                    searchBy: "",
                    pageIndex: 0,
                    pageSize: 10,
                    startDate: dashboardStartDate,
                    endDate: dashboardEndDate,
                    recordCount: 0,
                    userID: "00000000-0000-0000-0000-000000000000",
                    status: "",
                    userClinicInfoID: "00000000-0000-0000-0000-000000000000"
                };

            } else {

                formDataForAppointmentList = {
                    clinicID: user.clinicID,
                    providerID: "00000000-0000-0000-0000-000000000000",
                    searchTerm: "",
                    searchBy: "",
                    pageIndex: 0,
                    pageSize: 10,
                    startDate: startDate,
                    endDate: endDate,
                    recordCount: 0,
                    userID: "00000000-0000-0000-0000-000000000000",
                    status: "",
                    userClinicInfoID: "00000000-0000-0000-0000-000000000000"
                };

            }
            dispatch(fetchAppointments({ formDataForProvider, formDataForAppointmentList }));
        } catch (error) {
            //console.log("Error in readData:", error);
        } finally {
            setLoading(false);
        }
    };
    // useEffect(() => {
    //     readData();
    // }, [isFocused]);

    useFocusEffect(
        useCallback(() => {
            readData();
        }, [keyParam])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            dispatch(setStartDate(moment().format('YYYY-MM-DD').toString()));
            dispatch(setEndDate(moment().add(1, 'days').format('YYYY-MM-DD').toString()));
            dispatch(setViewType('Day View'));
        });

        return unsubscribe;
    }, [navigation, dispatch,]);


    const handleView = async (type) => {
        console.log("type",type);
        console.log("keyParam",keyParam);
        keyParam = null;
        console.log("keyParam",keyParam);
        console.log("type",type);
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            // Dispatch the view type to Redux
            dispatch(setViewType(type));
            setModalmodalViewType(false); // Close the modal
            const today = moment().format('YYYY-MM-DD');
            let startDate, endDate;

            switch (type) {
                case 'Day View':
                    startDate = moment().format('YYYY-MM-DD').toString();
                    endDate = moment().add(1, 'days').format('YYYY-MM-DD').toString();
                    dispatch(setStartDate(startDate));
                    dispatch(setEndDate(endDate));
                    break;

                case 'Week View':
                    startDate = moment().startOf('week').format('YYYY-MM-DD').toString();
                    endDate = moment().endOf('week').format('YYYY-MM-DD').toString();
                    dispatch(setStartDate(startDate));
                    dispatch(setEndDate(endDate));
                    break;

                case 'Month View':
                    startDate = moment().startOf('month').format('YYYY-MM-DD').toString();
                    endDate = moment().endOf('month').format('YYYY-MM-DD').toString();
                    dispatch(setStartDate(startDate));
                    dispatch(setEndDate(endDate));
                    break;

                default:
                    //console.log('Unsupported view type');
                    return;
            }

            const formData = {
                clinicID: user.clinicID,
                providerID: doctorID || "00000000-0000-0000-0000-000000000000",
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
            };

            // Dispatch the thunk to fetch appointments
            dispatch(fetchAppointmentsByViewType(formData));
        } catch (error) {
            console.error('Error in handleView:', error);
        }
    };
    const searchByDoctor = async (id, name) => {
        setDoctorID(id);
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            //console.log(id, name);
            dispatch(setProviderName(name));
            setModalVisible(false);
            let formData = {};
            formData =
            {
                clinicID: user.clinicID,
                providerID: id,
                searchTerm: null,
                searchBy: null,
                pageIndex: 0,
                pageSize: 0,
                startDate: startDate,
                endDate: endDate
            }
            //console.log(formData);
            // Dispatch the thunk to fetch appointments
            dispatch(fetchAppointmentsByProvider(formData));
        } catch (error) {
            console.error('Error in handleView:', error);
        }

    }
    const datePlus = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        try {
            let sDate, eDate;

            switch (viewType) {
                case 'Day View':
                    sDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD').toString();
                    eDate = moment(sDate).add(1, 'days').format('YYYY-MM-DD').toString();
                    dispatch(setStartDate(sDate));
                    dispatch(setEndDate(eDate));
                    break;

                case 'Week View':
                    sDate = moment(new Date(startDate), 'YYYY-MM-DD').add(7, 'day').format('YYYY-MM-DD');
                    eDate = moment(new Date(endDate), 'YYYY-MM-DD').add(7, 'day').format('YYYY-MM-DD');
                    dispatch(setStartDate(sDate));
                    dispatch(setEndDate(eDate));
                    break;

                case 'Month View':
                    const nextMonth = moment(startDate).add(1, 'month').format('MMMM YYYY');
                    sDate = moment(nextMonth, 'MMMM YYYY').startOf('month').format('YYYY-MM-DD').toString();
                    eDate = moment(nextMonth, 'MMMM YYYY').endOf('month').format('YYYY-MM-DD').toString();
                    dispatch(setStartDate(sDate));
                    dispatch(setEndDate(eDate));
                    break;

                default:
                    //console.log('Unsupported view type');
                    return;
            }

            const formData = {
                clinicID: user.clinicID,
                providerID: doctorID || "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: sDate, // Use local variable
                endDate: eDate,   // Use local variable
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            };
            dispatch(fetchAppointmentsByViewType(formData))
            //console.log(formData);
        } catch (error) {
            // console.log(error);
        }
    };
    const dateMinus = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        try {
            let sDate, eDate;
            switch (viewType) {
                case 'Day View':
                    sDate = moment(startDate).subtract(1, 'days').format('YYYY-MM-DD').toString();
                    eDate = moment(sDate).add(1, 'days').format('YYYY-MM-DD').toString();
                    dispatch(setStartDate(sDate));
                    dispatch(setEndDate(eDate));
                    break;

                case 'Week View':
                    sDate = moment(new Date(startDate), 'YYYY-MM-DD').subtract(7, 'day').format('YYYY-MM-DD');
                    eDate = moment(new Date(endDate), 'YYYY-MM-DD').subtract(7, 'day').format('YYYY-MM-DD');
                    dispatch(setStartDate(sDate));
                    dispatch(setEndDate(eDate));
                    break;

                case 'Month View':
                    const prevmonthDate = moment(startDate).subtract(1, 'month').format('MMMM YYYY');
                    sDate = moment(prevmonthDate, 'MMMM YYYY').startOf('month').format('YYYY-MM-DD').toString();
                    eDate = moment(prevmonthDate, 'MMMM YYYY').endOf('month').format('YYYY-MM-DD').toString();
                    dispatch(setStartDate(sDate));
                    dispatch(setEndDate(eDate));
                    break;

                default:
                    //console.log('Unsupported view type');
                    return;
            }
            const formData =
            {
                clinicID: user.clinicID,
                providerID: doctorID || "00000000-0000-0000-0000-000000000000",
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
            //console.log(formData);
            dispatch(fetchAppointmentsByViewType(formData));

        } catch (error) {
            // console.log(error);
        }
    }
    const changeAppointmentStateAfterScheduled = async (waitingAreaID, appointmentid, patientID, status, startDateTime, endDateTime, providerID) => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        try {
            const formData = {
                waitingAreaID: waitingAreaID,
                status: status
            }
            await dispatch(PatientAppointmentEngagedCompleted(formData)).unwrap();
            const formDataForProvider = {
                clinicID: user.clinicID,
                showAllProviders: true,
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            };

            const formDataForAppointmentList = {
                clinicID: user.clinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 10,
                startDate: startDate,
                endDate: endDate,
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: "",
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            };
            await dispatch(fetchAppointments({ formDataForProvider, formDataForAppointmentList })).unwrap();
            readData();
        } catch (error) {
            // console.log(error);
        }
    }
    // const changeAppointmentState = async (appointmentid, patientID, status, startDateTime, endDateTime, providerID) => {
    //     const userString = await AsyncStorage.getItem('user');
    //     const user = JSON.parse(userString);
    //     try {
    //         // const selectedAppointmentID = appointmentid;
    //         // const selectedPatientID = patientID;

    //         // console.log("Appointment ID:", selectedAppointmentID);
    //         // console.log("Patient ID:", selectedPatientID);
    //         // console.log("Start DateTime:", startDateTime);
    //         // console.log("End DateTime:", endDateTime);

    //         // Ensure the provided startDateTime is in the correct format
    //         const startDate = moment(startDateTime).format('YYYY-MM-DD');
    //         const todayDate = moment().format('YYYY-MM-DD');

    //         if (startDate !== todayDate) {
    //             alert("You can only edit today's appointments.");
    //             return;
    //         }

    //         // Format the time for logging/debugging purposes
    //         const time = moment(startDateTime).format('LT');
    //         console.log("Appointment Time:", time);

    //         // Determine the new status based on the current status
    //         const statusMap = {
    //             Scheduled: "Waiting",
    //             Waiting: "Engaged",
    //             Engaged: "Complete",
    //             Complete: "Complete",
    //             Missed: "Rescheduled",
    //         };

    //         const finalStatus = statusMap[status] || status;
    //         console.log("Final Status:", finalStatus);
    //         const formData = {
    //             selectedAppointmentID: appointmentid
    //         }
    //         dispatch(PatientAppointmentCheckIn(formData)).unwrap();
    //         const formDataForProvider = {
    //             clinicID: user.clinicID,
    //             showAllProviders: true,
    //             userClinicInfoID: "00000000-0000-0000-0000-000000000000"
    //         };

    //         const formDataForAppointmentList = {
    //             clinicID: user.clinicID,
    //             providerID: "00000000-0000-0000-0000-000000000000",
    //             searchTerm: "",
    //             searchBy: "",
    //             pageIndex: 0,
    //             pageSize: 10,
    //             startDate: startDate,
    //             endDate: endDate,
    //             recordCount: 0,
    //             userID: "00000000-0000-0000-0000-000000000000",
    //             status: "",
    //             userClinicInfoID: "00000000-0000-0000-0000-000000000000"
    //         };
    //         await dispatch(fetchAppointments({ formDataForProvider, formDataForAppointmentList })).unwrap();


    //     } catch (error) {
    //         console.error("Error updating appointment:", error.message);
    //     }

    // }
    const changeAppointmentState = async (appointmentid, patientID, status, startDateTime, endDateTime, providerID) => {
        const headers = await getHeaders();
        const selectedAppointmentID = appointmentid;
        //console.log("Appoitment ID", selectedAppointmentID);
        const selectedPatientID = patientID;
        ///console.log("Patient ID", selectedPatientID);
        // console.log("SDate", startDateTime);
        // console.log("EDate", endDateTime);
        //console.log("ProviderID", providerID);

        const startDate = moment(startDateTime).format('YYYY-MM-DD')

        if (startDate != moment().format('YYYY-MM-DD')) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'You can only edit today/s Appointment.',
                text2: 'Please select today/s date to continue.',
            });
            //alert('You can only edit today/s Appointment.');
            return
        } else {

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
                Axios.post(`${Api}Appointment/PatientAppointmentCheckIn?appointmentID=${selectedAppointmentID}`, {},
                    { headers }
                ).then(resp => {
                    //console.log(resp.data);
                    readData();
                });
            } catch (error) {
                // console.log(error);
            }
        }
    }
    const handleStatusWiseView = async (status) => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        try {
            //console.log('STSTUS', status);
            const formData =
            {
                clinicID: user.clinicID,
                providerID: "00000000-0000-0000-0000-000000000000",
                searchTerm: "",
                searchBy: "",
                pageIndex: 0,
                pageSize: 0,
                startDate: startDate,
                endDate: endDate,
                recordCount: 0,
                userID: "00000000-0000-0000-0000-000000000000",
                status: status,
                userClinicInfoID: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass AT APP. LIST', formData);
            dispatch(handleStatusWiseViewForAppointmentList(formData));
        } catch (error) {
            //console.log(error);
        }
    }
    const openMissedConfirmation = () => {
        setmodalAction(false);
        setconfirmationWindow(true);
    }
    const openMissedConfirmation1 = () => {
        setmodalAction(false);
        setconfirmationWindow1(true);
    }
    const openActionModal = (id, appID, mobileNumber, status) => {
        setmodalAction(!modalAction);
        // console.log(id, appID, mobileNumber,status);
        setSelectedPatientID(id);
        setSelectedAppointmentID(appID);
        setMobileNumber(mobileNumber);
        setappointmentStatus(status);
    }
    const missedAppointment = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const formData =
        {
            status: "Missed",
            appointmentID: SelectedAppointmentID,
            clinicID: user.clinicID,
            patientId: SelectedPatientID,
            lastUpdatedBy: user.userName,
            clinicName: user.clinicName,
            patientNotify: true
        }
        // console.log("Missed APP. formDate", formData);
        try {
            dispatch(UpdateAppointmentStatus(formData));
            readData();
            setconfirmationWindow(false);
        } catch (error) {
            //console.log(error.message);
        }
    }
    const openCancelConfirmation = () => {
        setconfirmationWindow1(false);
        setconfirmationWindow2(true);
    }
    const cancelAppointment = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        //console.log(SelectedAppointmentID);
        try {
            Axios.post(`${Api}Appointment/GetAppointmentByAppointmentID?AppointmentID=${SelectedAppointmentID}`, {}, { headers }).then(resp => {
                const myData = resp.data
                //console.log(myData, "CANCEL APPOINTMENT DATA");
                let patientName = resp.data.patientName;
                const [firstName, lastName] = patientName.split(" ");
                let formData = { ...myData }
                formData.status = "Cancelled"
                formData.cancelledBy = user.userName,
                    formData.cancellationReason = reason,
                    formData.patientFirstName = firstName,
                    formData.cancelledOn = moment().format('YYYY-MM-DDTHH:mm:ss.SS'),
                    formData.duration = null,
                    setconfirmationWindow2(false);
                setconfirmationWindow1(false);
                try {
                    Axios.post(`${Api}Appointment/InsertUpdateAppointmentInformation`, formData, { headers }).then(resp => {
                        //alert('Appointment cancelled successfully.',);
                        Toast.show({
                            type: 'success', // Match the custom toast type
                            text1: 'Appointment cancelled successfully.',
                            //text2: 'Please select today/s date to continue.',
                        });
                        setReason('');
                        readData();
                    })
                } catch (error) {
                    //console.log(error);
                }
            })
        } catch (error) {
            //console.log(error.message);
        }
    }
    const viewPatientDetails = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        let updatedUser = null;
        // Ensure the userProfileResponse contains the necessary data (email, mobileNo)
        if (user) {
            updatedUser = {
                ...user,
                patientID: SelectedPatientID,
                clinicID: user.clinicID

            };
            // console.log("updatedUser",updatedUser)

            // Save the updated user back to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            navigation.navigate('PatientDetails');
            setmodalAction(false);
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
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        const currentDate = selectedDate || (selectedDateType === 'start' ? startDate1 : endDate1);
        setShowPicker(false);
        setStartDate1(null);
        setEndDate1(null);
        setcustomDate1('');
        setcustomDate2('');
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
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData, { headers }).then(resp => {
                    //console.log('Appointments List', resp.data);
                    setAppointmentList(resp.data);
                });
            } catch (error) {
                // console.log(error.message);
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

    return (
        <>
            {isloading ? <Loader /> :

                <>

                    <Modal isOpen={confirmationWindow1} onClose={() => setconfirmationWindow1(false)}>
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                            <Modal.Body >
                                <VStack space={3}>
                                    <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to cancel this appointment ?</Text>
                                </VStack>
                            </Modal.Body>
                            <Modal.Footer>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => setconfirmationWindow1(false)}>
                                        <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                            <Text style={CommonStylesheet.ButtonText}>No</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => openCancelConfirmation()}>
                                        <View style={CommonStylesheet.buttonContainersave1}>
                                            <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                            <Modal.Body>
                                <VStack space={3}>
                                    <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to mark this appointment as missed ?</Text>
                                </VStack>
                            </Modal.Body>
                            <Modal.Footer>

                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { setconfirmationWindow1(false); }}>
                                        <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                            <Text style={CommonStylesheet.ButtonText}>No</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { missedAppointment(); }}>
                                        <View style={CommonStylesheet.buttonContainersave1}>
                                            <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Select Doctor</Text></Modal.Header>
                            <Modal.Body >
                                <VStack space={3}>
                                    <TouchableOpacity onPress={() => searchByDoctor('00000000-0000-0000-0000-000000000000', 'All Doctors')}>
                                        <HStack alignItems="center" marginBottom="11" >
                                            <Text style={{ fontFamily: "poppins-regular" }}>All Doctors</Text>
                                        </HStack><Divider />

                                    </TouchableOpacity>
                                    {drList.map(item => (
                                        <View key={item.providerName}>
                                            <TouchableOpacity onPress={() => searchByDoctor(item.providerID, item.providerName)}>
                                                <HStack alignItems="center"  marginBottom="11">
                                                    <Text style={{ fontFamily: "poppins-regular" }} >{item.providerName}</Text>
                                                </HStack><Divider />
                                            </TouchableOpacity>
                                        </View>
                                    ))}</VStack>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                    <Modal isOpen={modalViewType} onClose={() => setModalmodalViewType(false)}>
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Select View Type</Text></Modal.Header>
                            <Modal.Body >
                                <VStack space={3}>
                                    <View>
                                        <TouchableOpacity onPress={() => handleView('Day View')}>
                                            <HStack alignItems="center" marginBottom="11" >
                                                <Text style={{ fontFamily: "poppins-regular" }}>Day View</Text>
                                            </HStack><Divider />
                                        </TouchableOpacity>
                                    </View>
                                    <View >
                                        <TouchableOpacity onPress={() => handleView('Week View')}>
                                            <HStack alignItems="center" marginBottom="11" >
                                                <Text style={{ fontFamily: "poppins-regular" }}>Week View</Text> </HStack><Divider />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity s onPress={() => handleView('Month View')}>
                                            <HStack alignItems="center"  >
                                                <Text style={{ fontFamily: "poppins-regular" }}>Month View</Text>
                                            </HStack>
                                        </TouchableOpacity>
                                    </View>
                                    <View >
                                        {showPicker && (
                                            <DateTimePicker
                                                value={selectedDateType === 'start' ? new Date() : endDate1 || startDate1}
                                                mode="date"
                                                display="default"
                                                onChange={handleDateChange}
                                            />
                                        )}
                                        {/* <TouchableOpacity onPress={handlePress}>
                                <Text style={CommonStylesheet.Text}>Custom View</Text>
                            </TouchableOpacity> */}
                                    </View>

                                </VStack>

                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                    <Modal isOpen={modalAction} onClose={() => setmodalAction(false)} size="lg">

                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                            <Modal.Body>
                                <VStack space={3}>
                                    {appointmentStatus == "Scheduled" ?
                                        <TouchableOpacity onPress={() => openMissedConfirmation1()}>
                                            <HStack alignItems="center" style={{ marginBottom: 11 }} >
                                                <Text fontFamily="poppins-regular">Cancel Appointment</Text>
                                            </HStack><Divider />
                                        </TouchableOpacity> :
                                        <></>
                                    }


                                    <TouchableOpacity onPress={() => viewPatientDetails()}>
                                        <HStack alignItems="center" style={{ marginBottom: 11 }} >
                                            <Text fontFamily="poppins-regular">View Patient Details</Text>
                                        </HStack><Divider />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => openMissedConfirmation()}>
                                        <HStack alignItems="center" style={{ alignItems: 'center' }} >
                                            <Text fontFamily="poppins-regular">Mark As Missed</Text>
                                        </HStack>
                                    </TouchableOpacity>


                                    {/* <View style={{ margin: 10 }}>
                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <Text style={CommonStylesheet.Text}>Call</Text>
                            </TouchableOpacity>
                        </View> */}
                                    {/* <View style={{ margin: 10 }}>
                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <Text style={CommonStylesheet.Text}>Send SMS</Text>
                            </TouchableOpacity>
                        </View> */}

                                    {/* <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => Alert.alert('Work is in process...')}>
                                <Text style={CommonStylesheet.Text}>Reminder On Whats App</Text>
                            </TouchableOpacity>
                        </View> */}
                                    {/* <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => openMissedConfirmation()}>
                                <Text style={CommonStylesheet.Text}>Mark As Missed</Text>
                            </TouchableOpacity>
                        </View> */}
                                </VStack>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                    <Modal isOpen={confirmationWindow2} onClose={() => setconfirmationWindow2(false)}>
                        <Modal.Content >
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Cancellation Reason</Text></Modal.Header>
                            <Modal.Body >
                                <VStack space={3}>
                                    <Input
                                        placeholder="Cancellation Reason"
                                        style={Styles.inputPlaceholder}
                                        value={reason}
                                        onChangeText={value => setReason(value)}
                                    />
                                </VStack>
                            </Modal.Body>
                            <Modal.Footer>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => setconfirmationWindow2(false)}>
                                        <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                            <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => cancelAppointment()}>
                                        <View style={CommonStylesheet.buttonContainersave1}>
                                            <Text style={CommonStylesheet.ButtonText}>Update</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <ScrollView style={{ backgroundColor: '#f2f8ff' }}>
                        <SafeAreaView style={{ backgroundColor: '#f2f8ff' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: '#fff' }}>
                                <View style={Styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                        <Text style={{ fontSize: 16, color: 'white', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>{providerName}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: 1, backgroundColor: '#2196f3' }} />
                                {!keyParam ?
                                    <View style={[CommonStylesheet.ButtonText, Styles.buttonContainer]}>
                                        <TouchableOpacity onPress={() => {
                                            setModalmodalViewType(!modalViewType);
                                        }}>
                                            <Text style={{ fontSize: 16, color: 'white', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>{viewType}</Text>

                                        </TouchableOpacity>
                                    </View> :
                                    <View style={[CommonStylesheet.ButtonText, Styles.buttonContainer]}>
                                        {/* <TouchableOpacity onPress={() => {
                                            setModalmodalViewType(!modalViewType);
                                        }}> */}
                                            <Text style={{ fontSize: 16, color: 'white', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>Custom View</Text>

                                        {/* </TouchableOpacity> */}
                                    </View>
                                }
                            </View>
                            {customDate1 && customDate2 ?
                                <View>
                                    <View style={{ marginTop: 7, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={Styles.TextDate}>{moment(customDate1).format('DD-MMM-YYYY').toString()}   TO   {moment(customDate2).format('DD-MMM-YYYY').toString()}</Text>
                                    </View>
                                </View> :
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    {!keyParam ?
                                        <TouchableOpacity onPress={() => dateMinus()}>
                                            <Icon

                                                name="chevron-left"
                                                size={20}
                                                color={'#2196f3'}
                                                style={{ marginLeft: 20 }}
                                            />
                                        </TouchableOpacity> : <View></View>
                                    }
                                    {viewType === 'Week View' ? (
                                        <View style={{ marginTop: 7 }}>
                                            <Text style={Styles.TextDate}>
                                                {moment(startDate).format('DD-MMM-YYYY').toString()} TO {moment(endDate).format('DD-MMM-YYYY').toString()}
                                            </Text>
                                        </View>
                                    ) : viewType === 'Day View' && keyParam == null ? (
                                        <View style={{ marginTop: 7 }}>
                                            <Text style={Styles.TextDate}>{moment(startDate).format('DD-MMM-YYYY')}</Text>
                                        </View>
                                    ) : viewType === 'Month View' ? (
                                        <View style={{ marginTop: 7 }}>
                                            <Text style={Styles.TextDate}>{moment(startDate).format('MMMM YYYY')}</Text>
                                        </View>
                                    ) : keyParam ? (
                                        <View style={{ marginTop: 7 }}>
                                            <Text style={Styles.TextDate}>
                                                {moment(dashboardStartDate).format('DD-MMM-YYYY').toString()} TO {moment(dashboardEndDate).format('DD-MMM-YYYY').toString()}
                                            </Text>
                                        </View>
                                    ) : null}

                                    {!keyParam ?
                                        <TouchableOpacity onPress={() => datePlus()}>
                                            <Icon
                                                name="chevron-right"
                                                size={20}
                                                color={'#2196f3'}
                                                style={{ marginRight: 20 }}
                                            />
                                        </TouchableOpacity> : <View></View>
                                    }
                                </View>
                            }
                            {appointmentslist.length === 0 ? <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                                <Text style={Styles.Text}>There is no appointment scheduled. Please add new appointment by clicking (+) button.</Text>
                            </View> : appointmentslist && appointmentslist.map(item => item.getAllAppointmentInfoResultDTOList.map(item2 => (
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, }} key={item2.appointmentID}>

                                    <View style={[CommonStylesheet.borderforcardatAppointmentListScreen, { height: HeightSizePerScreen, alignSelf: 'center' }]} key={item2.appointmentID}>
                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                            <View style={{ paddingTop: 17, alignItems: 'center', marginLeft: 15, width: '20%', height: '100%' }}>
                                                <Image
                                                    source={require('../../assets/images/clock.png')}
                                                    alt="logo.png"
                                                    style={CommonStylesheet.imageofwatchatappointment}
                                                />
                                                {/* <Text style={CommonStylesheet.Text}>{moment(item2.startDateTime).subtract(utcOffsetMinutes, 'minutes').format('LT')}</Text>
                                        <Text style={CommonStylesheet.Text}>{moment(item2.endDateTime).subtract(utcOffsetMinutes, 'minutes').format('LT')}</Text> */}
                                                <Text style={CommonStylesheet.Text}>{moment(item2.startDateTime).format('LT')}</Text>
                                                <Text style={CommonStylesheet.Text}>{moment(item2.endDateTime).format('LT')}</Text>
                                                <View>
                                                    {item2.status == 'Engaged' ?
                                                        <TouchableOpacity
                                                            onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)} >
                                                            <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#bfa106', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                <Text style={Styles.Text1}>Engaged</Text></View></TouchableOpacity>

                                                        : ((item2.status == 'Completed') ?
                                                            <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)}>
                                                                <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                    <Text style={Styles.Text1}>Completed</Text></View></TouchableOpacity>
                                                            :
                                                            ((item2.status == 'Scheduled') ?
                                                                <TouchableOpacity onPress={() => changeAppointmentState(item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)}>
                                                                    <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#065695', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                        <Text style={Styles.Text1}>Scheduled</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                :
                                                                ((item2.status == 'Waiting') ?
                                                                    <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)} ><View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#383CC1', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}><Text style={Styles.Text1}>Waiting</Text></View></TouchableOpacity> :
                                                                    ((item2.status == 'Cancelled') ?
                                                                        <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)} >
                                                                            <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#A9A9A9', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                                <Text style={Styles.Text1}>Cancelled</Text></View>
                                                                        </TouchableOpacity> :
                                                                        <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item2.waitingAreaID, item2.appointmentID, item2.patientID, item2.status, item2.startDateTime, item2.endDateTime, item2.providerID)}><View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#da251d', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}><Text style={Styles.Text1}>Missed</Text></View></TouchableOpacity>))))}
                                                </View>
                                            </View>

                                            <View
                                                style={{

                                                    width: '40%',
                                                    flex: 1,
                                                    alignItems: 'flex-start',
                                                    marginTop: 20,
                                                    marginLeft: 40


                                                }}>
                                                <TouchableOpacity onPress={() => item2.status == 'Scheduled' ?
                                                    navigation.navigate('AddAppointments', {
                                                        appointmentID: item2.appointmentID,
                                                        patientID: item2.patientID,
                                                        key: 'Edit'

                                                    }) :

                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'You cannot edit an appointment ',
                                                        text2: 'Once the patient has entered the waiting area.',
                                                    })}>

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
                                                    {/* <Text style={CommonStylesheet.textPatientList}>
                                                {item2.startDateTime}      {item2.endDateTime}
                                            </Text> */}
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ width: 20, marginRight: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                                <TouchableOpacity onPress={() => {
                                                    openActionModal(item2.patientID, item2.appointmentID, item2.mobileNumber, item2.status)
                                                }}>
                                                    <Icon name="ellipsis-v" size={20} color={"#2196f3"} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )))}
                        </SafeAreaView>
                    </ScrollView>
                    <View style={{ marginTop: -15 }}>
                        <Fab renderInPortal={false} size={'md'} bgColor={"#2196f3"} icon={<Icon
                            name="plus"
                            size={10}//(22.5.2024)
                            color={"white"}
                        />} onPress={() => navigation.navigate('AddAppointments', {
                            key: 'Add'
                        })} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#DAEAF6' }}>
                        <TouchableOpacity onPress={() => handleStatusWiseView('')}>
                            <View style={Styles.containerBottom}>
                                <View style={Styles.countContainerall}>

                                    <Text style={Styles.textCount}>
                                        {appointmentCounts.allCount}
                                    </Text>

                                </View>
                                <Text style={Styles.textall}>All</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleStatusWiseView('Scheduled')}>
                            <View style={Styles.containerBottom}>
                                <View style={Styles.countContainerschedule}>
                                    <Text style={Styles.textCount}>
                                        {appointmentCounts.scheduledCount}
                                    </Text>
                                </View>
                                <Text style={Styles.textall}>Scheduled</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleStatusWiseView('Waiting')}>
                            <View style={Styles.containerBottom}>
                                <View style={Styles.countContainerwaiting}>
                                    <Text style={Styles.textCount}>
                                        {appointmentCounts.waitingCount}
                                    </Text>
                                </View>
                                <Text style={Styles.textall}>Waiting</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleStatusWiseView('Engaged')}>
                            <View style={Styles.containerBottom}>
                                <View style={Styles.countContainerengaged}>
                                    <Text style={Styles.textCount}>
                                        {appointmentCounts.engagedCount}
                                    </Text>
                                </View>
                                <Text style={Styles.textall}>Engaged</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleStatusWiseView('Completed')}>
                            <View style={Styles.containerBottom}>
                                <View style={Styles.countContainercomplete}>
                                    <Text style={Styles.textCount}>
                                        {appointmentCounts.completedCount}
                                    </Text>
                                </View>
                                <Text style={Styles.textall}>Complete</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleStatusWiseView('Missed')}>
                            <View style={Styles.containerBottom}>
                                <View style={Styles.countContainermissed}>
                                    <Text style={[Styles.textCount]}>
                                        {appointmentCounts.missedCount}
                                    </Text>
                                </View>
                                <Text style={Styles.textall}>Missed</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
            }
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
    header: {
        backgroundColor: '#2196f3',
        textAlign: 'center',
        paddingVertical: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        fontSize: 18,
        fontFamily: "poppins-bold"
    },
    CloseButton: {
        position: 'absolute',
        backgroundColor: '#da251d',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        top: 7,
        height: 25,
        width: 25
        // elevation: 2,
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
        color: '#2196f3',
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',

    },
    containerBottom: {
        width: width * 0.16,
        height: 60,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,

        marginBottom: 5
    },
    buttonContainer: {

        margin: 10,
        alignItems: 'stretch',
        borderWidth: 1,
        width: width * 0.45,
        height: 30,
        backgroundColor: '#2196f3',
        borderColor: '#1c80cf',//ujwala
        borderRadius: 5,
    },

    countContainerall: {
        width: 20,
        height: 20,
        backgroundColor: '#871565',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    countContainerschedule: {
        width: 20,
        height: 20,
        backgroundColor: '#065695',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    countContainerwaiting: {
        width: 20,
        height: 20,
        backgroundColor: '#383CC1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    countContainerengaged: {
        width: 20,
        height: 20,
        backgroundColor: '#bfa106',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    countContainercomplete: {
        width: 20,
        height: 20,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    countContainermissed: {
        width: 20,
        height: 20,
        backgroundColor: '#da251d',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },

    countContainer6: {
        width: 20,
        height: 20,
        backgroundColor: '#EF5354',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    textCount: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Poppins-Medium'
    },
    textall: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Poppins-Medium'
    },
    iconPhone: {
        marginLeft: 50,
        marginTop: 10
    },
    iconDot: {
        // marginRight: 15,
        // marginTop: 10
    },
    Text1: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Poppins-Medium',
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed

    },
    TextDate: {
        fontSize: 16,
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
    Text: {
        fontSize: regularFontSize,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular',
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
        padding: 10,//(22.5.2024)
        textAlign: 'center'

    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#A6A6A6',
        backgroundColor: '#FFFFFF',
    },
})

export default Appointment;