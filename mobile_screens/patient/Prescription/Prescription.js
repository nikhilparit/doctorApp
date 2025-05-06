
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
    Image,
    Stack,
    Input,
    Button,
    Thumbnail, List, ListItem, Separator, Modal, HStack, Fab,
    VStack,
    Badge,
    Divider
} from 'native-base';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet'
import Icon from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
//import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import Collapsible from 'react-collapsible';
import Axios from 'axios';
import Api from '../../../api/Api';
import moment from 'moment';
import PatientHeader from '../../../components/PatientHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeaders } from '../../../utils/apiHeaders';
import Loader from '../../../components/Loader';
import Toast from 'react-native-toast-message';
//import Snackbar from 'react-native-snackbar';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const mainCardHeader = Math.min(width, height) * 0.04;
const secondaryCardHeader = Math.min(width, height) * 0.033;
const regularFontSize = width < 600 ? 14 : 16;


function Prescription({ route }) {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const mypatientID = route.params.patientID;
    //const myclinicID = route.params.clinicID;
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [dashboard, setDashboard] = useState({});
    const [prescription, setPrescription] = useState([]);
    const [selectedpatientPrescriptionID, setselectedpatientPrescriptionID] = useState('');
    const [expandedStates, setExpandedStates] = useState({});
    const [name, setName] = useState('');
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const [myclinicID, setmyclinicID] = useState('');
    const [loading, setLoading] = useState(true);


    const toggleExpanded = (patientPrescriptionID) => {
        //console.log(patientPrescriptionID);
        setExpandedStates((prevState) => ({
            ...prevState,
            [patientPrescriptionID]: !prevState[patientPrescriptionID],
        }));
    };
    const readData = async () => {
        setLoading(true); // Ensure loader is shown at the beginning
    
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyclinicID(user.clinicID);
    
        const formData = {
            patientID: mypatientID,
            prescriptionNote: null
        };
    
        try {
            const prescriptionResponse = await Axios.post(
                `${Api}Patient/GetPatientPrescriptionForMobile`, 
                formData, 
                { headers }
            );
            setPrescription(prescriptionResponse.data);
        } catch (error) {
            console.error('Prescription API Error:', error);
        }
    
        const myformData = {
            patientID: mypatientID,
        };
    
        try {
            const dashboardResponse = await Axios.post(
                `${Api}Patient/GetPatientAllDetailForMobile`, 
                myformData, 
                { headers }
            );
            setDashboard(dashboardResponse.data);
            setName(dashboardResponse.data.pateintFullName);
        } catch (error) {
            console.error('Dashboard API Error:', error);
        } finally {
            setLoading(false); // Hide loader only after both requests complete
        }
    };
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            readData();
        });
        return unsubscribe;
    }, [navigation]);

    const openActionMenu = (id) => {
        setShowModal(!showModal);
        setselectedpatientPrescriptionID(id);
        //console.log(id);
    }
    const onOpendeleteConfirmation = () => {
        setShowModal(false);
        setconfirmationWindow(true);
    }
    const deletePrescription = async () => {
        const headers = await getHeaders();
        //console.log(selectedpatientPrescriptionID);
        const formData =
            [
                {
                    patientPrescriptionID: selectedpatientPrescriptionID
                }
            ]
        //console.log("delete form data", formData);

        try {
            Axios.post(`${Api}Patient/DeletePrescription`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                if (resp.data) {
                    setShowModal(false);
                    setconfirmationWindow(false);
                    readData();
                    // Snackbar.show({
                    //     text: 'Prescription deleted sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'Prescription deleted sucessfully.',
                        //text2: 'Please select patient to continue.',
                    });
                    //alert('Prescription deleted sucessfully.');
                }

            })
        } catch (error) {
            //console.log(error.message);
        }
    }
    const operationString = () => {
        let text = name;
        if (text) {
            //console.log(text);
            let initials = text
                .split(' ') // Split the string into an array of words
                .slice(1)
                .filter(word => word.length > 0) // Remove empty elements
                .map(word => word[0]) // Get the first character of each word
                .join(' '); // Join the characters with a space
            //console.log(initials);

            return initials;
        } else {
            //console.log('patientFullName is undefined or not accessible.');
            // Handle the case where patientFullName is undefined or not accessible
        }
    }
    const printData = () => {
        setShowModal(false);
        setconfirmationWindow(false);
        //console.log(selectedpatientPrescriptionID);
        navigation.navigate('Print', {
            clinicID: myclinicID,
            patientID: mypatientID,
            viewName: '_PrintPrescription',
            selection: selectedpatientPrescriptionID,
        });

    }
    return (
        <>
            {loading ? <Loader /> :
                <>
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
                                <TouchableOpacity onPress={() => deletePrescription()}>
                                    <View style={CommonStylesheet.buttonContainersave1}>
                                        <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    {/* <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={[CommonStylesheet.backgroundimage]}> */}
                    <>

                        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                            <View style={Styles.container}>
                                <View style={Styles.containerPatientInfo}>
                                    {/* <View style={Styles.cardContainer}>
                            <View style={{
                                alignItems: 'center', padding: 20, width: '20%', height: '100%',
                                borderColor: 'pink', borderWidth: 2
                            }}>
                                <View style={Styles.initialsContainer}>
                                    <Text style={Styles.initialsText}>{operationString()}</Text>
                                </View>
                            </View>
                            <View style={{
                                alignItems: 'flex-start', width: '80%', height: '100%', padding: 10,
                                borderColor: 'blue', borderWidth: 2
                            }}>
                                <View style={{}}>
                                    <Text style={CommonStylesheet.headertextatPatientDetails}>
                                        {dashboard.pateintFullName}
                                    </Text>
                                    {dashboard.strPateintMedicalAttributes ?
                                        <View style={{ justifyContent: 'flex-start', width: '100%' }}>
                                            <Badge colorScheme="warning" variant={'subtle'} >
                                                <Text style={Styles.medicalText}>{dashboard.strPateintMedicalAttributes}</Text>
                                            </Badge>
                                        </View> : null
                                    }

                                </View>
                                <View style={{ borderColor: 'gray', borderWidth: 2, width: '100%', }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: secondaryCardHeader }}>{dashboard.mobileNumber}</Text>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: secondaryCardHeader, marginHorizontal: width * 0.2 }}>{dashboard.patientCode}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: secondaryCardHeader }}>Balance: {dashboard.balance}/-</Text>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: secondaryCardHeader, marginHorizontal: width * 0.2 }}>Cost: {dashboard.billlingAmount}/-</Text>
                                    </View>
                                </View>
                            </View>
                        </View> */}
                                    <PatientHeader patientID={mypatientID} />
                                    <View
                                    // style={{borderColor:'red',borderWidth:5,width:'100%',height:'30%'}}
                                    >
                                        {/* {prescription && prescription.map(item => item.patientPrescriptionDTOList.map(item2 => (item2.patientDrugPrescriptionDTOList.map(item3 => ( )))} */}
                                        {prescription.length == 0 ?
                                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                                                <Text style={CommonStylesheet.Text}>No prescription found. Please add new prescription by clicking (+) button below</Text>
                                            </View>
                                            :
                                            prescription && prescription.map(item => item.patientPrescriptionDTOList.map(item2 =>
                                                <View style={{ margin: 10 }} key={item2.patientPrescriptionID}>
                                                    <TouchableOpacity onPress={() => toggleExpanded(item2.patientPrescriptionID)}>
                                                        <View style={Styles.header}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                {/* <Text style={Styles.headerText}>{moment(item.dateOfPrescription).format('LL')}{`         `}({item.patientPrescriptionDTOList[0].patientDrugPrescriptionDTOList.length})</Text> */}
                                                                <Text style={Styles.headerText}>{moment(item.dateOfPrescription).format('LL')}</Text>
                                                                <Icon
                                                                    name="caret-down"
                                                                    size={22}
                                                                    color={'white'}
                                                                    style={{ flexDirection: 'row', alignSelf: 'center' }}
                                                                />
                                                            </View>

                                                        </View>
                                                    </TouchableOpacity>
                                                    <Collapsible open={expandedStates[item2.patientPrescriptionID]} align="center" key={item2.patientPrescriptionID}>
                                                        <View style={[Styles.content, { height: 'auto' }]}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -10 }}>

                                                                <Text style={{ textAlign: 'left', marginLeft: -10, fontSize: 16, fontFamily: 'Poppins-Regular', }}>
                                                                    <Icon name="user" size={15} color={"#2196f3"} />
                                                                    <Text style={{ marginLeft: 5 }}> {item.providerName}</Text>

                                                                </Text>
                                                                <View style={{ justifyContent: 'center', marginRight: -10 }}>
                                                                    <TouchableOpacity onPress={() => openActionMenu(item2.patientPrescriptionID)}>
                                                                        <Icon name="ellipsis-v" size={20} color={'#576067'} />
                                                                    </TouchableOpacity>
                                                                </View>

                                                            </View>
                                                            <View style={{ marginTop: 10 }}>
                                                                <View style={{
                                                                    height: 0.5,
                                                                    backgroundColor: '#005599',
                                                                    alignSelf: 'center',
                                                                    width: '120%',
                                                                }} />
                                                            </View>

                                                            <View style={{ flexDirection: 'row', marginLeft: -10, marginRight: -12, backgroundColor: '#e0e0e0', height: 40, marginTop: 5, justifyContent: 'space-between' }}>
                                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                                    <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginLeft: 12 }}>Medicine</Text>
                                                                </View>
                                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Dosage</Text>
                                                                </View>
                                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Frequency</Text>
                                                                </View>
                                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                                    <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginRight: 12 }}>Duration</Text>
                                                                </View>

                                                            </View>


                                                            {item.patientPrescriptionDTOList.map(item2 => (item2.patientDrugPrescriptionDTOList.map(item3 => (
                                                                <TouchableOpacity onPress={() => navigation.navigate('EditPrescription', {
                                                                    patientPrescriptionID: item3.patientPrescriptionID,
                                                                    clinicID: myclinicID,
                                                                    patientID: mypatientID
                                                                })}>
                                                                    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between' }}>
                                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginLeft: -1 }}>{item3.drugName}</Text>
                                                                        </View>
                                                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>{item3.dosageID}</Text>
                                                                        </View>
                                                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>{item3.frequency}</Text>
                                                                        </View>

                                                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>{item3.duration}</Text>
                                                                        </View>
                                                                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                                                                            {/* <Modal.Content maxWidth="350">
                                                                <Modal.CloseButton />
                                                                <Modal.Header>Actions</Modal.Header>
                                                                <Modal.Body>
                                                                    <VStack space={3}>

                                                                        <TouchableOpacity>
                                                                            <HStack alignItems="center"  >
                                                                                <Text style={{ fontFamily: 'Poppins-Medium' }} fontWeight="medium">Send SMS</Text>
                                                                            </HStack>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity>
                                                                            <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                                                                <Text style={{ fontFamily: 'Poppins-Medium' }} fontWeight="medium">Send Email</Text>
                                                                            </HStack>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity>
                                                                            <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                                                                <Text style={{ fontFamily: 'Poppins-Medium' }} fontWeight="medium">Share on Whatsapp</Text>
                                                                            </HStack>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity onPress={() => printData()}>
                                                                            <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                                                                                <Text style={{ fontFamily: 'Poppins-Medium' }} fontWeight="medium">Print Prescription</Text>
                                                                            </HStack>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity onPress={() => onOpendeleteConfirmation(item3.patientPrescriptionID)}>
                                                                            <HStack alignItems="center" marginTop={1} >
                                                                                <Text style={{ fontFamily: 'Poppins-Medium' }} fontWeight="medium">Delete</Text>
                                                                            </HStack>
                                                                        </TouchableOpacity>

                                                                    </VStack>
                                                                </Modal.Body>

                                                            </Modal.Content> */}
                                                                            <Modal.Content maxWidth="350">
                                                                                <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                                                                                <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                                                                                <Modal.Body>
                                                                                    <VStack space={3}>
                                                                                        <TouchableOpacity>
                                                                                            <HStack alignItems="center" marginBottom="11" >
                                                                                                <Text style={{ fontFamily: "poppins-regular" }}>Send SMS</Text>
                                                                                            </HStack><Divider />
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity>
                                                                                            <HStack alignItems="center" marginBottom="11"  >
                                                                                                <Text style={{ fontFamily: "poppins-regular" }}>Send Email</Text>
                                                                                            </HStack><Divider />
                                                                                        </TouchableOpacity>


                                                                                        <TouchableOpacity>
                                                                                            <HStack alignItems="center" marginBottom="11"  >
                                                                                                <Text style={{ fontFamily: "poppins-regular" }} >Share on Whatsapp</Text>
                                                                                            </HStack><Divider />
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity onPress={() => printData()}>
                                                                                            <HStack alignItems="center" marginBottom="11" >
                                                                                                <Text style={{ fontFamily: "poppins-regular" }} >Print Prescription</Text>
                                                                                            </HStack><Divider />
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity onPress={() => onOpendeleteConfirmation(item3.patientPrescriptionID)}>
                                                                                            <HStack alignItems="center" marginBottom="11" >
                                                                                                <Text style={{ fontFamily: "poppins-regular" }} >Delete</Text>
                                                                                            </HStack>
                                                                                        </TouchableOpacity>

                                                                                    </VStack>
                                                                                </Modal.Body>

                                                                            </Modal.Content>
                                                                        </Modal>
                                                                    </View>
                                                                    {/* <View>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>{item3.patientPrescriptionID}</Text>
                                                </View> */}
                                                                </TouchableOpacity>
                                                            ))))}


                                                        </View>
                                                    </Collapsible>
                                                </View>
                                            ))}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View>
                            <TouchableOpacity>
                                <Fab
                                    style={Styles.fab}
                                    renderInPortal={false} size={'md'} icon={<Icon
                                        name="plus"
                                        size={10}
                                        color={"white"}
                                    />} onPress={() => navigation.navigate('AddPrescription', {
                                        clinicID: myclinicID,
                                        patientID: mypatientID
                                    })} />
                            </TouchableOpacity>
                        </View>

                    </>
                </>
            }
        </>
    );
}

