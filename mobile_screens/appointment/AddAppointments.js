import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import {
    FormControl,
    Text,
    Input,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    Image,
    Modal,
    HStack, Fab,
    TextInput,
    Select,
    CheckIcon,
    Checkbox,

} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { SelectCountry } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
//import { Calendar, LocaleConfig } from 'react-native-calendars';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import Api from "../../api/Api";
import Axios from "axios";
const { height, width } = Dimensions.get('window');
import AsyncStorage from "@react-native-async-storage/async-storage";
//import Snackbar from 'react-native-snackbar';
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
const fontSize = Math.min(width, height) * 0.025; // Adjust the multiplier as per your requirement
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from "react-redux";
import { providerList, patientDetails } from "../../features/commonSlice";
import { InsertUpdateAppointmentInformation } from "../../features/appointmentSlice";
import { setProviderName } from "../../features/appointmentSlice";
import { getHeaders } from "../../utils/apiHeaders";
import Loader from "../../components/Loader";
import Toast from "react-native-toast-message";

const secondaryCardHeader = width < 600 ? 15 : 18;
const regularFontSize = width < 600 ? 15 : 18;
const primaryFontSize = width < 600 ? 17 : 22;
const ICON_SIZE = Math.min(width, height) * 0.04; // defined constant IconSize


