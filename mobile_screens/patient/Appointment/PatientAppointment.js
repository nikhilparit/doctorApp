import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
    Image,
    Stack,
    Input,
    Button,
    Thumbnail, List, ListItem, Separator, Modal, HStack, Fab,
    VStack,
    Badge
} from 'native-base';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
import Api from '../../../api/Api';
import Axios from 'axios';
import moment from 'moment';
import PatientHeader from '../../../components/PatientHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeaders } from '../../../utils/apiHeaders';
import Loader from '../../../components/Loader';
const secondaryCardHeader = Math.min(width, height) * 0.033;
const regularFontSize = width < 600 ? 15 : 18;
const MaxWidth = width < 600 ? 80 : 80;
const HeightSizePerScreen = width < 600 ? 150 : 160;



function PatientAppointment({ route }) {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [GetAllAppoinmentList, setGetAllAppoinmentList] = useState([]);
    const [dashboard, setDashboard] = useState({});
    const mypatientID = route.params.patientID;
    // const myclinicID = route.params.clinicID;
    const [name, setName] = useState('');
    const [AppointmentStatus, setAppointmentStatus] = useState('');
    //Reschedule Appoitment
    const [appointmentID, setAppointmentID] = useState('');
    const [myclinicID, setmyclinicID] = useState('');
    const [loading, setLoading] = useState(false);
      const [userName, setuserName] = useState('');

    const readData = async () => {
        setLoading(true);
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyclinicID(user.clinicID);
        setuserName(user.userName);
        const formData0 = {
            patientID: mypatientID,
        }
        // //console.log('Data To Pass', formData0);
        try {
            Axios.post(`${Api}Patient/GetPatientAllDetailForMobile`, formData0, { headers }).then(resp => {
                //console.log('Patient Dashboard', resp.data);
                setDashboard(resp.data);
                setName(resp.data.pateintFullName);
            });
        } catch (error) {
            //console.log(error);
        }
        const formData = {
            clinicID: user.clinicID,
            patientID: mypatientID,
            providerID: "00000000-0000-0000-0000-000000000000",
            startDate: "1900-01-01",
            endDate: moment().add(1, 'year').format('YYYY-MM-DD'),
            pageIndex: 0,
            pageSize: 0

        }
        //console.log(formData);
        try {
            Axios.post(`${Api}Patient/GetAllAppoinmentList`, formData, { headers }).then(resp => {
                //console.log("GetAllAppoinmentList", resp.data);
                setGetAllAppoinmentList(resp.data);
            })
        } catch (error) {
            //console.log(error.message);
        }
        setLoading(false);
    }
    useFocusEffect(
        useCallback(() => {
            readData();
        }, []) // Empty dependency array ensures the effect runs only when the screen is focused
    );
    const operationString = () => {
        let text = name;
        if (text) {
            // //console.log(text);
            let initials = text
                .split(' ') // Split the string into an array of words
                .slice(1)
                .filter(word => word.length > 0) // Remove empty elements
                .map(word => word[0]) // Get the first character of each word
                .join(' '); // Join the characters with a space
            // //console.log(initials);

            return initials;
        } else {
            //console.log('patientFullName is undefined or not accessible.');
            // Handle the case where patientFullName is undefined or not accessible
        }
    }
    const openModal = (id, status) => {
        //console.log("Appointment ID", id, status);
        setAppointmentID(id);
        setAppointmentStatus(status);
        setShowModal(true)
    }
    const rescheduleAppointment = () => {
        //console.log('AT FUN.', appointmentID);
        if (AppointmentStatus == 'Cancelled') {
            alert('Cancelled appointment can not be rescheduled');
            setShowModal(false);
            return
        }
        navigation.navigate('AddAppointments', {
            // clinicID: myclinicID,
            appointmentID: appointmentID,
            patientID: mypatientID,
            paramkey: 'rescheduleAppointment',
            status: AppointmentStatus
        });
        setShowModal(false)
    }

    return (
        <>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <TouchableOpacity onPress={() => rescheduleAppointment()}>
                                <HStack alignItems="center"  >
                                    <Text fontFamily="poppins-regular">Reschedule</Text>
                                </HStack>
                            </TouchableOpacity>



                        </VStack>
                    </Modal.Body>

                </Modal.Content>
            </Modal>
            <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                {loading ? <Loader /> :
                    <View style={Styles.container}>
                        <View style={Styles.containerPatientInfo}>
                            <PatientHeader patientID={mypatientID} />
                            <ScrollView>
                                <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10, }} >
                                    {GetAllAppoinmentList.map(item => (
                                        <View style={[CommonStylesheet.borderforcardatAppointmentListScreen, { height: HeightSizePerScreen, alignSelf: 'center', marginBottom: 10 }]} >
                                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                                <View style={{ paddingTop: 17, alignItems: 'center', marginLeft: 15, width: '20%', height: '100%' }}>
                                                    <Image
                                                        source={require('../../../assets/images/clock.png')}
                                                        alt="logo.png"
                                                        style={CommonStylesheet.imageofwatchatappointment}
                                                    />
                                                    {/* <Text style={CommonStylesheet.Text}>{moment(item2.startDateTime).subtract(utcOffsetMinutes, 'minutes').format('LT')}</Text>
                                        <Text style={CommonStylesheet.Text}>{moment(item2.endDateTime).subtract(utcOffsetMinutes, 'minutes').format('LT')}</Text> */}
                                                    <Text style={CommonStylesheet.Text}>{moment(item.startDateTime).format('LT')}</Text>
                                                    <Text style={CommonStylesheet.Text}>{moment(item.endDateTime).format('LT')}</Text>

                                                    <View >

                                                        {item.status == 'Engaged' ? <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item.waitingAreaID, item.appointmentID, item.patientID, item.status, item.startDateTime, item.endDateTime, item.providerID)} >
                                                            <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#bfa106', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                <Text style={Styles.Text1}>Engaged</Text></View></TouchableOpacity> : ((item.status == 'Completed') ? <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item.waitingAreaID, item.appointmentID, item.patientID, item.status, item.startDateTime, item.endDateTime, item.providerID)}>
                                                                    <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                        <Text style={Styles.Text1}>Completed</Text></View></TouchableOpacity> :
                                                                    ((item.status == 'Scheduled') ? <TouchableOpacity onPress={() => changeAppointmentState(item.appointmentID, item.patientID, item.status, item.startDateTime, item.endDateTime, item.providerID)}>
                                                                        <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#065695', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                            <Text style={Styles.Text1}>Scheduled</Text>
                                                                        </View></TouchableOpacity> :
                                                                        ((item.status == 'Waiting') ? <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item.waitingAreaID, item.appointmentID, item.patientID, item.status, item.startDateTime, item.endDateTime, item.providerID)} ><View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#383CC1', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}><Text style={Styles.Text1}>Waiting</Text></View></TouchableOpacity> :
                                                                            ((item.status == 'Cancelled') ? <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item.waitingAreaID, item.appointmentID, item.patientID, item.status, item.startDateTime, item.endDateTime, item.providerID)} >
                                                                                <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#A9A9A9', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                                    <Text style={Styles.Text1}>Cancelled</Text></View></TouchableOpacity> : ((item.status == 'Missed') ?
                                                                                        <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item.waitingAreaID, item.appointmentID, item.patientID, item.status, item.startDateTime, item.endDateTime, item.providerID)} >
                                                                                            <View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#da251d', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                                                                <Text style={Styles.Text1}>Missed</Text></View></TouchableOpacity> :
                                                                                        <TouchableOpacity onPress={() => changeAppointmentStateAfterScheduled(item.waitingAreaID, item.appointmentID, item.patientID, item.status, item.startDateTime, item.endDateTime, item.providerID)}><View style={{ width: MaxWidth, height: height * 0.05, backgroundColor: '#333300', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}><Text style={Styles.Rescheduled}>Rescheduled</Text></View></TouchableOpacity>)))))}

                                                    </View>

                                                </View>
                                                <View style={{
                                                    width: '40%', flex: 1, alignItems: 'flex-start', marginTop: 25, marginLeft: 40


                                                }}>
                                                    {/* <TouchableOpacity onPress={() => navigation.navigate('AddAppointments', {
                                            appointmentID: item2.appointmentID,
                                            clinicID: myclinicID,
                                            patientID: item2.patientID,
                                            key: 'Edit'

                                        })}> */}
                                                    <TouchableOpacity>
                                                        <Text style={CommonStylesheet.headertext16}>
                                                            {item.patientName}
                                                        </Text>

                                                        <Text style={CommonStylesheet.textPatientList}>
                                                            {item.mobileNumber}
                                                        </Text>
                                                        <Text style={CommonStylesheet.textPatientList}>
                                                            {item.providerName}
                                                        </Text>
                                                        <Text style={CommonStylesheet.textPatientList}>
                                                            {moment(item.startDateTime).format('dddd')} {moment(item.startDateTime).format('LL')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ width: 20, marginRight: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                                    <TouchableOpacity
                                                        onPress={() => openModal(item.appointmentID, item.status)}>
                                                        <Icon name="ellipsis-v" size={20} color={"#2196f3"} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        </View>
                                    ))}
                                </View>
                            </ScrollView>


                            {/* <ScrollView>
                                
                                <View style={{ marginTop: 10,backgroundColor:'red' }}>
                                    {GetAllAppoinmentList.map(item => (
                                        
                                        <View style={[CommonStylesheet.borderforcardatAppointmentListScreen]} key={item.appointmentID}>
                                            <View style={{ backgroundColor: '#90caf9', marginTop: -0.1, borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, }}>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', color: '#000', fontSize: 14 }}>{moment(item.startDateTime).format('LL')}</Text>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', color: '#000', fontSize: 14 }}>{moment(item.startDateTime).format('LT')}</Text>
                                                    {item.status == 'Scheduled' ?
                                                        <Button style={Styles.btnCard}>
                                                            <Text style={{ color: '#fff', marginTop: 0, fontFamily: 'Poppins-Regular' }}>{item.status}</Text>
                                                        </Button> :
                                                        <Button style={Styles.btnCard1}>
                                                            <Text style={{ color: '#fff', marginTop: 0, fontFamily: 'Poppins-Regular' }}>{item.status}</Text>
                                                        </Button>
                                                    }
                                                </View>
                                                <View style={{ marginTop: -20 }}>
                                                    <Text style={{ margin: 10, fontFamily: 'Poppins-SemiBold', color: '#00923f', fontSize: 14 }}>{item.patientName}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                                <Text style={{ marginLeft: 10 }}>Arrival Time</Text>
                                                <Text style={{ marginRight: 150 }}>{moment(item.startDateTime).format('LT')}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                                <Text style={{ marginLeft: 10 }}>Operation Time</Text>
                                                <Text >00</Text>

                                                <View style={Styles.countContainerComplete}>
                                                    <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 14, marginTop: 4 }} >
                                                        {item.recordCount}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => openModal(item.appointmentID)}>
                                                    <Icon

                                                        name="ellipsis-v"
                                                        size={22}
                                                        color={'#576067'}
                                                        style={Styles.iconDot}
                                                    />
                                                </TouchableOpacity>


                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ marginLeft: 10 }}>Complete Time</Text>
                                                <Text style={{ marginRight: 175 }}>00</Text>
                                            </View>

                                        </View>
                                    ))}
                                </View>
                            </ScrollView> */}

                        </View>
                    </View>
                }
            </View>
        </>
    );
}

