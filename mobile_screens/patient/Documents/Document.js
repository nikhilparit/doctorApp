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
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from 'axios';
import Api from "../../../api/Api";
import { getHeaders } from "../../../utils/apiHeaders";
import Loader from "../../../components/Loader";

const { width, height } = Dimensions.get('window');
const ICON_SIZE = 30 // defined constant IconSize


const Document = ({ route }) => {
    const navigation = useNavigation();
    const [clinicID, setClinicID] = useState('');
    const [PatientID, setPatientID] = useState('');
    const [token, setToken] = useState('');
    const [userName, setuserName] = useState('');
    const [foldername, setfoldername] = useState([]);
    const [loading, setLoading] = useState(false)
    const readData = async () => {
        setLoading(true);
        try {
            const headers = await getHeaders();
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            setClinicID(user.clinicID);
            setuserName(user.userName);
            const PatientID = route.params.patientID;
            setPatientID(PatientID);
            ////console.log(userName,'userName');
            const formData1 = {
                clinicID: user.clinicID,
                folderId: 0,
            };

            const response = await Axios.post(`${Api}Document/GetDocumentFolderById`, formData1, { headers });
            //console.log('Folder ID:', response.data);
            setfoldername(response.data);
            // if (response.data && response.data.length > 0) {
            //     setAll(response.data[2].description);  // Set the first folder as the default value
            //     setselectedFolder(response.data[2].folderId);
            //    // //console.log('setselectedFolder' ,response.data[0].folderId);

            //   }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching folder ID:', error);
        }
    };

    useEffect(() => {
        readData()
    }, []);
    return (
        <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>
            {loading ? <Loader /> :
                <ScrollView>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => navigation.navigate('Files', {
                           // clinicID: clinicID,
                            patientID: PatientID,
                            description: "All"
                        })}>
                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                    <View style={[CommonStylesheet.iconatSettingScreen, { width: "2%" }]}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="file-alt"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={[CommonStylesheet.cardtextSettingScreen, { width: "92%" }]}>

                                        <Text style={CommonStylesheet.dashboardText}>
                                            All
                                        </Text>

                                    </View>

                                    <View style={[CommonStylesheet.careticonatSettingScreen, { width: "2%" }]}>
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
                        {foldername.map((item) =>
                            <View style={{ width: '100%' }}>

                                <TouchableOpacity onPress={() => navigation.navigate('Files', {
                                    clinicID: clinicID,
                                    patientID: PatientID,
                                    description: item.description,
                                    folderId: item.folderId

                                })}>

                                    <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]} key={item.folderId}>
                                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                            <View style={[CommonStylesheet.iconatSettingScreen, { width: "2%" }]}>

                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <Icon style={CommonStylesheet.iconstylediscover}
                                                        name="folder"
                                                        size={40}
                                                        color={"#2196f3"} >

                                                    </Icon>
                                                </View>
                                            </View>

                                            <View style={[CommonStylesheet.cardtextSettingScreen, { width: "96%" }]}>

                                                <Text style={CommonStylesheet.dashboardText}>
                                                    {item.description}
                                                </Text>

                                            </View>

                                            <View style={[CommonStylesheet.careticonatSettingScreen, { width: "2%" }]}>
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

                                {/* <TouchableOpacity onPress={() => navigation.navigate('Files', {
                            clinicID: clinicID,
                            patientID :PatientID,
                            description :"Testimonials"
                        })}>
                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                         name="comments"  
                                            size={40}
                                            color={"#2196f3"} >

                                        </Icon>
                                    </View>
                                </View>

                                <View style={[CommonStylesheet.cardtextSettingScreen,{width:"92%"}]}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                      Testimonials
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
                        <TouchableOpacity onPress={() => navigation.navigate('Files', {
                            clinicID: clinicID,
                            patientID :PatientID,
                            description :"Testimonials"
                        })}>
                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="image"
                                            size={40}
                                            color={"#2196f3"} >

                                        </Icon>
                                    </View>
                                </View>

                                <View style={[CommonStylesheet.cardtextSettingScreen,{width:"94%"}]}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                    Scanned Images
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


                        <TouchableOpacity onPress={() => navigation.navigate('Files', {
                            clinicID: clinicID,
                            patientID :PatientID,
                            description :"Testimonials"
                        })}>
                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="file-alt"
                                            size={40}
                                            color={"#2196f3"} >

                                        </Icon>
                                    </View>
                                </View>

                                <View style={[CommonStylesheet.cardtextSettingScreen,{width:"92%"}]}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                    Patient Reports
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
                        <TouchableOpacity onPress={() => navigation.navigate('Files', {
                            clinicID: clinicID,
                            patientID :PatientID,
                            description :'Testimonials'
                        })}>
                       */}
                            </View>
                        )}
                        {/* <TouchableOpacity onPress={() => navigation.navigate('Files', {
                            clinicID: clinicID,
                            patientID :PatientID,
                            description :"Testimonials"
                        })}>
                      <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="file-alt"
                                            size={40}
                                            color={"#2196f3"} >

                                        </Icon>
                                    </View>
                                </View>

                                <View style={[CommonStylesheet.cardtextSettingScreen,{width:"92%"}]}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                   Consent Form
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
                         */}
                    </View>

                </ScrollView>
            }
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

export default Document;