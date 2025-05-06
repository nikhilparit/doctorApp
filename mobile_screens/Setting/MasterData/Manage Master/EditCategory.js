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
import CommonStylesheet from '../../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../../api/Api';
//import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeaders } from '../../../../utils/apiHeaders';
import Toast from 'react-native-toast-message';


const EditCategory = ({ route }) => {
    const mycategory = route.params.category;
    const myName = route.params.name;
    const mymedicalTypeID = route.params.medicalTypeID
    console.log(myClinicID, mycategory, myName, mymedicalTypeID);
    const navigation = useNavigation();
    const [itemTitle, setitemTitle] = useState('');
    const [itemID, setitemID] = useState('');
    const [rowID, serowID] = useState('');
    const [myClinicID, setmyClinicID] = useState('');
    const [confirmationWindow, setconfirmationWindow] = useState(false);

    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyClinicID(user.clinicID);
        const formData =
        {
            medicalTypeID: mymedicalTypeID
        }
        try {
            Axios.post(`${Api}Setting/GetMedicalType`, formData, { headers }).then(resp => {
                console.log(resp.data);
                const {
                    itemDescription,
                    itemID,
                    rowguid
                } = resp.data[0];
                setitemTitle(itemDescription);
                setitemID(itemID);
                serowID(rowguid);
            });
        } catch (error) {
            console.log(error.message);
        }

    }
    useEffect(() => {
        readData()
    }, []);

    const editCategory = async () => {
        const headers = await getHeaders();
        if (itemTitle == '' || itemTitle == undefined) {
            // Snackbar.show({
            //     text: 'Required item title type.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required item title type.',
                text2: 'Please add item title to continue',
            });
            //alert('Required item title type.');
            return
        }
        const formData = {
            id: mymedicalTypeID,
            clinicID: myClinicID,
            itemID: itemID,
            itemTitle: itemTitle,
            itemDescription: itemTitle,
            itemCategory: mycategory,
            lastUpdatedBy: "System",
            lastUpdatedOn: moment().toISOString(),
            rowguid: rowID,
            recordCount: 0,
            medicalTypeID: "00000000-0000-0000-0000-000000000000",
            patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
        }
        console.log("FORM DATA", formData);
        try {
            Axios.post(`${Api}Setting/AddNewItemToMasterCategory`, formData, { headers }).then(resp => {
                console.log(resp.data);
                // Snackbar.show({
                //     text: 'Master Category edited sucessfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                //     fontSize: 10
                // });
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Master Category edited sucessfully.',
                });
               // alert('Master Category edited sucessfully.');
                navigation.navigate('CategoryList', {
                    clinicID: myClinicID,
                    paramKey1: mycategory,
                    paramKey2: myName
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }
    const deleteCategory = async () => {
        const headers = await getHeaders();
        if (itemTitle == '' || itemTitle == undefined) {
            // Snackbar.show({
            //     text: 'Required item title type.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required item title type.',
                text2: 'Please add item title to continue',
            });
            return
        }
        const formData = {
            id: mymedicalTypeID,
            clinicID: myClinicID,
            itemID: itemID,
            itemTitle: itemTitle,
            itemDescription: itemTitle,
            itemCategory: mycategory,
            lastUpdatedBy: "System",
            lastUpdatedOn: moment().toISOString(),
            rowguid: rowID,
            recordCount: 0,
            medicalTypeID: "00000000-0000-0000-0000-000000000000",
            patientAttributeDataID: "00000000-0000-0000-0000-000000000000",
            isDeleted: true
        }
        console.log("FORM DATA", formData);
        try {
            Axios.post(`${Api}Setting/AddNewItemToMasterCategory`, formData, { headers }).then(resp => {
                console.log(resp.data);
                // Snackbar.show({
                //     text: 'Master Category deleted sucessfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                //     fontSize: 10
                // });
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Master Category deleted sucessfully.',
                });
                setconfirmationWindow(false);
                //alert('Master Category deleted sucessfully.');
                navigation.navigate('CategoryList', {
                    clinicID: myClinicID,
                    paramKey1: mycategory,
                    paramKey2: myName
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
             <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to delete this record ?</Text>
                    </Modal.Body>
                    <Modal.Footer>



                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() =>  setconfirmationWindow(false)}>
                                <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                    <Text style={CommonStylesheet.ButtonText}>No</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() =>deleteCategory()}>
                                <View style={CommonStylesheet.buttonContainersave1}>
                                    <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Text style={{ color: '#2196f3', fontSize: 18, fontFamily: 'Poppins-Bold', textAlign: 'center' }}> Edit {myName}</Text>
            </View>
            <ScrollView>
                <View style={CommonStylesheet.container}>
                    <View>
                    </View>
                    <Stack space={2} w="100%" mx="auto" padding={3}>
                        <Input size="lg"
                            value={itemTitle}
                            onChangeText={(value) => setitemTitle(value)}
                            height={height * 0.07}
                            borderRadius={5}
                            placeholderTextColor={'#808080'}
                            style={styles.inputPlaceholder}
                            placeholder="Item Title" />

                    </Stack>
                </View>
                <Box style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                    <View >
                        <TouchableOpacity onPress={() => editCategory()}>
                            <View style={CommonStylesheet.buttonContainersave}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View >
                        <TouchableOpacity onPress={() => setconfirmationWindow(true)}>
                            <View style={CommonStylesheet.buttonContainerdelete}>
                                <Text style={CommonStylesheet.ButtonText}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Box>


            </ScrollView>
        </View>
    );
};

export default EditCategory;

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

    inputPlaceholder: {
        fontSize: 14,
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

});