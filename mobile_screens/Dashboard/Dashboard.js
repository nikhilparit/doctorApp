import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, ImageBackground, Alert } from 'react-native';

import {
    FormControl,
    Input,
    Text,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    HStack,
    Image,
    Modal,
    Radio
} from 'native-base';
//common styles
import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import Api from "../../api/Api";
import moment from 'moment-timezone';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { GetDashboardDetail } from "../../features/dashboardSlice";
import Loader from "../../components/Loader";
import Toast from 'react-native-toast-message';

const secondaryCardHeader = width < 600 ? 13 : 18;
const ICON_SIZE = 25

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [dashbordCount, setDashbordCount] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState("");
    //handle Modal Dates
    const [viewType, setviewType] = useState('Today');
    const [date, setDate] = useState(new Date());
    const [nextDate, setNextDate] = useState('');
    const [startDate1, setStartDate1] = useState(null);
    const [endDate1, setEndDate1] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDateType, setSelectedDateType] = useState(null);
    const [customDate1, setcustomDate1] = useState('');
    const [customDate2, setcustomDate2] = useState('');
    const [myClinicID, setMyclinicID] = useState(null);
    //state for handing startdate and end date from calender
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const readData = async () => {
        resetData();
        setLoading(true);
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setMyclinicID(user.clinicID);
        //console.log('DASHBOARD',user);
        const todayDate = moment().format('YYYY-MM-DD').toString();
        setStartDate(todayDate);
        setEndDate(todayDate);

        const formData =
        {
            clinicID: user.clinicID,
            currentDate: todayDate,
            startDate: todayDate,
            endDate: todayDate,
            userClinicInfoID: "00000000-0000-0000-0000-000000000000"
        }
        //console.log('Data To Pass', formData);
        const resultAction = await dispatch(GetDashboardDetail(formData));
        if (GetDashboardDetail.fulfilled.match(resultAction)) {
            //console.log('Data:', resultAction.payload);
            setDashbordCount(resultAction.payload);
            setLoading(false);
        } else {
            console.error('Error:', resultAction.payload);
        }

    };
    useFocusEffect(
        useCallback(() => {
            readData();
            //console.log('Page is focused');

            return () => {
                resetData();
                //console.log('Page is unfocused');

            };
        }, [])
    );
    const resetData = () => {
        //setNextDate('');
        setStartDate1('');
        setEndDate1('');
        setcustomDate1('');
        setcustomDate2('');
        setStartDate('');
        setEndDate('');
    }

    const handleView = async (viewType) => {
        setviewType(viewType);
        resetData();
        let sDate, eDate;
        switch (viewType) {
            case "Today":
                sDate = moment().format('YYYY-MM-DD').toString();
                eDate = sDate; // Today’s date should be the same for both start and end
                break;
            case "Last7Days":
                eDate = moment().format('YYYY-MM-DD').toString();
                sDate = moment().subtract(6, 'days').format('YYYY-MM-DD').toString();
                break;
            case "Last30Days":
                eDate = moment().format('YYYY-MM-DD').toString();
                sDate = moment().subtract(30, 'days').format('YYYY-MM-DD').toString();
                break;
            case "Last90Days":
                eDate = moment().format('YYYY-MM-DD').toString();
                sDate = moment().subtract(90, 'days').format('YYYY-MM-DD').toString();
                break;
            default:
                return;
        }

        // Update UI state
        setStartDate(sDate);
        setEndDate(eDate);

        // Prepare API request
        const formData = {
            clinicID: myClinicID,
            currentDate: eDate,
            startDate: sDate,
            endDate: eDate,
            userClinicInfoID: "00000000-0000-0000-0000-000000000000"
        };

        // console.log('Data To Pass', formData);

        try {
            const resultAction = await dispatch(GetDashboardDetail(formData));
            if (GetDashboardDetail.fulfilled.match(resultAction)) {
                //console.log('Data:', resultAction.payload);
                setDashbordCount(resultAction.payload);
            } else {
                // console.error('Error:', resultAction.payload);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }

        // Close the modal
        setModalVisible(false);
    };


    const handlePress = () => {
        setStartDate1(null);
        setEndDate1(null);

        if (!startDate1) {
            setSelectedDateType('start');
            setShowPicker(true);
        } else {
            setSelectedDateType('end');
            setShowPicker(true);
        }
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
        if (selectedDateType === 'start') {
            setStartDate1(currentDate);
            setSelectedDateType('end');
            setShowPicker(true);
            //console.log(currentDate);
            const finalDate1 = moment(currentDate).format('YYYY-MM-DD').toString();
            setcustomDate1(finalDate1);
            setDate(finalDate1);
            // console.log("Final Date", finalDate1);
        } else {
            setEndDate1(currentDate);
            //console.log(currentDate);
            const finalDate2 = moment(currentDate).format('YYYY-MM-DD').toString();
            // console.log("Final Date", finalDate2);
            setcustomDate2(finalDate2);
            setNextDate(finalDate2);
            const currentDay = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
            // console.log("currentDay", currentDay);
            const formData3 =
            {
                clinicID: myClinicID,
                currentDate: currentDay,
                startDate: moment(startDate1).format('YYYY-MM-DD').toString(),
                endDate: finalDate2,
                userClinicInfoID: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
            //console.log('Data To Pass', formData3);
            try {
                Axios.post(`${Api}Clinic/GetDashboardDetailForMobile`, formData3, { headers }).then(resp => {
                    // console.log('Dashbord Details', resp.data);
                    setDashbordCount(resp.data);

                });
            } catch (error) {
                // console.log(error);
            }
            setModalVisible(false);
        }
    };
    return (
        <>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStylesheet.Text}>Select Filter</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <TouchableOpacity onPress={() => handleView('Today')} style={{ margin: 7 }}>
                            <Text style={CommonStylesheet.Text}>Today</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleView('Last7Days')} style={{ margin: 7 }}>
                            <Text style={CommonStylesheet.Text}>Last 7 days</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleView('Last30Days')} style={{ margin: 7 }}>
                            <Text style={CommonStylesheet.Text}>Last 30 days</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleView('Last90Days')} style={{ margin: 7 }}>
                            <Text style={CommonStylesheet.Text}>Last 90 days</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={handlePress} style={{ margin: 7 }}>
                            <Text style={CommonStylesheet.Text}>Between</Text>
                        </TouchableOpacity> */}
                        {showPicker && (
                            <DateTimePicker
                                value={selectedDateType === 'start' ? new Date() : endDate1 || startDate1}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setModalVisible(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                setModalVisible(false);
                            }}>
                                View
                            </Button>
                        </Button.Group>
                    </Modal.Footer> */}
                </Modal.Content>
            </Modal>
            {loading ? <Loader /> :
                <View>
                    <View style={{ backgroundColor: 'white', height: height * 0.065, width: width - 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {customDate1 && customDate2 ? (
                            <View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={Styles.TextDate}>
                                        {moment(customDate1).format('DD-MMM-YYYY').toString()} TO {moment(customDate2).format('DD-MMM-YYYY').toString()}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <>
                                {
                                    viewType === 'Today' ? (
                                        <Text style={Styles.TextDate}>
                                            {moment(startDate).format('DD-MMM-YYYY').toString()}
                                        </Text>
                                    ) :
                                        (viewType === 'Last90Days' || viewType === 'Last30Days' || viewType === 'Last7Days') ? (
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={Styles.TextDate}>
                                                    {moment(startDate).format('DD-MMM-YYYY').toString()} TO {moment(endDate).format('DD-MMM-YYYY').toString()}
                                                </Text>
                                            </View>
                                        ) : null
                                }
                            </>
                        )}

                        <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); }} >
                            <Image
                                source={require('../../assets/images/calendarDash.png')} alt="logo.png"
                                style={Styles.logo} />
                        </TouchableOpacity>

                    </View>

                    <View style={[Styles.formContainer, CommonStylesheet.backgroundimage]}>

                        <View style={Styles.container}>
                            <ScrollView>
                                <View>
                                    {viewType == 'Today' && startDate == endDate ?
                                        <TouchableOpacity
                                         onPress={() => navigation.navigate('Appointment', {
                                                dashboardStartDate: moment().format('YYYY-MM-DD').toString(),
                                                dashboardEndDate: moment().add(1, 'days').format('YYYY-MM-DD').toString(),
                                                keyParam: 'Dashboard'
                                        })}
                                        >
                                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 10 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                                name="calendar-day"
                                                                size={40}
                                                                color={"#2196f3"} >

                                                            </Icon>
                                                        </View>
                                                    </View>
                                                    <View style={CommonStylesheet.cardtextSettingScreen}>
                                                        <Text style={CommonStylesheet.dashboardText}>
                                                            Today's Appointments({dashbordCount.totalNoOfAppointmentToday})
                                                        </Text>
                                                    </View>

                                                    {/* <View style={CommonStylesheet.careticonatSettingScreen}>
                                                        <Icon style={CommonStylesheet.iconstylediscover}
                                                            name="chevron-right">
                                                        </Icon>
                                                    </View> */}
                                                </View>
                                            {/* <View
                                            style={{
                                                marginHorizontal: 20,
                                                marginTop: -10,
                                                flexDirection: 'row',
                                            }}>

                                        </View> */}
                                        </View>
                                         </TouchableOpacity> 
                                        :
                                        // <TouchableOpacity
                                        // onPress={() => navigation.navigate('Appointment', {
                                        //     dashboardStartDate: startDate,
                                        //     dashboardEndDate: moment(endDate).add(1, 'days').format('YYYY-MM-DD').toString(),
                                        //      keyParam: 'Dashboard'
                                        // })}
                                        // >

                                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 10 }]}>
                                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                <View style={CommonStylesheet.iconatSettingScreen}>

                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon style={CommonStylesheet.iconstylediscover}
                                                            name="address-card"
                                                            size={40}
                                                            color={"#2196f3"} >

                                                        </Icon>
                                                    </View>
                                                </View>

                                                <View style={CommonStylesheet.cardtextSettingScreen}>

                                                    <Text style={CommonStylesheet.dashboardText}>
                                                        No. of  Appointments ({dashbordCount.totalNoOfAppointmentToday})
                                                    </Text>

                                                </View>

                                                {/* <View style={CommonStylesheet.careticonatSettingScreen}>
                                                        <Icon style={CommonStylesheet.iconstylediscover}
                                                            name="chevron-right">
                                                        </Icon>
                                                    </View> */}
                                            </View>

                                            <View
                                                style={{
                                                    marginHorizontal: 20,
                                                    marginTop: -10,
                                                    flexDirection: 'row',
                                                }}>

                                            </View>
                                        </View>
                                        // </TouchableOpacity>
                                    }


                                    {viewType == 'Today' && startDate == endDate ? (
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Patient', {
                                                startDate: startDate,
                                                endDate: endDate,
                                                Searchby: 'NewPatientregisteredTodaywithdate'
                                            })}
                                            style={{ marginTop: 20 }}
                                        >
                                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 10 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                    <View style={CommonStylesheet.iconatSettingScreen}>
                                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon
                                                                style={CommonStylesheet.iconstylediscover}
                                                                name="user"
                                                                size={40}
                                                                color={"#2196f3"}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={CommonStylesheet.cardtextSettingScreen}>
                                                        <Text style={CommonStylesheet.dashboardText}>
                                                            New Patients Today ({dashbordCount.newPatient})
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginHorizontal: 20, marginTop: -10, flexDirection: 'row' }} />
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Patient', {
                                                startDate: endDate,
                                                endDate: startDate,
                                                Searchby: 'NewPatientregisteredTodaywithdate'
                                            })}
                                            style={{ marginTop: 20 }}
                                        >
                                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 10 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                    <View style={CommonStylesheet.iconatSettingScreen}>
                                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon
                                                                style={CommonStylesheet.iconstylediscover}
                                                                name="calendar-check"
                                                                size={40}
                                                                color={"#2196f3"}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={CommonStylesheet.cardtextSettingScreen}>
                                                        <Text style={CommonStylesheet.dashboardText}>
                                                            No. of new patients ({dashbordCount.newPatient})
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginHorizontal: 20, marginTop: -10, flexDirection: 'row' }} />
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {viewType == 'Today' && startDate == endDate ? (
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Patient', {
                                                startDate: startDate,
                                                endDate: endDate,
                                                Searchby: 'Patientrecentlyvisitedwithdate'
                                            })}
                                            style={{ marginTop: 20 }}
                                        >
                                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 10 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                    <View style={CommonStylesheet.iconatSettingScreen}>
                                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon
                                                                style={CommonStylesheet.iconstylediscover}
                                                                name="user"
                                                                size={40}
                                                                color={"#2196f3"}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={CommonStylesheet.cardtextSettingScreen}>
                                                        <Text style={CommonStylesheet.dashboardText}>
                                                            Patient Visited Today ({dashbordCount.totalVisitToday})
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginHorizontal: 20, marginTop: -10, flexDirection: 'row' }} />
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Patient', {
                                                startDate: endDate,
                                                endDate: startDate,
                                                Searchby: 'Patientrecentlyvisitedwithdate'
                                            })}
                                            style={{ marginTop: 20 }}
                                        >
                                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 10 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                    <View style={CommonStylesheet.iconatSettingScreen}>
                                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon
                                                                style={CommonStylesheet.iconstylediscover}
                                                                name="calendar-check"
                                                                size={40}
                                                                color={"#2196f3"}
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={CommonStylesheet.cardtextSettingScreen}>
                                                        <Text style={CommonStylesheet.dashboardText}>
                                                            No. of Patient Visited ({dashbordCount.totalVisitToday})
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginHorizontal: 20, marginTop: -10, flexDirection: 'row' }} />
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    <View style={{ marginTop: 20 }}>
                                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 10 }]}>
                                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                <View style={CommonStylesheet.iconatSettingScreen}>

                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon style={CommonStylesheet.iconstylediscover}
                                                            name="coins"
                                                            size={40}
                                                            color={"#2196f3"} >

                                                        </Icon>
                                                    </View>
                                                </View>

                                                <View style={CommonStylesheet.cardtextSettingScreen}>

                                                    <Text style={CommonStylesheet.dashboardText}>
                                                        Total Collection (₹ {dashbordCount.totalCollection} )
                                                    </Text>

                                                </View>

                                            </View>
                                            <View
                                                style={{
                                                    marginHorizontal: 20,
                                                    marginTop: -10,
                                                    flexDirection: 'row',
                                                }}>

                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20 }}>
                                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 10 }]}>
                                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                <View style={CommonStylesheet.iconatSettingScreen}>

                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon style={CommonStylesheet.iconstylediscover}
                                                            name="user-clock"
                                                            size={40}
                                                            color={"#2196f3"} >

                                                        </Icon>
                                                    </View>
                                                </View>

                                                <View style={CommonStylesheet.cardtextSettingScreen}>

                                                    <Text style={CommonStylesheet.dashboardText}>
                                                        Average Waiting Time ({dashbordCount.averageWaitingTime} Min)
                                                    </Text>

                                                </View>


                                            </View>


                                            <View
                                                style={{
                                                    marginHorizontal: 20,
                                                    marginTop: -10,
                                                    flexDirection: 'row',
                                                }}>

                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                    </View>
                </View>
            }
            <Toast />
        </>

    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 0,

    },
    dashboardText:
    {
        fontSize: 18,
        color: '#000',

        fontFamily: 'Poppins-SemiBold',
        // lineHeight: Math.min(width, height) * 0.05, 
    },
    formContainer: {
        flex: 1,
        width: '100%',
        padding: 10,
        backgroundColor: '#f2f8ff'
    },
    TextDate: {
        fontSize: secondaryCardHeader,
        color: '#2196f3',
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        // marginTop: 10,
        // marginLeft: 10,
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
    },
    logo: {
        width: width * 0.07, // Adjust width based on screen width
        height: height * 0.07, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
        margin: 5
    },
});


export default Dashboard;