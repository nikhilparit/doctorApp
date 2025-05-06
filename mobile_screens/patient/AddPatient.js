import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions, Alert } from 'react-native';
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
    Select,
    CheckIcon,
    Modal,
    Radio,
    Checkbox
} from 'native-base';

import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
//common styles
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../api/Api';
import Loader from '../../components/Loader';
//import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
//import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Picker } from '@react-native-picker/picker';
const fontSize = Math.min(width, height) * 0.025; // Adjust the multiplier as per your requirement
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDataForNewPatient, InsertPatient, updateCaseNumber } from '../../features/patientsSlice';
import Toast from 'react-native-toast-message';
import { getHeaders } from '../../utils/apiHeaders';


const secondaryCardHeader = Math.min(width, height) * 0.03;
const regularFontSize = width < 600 ? 15 : 18;
const primaryFontSize = width < 600 ? 17 : 22;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const AddPatient = ({ route }) => {
    const dispatch = useDispatch();
    const titleData = useSelector((state) => state.patient.title) || [];
    const occupationData = useSelector((state) => state.patient.occupation) || [];
    const medicalAttributesData = useSelector((state) => state.patient.medicalAttributes) || [];
    const casenumber = useSelector((state) => state.patient.newcaseNum) || '';
    const navigation = useNavigation();
    const [groupValues, setGroupValues] = React.useState([]);
    const [filePath, setFilePath] = useState([]);
    const myClinicID = route.params.clinicID;
    const key1 = route.params.key || null;
    const key = route.params.paramkey || null;
   // console.log("ParamKey", key, key1);
    const [modalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState('manual');
    //handle dropdown data
    //const [titleData, setTitleData] = useState([]);
    // const [occupationData, setOccupationData] = useState([]);
    //const [medicalAttributesData, setMedicalAttributesData] = useState([]);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    //Handle User Input 
    const [title, setSelectedTitle] = useState('Mr.');
    const [gender, setGender] = useState('');
    const [occupation, setOccupation] = useState('');
    const [medicalAttribute, setMedicalAttribute] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    //const [casenumber, setCaseNumber] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(101);
    const [selectedState, setSelectedState] = useState('');
    const [address1, setAdress1] = useState('');
    const [street, setStreet] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [language, setLanguage] = useState('');
    const [notes, setNotes] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [ItemName, setItemName] = useState([]);
    const [sendwelcomemessage, setsendwelcomemessage] = useState(true);
    const [isAllowPatientPortalAccess, setisAllowPatientPortalAccess] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    //age calculator
    const [years, setYear] = useState(null);
    const [months, setMonths] = useState(null);
    //regex-error
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [emailError, setEmailError] = React.useState(false);
    //handle modal and its values
    const [showModal1, setShowModal1] = useState(false);
    const [selectedMedicalAlert, setSelectedMedicalAlert] = useState([]);
    const [userID, setuserID] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [prefix, setPrefix] = useState('');
    const [nextNumber, setnextNumber] = useState('');
    const [suffix, setSuffix] = useState('');
    const [prefixData, setPrefixData] = useState({});
    const [nextNumberData, setnextNumberData] = useState({});
    const [suffixData, setSuffixData] = useState({});
    const [clinicAttr, setclinicAttr] = useState([]);
    const [newcaseNum,setnewCaseNum]= useState('');



    const readData = async () => {
        setPrefix('');
        setnextNumber('');
        setSuffix('');
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const formData =
        {
            clinicID: user.clinicID,
            //attributeNames: ["DefaultPatientCodeSuffix"]
        }
        try {
            const clinicAttr = await Axios.post(`${Api}Clinic/GetClinicAttributeData`, formData, { headers });
            setclinicAttr(clinicAttr.data);
            const suffixData = clinicAttr.data.find(item => item.attributeName === "DefaultPatientCodeSuffix");
           // console.log("suffixData", suffixData);
            const prefixData = clinicAttr.data.find(item => item.attributeName === "DefaultPatientCodePrefix");
           // console.log("prefixData", prefixData);
            const patientCode = clinicAttr.data.find(item => item.attributeName === "PatientCodeStartValue");
           // console.log("patientCode", patientCode);
            setPrefixData(prefixData);
            setSuffixData(suffixData);
            setnextNumberData(patientCode);
            setSuffix(suffixData.attributeValue);
            setPrefix(prefixData.attributeValue);
            setnextNumber(patientCode.attributeValue);
        } catch (error) {
            //console.log(error);
        }
       // console.log("patientCode", casenumber);
        // Extract the letters (prefix)
        const prefix = casenumber.replace(/[0-9]/g, '');
        // Extract the numbers (suffix)
        const number = casenumber.replace(/[^\d]/g, '');
        // console.log("Prefix:", prefix); 
        // console.log("Number:", number);
        setPrefix(prefix);
        setnextNumber(number);
        const formDataTitle = {
            clinicID: user.clinicID,
            itemCategory: "Title"
        };
        const formDataOccupation = {
            clinicID: user.clinicID,
            itemCategory: "Occupation"
        };
        const formDataPatientMedicalAttributes = {
            clinicID: user.clinicID,
            itemCategory: "PatientMedicalAttributes"
        };
        try {
            const actionResult = await dispatch(fetchDataForNewPatient({ formDataTitle, formDataOccupation, formDataPatientMedicalAttributes }))
            if (fetchDataForNewPatient.fulfilled.match(actionResult)) {
                //console.log('Data fetched successfully:', actionResult.payload);
            } else {
                console.error('Error fetching data:', actionResult.payload);
            }
        } catch (error) {
            console.error('Error in readData:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        readData();
    }, [casenumber]);



    // const onChange = (day) => {
    //     if (day) {
    //         const currentDate = day;
    //         console.log(currentDate);
    //         setSelectedDate(currentDate);
    //         setShow(false);
    //         setDob(moment(currentDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString());
    //         calculateAge(currentDate);
    //     }
    //     return ''; // Return blank if no date is selected
    // };
    // const calculateAge = (value) => {
    //     console.log("AT CALCULATE AGE",selectedDate);
    //     setYear(null);
    //     setMonths(null);
    //     const birthDate = value;
    //     //console.log("BIRTHDAY", birthDate);
    //     const currentDate = new Date();
    //     //console.log('CURRENT DATE', currentDate);

    //     let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
    //     //console.log('AGE YEAR', ageYears);
    //     let ageMonths = currentDate.getMonth() - birthDate.getMonth();
    //     //console.log('AGE MONTH', ageMonths);

    //     if (currentDate.getDate() < birthDate.getDate()) {
    //         ageMonths--;
    //     }

    //     if (ageMonths < 0) {
    //         ageYears--;
    //         ageMonths += 12;
    //     }

    //     setYear(ageYears);
    //     setMonths(ageMonths);
    // };

    const handleChange = (value) => {
        // Remove any non-numeric characters from the input
        const numericValue = value.replace(/[^0-9]/g, '');
        setPhone(numericValue);
    };

    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
           // console.log(formattedDate);
            setSelectedDate(day); // Assuming this is a Date object
            setShow(false);
            setDob(formattedDate); // Save formatted DOB
            calculateAge(day); // Pass the Date object directly
        }
    };
    const calculateAge = (birthDate) => {
        if (!birthDate) return;

        const currentDate = new Date();
        let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
        let ageMonths = currentDate.getMonth() - birthDate.getMonth();

        if (currentDate.getDate() < birthDate.getDate()) {
            ageMonths--;
        }
        if (ageMonths < 0) {
            ageYears--;
            ageMonths += 12;
        }

        setYear(ageYears.toString()); // Assuming setYear expects a string
        setMonths(ageMonths.toString()); // Assuming setMonths expects a string
    };
    const showDatepicker = () => {
        setShow(true);
    };
    const getState = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        formData = {
            countryID: selectedCountry,
            countryCode: "string",
            countryName: "string",
            lastUpdatedBy: "string",
            lastUpdatedOn: "2023-03-08T10:04:30.925Z"
        }
        //console.log("form Data", formData);
        try {
            await Axios.post(`${Api}Clinic/GetStateByCountryID`, formData, { headers }).then(resp => {
                const stateData = resp.data
                //console.log('Get State By CountryID', stateData);
                setState(stateData);
            });
        }
        catch (error) {
            //console.log(error);
        }
    }

    const addNewPatient = async () => {
        if( value == "custom"){
            setPrefix('');
            setnextNumber('');
            setSuffix('');
        }
       
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const currentDay = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        if (title == '' || title == undefined) {
            // Snackbar.show({
            //     text: 'Required title for adding patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required title for adding patient.',
                text2: 'Please provide title to continue.',
            });
            // alert('Required title for adding patient.');
            return
        }
        if (firstName == '' || firstName == undefined) {
            // Snackbar.show({
            //     text: 'Required first name for adding patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required first name for adding patient.',
                text2: 'Please provide first name to continue.',
            });
            //alert('Required first name for adding patient.');
            return
        }
        if (phone == '' || phone == undefined) {
            // Snackbar.show({
            //     text: 'Required mobile number for adding patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            //alert('Required mobile number for adding patient.')
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required mobile number for adding patient.',
                text2: 'Please provide mobile number to continue.',
            });
            return
        }
        if (phone.length <=9) {
            // Snackbar.show({
            //     text: 'Required mobile number for adding patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            //alert('Required mobile number for adding patient.')
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required 10 digit mobile number for adding patient.',
                text2: 'Please provide 10 digit mobile number to continue.',
            });
            return
        }
        if (email !== '') {
            if (!emailRegex.test(email)) {
                setEmailError(true);
                Toast.show({
                    type: 'error', // Match the custom toast type
                    text1: 'Invalid Email.',
                    text2: 'Please provide email in correct format to continue.',
                });
                //alert("Invalid Email. Please write email in correct format");
                return;
            }
        }
        const fullName = `${title + ' ' + firstName + ' ' + lastName}`;
        //console.log(fullName);
        const formData = {
            providerID: user.userID,
            clinicID: user.clinicID,
            title: title,
            firstName: firstName,
            lastName: lastName,
            fullName: fullName,
            gender: gender,
            dob: moment(dob).toISOString() || null,
            strDOB: null,
            addressLine1: null,
            addressLine2: null,
            street: null,
            area: '',
            city: '',
            state: '',
            countryName: null,
            stateName: null,
            country: 0,
            zipCode: null,
            phoneNumber: phone,
            mobileNumber: phone,
            emailAddress1: email,
            emailAddress2: null,
            occupation: occupation,
            imagethumbnail: null,
            strImageType: null,
            strimageBase64: null,
            strImagethumbnail: null,
            imagePath: null,
            registrationDate: currentDay,
            status: 0,
            addedOn: currentDay,
            caseID: value !== "custom" ? parseInt(nextNumber) : 0 ,
            defaultLanguageID: 0,
            patientCode: value !== "custom" ? nextNumber : newcaseNum,
            rowguid: "00000000-0000-0000-0000-000000000000",
            patientNotes: notes,
            age: 0,
            ageYear: parseInt(years) || 0,
            ageMonth: parseInt(months) || 0,
            strAge: null,
            familyID: "00000000-0000-0000-0000-000000000000",
            isupdatedExport: false,
            isActiveSMSSubscriber: false,
            isActiveEmailSubscriber: false,
            isMobileAllowForcefully: false,
            nationality: null,
            passwordHashSalt: null,
            maritalStatus: null,
            signatures: null,
            signatureDate: currentDay,
            signatureJson: null,
            recordCount: 0,
            createdBy: user.userName,
            patientMedicalAttributesDTOList: [],
            patientMedicalAttributesString: null,
            caseCode: prefix + nextNumber + suffix,
            mobileNum: null,
            searchResult: null,
            drIncharge: null,
            occuptation: null,
            followUpDate: currentDay,
            followUpReason: null,
            sendwelcomemessage: sendwelcomemessage,
            strCommunicationGroupIDCSV: null,
            countryDialCode: null,
            pateintFollowUpID: "00000000-0000-0000-0000-000000000000",
            patientCodePrefix: prefix,
            patientCodeValue: null,
            source: null,
            isProfileShare: false,
            clinicName: null,
            externalRefferalMasterId: "00000000-0000-0000-0000-000000000000",
            externalRefferalDataId: "00000000-0000-0000-0000-000000000000",
            refferalName: null,
            aadharCardNo: null,
            patientCodeMode: value,
            caseCodePrefix: prefix,
            relationId: "00000000-0000-0000-0000-000000000000",
            relation: null,
            relationPatientId: "00000000-0000-0000-0000-000000000000",
            relationPatientName: null,
            anniversaryDate: currentDay,
            patientCodeSuffix: suffix,
            isTreatmentShare: false,
            isExaminationShare: false,
            isPrescriptionShare: false,
            isBillingShare: false,
            isFileShare: false,
            isAllowPatientPortalAccess: isAllowPatientPortalAccess,
            isPortalAccess: false,
            isPortalInvitationAccept: false,
            procedureName: null,
            chkacceptpayment: false,
            treatmentTypeID: "00000000-0000-0000-0000-000000000000",
            treatmentCost: 0,
            modeOfPayment: null,
            treatmentType: null,
            chequeDate: currentDay,
            bankName: null,
            chequeNo: null,
            treatmentTotalPayment: 0,
            addedBy: user.userName,
            lastUpdatedBy: user.userName
        }

        if (selectedMedicalAlert && selectedMedicalAlert.length > 0) {
            for (let i = 0; i < selectedMedicalAlert.length; i++) {
                let arrObj2 = {
                    patientMedicalDetailID: "00000000-0000-0000-0000-000000000000",
                    patientID: "00000000-0000-0000-0000-000000000000",
                    itemID: selectedMedicalAlert[i].itemID,
                    medicalAttributesCategory: selectedMedicalAlert[i].itemCategory,
                    medicalAttributeValue: null,
                    itemDescription: selectedMedicalAlert[i].itemDescription,
                    lastUpdatedBy: selectedMedicalAlert[i].lastUpdatedBy,
                    lastUpdatedOn: date.toISOString(),
                    clinicID: user.clinicID
                }
                formData.patientMedicalAttributesDTOList.push(arrObj2);
            }
        }
        //console.log('Add Patient Form Data', formData);

        try {
            const resultAction = await dispatch(InsertPatient(formData));
            if (InsertPatient.fulfilled.match(resultAction)) {
                // alert(`${resultAction.payload.message}`);
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: `${resultAction.payload.message}`,
                });
                if (key === 'addpatientviaappointment' || key === 'selectPatientViaAppointment') {
                    navigation.navigate('AddAppointments', {
                        patientID: resultAction.payload.patientID,
                        patientName: fullName,
                    })
                } else {
                    navigation.navigate('Patient');
                }

            } else {
                console.error('Error fetching data:', resultAction.payload);
            }
        } catch (error) {
            console.error('Error in readData:', error);
        } finally {
            setIsLoading(false);
        }
    }
    const handleEmailChange = (value) => {
        setEmail(value);
        setEmailError(false);
    };
    const autoGeneratingCode = async () => {
        if( value == undefined){
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select checkbox to continue',
            });
            return
        }
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        //console.log("clinicAttrValues", suffix, prefix, nextNumber);
        let formData = { manageClinicAttributesParamDTO: [] };
        formData = {
            manageClinicAttributesParamDTO: [
                {
                    clinicAttributeDataID: suffixData?.clinicAttributeDataID || null,
                    clinicID: user.clinicID,
                    attributeName: "DefaultPatientCodeSuffix",
                    attributeValue: suffix,
                    lastUpdatedBy: user.userName
                },
                {
                    clinicAttributeDataID: prefixData?.clinicAttributeDataID || null,
                    clinicID: user.clinicID,
                    attributeName: "DefaultPatientCodePrefix",
                    attributeValue: prefix,
                    lastUpdatedBy: user.userName
                },
                {
                    clinicAttributeDataID: nextNumberData?.clinicAttributeDataID || null,
                    clinicID: user.clinicID,
                    attributeName: "PatientCodeStartValue",
                    attributeValue: nextNumber,
                    lastUpdatedBy: user.userName
                }
            ]
        }
        //console.log("FORMDATA", formData);

        // Execute API calls for each item using for-loop with async/await
        const saveClinicAttributes = async () => {
            try {
                const response = await Axios.post(`${Api}Clinic/SaveManageClinicAttributes`, formData, { headers });
                //console.log("API response:", response.data);
                setModalVisible(false);
            } catch (error) {
                console.error("API error:", error.response?.data || error.message);
            }
        };

        saveClinicAttributes();
        //readData();
    }
    const chooseFile = () => {
        let options = {
            title: 'Select Image',
            customButtons: [
                {
                    name: 'customOptionKey',
                    title: 'Choose Photo from Custom Option'
                },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                //console.log('User cancelled image picker');
            } else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log(
                //     'User tapped custom button: ',
                //     response.customButton
                // );
                // alert(response.customButton);
            } else {
                let source = response.assets;
                //console.log('SOURCE', source);
                // You can also display the image using data:
                // let source = {
                //   uri: 'data:image/jpeg;base64,' + response.data
                // };
                setFilePath(source);
            }
        });
    };
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

        //console.log("FINAL DATA Medical Alert", data);
        //console.log("DATA Length", data.length);
        let itemName = [];
        for (let i = 0; i < data.length; i++) {
            itemName.push(data[i].itemTitle);
        };
        setItemName(itemName);
        setSelectedMedicalAlert(data);
        setShowModal1(false);
    }
    const openModal = () => {
        setSelectedMedicalAlert([]);
        setShowModal1(true);
    }
    return (
        <>
            {isLoading ? <Loader /> :
                // <ImageBackground source={require('../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
                <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                    <Modal isOpen={show} onClose={() => setShow(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Please select Date</Text></Modal.Header>
                            <Modal.Body>
                                <Calendar
                                    onChange={onChange}
                                    value={selectedDate}
                                />
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                    <Modal
                        isOpen={modalVisible}
                        onClose={() => setModalVisible(false)}
                        style={{ alignSelf: 'center', width: '90%' }}
                    >
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}>
                                <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>
                                    Patient Code Prefix
                                </Text>
                            </Modal.Header>
                            <Modal.Body>
                                <RadioButtonGroup
                                    containerStyle={{ marginBottom: 10 }}
                                    selected={value}
                                    onSelected={(nextValue) => setValue(nextValue)}
                                    radioBackground="#0A79DF"
                                >
                                    <RadioButtonItem
                                        value="manual"
                                        label={
                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 14 }}>
                                                Auto-generating patient code
                                            </Text>
                                        }
                                    />
                                    {/* Labels Row */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 5,
                                            paddingHorizontal: 10,
                                        }}
                                    >
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 14, textAlign: 'center' }}>
                                            Prefix
                                        </Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 14, textAlign: 'center' }}>
                                            Next Number
                                        </Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 14, textAlign: 'center' }}>
                                            Suffix
                                        </Text>
                                    </View>
                                    {/* Input Fields Row */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            paddingHorizontal: 10,
                                        }}
                                    >
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <Input
                                                h={10}
                                                w="100%" // Full width of the container
                                                borderColor="#005599"
                                                bgColor="white"
                                                placeholder="Prefix"
                                                value={prefix}
                                                onChangeText={(value) => setPrefix(value)}
                                            />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', marginLeft: 10 }}>
                                            <Input
                                                h={10}
                                                w="100%" // Full width of the container
                                                borderColor="#005599"
                                                bgColor="white"
                                                placeholder="Next Number"
                                                value={nextNumber}
                                                onChangeText={(value) => setnextNumber(value)}
                                            />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', marginLeft: 10 }}>
                                            <Input
                                                h={10}
                                                w="100%" // Full width of the container
                                                borderColor="#005599"
                                                bgColor="white"
                                                placeholder="Suffix"
                                                value={suffix}
                                                onChangeText={(value) => setSuffix(value)}
                                            />
                                        </View>
                                    </View>
                                    <RadioButtonItem
                                        style={{ marginTop: 15 }}
                                        value="custom"
                                        label={
                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 14, marginTop: 15 }}>
                                                I will add them manually each time
                                            </Text>
                                        }
                                    />
                                </RadioButtonGroup>
                            </Modal.Body>
                            <Modal.Footer style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <View
                                        style={[
                                            CommonStylesheet.buttonContainerdelete1,
                                            { padding: 10, borderRadius: 5 },
                                        ]}
                                    >
                                        <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => autoGeneratingCode()}>
                                    <View
                                        style={[
                                            CommonStylesheet.buttonContainersave1,
                                            { padding: 10, borderRadius: 5 },
                                        ]}
                                    >
                                        <Text style={CommonStylesheet.ButtonText}>Update</Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>

                    <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
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
                                    setShowModal1(false);
                                }}>
                                    <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                        <Text style={CommonStylesheet.ButtonText}> Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleCheckBox()}>
                                    <View style={CommonStylesheet.buttonContainersave1}>
                                        <Text style={CommonStylesheet.ButtonText}> Save</Text>
                                    </View>
                                </TouchableOpacity>

                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>

                    <ScrollView>
                        <View style={styles.formContainer}>
                            <Stack space={2} w="100%" mx="auto" marginTop={2}>

                                {/* <Picker
            style={{
              width: '100%',
              height: hp('7%'),
              //borderColor: "#0A79DF",
              fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 16,
              marginTop: 6,
              borderRadius:5,
              paddingLeft: 12,
              backgroundColor:'white',
              color:'#49454F'
              }}
            bg="white"
            placeholderTextColor="#808080"
            fontSize={16}
            selectedValue={selectedtitle}
            onValueChange={newValue => setselectedtitle(newValue)}
          >
            {title.map((item) => (
              <Picker.Item
                key={item.id}
                label={item.itemTitle}
                value={item.itemTitle}
              />
            ))}
          </Picker> */}

                                <Picker
                                    style={{
                                        width: '100%', height: hp('7%'), borderColor: '#e0e0e0',
                                        fontFamily: 'Poppins-Regular', paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    selectedValue={title}
                                    onValueChange={itemValue => setSelectedTitle(itemValue)}>
                                    <Picker.Item label="Select Title" value={null} />
                                    {titleData.map(item => (
                                        <Picker.Item label={item.itemDescription} value={item.itemDescription} fontFamily={'Poppins-Regular'} key={item.id} />

                                    ))}
                                </Picker>
                                <Input
                                    value={firstName}
                                    onChangeText={(value) => setFirstName(value)}
                                    size="lg"
                                    placeholder=" First Name*"
                                    style={styles.inputFontStyle}
                                    borderRadius={5}

                                    placeholderTextColor={"#888888"}
                                />
                                <Input
                                    value={lastName}
                                    onChangeText={(value) => setLastName(value)}
                                    size="lg"
                                    placeholder="Last Name"
                                    style={styles.inputFontStyle}
                                    borderRadius={5}

                                    placeholderTextColor={"#888888"}
                                />
                                {/* <Input
                            value={phone}
                            keyboardType='numeric'
                            maxLength={10}
                            onChangeText={handleChange} 
                            placeholder="Mobile Number*"
                            style={styles.inputFontStyle}
                            borderRadius={5}

                            placeholderTextColor={"#888888"}
                        /> */}
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <Picker
                                        style={{
                                            width: '30%', height: hp('7%'), borderColor: '#e0e0e0',
                                            fontFamily: 'Poppins-Regular', paddingLeft: 10,
                                            fontSize: 16,
                                            borderRadius: 5,
                                            backgroundColor: "white"
                                        }}
                                        selectedValue={countryCode}
                                        accessibilityLabel="Country Code"
                                        placeholder="Country Code"
                                        onValueChange={itemValue => setCountryCode(itemValue)}>
                                        <Picker.Item label='+91  (India)' value='+91' fontFamily={'Poppins-Regular'} />
                                        <Picker.Item label='+92  (Pakistaan)' value='+92' fontFamily={'Poppins-Regular'} />
                                        <Picker.Item label='+968 (Oman)' value='+968' fontFamily={'Poppins-Regular'} />
                                        <Picker.Item label='+974 (Qatar)' value='+974' fontFamily={'Poppins-Regular'} />
                                    </Picker>

                                    <Input
                                        width={"70%"}
                                        value={phone}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        size="lg"
                                        // onChangeText={(value) => setPhone(value)}
                                        onChangeText={handleChange}
                                        marginLeft={2}
                                        style={styles.inputFontStyle}
                                        borderRadius={5}
                                        placeholderTextColor={'#888888'}
                                        placeholder="Mobile Number*"

                                    />
                                </View>
                                <Input
                                    value={email}
                                    size="lg"
                                    onChangeText={handleEmailChange}
                                    placeholder="Email"
                                    style={styles.inputFontStyle}
                                    borderRadius={5}

                                    placeholderTextColor={"#888888"}


                                />
                                <View style={{ flexDirection: 'row' }}>
                                    {value !== "manual" ? <Input
                                        onChangeText={(val)=>setnewCaseNum(val)}
                                        width={'92%'}
                                        placeholderTextColor={"#888888"}

                                        style={styles.inputFontStyle}
                                        borderRadius={5}
                                        placeholder="Case Number"
                                        editable={value !== "manual"} // Disables input when value is "custom"
                                        value={newcaseNum}

                                    /> :
                                        <Input
                                           // onChangeText={(value) => dispatch(updateCaseNumber(value))}
                                            width={'92%'}
                                            placeholderTextColor={"#888888"}

                                            style={styles.inputFontStyle}
                                            borderRadius={5}
                                            placeholder="Case Number"
                                            editable={false} // Disables input when value is "custom"
                                            value={prefix + nextNumber + suffix}

                                        />

                                    }

                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                        <View style={{ justifyContent: 'center', padding: 5, width: '10%', marginTop: 3 }}>
                                            <Icon
                                                name="pen"
                                                size={20}
                                                color={"#2196f3"}

                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>


                                <View style={{ flexDirection: 'row' }}>
                                    <Input onFocus={showDatepicker}
                                        value={dob == null ? '' : moment(dob).format('LL')}
                                        onChangeText={(value) => calculateAge(value)}
                                        width={'92%'}
                                        placeholder="Date of Birth"
                                        borderRadius={5}
                                        placeholderTextColor={"#888888"}

                                        style={styles.inputFontStyle}
                                    />
                                    <View style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                                        <TouchableOpacity onPress={showDatepicker}>
                                            <Image
                                                source={require('../../assets/images/calendarDash.png')} alt="logo.png"
                                                style={{ height: 34, width: 36, borderRadius: 5 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* <View style={{ flexDirection: 'row' }}>
                            <Input
                                w="49%"
                                style={styles.inputFontStyle}
                                borderRadius={10}
                                borderColor={'#a6a6a6'}
                                onChangeText={(val) => setYear(val)}
                                bgColor={'#FFFFFF'}
                                placeholder="Year"
                                value={years}
                            >
                            </Input>
                            <Input
                                w="50%"
                                marginLeft={1}
                                style={styles.inputFontStyle}
                                borderRadius={10}
                                borderColor={'#a6a6a6'}
                                onChangeText={(val) => setMonths(val)}
                                bgColor={'#FFFFFF'}
                                placeholder="Month"
                                value={months}
                            ></Input>
                        </View> */}
                                <Picker
                                    selectedValue={gender}
                                    style={{
                                        width: '100%', height: hp('7%'), borderColor: '#e0e0e0',
                                        fontFamily: 'Poppins-Regular', paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    onValueChange={itemValue => setGender(itemValue)}>
                                    <Picker.Item label="Select Gender" value={null} />
                                    <Picker.Item label='Male' value='M' fontFamily={'Poppins-Regular'} />
                                    <Picker.Item label='Female' value='F' fontFamily={'Poppins-Regular'} />
                                </Picker>
                                <Picker
                                    selectedValue={occupation}
                                    style={{
                                        width: '100%', height: hp('7%'), borderColor: '#e0e0e0',
                                        fontFamily: 'Poppins-Regular', paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    onValueChange={itemValue => setOccupation(itemValue)}>
                                    <Picker.Item label="Select Occupation" value={null} color='#e3e1e1' />
                                    {occupationData.map(item => (
                                        <Picker.Item label={item.itemTitle} value={item.itemDescription} fontFamily={'Poppins-Regular'} key={item.itemID} />
                                    ))}
                                </Picker>
                                <Input
                                    value={ItemName.toString()}
                                    borderRadius={5}

                                    placeholder=" Select Medical Alert"
                                    placeholderTextColor={"#888888"}
                                    style={styles.inputFontStyle}
                                    onFocus={() => openModal()}
                                />
                                <Picker
                                    selectedValue={language}
                                    style={{
                                        width: '100%', height: hp('7%'), borderColor: '#e0e0e0',
                                        fontFamily: 'Poppins-Regular', paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    onValueChange={itemValue => setLanguage(itemValue)}>
                                    <Picker.Item label=" Select Language" value={null} color='#888888' />
                                    <Picker.Item label='Marathi' value='Marathi' fontFamily={'Poppins-Regular'} />
                                    <Picker.Item label='Hindi' value='Hindi' fontFamily={'Poppins-Regular'} />
                                    <Picker.Item label='English' value='English' fontFamily={'Poppins-Regular'} />
                                </Picker>
                                <Input
                                    size="lg"
                                    value={notes}
                                    onChangeText={(value) => setNotes(value)}
                                    style={styles.inputFontStyle}
                                    borderRadius={5}

                                    placeholderTextColor={"#888888"}
                                    placeholder="Notes"
                                />
                                <View style={{ marginTop: 10, }}>
                                    {/* The flexDirection row and justifyContent space-around center the checkboxes with spacing */}
                                    <Checkbox
                                        isChecked={sendwelcomemessage}
                                        onChange={(newValue) => setsendwelcomemessage(newValue)}
                                    >
                                        <Text style={{
                                            fontSize: secondaryCardHeader,
                                            lineHeight: Math.min(width, height) * 0.05,
                                            fontFamily: 'Poppins-Regular'
                                        }}>Send welcome SMS to patient</Text>
                                    </Checkbox>

                                    <Checkbox
                                        isChecked={isAllowPatientPortalAccess}
                                        onChange={(newValue) => setisAllowPatientPortalAccess(newValue)}
                                        style={{}}
                                    >
                                        <Text style={{
                                            fontSize: secondaryCardHeader,
                                            lineHeight: Math.min(width, height) * 0.05,
                                            fontFamily: 'Poppins-Regular'
                                        }}>Allow portal access to this Patient</Text>
                                    </Checkbox>
                                </View>
                                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 40, marginBottom: 10 }}>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => addNewPatient()}>
                                            <View style={CommonStylesheet.buttonContainersaveatForm}>
                                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Box>
                            </Stack>
                        </View>
                    </ScrollView>
                </View>
            }
        </>
    );
};

export default AddPatient;

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        width: '100%',
        padding: 10
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        padding: 10,
        color: 'black',
    },
    buttonStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#DDDDDD',
        padding: 5,
    },
    imageStyle: {
        width: 200,
        height: 200,
        margin: 5,
    },
    inputPlaceholder: {
        fontSize: regularFontSize,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        // opacity: 0.7,
    },
    Text: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-SemiBold'
    },
    inputFontStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#fff',
        height: height * 0.07,
    }

}); 