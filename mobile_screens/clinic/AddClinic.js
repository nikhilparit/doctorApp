import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView, StyleSheet, Alert, Dimensions } from 'react-native';
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
    Select, CheckIcon, Center, NativeBaseProvider

} from 'native-base';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
//common styles
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import Loader from '../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width, height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import { fetchClinicData, InsertClinicForExistingUser } from '../../features/clinicSlice';
import Toast from 'react-native-toast-message';
const secondaryCardHeader = Math.min(width, height) * 0.03;
const fontSize = Math.min(width, height) * 0.03; // Adjust the multiplier as per your requirement
//fonts_for_tablet_and_mobile

const regularFontSize = width < 600 ? 15 : 18;
const primaryFontSize = width < 600 ? 17 : 22;

const AddClinic = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { countryList, stateList, timezoneList, isLoading, error } = useSelector((state) => state.clinic);
    //console.log("stateList",stateList);


    const [groupValues, setGroupValues] = useState([]);
    //Loader and button disabled
    // const [isLoading, setLoading] = useState(false);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    //Handle drop down inputs
    const [country, setCountry] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(102);
    const [countryID, setCountryID] = useState(null);
    const [state, setState] = useState([]);
    const [selectedState, setSelectedState] = useState('Maharashtra');
    const [timezone, setTimezone] = useState([]);
    const [selectedTimezone, setselectedTimezone] = useState('77c4731b-c277-4ed3-ac0e-ef0d433d0554');
    const [filePath, setFilePath] = useState([]);
    //name of state and country
    const [stateName, setStateName] = useState('');
    //handle user inputs
    const [doctorName, setDoctorName] = useState('');
    const [mobileNumber, setmobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [clinicName, setclinicName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [selectedtextState, setselectedtextState] = useState('');
    const [token, setToken] = useState('');
    const [userName, setuserName] = useState('');
    const [userData, setUserData] = useState({});

    const handleChange = (value) => {
        // Remove any non-numeric characters from the input
        const numericValue = value.replace(/[^0-9]/g, '');
        setZipcode(numericValue);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {   
                const userString = await AsyncStorage.getItem('user');
                const user = JSON.parse(userString);
                if (user) {
                    setmobileNumber(user.mobileNumber);
                    setEmail(user.email);
                    setDoctorName(user.name);
                    setUserData(user);
                }
    
                const formData = { countryID: 102 };
                const formDataForUserProfile = { userID: user.userID };
    
                await dispatch(fetchClinicData({ formData, formDataForUserProfile })).unwrap().then((result) => {
                    if (result?.updatedUser) {
                        setmobileNumber(result.updatedUser.mobileNumber);
                        setEmail(result.updatedUser.email);
                    }
                });
            } catch (error) {
                console.error("Error fetching user or clinic data:", error);
            }
        };
    
        fetchData(); // Call the async function inside useEffect
    }, [dispatch]); // Add dependencies carefully


    const resetFotm = () => {
        setclinicName('');
        setCity('');
        setZipcode('');
        setAddress1('');
        setAddress2('');
    }

    const getState = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        //console.log('selectedCountry', selectedCountry);
        setselectedtextState('');
        // console.log(selectedCountry,"selectedCountryID");
        const formData = {
            countryID: selectedCountry || 102,
            countryCode: "string",
            countryName: "string",
            lastUpdatedBy: userName,
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

    const addNewclinic = async () => {
        if (clinicName == '') {
            // alert('Required clinic name for adding clinic.');
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required clinic name for adding clinic.',
                text2: 'Please provide a valid name to continue.',
            });
            return
        }
        if (city == '') {
            //alert('Required city for adding clinic.');
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required city for adding clinic.',
                text2: 'Please provide a valid city to continue.',
            });
            return
        }
        if (address1 == '') {
            //alert('Required address line 1 for adding clinic.');
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required address line 1 for adding clinic.',
                text2: 'Please provide a valid address line 1 to continue.',
            });
            return
        }
        if (address1 == address2) {
            //alert('address line 1 & 2  must be diffrent.');
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Address line 1 & 2  must be diffrent.',
                text2: 'Please provide a valid address line 1 & 2 to continue.',
            });
            return
        }
        if (selectedState == '') {
           // alert('Required state for adding clinic.');
           Toast.show({
            type: 'error', // Match the custom toast type
            text1: 'Required state for adding clinic.',
            text2: 'Please provide a valid state to continue.',
        });
            return
        }

        //console.log(selectedState);
        const myStateSelected = stateList.filter((item) => item.stateDesc == selectedState);
        const stateName = myStateSelected[0];
        //console.log(stateName);

        //console.log(selectedCountry);
        // const myCountrySelected = country.filter((item) => item.countryID == selectedCountry);
        // const countryName = myCountrySelected[0].countryName;
        // console.log(countryName);

        //console.log(selectedTimezone);
        // const myselectedTimezone = timezone.filter((item) => item.timeZoneId == selectedTimezone);
        // const timezoneName = myselectedTimezone[0].timeZoneName;
        //console.log(timezoneName);

        const clinicDate = moment().format();
        //console.log('Today Date', clinicDate);
        let formData = {}

        if (selectedCountry == 102) {
            formData = {
                userID: userData.userID,
                clinicName: clinicName,
                name: doctorName,
                email: email,
                phone: mobileNumber,
                contactNumber: mobileNumber,
                clinicTypeID: 0,
                licenseType: null,
                licenseValidTill: moment().add(15, 'days').toISOString(),
                subscriptionPackageID: 0,
                licenseTypeID: 1,
                clinicCode: null,
                address1: address1,
                address2: address2,
                city: city,
                state: (myStateSelected[0].stateID).toString(),
                countryID:parseInt(selectedCountry),
                zipCode: zipcode,
                description: null,
                authenticationKey: null,
                password: null,
                lastUpdatedBy: userName,
                outUserClinicInfoID: "00000000-0000-0000-0000-000000000000",
                outClinicID: "00000000-0000-0000-0000-000000000000",
                country: "India",
                statename: selectedState,
                countryDialCode: "+91",
                baseUtcOffSet: "05:30:00",
                timeZoneId: '77c4731b-c277-4ed3-ac0e-ef0d433d0554',
                timeZoneName: 'India Standard Time',
                fromDiscoverProfilePage: true
            }
        } else {
            formData = {
                userID: userData.userID,
                clinicName: clinicName,
                name: doctorName,
                email: email,
                phone: mobileNumber,
                contactNumber: mobileNumber,
                clinicTypeID: 0,
                licenseType: null,
                licenseValidTill: moment().add(15, 'days').toISOString(),
                subscriptionPackageID: 0,
                licenseTypeID: 1,
                clinicCode: null,
                address1: address1,
                address2: address2,
                city: city,
                state: "0",
                countryID:  parseInt(countryID) || 0,
                zipCode: zipcode,
                description: null,
                authenticationKey: null,
                password: null,
                lastUpdatedBy: userName,
                outUserClinicInfoID: "00000000-0000-0000-0000-000000000000",
                outClinicID: "00000000-0000-0000-0000-000000000000",
                country: parseInt(selectedCountry),
                statename: selectedtextState,
                countryDialCode: "+91",
                baseUtcOffSet: "05:30:00",
                timeZoneId: '77c4731b-c277-4ed3-ac0e-ef0d433d0554',
                timeZoneName: 'India Standard Time',
                fromDiscoverProfilePage: true

            }
        }
        //console.log("Adding Clinic",formData )
        try {
            const resultAction = await dispatch(InsertClinicForExistingUser(formData));

            if (InsertClinicForExistingUser.fulfilled.match(resultAction)) {
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'New clinic added successfully.',
                });
                //console.log("Adding new clinic successful:", resultAction.payload);
                navigation.navigate("ClinicList");
            } else if (InsertClinicForExistingUser.rejected.match(resultAction)) {
                // The action was rejected, meaning there was an error
                //console.log("Error adding new clinic:", resultAction.payload);
            }
        } catch (error) {
            console.error("Unexpected error during adding a new clinic:", error);
            alert("An unexpected error occurred. Please try again.");
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
               // Alert.alert(response.customButton);
            } else {
                let source = response.assets;
               // console.log('SOURCE', source);
                // You can also display the image using data:
                // let source = {
                //   uri: 'data:image/jpeg;base64,' + response.data
                // };
                setFilePath(source);
            }
        });
    };

    return (

        // <ImageBackground source={require('../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {isLoading ? <Loader /> :
                <ScrollView
                // style={{borderColor:'red',borderWidth:2}}
                >
                    <View style={styles.formContainer}>
                        {/* <View style={{ marginTop: 12 }}>
                        <TouchableOpacity>
                            <Image
                                source={require('../assets/images/cliniclogo.jpg')}
                                alt="logo.png"
                                style={CommonStylesheet.imageatAddPatientScreen1} />
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    top: -25,
                                    marginLeft: 60,
                                    zIndex: 1,

                                }}>

                                <Icon
                                    name="camera"
                                    size={30}
                                    color={"#576067"} />


                            </View>

                        </TouchableOpacity>
                    </View> */}


                        <Stack w="100%" mx="auto" space={2}
                        //style={{borderColor:'pink',borderWidth:5}}
                        >

                            <Input
                                value={clinicName}
                                onChangeText={(value => setclinicName(value))}
                                size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={'#888888'}
                                placeholder="Name of Clinic"
                                marginTop={2} />

                            <Input
                                value={doctorName}
                                readOnly
                                onChangeText={(value => setDoctorName(value))}
                                size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"}
                                placeholder="Doctor Name"
                            />
                            <Input
                                value={mobileNumber}
                                onChangeText={(value => setmobileNumber(value))}
                                readOnly
                                placeholder="Mobile Number"
                                size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"} />
                            <Input
                                value={email}
                                onChangeText={(value => setEmail(value))}
                                editable={false}
                                placeholder="Email" size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"} />
                            <Picker
                                placeholder='Select Country'
                                style={{
                                    width: '100%',
                                    height: height * 0.07,
                                    borderColor: "#e0e0e0", //#60dcf7
                                    fontFamily: 'Poppins-Regular',
                                    paddingLeft: 10,
                                    fontSize: 16,
                                    borderRadius: 5,
                                    backgroundColor: "white"
                                }}
                                selectedValue={selectedCountry}
                                onValueChange={(itemValue) => setSelectedCountry(itemValue)}>
                                {countryList.map(item => (

                                    <Picker.Item
                                        // style={CommonStylesheet.Text}
                                        label={item.countryName}
                                        value={item.countryID}
                                        key={item.countryID}
                                    />

                                ))}
                            </Picker>

                            {selectedCountry == 102 ?
                                <Picker
                                    selectedValue={selectedState}
                                    placeholder="Choose State"
                                    style={{
                                        width: '100%',
                                        height: height * 0.07,
                                        borderColor: "#e0e0e0", //#60dcf7
                                        fontFamily: 'Poppins-Regular',
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    mt={1}
                                    //onFocus={getState}
                                    onValueChange={itemValue => setSelectedState(itemValue)}>
                                    {stateList.map(item => (

                                        <Picker.Item
                                            label={item.stateDesc}
                                            value={item.stateDesc}
                                            // style={CommonStylesheet.Text}
                                            key={item.stateID}
                                        />
                                    ))}
                                </Picker> :
                                <Input
                                    placeholder='State'
                                    placeholderTextColor='gray'
                                    style={styles.inputFontStyle}
                                    value={selectedtextState}
                                    onChangeText={(itemValue) => setselectedtextState(itemValue)}
                                />
                            }

                            <Input
                                value={city}
                                onChangeText={(value => setCity(value))}
                                size="lg"
                                placeholder="City"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"}
                            />
                            <Input
                                value={zipcode}
                                // onChangeText={(value => setZipcode(value))}
                                onChangeText={handleChange}
                                maxLength={6}
                                placeholder="Zipcode"
                                size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"}

                            />
                            <Input
                                value={address1}
                                onChangeText={(value => setAddress1(value))}
                                placeholder="Address Line 1"
                                size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"}
                            />
                            <Input
                                value={address2}
                                onChangeText={(value => setAddress2(value))}
                                placeholder="Address Line 2"
                                size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"}
                            />
                            {/* <Select backgroundColor={'gray.100'} borderRadius={10} opacity={'0.5'} fontFamily={'Poppins-Regular'} borderColor={'#A6A6A6'} placeholderTextColor={"#000000"}  selectedValue={selectedTimezone} minWidth="200" accessibilityLabel="Choose Timezone" placeholder="Choose Timezone" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => setselectedTimezone(itemValue)}>
                            {timezone.map(item => (
                                <Select.Item
                                    label={item.timeZoneName}
                                    value={item.timeZoneId}
                                    fontFamily={'Poppins-Regular'} />
                            ))}
                        </Select> */}

                            <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                                <View>
                                    <TouchableOpacity onPress={() => addNewclinic()}>
                                        <View style={CommonStylesheet.buttonContainersaveatForm}>
                                            <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Box>

                        </Stack>
                    </View>
                </ScrollView>
            }
        </View>

    );
};

export default AddClinic;

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        width: '100%',
        padding: 10,
        // borderColor:'black',
        // borderWidth:2
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
    inputFontStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#fff',
        height: height * 0.07,

    },

});