const AddAppointments = ({ route }) => {
    const provider = useSelector((state) => state.common.providerList) || [];
    const getpatientInfo = useSelector((state) => state.common.patientDetails) || {};
    //console.log('getpatientInfo',getpatientInfo)
    const dispatch = useDispatch()
    const name = route.params.patientName || null;
    const AppointmentStatus = route.params.status || null;
    const key = route.params.key || 'Add';
    const paramkey = route.params.paramkey || '';
    const AppointmentID = route.params.appointmentID;
    const patientID = route.params.patientID;
    //console.log("key, ", key, paramkey, name, patientID);
    // console.log("myPatientID", myPatientID);
    // console.log("AppointmentID", AppointmentID);
    // console.log("myClinicID", myClinicID);
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [isDoctorChecked, setIsDoctorChecked] = useState(true);
    const [isPatientChecked, setIsPatientChecked] = useState(true);
    const [isNotify, setIsNotify] = useState(true);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [clinicPatient, setClinicPatient] = useState([]);
    const [providerInfo, setProviderInfo] = useState([]);
    // const [getpatientInfo, setGetpatientInfo] = useState({});
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedProvider, setSelectedProvider] = useState("");
    // const [selectedTime, setSelectedTime] = useState("09:00 AM");
    // const [selectedDuration, setSelectedDuration] = useState("15 Mins");
    // const [notes, setNotes] = useState("");
    const [patientName, setPatientName] = useState('');
    const [AppointmentByIDData, setAppointmentByID] = useState({});
    //const [provider, setProvider] = useState([]);
    const [providerName, setproviderName] = useState('');
    const [selectedDuration, setSelectedDuration] = useState("");
    const [notes, setNotes] = useState("");
    const [patientList, setpatientList] = useState([]);
    const [startDate, setstartDate] = useState(new Date());
    const [mypatientID, setpatientID] = useState('');
    const [PatientFullName, setPatientFullName] = useState('');
    const [patientPhone, setpatientPhone] = useState('');
    const [token, setToken] = useState('');
    const [mobile, setMobile] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [userName, setuserName] = useState('');
    const [selectedTime, setSelectedTime] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [myClinicID, setmyClinicID] = useState('');
    const [PatientDetails, setPatientDetails] = useState({});


    const readData = async () => {
        const headers = await getHeaders();
        setLoading(true);
        //console.log(key, paramkey, "paramkey");
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        // console.log(user, "User");
        if (patientID) {
            setpatientID(patientID);
        } else {
            setpatientID(user.patientID);
            setuserName(user.userName);
            setMobile(user.mobileNumber);
            setproviderName(user.name);
        }
        setSelectedPatient("");
        setSelectedProvider("");
        setSelectedTime("09:00 AM");
        setSelectedDuration("15 Mins");
        setNotes("");

        const formData =
        {
            applicationDTO: {
                clinicID: user.clinicID,
            }
        }
        const formData1 = {
            patientID: patientID,
        }

        try {
            dispatch(providerList(formData));
            const response = await dispatch(patientDetails(formData1));
            //console.log("readData",response.payload);
            setPatientDetails(response.payload);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        if (key == 'Edit' || paramkey == 'rescheduleAppointment') {
            setLoading(true);
            try {
                Axios.post(`${Api}Appointment/GetAppointmentByAppointmentID?AppointmentID=${AppointmentID}`, {}, { headers }).then(resp => {
                    //console.log("Get Appointment By AppointmentID", resp.data);
                    setpatientID(resp.data.patientID);
                    setPatientFullName(getpatientInfo.fullName);
                    setpatientPhone(getpatientInfo.mobileNumber);
                    setAppointmentByID(resp.data);
                    // console.log("START DATE", resp.data.startDateTime);
                    const myDate = moment(resp.data.startDateTime);
                    // console.log("myDate", myDate);
                    const time = myDate.format('hh:mm A');
                    // console.log("Time-String", time);
                    setSelectedTime(time);

                    const start = moment(resp.data.startDateTime);
                    const end = moment(resp.data.endDateTime);
                    const duration = moment.duration(end.diff(start));
                    const minutes = duration.asMinutes();
                    // console.log(`${minutes} Mins`);
                    setSelectedDuration(`${minutes} Mins`);
                    if (isNotify == true) {
                        setIsPatientChecked(true);
                        setIsDoctorChecked(true);
                    }
                    const {
                        providerName,
                        startDateTime,
                        comments,
                    } = resp.data;
                    setproviderName(providerName);
                    setstartDate(startDateTime);
                    setNotes(comments);
                    //console.log( providerName," providerName,");
                    setLoading(false);
                });
            } catch (error) {
                console.log(error.message);
            }
        }
    };
    useEffect(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        const availableTimeSlots = generateTimeSlots().map(slot => {
            const [slotHour, slotMinute] = slot.value.split(/[: ]/).slice(0, 2).map(Number);
            const slotPeriod = slot.value.split(' ')[1];

            let slot24Hour = slotHour;
            if (slotPeriod === 'PM' && slotHour !== 12) {
                slot24Hour += 12;
            } else if (slotPeriod === 'AM' && slotHour === 12) {
                slot24Hour = 0;
            }

            const isDisabled = slot24Hour < hours || (slot24Hour === hours && slotMinute < minutes);
            return { ...slot, isDisabled };
        });

        setTimeSlots(availableTimeSlots);
        const firstAvailableSlot = availableTimeSlots.find(slot => !slot.isDisabled);
        if (firstAvailableSlot) {
            setSelectedTime(firstAvailableSlot.value);
        }
        readData();
    }, [isFocused]);

    const addUpdateAppointment = async () => {
        setLoading(true);
        //console.log("UPDATE APP",PatientDetails);
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const headers = await getHeaders();
        let selectedProvider = provider.filter(item => item.providerName === providerName);
        // console.log("selectedProvider", selectedProvider,);
        if (
            (key === "Edit" && !getpatientInfo?.fullName) ||
            (key !== "Edit" && !name)
        ) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select patient',
                text2: 'Please select patient to continue.',
            });
            setLoading(false);
            return;
        }

        if (providerName == '' || selectedProvider.length == []) {
            //alert('Please select doctor');
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select doctor',
                text2: 'Please select doctor to continue.',
            });
            setLoading(false);
            return;
        }
        const selectedDateMoment = moment(date);
        const selectedTimeMoment = moment(selectedTime, 'hh:mm A');
        const combinedDateTime = selectedDateMoment
            .set({
                'hour': selectedTimeMoment.hour(),
                'minute': selectedTimeMoment.minute(),
                'second': 0, // Optionally, set seconds to 0
                'millisecond': 0 // Optionally, set milliseconds to 0
            });

        // Parse selected duration using Moment.js
        const durationInMinutes = parseInt(selectedDuration.match(/\d+/)[0]);
        //console.log('Duration in minutes:', durationInMinutes);

        // Calculate end datetime by adding duration
        const endDateTime = combinedDateTime.clone().add(durationInMinutes, 'minutes');
        // console.log('End DateTime:', endDateTime.format());
        const offsetMinutes = 330;
        let adjustedStartDateTime = moment(combinedDateTime).add(offsetMinutes, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        // Subtract the offset from endDateTime
        let adjustedEndDateTime = moment(endDateTime).add(offsetMinutes, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        // console.log("Adjusted Start DateTime:", adjustedStartDateTime);
        // console.log("Adjusted End DateTime:", adjustedEndDateTime);
        let isNotifyfinal = null;
        if (isPatientChecked == true || isDoctorChecked == true) {
            isNotifyfinal = true
        } else {
            isNotifyfinal = false
        }

        const formData = {
            patientID: mypatientID,
        }

        //console.log('Data To Pass', formData1);
        try {
            let formData2 = {};
            // console.log(key);

            if (key == 'Add' && paramkey == '') {

                formData2 = {
                    clinicID: user.clinicID,
                    appointmentID: "00000000-0000-0000-0000-000000000000",
                    patientID: mypatientID,
                    chairID: "00000000-0000-0000-0000-000000000000",
                    patientName: PatientDetails.fullName,
                    countryCode: "101",
                    patientPhone: PatientDetails.mobileNumber,
                    providerID: selectedProvider[0].providerID,
                    providerName: providerName,
                    startDateTime: moment(combinedDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), //adjustedStartDateTime,
                    endDateTime: moment(endDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), //adjustedEndDateTime,
                    comments: notes,
                    reminderDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    createdBy: user.userName,
                    lastUpdatedBy: user.userName,
                    status: "Scheduled",
                    arrivalTime: null,
                    operationTime: null,
                    completeTime: null,
                    waitTime: null,
                    isCreateForNewPatient: false,
                    patientTitle: PatientDetails.title,
                    patientFirstName: PatientDetails.firstName,
                    patientLastName: PatientDetails.lastName,
                    patientGender: PatientDetails.gender,
                    appointment: "00000000-0000-0000-0000-000000000000",
                    patientAge: 0,
                    patientNationality: null,
                    patientEmail: null,
                    isNotify: isNotifyfinal,
                    isNotifyPatient: isPatientChecked,
                    isNotifyDoctor: isDoctorChecked,
                    outPatientID: "00000000-0000-0000-0000-000000000000",
                    sDate: null,
                    eDate: null,
                    duration: durationInMinutes.toString(),
                    waitingAreaID: "00000000-0000-0000-0000-000000000000",
                    strTreatmentTypeID: null,
                    cancellationReason: null,
                    isNotesIncludeSms: false,
                    isAllowPatientPortalAccess: false,
                    isOnlineConsultation: false,
                    consultaioncharges: 0,
                    isOnlinePaymentLink: false,
                    paymentLinkId: "00000000-0000-0000-0000-000000000000",
                    isAllDay: false
                }
                //console.log("Add Apoointment", formData2);
            } else {
                // console.log("Selected Date", startDate);

                // Parse selected date using Moment.js
                const selectedDateMoment = moment(startDate);

                // Parse selected time using Moment.js
                const selectedTimeMoment = moment(selectedTime, 'hh:mm A');

                // Combine date and time
                const combinedDateTime = selectedDateMoment
                    .set({
                        'hour': selectedTimeMoment.hour(),
                        'minute': selectedTimeMoment.minute(),
                        'second': 0, // Optionally, set seconds to 0
                        'millisecond': 0 // Optionally, set milliseconds to 0
                    });

                // console.log('Combined DateTime:', combinedDateTime.format());

                // Calculate end datetime by adding duration
                const endDateTime = combinedDateTime.clone().add(parseInt(selectedDuration), 'minutes');
                // console.log('End DateTime:', endDateTime.format());
                const selectedPatientFirstName = AppointmentByIDData.patientName.split(" ")[0];
                // console.log(selectedPatientFirstName, 'selectedPatientFirstName');

                const offsetMinutes = 330;
                let adjustedStartDateTime = moment(combinedDateTime).add(offsetMinutes, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

                // Subtract the offset from endDateTime
                let adjustedEndDateTime = moment(endDateTime).add(offsetMinutes, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

                // console.log("Adjusted Start DateTime:", adjustedStartDateTime);
                // console.log("Adjusted End DateTime:", adjustedEndDateTime);

                //console.log(selectedPatientFirstName);
                formData2 = { ...AppointmentByIDData };
                if (paramkey == 'rescheduleAppointment') {
                    formData2.status = 'Rescheduled';
                    //formData2.status = 'Scheduled';
                    formData2.duration = selectedDuration.toString();
                    formData2.startDateTime = moment(combinedDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),//adjustedStartDateTime,
                        formData2.endDateTime = moment(endDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),//adjustedEndDateTime,
                        formData2.providerID = selectedProvider[0].providerID,
                        formData2.patientFirstName = selectedPatientFirstName.toString();
                    formData2.isNotify = isNotifyfinal;
                    formData2.comments = notes;
                    formData2.isNotifyPatient = isPatientChecked;
                    formData2.isNotifyDoctor = isDoctorChecked;
                } else {
                    formData2.duration = selectedDuration.toString();
                    formData2.startDateTime = moment(combinedDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),//adjustedStartDateTime,
                        formData2.endDateTime = moment(endDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),//adjustedEndDateTime,
                        formData2.providerID = selectedProvider[0].providerID,
                        formData2.providerName = selectedProvider[0].providerName,
                        formData2.patientFirstName = selectedPatientFirstName.toString();
                    formData2.isNotify = isNotifyfinal;
                    formData2.comments = notes;
                    formData2.isNotifyPatient = isPatientChecked;
                    formData2.isNotifyDoctor = isDoctorChecked;
                }
            }
            //console.log("Final Form Data", formData2);
            const resultAction = await dispatch(InsertUpdateAppointmentInformation(formData2));
            // console.log(resultAction.payload.resultInt);
            Toast.show({
                type: 'success', // Match the custom toast type
                text1: 'New appointment added successfully',
            });
            if (resultAction.payload.resultInt === -1) {
                if (paramkey == 'rescheduleAppointment') {
                    navigation.navigate('PatientAppointment', {
                        clinicID: myClinicID,
                        patientID: patientID

                    })
                } else {
                    navigation.navigate('Appointment', {
                        clinicID: myClinicID
                    })
                }
            } else {
                const errorMessage = resultAction.payload || "Failed to add appointment";
                console.error("Error during add appointment:", errorMessage);
                alert(errorMessage);
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }

    }

    const onChange = (day) => {
        const currentDate = day || date;
        // console.log(currentDate);
        // console.log("DAY", currentDate);
        setDate(currentDate);
        setstartDate(moment(currentDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
        setShow(false);
    };
    const showDatepicker = () => {
        setShow(true);
    };
    const generateTimeSlots = () => {
        const slots = [];
        const periods = ['AM', 'PM'];
        for (let i = 9; i <= 21; i++) {
            const period = i >= 12 ? 'PM' : 'AM';
            const hour = i % 12 === 0 ? 12 : i % 12;
            for (let j = 0; j < 60; j += 15) {
                const minute = j < 10 ? `0${j}` : j;
                slots.push({ label: `${hour}:${minute} ${period}`, value: `${hour}:${minute} ${period}` });
            }
        }
        return slots;
    };

    return (

        <>
            {loading ? <Loader /> :
                <>
                    <Modal isOpen={show} onClose={() => setShow(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Please select Date</Text></Modal.Header>
                            <Modal.Body>
                                <Calendar
                                    onChange={onChange}
                                    value={selectedDate}
                                    minDate={new Date()}
                                />
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                    <View style={[styles.formContainer, CommonStylesheet.backgroundimage]}>
                        <Stack space={2} w="100%" maxW="100%" mx="auto" margin={5}>
                            {
                                key === "Edit" ? (
                                    <Input
                                        size="lg"
                                        value={`${getpatientInfo.fullName}` || ""}
                                        placeholderTextColor={"#888888"}
                                        style={styles.inputFontStyle}
                                        readOnly
                                        borderRadius={5}
                                        placeholder="Select Patient"
                                    // onFocus={() => navigation.navigate('Patient', {
                                    //     clinicID: myClinicID,
                                    //     key: 'selectPatientViaAppointment'
                                    // })}
                                    />
                                ) : paramkey === "rescheduleAppointment" ? (
                                    <Input
                                        size="lg"
                                        value={`${getpatientInfo.fullName}` || ""}
                                        editable={false}
                                        placeholderTextColor={"#888888"}
                                        style={styles.inputFontStyle}
                                        borderRadius={5}
                                        placeholder="Select Patient"
                                    />
                                ) : (
                                    <View style={{ flexDirection: 'row' }}>
                                        <Input
                                            size="lg"
                                            value={name || ""}
                                            width={"92%"}
                                            borderRadius={5}
                                            placeholderTextColor={"#888888"}
                                            style={styles.inputFontStyle}
                                            placeholder="Select Patient"
                                            onFocus={() => navigation.navigate('Patient', {
                                                clinicID: myClinicID,
                                                key: 'selectPatientViaAppointment'
                                            })}
                                        />

                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('AddPatient', {
                                                clinicID: myClinicID,
                                                paramkey: 'addpatientviaappointment'
                                            })}
                                        >
                                            <Icon
                                                style={{ justifyContent: 'center', padding: 5, width: '10%' }}
                                                name="plus"
                                                size={ICON_SIZE}
                                                color={'#2196f3'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }

                            <View>
                                <Picker
                                    style={{
                                        width: '100%',
                                        height: height * 0.07,
                                        borderColor: "#e0e0e0",
                                        fontFamily: 'Poppins-Regular',
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    selectedValue={providerName}
                                    onValueChange={itemValue => setproviderName(itemValue)}>
                                    <Picker.Item label="Choose Doctor" value={null} color='black' />
                                    {provider.map(item => (
                                        <Picker.Item label={item.providerName} value={item.providerName} key={item.providerID} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                <Input
                                    onFocus={showDatepicker}
                                    width={"92%"}
                                    borderRadius={5}
                                    placeholderTextColor={"#888888"}
                                    style={styles.inputFontStyle}
                                    placeholder="Date of Appointment" value={moment(startDate).format('LL')} >

                                </Input>

                                {/* {show && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    onChange={onChange}
                                    style={styles.datePicker}
                                    minimumDate={new Date()}
                                />
                            )} */}

                                <View style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                                    <TouchableOpacity onPress={() => showDatepicker()}>
                                        <Image
                                            source={require('../../assets/images/calendarDash.png')} alt="logo.png"
                                            style={{ height: 34, width: 36, borderRadius: 5 }} />

                                    </TouchableOpacity>

                                </View>

                            </View>
                            <View>

                                <Picker
                                    selectedValue={selectedTime}
                                    style={{
                                        width: '100%',
                                        height: height * 0.07,
                                        borderColor: "#e0e0e0",
                                        fontFamily: 'Poppins-Regular',
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    onValueChange={itemValue => setSelectedTime(itemValue)}
                                // onValueChange={itemValue => {
                                //     const selectedSlot = timeSlots.find(slot => slot.value === itemValue);
                                //     if (!selectedSlot.isDisabled) {
                                //         setSelectedTime(itemValue);
                                //     }
                                // }}
                                >
                                    <Picker.Item label="Select Time" value={null} color='black' fontFamily={'Poppins-Regular'} />
                                    <Picker.Item label="08:00 AM" value="08:00 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="08:15 AM" value="08:15 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="08:30 AM" value="08:30 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="08:45 AM" value="08:45 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="09:00 AM" value="09:00 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="09:15 AM" value="09:15 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="09:30 AM" value="09:30 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="09:45 AM" value="09:45 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="10:00 AM" value="10:00 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="10:15 AM" value="10:15 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="10:30 AM" value="10:30 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="10:45 AM" value="10:45 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="11:00 AM" value="11:00 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="11:15 AM" value="11:15 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="11:30 AM" value="11:30 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="11:45 AM" value="11:45 AM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="12:00 PM" value="12:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="12:15 PM" value="12:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="12:30 PM" value="12:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="12:45 PM" value="12:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="01:00 PM" value="01:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="01:15 PM" value="01:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="01:30 PM" value="01:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="01:45 PM" value="01:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="02:00 PM" value="02:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="02:15 PM" value="02:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="02:30 PM" value="02:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="02:45 PM" value="02:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="03:00 PM" value="03:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="03:15 PM" value="03:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="03:30 PM" value="03:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="03:45 PM" value="03:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="04:00 PM" value="04:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="04:15 PM" value="04:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="04:30 PM" value="04:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="04:45 PM" value="04:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="05:00 PM" value="05:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="05:15 PM" value="05:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="05:30 PM" value="05:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="05:45 PM" value="05:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="06:00 PM" value="06:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="06:15 PM" value="06:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="06:30 PM" value="06:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="06:45 PM" value="06:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="07:00 PM" value="07:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="07:15 PM" value="07:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="07:30 PM" value="07:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="07:45 PM" value="07:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="08:00 PM" value="08:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="08:15 PM" value="08:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="08:30 PM" value="08:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="08:45 PM" value="08:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="09:00 PM" value="09:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="09:15 PM" value="09:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="09:30 PM" value="09:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="09:45 PM" value="09:45 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="10:00 PM" value="10:00 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="10:15 PM" value="10:15 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="10:30 PM" value="10:30 PM" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="10:45 PM" value="10:45 PM" style={styles.fontFamilyForSelectItem} />
                                    {/* 
                            {timeSlots.map(slot => (
                                <Picker.Item
                                    key={slot.value}
                                    label={slot.label}
                                    value={slot.value}
                                    color={slot.isDisabled ? 'gray' : 'black'}
                                    style={styles.fontFamilyForSelectItem}
                                />
                            ))} */}
                                </Picker>

                            </View>
                            <View>
                                <Picker
                                    selectedValue={selectedDuration}
                                    style={{
                                        width: '100%',
                                        height: height * 0.07,
                                        borderColor: "#e0e0e0",
                                        fontFamily: 'Poppins-Regular',
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}

                                    onValueChange={itemValue => setSelectedDuration(itemValue)}>
                                    <Picker.Item label="Select Duration" value={null} color='black' />
                                    <Picker.Item label="15 Mins" value="15 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="30 Mins" value="30 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="45 Mins" value="45 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="60 Mins" value="60 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="75 Mins" value="75 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="90 Mins" value="90 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="105 Mins" value="105 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="120 Mins" value="120 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="135 Mins" value="135 Mins" style={styles.fontFamilyForSelectItem} />
                                    <Picker.Item label="150 Mins" value="150 Mins" style={styles.fontFamilyForSelectItem} />
                                </Picker>
                            </View>

                            <View >

                                <Input
                                    size="lg"
                                    value={notes}
                                    onChangeText={(value) => setNotes(value)}
                                    style={styles.inputFontStyle}
                                    borderRadius={5}
                                    placeholderTextColor={"#888888"}
                                    placeholder="Add Notes" />
                                {/* <TouchableOpacity>
                                <Icon
                                    name="microphone"
                                    size={ICON_SIZE}
                                    color={'#2196f3'}
                                    style={{ marginTop: 15, marginRight: width * 0.1 }} />

                            </TouchableOpacity> */}
                            </View>

                            <View style={{ paddingHorizontal: 20 }}> {/* Add horizontal padding here */}
                                <Text style={{
                                    fontFamily: 'Poppins-Regular',
                                    alignSelf: 'flex-start',
                                    fontSize: secondaryCardHeader,
                                    lineHeight: Math.min(width, height) * 0.05,
                                }}>Reminder By SMS</Text>

                                <View style={{ marginTop: 10, flexDirection: 'row', }}>
                                    {/* The flexDirection row and justifyContent space-around center the checkboxes with spacing */}
                                    <Checkbox
                                        isChecked={isDoctorChecked}
                                        onChange={(newValue) => setIsDoctorChecked(newValue)}
                                    >
                                        <Text style={{
                                            fontSize: secondaryCardHeader,
                                            lineHeight: Math.min(width, height) * 0.05,
                                            fontFamily: 'Poppins-Regular'
                                        }}>Doctor</Text>
                                    </Checkbox>

                                    <Checkbox
                                        isChecked={isPatientChecked}
                                        onChange={(newValue) => setIsPatientChecked(newValue)}
                                        style={{ marginLeft: 10 }}
                                    >
                                        <Text style={{
                                            fontSize: secondaryCardHeader,
                                            lineHeight: Math.min(width, height) * 0.05,
                                            fontFamily: 'Poppins-Regular'
                                        }}>Patient</Text>
                                    </Checkbox>
                                </View>
                            </View>

                            <View style={{ alignSelf: "center" }}>
                                <TouchableOpacity onPress={() => addUpdateAppointment()}>
                                    <View style={CommonStylesheet.buttonContainersaveatForm}>
                                        <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </Stack>
                    </View>
                </>
            }
        </>

    );
};


const styles = StyleSheet.create({

    formContainer: {
        flex: 1,
        width: '100%',
        padding: 10,
        backgroundColor: '#f2f8ff'
    },
    dropdown: {
        margin: 16,
        height: 100,
        width: 340,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },


    ButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        alignSelf: 'center',
        justifyContent: 'center'
    },

    fontFamilyForSelectItem: {
        fontFamily: 'Poppins-Regular'
    },
    inputFontStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#fff',
        height: height * 0.07,
    },

    logo: {
        width: width * 0.08, // Adjust width based on screen width
        height: height * 0.08, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    }

})

export default AddAppointments; 