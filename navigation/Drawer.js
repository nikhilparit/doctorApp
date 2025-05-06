import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused, useFocusEffect, CommonActions } from '@react-navigation/native';
import CommonStylesheet from '../common_stylesheet/CommonStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';


const { width, height } = Dimensions.get('window');
const myFontfamily = 'Poppins-Bold';
const myFontfamilyatdrawer = 'Poppins-Medium';
const myFontSizeatdrawer = width < 600 ? 15 : 18;
const myFontSize = width < 600 ? 18 : 20;
const icon_size = width < 600 ? 20 : 22;
const color = '#2196F3';
//importing drawer screens
import Appointment from '../mobile_screens/appointment/Appointment';
import Patient from '../mobile_screens/patient/Patient';
import ClinicList from '../mobile_screens/clinic/ClinicList';
import HomeScreen from '../mobile_screens/HomeScreen';
import Settings from '../mobile_screens/Setting/Settings';
import Dashboard from '../mobile_screens/Dashboard/Dashboard';
import Reports from '../mobile_screens/Report/Reports';
import Files from '../mobile_screens/patient/Documents/Files';
import Services from '../mobile_screens/Services';
import HomeButton from '../components/HomeButton';
import FileList from '../mobile_screens/Files/FileList';
import FilterFileButton from '../components/FilterFileButton';

const Drawer = createDrawerNavigator();
function MyDrawer() {
    const clinicName = useSelector((state) => state.clinic.clinicName);
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
            <Drawer.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: 'Home',
                    headerTitle: clinicName,
                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer,
                        marginLeft: -5
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="home"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: 'Dashboard',

                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer,
                        marginLeft: -5
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="th-large"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                    headerRight: () => (

                        <View style={{ flexDirection: 'row', marginRight: 20 }}>

                            <HomeButton />

                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="Patient"
                component={Patient}
                initialParams={{ Searchby: "AllPatients", startDate: "2025-01-01", endDate: "2025-12-31" }}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: '  Patient',
                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },
                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer
                    },
                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="user-nurse"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                }}
                listeners={({ navigation }) => ({
                    drawerItemPress: (event) => {
                        event.preventDefault(); // Prevent default navigation behavior

                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{
                                    name: 'Patient',
                                    params: { Searchby: "AllPatients", startDate: "2025-01-01", endDate: "2025-12-31" }
                                }],
                            })
                        );
                    },
                })}
            />
            <Drawer.Screen
                name="Appointment"
                component={Appointment}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: '  Appointment',

                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer,
                        marginLeft: -2
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="calendar-check"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                }}
                listeners={({ navigation }) => ({
                    drawerItemPress: (event) => {
                        event.preventDefault(); // Prevent default navigation behavior

                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{
                                    name: 'Appointment',
                                    params: {
                                        keyParam: null

                                    }
                                }],
                            })
                        );
                    },
                })}
            />
            <Drawer.Screen
                name="Settings"
                component={Settings}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: 'Settings',
                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer,
                        marginLeft: -10
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="truck-monster"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                    headerRight: () => (

                        <View style={{ flexDirection: 'row', marginRight: 20 }}>

                            <HomeButton />

                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="Reports"
                component={Reports}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: 'Reports',

                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="file-alt"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                    headerRight: () => (

                        <View style={{ flexDirection: 'row', marginRight: 20 }}>

                            <HomeButton />

                        </View>
                    ),
                }}
            />
            {/* <Drawer.Screen
                name="Files"
                component={Files}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: 'Files',

                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="file-upload"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                }}
            /> */}
            <Drawer.Screen
                name="FileList"
                component={FileList}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: 'Files',
                    unmountOnBlur: false,

                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer,
                        marginLeft: -6
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="hospital"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                    headerRight: () => (

                        <View style={{ flexDirection: 'row', marginRight: 20 }}>

                            <FilterFileButton />

                        </View>
                    ),
                }}
                listeners={({ navigation }) => ({
                    drawerItemPress: (event) => {
                        event.preventDefault(); // Prevent default navigation behavior

                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{
                                    name: 'FileList',
                                    params: {
                                        Description: 'All',
                                        startDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                                        endDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                                        pageindex: 0,
                                        pagesize: 10,
                                        searchData: '',
                                        isCheckboxChecked: false

                                    }
                                }],
                            })
                        );
                    },
                })}
            />
            <Drawer.Screen
                name="ClinicList"
                component={ClinicList}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: 'Clinic List',

                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer,
                        marginLeft: -6
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="hospital"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                }}
            />

            {/* <Drawer.Screen
                name="Services"
                component={Services}
                options={{
                    headerTintColor: 'white',
                    headerShown: true,
                    title: 'Services',
                    headerStyle: {
                        backgroundColor: '#2196f3',
                    },

                    headerTitleStyle: {
                        fontFamily: myFontfamily,
                        fontSize: myFontSize
                    },
                    drawerLabelStyle: {
                        fontFamily: myFontfamilyatdrawer,
                        fontSize: myFontSizeatdrawer,
                        marginLeft: -11
                    },

                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            name="hands-helping"
                            size={icon_size}
                            color={focused ? '#3b82f6' : color}
                        />
                    ),
                }}
            /> */}



        </Drawer.Navigator>
    );
}

const CustomDrawer = props => {
    const dispatch = useDispatch();
    // const [name, setdoctorName] = useState();
    // const [image, setImage] = useState();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [user, setuserName] = useState(null);
    const readData = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setuserName(user.name);
    };
    useEffect(() => {
        readData();
    }, [isFocused]);
    const handleLogout = async () => {
        await AsyncStorage.clear();
        dispatch(logout());
        navigation.navigate('Login');
    };
    return (
        <DrawerContentScrollView {...props}>
            <View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../assets/images/blankUser.jpg')}
                        style={{
                            width: 50, // Adjust width based on screen width
                            height: 50, // Adjust height based on screen height

                            borderRadius: 55,
                            marginTop: 10,
                        }}
                    />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>

                        <Text
                            style={{
                                fontFamily: 'Poppins-Bold',
                                fontSize: 16,
                                color: '#4E5050',
                                textAlign: 'center',
                                margin: 10
                            }}>
                            Welcome {user}
                        </Text>
                        <Image
                            source={require('../assets/images/edit.png')}
                            style={{
                                width: 15, // Adjust width based on screen width
                                height: 15, // Adjust height based on screen height
                                margin: 10,
                            }}
                        />

                    </View>
                </TouchableOpacity>
            </View>
            <DrawerItemList {...props} />
            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 20 }}>
                <View
                    style={{
                        backgroundColor: '#2196f3',
                        height: 0.8,
                        flex: 1,
                        alignSelf: 'center',
                    }}
                />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                <TouchableOpacity onPress={() => handleLogout()}>
                    <View style={{ backgroundColor: '#2196f3', height: 30, width: 150, borderRadius: 10 }}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Regular',
                                textAlign: 'center',
                                color: 'white',
                                position: 'relative',
                                top: 7,
                            }}>
                            Logout
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <View style={{ justifyContent: 'flex-end', marginTop: 30, marginHorizontal: 5 }}>
                <Text style={CommonStylesheet.Text}>V.1.1.24</Text>
            </View> */}
        </DrawerContentScrollView>
    );
};

export default MyDrawer;