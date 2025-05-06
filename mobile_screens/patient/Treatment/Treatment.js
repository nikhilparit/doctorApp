
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Image,
    Stack,
    Input,
    Button,
    Thumbnail, List, ListItem, Separator, Modal, HStack, Fab,
    VStack,
    Select,
    CheckIcon,
    Badge, Divider
} from 'native-base';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
import Collapsible from 'react-collapsible';
import Axios from 'axios';
import Api from '../../../api/Api';
import moment from 'moment';
import PatientHeader from '../../../components/PatientHeader';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeaders } from '../../../utils/apiHeaders';
import Loader from '../../../components/Loader';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const mainCardHeader = Math.min(width, height) * 0.04;
const secondaryCardHeader = Math.min(width, height) * 0.033;
const regularFontSize = width < 600 ? 14 : 16;
const primaryFontSize = width < 600 ? 17 : 22;
const MaxWidth = width < 600 ? 235 : 400;
const cardwidth = width < 600 ? 100 : 100;



function Treatment({ route }) {
    const navigation = useNavigation();
    const mypatientID = route.params.patientID;
    const [collapsed1, setCollapsed1] = useState(true);
    const [collap1, setCollap1] = useState(true);
    const [collapsed2, setCollapsed2] = useState(true);
    const [collap2, setCollap2] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [dashboard, setDashboard] = useState({});
    const [treatment, setTreatment] = useState(null);
    const [patientTreatmentDoneID, setpatientTreatmentDoneID] = useState('');
    const [patientTreatmentID, setpatientTreatmentID] = useState('');
    const [patientTreatmentTypeDoneID, setpatientTreatmentTypeDoneID] = useState('');
    const [treatmentTypeID, settreatmentTypeID] = useState('');
    const [name, setName] = useState('');
    //Update Status Modal
    const [showModal1, setShowModal1] = useState(false);
    const [service, setService] = React.useState(0);
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const [expandedStates, setExpandedStates] = useState({});
    const [myclinicID, setmyclinicID] = useState('');
    const [loading, setLoading] = useState(false);


    const toggleExpanded1 = () => {
        setCollapsed1(!collapsed1);
        setCollap1(!collap1);
    };
    const toggleExpanded2 = () => {
        setCollapsed2(!collapsed2);
        setCollap2(!collap2);
    };

    const readData = async () => {
        setLoading(true);
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyclinicID(user.clinicID);
        const formData = {
            patientID: mypatientID,
            sortColumn: "AddedOn",
            sortOrder: "ASC"
        }
        //console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}Patient/GetPatientTreatmentDetailsForMobile`, formData, { headers }).then(resp => {
                //const data = JSON.stringify(resp.data);
                //console.log('GetPatient TreatmentDetails ForMobile', resp.data);
                setTreatment(resp.data);
                //console.log('Patient Treatment', resp.data);

            });
        } catch (error) {
            //console.log(error);
        }
        const myformData = {
            patientID: mypatientID,
            examinationCount: 0,
            fileCount: 0,
            treatmentsCount: 0,
            prescriptionsCount: 0,
            billlingAmount: 0,
            pateintFullName: "string",
            mobileNumber: "string",
            imagethumbnail: null,
            strImagethumbnail: "string",
            imagePath: "string",
            gender: "string",
            strPateintMedicalAttributes: "string",
            itemDescription: "string",
            patientCode: "string",
            netTreatmentCost: 0,
            balance: 0,
            emailID: "string",
            nextAppointmentDate: "2023-03-09T08:39:06.099Z",
            appointmentCount: 0
        }
        //console.log('Data To Pass', myformData);
        try {
            Axios.post(`${Api}Patient/GetPatientAllDetailForMobile`, myformData, { headers }).then(resp => {
                //console.log('Patient Dashboard', resp.data);
                setName(resp.data.pateintFullName);
                setDashboard(resp.data);
                setLoading(false);
            });
        } catch (error) {
            //console.log(error);
        }
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            readData();
        });
        return unsubscribe;
    }, [navigation]);
    const toggleExpanded = (patientTreatmentTypeDoneID) => {
        //console.log(`Toggling ${patientTreatmentTypeDoneID}`);  // Debugging line
        setExpandedStates((prevState) => ({
            ...prevState,
            [patientTreatmentTypeDoneID]: !prevState[patientTreatmentTypeDoneID],
        }));
    };
    const onOpendeleteConfirmation = () => {
        setShowModal(false);
        setconfirmationWindow(true);
    }
    const operationString = () => {
        let text = name;
        if (text) {
            // console.log(text);
            let initials = text
                .split(' ') // Split the string into an array of words
                .slice(1)
                .filter(word => word.length > 0) // Remove empty elements
                .map(word => word[0]) // Get the first character of each word
                .join(' '); // Join the characters with a space
            // console.log(initials);

            return initials;
        } else {
            //console.log('patientFullName is undefined or not accessible.');
            // Handle the case where patientFullName is undefined or not accessible
        }
    }

    const deleteTreatment = async () => {
        const headers = await getHeaders();
        //console.log("Selected ID", patientTreatmentDoneID);
        try {
            Axios.post(`${Api}Patient/DeletePatientTreatmentDone?PatientTreatmentDoneID=${patientTreatmentDoneID}`, {},
                { headers }).then(resp => {
                    //console.log(resp.data);
                    if (resp.data) {
                        setShowModal(false);
                        setconfirmationWindow(false);
                        readData();
                    }
                }),
            {
                headers: {
                    'accept': 'text/plain'
                }
            }

        } catch (error) {
            //console.log(error.messge);
        }
    }
    const openModal = (patientTreatmentDoneID, patientTreatmentTypeDoneID, treatmentTypeID, treatmentStatus) => {
        setShowModal(true);
        //console.log("patientTreatmentDoneID ", patientTreatmentDoneID);
        //console.log("patientTreatmentTypeDoneID", patientTreatmentTypeDoneID);
        //console.log("treatmentTypeID", treatmentTypeID);
        //console.log("OPEN POP_UP STATUS ID", treatmentStatus);
        // const TreatmentHeaderDTOList = treatment[0].patientPatientTreatmentHeaderDTOList;
        // let status = TreatmentHeaderDTOList.filter(item => item.patientTreatmentDoneID == patientTreatmentDoneID);
        //console.log("STATUS",treatmentStatus);
        setpatientTreatmentDoneID(patientTreatmentDoneID);
        setpatientTreatmentTypeDoneID(patientTreatmentTypeDoneID);
        settreatmentTypeID(treatmentTypeID);
        setService(treatmentStatus);

    }
    const editTreatment = () => {
        navigation.navigate('EditTreatment', {
            patientID: mypatientID,
            patientTreatmentDoneID: patientTreatmentDoneID,
            patientTreatmentTypeDoneID: patientTreatmentTypeDoneID,
            treatmentTypeID: treatmentTypeID

        });
        setShowModal(false);
    }
    const updateStatus = async () => {
        const headers = await getHeaders();
        //console.log("PatientTreatmentDoneID", patientTreatmentDoneID);
        //console.log('Status ID', service);
        const itemID = parseInt(service);
        try {
            Axios.post(`${Api}Patient/UpdateTreatmentStatus?ItemID=${itemID}&PatientTreatmentDoneID=${patientTreatmentDoneID}`, {}, { headers })
                .then(resp => {
                    //console.log(resp.data);
                    if (resp.data) {
                        setShowModal(false);
                        setconfirmationWindow(false);
                        readData();
                    }
                }),
            {
                headers: {
                    'accept': 'text/plain'
                }
            }
        } catch (error) {
            //console.log(error.message);
        }

        setShowModal1(false);
        setShowModal(false);
    }
    const openModelForStatus = () => {
        setShowModal(false);
        setShowModal1(true);
        //console.log("PatientTreatmentDoneID", patientTreatmentDoneID);
        //console.log('Status ID', service);
        setService(service);
    }
    const printData = () => {
        //console.log(patientTreatmentDoneID);
        navigation.navigate('Print', {
            clinicID: myclinicID,
            patientID: mypatientID,
            viewName: '_PrintTreatment',
            selection: patientTreatmentDoneID,
        });
        setShowModal(false);
    }
    return (
        <>

            <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>

                    <Modal.Body padding={5}>
                        <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to delete this record ?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => {
                                setconfirmationWindow(false);
                            }}>
                                <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                    <Text style={CommonStylesheet.ButtonText}>No</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { deleteTreatment(); }}>
                                <View style={CommonStylesheet.buttonContainersave1}>
                                    <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                </View>
                            </TouchableOpacity>
                        </View>



                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {loading ? <Loader></Loader> :
                <>
                    <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                        <View style={Styles.container}>
                            <View style={Styles.containerPatientInfo}>
                                {/* <View style={Styles.cardContainer}>
                            <View style={{ width:cardwidth, height: '100%' }}>

                                <Image
                                    source={require('../../../assets/images/Male.jpg')}
                                    alt="logo.png"
                                    style={CommonStylesheet.imageatPatient}
                                />

                            </View>
                            <View style={{alignItems: 'flex-start', width: '90%', height: '100%', padding: 10, marginLeft: 10}}>
                            <View >
                                    <Text style={CommonStylesheet.headertextatPatientDetails}>
                                        {dashboard.pateintFullName}
                                    </Text>
                                    {dashboard.strPateintMedicalAttributes ?    
                                        <View style={{ justifyContent: 'flex-start',marginTop:5,marginBottom:5}}>
                                            <Badge colorScheme="blue" variant={'subtle'} >
                                                <Text style={[Styles.medicalText,{color:'red'}]}>{dashboard.strPateintMedicalAttributes}</Text>
                                            </Badge>
                                        </View> : null
                                    }

                                </View>
                                <View style={{width:MaxWidth}}>
                                    <View style={Styles.cardtext} > 
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular'}}>{dashboard.patientCode}    </Text>
                                        <Text style={{ marginHorizontal:50}}>Cost: {dashboard.billlingAmount}/-</Text>

                                        

                                    </View>
                                    <View style={Styles.cardtext}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular'}}>{dashboard.mobileNumber}</Text>
                                        <Text style={{ marginHorizontal:30}}>Balance: {dashboard.balance}/-</Text>
                                    </View>

                                </View>

                               
                            </View>
                        </View> */}

                                <PatientHeader patientID={mypatientID} />

                                <ScrollView contentContainerStyle={{ flexGrow: 1, marginBottom: 200 }}>
                                    {treatment &&
                                        treatment.map((item) => item.patientPatientTreatmentHeaderDTOList && item.patientPatientTreatmentHeaderDTOList.map((item2) =>
                                            item2.patientTreatmentDTO && item2.patientTreatmentDTO.map((item3) => ((
                                                <View style={{ margin: 10, backgroundColor: 'white' }}>

                                                    <TouchableOpacity onPress={() => toggleExpanded(item3.patientTreatmentTypeDoneID)}>
                                                        <View style={Styles.header}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={Styles.headerText}>{moment(item.treatmentDate).format('LL')}</Text>
                                                                <Icon name="caret-down" size={22} color={'white'} style={{ flexDirection: 'row', marginTop: 3 }} />
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <Collapsible open={expandedStates[item3.patientTreatmentTypeDoneID]}>
                                                        <View style={[Styles.content, { height: 'auto' }]}>
                                                            <View style={{ flexDirection: 'row', fontWeight: 500, width: '100%', justifyContent: 'space-between', marginTop: -10 }}>

                                                                <Text style={{ textAlign: 'left', marginLeft: -12, fontSize: 16, fontFamily: 'Poppins-Regular' }}>
                                                                    <Icon name="user" size={15} color={"#2196f3"} />
                                                                    <Text style={{ marginLeft: 5 }}> {item.providerName}</Text>

                                                                </Text>

                                                                <TouchableOpacity onPress={() => openModal(item3.patientTreatmentDoneID, item3.patientTreatmentTypeDoneID, item3.treatmentTypeID, item2.treatmentStatus)}>
                                                                    <Icon

                                                                        name="ellipsis-v"
                                                                        size={20}
                                                                        color={'#576067'}
                                                                        style={{ justifyContent: 'center', marginRight: -10 }}
                                                                    />
                                                                </TouchableOpacity>


                                                            </View>

                                                            <View style={{
                                                                marginTop: 10,
                                                                height: 0.5,
                                                                backgroundColor: '#005599',
                                                                alignSelf: 'center',
                                                                width: '120%',
                                                            }} />

                                                        </View>
                                                        <View style={[{ marginLeft: 10, marginBottom: 10, backgroundColor: '#fff' }]}>
                                                            <TouchableOpacity onPress={() => openModal(item3.patientTreatmentDoneID, item3.patientTreatmentTypeDoneID, item3.treatmentTypeID, item2.treatmentStatus)}>
                                                                <View key={item3.patientTreatmentDoneID} >
                                                                    <View style={{ flexDirection: 'row', width: '100%' }}>
                                                                        <Text style={{ width: width < 600 ? 100 : 100, color: 'black', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                            Treatment
                                                                        </Text>
                                                                        <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                            :{'       '}
                                                                        </Text>
                                                                        <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                            {item3.treatmentType}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row', width: '100%' }}>
                                                                        <Text style={{ width: width < 600 ? 100 : 100, color: 'black', fontFamily: 'Poppins-SemiBold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                            Total Cost
                                                                        </Text>
                                                                        <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                            :{'       '}
                                                                        </Text>
                                                                        <Text style={{ width: width < 600 ? 250 : 150, color: '#5f6067', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                            {item2.treatmentTotalCost}/-
                                                                        </Text>
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row', width: '100%' }}>
                                                                        <Text style={{ width: width < 600 ? 100 : 100, color: 'black', fontFamily: 'Poppins-SemiBold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                            Discount
                                                                        </Text>
                                                                        <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                            :{'       '}
                                                                        </Text>
                                                                        <Text style={{ width: width < 600 ? 250 : 150, color: '#5f6067', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                            {item2.treatmentDiscount}/-
                                                                        </Text>
                                                                    </View>
                                                                    {/* <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: 14 }}>
                                                                Discount  :{'                  '}
                                                            </Text>
                                                            <Text style={{ color: 'black', fontFamily: 'Poppins-Bold', fontSize: 14 }}>
                                                                {item3.treatmentDiscount} /-
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: 14 }}>
                                                                Net Cost  :{'                '}
                                                            </Text>
                                                            <Text style={{ color: 'black', fontFamily: 'Poppins-Bold', fontSize: 14 }}>
                                                                {item2.treatmentTotalCost} /-
                                                            </Text>
                                                        </View> */}
                                                                    <View key={item3.id} style={{ flexDirection: 'row', width: '100%' }}>
                                                                        <Text style={{ color: 'black', width: width < 600 ? 100 : 100, fontWeight: 500, fontFamily: 'Poppins-SemiBold', fontSize: regularFontSize }}>
                                                                            Status
                                                                        </Text>
                                                                        <Text style={{ color: 'black', width: width < 600 ? 30 : 30, fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                            :{'       '}
                                                                        </Text>
                                                                        <Text style={[Styles.headertxttreatScreenforPlanned, { width: width < 600 ? 250 : 200, fontSize: regularFontSize, fontFamily: 'Poppins-Regular' }]}>
                                                                            {item2.treatmentStatus === 1 ? (
                                                                                <Text style={Styles.statusPlanned}>Planned</Text>
                                                                            ) : item2.treatmentStatus === 2 ? (
                                                                                <Text style={Styles.statusInprogress}>In progress</Text>
                                                                            ) : item2.treatmentStatus === 3 ? (
                                                                                <Text style={Styles.statusComplete}>Complete</Text>
                                                                            ) : item2.treatmentStatus === 4 ? (
                                                                                <Text style={Styles.statusDiscountinues}>Discontinued</Text>
                                                                            ) : null}
                                                                        </Text>

                                                                    </View>
                                                                    {/* <View style={{ height: 1, backgroundColor: 'black', marginVertical: 10 }} /> */}
                                                                    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                                                                        <Modal.Content maxWidth="350">
                                                                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                                                                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                                                                            <Modal.Body>
                                                                                <VStack space={3}>
                                                                                    <TouchableOpacity onPress={() => editTreatment()}>
                                                                                        <HStack alignItems="center" marginBottom="11">
                                                                                            <Text style={{ fontFamily: 'Poppins-Regular' }}>Edit Treatment</Text>
                                                                                        </HStack><Divider />
                                                                                    </TouchableOpacity>
                                                                                    <TouchableOpacity onPress={() => printData()}>
                                                                                        <HStack alignItems="center" marginBottom="11"  >
                                                                                            <Text style={{ fontFamily: 'Poppins-Regular' }}>Print</Text>
                                                                                        </HStack><Divider />
                                                                                    </TouchableOpacity>
                                                                                    <TouchableOpacity onPress={() => openModelForStatus()}>
                                                                                        <HStack alignItems="center" marginBottom="11" >
                                                                                            <Text style={{ fontFamily: 'Poppins-Regular' }}>Treatment Status Update</Text>
                                                                                        </HStack><Divider />
                                                                                    </TouchableOpacity>
                                                                                    <TouchableOpacity onPress={() => onOpendeleteConfirmation()}>
                                                                                        <HStack alignItems="center" marginBottom="11" >
                                                                                            <Text style={{ fontFamily: 'Poppins-Regular' }}>Delete Treatment</Text>
                                                                                        </HStack>
                                                                                    </TouchableOpacity>

                                                                                </VStack>
                                                                            </Modal.Body>
                                                                        </Modal.Content>
                                                                    </Modal>

                                                                    <Modal isOpen={showModal1} onClose={() => setShowModal1(false)} size="lg">
                                                                        <Modal.Content maxWidth="450">
                                                                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                                                                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Update Treatment Status</Text></Modal.Header>

                                                                            <Modal.Body>
                                                                                <VStack space={3}>
                                                                                    <Picker selectedValue={service}
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            height: height * 0.07,
                                                                                            borderColor: "#e0e0e0",
                                                                                            fontFamily: 'Poppins-Regular',
                                                                                            paddingLeft: 10,
                                                                                            fontSize: 16,
                                                                                            borderRadius: 5,
                                                                                            backgroundColor: "white"
                                                                                        }} onValueChange={itemValue => setService(itemValue)}>
                                                                                        <Picker.Item label="Planned" value={1} fontFamily={'Poppins-Regular'} />
                                                                                        <Picker.Item label="In Progress" value={2} fontFamily={'Poppins-Regular'} />
                                                                                        <Picker.Item label="Completed" value={3} fontFamily={'Poppins-Regular'} />
                                                                                        <Picker.Item label="Discontinued" value={4} fontFamily={'Poppins-Regular'} />
                                                                                    </Picker>

                                                                                </VStack>
                                                                            </Modal.Body>
                                                                            <Modal.Footer>
                                                                                <View style={{ flexDirection: 'row' }}>
                                                                                    <TouchableOpacity onPress={() => { setShowModal1(false); }}>
                                                                                        <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                                                                            <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                                                                                        </View>
                                                                                    </TouchableOpacity>

                                                                                    <TouchableOpacity onPress={() => updateStatus()}>
                                                                                        <View style={CommonStylesheet.buttonContainersave1}>
                                                                                            <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                                                                        </View>
                                                                                    </TouchableOpacity>
                                                                                </View>

                                                                            </Modal.Footer>
                                                                        </Modal.Content>
                                                                    </Modal>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </Collapsible>
                                                </View>
                                            )))))}
                                </ScrollView>
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
                                />} onPress={() => navigation.navigate('AddTreatment', {
                                    clinicID: myclinicID,
                                    patientID: mypatientID
                                })} />
                        </TouchableOpacity>
                    </View>
                </>
            }
        </>
    );
}

export default Treatment;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        // borderColor: 'red',
        // borderWidth: 2,
        width: '100%',
        height: '100%',

    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        width: '100%',
        height: 150,

    },
    cardtext: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom:5,
        // marginTop:5

    },
    line: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',
        paddingBottom: 5, // Adjust as needed
    },
    imageatQualification1: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // borderWidth: 1,
        width: 70,
        height: 70,
        borderRadius: 10,
        // marginTop: 20,
        alignSelf: 'center'

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
        height: 50,
        width: 50,
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
        // marginLeft: 10
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
        padding: 10,
    },
    headerText: {
        textAlign: 'left',
        fontSize: regularFontSize,
        fontWeight: '500',

        fontFamily: 'Poppins-Bold', alignSelf: 'center'

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
        fontSize: regularFontSize,
        color: 'blue',
        fontFamily: 'Poppins-SemiBold',

    },
    statusInprogress: {
        fontSize: 14,
        color: '#00bc00',
        fontFamily: 'Poppins-SemiBold',

    },
    statusComplete: {
        fontSize: 14,
        color: 'green',
        fontFamily: 'Poppins-SemiBold',

    },
    statusDiscountinues: {
        fontSize: 14,
        color: 'red',
        fontFamily: 'Poppins-SemiBold',

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