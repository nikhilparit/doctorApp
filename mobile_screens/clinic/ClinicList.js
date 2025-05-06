import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    Text,
    Image,
    Fab,
    Link
} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from "../../api/Api";
import moment from "moment";
import Loader from "../../components/Loader";
import { useSelector, useDispatch } from 'react-redux';
import { setClinic, GetClinicsByUserID, InserExtensionRequest } from "../../features/clinicSlice";
import Toast from "react-native-toast-message";
//import Snackbar from "react-native-snackbar";
// const secondaryCardHeader = Math.min(width, height) * 0.03;
const ClinicList = () => {
    const dispatch = useDispatch();
    const clinicList = useSelector((state) => state.clinic.clinicList);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    // const [clinicList, setClinicList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [myUserID, setUserID] = useState('');
    const [myMobile, setMobile] = useState('');
    const [token, setToken] = useState('');

    const readData = async () => {
        try {
            setLoading(true);
            const userString = await AsyncStorage.getItem("user");
            if (!userString) throw new Error("User data not found.");

            const user = JSON.parse(userString);
            setUserID(user.userID);
            setMobile(user.mobile);

            const formData = { userID: user.userID || user.userId };
            //console.log(formData);
            const response = await dispatch(GetClinicsByUserID(formData));
            if (response.meta.requestStatus === 'fulfilled' && Array.isArray(response.payload)) {
                // console.log("responseClinicList:", response.payload);
                let isDisabled = response.payload.some(clinic => clinic.licenseValidTill <= moment().format());
                setIsDisabled(isDisabled);
            } else {
                console.error("Invalid payload:", response.payload);
                throw new Error("Failed to fetch clinic list.");
            }
        } catch (error) {
            console.error("ERROR:", error);
            await AsyncStorage.clear();
            navigation.navigate('Login');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isFocused) {
            readData();
        }
    }, [isFocused]); // Dependency array to ensure effect runs when isFocused changes

    const selectedClinic = async (id, name) => {
        //console.log(id, name)
        try {
            const userString = await AsyncStorage.getItem('user');
            if (userString) {
                const user = JSON.parse(userString);
                const updatedUser = { ...user, clinicID: id, clinicName: name };

                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

                // Dispatch Redux action to update clinic in state
                dispatch(setClinic({ clinicID: id, clinicName: name }));

                navigation.navigate('MyDrawer', { screen: 'HomeScreen' });
            }
        } catch (error) {
            console.error('Error updating clinic in AsyncStorage:', error.message);
        }
    };

    const requestForExtention = async (id) => {
        const formData = {
            clinicExtensionID: "00000000-0000-0000-0000-000000000000",
            clinicID: id,
            userID: myUserID,
            createdOn: moment().toISOString(),
            createdBy: myMobile,
            isdeleted: false,
            lastUpdatedOn: moment().toISOString(),
            lastUpdatedBy: null,
            isRequestAproved: false,
            noOfDaysToExtend: 0,
            noOfRqestAllowed: 0
        }
        try {
            const result = await dispatch(InserExtensionRequest(formData));
            //console.log("extention",result);

            if (result.payload == 1) {
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Sent extention request successfully.',
                });
               // alert("Sent extention request successfully");
                readData();
            } else {
                Toast.show({
                    type: 'error', // Match the custom toast type
                    text1: 'Failed to sent extention request.',
                    text2: 'Please connect to administration.',
                });
            }

        } catch (error) {
            //console.log(error);
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'An unexpected error occurred. ',
                text2: 'Please try again...',
            });
            //alert("An unexpected error occurred. Please try again.");
        }
    }

    return (
        // <ImageBackground source={require('../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {loading ? (
                <Loader />
            ) : (
                <ScrollView>
                    <View style={styles.cardContainer}>
                        <View>
                            {clinicList.length == 0 ? (
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height / 3 }}>
                                    <Text style={CommonStylesheet.Text}>There is no clinic registered yet, Please click on (+) button for adding a new clinic</Text>
                                </View>
                            ) : (
                                clinicList.map(item => (
                                    <TouchableOpacity
                                        onPress={() => selectedClinic(item.clinicID, item.clinicName)}
                                        key={item.clinicID}
                                        disabled={item.licenseValidTill <= moment().format() && isDisabled}
                                    >
                                        <View style={CommonStylesheet.cardatClinicLicstScreen} key={item.clinicID}>
                                            <View style={styles.image}>
                                                <Image
                                                    source={require('../../assets/images/cliniclogo.png')} alt="logo.png" style={styles.logo}
                                                />
                                            </View>
                                            <View style={styles.clinicInfo}>
                                                <View style={{ width: '100%', height: '20%', flex: 1, overflow: 'hidden' }}>
                                                    <Text style={CommonStylesheet.headertextClinicLicstScreen}>
                                                        {item.clinicName}
                                                    </Text>
                                                    <Text style={CommonStylesheet.headertextClinicLicst}>
                                                        {item.address2}
                                                    </Text>
                                                    {item.licenseValidTill >= moment().format() ? (
                                                        <Text style={CommonStylesheet.subheadertextClinicLicst}>
                                                            Active
                                                        </Text>
                                                    ) : (
                                                        <>
                                                            <Text style={CommonStylesheet.subheadertextClinicLicst1}>
                                                                Expired
                                                            </Text>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                                {/* <Link
                                                                    _text={{
                                                                        fontSize: 14,
                                                                        fontWeight: '500',
                                                                        color: '#3399ff',
                                                                        fontFamily: 'Poppins-Regular',
                                                                    }}
                                                                    onPress={() => alert('Work is in process...')}
                                                                    alignSelf="flex-start"
                                                                //mt={3}
                                                                >
                                                                    Renew
                                                                </Link> */}
                                                                <Link
                                                                    _text={{
                                                                        fontSize: 14,
                                                                        fontWeight: '500',
                                                                        color: '#3399ff',
                                                                        fontFamily: 'Poppins-Regular',
                                                                    }}
                                                                    onPress={() => requestForExtention(item.clinicID)}
                                                                    alignSelf="flex-start"
                                                                //mt={3}

                                                                >
                                                                    Request for Extension
                                                                </Link>
                                                            </View>
                                                        </>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    </View>
                </ScrollView>
            )}
            <View>

                <Fab
                    bgColor={'#2196f3'}
                    renderInPortal={false} size={'md'} icon={<Icon
                        name="plus"
                        size={10}
                        color={"white"}
                    />} onPress={() => navigation.navigate('AddClinic')} />

            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    cardContainer: {
        padding: 10,
    },
    image: {
        // borderColor: 'red',
        // borderWidth: 1,
        width: '25%',
        height: '100%',
        padding: 10,
        alignItems: 'center',
        resizeMode: 'contain'
    },
    clinicInfo: {
        // borderColor: 'green',
        // borderWidth: 1,
        width: '75%',
        height: '100%',
        padding: 10
    },
    logo: {
        width: width * 0.12, // Adjust width based on screen width
        height: height * 0.12, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    },
    renewButton: {
        width: 80, // Adjust width based on screen width
        height: 30, // Adjust height based on screen height
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
})

export default ClinicList;