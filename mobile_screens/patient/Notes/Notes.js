import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, } from 'react-native';
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
    Modal,
    HStack, Fab,
    Divider
} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
const { height, width } = Dimensions.get('window');
import Toast from "react-native-toast-message";

const MaxWidth = width < 600 ? 320 : 300;
const MaxHeight = width < 600 ? 100 : 100;
import Axios from "axios";
import Api from "../../../api/Api";
import moment from "moment";
import PatientHeader from '../../../components/PatientHeader';
import { getHeaders } from "../../../utils/apiHeaders";
import Loader from "../../../components/Loader";


const Notes = ({ route }) => {
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    //const myClinicID = route.params.clinicID;
    const myPatientID = route.params.patientID;
    const [notes1, setNotes1] = useState([]);
    const [PatientNotesID, setPatientNotesID] = useState('');
    const [providerInfo, setProviderInfo] = useState([]);
    const [notesInfo, setNotesInfo] = useState({});
    const [date, setDate] = useState(new Date());
    const [note, setNotes] = useState('');
    const [providerName, setproviderName] = useState('');
    const [notesDate, setnotesDate] = useState(new Date());
    const [userName, setuserName] = useState('');
    const [myClinicID, setmyClinicID] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setToken(user.token);
        setuserName(user.userName);
        setmyClinicID(user.clinicID);
        const formData = {
            clinicID: user.clinicID,
            startDate: null,
            endDate: null,
            pageIndex: 0,
            pageSize: 0,
            sortColumn: null,
            sortOrder: null,
            search: null,
            patientID: myPatientID
        }
        //console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}Patient/GetPatientNotesByPatientId`, formData, { headers }).then(resp => {
                //console.log('Patient Notes', resp.data);
                setNotes1(resp.data);
            });
        } catch (error) {
            //console.log(error);
        }
    };

    const deleteNotes = async () => {
        const headers = await getHeaders();
        const formData2 =
        {
            applicationDTO: {
                clinicID: myClinicID,
            }
        }
        // //console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}patient/GetProviderInfo`, formData2, { headers }).then(resp => {
                //console.log('Provider Info', resp.data);
                setProviderInfo(resp.data);
            });
        } catch (error) {
            //console.log(error.message);
        }


        const formData = {
            patientNotesId: PatientNotesID,
            patientId: myPatientID,
            clinicId: myClinicID,
            // providerId: selectedProviderID[0].providerID,
            notesDate: notesDate,
            category: null,
            notes: note,
            isDeleted: false,
            createdBy: userName,
            createdOn: notesDate,
            lastUpdatedBy: userName,
            lastUpdatedOn: notesDate,
            key: "Delete",
            recordCount: 0,
            providerName: null
        }
        //console.log("delete Notes FormData", formData);

        try {
            Axios.post(`${Api}Patient/_InsertUpdateDeletePatientNotes`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                if (resp.data) {
                    // Snackbar.show({
                    //     text: 'Note deleted sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'Note deleted sucessfully.',
                        //text2: 'Please select patient to continue.',
                    });

                }
                setShowModal(false);
                setconfirmationWindow(false);
                readData();
            })
        } catch (error) {
            //console.log(error.message);
        }
    }

    const onSelect = (id) => {
        //console.log(id);
        setPatientNotesID(id);
        setShowModal(true);
    }
    const EditPatientNotes = () => {
        setShowModal(false);
        navigation.navigate('EditPatientNotes', {
            clinicID: myClinicID,
            patientID: myPatientID,
            patientNotesId: PatientNotesID

        })
    }

    useEffect(() => {
        readData();
    }, [isFocused]);
    return (
        <>
            {loading ? <Loader /> :
                <>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                            <Modal.Body>
                                <VStack space={3}>
                                    <TouchableOpacity onPress={() => EditPatientNotes()}>
                                        <HStack alignItems="center" marginBottom="11" >
                                            <Text fontFamily="poppins-regular">Edit Notes</Text>
                                        </HStack> <Divider />
                                    </TouchableOpacity>
                                    < TouchableOpacity onPress={() => setconfirmationWindow(true)}>
                                        <HStack alignItems="center" marginBottom="11" >
                                            <Text fontFamily="poppins-regular">Delete Note</Text>
                                        </HStack><Divider />
                                    </TouchableOpacity>

                                    {/* <HStack alignItems="center" justifyContent="space-between" >
                                <Text fontWeight="medium">Share on Whatsapp</Text>
                            </HStack> */}

                                </VStack>
                            </Modal.Body>

                        </Modal.Content>
                    </Modal>
                    <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                            <Modal.Body padding={5}>
                                <Text style={{ fontFamily: "Poppins-regular" }}>Are you sure want to delete this record?</Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <TouchableOpacity onPress={() => {
                                    setconfirmationWindow(false);
                                }}>
                                    <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                        <Text style={CommonStylesheet.ButtonText}>No</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteNotes()}>
                                    <View style={CommonStylesheet.buttonContainersave1}>
                                        <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    {/* <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}> */}
                    <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                        <PatientHeader patientID={myPatientID} />
                        <ScrollView>
                            <View style={CommonStylesheet.container}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', alignItems: 'stretch' }}>
                                    {notes1.length == 0 ?
                                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                                            <Text style={CommonStylesheet.Text}>No Record Found, Please Add New Patient Notes by clicking (+) button below</Text>
                                        </View> :
                                        notes1.map(item => (
                                            <View key={item.patientNotesId} >
                                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 15, width: '100%' }}>
                                                    <View style={[Styles.card, CommonStylesheet.shadow]}>
                                                        <View style={{ width: "100%" }}>

                                                            <TouchableOpacity onPress={() => navigation.navigate('EditPatientNotes', {
                                                                clinicID: myClinicID,
                                                                patientID: myPatientID,
                                                                patientNotesId: item.patientNotesId
                                                            })}>
                                                                <View style={{ marginTop: 10 }}>
                                                                    <View style={{ flexDirection: 'row' }}>

                                                                        <Text style={[CommonStylesheet.headertextDailyCollectionScreen, { width: '30%', justifyContent: 'space-evenly' }]}>
                                                                            Notes Date
                                                                        </Text>
                                                                        <Text style={[CommonStylesheet.headertextDailyCollectionScreen, { width: '5%', justifyContent: 'space-evenly' }]}>
                                                                            :
                                                                        </Text>
                                                                        <Text style={[Styles.hdertxt, { width: '55%' }]}>
                                                                            {moment(item.notesDate).format('LL')}
                                                                        </Text>
                                                                        <View style={{ width: '10', marginTop: 10 }}>
                                                                            <TouchableOpacity onPress={() => onSelect(item.patientNotesId)
                                                                            }>
                                                                                <Icon

                                                                                    name="ellipsis-v"
                                                                                    size={15}
                                                                                    color={'#576067'}
                                                                                    style={Styles.iconDot}
                                                                                />
                                                                            </TouchableOpacity>
                                                                        </View>



                                                                    </View>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <Text style={[CommonStylesheet.headertextDailyCollectionScreen, { width: '30%', justifyContent: 'space-evenly' }]}>
                                                                            Doctor Name
                                                                        </Text>
                                                                        <Text style={[CommonStylesheet.headertextDailyCollectionScreen, { width: '5%', justifyContent: 'space-evenly' }]}>
                                                                            :
                                                                        </Text>
                                                                        <Text style={[Styles.hdertxt, { width: '65%' }]}>
                                                                            {item.providerName}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <Text style={[CommonStylesheet.headertextDailyCollectionScreen, { width: '30%', justifyContent: 'space-evenly' }]}>
                                                                            Notes
                                                                        </Text>
                                                                        <Text style={[CommonStylesheet.headertextDailyCollectionScreen, { width: '5%', justifyContent: 'space-evenly' }]}>
                                                                            :
                                                                        </Text>
                                                                        <Text style={[Styles.hdertxt, { width: '65%' }]}>
                                                                            {item.notes}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <Fab
                        style={Styles.fab}
                        renderInPortal={false} size={'md'} icon={<Icon
                            name="plus"
                            size={10}
                            color={"white"}
                        />} onPress={() => navigation.navigate('AddPatientNotes', {
                            clinicID: myClinicID,
                            patientID: myPatientID
                        })} />
                </>
            }
        </>
    );
};


const Styles = StyleSheet.create({

    popheader: {
        backgroundColor: '#2196f3',

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
        verticalAlign: "middle",

        height: 30,
        width: 30
        // elevation: 2,
    },

    iconDot: {
        marginRight: 20,
        marginTop: -6,
        color: 'black'
    },
    card: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#2196f3',
        height: MaxHeight,
        width: MaxWidth,
        backgroundColor: ('#2196f3', 'white'),
        flexDirection: 'row', justifyContent: 'center'
        // marginVertical: 5
    },
    hdertxt: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Poppins-Regular',
        // marginRight: 15
    },
    ButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    fab: {
        position: 'absolute',
        backgroundColor: '#2196f3',
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },

})

export default Notes;