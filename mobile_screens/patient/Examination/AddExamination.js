import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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
    HStack,
    Fab,
    TextInput,
    Select,
    CheckIcon,
    Checkbox
} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";
import { SelectCountry } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import Axios from 'axios';
import Api from "../../../api/Api";
import moment from "moment";
import { Picker } from '@react-native-picker/picker';
//import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Searchbar } from "react-native-paper";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { height, width } = Dimensions.get('window');
const icon_size = Math.min(width, height) * 0.04;
const secondaryCardHeader = Math.min(width, height) * 0.033;
const fontSize = Math.min(width, height) * 0.03; // Adjust the multiplier as per your requirement
import { getHeaders } from "../../../utils/apiHeaders";
import { useSelector, useDispatch } from "react-redux";
import { fetchExaminationData, InsertPatientExaminationDetail } from "../../../features/examinationSlice";
import { providerList } from "../../../features/commonSlice";
import Toast from "react-native-toast-message";

const AddExamination = ({ route }) => {
    const dispatch = useDispatch();
    const myPatientID = route.params.patientID;
    // console.log(myClinicID);
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [groupValues, setGroupValues] = React.useState([]);
    const [groupValues1, setGroupValues1] = React.useState([]);
    const [service, setService] = React.useState("");
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [patientChiefComplaint, setPatientChiefComplaint] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState([]);
    const [patientdiagnosisType, setPatientDiagnosisType] = useState([]);
    const [selecteddiagnosisType, setSelectedPatientDiagnosisType] = useState([]);
    const [providerInfo, setProviderInfo] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [note, setNote] = useState('');
    const [query, setQuery] = useState('');
    const [query1, setQuery1] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [userName, setuserName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [myClinicID, setmyClinicID] = useState('');


    const readData = async () => {
        try {
            // Get headers and user details
            const headers = await getHeaders();
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            // Set local states
            setmyClinicID(user.clinicID);
            setSelectedProvider(user.name);
            setuserName(user.userName);

            // Define form data
            const formData = {
                clinicID: user.clinicID,
                itemCategory: "PatientChiefComplaint"
            };

            const formData1 = {
                clinicID: user.clinicID,
                itemCategory: "Diagnosis"
            };

            const formData3 = {
                applicationDTO: {
                    clinicID: user.clinicID,
                }
            };

            // Fetch data concurrently
            const [examinationResponse, providerInfoResponse] = await Promise.all([
                dispatch(fetchExaminationData({ formData, formData1 })).unwrap(),
                dispatch(providerList(formData3)).unwrap(),
            ]);

            // Log responses
            // console.log("Chief Complaint Data:", examinationResponse.chiefComplaint);
            // console.log("Diagnosis Data:", examinationResponse.diagnosis);
            // console.log("Provider Info Data:", providerInfoResponse);
            setPatientChiefComplaint(examinationResponse.chiefComplaint);
            setPatientDiagnosisType(examinationResponse.diagnosis);
            setProviderInfo(providerInfoResponse);


        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            //console.log("Focus event triggered");
            readData();
            setRefreshFlag(!refreshFlag);
        });
        //console.log("Unsubscribe called");
        return () => {
            unsubscribe();
        };
    }, [navigation, refreshFlag, selectedProvider]);

    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     //console.log(currentDate);
    //     setShow(false);
    //     setDate(currentDate);
    // };
    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
           // console.log(formattedDate);
            setSelectedDate(formattedDate);// Assuming this is a Date object
            setModalVisible(false);
            setDate(moment(formattedDate));
        }
    };
    // Open Chief Complaint Modal
    const openModal = () => {
        setSelectedComplaint([]);
        setShowModal(true);
    };

    // Open Diagnosis Type Modal
    const openModal1 = () => {
        setSelectedPatientDiagnosisType([]);
        setShowModal1(true);
    };

    // Optimize Search for Chief Complaint
    const onChangeSearch = query => {
        setQuery(query);
        if (query.trim() === "") {
            readData(); // Reload all data only when query is empty
        } else {
            const lowerCaseQuery = query.toLowerCase();
            setPatientChiefComplaint(patientChiefComplaint.filter(item =>
                item.itemTitle.toLowerCase().includes(lowerCaseQuery)
            ));
        }
    };

    // Optimize Search for Diagnosis Type
    const onChangeSearch1 = query1 => {
        setQuery1(query1);
        if (query1.trim() === "") {
            readData(); // Reload all data only when query is empty
        } else {
            const lowerCaseQuery1 = query1.toLowerCase();
            setPatientDiagnosisType(patientdiagnosisType.filter(item =>
                item.itemTitle.toLowerCase().includes(lowerCaseQuery1)
            ));
        }
    };

    // Handle Selection of Chief Complaint
    const handleCheckBox = () => {
        const selectedData = groupValues.map(id =>
            patientChiefComplaint.find(item => item.id === id)
        ).filter(Boolean); // Ensure no undefined entries

        setSelectedComplaint(selectedData);
        setShowModal(false);
    };

    // Handle Selection of Diagnosis Type
    const handleCheckBox1 = () => {
        const selectedData = groupValues1.map(id =>
            patientdiagnosisType.find(item => item.itemID === id)
        ).filter(Boolean); // Ensure no undefined entries

        setSelectedPatientDiagnosisType(selectedData);
        setShowModal1(false);
    };

    const onSaveExamination = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
       // console.log("Selected Provider", selectedProvider);
       // console.log('providerInfo', providerInfo);
        const provider = providerInfo.find(item => item.providerName === selectedProvider);
      //  console.log("provider", provider);
        if (provider == undefined) {
            //alert('Please select doctor.');
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select doctor.',
                text2: 'Please select doctor to continue.',
            });
            return
        }
        const myselectedChiefComplaint = selectedComplaint.map(item => item.itemTitle);
        //console.log(myselectedChiefComplaint);
        if (myselectedChiefComplaint == '' || myselectedChiefComplaint == undefined ||
            selectedProvider == '' || selectedProvider == undefined ||
            date == '' || date == undefined
            // || selecteddiagnosisType == '' || selecteddiagnosisType == undefined || selecteddiagnosisType == ''
        ) {
            // Snackbar.show({
            //     text: 'Required all credentials.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
            //alert('Please select complaint');
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select complaint.',
                text2: 'Please select complaint to continue.',
            });
            return
        }

        const formData =
        {
            clinicID: myClinicID,
            patientExaminationID: "00000000-0000-0000-0000-000000000000",
            patientID: myPatientID,
            dateOfDiagnosis: date.toISOString(),
            providerID: provider.providerID,
            providerName: provider.providerName,
            patientDiagnosisNotes: note,
            flag: false,
            isDeleted: false,
            createdOn: date.toISOString(),
            createdBy: user.userName,
            lastUpdatedOn: date.toISOString(),
            lastUpdatedBy: user.userName,
            rowguid: "00000000-0000-0000-0000-000000000000",

            providerDTO: {
                providerID: provider.providerID,
                providerName: provider.providerName,
                lastUpdatedOn: date.toISOString(),
                isDeleted: false,
                isSelected: false,
                displayInAppointmentsView: false,
                showAllProviders: false,
                userClinicInfoID: "00000000-0000-0000-0000-000000000000",
                clinicID: myClinicID
            },

            patientExaminationDiagnosisListDTO: [],
            patientExaminationChiefComplaintListDTO: [],
            recordCount: 0
        }
        if (selecteddiagnosisType && selecteddiagnosisType.length > 0) {
            for (let i = 0; i < selecteddiagnosisType.length; i++) {
                let arrObj1 = {
                    patientExaminationDiagnosisID: "00000000-0000-0000-0000-000000000000",
                    patientExaminationID: "00000000-0000-0000-0000-000000000000",
                    itemTitle: selecteddiagnosisType[i].itemTitle,
                    treatmentTypeID: selecteddiagnosisType[i].itemID,
                    description: selecteddiagnosisType[i].itemDescription,
                    teethTreatments: null,
                    isDeleted: false,
                    createdOn: date.toISOString(),
                    createdBy: user.userName,
                    lastUpdatedOn: date.toISOString(),
                    lastUpdatedBy: user.userName,
                    lookUpsDTO: {
                        id: "00000000-0000-0000-0000-000000000000",
                        clinicID: myClinicID,
                        itemID: selecteddiagnosisType[i].itemID,
                        itemTitle: selecteddiagnosisType[i].itemTitle,
                        itemDescription: selecteddiagnosisType[i].itemDescription,
                        gender: null,
                        itemCategory: selecteddiagnosisType[i].itemCategory,
                        isDeleted: false,
                        importance: 0,
                        lastUpdatedBy: user.userName,
                        lastUpdatedOn: date.toISOString(),
                        rowguid: "00000000-0000-0000-0000-000000000000",
                        recordCount: 0,
                        medicalTypeID: "00000000-0000-0000-0000-000000000000",
                        patientAttributeData: null,
                        patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
                    },
                    rowguid: "00000000-0000-0000-0000-000000000000"
                }
                formData.patientExaminationDiagnosisListDTO.push(arrObj1)
            }
        }
        else {
            formData.patientExaminationDiagnosisListDTO = [];
        }
        if (selectedComplaint && selectedComplaint.length > 0) {
            for (let i = 0; i < selectedComplaint.length; i++) {
                let arrObj2 = {
                    patientExaminationChiefComplentID: "00000000-0000-0000-0000-000000000000",
                    patientExaminationID: "00000000-0000-0000-0000-000000000000",
                    chiefComplaintID: selectedComplaint[i].itemID,
                    chiefComplaintDescription: selectedComplaint[i].itemDescription,
                    isDeleted: false,
                    createdOn: date.toISOString(),
                    createdBy: user.userName,
                    lastUpdatedOn: date.toISOString(),
                    lastUpdatedBy: user.userName
                }
                formData.patientExaminationChiefComplaintListDTO.push(arrObj2);
            }
        }


        //console.log('Add Examination FormData', formData);
        try {
            await dispatch(InsertPatientExaminationDetail(formData)).unwrap();
            Toast.show({
                type: 'success', // Match the custom toast type
                text1: 'New examination added sucessfully.',
            });
            //alert('New examination added sucessfully.',)
            navigation.goBack('Examination', {
                clinicID: myClinicID,
                patientID: myPatientID
            });

        } catch (error) {
            //console.log(error.message);
            // Snackbar.show({
            //     text: 'Something went wrong.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
        }
    }
    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content width={350} height={500}>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}>
                        <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>
                            Chief Complaint
                        </Text>
                    </Modal.Header>
                    <Searchbar
                        theme={{ colors: { primary: 'gray' } }}
                        placeholder="Search"
                        value={query}
                        style={{ width: 330, margin: 10, alignSelf: 'center' }}
                        onChangeText={onChangeSearch}
                        inputStyle={{
                            fontSize: 14,
                            color: '#5f6067',
                            fontFamily: 'Poppins-Regular',
                        }}
                    />
                    <Modal.Body>
                        <View style={{ paddingHorizontal: 15, marginTop: -10 }}>
                            <Checkbox.Group onChange={setGroupValues} value={groupValues}>
                                {patientChiefComplaint.map((item, index) => (
                                    <Checkbox
                                        value={item.id}
                                        my="1"
                                        marginBottom={4}
                                        key={`${item.id}-${index}`} // Ensures unique keys
                                        colorScheme="blue"
                                    >
                                        <Text style={{ fontFamily: 'poppins-regular' }}>
                                            {item.itemTitle}
                                        </Text>
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity onPress={() => setShowModal(false)}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCheckBox}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}>
                        <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>
                            Please select Date
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Calendar onChange={onChange} value={date} maxDate={new Date()} />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
                <Modal.Content width={350} height={400}>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}>
                        <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>
                            Diagnosis Type
                        </Text>
                    </Modal.Header>
                    <Searchbar
                        theme={{ colors: { primary: 'gray' } }}
                        placeholder="Search"
                        value={query1}
                        style={{ width: 330, margin: 10, height: 50, alignItems: 'center' }}
                        onChangeText={onChangeSearch1}
                        inputStyle={{
                            fontSize: 14,
                            color: '#5f6067',
                            fontFamily: 'Poppins-Regular',
                        }}
                    />
                    <Modal.Body>
                        <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
                            <Checkbox.Group onChange={setGroupValues1} value={groupValues1}>
                                {patientdiagnosisType.map((item, index) => (
                                    <Checkbox
                                        value={item.itemID}
                                        my="1"
                                        marginBottom={4}
                                        key={`${item.itemID}-${index}`} // Ensures unique keys
                                        colorScheme="blue"
                                    >
                                        <Text style={{ fontFamily: 'poppins-regular' }}>
                                            {item.itemDescription}
                                        </Text>
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity onPress={() => setShowModal1(false)}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCheckBox1}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {/* <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}> */}
            <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                <View style={{
                    width: '100%', height: 'auto', padding: 12
                    //borderColor:'red',borderWidth:2, padding:10 
                }}>
                    <Stack space={2} w="100%" mx="auto" justifyContent={'center'}>

                        <View>
                            <Picker
                                selectedValue={selectedProvider}
                                style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: 16,
                                    borderRadius: 5,
                                    backgroundColor: '#fff',
                                    height: height * 0.07,
                                    borderColor: '#e0e0e0',
                                    paddingLeft: 10
                                }}
                                onValueChange={itemValue => setSelectedProvider(itemValue)} // Update the selected provider on change
                            >
                                <Picker.Item label="Select Provider" value={null} />  {/* Default option */}
                                {providerInfo.map(item => (
                                    <Picker.Item
                                        label={item.providerName}
                                        value={item.providerName}
                                        style={styles.fontFamilyForSelectItem}
                                        key={item.providerID}
                                    />
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
                        <Input
                            size="lg"
                            height={height * 0.07}
                            style={styles.inputPlaceholder}
                            borderRadius={5}
                            placeholderTextColor={'#808080'}
                            placeholder="Chief Complaint"
                            onFocus={() => openModal()}
                            value={selectedComplaint.map(item => item.itemTitle).join(', ')}
                        />
                        <Input
                            height={height * 0.07}
                            size="lg"
                            style={styles.inputPlaceholder}
                            borderRadius={5}
                            placeholderTextColor={'#808080'}
                            placeholder="Diagnosis Type"
                            onFocus={() => openModal1()}
                            value={selecteddiagnosisType.map(item => item.itemDescription).join(', ')}
                        />

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

                        <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                            <View style={{}}>
                                <TouchableOpacity onPress={() => onSaveExamination()}>
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
    fontFamilyForSelectItem: {
        fontFamily: 'Poppins-Regular'
    },
    iconLogo: {
        width: width * 0.07, // Adjust width based on screen width
        height: height * 0.07, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    },
    inputFontStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#fff',
        height: height * 0.07,
    }

})

export default AddExamination;