export default Prescription;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        // borderColor: 'red',
        // borderWidth: 2,
        width: '100%',
        height: '100%',

    },
    containerPatientInfo: {
        // borderColor: 'green',
        // borderWidth: 2,
        width: '100%',
        height: '100%',
        //padding: 10
    },

    cardContainer: {
        width: '100%',
        padding: 10,
        // borderColor: 'green',
        // borderWidth: 2,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    initialsContainer: {
        width: height / 11,
        height: height / 11,
        borderRadius: height / 11,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialsText: {
        fontSize: secondaryCardHeader,
        color: 'white',
        fontFamily: 'Poppins-Bold',
        textAlign: 'center'
    },

    highlighted: {
        backgroundColor: 'yellow',
        fontFamily: 'Poppins-Bold',
        fontSize: secondaryCardHeader,
    },
    medicalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: secondaryCardHeader,
    },
    fab: {
        position: 'absolute',
        backgroundColor: '#2196f3',
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        width: width - 0,
        height: 200,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: -40
    },
    hdertexttreatScreen: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    hdertxttreatScreen: {
        fontSize: 12,
        color: '#00bc00',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    hdertxttreatcollapseScreen: {
        fontSize: 12,
        color: '#e5da00',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },

    header: {
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#90caf9',
        padding: 7,
    },
    headerText: {
        textAlign: 'left',
        fontSize: regularFontSize,
        fontWeight: '500',
        marginTop: 10,
        fontFamily: 'Poppins-Bold',
        marginLeft: 5

    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        width: '100%',
        height: 150,

    },
    userImage: {
        justifyContent: 'flex-start',
        width: 80,
        height: 80,
        borderRadius: 55,
        marginVertical: 70,
        marginHorizontal: 20
    },
    cardTreatment: {
        height: 350,
        width: width - 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 12,
    },
    treatmentDate: {
        marginLeft: 10
    },
    providerName: {
        marginRight: 10
    },
    initialsText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Poppins-Bold',
        marginTop: 5
    },
    statusPlanned: {
        fontSize: 14,
        color: 'blue',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    statusInprogress: {
        fontSize: 14,
        color: '#00bc00',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    statusComplete: {
        fontSize: 14,
        color: 'green',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    statusDiscountinues: {
        fontSize: 14,
        color: 'red',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    highlighted: {
        backgroundColor: 'yellow',
        fontFamily: 'Poppins-Bold',
        fontSize: 12,
    },
    medicalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    }
});