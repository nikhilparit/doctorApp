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
import { CommonStyle } from "../../../commonStyles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../api/Api';
import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EditLabWorkComponent = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const mycategory = route.params.category;
    const myName = route.params.name;
    const mymedicalTypeID = route.params.Id
    console.log(myClinicID, mycategory, myName, mymedicalTypeID);
    const navigation = useNavigation();
    const [itemTitle, setitemTitle] = useState('');
    const [itemID, setitemID] = useState('');
    const [rowID, serowID] = useState('');

    const readData = () => {
        const formData =
        {
            medicalTypeID: mymedicalTypeID
        }
        try {
            Axios.post(`${Api}Setting/GetMedicalType`, formData).then(resp => {
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
        if (itemTitle == '' || itemTitle == undefined) {
            Snackbar.show({
                text: 'Required item title type.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        const clinicID = await AsyncStorage.getItem('clinicID');
        const formData = {
            id: mymedicalTypeID,
            clinicID: clinicID,
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
            Axios.post(`${Api}Setting/AddNewItemToMasterCategory`, formData).then(resp => {
                console.log(resp.data);
                Snackbar.show({
                    text: `Lab Work ${mycategory} edited sucessfully.`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 10
                });
                navigation.navigate('LabWorkComponentList',{
                    clinicID:clinicID,
                    category:mycategory,
                    name:myName
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }
    const deleteCategory = async () => {
        if (itemTitle == '' || itemTitle == undefined) {
            Snackbar.show({
                text: 'Required item title type.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
            });
            return
        }
        const clinicID = await AsyncStorage.getItem('clinicID');
        const formData = {
            id: mymedicalTypeID,
            clinicID: clinicID,
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
            Axios.post(`${Api}Setting/AddNewItemToMasterCategory`, formData).then(resp => {
                console.log(resp.data);
                Snackbar.show({
                    text: `Lab Work ${mycategory} deleted sucessfully.`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 10
                });
                navigation.navigate('LabWorkComponentList',{
                    clinicID:clinicID,
                    category:mycategory,
                    name:myName
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStyle.backgroundimage}>
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffff', marginTop: 20 }}>
                <Text style={{ color: '#2196f3', fontSize: 16, fontFamily: 'Poppins-Bold', textAlign: 'center' }}> Edit {myName}</Text>
            </View>
            <ScrollView>
                <View style={CommonStyle.container}>
                    <View>
                    </View>


                    <Stack space={2} w="96%" maxW="500px" mx="auto" marginTop={2}>
                        <Input size="lg" value={itemTitle} onChangeText={(value) => setitemTitle(value)} placeholderTextColor={'#808080'} style={styles.inputPlaceholder} placeholder="Item Title" />

                    </Stack>
                </View>
                <Box style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:20 }}>
                    <View style={{marginLeft:30}}>
                        <TouchableOpacity onPress={() => editCategory()}>
                            <View style={CommonStyle.buttonContainersave}>
                                <Text style={CommonStyle.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginRight:30}}>
                        <TouchableOpacity onPress={()=>deleteCategory()}>
                            <View style={CommonStyle.buttonContainerdelete}>
                                <Text style={CommonStyle.ButtonText}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Box>


            </ScrollView>
        </ImageBackground>
    );
};

export default EditLabWorkComponent;

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