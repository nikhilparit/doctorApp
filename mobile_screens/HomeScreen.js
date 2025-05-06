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
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';


const { height, width } = Dimensions.get('window');

const fontSizeForHeader = width < 650 ? 18 : 22; // Adjust the multiplier as per your requirement

const HomeScreen = () => {
    const user = useSelector((state) => state.auth.user);
    //console.log("User",user);
    const navigation = useNavigation();
    const [clinicID, setClinicID] = useState('');
    const isFocused = useIsFocused();
    const [ClinicFinalName, setClinicFinalName] = useState('');

    return (

        // <View style={CommonStyle.containerHomeScreen}>

        //     <ScrollView>
        //         <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffff', marginTop: 20 }}>
        //             <Text style={{ color: '#2196f3', fontSize: 16, fontFamily: 'Poppins-Bold', textAlign: 'center' }}>{ClinicFinalName}</Text>
        //         </View>
        //         <View style={{ marginTop: 4 }}>
        //             <View style={{
        //                 flexDirection: 'row',
        //                 justifyContent: 'space-between',
        //                 marginTop: 12
        //             }}>
        //                 <View style={CommonStyle.eventInsideCard}>
        //                     <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        //                         <View style={CommonStyle.iconView}>

        //                             {/* <Icon
        //                                 name="chalkboard"
        //                                 size={35}
        //                                 color={"#007bc1"} >

        //                             </Icon> */}

        //                             <Image
        //                                 source={require('../assets/images/dashboard.png')} alt="logo.png"
        //                                 style={CommonStyle.imageHomeScreen} />

        //                             <Text style={CommonStyle.cardTextHomeScreen}>DASHBOARD</Text>
        //                         </View>
        //                     </TouchableOpacity>
        //                 </View>
        //                 <View style={CommonStyle.eventInsideCard}>
        //                     <TouchableOpacity onPress={() => navigation.navigate('Patients')}>
        //                         <View style={CommonStyle.iconView}>

        //                             {/* <Icon
        //                                 name="hospital-user"
        //                                 size={40}
        //                                 color={"#007bc1"}
        //                             >

        //                             </Icon> */}

        //                             <Image
        //                                 source={require('../assets/images/patients.png')} alt="logo.png"
        //                                 style={CommonStyle.imageHomeScreen} />

        //                             <Text style={CommonStyle.cardTextHomeScreen}>PATIENTS</Text>

        //                         </View>
        //                     </TouchableOpacity>
        //                 </View>
        //             </View>
        //             <View
        //                 style={{
        //                     flexDirection: 'row',
        //                     // margin: 10,

        //                     justifyContent: 'space-between',
        //                     marginTop: 12
        //                 }}>

        //                 <View style={CommonStyle.eventInsideCard}>
        //                     <TouchableOpacity onPress={() => navigation.navigate('Appointment')}>
        //                         <View style={CommonStyle.iconView}>

        //                             {/* <Icon
        //                                 name="calendar-check"
        //                                 size={35}
        //                                 color={"#007bc1"}
        //                             >

        //                             </Icon> */}
        //                             <Image
        //                                 source={require('../assets/images/appointments.png')} alt="logo.png"
        //                                 style={CommonStyle.imageHomeScreen} />

        //                             <Text style={CommonStyle.cardTextHomeScreen}>APPOINTMENTS</Text>
        //                         </View>
        //                     </TouchableOpacity>
        //                 </View>

        //                 <View style={CommonStyle.eventInsideCard}>
        //                     <TouchableOpacity onPress={() => navigation.navigate('Settings',{
        //                         clinicID:clinicID
        //                     })}>
        //                         <View style={CommonStyle.iconView}>

        //                             {/* <Icon
        //                                 name="truck-monster"
        //                                 size={35}
        //                                 color={"#007bc1"}
        //                             >
        //                             </Icon> */}
        //                             <Image
        //                                 source={require('../assets/images/settings.png')} alt="logo.png"
        //                                 style={CommonStyle.imageHomeScreen} />
        //                             <Text style={CommonStyle.cardTextHomeScreen}>SETTINGS</Text>
        //                         </View>
        //                     </TouchableOpacity>
        //                 </View>
        //             </View>


        //             <View
        //                 style={{
        //                     flexDirection: 'row',
        //                     //margin: 10,
        //                     marginTop: 12,
        //                     justifyContent: 'space-between',
        //                 }}>

        //                 <View style={CommonStyle.eventInsideCard}>
        //                     <TouchableOpacity   onPress={() => navigation.navigate('Reports', {
        //                         clinicID: clinicID

        //                     })}>
        //                         <View style={CommonStyle.iconView}>

        //                             {/* <Icon
        //                                 name="scroll"
        //                                 size={35}
        //                                 color={"#007bc1"}
        //                             >

        //                             </Icon> */}
        //                             <Image
        //                                 source={require('../assets/images/report.png')} alt="logo.png"
        //                                 style={CommonStyle.imageHomeScreen} />

        //                             <Text style={CommonStyle.cardTextHomeScreen}>REPORT</Text>
        //                         </View>
        //                     </TouchableOpacity>
        //                 </View>

        //                 {/* <View style={CommonStyle.eventInsideCard}>
        //                     <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
        //                         <View style={CommonStyle.iconView}>

        //                             <Image
        //                                 source={require('../assets/images/coomunication.jpg')} alt="logo.png"
        //                                 style={CommonStyle.imageHomeScreen} />
        //                             <Text style={CommonStyle.cardTextHomeScreen}>COMMUNICATION</Text>
        //                         </View>
        //                     </TouchableOpacity>
        //                 </View> */}
        //             </View>

        //             {/* <View
        //                 style={{
        //                     flexDirection: 'row',
        //                     //margin: 10,

        //                     marginTop: 12,
        //                     justifyContent: 'space-between',
        //                 }}>

        //                 <View style={CommonStyle.eventInsideCard}>
        //                     <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
        //                         <View style={CommonStyle.iconView}>

        //                             <Image
        //                                 source={require('../assets/images/file.jpg')} alt="logo.png"
        //                                 style={CommonStyle.imageHomeScreen} />

        //                             <Text style={CommonStyle.cardTextHomeScreen}>FILES</Text>
        //                         </View>
        //                     </TouchableOpacity>
        //                 </View>

        //                 <View style={CommonStyle.eventInsideCard}>
        //                     <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
        //                         <View style={CommonStyle.iconView}>

        //                             <Image
        //                                 source={require('../assets/images/labwork.jpeg')} alt="logo.png"
        //                                 style={CommonStyle.imageHomeScreen} />

        //                             <Text style={CommonStyle.cardTextHomeScreen}>LABWORK</Text>
        //                         </View>
        //                     </TouchableOpacity>
        //                 </View>
        //             </View> */}



        //         </View>
        //     </ScrollView>
        // </View>



        //Reposive Code
        <ScrollView>
            <View style={CommonStylesheet.containerHomeScreen}>
                {/* <View style={[CommonStylesheet.Hometitle,CommonStylesheet.shadow]}>
                <Text style={{ color: '#fff', fontSize: fontSizeForHeader, fontFamily: 'Poppins-Bold', textAlign: 'center' }}>{ClinicFinalName}</Text>
            </View> */}
                <View style={{ padding: 15, }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                        <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#07AAA5' }]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                                <View style={CommonStylesheet.iconView}>
                                    <View style={{ marginHorizontal: 20 }}>
                                        <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#07AAA5' }]}
                                            name="th-large"

                                        >

                                        </Icon>
                                    </View>
                                    <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#07AAA5' }]}>Dashboard</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#bfa106' }]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Patient', {
                                startDate: "2025-01-01",
                                endDate: "2025-12-31",
                                Searchby: 'AllPatients'
                            })}>
                                <View style={CommonStylesheet.iconView}>
                                    <View style={{ marginHorizontal: 20 }}>
                                        <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#bfa106' }]}
                                            name="hospital-user"

                                        >
                                        </Icon>
                                    </View>
                                    <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#bfa106' }]}>Patients</Text>

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
                            <TouchableOpacity onPress={() => navigation.navigate('Appointment')}>
                                <View style={CommonStylesheet.iconView}>
                                    <View style={{ marginHorizontal: 20 }}>
                                        <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#bd1011' }]}
                                            name="calendar-check"
                                        >
                                        </Icon>
                                    </View>
                                    <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#bd1011' }]}>Appointments</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#0a6522' }]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Settings', {
                                clinicID: clinicID
                            })}>
                                <View style={CommonStylesheet.iconView}>
                                    <View style={{ marginHorizontal: 20 }}>
                                        <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#0a6522' }]}
                                            name="cog"

                                        >

                                        </Icon>
                                    </View>
                                    <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#0a6522' }]}>Settings</Text>
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

                        <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#072AAA' }]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Reports', {
                                clinicID: clinicID

                            })}>
                                <View style={CommonStylesheet.iconView}>


                                    <View style={{ marginHorizontal: 20 }}>
                                        <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#072AAA' }]}
                                            name="file-alt"

                                        >

                                        </Icon>
                                    </View>

                                    <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#072AAA' }]}>Report</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#0787AA' }]}>
                            <TouchableOpacity onPress={() => navigation.navigate('FileList', {
                                clinicID: clinicID,
                                Description: 'All',
                                startDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                                endDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                                pageindex: 0,
                                pagesize: 10,
                                searchData: '',
                                isCheckboxChecked: false

                            })}>
                                <View style={CommonStylesheet.iconView}>


                                    <View style={{ marginHorizontal: 20 }}>
                                        <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#0787AA' }]}
                                            name="file-upload"

                                        >

                                        </Icon>
                                    </View>

                                    <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#0787AA' }]}>Files</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* <View style={[CommonStylesheet.eventInsideCard,CommonStylesheet.shadow ,{borderColor:'#2196f3'}]}>
                        <TouchableOpacity onPress={() => Alert.alert('Work is in process...')}>
                            <View style={CommonStylesheet.iconView}>
                                <View style={{ marginHorizontal: 20}}>
                                                <Icon style={[CommonStylesheet.iconstyledashboard ,{color:'#2196f3'}]}
                                                    name="envelope" 

                                                >
 
                                                </Icon>
                                            </View>                                   
                                <Text style={[CommonStylesheet.cardTextHomeScreen,{color:'#2196f3'}]}>Communication</Text>
                            </View>
                        </TouchableOpacity>
                    </View>  */}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginTop: 15
                    }}>
                        <View style={[CommonStylesheet.eventInsideCard, CommonStylesheet.shadow, { borderColor: '#0787AA' }]}>
                            <TouchableOpacity onPress={() => navigation.navigate('AI_Document', {
                                clinicID: clinicID

                            })}>
                                <View style={CommonStylesheet.iconView}>
                                    <View style={{ marginHorizontal: 20 }}>
                                        <Icon style={[CommonStylesheet.iconstyledashboard, { color: '#0787AA' }]}
                                            name="file-upload"
                                        >
                                        </Icon>
                                    </View>
                                    <Text style={[CommonStylesheet.cardTextHomeScreen, { color: '#0787AA' }]}>AI_Document</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};






export default HomeScreen;
