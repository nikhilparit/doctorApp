import React,{useState,useEffect} from "react";
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
const { height, width } = Dimensions.get('window');
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import MyProfile from "./MyProfile/MyProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = ({route}) => {
    const navigation = useNavigation();
    const [myClinicID, setClinicID] = useState('');
    const reaData = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setClinicID(user.clinicID);
    }
    useEffect(() => {
        reaData()
    }, []);
    return (

        // <ImageBackground source={require('../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>

<View style={[CommonStylesheet.formContainer,CommonStylesheet.backgroundimage]}>
            <ScrollView>
                <View style={CommonStylesheet.container}>
                    <View style={{width:'100%'}}>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
                        <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                <View style={{ flexDirection: 'row',width:'100%',alignItems:'center',height:'100%' }}>
                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="hospital-user"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                            My Profile
                                        </Text>

                                    </View>

                                    <View style={CommonStylesheet.careticonatSettingScreen}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity> */}

                        <TouchableOpacity onPress={() => navigation.navigate('DoctorList',{
                            clinicID:myClinicID
                        })}>
                                   <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                    <View style={{ flexDirection: 'row',width:'100%',alignItems:'center',height:'100%' }}>
                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="user-md"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                            Doctors List
                                        </Text>

                                    </View>

                                    <View style={CommonStylesheet.careticonatSettingScreen}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                               
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('MasterData',{
                            clinicID:myClinicID
                        })}>
                                     <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                     <View style={{ flexDirection: 'row',width:'100%',alignItems:'center',height:'100%' }}>
                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="database"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                           Master Data
                                        </Text>

                                    </View>

                                    <View style={CommonStylesheet.careticonatSettingScreen}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                             
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ClinicDetails',{
                                clinicID : myClinicID
                        })}>
                                    <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                    <View style={{ flexDirection: 'row',width:'100%',alignItems:'center',height:'100%' }}>
                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="hospital"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                            Clinic Details
                                        </Text>

                                    </View>

                                    <View style={CommonStylesheet.careticonatSettingScreen}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                               
                            </View>
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={() => navigation.navigate('ManageRxTemplatesList',{
                            clinicID:myClinicID
                        })}>
                                   <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                    <View style={{ flexDirection: 'row',width:'100%',alignItems:'center',height:'100%' }}>
                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="prescription"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                            Manage Rx Template
                                        </Text>

                                    </View>

                                    <View style={CommonStylesheet.careticonatSettingScreen}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity> */}

                        {/* <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                        <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                        <View style={{ flexDirection: 'row',width:'100%',alignItems:'center',height:'100%' }}>
                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="cog"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                           Personalize Setting
                                        </Text>

                                    </View>

                                    <View style={CommonStylesheet.careticonatSettingScreen}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                                
                            </View>
                        </TouchableOpacity> */}

                        {/* <TouchableOpacity onPress={() => navigation.navigate('LabWorkMasterData',{
                            clinicID:myClinicID
                        })}>
                                   <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                   <View style={{ flexDirection: 'row',width:'100%',alignItems:'center',height:'100%' }}>
                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="flask"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                           Labwork Setting
                                        </Text>

                                    </View>

                                    <View style={CommonStylesheet.careticonatSettingScreen}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity> */}

                        {/* <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                        <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                        <View style={{ flexDirection: 'row',width:'100%',alignItems:'center',height:'100%' }}>
                                    <View style={CommonStylesheet.iconatSettingScreen}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="wheelchair"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                            Manage Clinic Chairs
                                        </Text>

                                    </View>

                                    <View style={CommonStylesheet.careticonatSettingScreen}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity> */}
                    </View>

                </View>
            </ScrollView>
            </View>
    );
};
const styles = StyleSheet.create({
    logo:{
        width: width * 0.06, // Adjust width based on screen width
        height: height * 0.05, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    }
});

export default Settings;