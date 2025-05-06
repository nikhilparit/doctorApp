import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView, StyleSheet, Alert, Dimensions } from 'react-native';
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
    Select, CheckIcon, Center, NativeBaseProvider

} from 'native-base';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
//common styles
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import Loader from '../../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width, height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import { fetchClinicData, InsertClinicForExistingUser } from '../../../features/clinicSlice';
import Toast from 'react-native-toast-message';
import { getHeaders } from '../../../utils/apiHeaders';
import { TimePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
const secondaryCardHeader = Math.min(width, height) * 0.03;
const fontSize = Math.min(width, height) * 0.03;

//fonts_for_tablet_and_mobile

const regularFontSize = width < 600 ? 15 : 18;
const primaryFontSize = width < 600 ? 17 : 22;

function AddDoctor() {
    const route = useRoute();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [mobileNumber, setmobileNumber] = useState('');
    const [drName, setdrName] = useState('');
    const [email, setEmail] = useState('');
    const [accesslevel, setAccessLevel] = useState('');
    const [slot, setSlot] = useState('15 mins');
    const [userData, setUser] = useState({});
    const [visibleStart, setVisibleStart] = useState(false);
    const [visibleEnd, setVisibleEnd] = useState(false);
    const [startTime, setStartTime] = useState("09:00 AM");
    const [endTime, setEndTime] = useState("09:00 PM");

    const timeOptions = [
        "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
        "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
        "08:00 PM", "09:00 PM", "10:00 PM",
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;


    async function readData() {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setUser(user);

    }

    useEffect(() => {
        readData()
        if (route.params?.selectedAccessLevels) {
            setAccessLevel(route.params.selectedAccessLevels.join(', '));
        }
    }, [route.params?.selectedAccessLevels]);

    function onClickAccessLevel() {
        navigation.navigate('AccessLevel', {
            selectedValues: accesslevel ? accesslevel.split(', ') : [],
            onSelect: (selectedValues) => {
                setAccessLevel(selectedValues.join(', '));
            },
        });
    }

    const formatSelectedDateTime = (selectedDate, timeString) => {
        return moment(selectedDate)
            .hour(moment(timeString, "hh:mm A").hour())
            .minute(moment(timeString, "hh:mm A").minute())
            .second(0)
            .millisecond(0)
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    };

    const extractNumber = (timeString) => {
        return timeString.replace(/\D/g, '');
    };

    async function addDoctor() {
        if (!drName || !email || !mobileNumber) {
            Toast.show({
                type: 'error',
                text1: 'Please add doctor name, email and mobile number',
                text2: 'Required doctor name, email and mobile number to continue.',
            });
            return
        }
        if (email !== '') {
            if (!emailRegex.test(email)) {
                Toast.show({
                    type: 'error', // Match the custom toast type
                    text1: 'Invalid Email.',
                    text2: 'Please provide email in correct format to continue.',
                });
                return;
            }
            if (mobileNumber !== '') {
                if (!mobileRegex.test(mobileNumber)) {
                    Toast.show({
                        type: 'error', // Match the custom toast type
                        text1: 'Invalid mobile number.',
                        text2: 'Please provide mobile number in 10 digit format to continue.',
                    });
                    return;
                }
            }
        }
        // console.log(accesslevel);
        const accesslevelArray = Array.isArray(accesslevel) ? accesslevel : String(accesslevel).split(", ");

        let accessMapping = {
            "Patient": false,
            "Appointments": false,
            "Message": false,
            "Accounts": false,
            "Reports": false,
            "Administrator": false,
            "Inventory": false,
            "LabWork": false
        };

        // Update accessMapping based on selected access levels
        accesslevelArray.forEach(level => {
            if (accessMapping.hasOwnProperty(level.trim())) {
                accessMapping[level.trim()] = true;
            }
        });
        const allAccess = Object.values(accessMapping).every(value => value === true);
        console.log("Updated accessMapping:", accessMapping);
        console.log("All Access:", allAccess);
        const todayDateTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        //console.log("todayDateTime",todayDateTime);
        const mystartTime = startTime;
        const myendTime = endTime;
        let selectedStartTime = formatSelectedDateTime(todayDateTime, mystartTime);
        let selectedEndTime = formatSelectedDateTime(todayDateTime, myendTime);
        // console.log("selectedStartTime", selectedStartTime);
        // console.log("selectedEndTime", selectedEndTime);
        let selectedSlot = extractNumber(slot);
        console.log("selectedSlot", selectedSlot)



        const isAccess = true;
        const isNotAccess = false;
        let formData = {
            providerId: "00000000-0000-0000-0000-000000000000",
            clinicID: userData.clinicID,
            providerName: drName,
            mobileNumber: mobileNumber,
            phoneNumber: null,
            email: email,
            isDel: isNotAccess,
            registrationNumber: null,
            category: null,
            isSelected: isAccess,
            displayInAppointmentsView: accessMapping.Appointments,
            showAllProviders: isAccess,
            usersDTO: {
                userID: userData.userID,
                userClinicInfoID: "00000000-0000-0000-0000-000000000000",
                clientID: userData.clinicID,
                roleID: "00000000-0000-0000-0000-000000000000",
                roleName: null,
                statusID: 0,
                userName: userData.userName,
                createdOn: todayDateTime,
                createdBy: userData.userName,
                lastUpdatedOn: todayDateTime,
                lastUpdatedBy: userData.userName,
                rCount: 0,
                displayAs: drName,
                usersAccessResultDTO: {
                    userClinicInfoID: "00000000-0000-0000-0000-000000000000",
                    userID: userData.userID,
                    clinicID: userData.clinicID,
                    clinicName: userData.clinicName,
                    roleID: "00000000-0000-0000-0000-000000000000",
                    roleName: null,
                    displayAs: drName,
                    isDeleted: false,
                    isClinicAccesss: allAccess,
                    isMyplannerAccess: isAccess,
                    isEPRAccess: isAccess,
                    isAppointmentsAccess: accessMapping.Appointments,
                    isCommunicationAccess: accessMapping.Message,
                    isBillingAccess: accessMapping.Accounts,
                    isReportsAccess: accessMapping.Reports,
                    isAdminAccess: accessMapping.Administrator,
                    isProfileLink: isAccess,
                    isInventoryAccess: accessMapping.Inventory,
                    isLabWorkAccess: accessMapping.LabWork,
                    isActive: isAccess,
                    activateDeactivateReason: null,
                    providerId: "00000000-0000-0000-0000-000000000000",
                    isUserAuthorize: isAccess,
                    isClinicAdmin: isAccess
                },
            },
            userClinicInfoID: "00000000-0000-0000-0000-000000000000",
            displayAs: drName,
            userID: userData.userID,
            isProfileLink: isAccess,
            isClinicAccesss: allAccess,
            isMyPlannerLink: isAccess,
            isClinicLink: isAccess,
            isEPRAccess: isAccess,
            isAppointmentsAccess: accessMapping.Appointments,
            isMyplannerAccess: isAccess,
            isCommunicationAccess: accessMapping.Message,
            isBillingAccess: accessMapping.Accounts,
            isReportsAccess: accessMapping.Reports,
            isAdminAccess: accessMapping.Administrator,
            isInventoryAccess: accessMapping.Inventory,
            isLabWorkAccess: accessMapping.LabWork,
            isActive: isAccess,
            providerSlotID: "00000000-0000-0000-0000-000000000000",
            startDateTime: selectedStartTime,
            endDateTime: selectedEndTime,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
            slotInterval: parseInt(selectedSlot),
            createdOn: todayDateTime,
            createdBy: userData.userName,
            lastUpdatedOn: todayDateTime,
            lastUpdatedBy: userData.userName,
            isDeleted: isNotAccess,
            iDs: [
                "00000000-0000-0000-0000-000000000000"
            ],
            colorCode: null,
            location: null,
            experience: null,
            slotDuration: selectedSlot.toString(),
            result: null,
            errorCode: null,
            errorMessage: null,
            whattodo: null,
            outUserID: "00000000-0000-0000-0000-000000000000",
            countryCode: null,
            countryDialCode: null
        }

        console.log("FormData", formData);

        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Setting/InsertProviderInfoForMobile`, formData, { headers });
            console.log(response.data);

            if (response.data.errorCode == "200" || response.data.errorCode == "100") { // Corrected condition
                Toast.show({
                    type: 'success', 
                    text1: response.data.errorMessage,
                });
                navigation.navigate('DoctorList');
            } else if (response.data.errorCode == "241") {
                Toast.show({
                    type: 'error', 
                    text1: response.data.errorMessage,
                });
                return;
            }
        } catch (error) {
          console.log(error)
        }

    }


    return (
        <SafeAreaProvider>
            {isLoading ? <Loader /> :
                <ScrollView>
                    <View style={styles.formContainer}>

                        <Stack w="100%" mx="auto" space={2}>
                            <Input
                                value={mobileNumber}
                                onChangeText={(value) => {
                                    const formattedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
                                    setmobileNumber(formattedValue);
                                }}
                                keyboardType="number-pad"
                                maxLength={10}
                                placeholder="Mobile Number"
                                size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"} />

                            <Input
                                value={drName}
                                onChangeText={(value => setdrName(value))}
                                size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={'#888888'}
                                placeholder="Dr Name"
                                marginTop={2} />


                            <Input
                                value={email}
                                onChangeText={(value) => setEmail(value)}
                                placeholder="Email" size="lg"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"} />

                            <Input
                                value={accesslevel}
                                onChangeText={(value => setAccessLevel(value))}
                                size="lg"
                                placeholder="Access level"
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"}
                                onFocus={onClickAccessLevel}
                            />
                            <Picker
                                selectedValue={startTime}
                                placeholder="Select Start Time"
                                onValueChange={(itemValue) => setStartTime(itemValue)}
                                style={{
                                    width: '100%', height: hp('7%'), borderColor: '#e0e0e0',
                                    fontFamily: 'Poppins-Regular', paddingLeft: 10,
                                    fontSize: 16,
                                    borderRadius: 5,
                                    backgroundColor: "white"
                                }}
                            >
                                {timeOptions.map((time, index) => (
                                    <Picker.Item key={index} label={time} value={time} />
                                ))}
                            </Picker>
                            <Picker
                                selectedValue={endTime}
                                placeholder="Select End Time"
                                onValueChange={(itemValue) => setEndTime(itemValue)}
                                style={{
                                    width: '100%', height: hp('7%'), borderColor: '#e0e0e0',
                                    fontFamily: 'Poppins-Regular', paddingLeft: 10,
                                    fontSize: 16,
                                    borderRadius: 5,
                                    backgroundColor: "white"
                                }}
                            >
                                {timeOptions.map((time, index) => (
                                    <Picker.Item key={index} label={time} value={time} />
                                ))}
                            </Picker>

                            <Input
                                value={slot}
                                onChangeText={(value => setSlot(value))}
                                placeholder="select slot"
                                size="lg"
                                readOnly
                                style={styles.inputFontStyle}
                                borderRadius={5}
                                placeholderTextColor={"#888888"}
                            />


                            <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                                <View>
                                    <TouchableOpacity onPress={addDoctor}>
                                        <View style={CommonStylesheet.buttonContainersaveatForm}>
                                            <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Box>

                        </Stack>
                    </View>
                </ScrollView>
            }
        </SafeAreaProvider>
    )
}

export default AddDoctor;
const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        width: '100%',
        padding: 10,
        // borderColor:'black',
        // borderWidth:2
    },
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
    imageStyle: {
        width: 200,
        height: 200,
        margin: 5,
    },
    inputFontStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#fff',
        height: height * 0.07,

    },

});