import React, { useState, useEffect } from 'react';

import { View, Text, TouchableOpacity, ImageBackground, Platform, StyleSheet, Alert, Dimensions } from 'react-native';
import {
    Stack,
    Input,
    Button,
    Image,
    Link,
    HStack,
    Box,
    AspectRatio,
    Center,
    Heading,
    ScreenLeft,
    ScrollView,
} from 'native-base';
import { useNavigation, useIsFocused, DrawerActions, } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
//common-Stylesheet
import CommonStylesheet from '../common_stylesheet/CommonStylesheet';
// import Dashboard from './Dashboard/Dashboard';
// import Patients from './Patient/Patients';
// import Appointment from './appointment/Appointment';
// import Settings from './Setting/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Api from '../api/Api';

const { height, width } = Dimensions.get('window');

const fontSizeForHeader = width < 650 ? 18 : 22; // Adjust the multiplier as per your requirement

const HomeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [clinicID, setClinicID] = useState('');
    const isFocused = useIsFocused();
    const [ClinicFinalName, setClinicFinalName] = useState('');
    const readData = async () => {
        const userID = await AsyncStorage.getItem('userID');
        const myClinicID = await AsyncStorage.getItem('clinicID');
        setClinicID(myClinicID);
        const myclinicName = await AsyncStorage.getItem('clinicName');
        setClinicFinalName(myclinicName);
        const formData = {
            userID: userID
        }
        // console.log('Data To Pass', formData);
        try {
            await Axios.post(`${Api}Authenticate/GetClinicsByUserID`, formData).then(resp => {
                //console.log('Get Clinics By UserID`', resp.data);
                const data = resp.data;
                // const clinicName =  data.filter(item=>item.clinicID == clinicID);
                // const finalName = clinicName[0].clinicName
                // console.log("clinic Name",finalName);
                // setClinicFinalName(finalName);
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        readData();
    }, [isFocused]);

    return (

        //Reposive Code
        <View style={CommonStylesheet.containerHomeScreen}>

            <View style={{ padding: 15, }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                }}>
                    <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#07AAA5', }]}>
                        <TouchableOpacity >
                            <View style={CommonStylesheet.iconView}>
                                <View style={{ marginHorizontal: 20 }}>
                                    <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#07AAA5' }]}
                                        name="database"
                                    >
                                    </Icon>
                                </View>
                                <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#07AAA5' }]}>Dental-Mammoth</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#bfa106' }]}>
                        <TouchableOpacity >
                            <View style={CommonStylesheet.iconView}>
                                <View style={{ marginHorizontal: 20 }}>
                                    <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#bfa106' }]}
                                        name="shield-alt"
                                    >
                                    </Icon>
                                </View>
                                <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#bfa106' }]}>Indemnity Insurance</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginTop: 15
                    }}>
                    <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#bd1011' }]}>
                        <TouchableOpacity >
                            <View style={CommonStylesheet.iconView}>
                                <View style={{ marginHorizontal: 20 }}>
                                    <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#bd1011' }]}
                                        name="robot"
                                    >
                                    </Icon>
                                </View>
                                <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#bd1011' }]}>Chat-Bot</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#0a6522' }]}>
                        <TouchableOpacity onPress={()=>navigation.navigate('QRCode')}>
                            <View style={CommonStylesheet.iconView}>
                                <View style={{ marginHorizontal: 20 }}>
                                    <Icon style={[CommonStylesheet.iconstyledashboard, { color: 'gray' }]}
                                        name="qrcode"
                                    >
                                    </Icon>
                                </View>
                                <Text style={[CommonStylesheet.cardTextHomeScreen, { color: 'gray' }]}>Generate QR-Code</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};






export default HomeScreen;
