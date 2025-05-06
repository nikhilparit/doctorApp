import React, { useEffect, useState } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
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

} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');
const ICON_SIZE = 30 // defined constant IconSize


const Reports = ({ route }) => {
    const navigation = useNavigation();
    const [clinicID, setClinicID] = useState('');
    const reaData = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const clinicIDatReportmenu = user.clinicID;
        //console.log(clinicIDatReportmenu);
        setClinicID(clinicIDatReportmenu);
    }
    useEffect(() => {
        reaData()
    }, []);
    return (
        <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{ width: '100%' }}>

                        <TouchableOpacity onPress={() => navigation.navigate('DailyCollection')}>

                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                    <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="file-invoice-dollar"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={[CommonStylesheet.cardtextSettingScreen,{width:"96%"}]}>

                                        <Text style={CommonStylesheet.dashboardText}>
                                            Daily Collection
                                        </Text>

                                    </View>

                                    <View style={[CommonStylesheet.careticonatSettingScreen,{width:"2%"}]}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        marginHorizontal: 20,
                                        marginTop: -10,
                                        flexDirection: 'row',
                                    }}>

                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('OutstandingReport')}>
                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="money-bill-alt"
                                            size={40}
                                            color={"#2196f3"} >

                                        </Icon>
                                    </View>
                                </View>

                                <View style={[CommonStylesheet.cardtextSettingScreen,{width:"92%"}]}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                        Outstanding
                                    </Text>

                                </View>

                                <View style={[CommonStylesheet.careticonatSettingScreen,{width:"2%"}]}>
                                    <Icon style={CommonStylesheet.iconstylediscover}
                                        name="chevron-right">
                                    </Icon>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginHorizontal: 20,
                                    marginTop: -10,
                                    flexDirection: 'row',
                                }}>

                            </View>
                        </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('BirthdayReport')}>
                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="birthday-cake"
                                            size={40}
                                            color={"#2196f3"} >

                                        </Icon>
                                    </View>
                                </View>

                                <View style={[CommonStylesheet.cardtextSettingScreen,{width:"94%"}]}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                        Birthday Report
                                    </Text>

                                </View>

                                <View style={[CommonStylesheet.careticonatSettingScreen,{width:"2%"}]}>
                                    <Icon style={CommonStylesheet.iconstylediscover}
                                        name="chevron-right">
                                    </Icon>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginHorizontal: 20,
                                    marginTop: -10,
                                    flexDirection: 'row',
                                }}>

                            </View>
                        </View>

                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => navigation.navigate('SMSReport')}>
                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="comment"
                                            size={40}
                                            color={"#2196f3"} >

                                        </Icon>
                                    </View>
                                </View>

                                <View style={[CommonStylesheet.cardtextSettingScreen,{width:"92%"}]}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                       SMS Report
                                    </Text>

                                </View>

                                <View style={[CommonStylesheet.careticonatSettingScreen,{width:"2%"}]}>
                                    <Icon style={CommonStylesheet.iconstylediscover}
                                        name="chevron-right">
                                    </Icon>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginHorizontal: 20,
                                    marginTop: -10,
                                    flexDirection: 'row',
                                }}>

                            </View>
                        </View>

                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 10
    },
    logo: {
        width: width * 0.07, // Adjust width based on screen width
        height: height * 0.07, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    }
})

export default Reports;