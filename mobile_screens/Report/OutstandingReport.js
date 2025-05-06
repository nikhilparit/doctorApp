import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, width, TouchableOpacity, ScrollView, Dimensions, Alert, Linking } from 'react-native';
import {
    Image,
    Select,
    VStack,
    HStack,
    Modal,
    Divider
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import { Searchbar, DataTable, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Loader from '../../components/Loader';
import Api from '../../api/Api';
import Axios from 'axios';
import { getHeaders } from '../../utils/apiHeaders';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const searchbarColor = 'black';
const regularFontSize = width < 600 ? 12 : 14;

const OutstandingReport = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [dashboard, setDashboard] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [viewType, setviewType] = useState('');
    //Modals States
    const [modalVisible, setModalVisible] = useState(false);
    const [ShowModal, setShowModal] = useState(false);
    //Loader
    const [loader, setLoader] = useState(false);
    //data-binding
    const [Outstanding, setOutstanding] = useState([]);
    const [clinicID, setClinicID] = useState('');
    const [patientID, setPatientID] = useState('');
    //Year wise start date, end date calculations
    const currentYear = moment().format('YYYY');
    const startDate = moment(`${currentYear}-01-01`);
    const endDate = moment(`${currentYear}-12-31`);
    //search bar 
    const [query, setQuery] = useState('');
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
            endDate: moment(endDate).format('YYYY-MM-DD'),
            recordCount: 0,
            pageIndex: 0,
            pageSize: 0,
            sortColumn: null,
            sortOrder: null,
            treatmentStatus: 0,
            searchData: null,
            communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
        }
        //console.log('Data To Pass Outsatnding Api', formData);
        try {
            Axios.post(`${Api}Report/GetOutstandingBillforMobile`, formData, { headers }).then(resp => {
              //  console.log('Outstanding Report', resp.data);
                setOutstanding(resp.data);
                setLoader(false);
            });
        } catch (error) {
           // console.log(error);
        }
    };
    useEffect(() => {
        readData()
    }, [isFocused]);
    const handleView = async (viewType) => {
        const headers = await getHeaders();
        setviewType(viewType);
        switch (viewType) {
            case "All":
                //console.log(viewType);
                setLoader(true);
                const formData = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    recordCount: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    sortColumn: null,
                    sortOrder: null,
                    treatmentStatus: 0,
                    searchData: null,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass ALL', formData);
                try {
                    Axios.post(`${Api}Report/GetOutstandingBillforMobile`, formData, { headers }).then(resp => {
                       // console.log('Outstanding Report All', resp.data);
                        setOutstanding(resp.data);
                        setLoader(false);
                    });
                } catch (error) {
                   // console.log(error.message);
                }
                setModalVisible(false);
                break;
            case "Planned":
                //console.log(viewType);
                setLoader(true);
                const formData1 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    recordCount: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    sortColumn: null,
                    sortOrder: null,
                    treatmentStatus: 1,
                    searchData: null,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass Planned', formData1);
                try {
                    Axios.post(`${Api}Report/GetOutstandingBillforMobile`, formData1, { headers }).then(resp => {
                       // console.log('Outstanding Report Planned', resp.data);
                        setOutstanding(resp.data);
                        setLoader(false);
                    });
                } catch (error) {
                   // console.log(error.message);
                }
                setModalVisible(false);
                break;
            case "Inprogress":
                //console.log(viewType);
                setLoader(true);
                const formData2 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    recordCount: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    sortColumn: null,
                    sortOrder: null,
                    treatmentStatus: 2,
                    searchData: null,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
               // console.log('Data To Pass Inprogress', formData2);
                try {
                    Axios.post(`${Api}Report/GetOutstandingBillforMobile`, formData2, { headers }).then(resp => {
                        //console.log('Outstanding Report Inprogress', resp.data);
                        setOutstanding(resp.data);
                        setLoader(false);
                    });
                } catch (error) {
                    //console.log(error.message);
                }
                setModalVisible(false);
                break;
            case "Completed":
                //console.log(viewType);
                setLoader(true);
                const formData3 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    recordCount: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    sortColumn: null,
                    sortOrder: null,
                    treatmentStatus: 3,
                    searchData: null,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
               // console.log('Data To Pass Completed', formData);
                try {
                    Axios.post(`${Api}Report/GetOutstandingBillforMobile`, formData3, { headers }).then(resp => {
                       // console.log('Outstanding Report Completed', resp.data);
                        setOutstanding(resp.data);
                        setLoader(false);
                    });
                } catch (error) {
                   // console.log(error.message);
                }
                setModalVisible(false);
                break;
            case "Discountinued":
               // console.log(viewType);
                setLoader(true);
                const formData4 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    recordCount: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    sortColumn: null,
                    sortOrder: null,
                    treatmentStatus: 4,
                    searchData: null,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
               // console.log('Data To Pass Discountinued', formData4);
                try {
                    Axios.post(`${Api}Report/GetOutstandingBillforMobile`, formData4, { headers }).then(resp => {
                        console.log('Outstanding Report Discountinued', resp.data);
                        setOutstanding(resp.data);
                        setLoader(false);
                    });
                } catch (error) {
                   // console.log(error.message);
                }
                setModalVisible(false);
                break;
            default:
                break;
        }
    }
    const onChangeSearch = async(query) => {
        const headers = await getHeaders();
       // console.log(query);
        const formData = {
            clinicID: clinicID,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
            recordCount: 0,
            pageIndex: 0,
            pageSize: 0,
            sortColumn: null,
            sortOrder: null,
            treatmentStatus: 0,
            searchData: query,
            communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
        }
        console.log('Data To Pass Search Api', formData);
        setQuery(query);
        try {
            Axios.post(`${Api}Report/GetOutstandingBillforMobile`, formData, { headers }).then(resp => {
                console.log('Outstanding Report After Search', resp.data);
                setOutstanding(resp.data);
            });
        } catch (error) {
            console.log(error);
        }

    };
    const openModal = (id) => {
        console.log("PATIENTID", id);
        setPatientID(id);
        setShowModal(true);
    }
    const viewProfile = () => {
        navigation.navigate('PatientDetails', {
            clinicID: clinicID,
            patientID: patientID
        });
        setShowModal(false);
    }
    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                <View >

                    <Searchbar
                        inputStyle={{ fontFamily: 'Poppins-Regular' }}
                        placeholder="Search"
                        defaultValue='clear'
                        iconColor={searchbarColor}
                        placeholderTextColor={searchbarColor}
                        onChangeText={onChangeSearch}
                        value={query}
                        theme={{ colors: { primary: 'gray' } }}
                        style={{ margin: 10,backgroundColor:'white' }}
                    />
                </View>
                {loader ? <Loader /> :
                    <ScrollView>
                        <SafeAreaView style={Styles.container}>
                            {viewType ?

                                <View style={Styles.containerForStatus}>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={Styles.headerText}>
                                                {viewType}
                                            </Text>
                                            <Icon
                                                name="caret-down"
                                                size={22}
                                                color={'black'}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View> :
                                <View style={[Styles.containerForStatus,CommonStylesheet.shadow]}>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', fontFamily: 'Poppins-Regular' }}>
                                            <Text style={Styles.headerText}>
                                                Treatment Status
                                            </Text>
                                            <Icon
                                                name="caret-down"
                                                size={20}
                                                color={'black'}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>}

                            <View style={{ flexDirection: 'row',alignSelf:'center',width:'100%',justifyContent:'space-between'}}>
                                        <View style={Styles.containerForBal}>
                                            <Text style={Styles.balText}>
                                                Treat Bal: {Outstanding && Outstanding.length > 0 ? Outstanding[0].totalTreatmentBalance : 0}
                                            </Text>
                                        </View>
                                        <View style={Styles.containerForBal}>
                                            <Text style={Styles.balText}>
                                                Billed Bal: {Outstanding && Outstanding.length > 0 ? Outstanding[0].totalBilledBalance : 0}
                                            </Text>
                                        </View>
                                    </View>

                                <View style={[Styles.containerForHeader, CommonStylesheet.shadow]}>

                                    <Text style={[Styles.headerText]}>
                                        Name
                                    </Text>
                                    <Text style={[Styles.headerText]}>
                                        Treatment Balance
                                    </Text>
                                    <Text style={[Styles.headerText]}>
                                        Billed Balance
                                    </Text>
                                </View>
                                <View >
                                    {Outstanding.length == 0 ?
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={CommonStylesheet.Text}> Data not Found</Text>
                                        </View> :
                                        Outstanding.map(item => (
                                            <View style={[Styles.containerForSubHeader, CommonStylesheet.shadow]} key={item.patientID}>
                                                <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
                                                    <Text style={[Styles.headerText]}>
                                                        {item.patientName}
                                                    </Text></View>
                                                <View style={{ flex: 1, alignSelf: 'center' }}>
                                                    <Text style={[Styles.headerText]}>
                                                        {item.treatmentBalance}
                                                    </Text>
                                                </View>
                                                <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                                                    <Text style={[Styles.headerText]}>
                                                        {item.billedBalance}
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => openModal(item.patientID)}>
                                                        <Icon

                                                            name="ellipsis-v"
                                                            size={22}
                                                            color={'#576067'}
                                                            style={Styles.iconDot}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                </View>
                            
                        </SafeAreaView>
                    </ScrollView>
                }
                <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                    <Modal.Content>
                        <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                        <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Select Status</Text></Modal.Header>

                        <Modal.Body >
                            <VStack space={4}>
                            
                                <TouchableOpacity onPress={() => handleView('All')} >
                                    <HStack alignItems="center" marginBottom= "3" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>All</Text>
                                    </HStack><Divider />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleView('Planned')} >
                                    <HStack alignItems="center" marginBottom= "3" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>Planned</Text>
                                    </HStack><Divider />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleView('Inprogress')} >
                                    <HStack alignItems="center" marginBottom= "3" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>Inprogress</Text></HStack><Divider />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleView('Completed')} >
                                    <HStack alignItems="center" marginBottom= "3" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>Completed</Text>
                                    </HStack><Divider />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleView('Discountinued')} >
                                    <HStack alignItems="center" marginBottom= "3" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>Discountinued</Text>
                                    </HStack>
                                </TouchableOpacity>
                              
                            </VStack>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
                <Modal isOpen={ShowModal} onClose={() => setShowModal(false)} size={"lg"}>
                    <Modal.Content>
                        <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                        <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                        <Modal.Body >
                            <VStack space={3}>
                                <TouchableOpacity >

                                    <HStack alignItems="center" marginBottom="11" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>Call</Text></HStack><Divider />
                                </TouchableOpacity>

                                <TouchableOpacity >
                                    <HStack alignItems="center" marginBottom="11" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>Send SMS</Text>
                                    </HStack><Divider />
                                </TouchableOpacity>

                                <TouchableOpacity >
                                    <HStack alignItems="center" marginBottom="11" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>Payment Reminder SMS</Text>
                                    </HStack><Divider />
                                </TouchableOpacity>

                                <TouchableOpacity >
                                    <HStack alignItems="center" marginBottom="11" >
                                        <Text style={{ fontFamily: "poppins-regular" }}>Payment Reminder on WhatsApp</Text>
                                    </HStack><Divider />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => viewProfile()}>
                                    <HStack alignItems="center" marginBottom="11"    >
                                        <Text style={{ fontFamily: "poppins-regular" }}>View Patient Details</Text>
                                    </HStack>
                                </TouchableOpacity>
                            </VStack>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </View>
        </>
    )
}

export default OutstandingReport;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    containerForStatus: {
        width: '100%',
        height: 40,
        backgroundColor: '#90caf9',
        alignItems: 'flex-start',
        justifyContent: 'center',
 },
    containerForBal: {
        width: 150,
        height: 30,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        margin:10
    },
    balText: {
        fontSize: regularFontSize,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    containerForHeader: {
        width: windowWidth,
        height: 40,
        backgroundColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },

    headerText: {
        fontSize: regularFontSize,
        color: 'black',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15,
        height: 'auto', alignContent: 'center'
    },
    containerForSubHeader: {
        width: windowWidth,
        height: 40,
        backgroundColor: 'white',
        marginVertical: 8,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerSubText: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15,
    },
    iconDot: {
        marginRight: 20
    }
});




