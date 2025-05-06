import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Switch } from 'react-native-paper';
import {
    Image,
    Stack,
    Input,
    Button,
    Select,
    CheckIcon,
    Box,
    Modal,
    Checkbox,
    Badge
} from 'native-base';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import Axios from 'axios';
import Api from '../../../api/Api';
import moment from 'moment';
import PatientHeader from '../../../components/PatientHeader';
//import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from 'react-native-web';
import { getHeaders } from '../../../utils/apiHeaders';
import { useSelector, useDispatch } from 'react-redux';
import { GetPatientAllDetailForMobile, } from '../../../features/patientsSlice';
import { fetchCountryAndStateData, MedicalAttributes } from '../../../features/commonSlice';
import { GetPatientContactDetailByPatientIDforMobile, SaveOrUpdatePatientContactDetailforMobile } from '../../../features/patientprofileSlice';
import Toast from 'react-native-toast-message';
const { height, width } = Dimensions.get('window');
const mainCardHeader = Math.min(width, height) * 0.04;
const regularFontSize = width < 600 ? 15 : 18;
const primaryFontSize = width < 600 ? 17 : 22;

function PatientMoreDetails({ route }) {

    const dispatch = useDispatch();
    const dashboard = useSelector((state => state.patient.PatientAllDetail)) || {};
    const country = useSelector((state => state.common.countryList)) || [];
    const state = useSelector((state => state.common.stateList)) || [];
    const medicalAttributesData = useSelector((state => state.common.MedicalAttributesList)) || [];
    // const loading =  useSelector((state => state.common.loading)) ||false;
    const myPatientID = route.params.patientID;
    const myclinicID = route.params.clinicID;
    //console.log(myPatientID, myclinicID);
    const navigation = useNavigation();
    const [groupValues, setGroupValues] = React.useState([]);
    const [service, setService] = React.useState("");
    const [switchOn, setSwitchOn] = useState(false);
    // const [dashboard, setDashboard] = useState({});
    const [patientDetails, setPatientDetils] = useState({});
    const [loading, setLoading] = useState(true);
    //userInputs
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    //Drop-downs
    const [provider, setProvider] = useState([]);
    const [titleData, setTitleData] = useState([]);
    const [occupationData, setOccupationData] = useState([]);
    //const [medicalAttributesData, setMedicalAttributesData] = useState([]);
    // const [country, setCountry] = useState([]);
    // const [state, setState] = useState([]);
    //User Inputs
    // const [title, setTitle] = useState('');
    // const [fname, setFname] = useState('');
    // const [lname, setLname] = useState('');
    const [mobile, setMobile] = useState('');
    // const [selectedProvider, setSelectedProvider] = useState('');
    const [providerName, setproviderName] = useState('');
    // const [occupation, setOccupation] = useState('');
    // const [medicalAttribute, setMedicalAttribute] = useState('');
    const [caseNo, setCase] = useState('');
    // const [dob, setDob] = useState('');
    // const [gender, setGender] = useState('');
    const [address1, setAddress1] = useState('');
    // const [address2, setAddress2] = useState('');
    // const [medicalAlert, setMedicalAlert] = useState('');
    // const [reference, setReference] = useState('');
    // const [notes, setNotes] = useState('');
    // const [language, setLanguage] = useState('');
    const [email, setEmail] = useState('');
    const [area, setArea] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(102);
    const [selectedState, setSelectedState] = useState('Maharashtra');
    const [zipCode, setZipCode] = useState('');
    const [name, setName] = useState('');
    const [ItemName, setItemName] = useState([]);
    const [selectedtextState, setselectedtextState] = useState('');
    const [token, setToken] = useState('');
    const [myClinicID, setmyClinicID] = useState('');

    //handle modal and its values
    const [showModal, setShowModal] = useState(false);
    const [selectedMedicalAlert, setSelectedMedicalAlert] = useState([]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const readData = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const headers = await getHeaders();
        const myDrID = await AsyncStorage.getItem('name');
       // console.log("Selected Doctor", myDrID);
        setproviderName(myDrID);
        setmyClinicID(user.clinicID,);
        const formData1 = {
            patientID: myPatientID,
        }
        const formData2 = { countryID: 102 };
        const formDataPatientMedicalAttributes = {
            clinicID: user.clinicID,
            itemCategory: "PatientMedicalAttributes"
        }
        const formData3 = {
            patientID: myPatientID
        }
        try {
            const [GetPatientAllDetail, CountryAndStateData, PatientMedicalAttributes, GetPatientContactData] = await Promise.all([
                await dispatch(GetPatientAllDetailForMobile(formData1)).unwrap(),
                await dispatch(fetchCountryAndStateData({ formData: formData2 })).unwrap(),
                await dispatch(MedicalAttributes(formDataPatientMedicalAttributes)).unwrap(),
                await dispatch(GetPatientContactDetailByPatientIDforMobile(formData3)).unwrap(),
            ]);
            setPatientDetils(GetPatientContactData);
            setName(GetPatientContactData.fullName);
            const {
                area,
                mobileNumber,
                patientCode,
                addressLine1,
                street,
                city,
                emailAddress1,
                zipCode,
                //country,
                //stateName
            } = GetPatientContactData;
            setArea(area);
            setMobile(mobileNumber);
            setCase(patientCode);
            setAddress1(addressLine1);
            setCity(city);
            setStreet(street);
            setEmail(emailAddress1);
            setZipCode(zipCode);
           // setSelectedCountry(country);
            //setselectedtextState(stateName);
            return {
                GetPatientAllDetail: GetPatientAllDetail?.data,
                CountryAndStateData: CountryAndStateData?.data,
                PatientMedicalAttributes: PatientMedicalAttributes?.data,
                GetPatientContactData: GetPatientContactData?.data
            };
        } catch (error) {
            console.error("An error occurred:", error);
            return { error: true };
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setLoading(true);
        readData();
    }, []);


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        //console.log(currentDate);
        setShow(false);
        setDob(currentDate);
    };
    const showDatepicker = () => {
        setShow(true);
    };
    const handleChange = (value) => {
        // Remove any non-numeric characters from the input
        const numericValue = value.replace(/[^0-9]/g, '');
        setZipCode(numericValue);
    };

    const getState = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        }
        //console.log('selectedCountry', selectedCountry);
        //setselectedtextState('');
        //console.log(selectedCountry, "selectedCountryID");
        const formData = {
            countryID: selectedCountry || 102,
            countryCode: "string",
            countryName: "string",
            lastUpdatedBy: "string",
            lastUpdatedOn: "2023-03-08T10:04:30.925Z"
        }
        //console.log("form Data", formData);
        try {
            await Axios.post(`${Api}Clinic/GetStateByCountryID`, formData, { headers }).then(resp => {
                const stateData = resp.data
               // console.log('Get State By CountryID', stateData);
                setState(stateData);
            });
        }
        catch (error) {
            //console.log(error);
        }
    }
    const openModal = () => {
        setSelectedMedicalAlert([]);
        setShowModal(true);
    }
    const handleCheckBox = () => {
        //console.log(groupValues);
        const data = [];
        for (let i = 0; i < groupValues.length; i++) {
            const id = groupValues[i];
            // Find the corresponding author information
            const author = medicalAttributesData.find(item => item.id === id);
            if (author) {
                data.push(author);
            }
        }
        let itemName = [];
        //console.log("FINAL DATA Medical Alert", data);
        //console.log("DATA Length", data.length);
        for (let i = 0; i < data.length; i++) {
            itemName.push(data[i].itemTitle);
        };
        setItemName(itemName);
        setSelectedMedicalAlert(data);
        setShowModal(false);
    }

    const editPatient = async () => {
        if (email !== '') {
            if (!emailRegex.test(email)) {
                //alert("Invalid Email. Please write email in correct format");
                Toast.show({
                    type: 'error', // Match the custom toast type
                    text1: 'Invalid Email.',
                    text2: 'Please write email in correct format.',
                });
                return;
            }
        }
        const headers = await getHeaders();
        //console.log(selectedState, selectedCountry);
        const selectedStateData = state.filter(item => item.stateCode == selectedState);
        //console.log("SELECTED STATE", selectedStateData);
        const itemIDs = [];
        const itemNames = [];
        let formData = { ...patientDetails };
        formData.emailAddress1 = email;
        formData.addressLine1 = address1;
        //formData.area = area;
        formData.street = street,
            formData.city = city;
        if (selectedCountry == 102) {
            formData.country = parseInt(selectedCountry);
            formData.state = (selectedStateData[0].stateID).toString();
            formData.stateName = selectedStateData[0].stateDesc;
        } else {
            formData.country = parseInt(selectedCountry);
            formData.state = selectedtextState;
            formData.stateName = selectedtextState;
        }
        formData.zipCode = zipCode;
        formData.patientMedicalHistoryList = [];

        if (selectedMedicalAlert && selectedMedicalAlert.length > 0) {
            for (let i = 0; i < selectedMedicalAlert.length; i++) {
                let arrObj2 = {
                    patientMedicalDetailID: "00000000-0000-0000-0000-000000000000",
                    patientID: myPatientID,
                    itemID: selectedMedicalAlert[i].itemID,
                    itemlistID: (selectedMedicalAlert[i].itemID).toString(),
                    itemNames: selectedMedicalAlert[i].itemTitle,
                    medicalAttributesCategory: "PatientMedicalAttributes",
                    medicalAttributeValue: null,
                    itemDescription: selectedMedicalAlert[i].itemDescription,
                    lastUpdatedBy: null,
                    lastUpdatedOn: date.toISOString(),
                    pateintFullName: dashboard.pateintFullName,
                    mobileNumber: dashboard.mobileNumber,
                    patientCode: dashboard.patientCode,
                    patientNotes: dashboard.patientNotes,
                    patientAllDetailDTO: {
                        patientID: myPatientID,
                        examinationCount: 0,
                        fileCount: 0,
                        treatmentsCount: 0,
                        prescriptionsCount: 0,
                        billlingAmount: 0,
                        pateintFullName: dashboard.pateintFullName,
                        mobileNumber: dashboard.mobileNumber,
                        imagethumbnail: null,
                        strImagethumbnail: "null",
                        imagePath: "null",
                        gender: dashboard.gender,
                        strPateintMedicalAttributes: null,
                        itemDescription: null,
                        patientCode: dashboard.patientCode,
                        netTreatmentCost: 0,
                        balance: 0,
                        emailID: null,
                        nextAppointmentDate: date.toISOString(),
                        appointmentCount: 0
                    }
                }
                formData.patientMedicalHistoryList.push(arrObj2);
            }
        }

        for (let i = 0; i < selectedMedicalAlert.length; i++) {
            itemIDs.push(selectedMedicalAlert[i].itemID);
            itemNames.push(selectedMedicalAlert[i].itemTitle);
        }
        formData.itemlistID = itemIDs.join(',');
        formData.itemNames = itemNames.join(',');
        //console.log("itemListID:", itemIDs.join(','));
        //console.log("itemNames:", itemNames.join(','));
        //console.log("Edit Form Data", formData);
        try {
            dispatch(SaveOrUpdatePatientContactDetailforMobile(formData));
            //alert('Patient contacts save successfully.');
            Toast.show({
                type: 'success', // Match the custom toast type
                text1: 'Patient contacts saved successfully.',
            });
            navigation.navigate('PatientDetails', {
                clinicID: myclinicID,
                patientID: myPatientID
            })
        } catch (error) {
            //console.log(error.message);
        }
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
            //('patientFullName is undefined or not accessible.');
            // Handle the case where patientFullName is undefined or not accessible
        }


    }
    return (
        // <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content width={350} height={500}>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Choose Medical Alert</Text></Modal.Header>
                    <Modal.Body>
                        <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
                            <Checkbox.Group onChange={setGroupValues} value={groupValues}>
                                {medicalAttributesData.map(item =>
                                    <Checkbox value={item.id} my="1" marginBottom={4} key={item.id}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#5f6067',
                                            fontFamily: 'Poppins-Medium',
                                        }}>{item.itemTitle}</Text>
                                    </Checkbox>
                                )}
                            </Checkbox.Group>

                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity onPress={() => {
                            setShowModal(false);
                        }}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckBox()}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {loading ? <Loader /> :
                <>
                    <PatientHeader patientID={myPatientID} />
                    <ScrollView>
                        <View style={CommonStylesheet.container}>
                            <View style={Styles.containerPatientInfo}>


                                <View style={{ padding: 0 }}>

                                    <Stack space={2} w="100%" mx="auto" >

                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ marginLeft: 0 }}>
                                                {/* <Input width={width - 120} fontFamily={'Poppins-Regular'} borderRadius={10} fontSize={14} isDisabled w="1320%" borderColor={'#005599'} bgColor={'white'} placeholder="Date" value={moment(patientDetails.registrationDate).format('LL')}/> */}
                                            </View>

                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            {/* <Input value={fname} onChangeText={(value => setFname(value))} width={width - 200} placeholderTextColor={'#808080'} borderRadius={10} style={Styles.inputPlaceholder} placeholder="First Name" /> */}
                                            {/* <Input width={width - 183} marginLeft={1} value={lname} onChangeText={(value => setLname(value))} placeholderTextColor={'#808080'} borderRadius={10} style={Styles.inputPlaceholder} placeholder="Last Name" /> */}
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            {/* <Input width={width - 278} borderRadius={10} placeholderTextColor={'#808080'} style={Styles.inputPlaceholder} placeholder="+ 91" marginRight={3} isDisabled /> */}
                                            {/* <Input w="77%" value={mobile} onChangeText={(value => setMobile(value))} borderRadius={10} placeholder="Mobile Number" placeholderTextColor={'#808080'} style={Styles.inputPlaceholder} /> */}
                                        </View>
                                        {/* <Input value={caseNo} onChangeText={(value => setCase(value))} placeholder="Case No" borderRadius={10} placeholderTextColor={'#8080800'} style={Styles.inputPlaceholder} /> */}

                                        <View style={{ flexDirection: 'row', width: width - 10 }}>
                                            {/* <Select
                                                    placeholderTextColor={'#808080'}
                                                    fontSize={14}
                                                    fontFamily={'Poppins-Regular'}
                                                    //opacity={0.7}
                                                    bgColor={'#FFFFFF'}
                                                    borderRadius={10}
                                                    selectedValue={service} minWidth="342"
                                                    accessibilityLabel="Select Langauge" placeholder="Select Langauge" _selectedItem={{
                                                    bg: "teal.600",
                                                    endIcon: <CheckIcon size="5" />
                                                    }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                                                    <Select.Item label="English" value="English" />
                                                    <Select.Item label="Hindi" value="Hindi" />
                                                    <Select.Item label="Marathi" value="Marathi" />

                                        </Select> */}

                                        </View>

                                        {/* <Input value={notes} onChangeText={(value => setNotes(value))} borderRadius={10} borderColor={'#a6a6a6'} placeholder="Notes" placeholderTextColor={'#808080'} style={Styles.inputPlaceholder} /> */}
                                        <Input
                                            value={email}
                                            onChangeText={(value => setEmail(value))}
                                            borderRadius={5}
                                            borderColor={'#e0e0e0'}
                                            placeholder="Email Address"
                                            placeholderTextColor={"#888888"}
                                            style={Styles.inputPlaceholder}
                                        />
                                        <Input
                                            value={address1}
                                            onChangeText={(value => setAddress1(value))}
                                            borderRadius={5}
                                            borderColor={'#e0e0e0'}
                                            placeholder="Flat/Door/Block No"
                                            placeholderTextColor={"#888888"}
                                            style={Styles.inputPlaceholder}
                                        />
                                        {/* <Input value={area} onChangeText={(value => setArea(value))} borderRadius={10} borderColor={'#a6a6a6'} placeholder="Area" placeholderTextColor={'#808080'} style={Styles.inputPlaceholder} /> */}
                                        <Input
                                            value={street}
                                            onChangeText={(value => setStreet(value))}
                                            borderRadius={5}
                                            borderColor={'#e0e0e0'}
                                            placeholder="Street Name"
                                            placeholderTextColor={"#888888"}
                                            style={Styles.inputPlaceholder}
                                        />
                                        <Input
                                            value={city}
                                            onChangeText={(value => setCity(value))}
                                            borderRadius={5}
                                            borderColor={'#e0e0e0'}
                                            placeholder="City"
                                            placeholderTextColor={"#888888"}
                                            style={Styles.inputPlaceholder}
                                        />

                                        <Picker
                                            selectedValue={selectedCountry}
                                            style={{
                                                width: '100%',
                                                height: height * 0.07,
                                                borderColor: "#e0e0e0",
                                                fontFamily: 'Poppins-Regular',
                                                paddingLeft: 10,
                                                fontSize: 16,
                                                borderRadius: 5,
                                                backgroundColor: "white"
                                            }}
                                            onValueChange={itemValue => setSelectedCountry(itemValue)}>
                                            <Picker.Item label="Choose Country" value={null} color='black' />
                                            {country.map(item => (

                                                <Picker.Item label={item.countryName} value={item.countryID} fontFamily={'Poppins-Regular'} key={item.id} />

                                            ))}
                                        </Picker>

                                        {selectedCountry == 102 ?
                                            <Picker
                                                selectedValue={selectedState}
                                                style={{
                                                    width: '100%',
                                                    height: height * 0.07,
                                                    borderColor: "#e0e0e0",
                                                    fontFamily: 'Poppins-Regular',
                                                    paddingLeft: 10,
                                                    fontSize: 16,
                                                    borderRadius: 5,
                                                    backgroundColor: "white"
                                                }}

                                                onFocus={getState} onValueChange={itemValue => setSelectedState(itemValue)}>
                                                <Picker.Item label="Choose State" value={null} color='gray' />
                                                {state.map(item => (

                                                    <Picker.Item
                                                        label={item.stateDesc}
                                                        value={item.stateCode}
                                                        fontFamily={'Poppins-Regular'} key={item.stateID} />

                                                ))}
                                            </Picker> :
                                            <Input
                                                placeholder='State'
                                                placeholderTextColor='gray'
                                                style={Styles.inputPlaceholder}
                                                value={selectedtextState}
                                                onChangeText={(itemValue) => setselectedtextState(itemValue)}
                                            />
                                        }

                                        <Input
                                            value={zipCode}
                                            // onChangeText={(value => setZipCode(value))}
                                            onChangeText={handleChange}
                                            maxLength={6}
                                            borderRadius={5}
                                            borderColor={'#e0e0e0'}
                                            placeholderTextColor={"#888888"}
                                            style={Styles.inputPlaceholder}
                                            placeholder="Pincode"
                                        />
                                        <Input
                                            borderRadius={5}
                                            value={ItemName.toString() || dashboard.strPateintMedicalAttributes}
                                            borderColor={'#e0e0e0'}
                                            placeholder=" Select Medical Alert"
                                            placeholderTextColor={"#888888"}
                                            style={Styles.inputPlaceholder}
                                            onFocus={() => openModal()}
                                        />

                                        {/* <View>
                                                <View>
                                                    <Text style={Styles.txtPortal}>Patient Portal Access</Text>
                                                    </View>

                                                    <Switch value={switchOn} onValueChange={() => {
                                                    setSwitchOn(!switchOn)
                                                    Alert.alert("Switch on : " + !switchOn)
                                                    }} style={{ marginTop: -20, borderColor: '#2196f3' }} />
                                    </View> */}

                                    </Stack>
                                </View>
                                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 10 }}>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => editPatient()}>
                                            <View style={Styles.buttonContainersaveatForm}>
                                                <Text style={Styles.ButtonText}>Save Contact Details</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Box>

                            </View>
                        </View>

                    </ScrollView>
                </>
            }
        </View>
    );
}

