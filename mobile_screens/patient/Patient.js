import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, FlatList, StyleSheet, Dimensions, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
    FormControl,
    Input,
    Text,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    Image,
    Fab,
    Modal,
    HStack,
    NativeBaseProvider,
    Actionsheet,
    Divider

} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import DotMenus from "../../components/DotMenus";
const { height, width } = Dimensions.get('window');
import { useNavigation, useIsFocused, useFocusEffect, CommonActions } from "@react-navigation/native";
import Axios from "axios";
import Api from "../../api/Api";
import { Searchbar } from "react-native-paper";
//import Snackbar from 'react-native-snackbar';
import Loader from "../../components/Loader";
import moment from "moment";
import randomcolor from 'randomcolor';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { GetPatientsByClinicAndFilters, updatePageIndex, setQuery, searchPatients, resetPatientList, DeletePatient } from "../../features/patientsSlice";
import Toast from "react-native-toast-message";
import { debounce } from "lodash";
const searchbarColor = '#2196F3';
const HeightSizePerScreen = width < 600 ? 110 : 140;
const secondaryCardHeader = Math.min(width, height) * 0.04;
const regularFontSize = width < 600 ? 12 : 18;


const Patient = ({ route }) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.patient.patientList);
    // console.log("patients",data);
    const { pageIndex, pageSize, query, } = useSelector((state) => state.patient); // Access from Redux
    const { Searchby, startDate, endDate, clinicID } = route.params;
    // console.log(Searchby, startDate, endDate);
    const myKey = route.params.key;
    //console.log('Mykey', myKey);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [reloading, setReloading] = useState(false); // For reloading data
    const [selectedPatient, setSelectedPatient] = useState('');
    const [modalViewType, setModalmodalViewType] = useState(false);
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    //passing name to appointment screen
    const [name, setpatientName] = useState(null);
    //handle mobile number in modal
    const [MobileNumber, setMobileNumber] = useState('');
    //search query functionality
    // const [query, setQuery] = useState('');
    const [myclinicID, setstoredClinicID] = useState('');

    const readData = async () => {
        dispatch(setQuery('')); // Update query in Redux
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        //console.log("PatientList",user);
        const selectedClinicID = user.clinicID;
        //console.log("selectedClinicID",selectedClinicID);
        // console.log("TOKEN AT PATIENT LIST", token);
        setstoredClinicID(selectedClinicID);
        // setpageIndex(0);
        //setData([]);
        try {
            dispatch(resetPatientList());
            let formData = {};
            // console.log("Searchby", Searchby)
            if (Searchby) {
                formData = {
                    clinicID: selectedClinicID,
                    startDate: endDate,
                    endDate: startDate,
                    modeofpayment: "All",
                    Searchby: Searchby,
                    pageIndex: 0,
                    pageSize: 10,
                };
            } else {
                formData = {
                    clinicID: selectedClinicID,
                    startDate: startDate,
                    endDate: endDate,
                    modeofpayment: "All",
                    Searchby: "AllPatients",
                    pageIndex: 0,
                    pageSize: 10,
                };
            }
            //console.log(formData);
            const resultAction = await dispatch(GetPatientsByClinicAndFilters(formData));
            if (GetPatientsByClinicAndFilters.fulfilled.match(resultAction)) {
                //console.log('Data:', resultAction.payload);
                //setData(resultAction.payload);
            } else {
                console.error('Error:', resultAction.payload);
            }
        } catch (error) {
            console.error(error);
            //navigation.navigate('Login');
        } finally {
            setLoading(false);
        }
    };
    const debouncedReadData = debounce(() => {
        readData();
    }, 500);
    useFocusEffect(
        useCallback(() => {
            dispatch(resetPatientList());
            setLoading(true);
            debouncedReadData();
            return () => {
                debouncedReadData.cancel();
            };
        }, [Searchby, startDate, endDate, myKey])
    );

    const onLoadMore = async () => {
        const newPageIndex = pageIndex + 1;
        let formData = {}
        if (Searchby) {
            formData = {
                clinicID: myclinicID,
                startDate: endDate,
                endDate: startDate,
                modeofpayment: "All",
                Searchby: Searchby,
                pageIndex: newPageIndex,
                pageSize: pageSize,
                patientName: query,
            }
        } else {
            formData = {
                clinicID: myclinicID,
                startDate: startDate,
                endDate: endDate,
                modeofpayment: "All",
                Searchby: "AllPatients",
                pageIndex: newPageIndex,
                pageSize: pageSize,
                patientName: query,
            }
        }

        try {
            const resultAction = await dispatch(GetPatientsByClinicAndFilters(formData));

            if (GetPatientsByClinicAndFilters.fulfilled.match(resultAction)) {
                const myData = resultAction.payload;
                if (myData.length === 0) {
                    // No more data, revert the page index
                    dispatch(updatePageIndex(pageIndex));
                } else {
                    // Successfully fetched data, update the page index
                    dispatch(updatePageIndex(newPageIndex));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (searchQuery) => {
        let formData = {}
        if (Searchby) {
            formData = {
                clinicID: myclinicID,
                startDate: endDate,
                endDate: startDate,
                modeofpayment: "All",
                searchby: Searchby,
                patientName: searchQuery,
                pageIndex: 0,
                pageSize: 10,
            }
        } else {
            formData = {
                clinicID: myclinicID,
                startDate: startDate,
                endDate: endDate,
                modeofpayment: "All",
                searchby: Searchby,
                patientName: searchQuery,
                pageIndex: 0,
                pageSize: 10,
            }
        }
        dispatch(setQuery(searchQuery));
        if (searchQuery.length === 0) {

            dispatch(searchPatients(formData));
        } else if (searchQuery.length > 2) {

            dispatch(searchPatients(formData));
        }
    };

    const onSelectingpatient = async (id, name) => {
        //console.log("myKey",myKey)
        // console.log("patientID", id, name);
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        let updatedUser = null;
        if (user) {
            updatedUser = {
                ...user,
                patientID: id,
            };

            // Save the updated user back to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }

        if (myKey == 'selectPatientViaAppointment' || myKey == 'addpatientviaappointment') {
            navigation.navigate('AddAppointments', {
                patientID: id,
                clinicID: myclinicID,
                patientName: name
            })
        } else {
            navigation.navigate('PatientDetails', {
                patientID: id,
                clinicID: myclinicID
            })
        }
    }

    const deletePatient = async () => {
        setLoading(true); // Start loading
        const formData = {
            patientID: selectedPatient,
            rowguid: '00000000-0000-0000-0000-000000000000',
            lastUpdatedBy: null,
        };

        try {
            // Dispatch the action with formData as the payload
            const actionResult = await dispatch(DeletePatient(formData));

            if (DeletePatient.fulfilled.match(actionResult)) {
                // Show a success alert with the message from the payload
                //alert('Patient deleted successfully.');
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Patient deleted successfully.',
                });
                // Close modal and confirmation window
                setShowModal(false);
                setconfirmationWindow(false);

                // Set reloading to true before refreshing data
                setReloading(true);
                await readData(); // Wait for the data to refresh
            } else {
                // Handle the error response
                console.error('Error deleting patient:', actionResult.payload);
                alert('Failed to delete patient. Please try again.');
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('Error in deletePatient:', error);
            alert('An unexpected error occurred. Please try again later.');
        } finally {
            // Stop loading and reloading
            setLoading(false);
            setReloading(false);
        }
    };

    // const allPatient = () => {
    //     const formData = {
    //         clinicID: myclinicID,
    //         startDat: "2023-01-01",
    //         endDate: "2023-12-31",
    //         providerID: "",
    //         modeofpayment: "All",
    //         reportType: "",
    //         sortOrder: "",
    //         sortColumn: "",
    //         Searchby: "AllPatients",
    //         pageIndex: 0,
    //         pageSize: 0,
    //         communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
    //     }
    //    //console.log('Data To Pass', formData);
    //     try {
    //         Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData).then(resp => {
    //            //console.log('Patient List', resp.data);
    //             const newData = resp.data;
    //             setData(newData);
    //             setLoading(false);
    //             setModalmodalViewType(false);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // const Patientrecentlyvisitedwithdate = () => {
    //     const formData = {
    //         clinicID: myclinicID,
    //         startDat: "2023-01-01",
    //         endDate: "2023-12-31",
    //         providerID: "",
    //         modeofpayment: "All",
    //         reportType: "",
    //         sortOrder: "",
    //         sortColumn: "",
    //         Searchby: "Patientrecentlyvisitedwithdate",
    //         pageIndex: 0,
    //         pageSize: 0,
    //         communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
    //     }
    //     console.log('Data To Pass', formData);
    //     try {
    //         Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData).then(resp => {
    //             console.log('Patient List', resp.data);
    //             const newData = resp.data;
    //             setData(newData);
    //             setLoading(false);
    //             setModalmodalViewType(false);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const openModal = () => {
        //console.log("#####");
        setModalmodalViewType(true);
    }
    const handleView = (viewType) => {
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        const day = moment().format('YYYY-MM-DD').toString();
        //console.log('TODAY DATE', day);
        const myNextDate = moment(day).add(1, 'days').format('YYYY-MM-DD').toString();
        //console.log('NEXT DATE', myNextDate);
        //console.log(viewType);
        switch (viewType) {
            case 'Patientrecentlyvisitedwithdate':
                //console.log(viewType);
                const formData3 = {
                    clinicID: myclinicID,
                    startDate: day,
                    endDate: myNextDate,
                    providerID: "",
                    modeofpayment: "All",
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    Searchby: "Patientrecentlyvisitedwithdate",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData3);
                try {
                    Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData3, { headers: headers }).then(resp => {
                        //console.log('Patient List', resp.data);
                        const newData = resp.data;
                        if (newData.length > 0) {
                            //setData(newData);
                            setModalmodalViewType(false);
                        } else {
                            // setData(newData);
                            setModalmodalViewType(false);
                        }
                    });
                } catch (error) {
                    //console.log(error);
                }
                break;
            case 'Patientwithappointment':
                //console.log(viewType);
                const sDate = moment().format('YYYY-MM-DD');
                const eDate = moment(sDate).add(1, 'days').format('YYYY-MM-DD');
                const formData2 = {
                    clinicID: myclinicID,
                    providerID: "00000000-0000-0000-0000-000000000000",
                    patientName: "",
                    patientCode: "",
                    otherSearchCondition: "",
                    pageIndex: 0,
                    pageSize: 10,
                    recordCount: 0,
                    sortColumn: "",
                    sortOrder: "",
                    searchAgentID: "00000000-0000-0000-0000-000000000000",
                    agentDetailsxml: "",
                    searchby: "Patientwithappoinment",
                    startDate: day,
                    endDate: day
                }
                //console.log('Data To Pass', formData2);
                try {
                    Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData2, { headers: headers }).then(resp => {
                        //console.log('Patient List', resp.data);
                        const newData = resp.data;
                        if (newData.length > 0) {
                            // setData(newData);
                            setModalmodalViewType(false);
                        } else {
                            //setData(newData);
                            setModalmodalViewType(false);
                        }
                    });
                } catch (error) {
                    //console.log(error);
                }
                break;
            case 'NewPatientregisteredTodaywithdate':
                //console.log(viewType);
                const formData1 = {
                    clinicID: myclinicID,
                    startDate: day,
                    endDate: myNextDate,
                    providerID: "",
                    modeofpayment: "All",
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    Searchby: "NewPatientregisteredTodaywithdate",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData1);
                try {
                    Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData1, { headers: headers }).then(resp => {
                        //console.log('Patient List', resp.data);
                        const newData = resp.data;
                        if (newData.length > 0) {
                            //setData(newData);
                            setModalmodalViewType(false);
                        } else {
                            // setData(newData);
                            setModalmodalViewType(false);
                        }
                    });
                } catch (error) {
                    //console.log(error);
                }
                break;
            case 'AllPatients':
                //console.log(viewType);
                const formData = {
                    clinicID: myclinicID,
                    startDate: "2023-01-01",
                    endDate: "2023-12-31",
                    providerID: "",
                    modeofpayment: "All",
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    Searchby: "AllPatients",
                    pageIndex: 0,
                    pageSize: 10,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData);
                try {
                    Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData, { headers: headers }).then(resp => {
                        //console.log('Patient List', resp.data);
                        const newData = resp.data;
                        if (newData.length > 0) {
                            //setData(newData);
                            setModalmodalViewType(false);
                        } else {
                            //setData(newData);
                            setModalmodalViewType(false);
                        }
                    });
                } catch (error) {
                    //console.log(error);
                }
                break;
            case 'Patientrecentregistered':
                //console.log(viewType);
                const sDate1 = moment().format('YYYY-MM-DD');
                const eDate1 = moment(sDate).subtract(7, 'days').format('YYYY-MM-DD');
                const formData4 = {
                    clinicID: myclinicID,
                    providerID: "00000000-0000-0000-0000-000000000000",
                    patientName: "",
                    patientCode: "",
                    otherSearchCondition: "",
                    pageIndex: 0,
                    pageSize: 10,
                    recordCount: 0,
                    sortColumn: "",
                    sortOrder: "",
                    searchAgentID: "00000000-0000-0000-0000-000000000000",
                    agentDetailsxml: "",
                    searchby: "Patientrecentregistered",
                    startDate: sDate1,
                    endDate: eDate1
                }
                //console.log('Data To Pass', formData4);
                try {
                    Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData4, { headers: headers }).then(resp => {
                        //console.log('Patient List', resp.data);
                        const newData = resp.data;
                        //setData(newData);
                        setModalmodalViewType(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                break;
            case 'TodaysBirthday':
                //console.log(viewType);
                setModalmodalViewType(false);
                break;

            default:
                break;
        }
    }
    const viewProfile = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        let updatedUser = null;
        // Ensure the userProfileResponse contains the necessary data (email, mobileNo)
        if (user) {
            updatedUser = {
                ...user,
                patientID: selectedPatient,

            };

            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            console.log("user",user)

            navigation.navigate('PatientDetails', {
                clinicID: myclinicID,
                //patientID: selectedPatient
            });
            setShowModal(false);
        }
    }
    const addAppointment = () => {
        //console.log(name);
        navigation.navigate('AddAppointments', {
            clinicID: myclinicID,
            patientID: selectedPatient,
            patientName: name
        });
        setShowModal(false)
    }
    const callNumber = (phoneNumber) => {
        //console.log(phoneNumber);
        Linking.openURL(`tel:${phoneNumber || MobileNumber}`);
    };
    const sendTextMessage = (message) => {
        const url = Platform.select({
            ios: `sms:${MobileNumber}&body=${encodeURIComponent(message)}`,
            android: `sms:${MobileNumber}?body=${encodeURIComponent(message)}`,
        });
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    //console.log('SMS is not supported on this device.');
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(error => console.log(error)
            );
    };
    // const sendWhatsAppMessage = () => {
    //     const phoneNumber = '1234567890'; // Replace with the recipient's phone number
    //     const message = 'Hello, this is a test message!'; // Replace with your desired message

    //     const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    //     Linking.openURL(url)
    //       .then(() => console.log('WhatsApp message sent successfully!'))
    //       .catch((error) => console.log('Error sending WhatsApp message: ', error));
    //   };
    const getRandomColor = () => {
        const color = randomcolor(); // Generate a random color
        return color;
    };
    const openMissedConfirmation = () => {
        setShowModal(false);
        setconfirmationWindow(true);
    }

    if (loading) {
        return <Loader />;
    }

    const renderItem = ({ item }) => (
        <View style={{ padding: 0 }}>
            <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to delete this record ?</Text>
                    </Modal.Body>
                    <Modal.Footer>



                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => { setconfirmationWindow(false) }}>
                                <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                    <Text style={CommonStylesheet.ButtonText}>No</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { deletePatient() }}>
                                <View style={CommonStylesheet.buttonContainersave1}>
                                    <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>

                            <TouchableOpacity onPress={() => viewProfile()}>
                                <HStack alignItems="center" marginBottom="11" >
                                    <Text fontFamily="poppins-regular">View Profile</Text>
                                </HStack><Divider />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => addAppointment()}>
                                <HStack alignItems="center" marginBottom="11" >
                                    <Text fontFamily="poppins-regular">Add Appointment</Text>
                                </HStack><Divider />
                            </TouchableOpacity>
                            {/* 
                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Request Consent Form</Text>
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() =>Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Call</Text>
                                </HStack>
                            </TouchableOpacity> 

                            <TouchableOpacity 
                            //onPress={() => sendTextMessage('Hello!!... We are from Dentee.com')}
                            onPress={() => Alert.alert('Work is in process...')}
                            >
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Send SMS</Text>
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Whatsapp Message</Text>
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Send Covid-19 consent SMS/Whatsapp</Text>
                                </HStack>
                            </TouchableOpacity>*/}

                            <TouchableOpacity onPress={() => openMissedConfirmation()}>
                                <HStack alignItems="center" >
                                    <Text fontFamily="poppins-regular">Delete Patient</Text>
                                </HStack>
                            </TouchableOpacity>

                            {/* <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Add to contacts address book</Text>
                                </HStack>
                            </TouchableOpacity> */}

                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            {/* <Actionsheet  isOpen={showModal} onClose={() => setShowModal(false)}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text fontSize="16" color="gray.500" _dark={{
            color: "gray.300"
          }}>
              Albums
            </Text>
          </Box>
          <Actionsheet.Item>Delete</Actionsheet.Item>
          <Actionsheet.Item isDisabled>Share</Actionsheet.Item>
          <Actionsheet.Item>Play</Actionsheet.Item>
          <Actionsheet.Item>Favourite</Actionsheet.Item>
          <Actionsheet.Item>Cancel</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet> */}

            {data == null ?
                <Text>No Record Found, Please Add New Patient by clicking (+) button below</Text> :


                <View style={CommonStylesheet.container}>
                    <View style={[CommonStylesheet.borderforcardatPatientListScreen, CommonStylesheet.shadow, { height: HeightSizePerScreen, justifyContent: 'center' }]} key={item.patientID}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            {
                                item.imagethumbnail != null ? (
                                    <Image
                                        source={{ uri: `data:image/png;base64,${item.imagethumbnail}` }}
                                        alt="logo.png"
                                        style={CommonStylesheet.imageatPatientScreen}
                                    />
                                ) : item.gender === "M" ? (
                                    <Image
                                        source={require('../../assets/images/Male.jpg')}
                                        alt="logo.png"
                                        style={CommonStylesheet.imageatPatientScreen}
                                    />
                                ) : item.gender === "F" ? (
                                    <Image
                                        source={require('../../assets/images/Female1.png')}
                                        alt="logo.png"
                                        style={CommonStylesheet.imageatPatientScreen}
                                    />
                                ) : (
                                    <Image
                                        source={require('../../assets/images/default.png')}
                                        alt="logo.png"
                                        style={CommonStylesheet.imageatPatientScreen}
                                    />
                                )
                            }
                            {/* <View >
                                <Image
                                    source={require('../../assets/images/Male.jpg')}
                                    alt="logo.png"
                                    style={CommonStylesheet.imageatPatientScreen} />
                            </View>
                            {/* <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', }}>
                                <Image
                                source={require('../../assets/images/human.png')}
                                alt="logo.png"
                                style={CommonStylesheet.imageatQualification}
                            />
                                {item.firstName && item.lastName ? (
                                    <View style={[styles.initialsContainer, { backgroundColor: getRandomColor() }]}>
                                        <Text style={styles.initialsText}>{`${item.firstName.charAt(0)}${item.lastName.charAt(0)}`}</Text>
                                    </View>
                                ) : <View style={[styles.initialsContainer, { backgroundColor: getRandomColor() }]}>
                                    <Text style={styles.initialsText}>{`${item.firstName.charAt(0)}`}</Text>
                                </View>}
                            </View> */}
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    marginLeft: 15,

                                }} key={item.patientID}>
                                <TouchableOpacity onPress={() => onSelectingpatient(item.patientID, item.patientName)}>
                                    <Text style={CommonStylesheet.headertext16}>
                                        {item.patientName}
                                    </Text>
                                    <Text style={CommonStylesheet.textPatientList1}>
                                        {item.mobileNumber}
                                    </Text>
                                    <Text style={CommonStylesheet.textPatientList1}>
                                        {item.patientCode}
                                    </Text>
                                    <Text style={CommonStylesheet.textPatientList1}>
                                        {item.emailAddress1}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{ marginRight: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                {/* <Icon style={[CommonStylesheet.iconstylePicture, styles.iconPhone]}
                                name="phone-volume"
                                onPress={() => Alert.alert('Work is in process...')}
                            >
                            </Icon> */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedPatient(item.patientID);
                                        setpatientName(item.patientName);
                                        setMobileNumber(item.mobileNumber)
                                        setShowModal(true)
                                    }}>
                                    <Icon name="ellipsis-v" size={20} color={"#2196f3"} />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            }
        </View >
    );
    return (
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            <View style={{ padding: 5 }}>
                <Searchbar
                    inputStyle={{ fontFamily: 'Poppins-Regular' }}
                    placeholder="Search"
                    iconColor={searchbarColor}
                    placeholderTextColor={searchbarColor}
                    onChangeText={handleSearch}
                    value={query}
                    style={{ backgroundColor: 'white', marginTop: 10 }}
                />
            </View>
            {/* <View>
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: -20, position: 'relative', bottom: 45 }}>

                    <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ClinicHome', {
                                    clinicID: myclinicID
                                })}>
                                <Icon
                                    name="home"
                                    size={22}
                                    color={'#576067'}
                                    style={{ paddingRight: 25, marginTop: 5 }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setModalmodalViewType(!modalViewType)}>
                                <Icon
                                    name="ellipsis-v"
                                    size={22}
                                    color={'#576067'}
                                    style={styles.iconDot}
                                />
                            </TouchableOpacity>

                        </View>
                    <TouchableOpacity onPress={() => setModalmodalViewType(!modalViewType)}>
                                <Icon
                                    name="ellipsis-v"
                                    size={22}
                                    color={'#576067'}
                                    style={styles.iconDot}
                                />
                            </TouchableOpacity>
                </View>
            </View> */}
            <Modal isOpen={modalViewType} onClose={() => setModalmodalViewType(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStylesheet.Text}>Search By</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <View style={{ margin: 10 }}>
                            <TouchableOpacity onPress={() => handleView('Patientrecentlyvisitedwithdate')}>
                                <Text style={CommonStylesheet.Text}>Patient Recently Visited</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => handleView('Patientwithappointment')}>
                                <Text style={CommonStylesheet.Text}>Patient With Appointment </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => handleView('Patientrecentregistered')}>
                                <Text style={CommonStylesheet.Text}>Recently Registred</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => handleView('AllPatients')}>
                                <Text style={CommonStylesheet.Text}>All Patients</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ margin: 10 }} onPress={() => navigation.navigate('BirthdayReport')}>
                                <Text style={CommonStylesheet.Text}>Todays Birthday</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                {loading || reloading ? (
                    <Loader />
                ) : data.length === 0 ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text style={styles.Text}>
                            No Record Found, Please Add New Patient by clicking (+) button below
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        style={{ marginTop: 10 }}
                        data={data}
                        keyExtractor={(item) => `${item.patientID}-${item.index}`}
                        renderItem={renderItem}
                        onEndReached={onLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loading && <Loader />}
                    />
                )}
            </View>
            <View>
                <Fab
                    bgColor={'#2196f3'}
                    renderInPortal={false} size={'md'} icon={<Icon
                        name="plus"
                        size={10}
                        color={"white"}
                    />} onPress={() =>
                        navigation.navigate('AddPatient', {
                            clinicID: myclinicID,
                            key: myKey,
                        })} />
            </View>
            {/* {query == '' ?
                <Button bgColor={'#2196f3'} onPress={() => onLoadMore()}>Load More</Button> :
                <View></View>
            } */}
        </View>
    );
};

const styles = StyleSheet.create({
    iconPhone: {
        marginRight: 10,
        marginTop: 10
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
    // iconDot: {
    //     marginRight: 20,
    //     marginTop: 10
    // },
    Text: {
        fontSize: regularFontSize,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular',
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
        padding: 10,//(22.5.2024)
        textAlign: 'center'

    },
    initialsContainer: {
        width: width * 0.07, // Adjust width based on screen width
        height: width * 0.07, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
        borderRadius: 50,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    initialsText: {
        fontSize: secondaryCardHeader,
        color: 'white',
        fontFamily: 'Poppins-Bold',
        marginTop: 5,
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed
    },
})

export default Patient;