export default PatientAppointment;

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
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
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
    Text1: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Poppins-Medium',
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed

    },
    Rescheduled: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Poppins-Medium',
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed

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
        marginTop: 10,
        fontFamily: 'Poppins-Bold'

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

    statusPlanned: {
        fontSize: regularFontSize,
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

    imageContainer: {
        width: width - 0,
        height: 170,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40
    },
    imgContainer: {
        marginBottom: 10
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

    containerCollapse: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -280
        // marginBottom: 340,

    },
    header: {
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#90caf9',
        padding: 10,

    },
    headerText: {
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 10,
        fontFamily: 'Poppins-Bold'

    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        width: '100%',
        height: 150,
    },
    iconDot: {
        marginRight: 20,

    },
    card: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'white',
        height: 185,
        width: width - 10,
        backgroundColor: '#ffff',
        marginLeft: 5,
        marginTop: 10,
        marginBottom: 10
    },
    hdertxt: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginRight: 15

    },
    btnCard: {
        backgroundColor: '#F8c300',
        height: 40,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnCard1: {
        backgroundColor: 'red',
        height: 40,
        width: 115,
        justifyContent: 'center',
        alignItems: 'center'
    },
    countContainerComplete: {
        height: 30,
        width: 30,
        backgroundColor: '#00923f',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        marginRight: 20
    },


})