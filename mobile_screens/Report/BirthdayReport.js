import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions, Alert, Linking } from 'react-native';
import {
    Image,
    Select,
    Modal,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    HStack,
    Divider,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import { Searchbar, DataTable, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Loader from '../../components/Loader';
import Api from '../../api/Api';
import Axios from 'axios';
import { getHeaders } from '../../utils/apiHeaders';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
const { height, width } = Dimensions.get('window');
const regularFontSize = width < 600 ? 14 : 16;//jyo6

const BirthdayReport = () => {
    const today = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [dashboard, setDashboard] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [viewType, setviewType] = useState('');
    //Modals States
    const [modalVisible, setModalVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    //Loader
    const [loader, setLoader] = useState(false);
    //data-binding
    const [Birthday, setBirthdayReport] = useState([]);
    const [clinicID, setClinicID] = useState('');
    const [patientID, setPatientID] = useState('');
    //Year wise start date, end date calculations
    // const currentYear = moment().format('YYYY');
    // const startDate = moment(`${currentYear}-01-01`);
    // const endDate = moment(`${currentYear}-12-31`);
    //search bar 
    const [query, setQuery] = useState('');

    //Handing All dates at filter
    const [startDate, setstartDate] = useState(today);
    const [endDate, setendDate] = useState(today);
    const [selectedDateType, setSelectedDateType] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [customDate1, setCustomDate1] = useState('');
    const [customDate2, setCustomDate2] = useState('');
    const [viewForDate, setViewForDate] = useState('');
    const [token, setToken] = useState('');

    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setClinicID(user.clinicID);
        setLoader(true);
        const formData = {
            clinicID: user.clinicID,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate:moment(startDate).format('YYYY-MM-DD'),
            recordCount: 0,
            pageIndex: 0,
            pageSize: 0,
            sortOrder: "DOB",
            sortOrder: "DESC",
            sortColumn: ""
        }
        //console.log('Data To Pass Outsatnding Api', formData);
        try {
            Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData,{headers}).then(resp => {
               // console.log('Birthday Report', resp.data);
                setBirthdayReport(resp.data);
                setLoader(false);
            });
        } catch (error) {
           // console.log(error);
        }
    };
    useEffect(() => {
        readData()
    }, [isFocused]);
    const resetDate = () => {
        setstartDate('');
        setendDate('');
        setCustomDate1('');
        setCustomDate2('');
    }

    // const onChangeSearch = query => {
    //     console.log(query);
    //     const formData = {
    //         clinicID: clinicID,
    //         startDate: moment(startDate).format('YYYY-MM-DD'),
    //         endDate: moment(endDate).format('YYYY-MM-DD'),
    //         recordCount: 0,
    //         pageIndex: 0,
    //         pageSize: 0,
    //         sortColumn: null,
    //         sortOrder: null,
    //         treatmentStatus: 0,
    //         searchData: query,
    //         communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
    //     }
    //     console.log('Data To Pass Search Api', formData);
    //     setQuery(query);
    //     try {
    //         Axios.post(`${Api}Report/GetOutstandingBillforMobile`, formData).then(resp => {
    //             console.log('Outstanding Report After Search', resp.data);
    //             setOutstanding(resp.data);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }

    // };
    const openModal = (id) => {
       // console.log("PATIENTID", id);
        setPatientID(id);
        setShowModal(true);
    }
    const viewPatientDetails = () => {
        navigation.navigate('PatientDetails', {
            patientID: patientID
        })
    }

    const handleViewForDate = async (ViewForDate) => {
        const headers = await getHeaders();
        setViewForDate(ViewForDate);
        switch (ViewForDate) {
            case "Day View":
                resetDate()
                const todayDate = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
                setstartDate(todayDate);
                //console.log(ViewForDate);
                setLoader(true);
                const formData = {
                    clinicID: clinicID,
                    startDate: moment(todayDate).format('YYYY-MM-DD'),
                    endDate:moment(todayDate).format('YYYY-MM-DD'),
                    recordCount: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    sortOrder: "DOB",
                    sortOrder: "DESC",
                    sortColumn: ""
                }
               // console.log('Data To Pass Birthday Api', formData);
                try {
                    Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData,{headers}).then(resp => {
                       // console.log('Birthday Report', resp.data);
                        setBirthdayReport(resp.data);
                        setLoader(false);
                    });
                } catch (error) {
                   // console.log(error);
                }
                setModalVisible(false)

                break;

            case "Week View":
               // console.log(ViewForDate);
                const today = moment();
                const weekStart = today.clone().startOf('week');
                const weekEnd = today.clone().endOf('week');
                const formattedWeekStart = weekStart.format('YYYY-MM-DD').toString();
                const formattedWeekEnd = weekEnd.format('YYYY-MM-DD').toString();
                setstartDate(formattedWeekStart);
                setendDate(formattedWeekEnd);
               // console.log(formattedWeekStart, formattedWeekEnd);
                setLoader(true);
                const formData1 = {
                    clinicID: clinicID,
                    startDate: formattedWeekStart,
                    endDate: formattedWeekEnd,
                    recordCount: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    sortOrder: "DOB",
                    sortOrder: "DESC",
                    sortColumn: ""
                }
                //console.log('Data To Pass BirhDay Api', formData1);
                try {
                    Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData1,{headers}).then(resp => {
                        //console.log('Birthday Report', resp.data);
                        setBirthdayReport(resp.data);
                        setLoader(false);
                    });
                } catch (error) {
                   // console.log(error);
                }
                setModalVisible(false)

                break;
            case "Month View":
                resetDate();
               // console.log(ViewForDate);
                const currentMonth = moment(startDate).tz("Asia/Kolkata").format('MMMM YYYY');
                //console.log("Month", currentMonth);
                const startOfMonth = moment(currentMonth, 'MMMM YYYY').tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
                const endOfMonth = moment(currentMonth, 'MMMM YYYY').tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
               // console.log(startOfMonth, endOfMonth);
                setstartDate(startOfMonth);
                setendDate(endOfMonth);
                setLoader(true);
                const formData2 = {
                    clinicID: clinicID,
                    startDate: startOfMonth,
                    endDate: endOfMonth,
                    recordCount: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    sortOrder: "DOB",
                    sortOrder: "DESC",
                    sortColumn: ""
                }
               // console.log('Data To Pass BirhDay Api', formData2);
                try {
                    Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData2,{headers}).then(resp => {
                        //console.log('Birthday Report', resp.data);
                        setBirthdayReport(resp.data);
                        setLoader(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false)
                break;
            default:
                break;
        }

    }
    const datePlus = async () => {
        const headers = await getHeaders();
        if (viewForDate == "Day View" || viewForDate == '') {
            const nextDate = moment(startDate).tz("Asia/Kolkata").add(1, 'days').format('YYYY-MM-DD').toString();
            setstartDate(nextDate);
            //console.log(nextDate);
            const formData = {
                clinicID: clinicID,
                startDate: nextDate,
                endDate: nextDate,
                recordCount: 0,
                pageIndex: 0,
                pageSize: 0,
                sortOrder: "DOB",
                sortOrder: "DESC",
                sortColumn: ""
            }
           // console.log('Data To Pass BirhDay Api', formData);
            try {
                Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData,{headers}).then(resp => {
                    //console.log('Birthday Report', resp.data);
                    setBirthdayReport(resp.data);
                    setLoader(false);
                });
            } catch (error) {
                console.log(error);
            }
        }

        if (viewForDate == "Week View") {
           // console.log(startDate, endDate);
            const nextWeekSDate = moment(endDate, 'YYYY-MM-DD').tz("Asia/Kolkata").add(1, 'day').format('YYYY-MM-DD').toString();
            const nextWeekEDate = moment(endDate, 'YYYY-MM-DD').tz("Asia/Kolkata").add(6, 'day').format('YYYY-MM-DD').toString();
           // console.log(nextWeekSDate, nextWeekEDate);
            setstartDate(nextWeekSDate);
            setendDate(nextWeekEDate);
            const formData = {
                clinicID: clinicID,
                startDate: nextWeekSDate,
                endDate: nextWeekEDate,
                recordCount: 0,
                pageIndex: 0,
                pageSize: 0,
                sortOrder: "DOB",
                sortOrder: "DESC",
                sortColumn: ""
            }
           // console.log('Data To Pass BirhDay Api', formData);
            try {
                Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData,{headers}).then(resp => {
                   // console.log('Birthday Report', resp.data);
                    setBirthdayReport(resp.data);
                    setLoader(false);
                });
            } catch (error) {
               // console.log(error);
            }
        }

        if (viewForDate == "Month View") {
            const nextMonth = moment(startDate).tz("Asia/Kolkata").add(1, 'month').format('MMMM YYYY');
            //console.log("Month", nextMonth);
            const startOfMonth = moment(nextMonth, 'MMMM YYYY').tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
            const endOfMonth = moment(nextMonth, 'MMMM YYYY').tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
           // console.log(startOfMonth, endOfMonth);
            setstartDate(startOfMonth);
            setendDate(endOfMonth);
            const formData = {
                clinicID: clinicID,
                startDate: startOfMonth,
                endDate: moment(endOfMonth).add(1, 'day').format('YYYY-MM-DD'),
                recordCount: 0,
                pageIndex: 0,
                pageSize: 0,
                sortOrder: "DOB",
                sortOrder: "DESC",
                sortColumn: ""
            }
           // console.log('Data To Pass BirhDay Api', formData);
            try {
                Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData,{headers}).then(resp => {
                 //   console.log('Birthday Report', resp.data);
                    setBirthdayReport(resp.data);
                    setLoader(false);
                });
            } catch (error) {
               // console.log(error);
            }
        }
    }
    const dateMinus = async() => {
        const headers = await getHeaders();
        if (viewForDate == "Day View" || viewForDate == '') {
            const backDate = moment(startDate).tz("Asia/Kolkata").subtract(1, 'days').format('YYYY-MM-DD').toString();
            setstartDate(backDate);
            //console.log(backDate);
            const formData = {
                clinicID: clinicID,
                startDate: backDate,
                endDate: backDate,
                recordCount: 0,
                pageIndex: 0,
                pageSize: 0,
                sortOrder: "DOB",
                sortOrder: "DESC",
                sortColumn: ""
            }
           // console.log('Data To Pass BirhDay Api', formData);
            try {
                Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData,{headers}).then(resp => {
                   // console.log('Birthday Report', resp.data);
                    setBirthdayReport(resp.data);
                    setLoader(false);
                });
            } catch (error) {
                //console.log(error);
            }

        }
        if (viewForDate == "Week View") {
           // console.log(startDate, endDate);
            const nextWeekSDate = moment(startDate, 'YYYY-MM-DD').tz("Asia/Kolkata").subtract(6, 'day').format('YYYY-MM-DD').toString();
            const nextWeekEDate = moment(startDate, 'YYYY-MM-DD').tz("Asia/Kolkata").subtract(1, 'day').format('YYYY-MM-DD').toString();
           // console.log(nextWeekSDate, nextWeekEDate);
            setstartDate(nextWeekSDate);
            setendDate(nextWeekEDate);
            const formData = {
                clinicID: clinicID,
                startDate: nextWeekSDate,
                endDate: nextWeekEDate,
                recordCount: 0,
                pageIndex: 0,
                pageSize: 0,
                sortOrder: "DOB",
                sortOrder: "DESC",
                sortColumn: ""
            }
            //console.log('Data To Pass BirhDay Api', formData);
            try {
                Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData,{headers}).then(resp => {
                    //console.log('Birthday Report', resp.data);
                    setBirthdayReport(resp.data);
                    setLoader(false);
                });
            } catch (error) {
               //console.log(error);
            }

        }
        if (viewForDate == "Month View") {
            const nextMonth = moment(startDate).tz("Asia/Kolkata").subtract(1, 'month').format('MMMM YYYY');
            //console.log("Month", nextMonth);
            const startOfMonth = moment(nextMonth, 'MMMM YYYY').tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
            const endOfMonth = moment(nextMonth, 'MMMM YYYY').tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
            //console.log(startOfMonth, endOfMonth);
            setstartDate(startOfMonth);
            setendDate(endOfMonth);
            const formData = {
                clinicID: clinicID,
                startDate: startOfMonth,
                endDate: moment(endOfMonth).add(1, 'day').format('YYYY-MM-DD'),
                recordCount: 0,
                pageIndex: 0,
                pageSize: 0,
                sortOrder: "DOB",
                sortOrder: "DESC",
                sortColumn: ""
            }
           // console.log('Data To Pass BirhDay Api', formData);
            try {
                Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData,{headers}).then(resp => {
                   // console.log('Birthday Report', resp.data);
                    setBirthdayReport(resp.data);
                    setLoader(false);
                });
            } catch (error) {
               // console.log(error);
            }

        }
    }
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || (selectedDateType === 'start' ? customDate1 : customDate2);
        setShowPicker(false);
        if (selectedDateType === 'start') {
            setCustomDate1(currentDate);
            setSelectedDateType('end');
            setShowPicker(true);
           // console.log(currentDate);
            const finalDate1 = moment(currentDate).format('YYYY-MM-DD').toString(); // Update the value of finalDate1
            setCustomDate1(finalDate1);
           // console.log("Final Date", finalDate1);
        } else {
            setSelectedDateType(null);
            //console.log(currentDate);
            const finalDate2 = moment(currentDate).format('YYYY-MM-DD').toString();
            setCustomDate2(finalDate2);
            //console.log("Final Date", finalDate2);
            setLoader(true);
            const formData = {
                clinicID: clinicID,
                startDate: moment(customDate1).format('YYYY-MM-DD').toString(),
                endDate: finalDate2,
                recordCount: 0,
                pageIndex: 0,
                pageSize: 0,
                sortOrder: "DOB",
                sortOrder: "DESC",
                sortColumn: ""
            }
           // console.log('Data To Pass BirhDay Api', formData);
            try {
                Axios.post(`${Api}Report/GetPatientBirthdayReport`, formData).then(resp => {
                    //console.log('Birthday Report', resp.data);
                    setBirthdayReport(resp.data);
                    setLoader(false);
                });
            } catch (error) {
                //console.log(error);
            }
            setstartDate(formData.startDate);
            setendDate(formData.endDate);
            setModalVisible(!modalVisible);
        }
    };

    const handlePress = () => {
        setViewForDate('Custom View');
        resetDate();
        if (!customDate1) {
            setSelectedDateType('start');
            setShowPicker(true);
        } else {
            setSelectedDateType('end');
            setShowPicker(true);
        }
    };
    return (
        <>
            {/* <View>
                <Searchbar
                    theme={{ colors: { primary: 'gray' } }}
                    placeholder="Search"
                    value={query}
                    onChangeText={onChangeSearch}
                    defaultValue='clear'
                    inputStyle={{
                        fontSize: 14,
                        color: '#5f6067',
                        fontFamily: 'Poppins-Regular'
                    }}
                />
            </View> */}
            {loader ? <Loader /> :
                <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                    <ScrollView>
                        <SafeAreaView style={Styles.container}>
                            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                                <View style={{ marginLeft: 10 }}>
                                    {viewForDate ?
                                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                            <View style={Styles.containerForView}>
                                                <Text style={Styles.headerText}>{viewForDate}</Text>
                                                <Icon
                                                    name="caret-down"
                                                    size={15}
                                                    color={'white'}
                                                />
                                            </View>
                                        </TouchableOpacity> : <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                            <View style={Styles.containerForView}>
                                                <Text style={Styles.headerText}>Select View</Text>
                                                <Icon
                                                    name="caret-down"
                                                    size={15}
                                                    color={'white'}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => dateMinus()}>
                                    <View>
                                        {!customDate1 && !customDate2 && (
                                            <Icon
                                                name="chevron-left"
                                                size={20}
                                                color={'#2196f3'}
                                                style={{ marginLeft: 15 }}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <View style={{ marginTop: 7 }}>
                                    {customDate1 && customDate2 ? (
                                        <View>
                                            <View style={{ marginTop: 7, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={Styles.TextDate}>
                                                    {moment(customDate1).format('DD-MMM-YYYY').toString()} TO {moment(customDate2).format('DD-MMM-YYYY').toString()}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <>
                                            {viewForDate === 'Week View' ? (
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={Styles.TextDate}>
                                                        {moment(startDate).format('DD-MMM-YYYY').toString()} - {moment(endDate).format('DD-MMM-YYYY').toString()}
                                                    </Text>
                                                </View>
                                            ) : viewForDate === 'Month View' ? (
                                                <Text style={Styles.TextDate}>
                                                    {moment(startDate).format('MMMM YYYY').toString()}
                                                </Text>
                                            ) : viewForDate === 'Day View' || viewForDate === '' || viewType === '' ? (
                                                <Text style={Styles.TextDate}>
                                                    {moment(startDate).format('DD-MMM-YYYY').toString()}
                                                </Text>
                                            ) : null}
                                        </>
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => datePlus()}>
                                    <View>
                                        {!customDate1 && !customDate2 && (
                                            <Icon
                                                name="chevron-right"
                                                size={20}
                                                color={'#2196f3'}
                                                style={{ marginRight: 15 }}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#e0e0e0', height: 50, marginLeft: 10, marginRight: 12 }}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginLeft: 12 }}>Name</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Case No</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>DOB</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Mobile No</Text>
                                    </View>
                                </View>
                                <View>
                                    {Birthday.length == 0 ?
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <Text style={CommonStylesheet.Text}> Data is not availble</Text>
                                        </View> :
                                        Birthday.map(item => (
                                            

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginTop: 10, height: 50, borderRadius: 5, marginLeft: 10, marginRight: 12, shadowColor: '#000', shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }} key={item.patientID}>

                                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginLeft: 12 }}>{item.firstName} {item.lastName}</Text>

                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>{item.patientCode}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}> {moment(item.dob).format('LL')}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize  }}>{item.mobileNumber}</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => openModal(item.patientID)}>
                                                    <View style={{ fontFamily: 'Poppins-Regular',  marginRight: 5, justifyContent: 'center', marginTop: 18 }}>
                                                        <Icon name='ellipsis-v'size={15} color={'#576067'}/>
                                                    </View>
                                                    </TouchableOpacity>
                                                </View>

                                            
                                        ))}
                                </View>
                            </View>
                        </SafeAreaView>
                    </ScrollView>
                </View>
            }
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{color:'white',fontFamily:'poppins-bold',fontSize:18}}>Select View</Text></Modal.Header>
                    <Modal.Body>
                    <VStack space={3}>
                        <TouchableOpacity onPress={() => handleViewForDate('Day View')} style={{ marginBottom: 9 }}>
                            <HStack alignItems="center" marginBottom={2}  >
                                <Text fontFamily='Poppins-Regular'>Day View</Text>
                            </HStack>
                            <Divider/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleViewForDate('Week View')} style={{ marginBottom: 9 }} >
                        <HStack alignItems="center" marginBottom={2} >
                                <Text fontFamily='Poppins-Regular'>Week View</Text>
                            </HStack>
                            <Divider/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleViewForDate('Month View')}>
                        <HStack alignItems="center"  >
                                <Text fontFamily='Poppins-Regular'>Month View</Text>
                            </HStack>
                        </TouchableOpacity>
                        </VStack>

                        {/* <View style={{ margin: 9 }}>
                            {showPicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                            <TouchableOpacity onPress={handlePress}>
                                <Text style={CommonStylesheet.Text}>Custom View</Text>
                            </TouchableOpacity>
                        </View> */}
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{color:'white',fontFamily:'poppins-bold',fontSize:18}}>Actions</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <HStack alignItems="center"  >
                                <Text fontFamily='Poppins-Regular'>Call</Text>
                            </HStack>
                            <Divider/>

                            <HStack alignItems="center" >
                                <Text fontFamily='Poppins-Regular'>Send Bithday SMS</Text>
                            </HStack>
                            <Divider/>

                            <HStack alignItems="center" >
                                <Text fontFamily='Poppins-Regular'>Send SMS</Text>
                            </HStack>
                            <Divider/>
                            <TouchableOpacity onPress={() => viewPatientDetails()}>
                                <HStack alignItems="center"  >
                                    <Text fontFamily='Poppins-Regular'>View Patient details</Text>
                                </HStack>
                            </TouchableOpacity>

                        </VStack>
                    </Modal.Body>

                </Modal.Content>
            </Modal>
        </>
    )
}

