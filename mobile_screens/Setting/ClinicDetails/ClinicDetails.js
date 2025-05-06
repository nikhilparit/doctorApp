import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
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
    Modal
} from 'native-base';
//common styles
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');
// import Snackbar from 'react-native-snackbar';
import Axios from 'axios';
import Api from '../../../api/Api';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeaders } from '../../../utils/apiHeaders';
import Loader from '../../../components/Loader';

const ClinicDetails = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    // const myClinicID = route.params.clinicID;
    const [groupValues, setGroupValues] = React.useState([]);
    const [clinicInfo, setClinicInfo] = React.useState({});
    const [country, setCountry] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(102);
    const [state, setState] = useState([]);
    const [selectedState, setSelectedState] = useState('Maharashtra');
    const [selectedtextState, setselectedtextState] = useState("");
    const [service, setService] = React.useState("");
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const [modalAction, setmodalAction] = useState(false);
    //handle User-Inputs
    const [clinicName, setClinicName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dialCode, setDialCode] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [code, setCode] = useState("");
    const [licenseValidTill, setlicenseValidTill] = useState("");
    const [myClinicID, setmyClinicID] = useState('');
    const [loading, setLoading] = useState(false);



    const readData = async () => {
        setLoading(true);
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyClinicID(user.clinicID);
        const formData =
        {
            applicationDTO: {
                clinicID: user.clinicID
            }
        }
        try {
            Axios.post(`${Api}Clinic/GetClinicByCliniID`, formData, { headers }).then(resp => {
                console.log('Get Clinic By ID', resp.data);
                setClinicInfo(resp.data);
                const {
                    name,
                    email,
                    countryDialCode,
                    phone,
                    address1,
                    address2,
                    city,
                    clinicCode,
                    countryID,
                    licenseValidTill,
                    statename
                } = resp.data;
                setClinicName(name);
                setEmail(email);
                setDialCode(countryDialCode);
                setPhone(phone);
                setAddress1(address1);
                setAddress2(address2);
                setCode(clinicCode);
                setCity(city);
                setSelectedCountry(countryID);
                setlicenseValidTill(licenseValidTill);
                setSelectedState(statename);
            });
        } catch (error) {
            //console.log(error);
        }
        try {
            await Axios.post(`${Api}Clinic/GetCountrylist`, {}, { headers }).then(resp => {
                const countryData = resp.data
                //console.log('Get Country list', countryData);
                setCountry(countryData);
            });
        } catch (error) {
            //console.log(error);
        }
        const formData1 = {
            countryID: parseInt(selectedCountry),
        }
        //console.log("form Data", formData);
        try {
            await Axios.post(`${Api}Clinic/GetStateByCountryID`, formData1, { headers }).then(resp => {
                const stateData = resp.data
                //console.log('Get State By CountryID', stateData);
                setState(stateData);
            });
        }
        catch (error) {
            //console.log(error);
        }
        setLoading(false);

    };
    useEffect(() => {
        readData();
    }, []);
    const getState = async () => {
        const headers = await getHeaders();
        console.log('selectedCountry', selectedCountry);
        setselectedtextState('');
        console.log(selectedCountry, "selectedCountryID");
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
                console.log('Get State By CountryID', stateData);
                setState(stateData);
            });
        }
        catch (error) {
            //console.log(error);
        }
    }
    const editClinic = async () => {
        const headers = await getHeaders();
        //console.log("SELECTED STATE",selectedState);
        if (selectedState == undefined || selectedState == '') {
            // Snackbar.show({
            //     text: 'Please select state.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            alert('Please select state.');
            return;
        }
        const formData = {
            clinicID: myClinicID,
            name: clinicName,
            address1: address1,
            address2: address2,
            city: city,
            state: selectedState,
            zipCode: "",
            countryID: selectedCountry,
            countryName: "",
            phone: phone,
            fax: null,
            email: email,
            description: `${clinicName} is reputed clinic in the ${city}`,
            authenticationKey: null,
            clinicCode: code,
            createdOn: moment().toISOString(),
            isActive: true,
            countryDialCode: dialCode,
            licenseValidTill: licenseValidTill
        }
        console.log("Edit Clinc Data", formData);
        try {
            Axios.post(`${Api}Clinic/UpdateClinic`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                // Snackbar.show({
                //     text: 'Clinic edited successfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                // });
                alert('Clinic edited successfully.');
                navigation.navigate('Settings');
            })
        } catch (error) {
            //console.log(error.message);
        }
    }
    const openMissedConfirmation = () => {
        setmodalAction(false);
        setconfirmationWindow(true);
    }
    const updateAccessCode = async () => {
        const headers = await getHeaders();
        const formData = {
            clinicID: myClinicID,
            lastUpdatedBy: "SYSTEM"
        }
        //console.log("Form DATA", formData);

        try {
            Axios.post(`${Api}Setting/UpdateAccessCode`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                setCode(resp.data);
                setconfirmationWindow(false);
            })
        } catch (error) {
            //console.log(error.message);
        }
    }

    return (

        // <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {loading ? <Loader /> :
                <>
                    <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Access Code</Text></Modal.Header>
                            <Modal.Body padding={5}>
                                <Text style={CommonStylesheet.Text}>Are you sure want to generate new access code ?</Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <TouchableOpacity onPress={() => {
                                    setconfirmationWindow(false);
                                }}>
                                    <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                        <Text style={CommonStylesheet.ButtonText}>No</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    updateAccessCode();
                                }}>
                                    <View style={CommonStylesheet.buttonContainersave1}>
                                        <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>

                    <ScrollView>
                        <View style={Styles.container}>
                            <View style={{ marginTop: 8 }}>
                                {/* <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
                            <Image
                                source={require('../assets/images/person.png')}
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
                                    color={"#576067"}

                                />


                            </View>
                        </TouchableOpacity> */}
                            </View>


                            <Stack space={2} w="100%" mx="auto" >

                                <Input
                                    value={clinicName}
                                    onChangeText={(value => setClinicName(value))}
                                    size="lg"
                                    style={Styles.inputPlaceholder}
                                    borderRadius={5}
                                    height={height * 0.07}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Name of Clinic"
                                />

                                <Input
                                    value={email == null ? '' : email}
                                    onChangeText={(value => setEmail(value))}
                                    editable={false}
                                    size="lg"
                                    style={Styles.inputPlaceholder}
                                    borderRadius={5}
                                    height={height * 0.07}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Email"
                                    keyboardType={'numeric'}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Input
                                        value={dialCode}
                                        onChangeText={(value => setDialCode(value))}
                                        width={'15%'}
                                        style={Styles.inputPlaceholder}
                                        borderRadius={5}
                                        height={height * 0.07}
                                        placeholderTextColor={'#808080'}
                                    />
                                    <Input
                                        value={phone == null ? '' : phone}
                                        onChangeText={(value => setPhone(value))}
                                        editable={false}
                                        width={'80%'}
                                        style={Styles.inputPlaceholder}
                                        borderRadius={5}
                                        height={height * 0.07}
                                        placeholderTextColor={'#808080'}
                                        placeholder="Mobile Number"
                                        maxLength={10}
                                    />
                                </View>
                                <Input
                                    value={address1}
                                    onChangeText={(value => setAddress1(value))}
                                    size="lg" style={Styles.inputPlaceholder}
                                    borderRadius={5}
                                    height={height * 0.07}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Address 1"
                                />
                                <Input
                                    value={address2}
                                    onChangeText={(value => setAddress2(value))}
                                    size="lg"
                                    style={Styles.inputPlaceholder}
                                    borderRadius={5}
                                    height={height * 0.07}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Address 2"
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
                                        style={Styles.inputFontStyle}
                                        onChangeText={(itemValue) => setselectedtextState(itemValue)}
                                    />
                                }

                                <Input
                                    value={city}
                                    onChangeText={(value => setCity(value))}
                                    size="lg"
                                    style={Styles.inputPlaceholder}
                                    borderRadius={5}
                                    height={height * 0.07}
                                    placeholderTextColor={'#000'}
                                    placeholder="City"
                                />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Input
                                        value={code}
                                        onChangeText={(value => setCode(value))}
                                        width={'45%'}
                                        height={height * 0.07}
                                        style={Styles.inputPlaceholder}
                                        borderRadius={5}
                                        placeholderTextColor={'#000'}
                                        placeholder="Code"
                                    />
                                    <Button
                                        onPress={() => openMissedConfirmation()}
                                        style={{ width: '45%', height: height * 0.07, justifyContent: 'center', alignItems: 'center', backgroundColor: '#da251d' }}
                                    >
                                        <Text style={Styles.btnTextForUpdateAccessCode}>Update Access Code</Text>
                                    </Button>
                                </View>
                                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => editClinic()}>
                                            <View style={CommonStylesheet.buttonContainersave}>
                                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Box>
                            </Stack>
                        </View>
                    </ScrollView>
                </>
            }
        </View>
    );
};

export default ClinicDetails;
const Styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        padding: 15
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#A6A6A6',
        backgroundColor: 'white',
        //opacity: 0.5,
        // borderRadius:10
    },
    btnTextForUpdateAccessCode: {
        marginTop: -5,
        color: '#fff',
        alignSelf: 'center',
        fontFamily: 'Poppins-Regular',
    }


})