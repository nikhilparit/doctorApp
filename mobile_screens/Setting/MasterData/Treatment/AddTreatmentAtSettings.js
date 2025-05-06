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
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../../api/Api';
//import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeaders } from '../../../../utils/apiHeaders';
import Toast from 'react-native-toast-message';


const AddTreatmentAtSettings = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [treatmentType, settreatmentType] = useState('');
    const [treatmentCost, settreatmentCost] = useState('');
    const [clinicID, setClinicID] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            setClinicID(user.clinicID);
        };

        if (isFocused) {
            fetchToken();
        }
    }, [isFocused]);

    const addTretment = async () => {
        const headers = await getHeaders();
        if (treatmentType == '' || treatmentType == undefined) {
            // Snackbar.show({
            //     text: 'Required treatment type.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required treatment type.',
                text2: 'Please add treatment type to continue',
            });
            // alert('Required treatment type.');
            return
        }
        if (treatmentCost == 0 || treatmentCost == undefined || treatmentCost == '') {
            // Snackbar.show({
            //     text: 'Required treatment cost.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Required treatment cost',
                text2: 'Please add treatment cost in number to continue',
            });
            //alert('Required treatment cost.')
            return
        }
        const formData = {
            typeID: "00000000-0000-0000-0000-000000000000",
            clinicID: clinicID,
            treatmentTypeID: "00000000-0000-0000-0000-000000000000",
            title: treatmentType,
            description: treatmentType,
            generalTreatmentCost: parseInt(treatmentCost),
            specialistTreatmentCost: 0,
            createdBy: "SYSTEM",
            lastUpdatedBy: "SYSTEM",
            treatmentSpecialityType: 0,
            rowguid: "00000000-0000-0000-0000-000000000000"

        }
        console.log("FORM DATA", formData);
        try {
            Axios.post(`${Api}Setting/AddTreatmentType`, formData, { headers }).then(resp => {
                console.log(resp.data);
                // Snackbar.show({
                //     text: 'New treatment added sucessfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                //     fontSize: 10
                // });
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'New treatment added sucessfully.',
                });
                //alert(`New treatment added sucessfully.`)
                navigation.navigate('TreatmentList', {
                    clinicID: clinicID
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            <ScrollView>
                <View style={CommonStylesheet.container}>
                    <View>
                    </View>


                    <Stack space={2} w="100%" mx="auto" marginTop={2} paddingRight={1}>
                        <Input
                            size="lg"
                            value={treatmentType}
                            onChangeText={(value) => settreatmentType(value)}
                            placeholderTextColor={'#808080'}
                            height={height * 0.07}
                            borderRadius={5}
                            style={styles.inputPlaceholder}
                            placeholder=" Treatment Type"
                        />
                        <Input size="lg"
                            value={treatmentCost}
                            onChangeText={(value) => {
                                // Allow only numeric input
                                const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                settreatmentCost(numericValue);
                            }}
                            placeholderTextColor={'#808080'}
                            keyboardType='numeric'
                            height={height * 0.07}
                            borderRadius={5}
                            style={styles.inputPlaceholder}
                            placeholder="Treatment Cost"
                        />
                    </Stack>
                </View>
                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <View style={{}}>
                        <TouchableOpacity onPress={() => addTretment()}>
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

export default AddTreatmentAtSettings;

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