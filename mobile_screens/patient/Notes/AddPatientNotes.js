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
import { Picker } from '@react-native-picker/picker';
import Axios from 'axios';
import Api from "../../../api/Api";
import moment from "moment";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import Snackbar from "react-native-snackbar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { height, width } = Dimensions.get('window');
const fontSize = Math.min(width, height) * 0.03; // Adjust the multiplier as per your requirement
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeaders } from "../../../utils/apiHeaders";
import Loader from "../../../components/Loader";
import Toast from "react-native-toast-message";

const AddPatientNotes = ({ route }) => {
    const [showModal, setShowModal] = useState(false);
    //const myClinicID = route.params.clinicID;
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
    const [show, setShow] = useState(false);
    //user-input
    const [selectedProvider, setSelectedProvider] = useState('');
    const [date, setDate] = useState(new Date());
    const [note, setNote] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [myClinicID, setmyClinicID] = useState('');
    const [userName, setuserName] = useState('');
    const [loading, setLoading] = useState(false);
    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
            //console.log(formattedDate);
            setSelectedDate(formattedDate);// Assuming this is a Date object
            setModalVisible(false);
            setDate(moment(formattedDate));
        }
    };


    const readData = async () => {
        setLoading(true);
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setSelectedProvider(user.name);
        setuserName(user.userName);
        setmyClinicID(user.clinicID);
        const formData =
        {
            applicationDTO: {
                clinicID: user.clinicID,
            }
        }
        //console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}patient/GetProviderInfo`, formData, { headers }).then(resp => {
                //console.log('Provider Info', resp.data);
                setProviderInfo(resp.data);
            });
        } catch (error) {
            //console.log(error.message);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        readData()
    }, [isFocused]);

    const onaddNotes = async () => {
        //console.log(selectedProvider);
        const headers = await getHeaders();
        if (!selectedProvider || !note) {
            Toast.show({
              type: 'error', // Match the custom toast type
              text1: 'All credentials are required.',
            });
            return;
          }
        const drName = providerInfo.filter(item => item.providerName === selectedProvider);
        //console.log("DR NAME", drName);

        const formData = {
            patientNotesId: "00000000-0000-0000-0000-000000000000",
            patientId: myPatientID,
            clinicId: myClinicID,
            providerId: drName[0].providerID,
            notesDate: date.toISOString(),
            category: null,
            notes: note,
            isDeleted: false,
            createdBy: userName,
            createdOn: date.toISOString(),
            lastUpdatedBy: userName,
            lastUpdatedOn: date.toISOString(),
            key: "Add",
            recordCount: 0,
            providerName: drName[0].providerName
        }
        //console.log("Add Notes FormData", formData);

        try {
            setLoading(true);
            Axios.post(`${Api}Patient/_InsertUpdateDeletePatientNotes`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                if (resp.data) {
                    // Snackbar.show({
                    //     text: 'New note added sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'New note added sucessfully.',
                        //text2: 'Please select patient to continue.',
                    });
                   // alert('New note added sucessfully.'),
                        navigation.goBack('Notes', {
                            clinicID: myClinicID,
                            patientID: myPatientID
                        });
                    setLoading(false);
                }
            })
        } catch (error) {
            //console.log(error.message);
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

                    {/* <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}> */}
                    <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                        <View style={{ marginTop: 5, padding: 10 }}>
                            <Stack space={2} w="100%" mx="auto">
                                <View>
                                    <Picker width={width - 15} size={'lg'}
                                        style={{
                                            height: height * 0.07,
                                            borderColor: '#e0e0e0',
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: 16,
                                            borderRadius: 5,
                                            backgroundColor: "white",
                                            paddingLeft: 10
                                        }}
                                        selectedValue={selectedProvider}
                                        onValueChange={itemValue => setSelectedProvider(itemValue)}>
                                        <Picker.Item label="Select Provider" value={null} />
                                        {providerInfo.map(item => (
                                            <Picker.Item label={item.providerName} value={item.providerName} style={styles.fontFamilyForSelectItem} key={item.providerID} />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Input
                                        width={'92%'}
                                        onFocus={setModalVisible}
                                        height={height * 0.07}
                                        style={styles.inputPlaceholder}
                                        borderRadius={5}
                                        placeholderTextColor={'#888888'}
                                        placeholder="Date Of Diagnosis"
                                        value={moment(date).format('LL')}
                                    />
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

                                        onChangeText={(value) => setNote(value)}
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
                                <Box style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => onaddNotes()}>
                                            <View style={CommonStylesheet.buttonContainersaveatForm}>
                                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
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
        // opacity: 0.5,
        // borderRadius:10
    },

})

export default AddPatientNotes;