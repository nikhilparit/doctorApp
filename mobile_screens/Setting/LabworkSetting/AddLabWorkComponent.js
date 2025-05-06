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


const AddLabWorkComponent = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const mycategory = route.params.category;
    const myName = route.params.name;
    console.log(myClinicID,mycategory);
    const navigation = useNavigation();
    const [itemTitle, setitemTitle] = useState('');

    const addCategory = async () => {
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
            id: "00000000-0000-0000-0000-000000000000",
            clinicID: clinicID,
            itemID: 0,
            itemTitle: itemTitle,
            itemDescription: itemTitle,
            itemCategory: mycategory,
            lastUpdatedBy: "System",
            lastUpdatedOn: moment().toISOString(),
            rowguid: "00000000-0000-0000-0000-000000000000",
            recordCount: 0,
            medicalTypeID: "00000000-0000-0000-0000-000000000000",
            patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
        }
        console.log("FORM DATA", formData);
        try {
            Axios.post(`${Api}Setting/AddNewItemToMasterCategory`,formData).then(resp=>{
                console.log(resp.data);
                Snackbar.show({
                    text: `Lab Work ${mycategory} added sucessfully.`,
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
                    <Text style={{ color: '#2196f3', fontSize: 16, fontFamily: 'Poppins-Bold', textAlign: 'center' }}>{myName}</Text>
                </View>
            <ScrollView>
                <View style={CommonStyle.container}>
                    <View>
                    </View>


                    <Stack space={2} w="100%" mx="auto" marginTop={2}>
                        <Input size="lg" value={itemTitle} onChangeText={(value) => setitemTitle(value)} placeholderTextColor={'#808080'} style={styles.inputPlaceholder} placeholder="Item Title" />
                       
                    </Stack>
                </View>
                <Box style={{ flexDirection: 'row', justifyContent: 'center',marginTop:20 }}>
                    <View style={{}}>
                        <TouchableOpacity onPress={() => addCategory()}>
                            <View style={CommonStyle.buttonContainersave}>
                                <Text style={CommonStyle.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Box>
            </ScrollView>
        </ImageBackground>
    );
};

export default AddLabWorkComponent;

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