export default BirthdayReport;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // containerForStatus: {
    //     width: windowWidth,
    //     height: 40,
    //     backgroundColor: '#A9A9A9',
    //     marginVertical: 8,
    //     justifyContent: 'center',
    // },
    treatmentStatusText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15
    },
    containerForBal: {
        width: 150,
        height: 40,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    balText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    // containerForHeader: {
    //     width: windowWidth,
    //     height: 50,
    //     backgroundColor: '#e0e0e0',
    //     marginVertical: 8,
    //     justifyContent: 'space-between',
    //     flexDirection: 'row',
    //     alignItems: 'center'
    // },
    headerText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15,
        textAlign: 'center'
    },
    headerText1: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15,
    },
    // containerForSubHeader: {
    //     width: windowWidth,
    //      height: 50,
    //     backgroundColor: 'white',
    //     marginVertical: 8,
    //     justifyContent: 'space-between',
    //     flexDirection: 'row',
    //     alignItems: 'center'
    // },
    headerSubText: {
        fontSize: 16,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15,
    },
    headerSubText1: {
        fontSize: 16,
        color: '#2196f3',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15,
    },
    iconDot: {
        marginRight: 20
    },
    containerForView: {
        width: 140,
        height: 40,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    },
    TextDate: {
        fontSize: 16,
        color: '#2196f3',
        fontFamily: 'Poppins-Bold'
    },
    Text: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular',
        marginBottom:10,
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
    
      },
   
});




