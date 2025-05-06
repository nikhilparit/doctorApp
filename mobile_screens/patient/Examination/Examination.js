import React, { useState, useContext,useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Modal, HStack, VStack, Fab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Collapsible from 'react-collapsible';
import { contextData } from './Examinations';
import moment from 'moment';
import PatientHeader from '../../../components/PatientHeader';
import Loader from '../../../components/Loader';

const { height, width } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const mainCardHeader = Math.min(width, height) * 0.04;
//const secondaryCardHeader = Math.min(width, height) * 0.030;
const secondaryCardHeader = 16;//jyo1
const regularFontSize = width < 600 ? 14 : 16;

function Examination() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { examination, myClinicID, myPatientID } = useContext(contextData);

    const [expandedStates, setExpandedStates] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // Display loader for 2 seconds

        return () => clearTimeout(timer); // Clean up the timer when the component unmounts
    }, []);

    const toggleExpanded = (patientExaminationID) => {
        //console.log(`Toggling ${patientExaminationID}`);  // Debugging line
        setExpandedStates((prevState) => ({
            ...prevState,
            [patientExaminationID]: !prevState[patientExaminationID],
        }));
    };

    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header>Actions</Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <TouchableOpacity>
                                <HStack alignItems="center">
                                    <Text fontWeight="medium">Send SMS</Text>
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <Text fontWeight="medium">Send Email</Text>
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <HStack alignItems="center" justifyContent="space-between" >
                                    <Text fontWeight="medium">Share on WhatsApp</Text>
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <HStack alignItems="center" justifyContent="space-between">
                                    <Text fontWeight="medium">Print Prescription</Text>
                                </HStack>
                            </TouchableOpacity>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {loading ? <Loader /> :
                <>
                    {/* <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={[CommonStylesheet.backgroundimage]}> */}
                    <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                        <ScrollView>
                            {examination && examination.map(item1 => item1.patientExaminationDTOList.map(item2 => (
                                <View key={item2.patientExaminationID}>
                                    <View style={{ margin: 10 }}>
                                        <TouchableOpacity onPress={() => toggleExpanded(item2.patientExaminationID)}>
                                            <View style={Styles.header}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={Styles.headerText}>{moment(item1.examinationDate).format('LL')}</Text>
                                                    <Icon name="caret-down" size={22} color={'white'} style={{ flexDirection: 'row', marginTop: 3 }} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <Collapsible open={expandedStates[item2.patientExaminationID]}>
                                            <View style={Styles.content}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -10 }}>

                                                    <Text style={{ textAlign: 'left', marginLeft: -12, fontSize: 16, fontFamily: 'Poppins-Regular' }}>
                                                        <Icon name="user" size={15} color={"#2196f3"} />
                                                        <Text style={{ marginLeft: 5 }}>{item2.providerName}</Text>

                                                    </Text>
                                                    <TouchableOpacity onPress={() => navigation.navigate('EditExamination', {
                                                        patientExaminationID: item2.patientExaminationID,
                                                        clinicID: myClinicID,
                                                        patientID: myPatientID,
                                                    })}>
                                                        <View style={{ justifyContent: 'center', marginRight: -10 }}>
                                                            <Icon name="pen" size={15} color={"#2196f3"} />
                                                        </View>
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

                                            <View style={[{ backgroundColor: '#fff', }]}>

                                                <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
                                                    <Text style={{ fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize, width: width < 600 ? 150 : 130 }}>Chief Complaint</Text>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 30 : 30 }}>:</Text>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 250 : 200 }}>{item2.patientExaminationChiefComplaintString}</Text>
                                                </View>


                                                <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
                                                    <Text style={{ fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize, width: width < 600 ? 150 : 130 }}>Diagnosis</Text>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 30 : 30 }}>:</Text>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 250 : 200 }}>{item2.patientExaminationDiagnosisString}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, marginBottom: 10, }}>
                                                    <Text style={{ fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize, width: width < 600 ? 150 : 130 }}>Notes</Text>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 30 : 30 }}>:</Text>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 250 : 200 }}>{item2.patientDiagnosisNotes}</Text>
                                                </View>
                                            </View>
                                        </Collapsible>
                                    </View>
                                </View>
                            )))}
                        </ScrollView>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <Fab
                                style={Styles.fab}
                                renderInPortal={false}
                                size={'md'}
                                icon={<Icon name="plus" size={10} color={"white"} />}
                                onPress={() => navigation.navigate('AddExamination', {
                                    clinicID: myClinicID,
                                    patientID: myPatientID
                                })}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            }
        </>
    );
}


export default Examination;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    fab: {
        position: 'absolute',
        backgroundColor: '#2196f3',
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerCollapse: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -280
    },
    imageContainer: {
        width: width - 0,
        height: 190,
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
        backgroundColor: '#90caf9',
        padding: 10,
    },
    headerText: {
        textAlign: 'left',
        fontSize: regularFontSize,
        fontWeight: '500',
        marginTop: 5,
        fontFamily: 'Poppins-Bold',

    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        width: '100%',
        height: 'auto',
    },
    iconDot: {
        marginTop: 4
    },
    userImage: {
        justifyContent: 'flex-start',
        width: 80,
        height: 80,
        borderRadius: 55,
        marginVertical: 70,
        marginHorizontal: 20
    }
});
