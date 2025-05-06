import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
    HStack,
    Switch,
    Badge
} from 'native-base';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Axios from 'axios';
import Api from '../../../api/Api';
import moment from 'moment';
import PatientHeader from '../../../components/PatientHeader';
//import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { getHeaders } from '../../../utils/apiHeaders';
import { useSelector, useDispatch } from 'react-redux';
import { GetPatientAllDetailForMobile } from '../../../features/patientsSlice';
import { providerList, titleList, Occupation, MedicalAttributes, fetchPatient } from '../../../features/commonSlice';
import { UpdatePatientPersonalDetailForMobile } from '../../../features/patientprofileSlice';
import Toast from 'react-native-toast-message';


const { height, width } = Dimensions.get('window');
const mainCardHeader = Math.min(width, height) * 0.04;
const regularFontSize = width < 600 ? 15 : 18;
const primaryFontSize = width < 600 ? 17 : 22;

function PatientProfile() {
    const dispatch = useDispatch();
    const provider = useSelector((state => state.common.providerList)) || [];
    const titleData = useSelector((state) => state.common.titleList) || [];
    const occupationData = useSelector((state) => state.common.occupationList) || [];
    const medicalAttributesData = useSelector((state) => state.common.MedicalAttributesList) || [];
   // console.log("titleData", titleData);
    const navigation = useNavigation();
    const [groupValues, setGroupValues] = React.useState([]);
    const [service, setService] = React.useState("");
    const [switchOn, setSwitchOn] = useState(false);
    const [dashboard, setDashboard] = useState({});
    const [patientDetails, setPatientDetils] = useState({});
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    //userInputs
    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [show, setShow] = useState(false);
    //Drop-downs
    //const [provider, setProvider] = useState([]);
    // const [titleData, setTitleData] = useState([]);
    //const [occupationData, setOccupationData] = useState([]);
    //const [medicalAttributesData, setMedicalAttributesData] = useState([]);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    //User Inputs
    const [title, setTitle] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [mobile, setMobile] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('');
    const [providerName, setproviderName] = useState('');
    const [occupation, setOccupation] = useState('');
    const [medicalAttribute, setMedicalAttribute] = useState('');
    const [caseNo, setCase] = useState('');
    const [dob, setDob] = useState(null);
    const [gender, setGender] = useState('');
    //age calculator
    const [years, setYear] = useState(null);
    const [months, setMonths] = useState(null);
    // const [address1, setAddress1] = useState('');
    // const [address2, setAddress2] = useState('');
    const [medicalAlert, setMedicalAlert] = useState('');
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [language, setLanguage] = useState('');
    // const [email, setEmail] = useState('');
    // const [area, setArea] = useState('');
    // const [street, setStreet] = useState('');
    // const [city, setCity] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(101);
    const [selectedState, setSelectedState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [loaderButton, setloaderButton] = useState(false);
    const [portalAccess, setportalAccess] = useState(false);
    //modal handling
    const [showModal, setShowModal] = useState(false);
    const [showModalportal, setShowModalportal] = useState(false);
    const [selectedMedicalAlert, setSelectedMedicalAlert] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [token, setToken] = useState('');
    const [userName, setUserName] = useState('');
    const [registrationDate, setregistrationDate] = useState(null);
    const [dateType, setDateType] = useState('');
    const [myPatientID, setPatientID] = useState('');
    const [myclinicID, setMyclinicID] = useState('');


    const readData = async () => {
       // console.log("dob", dob)
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setUserName(user.userName);
        setproviderName(user.name);
        setPatientID(user.patientID);
        setMyclinicID(user.patientID);
        const formData1 = {
            patientID: user.patientID,
        }
        //console.log("formData1",formData1)
        const formData2 = {
            applicationDTO: {
                clinicID: user.clinicID
            }
        }
        const formDataTitle = {
            clinicID: user.clinicID,
            itemCategory: "Title"
        }
        const formDataOccupation = {
            clinicID: user.clinicID,
            itemCategory: "Occupation"
        }
        const formDataPatientMedicalAttributes = {
            clinicID: user.clinicID,
            itemCategory: "PatientMedicalAttributes"
        }
        const formDataGetPatientbyID = {
            patientID: user.patientID
        }

        try {
            const [GetPatientAllDetail, doctorList, titleData, OccupationData, MedicalAttributesData, patientData] = await Promise.all([
                await dispatch(GetPatientAllDetailForMobile(formData1)).unwrap(),
                await dispatch(providerList(formData2)).unwrap(),
                await dispatch(titleList(formDataTitle)).unwrap(),
                await dispatch(Occupation(formDataOccupation)).unwrap(),
                await dispatch(MedicalAttributes(formDataPatientMedicalAttributes)).unwrap(),
                await dispatch(fetchPatient(formDataGetPatientbyID)).unwrap(),
            ]);
            setDashboard(GetPatientAllDetail);
            setName(GetPatientAllDetail.pateintFullName);
            setPatientDetils(patientData);
            const {
                title,
                firstName,
                lastName,
                patientCode,
                providerName,
                gender,
                dob,
                mobileNumber,
                occupation,
                patientNotes,
                zipCode,
                ageYear,
                ageMonth,
                registrationDate,
                isPortalAccess
            } = patientData;

            setTitle(title);
            setFname(firstName);
            setLname(lastName);
            setMobile(mobileNumber);
            setCase(patientCode);
            setproviderName(providerName);
            setGender(gender);
            setDob(dob);
            setOccupation(occupation);
            setNotes(patientNotes);
            setZipCode(zipCode);
            setYear(ageYear);
            setMonths(ageMonth);
            setregistrationDate(registrationDate);
            setportalAccess(isPortalAccess);
            return {
                GetPatientAllDetail: GetPatientAllDetail?.data,
                doctorList: doctorList?.data,
                titleData: titleData?.data,
                occupationData: OccupationData?.data,
                MedicalAttributesList: MedicalAttributesData?.data,
                patientData: patientData?.data,
            };
        } catch (error) {
            console.error("An error occurred:", error);
            return { error: true };
        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        readData();
    }, []);

    // const onChange = (day) => {
    //     if (day) {
    //         const formattedDate = moment(day).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
    //         console.log(formattedDate);
    //         setSelectedDate(day); // Assuming this is a Date object
    //         setShow(false);
    //         setDob(formattedDate); // Save formatted DOB
    //         calculateAge(day); // Pass the Date object directly
    //        setregistrationDate(formattedDate)
    //     }
    // };
    const onChange = (date) => {
        setSelectedDate(date);
        //console.log("DOB", date);
        setShow(false);

        if (dateType === 'dob') {
            setDob(date);
        } else if (dateType === 'registrationDate') {
            setregistrationDate(date);
            //console.log('registrationDate', date);
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
    const showDatepicker = (type) => {
        setDateType(type);
        setShow(true);
    };
    const handleChange = (value) => {
        // Remove any non-numeric characters from the input
        const numericValue = value.replace(/[^0-9]/g, '');
        setMobile(numericValue);
    };
    const getState = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        }
        const formData = {
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
    const openPortalAccessModal = () => {
        setShowModalportal(true);
    };
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

        //console.log("FINAL DATA Medical Alert", data);
        setSelectedMedicalAlert(data);
        setShowModal(false);
    }
     const pickImages = async () => {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: false,
                base64: true, // Get Base64 data
            });
        
            //console.log("result", result.assets);
        
            if (!result.canceled) {
                setLoading(true);
                const selectedImage = result.assets[0];
                let base64Data = selectedImage.base64;
        
                // **Ensure Base64 is clean**
                if (base64Data.includes(',')) {
                    base64Data = base64Data.split(',')[1]; // Remove metadata
                }
        
                try {
                    // ✅ Convert Base64 to Uint8Array (Byte Array)
                    const byteCharacters = atob(base64Data);
                    const byteArray = new Uint8Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteArray[i] = byteCharacters.charCodeAt(i);
                    }
        
                    // ✅ Convert Uint8Array to a pure byte array for JSON
                    const byteArrayAsArray = Array.from(byteArray);
        
                    // Extract image name
                    const imageName = selectedImage.fileName || selectedImage.uri.split('/').pop();
        
                    // ✅ Update existing formData (DO NOT create a new one)
                    let formData = { ...patientDetails }; // Use patientDetails as base
                    formData.strimageBase64 = imageName; // Assign filename
        
                    // ✅ API expects `{byte[1010]}` so send a proper byte array
                    formData.imagethumbnail = base64Data;;
        
                    //console.log("Final formData before sending:", JSON.stringify(formData, null, 2));
        
                    await dispatch(UpdatePatientPersonalDetailForMobile(formData)).unwrap();
                    Toast.show({
                        type: 'success',
                        text1: 'Patient edited successfully.',
                    });
        
                    readData();
                } catch (error) {
                    console.error("Error updating formData:", error);
                }
            }
        };
    const editPatient = async () => {

        if (providerName == '' || providerName == undefined || providerName == null) {
            // Snackbar.show({
            //     text: 'Please select doctor.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select doctor.',
                text2: 'Please select doctor to continue.',
            });
            //alert('Please select doctor.');
            return
        }
        //Getting provider Id from provider name
        const myProviderID = provider.filter((item) => item.providerName == providerName);
        const mySelectedIDOfDoctor = myProviderID.find(item => item.providerID);
        //console.log(mySelectedIDOfDoctor);
        const drID = mySelectedIDOfDoctor.providerID;

        if (drID == '' || drID == undefined) {
            // Snackbar.show({
            //     text: 'Please select doctor.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select doctor.',
                text2: 'Please select doctor to continue.',
            });
            return
        }
        let date = moment(dob);
        let regDate = moment(registrationDate);
        // Set the minutes to zero
        date.minutes(0);
        // Format the date to the required format
        let newDate = date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') || null;
        let newregDate = regDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        let formData = { ...patientDetails };
        formData.title = title,
            formData.patientCode = caseNo,
            formData.firstName = fname,
            formData.lastName = lname,
            formData.providerID = drID,
            formData.dob = dob
                ? moment(dob).format("YYYY-MM-DDT00:00:00.000[Z]").toString()
                : null;
        formData.registrationDate = newregDate,
            formData.mobileNumber = mobile,
            formData.occupation = occupation,
            formData.gender = gender,
            formData.patientNotes = notes,
            formData.ageYear = parseInt(years) || 0,
            formData.ageMonth = parseInt(months) || 0,
            formData.lastUpdatedBy = userName,
            formData.addedBy = userName
       // console.log("Edit Form Data", formData);
        setloaderButton(true);
        try {
            await dispatch(UpdatePatientPersonalDetailForMobile(formData)).unwrap(),
              //  alert('Patient edited successfully.');
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Patient edited successfully.',
                });
            navigation.navigate('PatientMoreDetails', {
                clinicID: myclinicID,
                patientID: myPatientID
            })
            setloaderButton(false);
        } catch (error) {
            //console.log(error);
        }
    }
    const AddMoreDetails = () => {
        navigation.navigate('PatientMoreDetails', {
            clinicID: myclinicID,
            patientID: myPatientID
        })
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
           // console.log(initials);

            return initials;
        } else {
           // console.log('patientFullName is undefined or not accessible.');
            // Handle the case where patientFullName is undefined or not accessible
        }
    }
    const toggleSwitch = (value) => {
        setportalAccess(value); // Update portalAccess state
        setShowModalportal(true); // Show the modal
    };
    const onConfirm = async () => {
        //console.log(portalAccess);
        const token = await AsyncStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        }
        const formData = {
            patientID: myPatientID,
            clinicID: myclinicID,
            isAllowPatientPortalAccess: portalAccess,
            isPortalAccess: portalAccess,
            isPortalInvitationAccept: portalAccess

        }
        console.log(formData);
        try {
            Axios.post(`${Api}Patient/UpdatePatientPortalAccess`, formData, { headers }).then(resp => {
               // console.log(resp.data);
                setShowModalportal(false);
            });
            // Snackbar.show({
            //     text: `Patient access updated successfully.`,
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'green',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
            alert('Patient access updated successfully.');
            setShowModalportal(false);
            readData();
        } catch (error) {
           // console.log(error);
        }

    };

    return (

        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {loading ? <Loader /> :
                <>
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
                    <Modal isOpen={showModalportal} onClose={() => setShowModalportal(false)}>
                        <Modal.Content maxWidth="400">
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                            <Modal.Body>
                                {portalAccess ? (
                                    <Text style={{ fontFamily: 'poppins-regular' }}>
                                        Auto generated link will be sent to create a password through SMS and Email
                                    </Text>
                                ) : (
                                    <Text style={{ fontFamily: 'poppins-regular' }}>
                                        Are you sure you want to disable portal access?{`\n`}
                                        (Note: If disabled, all credentials for this patient will be reset.)
                                    </Text>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <TouchableOpacity onPress={() => {
                                    setShowModalportal(false);
                                }}>
                                    <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                        <Text style={CommonStylesheet.ButtonText}> Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onConfirm()}>
                                    <View style={CommonStylesheet.buttonContainersave1}>
                                        <Text style={CommonStylesheet.ButtonText}> Confirm</Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <PatientHeader patientID={myPatientID} />
                    <ScrollView>
                        <View style={CommonStylesheet.container}>
                            <View style={Styles.containerPatientInfo}>


                                {/* <ScrollView> */}

                                <View style={{ marginTop: 10 }}>
                                    <Stack space={2} w="100%" mx="auto" >
                                        <Input
                                            onFocus={() => showDatepicker('registrationDate')}
                                            placeholderTextColor={'#888888'}
                                            size="lg"
                                            style={Styles.inputFontStyle}
                                            borderRadius={5}
                                            // isDisabled
                                            placeholder="Date"
                                            value={registrationDate == null ? '' : moment(registrationDate).format('LL')}

                                        />
                                        <Picker
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

                                            selectedValue={providerName}
                                            onValueChange={itemValue => setproviderName(itemValue)}>
                                            <Picker.Item
                                                label={providerName == null ? "Select Doctor" : providerName}
                                                value={providerName == null ? "" : providerName}
                                                color='black' />
                                            {provider.map(item => (
                                                <Picker.Item label={item.providerName} value={item.providerName} key={item.providerID} />
                                            ))}
                                        </Picker>
                                        <Picker

                                            selectedValue={title}
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




                                            onValueChange={itemValue => setTitle(itemValue)}>
                                            <Picker.Item label="Choose Title" value={null} color='black' />
                                            {titleData.map(item => (
                                                <Picker.Item label={item.itemDescription} value={item.itemDescription} fontFamily={'Poppins-Regular'} key={item.id} />

                                            ))}
                                        </Picker>
                                        <Input
                                            value={fname}
                                            onChangeText={(value => setFname(value))}
                                            width={'100%'}
                                            placeholderTextColor={'#888888'}
                                            borderRadius={5}
                                            style={Styles.inputFontStyle}
                                            placeholder="First Name"
                                        />
                                        <Input
                                            width={'100%'}
                                            value={lname}
                                            onChangeText={(value => setLname(value))}
                                            placeholderTextColor={'#888888'}
                                            borderRadius={5}
                                            style={Styles.inputFontStyle}
                                            placeholder="Last Name"
                                        />
                                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Input 
                                        width={'20%'} 
                                        borderRadius={10} 
                                        placeholderTextColor={'#888888'} 
                                        style={Styles.inputPlaceholder} 
                                        placeholder="+ 91" 
                                        marginRight={3} isDisabled
                                        />
                                  </View> */}
                                        <Input
                                            w="100%"
                                            value={mobile}
                                            onChangeText={(value => setMobile(value))}
                                            borderRadius={5}
                                            maxLength={10}
                                            placeholder="Mobile Number"
                                            placeholderTextColor={'#888888'}
                                            style={Styles.inputFontStyle}
                                        />


                                        <Input
                                            value={caseNo} onChangeText={(value => setCase(value))}
                                            placeholder="Case No"
                                            borderRadius={5}
                                            placeholderTextColor={'#888888'}
                                            style={Styles.inputFontStyle}
                                            editable={false}
                                        />

                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                            <Input
                                                onFocus={() => showDatepicker('dob')}
                                                value={dob == null ? '' : moment(dob).format('LL')}
                                                onChangeText={(value) => calculateAge(value)}
                                                width={'92%'}
                                                placeholder="Date of Birth"
                                                borderRadius={5}
                                                placeholderTextColor={'#888888'}
                                                style={Styles.inputFontStyle}
                                            />
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

                                            <View style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                                                <TouchableOpacity onPress={() => showDatepicker('dob')}>
                                                    <Image
                                                        source={require('../../../assets/images/calendarDash.png')} alt="logo.png"
                                                        style={{ height: 34, width: 36, borderRadius: 5 }} />
                                                </TouchableOpacity>
                                            </View>

                                        </View>

                                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Input w="45%" style={Styles.inputFontStyle} borderRadius={10} borderColor={'#a6a6a6'} onChangeText={(val) => setYear(val)} bgColor={'#FFFFFF'} placeholder="Year" value={years}></Input>
                                        <Input w="45%" style={Styles.inputFontStyle} borderRadius={10} borderColor={'#a6a6a6'} onChangeText={(val) => setMonths(val)} bgColor={'#FFFFFF'} placeholder="Month" value={months}></Input>
                                    </View> */}
                                        <Picker
                                            selectedValue={gender}
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
                                            onValueChange={itemValue => setGender(itemValue)}>
                                            <Picker.Item label="Choose Gender" value={null} color='black' />
                                            <Picker.Item label='Male' value='M' fontFamily={'Poppins-Regular'} />
                                            <Picker.Item label='Female' value='F' fontFamily={'Poppins-Regular'} />
                                            <Picker.Item label='Other' value='O' fontFamily={'Poppins-Regular'} />
                                        </Picker>
                                        <View>
                                            <Picker
                                                selectedValue={occupation}
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
                                                onValueChange={itemValue => setOccupation(itemValue)}>
                                                <Picker.Item label="Choose Occupation" value={null} color='black' />
                                                {occupationData.map(item => (
                                                    <Picker.Item label={item.itemTitle} value={item.itemDescription} fontFamily={'Poppins-Regular'} key={item.itemID} />

                                                ))}
                                            </Picker>

                                        </View>
                                        <Input
                                            value={notes}
                                            onChangeText={(value => setNotes(value))}
                                            borderRadius={5}
                                            placeholder="Notes"
                                            placeholderTextColor={'#888888'}
                                            style={Styles.inputFontStyle}
                                        />
                                    </Stack>
                                </View>
                                {/* <HStack alignItems="center" space={4}
                                style={{ marginLeft: 10, marginTop: 10 }}>
                                <Text style={CommonStylesheet.Text}>Patient portal access</Text>
                                <Switch size="md" value={portalAccess} onValueChange={()=>toggleSwitch()}/>
                            </HStack> */}
                                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15, marginBottom: 10 }}>

                                    <TouchableOpacity onPress={() => editPatient()}>
                                        <View style={CommonStylesheet.buttonContainersaveatForm}>
                                            <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                        </View>
                                    </TouchableOpacity>

                                </Box>
                                {/* </ScrollView> */}
                            </View>

                        </View>
                    </ScrollView>
                </>
            }
        </View>
        // </ImageBackground>
    );
}

export default PatientProfile;

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
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#fff',
        height: height * 0.07,
    },
    inputPlaceholder: {
        fontSize: regularFontSize,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        //opacity: 0.7,

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
        borderRadius: height / 10,
        // backgroundColor: '#ccc',
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
        width: 25, // Adjust width based on screen width
        height: 25, // Adjust height based on screen height,
        marginTop: 10
    },
})