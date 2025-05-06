import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import {
    FormControl,
    Text,
    Input,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    Image,
    Modal,
    HStack, Fab,
    TextInput,
    Select,
    CheckIcon,

} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { SelectCountry } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import Axios from 'axios';
import Api from "../../../api/Api";
import moment from "moment";
import { Picker } from '@react-native-picker/picker';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getHeaders } from "../../../utils/apiHeaders";
import Loader from "../../../components/Loader";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get('window');
const fontSize = Math.min(width, height) * 0.03; // Adjust the multiplier as per your requirement

const EditPatientNotes = ({ route }) => {
    const [showModal, setShowModal] = useState(false);
    const myClinicID = route.params.clinicID;
    //console.log("myClinicID", myClinicID);
    const myPatientID = route.params.patientID;
    //console.log("myPatientID", myPatientID);
    const patientNotesId = route.params.patientNotesId || null;
    //console.log("patientNotesId", patientNotesId);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [groupValues, setGroupValues] = React.useState([]);
    const [service, setService] = React.useState("");
    const [providerInfo, setProviderInfo] = useState([]);
    const [notesInfo, setNotesInfo] = useState({});
    const [show, setShow] = useState(false);
    //user-input
    const [selectedProvider, setSelectedProvider] = useState('');
    const [date, setDate] = useState(new Date());
    const [note, setNotes] = useState('');
    const [providerName, setproviderName] = useState('');
    const [notesDate, setnotesDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmationWindow, setconfirmationWindow] = useState(false);

    const [userName, setuserName] = useState('');

    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     //console.log("Current Date",currentDate);
    //     setnotesDate(currentDate);
    //     setShow(false);
    // };
    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
            //console.log(formattedDate);
            setSelectedDate(formattedDate);// Assuming this is a Date object
            setModalVisible(false);
            setnotesDate(moment(formattedDate));
        }
    };


    const readData = async () => {
        setLoading(true);
        try {
            // Fetch headers and user data
            const headers = await getHeaders();
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            setuserName(user?.userName);

            // Initialize variables
            let drList = [];
            const formData = {
                applicationDTO: {
                    clinicID: myClinicID,
                }
            };

            // Fetch provider info
            const providerResponse = await Axios.post(`${Api}patient/GetProviderInfo`, formData, { headers });
            if (providerResponse.data) {
                //console.log('Provider Info', providerResponse.data);
                setProviderInfo(providerResponse.data);
                drList = providerResponse.data; // Assign the fetched data to drList
            }

            // Fetch patient notes
            const formData1 = {
                clinicID: myClinicID,
                patientNotesId: patientNotesId
            };
            //console.log('Data To Pass', formData1);

            const notesResponse = await Axios.post(`${Api}Patient/GetPatientNoteByID`, formData1, { headers });
            if (notesResponse.data) {
                //console.log('Notes Info', notesResponse.data);
                setNotesInfo(notesResponse.data);

                const { notesDate, notes, providerId } = notesResponse.data;
                setnotesDate(notesDate);
                setNotes(notes);

                // Find the selected doctor
                const selectedDoctor = drList.find(item => item.providerID === providerId);
                ////console.log('Selected Doctor', selectedDoctor);
                setproviderName(selectedDoctor.providerName);
            }
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        readData()
    }, [isFocused, providerName]);

    const updateNotes = async () => {
        setLoading(true);
        //console.log(providerName)
        const headers = await getHeaders();
        if (providerName == '' || providerName == undefined) {
            // Snackbar.show({
            //     text: 'Please select doctor.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });

            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select doctor',
                text2: 'Please select doctor to continue.',
            });
            return
        }
        const selectedProviderID = providerInfo.filter(item => item.providerName == providerName);
        //console.log("Selected Provider ID", selectedProviderID[0].providerID);
        const formData = {
            patientNotesId: patientNotesId,
            patientId: myPatientID,
            clinicId: myClinicID,
            providerId: selectedProviderID[0].providerID,
            notesDate: notesDate,
            category: null,
            notes: note,
            isDeleted: false,
            createdBy: userName,
            createdOn: notesDate,
            lastUpdatedBy: userName,
            lastUpdatedOn: notesDate,
            key: "Update",
            recordCount: 0,
            providerName: null
        }
        //console.log("Update Notes FormData", formData);

        try {
            Axios.post(`${Api}Patient/_InsertUpdateDeletePatientNotes`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                if (resp.data) {
                    // Snackbar.show({
                    //     text: 'Note edited sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'Note edited sucessfully.',
                        // text2: 'Please select patient to continue.',
                    });
                    // alert('Note edited sucessfully.');
                    navigation.goBack('Notes', {
                        clinicID: myClinicID,
                        patientID: myPatientID
                    });
                }
            })
        } catch (error) {
            //console.log(error.message);
        } finally {
            setLoading(false);
        }

    }

    const deleteNotes = async () => {
        setLoading(true);
        const headers = await getHeaders();
        if (providerName == '' || providerName == undefined) {
            // Snackbar.show({
            //     text: 'Please select doctor.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select doctor',
                text2: 'Please select doctor to continue.',
            });
            return
        }
        const selectedProviderID = providerInfo.filter(item => item.providerName == providerName);
        //console.log("Selected Provider ID", selectedProviderID[0].providerID);
        const formData = {
            patientNotesId: patientNotesId,
            patientId: myPatientID,
            clinicId: myClinicID,
            providerId: selectedProviderID[0].providerID,
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
                    //alert('Note deleted sucessfully.');
                    navigation.goBack('Notes', {
                        clinicID: myClinicID,
                        patientID: myPatientID
                    });
                }
            })
        } catch (error) {
            //console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? <Loader /> :
                <>
                    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Please select Date</Text></Modal.Header>
                            <Modal.Body>
                                <Calendar
                                    onChange={onChange}
                                    value={date}
                                    maxDate={new Date()}
                                />
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
                        <View style={{ marginTop: 5, padding: 10 }}>
                            <Stack space={2} w="100%" mx="auto">
                                <View>
                                    <Picker
                                        style={{
                                            // width: '100%',
                                            height: height * 0.07,
                                            borderColor: '#e0e0e0',
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: 16,
                                            borderRadius: 5,
                                            backgroundColor: "white",
                                            paddingLeft: 10
                                        }}
                                        selectedValue={providerName} onValueChange={itemValue => setproviderName(itemValue)}>
                                        {providerInfo.map(item => (
                                            <Picker.Item label={item.providerName} value={item.providerName} key={item.providerID} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Input
                                        width={'92%'}
                                        onFocus={setModalVisible}
                                        height={height * 0.07}
                                        style={styles.inputPlaceholder}
                                        borderRadius={5}
                                        placeholderTextColor={'#888888'}
                                        placeholder="Select Date"

                                        value={moment(notesDate).format('LL')}>
                                    </Input>

                                    <View style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                                        <TouchableOpacity onPress={() => {
                                            setModalVisible(!modalVisible);
                                        }}>
                                            <Image
                                                source={require('../../../assets/images/calendarDash.png')} alt="logo.png"
                                                style={{ height: 34, width: 36, borderRadius: 5 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Input
                                        width={'100%'}
                                        height={height * 0.07}
                                        size="lg"
                                        value={note}
                                        onChangeText={(value) => setNotes(value)}
                                        style={styles.inputPlaceholder}
                                        borderRadius={5}
                                        placeholderTextColor={'#808080'}
                                        placeholder="Add Notes"


                                    />
                                    {/* <TouchableOpacity>
                            <View style={{justifyContent:'center',padding:5,width:'10%'}}>
                                <Icon
                                    name="microphone"
                                    size={icon_size}
                                    color={"#2196f3"}
                                     />
                                </View>
                            </TouchableOpacity> */}
                                </View>

                                <Box style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, }}>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => updateNotes()}>
                                            <View style={CommonStylesheet.buttonContainersaveatForm}>
                                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => setconfirmationWindow(true)}>
                                            <View style={CommonStylesheet.buttonContainerdelete}>
                                                <Text style={CommonStylesheet.ButtonText}>Delete</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Box>

                            </Stack>
                        </View>





                    </View>
                </>
            }
        </>
    );
};


const styles = StyleSheet.create({


    dropdown: {
        margin: 16,
        height: 40,
        width: 340,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    imageStyle: {
        width: 24,
        height: 24,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    ButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 300,
        height: 260,
        display: 'flex',
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#A6A6A6',
        backgroundColor: '#FFFFFF',
        //opacity: 0.5,
        // borderRadius:10
    },

})

export default EditPatientNotes;