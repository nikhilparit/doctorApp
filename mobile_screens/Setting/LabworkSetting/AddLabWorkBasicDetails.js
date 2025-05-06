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
    Select,
    CheckIcon,
    Checkbox,
    Center,
    NativeBaseProvider

} from 'native-base';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
//common styles
import { CommonStyle } from "../../../commonStyles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import Loader from '../../../Components/Loader';
const { height, width } = Dimensions.get('window');

const AddLabWorkBasicDetails = ({ route }) => {
    const mysupplierID = route.params.SupplierID || null;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [groupValues, setGroupValues] = useState([]);
    //Loader and button disabled
    const [isLoading, setLoading] = useState(false);
    //Handle-User Inputs
    const [labName, setLabName] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [mobNumber, setMobNumber] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [isActiveStatus, setIsActive] = useState(false);

    const readData = async () => {
        const myclinicID = await AsyncStorage.getItem('clinicID');
        const formData = {
            labSupplierID: mysupplierID,
            clinicID: myclinicID
        }
        //console.log("FORM DATA", formData);
        if (mysupplierID) {
            try {
                Axios.post(`${Api}Setting/GetClinicLabSupplierDetailsByID`, formData).then(resp => {
                    //console.log("Supplier Details By ID", resp.data);
                    const {
                        supplierName,
                        registrationNo,
                        contactPerson,
                        phone,
                        emailAddress1,
                        notes,
                        isActive,
                    } = resp.data;
                    setLabName(supplierName);
                    setRegNumber(registrationNo);
                    setContactPerson(contactPerson);
                    setMobNumber(phone);
                    setEmail(emailAddress1);
                    setNotes(notes);
                    setIsActive(isActive);
                })
            } catch (error) {
                //console.log(error.message);
            }
        }
    }
    useEffect(() => {
        readData();
    }, [isFocused]);

    const resetForm = () => {
        setLabName('');
        setRegNumber('');
        setMobNumber('');
        setEmail('');
        setNotes('');
    }

    const addBasicDetails = async () => {
        if (labName == '') {
            Snackbar.show({
                text: 'Required  Lab Name.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }

        if (regNumber == '') {
            Snackbar.show({
                text: 'Required Registration No.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        if (contactPerson == '') {
            Snackbar.show({
                text: 'Required Contact Person Name.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        if (mobNumber == '') {
            Snackbar.show({
                text: 'Required Mobile No.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        if (email == '') {
            Snackbar.show({
                text: 'Required Email.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        const myClinicID = await AsyncStorage.getItem('clinicID');
        const myMobileNumber = await AsyncStorage.getItem('mobileNumber');
        const formData = {
            labSupplierID: "00000000-0000-0000-0000-000000000000",
            clinicID: myClinicID,
            supplierName: labName,
            registrationNo: regNumber,
            contactPerson: contactPerson,
            phone: mobNumber,
            emailAddress1: email,
            notes: notes,
            isEmailLabOrderActive: false,
            isActive: isActiveStatus,
            isDeleted: false,
            createdOn: moment().toISOString(),
            createdBy: (myMobileNumber).toString(),
            lastUpdatedOn: moment().toISOString(),
            lastUpdatedBy: (myMobileNumber).toString(),
            rowguid: "00000000-0000-0000-0000-000000000000",
            flag: true,
            labSupplierIDCSV: null,
            recordCount: 0,
            key: "Add"
        }
        console.log('ADD WORK DETAILS', formData);
        try {
            Axios.post(`${Api}Setting/InsertUpdateLabSuppliers`, formData).then(resp => {
                //console.log(resp.data);
                if (resp.data == true) {
                    Snackbar.show({
                        text: 'Lab basic details saved.',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'green',
                        fontFamily: 'Poppins-Medium',
                    });
                    navigation.navigate('ManageLab', {
                        clinicID: myClinicID
                    });
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

    const editBasicDetails = async () => {
        const myClinicID = await AsyncStorage.getItem('clinicID');
        const myMobileNumber = await AsyncStorage.getItem('mobileNumber');
        const formData = {
            labSupplierID: mysupplierID,
            clinicID: myClinicID,
            supplierName: labName,
            registrationNo: regNumber,
            contactPerson: contactPerson,
            phone: mobNumber,
            emailAddress1: email,
            notes: notes,
            isEmailLabOrderActive: false,
            isActive: isActiveStatus,
            isDeleted: false,
            createdOn: moment().toISOString(),
            createdBy: (myMobileNumber).toString(),
            lastUpdatedOn: moment().toISOString(),
            lastUpdatedBy: (myMobileNumber).toString(),
            rowguid: "00000000-0000-0000-0000-000000000000",
            flag: true,
            labSupplierIDCSV: null,
            recordCount: 0,
            key: "Update"
        }
        //console.log('ADD WORK DETAILS', formData);
        try {
            Axios.post(`${Api}Setting/InsertUpdateLabSuppliers`, formData).then(resp => {
                //console.log(resp.data);
                if (resp.data == true) {
                    Snackbar.show({
                        text: 'Lab basic details updated.',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'green',
                        fontFamily: 'Poppins-Medium',
                    });
                    navigation.navigate('ManageLab', {
                        clinicID: myClinicID
                    });
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

    const handleNextButton = () => {
        if (labName == '') {
            Snackbar.show({
                text: 'Required  Lab Name.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }

        if (regNumber == '') {
            Snackbar.show({
                text: 'Required Registration No.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        if (contactPerson == '') {
            Snackbar.show({
                text: 'Required Contact Person Name.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        if (mobNumber == '') {
            Snackbar.show({
                text: 'Required Mobile No.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        if (email == '') {
            Snackbar.show({
                text: 'Required Email.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        navigation.navigate('AddLabWorkAddressDetails', {
            SupplierID: mysupplierID,
            supplierName: labName,
            registrationNo: regNumber,
            phone: mobNumber,
            contactPerson: contactPerson,
            emailAddress1: email,
            notes: notes,
            isActive: isActiveStatus
        })
    }
    // Function to toggle the checkbox value
    const handleToggle = () => {
        setIsActive(!isActiveStatus);
    };
    return (
        <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStyle.backgroundimage}>
            {isLoading ? <Loader /> :
                <ScrollView>
                    <View style={CommonStyle.container}>

                        <Input
                            value={labName}
                            onChangeText={(value => setLabName(value))}
                            placeholder="Lab Name"
                            size="lg"
                            style={styles.inputFontStyle}
                            borderRadius={10}
                            borderColor={'#a6a6a6'}
                            bgColor={'#FFFFFF'}
                            opacity={'0.7'}
                            width={width - 20}
                            marginTop={3}
                            placeholderTextColor={"#666666"} />
                        <Input
                            value={regNumber}
                            onChangeText={(value => setRegNumber(value))}
                            placeholder="Registration Number"
                            size="lg"
                            style={styles.inputFontStyle}
                            borderRadius={10}
                            borderColor={'#a6a6a6'}
                            bgColor={'#FFFFFF'}
                            opacity={'0.7'}
                            width={width - 20}
                            marginTop={3}
                            placeholderTextColor={"#666666"} />
                        <Input
                            value={contactPerson}
                            onChangeText={(value => setContactPerson(value))}
                            placeholder="Contact Person"
                            size="lg"
                            style={styles.inputFontStyle}
                            borderRadius={10}
                            borderColor={'#a6a6a6'}
                            bgColor={'#FFFFFF'}
                            opacity={'0.7'}
                            width={width - 20}
                            marginTop={3}
                            placeholderTextColor={"#666666"} />

                        <Input
                            value={mobNumber}
                            onChangeText={(value => setMobNumber(value))}
                            placeholder="Mobile Number"
                            size="lg"
                            style={styles.inputFontStyle}
                            borderRadius={10}
                            borderColor={'#a6a6a6'}
                            bgColor={'#FFFFFF'}
                            opacity={'0.7'}
                            width={width - 20}
                            marginTop={3}
                            placeholderTextColor={"#666666"} />
                        <Input
                            value={email}
                            onChangeText={(value =>
                                setEmail(value))}
                            placeholder="Email Address"
                            size="lg" s
                            tyle={styles.inputFontStyle}
                            borderRadius={10}
                            borderColor={'#a6a6a6'}
                            bgColor={'#FFFFFF'}
                            opacity={'0.7'}
                            width={width - 20}
                            marginTop={3}
                            placeholderTextColor={"#666666"} />
                        <Input
                            value={notes}
                            onChangeText={(value => setNotes(value))}
                            placeholder="Notes"
                            size="lg"
                            style={styles.inputFontStyle}
                            borderRadius={10}
                            borderColor={'#a6a6a6'}
                            bgColor={'#FFFFFF'}
                            opacity={'0.7'}
                            width={width - 20}
                            marginTop={3}
                            placeholderTextColor={"#666666"} />

                    </View>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 12, marginTop: 10 }}>
                        <Checkbox value={isActiveStatus} my={2} onChange={handleToggle} isChecked={isActiveStatus == true ? true : false}>
                            <Text style={CommonStyle.Text}>Is Active</Text>
                        </Checkbox>
                    </View>
                    <Box style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                        {mysupplierID ? <View style={{ marginLeft: 50 }}>
                            <TouchableOpacity onPress={() => editBasicDetails()}>
                                <View style={CommonStyle.buttonContainersave}>
                                    <Text style={CommonStyle.ButtonText}>Update</Text>
                                </View>
                            </TouchableOpacity>
                        </View> : <View style={{ marginLeft: 50 }}>
                            <TouchableOpacity onPress={() => addBasicDetails()}>
                                <View style={CommonStyle.buttonContainersave}>
                                    <Text style={CommonStyle.ButtonText}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        </View>}

                        <View style={{ marginRight: 50 }}>
                            <TouchableOpacity onPress={() => handleNextButton()}>
                                <View style={CommonStyle.buttonContainersave}>
                                    <Text style={CommonStyle.ButtonText}>Next</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Box>
                </ScrollView>
            }
        </ImageBackground>
    );
};

export default AddLabWorkBasicDetails;

const styles = StyleSheet.create({
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
        color: '#000000',

    },
});