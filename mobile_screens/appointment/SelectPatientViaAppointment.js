

import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, FlatList, StyleSheet, Dimensions, Alert } from 'react-native';
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

} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
//import DotMenus from "../Components/DotMenus";
const { height, width } = Dimensions.get('window');
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Axios from "axios";
import Api from "../../api/Api";
import { Searchbar } from "react-native-paper";
//import Snackbar from 'react-native-snackbar';
import Loader from "../../components/Loader";
import randomcolor from 'randomcolor';
import AsyncStorage from "@react-native-async-storage/async-storage";

const searchbarColor = '#2196F3';

const SelectPatientViaAppointment = ({ route }) => {
    const isFocused = useIsFocused();
    const [data, setData] = useState([]);
    const [pageIndex, setpageIndex] = useState(0);
    const [pageSize, setpageSize] = useState(6);
    const [loading, setLoading] = useState(false);
    const [search, setsearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [masterData, setmasterData] = useState([]);
    const [query, setQuery] = useState('');
    const [myclinicID,setClinicID] =useState('');
    const [token, setToken] = useState('');


    const readData = async () => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        setpageIndex(0);
        const myclinicID = await AsyncStorage.getItem('clinicID');
        setClinicID(myclinicID);
        setLoading(true);
        setQuery('');
        setLoading(true);
        setpageSize(6);
        const formData = {
            clinicID: myclinicID,
            startDat: "2023-01-01",
            endDate: "2023-12-31",
            providerID: "",
            modeofpayment: "All",
            reportType: "",
            sortOrder: "",
            sortColumn: "",
            Searchby: "AllPatients",
            pageIndex: 0,
            pageSize: pageSize,
            communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
        }
        console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData,{headers}).then(resp => {
                console.log('Patient List', resp.data);
                const newData = resp.data;
                setData(newData);
                setpageIndex(0);
                setpageSize(6);
                setLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        readData();
    }, [isFocused]);
    const onLoadMore = () => {
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        const newPageIndex = pageIndex + 1;
        console.log("NEW Page Index", newPageIndex);
        const formData = {
            clinicID: myclinicID,
            startDat: "2023-01-01",
            endDate: "2023-12-31",
            providerID: "",
            modeofpayment: "All",
            reportType: "",
            sortOrder: "",
            sortColumn: "",
            Searchby: "AllPatients",
            pageIndex: newPageIndex,
            pageSize: 6,
            communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000",
            patientName: query,
        };
    
        try {
            Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData,{headers}).then((resp) => {
                console.log("Patient List At Load More", resp.data);
                const myData = resp.data;
                if (myData.length === 0) {
                    setpageIndex(newPageIndex - 1);
                    return;
                } else {
                    // Append new data to the existing data array
                    setData((prevData) => [...prevData, ...myData]);
                    setpageIndex(newPageIndex);
                }
            });
        } catch (error) {
            //console.log(error);
        }
    };
    
    useEffect(() => {
        const delay = 1000;
        const debounce = setTimeout(() => {
            const headers = {
                'Content-Type': 'application/json',
                'AT': 'MobileApp',
                'Authorization': token
            };
            const formData = {
                clinicID: myclinicID,
                startDat: "2023-01-01",
                endDate: "2023-12-31",
                providerID: "",
                modeofpayment: "All",
                reportType: "",
                sortOrder: "",
                sortColumn: "",
                Searchby: "AllPatients",
                pageIndex: 0,
                pageSize: 6,
                communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000",
                patientName: query,
            };
            setQuery(query);
            try {
                Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData,{headers}).then((resp) => {
                    console.log("Patient After Search", resp.data);
                    const data = resp.data;
                    setData(data);
                    setpageIndex(0); // Reset pageIndex after the search
                });
            } catch (error) {
                //console.log(error);
            }
        }, delay);
        return () => {
            clearTimeout(debounce);
        };
    }, [query]);
    const onChangeSearch = query => {
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        console.log(query);
        if (query == "") {
            readData()
        }
        const formData = {
            clinicID: myclinicID,
            startDat: "2023-01-01",
            endDate: "2023-12-31",
            providerID: "",
            modeofpayment: "All",
            reportType: "",
            sortOrder: "",
            sortColumn: "",
            Searchby: "AllPatients",
            pageIndex: 0,
            pageSize: 0,
            communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000",
            patientName: query
        }
        console.log('Data To Pass @Search', formData);
        try {
            Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData,{headers}).then(resp => {
                console.log('Patient After Search', resp.data);
                const data = resp.data;
                setData(data);
            });
        } catch (error) {
            console.log(error);
        }

    };

    const onSelectingpatient = (id, name) => {
        console.log(id);
        console.log(myclinicID);
        navigation.navigate('AddAppointments', {
            patientID: id,
            clinicID: myclinicID,
            patientName: name
        })
    }

    const deletePatient = () => {
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        const formData = {
            patientID: selectedPatient,
            rowguid: '00000000-0000-0000-0000-000000000000',
            lastUpdatedBy: null
        }
        console.log(formData);

        try {
            Axios.post(`${Api}Patient/DeletePatient`, formData<{headers}).then(resp => {
                console.log(resp.data);
                // Snackbar.show({
                //     text: 'Patient deleted successfully..',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                // });
                alert('Patient deleted successfully.')
                setShowModal(false);
                readData();
            })
        } catch (error) {
            // Snackbar.show({
            //     text: 'Failed to deleted patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            alert('Failed to deleted patient.')
            console.log(error);
        }
    }
    const getRandomColor = () => {
        const color = randomcolor(); // Generate a random color
        return color;
    };

    const renderItem = ({ item }) => (

        <View style={{ padding: 0 }}>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header>Actions</Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center"  >
                                    <Text fontWeight="medium">View Profile</Text>
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Add Appointment</Text>
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Request Consent Form</Text>
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Call</Text>
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
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
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => deletePatient()}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Delete Patient</Text>
                                </HStack>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                                <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                    <Text fontWeight="medium">Add to contacts address book</Text>
                                </HStack>
                            </TouchableOpacity>

                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <View style={CommonStylesheet.container}>
                <View style={CommonStylesheet.borderforcardatPatientListScreen} key={item.patientID}>
                    <View style={{ flexDirection: 'row' }}>
                    
                    <View style={{ marginTop: 15 }}>
                                <Image
                                    source={require('../../assets/images/Male.jpg')}
                                    alt="logo.png"
                                    style={CommonStylesheet.imageatPatientScreen} />
                            </View>
                            {/* <View style={{ margin: 8 }}>
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
                                marginTop: 10,
                                marginLeft: 15,
                                padding: 10
                            }}>
                            <TouchableOpacity onPress={() => onSelectingpatient(item.patientID, item.patientName)}>
                                <Text style={CommonStylesheet.headertext16}>
                                    {item.patientName}
                                </Text>

                                <Text style={CommonStylesheet.textPatientList}>
                                    {item.mobileNumber}
                                </Text>
                                <Text style={CommonStylesheet.textPatientList}>
                                    {item.patientCode}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14, }}>
                            {/* <Icon style={[CommonStylesheet.iconstylePicture, styles.iconPhone]}
                                name="phone-volume"
                            >

                            </Icon> */}
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedPatient(item.patientID)
                                    setShowModal(true)
                                }}>
                                <Icon

                                    name="ellipsis-v"
                                    size={22}
                                    color={'#576067'}
                                    style={styles.iconDot}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </View >
    );

    return (
        <View style={{ flex: 1 }}>
            {/* <Searchbar
                placeholder="Search"
                placeholderTextColor={searchbarColor}
                iconColor={searchbarColor}
                onChangeText={onChangeSearch}
                inputStyle={{ fontFamily: 'Poppins-Regular' }}
            /> */}
             <View style={{ padding: 5 }}>
                <Searchbar
                    inputStyle={{ fontFamily: 'Poppins-Regular' }}
                    placeholder="Search"
                    iconColor={searchbarColor}
                    placeholderTextColor={searchbarColor}
                    onChangeText={(val) => setQuery(val)}
                    value={query}
                    style={{ backgroundColor: 'white', marginTop: 10 }}
                />
            </View>
           
            <FlatList
                data={data}
                keyExtractor={(item => `${item.patientID}-${item.index}`)}
                renderItem={renderItem}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && <Loader />}
            />
            {/* <View style={{ marginTop: -15 }}>
                <Fab
                    bgColor={'#2196f3'}
                    renderInPortal={false} size={'md'} icon={<Icon
                        name="plus"
                        size={20}
                        color={"white"}
                    />} onPress={() => navigation.navigate('AddPatient', {
                        clinicID: myclinicID
                    })} />
            </View> */}
            {/* <Button bgColor={'#2196f3'} onPress={() => onLoadMore()}>Load More</Button> */}
        </View>
    );
};

const styles = StyleSheet.create({
    iconPhone: {
        marginRight: 10,
        marginTop: 10
    },
    iconDot: {
        marginRight: 20,
        marginTop: 10
    },
    initialsContainer: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    initialsText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Poppins-Bold',
        marginTop: 5
    },
})

export default SelectPatientViaAppointment;
