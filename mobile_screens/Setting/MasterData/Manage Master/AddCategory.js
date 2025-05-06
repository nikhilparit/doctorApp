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


const AddCategory = ({ route }) => {
    const mycategory = route.params.category;
    const myName = route.params.name;
    console.log(myClinicID, mycategory, myName);
    const navigation = useNavigation();
    const [itemTitle, setitemTitle] = useState('');
    const [myClinicID, setmyClinicID] = useState('');

    const addCategory = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyClinicID(user.clinicID);
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
            id: "00000000-0000-0000-0000-000000000000",
            clinicID: user.clinicID,
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
            Axios.post(`${Api}Setting/AddNewItemToMasterCategory`, formData, { headers }).then(resp => {
                console.log(resp.data);
                // Snackbar.show({
                //     text: 'New Master Category added sucessfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                //     fontSize: 10
                // });
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'New Master Category added sucessfully.',
                });
                //alert('New Master Category added sucessfully.');
                navigation.navigate('CategoryList', {
                    clinicID: user.clinicID,
                    paramKey1: mycategory,
                    paramKey2: myName
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: '#2196f3', fontSize: 18, fontFamily: 'Poppins-Bold', textAlign: 'center' }}> Add New {myName}</Text>
            </View>
            <ScrollView>
                <View style={CommonStylesheet.container}>
                    <Stack space={2} w="100%" mx="auto" padding={3}>
                        <View >
                            <Input
                                size="lg"
                                value={itemTitle}
                                onChangeText={(value) => setitemTitle(value)}
                                placeholderTextColor={'#808080'}
                                height={height * 0.07}
                                borderRadius={5}
                                style={styles.inputPlaceholder}
                                placeholder="Item Title" />


                        </View>
                    </Stack>
                </View>
                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <View style={{}}>
                        <TouchableOpacity onPress={() => addCategory()}>
                            <View style={CommonStylesheet.buttonContainersave}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Box>
            </ScrollView>
        </View>
    );
};

export default AddCategory;

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
        fontSize: 16,
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