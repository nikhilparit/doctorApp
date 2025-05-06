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
//import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const secondaryCardHeader = Math.min(width, height) * 0.03;
const regularFontSize = width < 600 ? 15 : 18;
const primaryFontSize = width < 600 ? 17 : 22;

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

const AddPatientViaAppointment = ({ route }) => {
    const navigation = useNavigation();
    const [groupValues, setGroupValues] = React.useState([]);
    const [filePath, setFilePath] = useState([]);
    const myClinicID = route.params.clinicID;
    const [modalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState('auto');
    //handle dropdown data
    const [titleData, setTitleData] = useState([]);
    const [occupationData, setOccupationData] = useState([]);
    const [medicalAttributesData, setMedicalAttributesData] = useState([]);
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
    const [casenumber, setCaseNumber] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState(new Date());
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
    //age calculator
    const [years, setYear] = useState(null);
    const [months, setMonths] = useState(null);
    //regex-error
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [emailError, setEmailError] = React.useState(false);
    //handle modal and its values
    const [showModal1, setShowModal1] = useState(false);
    const [selectedMedicalAlert, setSelectedMedicalAlert] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    // const onChange = (day) => {
    //     if (day) {
    //         const currentDate = day.dateString;
    //         console.log(currentDate);
    //         setShow(false);
    //         setDob(moment(currentDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString());
    //         calculateAge(selectedDate);
    //     }
    //     return ''; // Return blank if no date is selected
    // };
    // const calculateAge = (value) => {
    //     const birthDate = value;
    //     console.log("BIRTHDAY", birthDate);
    //     const currentDate = new Date();
    //     console.log('CURRENT DATE', currentDate);

    //     let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
    //     console.log('AGE YEAR', ageYears);
    //     let ageMonths = currentDate.getMonth() - birthDate.getMonth();
    //     console.log('AGE MONTH', ageMonths);

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

    // const showDatepicker = () => {
    //     setShow(true);
    // };
    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
            console.log(formattedDate);
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
    const readData = () => {
        console.log(value);
        if (value == 'auto') {
            try {
                Axios.post(`${Api}Patient/GetNextPatientCode?ClinicID=${myClinicID}`, {
                    headers: {
                        'accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }).then(resp => {
                    console.log(resp.data);
                    setCaseNumber(resp.data);
                });
                setModalVisible(false);
            } catch (error) {
                console.log(error.message);
            }
        }
        try {
            Axios.post(`${Api}Clinic/GetCountrylist`).then(resp => {
                const countryData = resp.data
                console.log('Get Country list', countryData);
                setCountry(countryData);
            });
        } catch (error) {
            console.log(error);
        }
        const formDataTitle = {
            clinicID: myClinicID,
            itemCategory: "Title"
        }
        console.log('Data To Pass', formDataTitle);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formDataTitle,{headers}).then(resp => {
                console.log('Title List', resp.data);
                setTitleData(resp.data);
            });

        } catch (error) {
            console.log(error);
        }
        const formDataOccupation = {
            clinicID: myClinicID,
            itemCategory: "Occupation"
        }
        console.log('Data To Pass', formDataOccupation);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formDataOccupation,{headers}).then(resp => {
                console.log('Occupation List', resp.data);
                setOccupationData(resp.data);
            });

        } catch (error) {
            console.log(error);
        }
        const formDataPatientMedicalAttributes = {
            clinicID: myClinicID,
            itemCategory: "PatientMedicalAttributes"
        }
        console.log('Data To Pass', formDataPatientMedicalAttributes);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formDataPatientMedicalAttributes,{headers}).then(resp => {
                console.log('Medical Attributes List', resp.data);
                setMedicalAttributesData(resp.data);
            });

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        readData();
    }, []);
    const getState = async () => {
        formData = {
            countryID: selectedCountry,
            countryCode: "string",
            countryName: "string",
            lastUpdatedBy: "string",
            lastUpdatedOn: "2023-03-08T10:04:30.925Z"
        }
        console.log("form Data", formData);
        try {
            await Axios.post(`${Api}Clinic/GetStateByCountryID`, formData,{headers}).then(resp => {
                const stateData = resp.data
                console.log('Get State By CountryID', stateData);
                setState(stateData);
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const addNewPatient = () => {
        const currentDay = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        console.log('Todays Date', currentDay);
        if (title == '' || title == undefined) {
            // Snackbar.show({
            //     text: 'Required title for adding patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            alert('Required title for adding patient.');
            return
        }

        if (firstName == '' || firstName == undefined) {
            // Snackbar.show({
            //     text: 'Required first name for adding patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            alert('Required first name for adding patient.');
            return
        }
        if (lastName == '' || lastName == undefined) {
            // Snackbar.show({
            //     text: 'Required last name for adding patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            alert('Required last name for adding patient.');
            return
        }
        if (phone == '' || phone == undefined) {
            // Snackbar.show({
            //     text: 'Required mobile number for adding patient.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            alert('Required mobile number for adding patient.');
            return
        }
        if (email !== '') {
            if (!emailRegex.test(email)) {
                setEmailError(true);
                Alert.alert("Invalid Email", "Please write email in correct format");
                return;
            }
        }

        // if (state == ''|| state == undefined) {
        //     Snackbar.show({
        //         text: 'Required state for adding patient.',
        //         duration: Snackbar.LENGTH_SHORT,
        //         backgroundColor: 'red',
        //         fontFamily: 'Poppins-Medium',
        //     });
        //     alert('Required state for adding patient.');
        //     return
        // }
        // const myStateSelected = state.filter((item) => item.stateCode == selectedState);
        // const stateName = myStateSelected[0].stateDesc;
        // console.log(stateName);
        // const myCountrySelected = country.filter((item) => item.countryID == selectedCountry);
        // const countryName = myCountrySelected[0].countryName;
        // console.log(countryName);
        const fullName = `${firstName + lastName}`;
        console.log(fullName);
        const formData = {
            clinicID: myClinicID,
            title: title,
            firstName: firstName,
            lastName: lastName,
            fullName: fullName,
            gender: gender,
            dob: moment(dob).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            strDOB: null,
            addressLine1: null,
            addressLine2: null,
            street: null,
            area: '',
            city: '',
            state: '',
            countryName: null,
            stateName: null,
            country: 101,
            zipCode: null,
            phoneNumber: phone,
            mobileNumber: phone,
            emailAddress1: email,
            emailAddress2: null,
            occupation: occupation,
            referredBy: null,
            referedByPatientFullName: null,
            referedByProviderFullName: null,
            referralPatientID: "00000000-0000-0000-0000-000000000000",
            referralProviderID: "00000000-0000-0000-0000-000000000000",
            referralDescription: null,
            imagethumbnail: null,
            strImageType: null,
            strimageBase64: null,
            strImagethumbnail: null,
            imagePath: null,
            registrationDate: currentDay,
            status: 0,
            workFlowInstanceID: "00000000-0000-0000-0000-000000000000",
            addedOn: currentDay,
            addedBy: null,
            lastUpdatedOn: "2023-03-11T07:29:42.784Z",
            lastUpdatedBy: null,
            caseID: 0,
            defaultLanguageID: 0,
            patientCode: null,
            rowguid: "00000000-0000-0000-0000-000000000000",
            patientRefNo: null,
            patientNotes: notes,
            age: 0,
            ageYear: 0,
            ageMonth: 0,
            strAge: null,
            familyID: "00000000-0000-0000-0000-000000000000",
            familyName: null,
            isCreatedExport: false,
            isCreatedExportedOn: "2023-03-11T07:29:42.784Z",
            isLastUpdatedExportedOn: "2023-03-11T07:29:42.784Z",
            isupdatedExport: false,
            isActiveSMSSubscriber: false,
            isActiveEmailSubscriber: false,
            isMobileAllowForcefully: false,
            nationality: null,
            passwordHashSalt: null,
            maritalStatus: null,
            signatures: null,
            signatureDate: "2023-03-11T07:29:42.784Z",
            signatureJson: null,
            recordCount: 0,
            createdBy: null,
            patientMedicalAttributesDTOList: [],
            patientTagsDTOList: [
                {
                    patientTagID: "00000000-0000-0000-0000-000000000000",
                    patientID: "00000000-0000-0000-0000-000000000000",
                    itemID: 0,
                    patientTagCategory: null,
                    patientTagValue: null,
                    patientTagsTitle: null,
                    itemDescription: null,
                    lastUpdatedBy: null,
                    lastUpdatedOn: "2023-03-11T07:29:42.784Z"
                }
            ],
            patientMedicalAttributesString: null,
            preferenceDTOList: [
                {
                    defaultpreferenceID: 0,
                    userID: "00000000-0000-0000-0000-000000000000",
                    patientID: "00000000-0000-0000-0000-000000000000",
                    category: null,
                    subCategory: null,
                    subCategoryValue: false,
                    createdOn: "2023-03-11T07:29:42.784Z",
                    createdBy: null,
                    isDeleted: false,
                    lastUpdatedBy: null,
                    lastUpdatedOn: "2023-03-11T07:29:42.784Z"
                }
            ],
            caseCode: null,
            mobileNum: null,
            searchResult: null,
            utilitySearchList: {
                birthDate: "2023-03-11T07:29:42.784Z",
                searchDTO: {
                    parameter: [
                        null
                    ],
                    parameterDate: [
                        "2023-03-11T07:29:42.784Z"
                    ],
                    userName: null,
                    pageIndex: 0,
                    pageSize: 0,
                    recordCount: 0,
                    clinicSearchAgentsHelperDTO: {
                        title: null,
                        registrationDate: null,
                        family: null,
                        ageFrom: null,
                        ageTo: null,
                        gender: null,
                        occupation: null,
                        referredBy: null,
                        noOFFamilyFrom: null,
                        noOFFamilyTo: null,
                        dobDayStart: null,
                        dobDayEnd: null,
                        dobMonthStart: null,
                        dobMonthEnd: null,
                        dobYearStart: null,
                        dobYearEnd: null,
                        smsSubscription: null,
                        emailSubScription: null,
                        validMobile: null,
                        validEmail: null,
                        building: null,
                        area: null,
                        city: null,
                        zipcode: null,
                        treatment: null,
                        treatmentDateFrom: null,
                        treatmentDateTo: null,
                        lastVisitFrom: null,
                        lastVisitTo: null,
                        treatmentStatus: null,
                        treatmentCostStart: null,
                        treatmentCostEnd: null,
                        collectionFromStart: null,
                        collectionFromEnd: null,
                        discountStart: null,
                        discountEnd: null,
                        netTreatmentCostStart: null,
                        netTreatmentCostEnd: null,
                        outstandingPaymentStart: null,
                        outstandingPaymentEnd: null,
                        agentDetailsxml: null
                    },
                    searchAgentID: "00000000-0000-0000-0000-000000000000",
                    _paramBool: [
                        false
                    ],
                    outputParameterDecimal1: 0,
                    outputParameterDecimal2: 0,
                    clinicID: myClinicID,

                    startDate: "2023-03-11T07:29:42.784Z",
                    endDate: "2023-03-11T07:29:42.784Z",
                    sortOrder: null,
                    sortColumn: null,
                    search: null,
                    flag: false,
                    expenseType: null,
                    searchparam: null,
                    query: null
                }
            },
            masterEntryDTO: {
                lookupdtoList: [
                    {

                        clinicID: myClinicID,
                        itemID: 0,
                        itemTitle: null,
                        itemDescription: null,
                        gender: null,
                        itemCategory: null,
                        isDeleted: false,
                        importance: 0,
                        lastUpdatedBy: null,
                        lastUpdatedOn: "2023-03-11T07:29:42.784Z",
                        rowguid: "00000000-0000-0000-0000-000000000000",
                        recordCount: 0,
                        medicalTypeID: "00000000-0000-0000-0000-000000000000",
                        patientAttributeData: null,
                        patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
                    }
                ],
                title: null,
                type: null,
                itemCategory: null,
                treatmenttypeList: [
                    {

                        clinicID: myClinicID,
                        title: null,
                        description: null,
                        parentTreatmentTypeID: "00000000-0000-0000-0000-000000000000",
                        generalTreatmentCost: 0,
                        specialistTreatmentCost: 0,
                        rowguid: "00000000-0000-0000-0000-000000000000",
                        isSelected: false
                    }
                ]
            },
            drIncharge: null,
            occuptation: null,
            medicalAlerts: null,
            refrenceSource: null,
            providerName: null,
            patientAllDetailDTO: {

                examinationCount: 0,
                fileCount: 0,
                treatmentsCount: 0,
                prescriptionsCount: 0,
                billlingAmount: 0,
                pateintFullName: null,
                mobileNumber: null,
                imagethumbnail: null,
                strImagethumbnail: null,
                imagePath: null,
                gender: null,
                strPateintMedicalAttributes: null,
                itemDescription: null,
                patientCode: null,
                netTreatmentCost: 0,
                balance: 0,
                emailID: null,
                nextAppointmentDate: "2023-03-11T07:29:42.785Z",
                appointmentCount: 0
            },
            isClinicLink: false,
            followUpDate: "2023-03-11T07:29:42.785Z",
            followUpReason: null,
            sendwelcomemessage: false,
            strCommunicationGroupIDCSV: null,
            countryDialCode: null,
            pateintFollowUpID: "00000000-0000-0000-0000-000000000000",
            patientCodePrefix: null,
            patientCodeValue: null,
            source: null,
            isProfileShare: false,
            clinicName: null,
            externalRefferalMasterId: "00000000-0000-0000-0000-000000000000",
            externalRefferalDataId: "00000000-0000-0000-0000-000000000000",
            refferalName: null,
            aadharCardNo: null,
            patientCodeMode: null,
            caseCodePrefix: null,
            relationId: "00000000-0000-0000-0000-000000000000",
            relation: null,
            relationPatientId: "00000000-0000-0000-0000-000000000000",
            relationPatientName: null,
            anniversaryDate: "2023-03-11T07:29:42.785Z",
            patientCodeSuffix: null,
            isTreatmentShare: false,
            isExaminationShare: false,
            isPrescriptionShare: false,
            isBillingShare: false,
            isFileShare: false,
            isAllowPatientPortalAccess: false,
            isPortalAccess: false,
            isPortalInvitationAccept: false,
            procedureName: null,
            chkacceptpayment: false,
            treatmentTypeID: "00000000-0000-0000-0000-000000000000",
            treatmentCost: 0,
            modeOfPayment: null,
            treatmentType: null,
            chequeDate: "2023-03-11T07:29:42.785Z",
            bankName: null,
            chequeNo: null,
            treatmentTotalPayment: 0
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
                    clinicID: myClinicID
                }
                formData.patientMedicalAttributesDTOList.push(arrObj2);
            }
        }
        console.log('Add Patient Form Data', formData);

        try {
            Axios.post(`${Api}Patient/InsertPatient`, formData,{headers}).then(resp => {
                const data = resp.data;
                console.log(data);
                // Snackbar.show({
                //     text: data.message,
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                // });
                alert(data.message);
                navigation.navigate('AddAppointments', {
                    clinicID: myClinicID,
                    patientID:data.patientID,
                    patientName:fullName,
                    firstName: firstName,
                    lastName: lastName
                })
            });
          
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleEmailChange = (value) => {
        setEmail(value);
        setEmailError(false);
    };
    const autoGeneratingCode = () => {
        console.log(myClinicID);
        if (value == 'auto') {
            try {
                Axios.post(`${Api}Patient/GetNextPatientCode?ClinicID=${myClinicID}`, {
                    headers: {
                        'accept': 'text/plain'
                    }
                }).then(resp => {
                    console.log(resp.data);
                    setCaseNumber(resp.data);
                });
                setModalVisible(false);
            } catch (error) {
                console.log(error.message);
            }
        } else {
            setCaseNumber('');
            setModalVisible(false);
        }
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
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log(
                    'User tapped custom button: ',
                    response.customButton
                );
                alert(response.customButton);
            } else {
                let source = response.assets;
                console.log('SOURCE', source);
                // You can also display the image using data:
                // let source = {
                //   uri: 'data:image/jpeg;base64,' + response.data
                // };
                setFilePath(source);
            }
        });
    };
    const handleCheckBox = () => {
        console.log(groupValues);
        const data = [];
        for (let i = 0; i < groupValues.length; i++) {
            const id = groupValues[i];

            // Find the corresponding author information
            const author = medicalAttributesData.find(item => item.id === id);

            if (author) {
                data.push(author);
            }
        }

        console.log("FINAL DATA Medical Alert", data);
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

        <ImageBackground source={require('../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
        <Modal isOpen={show} onClose={() => setShow(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header></Modal.Header>
                    <Modal.Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Calendar
                            onChange={onChange}
                            value={selectedDate}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} style={{ width: 420, alignSelf: 'center' }}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStylesheet.Text}>Patient Code Prefix</Text></Modal.Header>
                    <Modal.Body padding={5} >
                        {/* <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value} onChange={nextValue => {
                            setValue(nextValue);
                        }}>
                            <Radio value="auto" my={1}>
                                <Text style={CommonStylesheet.Text}>Auto-generating patient code</Text>
                            </Radio>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.Text}>Prefix</Text>
                                </View>
                                <View style={{ marginLeft: 30 }}>
                                    <Text style={styles.Text}>Next Number</Text>
                                </View>
                                <View style={{ marginLeft: 30 }}>
                                    <Text style={styles.Text}>Suffix</Text>
                                </View>

                            </View>
                            <View style={{ marginTop: 5 }}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ marginLeft: 5 }}>
                                    <Input h={10} w="290%" borderColor={'#005599'} bgColor={'white'} placeholder="case" />
                                </View>
                                <View style={{ marginLeft: 60 }}>
                                    <Input h={10} w="295%" borderColor={'#005599'} bgColor={'white'} placeholder="Number" />
                                </View>
                                <View style={{ marginLeft: 65 }}>
                                    <Input h={10} w="290%" borderColor={'#005599'} bgColor={'white'} placeholder="" />
                                </View>

                            </View>
                            <View style={{ marginTop: 10 }}></View>
                            <Radio value="manual" my={1}>
                                <Text style={CommonStylesheet.Text}>I will add them manually each time</Text>
                            </Radio>

                        </Radio.Group> */}
                        <RadioButtonGroup
                            containerStyle={{ marginBottom: 10 }}
                            selected={value}
                            onSelected={nextValue => {
                                setValue(nextValue);
                            }}
                            radioBackground="#0A79DF"
                        >
                            <RadioButtonItem value="auto" label={
                                <Text style={CommonStylesheet.regularText}>Auto-generating patient code</Text>
                            } />
                             {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.Text}>Prefix</Text>
                                </View>
                                <View style={{ marginLeft: 30 }}>
                                    <Text style={styles.Text}>Next Number</Text>
                                </View>
                                <View style={{ marginLeft: 30 }}>
                                    <Text style={styles.Text}>Suffix</Text>
                                </View>

                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ marginLeft: 5 }}>
                                    <Input h={10} w="290%" borderColor={'#005599'} bgColor={'white'} placeholder="case" />
                                </View>
                                <View style={{ marginLeft: 60 }}>
                                    <Input h={10} w="295%" borderColor={'#005599'} bgColor={'white'} placeholder="Number" />
                                </View>
                                <View style={{ marginLeft: 65 }}>
                                    <Input h={10} w="290%" borderColor={'#005599'} bgColor={'white'} placeholder="" />
                                </View>

                            </View>
                            <RadioButtonItem
                                value="manual"
                                label={
                                    <Text style={CommonStylesheet.regularText}>I will add them manually each time</Text>
                                }
                            /> */}
                        </RadioButtonGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" color={'#2196f3'} onPress={() => {
                                setModalVisible(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                autoGeneratingCode()
                            }}>
                                Update
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
            <Modal.Content width={350} height={500}>
                <Modal.CloseButton />
                <Modal.Header><Text style={{
                    fontSize: 14,
                    color: '#5f6067',
                    fontFamily: 'Poppins-Bold',
                }}>Choose Medical Alert</Text></Modal.Header>
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
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                            setShowModal1(false);
                        }}>
                            Cancel
                        </Button>
                        <Button onPress={() => {
                            handleCheckBox();
                        }}>
                            Save
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>

        <ScrollView>
            <View style={styles.formContainer}>
            

                <Stack space={2} w="100%" mx="auto" marginTop={2}>
                    <Select
                        placeholderTextColor={'#000000'}
                        fontSize={regularFontSize}
                        fontFamily={'Poppins-Regular'}
                     
                        bgColor={'#FFFFFF'}
                        borderRadius={10}
                      

                        selectedValue={title} minWidth="200" accessibilityLabel="Choose Title" placeholder="Choose Title" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => setSelectedTitle(itemValue)}>
                        {titleData.map(item => (

                            <Select.Item label={item.itemDescription} value={item.itemDescription} fontFamily={'Poppins-Regular'} key={item.id} />

                        ))}
                    </Select>

                    <Input
                        size="lg"
                        value={firstName}
                        onChangeText={(value) => setFirstName(value)}
                        placeholderTextColor={'#808080'}
                        style={styles.inputPlaceholder}
                      
                        placeholder=" First Name" />
                    <Input
                        size="lg"
                        value={lastName}
                        onChangeText={(value) => setLastName(value)}
                        placeholderTextColor={'#808080'}
                        style={styles.inputPlaceholder}
                        placeholder="Last Name"
                  
                    />
                     <View style={{ flexDirection: 'row', width: '100%' }}>
                        <Select
                            w={'40'}
                            placeholderTextColor={'#808080'}
                            fontSize={regularFontSize}
                            fontFamily={'Poppins-Regular'}
                          
                            bgColor={'#FFFFFF'}
                            borderRadius={10}
                           
                            selectedValue={countryCode} accessibilityLabel="Country Code" placeholder="Country Code" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setCountryCode(itemValue)}>

                            <Select.Item label='+91  (India)' value='+91' fontFamily={'Poppins-Regular'} />
                            <Select.Item label='+92  (Pakistaan)' value='+92' fontFamily={'Poppins-Regular'} />
                            <Select.Item label='+968 (Oman)' value='+968' fontFamily={'Poppins-Regular'} />
                            <Select.Item label='+974 (Qatar)' value='+974' fontFamily={'Poppins-Regular'} />
                        </Select>
    
                        <Input
                            width={"68%"}
                            value={phone}
                            keyboardType='numeric'
                            maxLength={10}
                            onChangeText={(value) => setPhone(value)}
                            marginLeft={2}
                            style={styles.inputPlaceholder}
                            borderRadius={10}
                            placeholderTextColor={'#808080'}
                            placeholder="Mobile Number"
                      
                        />
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>

                        <Input

                            onChangeText={(value) => setCaseNumber(value)}
                            width={'90%'}
                            style={styles.inputPlaceholder}
                            borderRadius={10}
                            //height={height*0.07}
                            placeholderTextColor={'#808080'}
                            placeholder="Case Number">{casenumber}</Input>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(!modalVisible);
                        }}>
                            <Icon
                                name="pen"
                                size={20}
                                color={"#2196f3"}
                                style={{}} />

                        </TouchableOpacity>

                    </View> */}
                  
                    <Input
                        size="lg"
                        value={email}
                        onChangeText={handleEmailChange}
                        style={styles.inputPlaceholder}
                        borderRadius={10}
                        placeholderTextColor={'#808080'}
                        placeholder="Email"
                  
                    />
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Input
                            value={dob == null ? '' : moment(dob).format('LL')}
                            onChangeText={(value) => calculateAge(value)} width={'90%'}
                            placeholder="Date of Birth" borderRadius={10}
                            placeholderTextColor={'#808080'}
                           
                            style={styles.inputPlaceholder} />
                        {/* {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={'date'}
                                is24Hour={true}
                                onChange={onChange}
                                maximumDate={new Date()}
                            />
                        )} */}

                        <View style={{}}>
                            <TouchableOpacity onPress={showDatepicker}>
                                <Image
                                    source={require('../../assets/images/calendarDash.png')} alt="logo.png"
                                    style={{ height: 38, width: 40, borderRadius: 5 }} />
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
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
                    </View>
                    
                    <Select
                        placeholderTextColor={'#808080'}
                        fontSize={regularFontSize}
                        fontFamily={'Poppins-Regular'}
                      
                        bgColor={'#FFFFFF'}
                        borderRadius={10}
                       
                        selectedValue={gender} minWidth="200" accessibilityLabel="Choose Gender" placeholder="Choose Gender" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => setGender(itemValue)}>
                        <Select.Item label='Male' value='M' fontFamily={'Poppins-Regular'} />
                        <Select.Item label='Female' value='F' fontFamily={'Poppins-Regular'} />
                        <Select.Item label='Other' value='O' fontFamily={'Poppins-Regular'} />
                    </Select>
                    <Select
                        placeholderTextColor={'#808080'}
                        style={styles.inputPlaceholder}
                      
                        bgColor={'#FFFFFF'}
                      
                        borderRadius={10}
                        selectedValue={occupation} minWidth="200" accessibilityLabel="Choose Occupation" placeholder="Choose Occupation" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => setOccupation(itemValue)}>
                        {occupationData.map(item => (

                            <Select.Item label={item.itemTitle} value={item.itemDescription} fontFamily={'Poppins-Regular'} key={item.itemID} />

                        ))}
                    </Select>
                    <Input
                        value={ItemName.toString()}
                        borderRadius={10}
                        borderColor={'#a6a6a6'}
                        placeholder=" Select Medical Alert"
                        placeholderTextColor={'#808080'}
                        style={styles.inputPlaceholder}
                        onFocus={() => openModal()}
                  
                    />

                    <Select
                        placeholderTextColor={'#808080'}
                        fontSize={regularFontSize}
                        fontFamily={'Poppins-Regular'}
                      
                        bgColor={'#FFFFFF'}
                        borderRadius={10}
                       
                        selectedValue={language} minWidth="200" accessibilityLabel="Choose Language" placeholder="Choose Language" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => setLanguage(itemValue)}>
                        <Select.Item label='Marathi' value='Marathi' fontFamily={'Poppins-Regular'} />
                        <Select.Item label='Hindi' value='Hindi' fontFamily={'Poppins-Regular'} />
                        <Select.Item label='English' value='English' fontFamily={'Poppins-Regular'} />
                    </Select>
                   
                    <Input
                        size="lg"
                        value={notes}
                        onChangeText={(value) => setNotes(value)}
                        style={styles.inputPlaceholder}
                        borderRadius={10}
                        placeholderTextColor={'#808080'}
                        placeholder="Notes"
                   
                    />
            
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
    </ImageBackground>
    );
};

export default AddPatientViaAppointment;

const styles = StyleSheet.create({
    formContainer:{
        flex:1,
        width:'100%',
        padding:10
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
    inputFontStyle:{
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
    }


});