export default PatientMoreDetails;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        // borderColor: 'red',
        // borderWidth: 2,
        width: '100%',
        height: '100%',


    },
    imageContainer: {
        width: '100%',
        height: width / 4,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 320,
        height: 260,
        display: 'flex',
    },
    text: {
        fontSize: 10,
        color: 'gray',
        padding: 3,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: '#fff',
        borderColor: '#005599',
        width: 50,
        height: 50
    },
    txtPortal: {
        color: 'black',
        fontFamily: 'Poppins-Regular'
    },
    highlighted: {
        backgroundColor: 'yellow',
        fontFamily: 'Poppins-Bold',
        fontSize: regularFontSize
    },
    inputFontStyle: {
        fontSize: regularFontSize,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#fff',
        height: height * 0.07,

    },
    containerPatientInfo: {
        // borderColor: 'green',
        // borderWidth: 2,
        width: '100%',
        height: '100%',
        // padding: 10
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
        fontSize: regularFontSize,
        color: 'white',
        fontFamily: 'Poppins-Bold',
        textAlign: 'center'
    },

    highlighted: {
        backgroundColor: 'yellow',
        fontFamily: 'Poppins-Bold',
        fontSize: regularFontSize,
    },
    medicalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: regularFontSize,
        color: 'red'
    },
    logo: {
        width: width * 0.045, // Adjust width based on screen width
        height: height * 0.045, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
        marginRight: 15
    },
    ButtonText: {
        fontSize: regularFontSize,
        color: '#fff',
        fontFamily: 'Poppins-Bold',
    },

    buttonContainersaveatForm: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        width: 220,
        height: 40,
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
        borderRadius: 5,
    },
});