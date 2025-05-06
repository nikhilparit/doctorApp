import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions, Alert, Linking, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button, Modal, FormControl, Input, Center, NativeBaseProvider, Image, HStack, Switch, Checkbox, Badge } from "native-base";
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import Api from '../../api/Api';
import Loader from '../../components/Loader';
import WebView from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { GetPatientAllDetailForMobile, setPortalAccess, UpdatePatientPortalAccess, } from '../../features/patientsSlice';
import { UpdatePatientPersonalDetailForMobile } from '../../features/patientprofileSlice';
import { fetchPatient } from '../../features/commonSlice';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
//import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MaxHeight = width < 600 ? 230 : 230;
const MaxWidth = width < 600 ? 300 : 800;


function PatientDetails() {
    const dispatch = useDispatch();
    const item = useSelector((state) => state.patient.PatientAllDetail);
    const portalAccess = useSelector((state) => state.patient.portalAccess);
    // const clinicID = route.params.clinicID;
    // const mypatientID = route.params.patientID;
    //console.log(clinicID,patientID);
    const navigation = useNavigation();
    // const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    //handing modal 
    const [showModal, setShowModal] = useState(false);
    const [showModalPrint, setShowModalPrint] = useState(false);
    //handling patient portal access switch
    //const [portalAccess, setportalAccess] = useState(false);
    //handling print checkboxes
    const [groupValues, setGroupValues] = React.useState(["1", "2", "3", "4", "5", "6", "7", "8"]);
    const [token, setToken] = useState('');
    const [patientID, setpatientID] = useState();
    const [selectedImages, setSelectedImages] = useState([]);
    const [patientDetails, setPatientDetils] = useState({});

    const readData = async () => {
        setLoading(true); // Set loading to true at the start of the function
        const userString = await AsyncStorage.getItem('user');
        if (!userString) {
            throw new Error('User data not found in AsyncStorage');
        }
        const selectedUser = JSON.parse(userString);
        const selectedPatientID = selectedUser.patientID;
        try {
            const formDataGetPatientbyID = {
                patientID: selectedPatientID
            }
            const [patientData] = await Promise.all([
                await dispatch(fetchPatient(formDataGetPatientbyID)).unwrap(),
            ]);
            setPatientDetils(patientData);

           // console.log("portalAccess", portalAccess);
            // Retrieve user data from AsyncStorage
            // Update patientID state
            setpatientID(selectedPatientID);

            const formData = { patientID: selectedPatientID };

            // Fetch patient details
            const resultData = await dispatch(fetchPatient(formData)).unwrap();
            const { isPortalAccess } = resultData;

            // Set portal access state and Redux state
            setPortalAccess(isPortalAccess);
            dispatch(setPortalAccess(isPortalAccess)); // Update Redux store

            // Fetch additional patient details if necessary
            const resultAction = await dispatch(GetPatientAllDetailForMobile(formData));
            if (GetPatientAllDetailForMobile.fulfilled.match(resultAction)) {
                // console.log('Data fetched successfully:', resultAction.payload);
            } else {
                console.error('Error fetching data:', resultAction.payload);
            }
        } catch (error) {
            console.error('Error in readData:', error);
        } finally {
            setLoading(false); // Ensure loading state is reset in all cases
        }
    };

    // Ensure the readData function is called only when the component is focused
    useFocusEffect(
        React.useCallback(() => {
            readData(); // Fetch data when the component gains focus
            return () => {
                setLoading(false); // Optional cleanup if needed
            };
        }, []) // Ensure no unnecessary re-renders
    );

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
            //console.log(initials);

            return initials;
        } else {
            //console.log('patientFullName is undefined or not accessible.');
            // Handle the case where patientFullName is undefined or not accessible
        }
    }

    const billingDetails = async () => {
        const userString = await AsyncStorage.getItem('user'); // Get user data
        const selectedUser = JSON.parse(userString);
        navigation.navigate('Bill', {
            clinicID: selectedUser.clinicID,
            patientID: selectedUser.patientID
        });
    }
    const callNumber = (phoneNumber) => {
        //console.log(phoneNumber);
        Linking.openURL(`tel:${phoneNumber}`);
    };
    // const sendTextMessage = (phoneNumber, message) => {
    //     const url = Platform.select({
    //         ios: `sms:${phoneNumber}&body=${encodeURIComponent(message)}`,
    //         android: `sms:${phoneNumber}?body=${encodeURIComponent(message)}`,
    //         web: `mailto:?body=${encodeURIComponent(message)}&to=${phoneNumber}`,
    //     });

    //     if (Platform.OS === 'web') {
    //         window.open(url);
    //     } else {
    //         Linking.canOpenURL(url)
    //             .then(supported => {
    //                 if (!supported) {
    //                     console.log('SMS is not supported on this device.');
    //                 } else {
    //                     return Linking.openURL(url);
    //                 }
    //             })
    //             .catch(error => console.log(error));
    //     }
    // };

    const sendTextMessage = (phoneNumber, message) => {
        const url = Platform.select({
            ios: `sms:${phoneNumber}&body=${encodeURIComponent(message)}`,
            android: `sms:${phoneNumber}?body=${encodeURIComponent(message)}`,
            //web: `mailto:?subject=Message%20to%20${phoneNumber}&body=${encodeURIComponent(message)}`,
            web: `sms:${phoneNumber}?body=${encodeURIComponent(message)}`,
        });

        if (Platform.OS === 'web') {
            window.location.href = url;
        } else {
            Linking.canOpenURL(url)
                .then(supported => {
                    if (!supported) {
                       // console.log('SMS is not supported on this device.');
                    } else {
                        return Linking.openURL(url);
                    }
                })
                .catch(error => console.log(error));
        }
    };
    const openPortalAccessModal = () => {
        setShowModal(true);
    };
    const onConfirm = async () => {
        try {
            const userString = await AsyncStorage.getItem('user'); // Retrieve user data
            if (!userString) {
                throw new Error('User data not found in AsyncStorage');
            }

            const selectedUser = JSON.parse(userString);
            const formData = {
                patientID: selectedUser.patientID,
                clinicID: selectedUser.clinicID,
                isAllowPatientPortalAccess: portalAccess,
                isPortalAccess: portalAccess,
                isPortalInvitationAccept: portalAccess,
            };

            const actionResult = await dispatch(UpdatePatientPortalAccess(formData));

            if (actionResult?.payload?.code === 200) {
                Toast.show({
                    type: 'success',
                    text1: actionResult.payload.message || 'Portal access updated successfully',
                });
                setShowModal(false); // Close the modal
            } else {
                throw new Error(actionResult.payload.message || 'Unexpected error occurred');
            }
        } catch (error) {
            console.error('Error updating portal access:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to update portal access',
                text2: error.message || 'Please try again later.',
            });
        }
    };

    const openPrintModal = () => {
        setShowModalPrint(!showModalPrint);
    };
    const onPrintSummary = async () => {
        const userString = await AsyncStorage.getItem('user'); // Get user data
        const selectedUser = JSON.parse(userString);
        let printOptions = (groupValues).toString();
        navigation.navigate('Print', {
            clinicID: selectedUser.clinicID,
            patientID: selectedUser.patientID,
            viewName: "_patientsummaryprint",
            selection: printOptions
        });
        setShowModalPrint(false);
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
    
       // console.log("result", result.assets);
    
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
    
               // console.log("Final formData before sending:", JSON.stringify(formData, null, 2));
    
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
     
    const UploadMyFile = async () => {
        setLoading(true);
        // Create a FormData object
        //  console.log('selectedImages', selectedImages);
        const formData = new FormData();

        for (const image of selectedImages) {
            // Log selected image details
            // console.log("Processing Image:", image);

            // Extract Base64 data
            const base64Data = image.uri.split(',')[1];
            // console.log("Base64 Data:", base64Data);

            if (!base64Data) {
                console.error("Invalid Base64 Data for image:", image);
                continue;
            }

            // Convert Base64 to Blob
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length)
                .fill(0)
                .map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: image.mimeType });
            //console.log("Blob Created:", blob);

            // Append to FormData
            const originalFileName = image.fileName || `image_${Date.now()}.png`;
            //  console.log("File Name:", originalFileName);
            formData.append('cliniLogofile', blob, originalFileName);
        }

        // Log FormData entries
        // console.log("FormData Contents:");
        for (let pair of formData.entries()) {
            //  console.log(pair[0] + ':', pair[1]);
        }

    }

    return (
        // <ImageBackground source={require('../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
        <>
            {loading ? <Loader /> :
                <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                    <>
                        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                            <Modal.Content maxWidth="400">
                                <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                                <Modal.Header style={CommonStylesheet.popheader}>
                                    <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text>
                                </Modal.Header>
                                <Modal.Body>
                                    <HStack alignItems="center" space={4}>
                                        <Text style={{ fontFamily: 'poppins-regular' }}>Patient Portal Access</Text>
                                        <Switch
                                            size="md"
                                            value={portalAccess}
                                            onValueChange={(value) => dispatch(setPortalAccess(value))}
                                        />
                                    </HStack>
                                    {portalAccess ? (
                                        <Text style={{ fontFamily: 'poppins-regular' }}>
                                            Auto-generated link will be sent to create a password through SMS and Email
                                        </Text>
                                    ) : (
                                        <Text style={{ fontFamily: 'poppins-regular' }}>
                                            Are you sure you want to disable portal access?{'\n'}
                                            (Note: If disabled, all credentials for this patient will be reset.)
                                        </Text>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <TouchableOpacity onPress={() => setShowModal(false)}>
                                        <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                            <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onConfirm()}>
                                        <View style={CommonStylesheet.buttonContainersave1}>
                                            <Text style={CommonStylesheet.ButtonText}>Confirm</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                        <Modal isOpen={showModalPrint} onClose={() => setShowModalPrint(false)}>
                            <Modal.Content maxWidth="500px">
                                <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                                <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Print summary options</Text></Modal.Header>
                                <Modal.Body>

                                    <Checkbox.Group onChange={setGroupValues} value={groupValues} accessibilityLabel="choose numbers" colorScheme={"blue"}>
                                        <Checkbox value="1" my={2}>
                                            <Text style={{ fontFamily: "poppins-regular" }}>Contact Details</Text>
                                        </Checkbox>
                                        <Checkbox value="2" my={2}>
                                            <Text style={{ fontFamily: "poppins-regular" }}>Medical Alert</Text>
                                        </Checkbox>
                                        <Checkbox value="3" my={2}>
                                            <Text style={{ fontFamily: "poppins-regular" }}>Examination Details</Text>
                                        </Checkbox>
                                        <Checkbox value="4" my={2}>
                                            <Text style={{ fontFamily: "poppins-regular" }}>Treatment Details</Text>
                                        </Checkbox>
                                        <Checkbox value="5" my={2}>
                                            <Text style={{ fontFamily: "poppins-regular" }}>Prescription Details</Text>
                                        </Checkbox>
                                        <Checkbox value="6" my={2}>
                                            <Text style={{ fontFamily: "poppins-regular" }}>Passbook Details</Text>
                                        </Checkbox>
                                        <Checkbox value="7" my={2}>
                                            <Text style={{ fontFamily: "poppins-regular" }}>Appointment Details</Text>
                                        </Checkbox>
                                        <Checkbox value="8" my={2}>
                                            <Text style={{ fontFamily: "poppins-regular" }}>Investigation Details</Text>
                                        </Checkbox>
                                    </Checkbox.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <TouchableOpacity onPress={() => {
                                        setShowModalPrint(false);
                                    }}>
                                        <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                            <Text style={CommonStylesheet.ButtonText}> Cancel</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onPrintSummary()}>
                                        <View style={CommonStylesheet.buttonContainersave1}>
                                            <Text style={CommonStylesheet.ButtonText}>Print</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>

                        <View style={Styles.container}>
                            <View style={[Styles.imageContainer, CommonStylesheet.shadow]} key={item.patientID}>
                                <TouchableOpacity onPress={() => { pickImages() }}>
                                    <View style={{ justifyContent: 'center', marginVertical: 5 }}>
                                        {item.imagethumbnail ? (
                                            <Image
                                                source={{ uri: `data:image/png;base64,${item.imagethumbnail}` }}
                                                alt="logo.png"
                                                style={CommonStylesheet.imageatPatient}
                                            />
                                        ) : item.gender === "M" ? (
                                            <Image
                                                source={require('../../assets/images/Male.jpg')}
                                                alt="logo.png"
                                                style={CommonStylesheet.imageatPatient}
                                            />
                                        ) : item.gender === "F" ? (
                                            <Image
                                                source={require('../../assets/images/Female1.png')}
                                                alt="logo.png"
                                                style={CommonStylesheet.imageatPatient}
                                            />
                                        ) : (
                                            <Image
                                                source={require('../../assets/images/default.png')}
                                                alt="logo.png"
                                                style={CommonStylesheet.imageatPatient}
                                            />
                                        )}

                                    </View>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>

                                    <View
                                        style={{
                                            flex: 1,
                                            textAlign: 'center',
                                            marginTop: 10,
                                        }}>
                                        <Text style={CommonStylesheet.headertextatPatientDetails}>
                                            {item.pateintFullName}
                                        </Text>
                                        {item.strPateintMedicalAttributes ?
                                            <View style={{ alignItems: 'center', margin: 5 }}>
                                                {/* <Text style={Styles.highlighted}>{dashboard.strPateintMedicalAttributes}</Text> */}

                                                <Text style={Styles.medicalText}>{item.strPateintMedicalAttributes}</Text>

                                            </View> : null
                                        }

                                        <View style={{ width: MaxWidth, justifyContent: 'space-between', }}>
                                            <View style={Styles.cardtext}>
                                                <Text style={{ color: '#000', fontFamily: 'Poppins-Regular' }}>{item.patientCode}</Text>
                                                <Text style={{ fontFamily: 'Poppins-Regular', marginRight: 20 }}>Cost: {item.netTreatmentCost}/-</Text>
                                            </View>
                                            <View style={Styles.cardtext}>
                                                <Text style={{ color: '#000', fontFamily: 'Poppins-Regular' }}>{item.mobileNumber}</Text>
                                                <Text style={{ fontFamily: 'Poppins-Regular' }}>Balance: {item.balance}/-</Text>
                                            </View>
                                        </View>
                                    </View>


                                </View>


                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, alignContent: 'center', width: windowWidth }}>
                                    <View style={[Styles.iconbox, { marginLeft: 5 }]}>
                                        <TouchableOpacity >

                                            <Icon
                                                name="phone-volume"
                                                size={22}
                                                color={'white'}
                                                style={{

                                                    justifyContent: 'center',
                                                    alignSelf: 'center',

                                                }}
                                                onPress={() => callNumber(item.mobileNumber)}
                                            //onPress={() => Alert.alert('Work is in process...')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={Styles.iconbox}>
                                        <TouchableOpacity >
                                            <Icon
                                                name="envelope"
                                                size={22}

                                                color={'white'}
                                                style={{

                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                }}
                                                onPress={() => sendTextMessage(item.mobileNumber, 'Hello! We are from dentee.com (Test Message)')}
                                            //onPress={() => Alert.alert('Work is in process...')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={Styles.iconbox}>
                                        <TouchableOpacity onPress={() => navigation.navigate('AddAppointments', {
                                            patientID: patientID,
                                            patientName: item.pateintFullName
                                        })} >
                                            <Icon
                                                name="calendar"
                                                size={22}

                                                color={'white'}
                                                style={{

                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={Styles.iconbox}>
                                        <TouchableOpacity onPress={() =>
                                            openPrintModal()
                                        }>
                                            <Icon
                                                name="print"
                                                size={22}

                                                color={'white'}
                                                style={{

                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[Styles.iconbox, { marginRight: 5 }]}>
                                        <TouchableOpacity onPress={() => openPortalAccessModal()}>
                                            <Icon
                                                name="ellipsis-v"
                                                size={22}

                                                color={'white'}
                                                style={{

                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>



                            </View>
                        </View>

                        <ScrollView>
                            <View style={{ marginLeft: 10, marginRight: 10, marginTop: 20 }}>

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    // marginTop: 12
                                }}>
                                    <View style={[CommonStylesheet.eventInsideCard1, CommonStylesheet.shadow]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('PatientProfile', {
                                            patientID: patientID,

                                        })}>
                                            <View style={CommonStylesheet.iconView}>

                                                {/* <Image
                                                source={require('../../assets/images/profiledetails.png')} alt="logo.png"
                                                style={CommonStylesheet.imageHomeScreen} /> */}
                                                <Icon style={Styles.iconstylediscover}
                                                    name="address-card"
                                                >
                                                </Icon>
                                                <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Profile</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[CommonStylesheet.eventInsideCard1, CommonStylesheet.shadow]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Examinations', {
                                            patientID: patientID,

                                        })}>
                                            <View style={CommonStylesheet.iconView}>

                                                {/* <Icon
                                        name="hospital-user"
                                        size={40}
                                        color={"#007bc1"}
                                    >

                                    </Icon> */}

                                                {/* <Image
                                                source={require('../../assets/images/dashboard.png')} alt="logo.png"
                                                style={CommonStylesheet.imageHomeScreen} /> */}
                                                <Icon style={Styles.iconstylediscover}
                                                    name="file-alt"
                                                >
                                                </Icon>
                                                <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Examination ({item.examinationCount})</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>


                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        //margin: 10,
                                        marginTop: 12,
                                        justifyContent: 'space-between',
                                    }}>

                                    <View style={[CommonStylesheet.eventInsideCard1, CommonStylesheet.shadow]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Treatment', {
                                            patientID: patientID,
                                        })}>
                                            <View style={CommonStylesheet.iconView}>

                                                {/* <Icon
                                        name="scroll"
                                        size={35}
                                        color={"#007bc1"}
                                    >

                                    </Icon> */}
                                                {/* <Image
                                                source={require('../../assets/images/treatment.png')} alt="logo.png"
                                                style={CommonStylesheet.imageHomeScreen} /> */}
                                                <Icon style={Styles.iconstylediscover}
                                                    name="notes-medical"
                                                >
                                                </Icon>
                                                <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Treatment ({item.treatmentsCount})</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[CommonStylesheet.eventInsideCard1, CommonStylesheet.shadow]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Prescription', {
                                            patientID: patientID,

                                        })}>
                                            <View style={CommonStylesheet.iconView}>

                                                {/* <Icon
                                        name="users"
                                        size={35}
                                        color={"#007bc1"}
                                    >
                                    </Icon> */}
                                                {/* <Image
                                                source={require('../../assets/images/presciption.png')} alt="logo.png"
                                                style={CommonStylesheet.imageHomeScreen} /> */}
                                                <Icon style={Styles.iconstylediscover}
                                                    name="file-prescription"
                                                >
                                                </Icon>
                                                <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Prescription ({item.prescriptionsCount})</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>


                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    //margin: 10,
                                    justifyContent: 'space-between',
                                    marginTop: 12
                                }}>
                                    <View style={[CommonStylesheet.eventInsideCard1, CommonStylesheet.shadow]}>
                                        <TouchableOpacity onPress={() => billingDetails()}>
                                            <View style={CommonStylesheet.iconView}>
                                                {/* <Image
                                                source={require('../../assets/images/mynotes.png')} alt="logo.png"
                                                style={CommonStylesheet.imageHomeScreen} /> */}
                                                <Icon style={Styles.iconstylediscover}
                                                    name="file-invoice-dollar"
                                                >
                                                </Icon>
                                                <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Billings ( {item.billlingAmount} /- )</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[CommonStylesheet.eventInsideCard1, CommonStylesheet.shadow]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Notes', {
                                            //clinicID: clinicID,
                                            patientID: patientID
                                        })}>
                                            <View style={CommonStylesheet.iconView}>
                                                {/* <Image
                                                source={require('../../assets/images/mynotes.png')} alt="logo.png"
                                                style={CommonStylesheet.imageHomeScreen} /> */}
                                                <Icon style={Styles.iconstylediscover}
                                                    name="sticky-note"
                                                >
                                                </Icon>
                                                <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Notes</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    {/* <View style={CommonStylesheet.eventInsideCard}>
                            <TouchableOpacity onPress={() => billingDetails()}>
                                <View style={CommonStylesheet.iconView}>
                                    <Image
                                        source={require('../../assets/images/billing.jpeg')} alt="logo.png"
                                        style={CommonStylesheet.imageHomeScreen} />

                                    <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Billings</Text>

                                </View>
                            </TouchableOpacity>
                        </View> */}
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    //margin: 10,
                                    justifyContent: 'space-between',
                                    marginTop: 12,
                                    marginBottom: 20

                                }}>
                                    <View style={[CommonStylesheet.eventInsideCard1, CommonStylesheet.shadow]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('PatientAppointment', {
                                            patientID: patientID,
                                            //clinicID: clinicID,
                                        })}>
                                            <View style={CommonStylesheet.iconView}>
                                                <Icon style={Styles.iconstylediscover}
                                                    name="calendar-plus"
                                                >
                                                </Icon>
                                                {/* <Image
                                                source={require('../../assets/images/appointment.png')} alt="logo.png"
                                                style={CommonStylesheet.imageHomeScreen} /> */}

                                                <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Appointment ({item.appointmentCount})</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[CommonStylesheet.eventInsideCard1, CommonStylesheet.shadow]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Document', {
                                            // clinicID: clinicID,
                                            patientID: patientID
                                        })}>
                                            <View style={CommonStylesheet.iconView}>

                                                <Icon style={Styles.iconstylediscover}
                                                    name="file-upload"
                                                >
                                                </Icon>
                                                <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Documents</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    {/* <View style={CommonStylesheet.eventInsideCard}>
                            <TouchableOpacity onPress={() => navigation.navigate('Notes', {
                                clinicID: clinicID,
                                patientID: patientID
                            })}>
                                <View style={CommonStylesheet.iconView}>
                                    <Image
                                        source={require('../../assets/images/notes.jpeg')} alt="logo.png"
                                        style={CommonStylesheet.imageHomeScreen} />

                                    <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Notes</Text>

                                </View>
                            </TouchableOpacity>
                        </View> */}


                                </View>

                                {/* <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 12
                    }}>
                        <View style={CommonStylesheet.eventInsideCard}>
                            <TouchableOpacity onPress={() => navigation.navigate('Investigation')}>
                                <View style={CommonStylesheet.iconView}>

                                    <Image
                                        source={require('../../assets/images/investigation.jpeg')} alt="logo.png"
                                        style={CommonStylesheet.imageHomeScreen} />

                                    <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Investigation</Text>

                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={CommonStylesheet.eventInsideCard}>
                            <TouchableOpacity onPress={() => navigation.navigate('ConsentForm')}>
                                <View style={CommonStylesheet.iconView}>

                                    <Image
                                        source={require('.../../assets/images/consentform.jpeg')} alt="logo.png"
                                        style={CommonStylesheet.imageHomeScreen} />

                                    <Text style={CommonStylesheet.cardTextatPatientDetailsScreen}>Consent Form</Text>

                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> */}



                            </View>
                        </ScrollView>
                    </>

                </View>
            }
        </>
    );
}

export default PatientDetails;

const Styles = StyleSheet.create({

    imageContainer: {

        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',

        flex: 1,

    },
    container: {
        height: MaxHeight,
        width: windowWidth
    },

    cardtext: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    highlighted: {
        backgroundColor: 'yellow',
        fontFamily: 'Poppins-Bold',
        fontSize: 12,
    },
    iconbox: {
        width: '19%',
        backgroundColor: '#2196f3',
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',

    },

    medicalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        textAlign: 'center',
        color: 'red',

    },
    iconstylediscover: {
        color: '#2196f3',
        fontSize: 35,
    },
});






