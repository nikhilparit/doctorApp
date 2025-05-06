import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Input, Button, Image, Modal, Stack, Checkbox } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import { useNavigation } from '@react-navigation/native';
import moment from "moment";
import Calendar from 'react-calendar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import Api from '../../api/Api';
import { getHeaders } from '../../utils/apiHeaders';


const { height, width } = Dimensions.get('window');

const FilterFile = (myClinicID) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [groupValues, setGroupValues] = React.useState([]);
    const [today, setToday] = useState('');
    const [patient, setPatient] = useState('');
    const [all, setAll] = useState('');
    const [folderId, setfolderId] = useState([]);
    const [token, setToken] = useState('');
    const [ClinicID, setClinicid] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    const navigation = useNavigation();


    const readData = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const headers = await getHeaders();
        try {
            setToken(user.token);
            setClinicid(user.clinicID);
            const formData1 = {
                clinicID: user.clinicID,
                folderId: 0,
            };

            const response = await Axios.post(`${Api}Document/GetDocumentFolderById`, formData1, { headers });
            // //console.log('Folder ID:', response.data);
            const newData = [...response.data, {
                "clinicID": user.clinicID,
                "folderId": 99999999,
                "description": "Unassign",
            },]
            setfolderId(newData);
        } catch (error) {
            console.error('Error fetching folder ID:', error);
        }
    };


    useEffect(() => {
        readData();
    }, []);

    const onStartDateChange = (day) => {
        if (day) {
            setStartDate(day);
            setShowStartDatePicker(false);
        }
    };

    const onEndDateChange = (day) => {
        if (day) {
            setEndDate(day);
            setShowEndDatePicker(false);
        }
    };

    const handleTodayChange = (value) => {
        setToday(value);

        // Update startDate and endDate based on selected value
        const now = moment();
        switch (value) {
            case 'T': // Today
                setStartDate(now.startOf('day').toDate());
                setEndDate(now.endOf('day').toDate());
                break;
            case 'L': // Last 7 days
                setStartDate(moment().subtract(7, 'days').toDate());
                setEndDate(now.toDate());
                break;
            case 'W': // This week
                setStartDate(moment().startOf('week').toDate());
                setEndDate(moment().add(3, 'days').toDate());
                break;
            case 'M': // This month
                setStartDate(moment().startOf('month').toDate());
                setEndDate(now.endOf('month').toDate());
                break;
            case 'LW': // Last week
                setStartDate(moment().subtract(1, 'week').startOf('week').toDate());
                setEndDate(moment().subtract(1, 'week').endOf('week').toDate());
                break;
            case 'LM': // Last month
                setStartDate(moment().subtract(1, 'month').startOf('month').toDate());
                setEndDate(moment().subtract(1, 'month').endOf('month').toDate());
                break;
            case 'B': // Between
                setStartDate(now.startOf('day').toDate());
                setEndDate(now.endOf('day').toDate());
                break;
            default:
                break;
        }
    };

    //     function onFilter () {
    // //console.log('iam wotking...');
    // const passedData = {
    //     myclinicID: ClinicID,
    //     pageindex: 0,
    //     pagesize: 10,
    //     StartDate: moment(startDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    //     EndDate: moment(endDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    //     Description: all,
    // }
    //  navigation.navigate('FileList', passedData);

    //     }


    function onFilter() {
        ////console.log('Filter button clicked...');

        // Ensure necessary variables are defined
        if (!ClinicID) {
            console.error('ClinicID is undefined.');
            return Alert.alert('Error', 'Clinic ID is required.');
        }

        if (!startDate || !endDate) {
            console.error('StartDate or EndDate is undefined.');
            return Alert.alert('Error', 'Please select a valid date range.');
        }


        // Prepare the data to pass to the next screen
        const passedData = {
            myclinicID: ClinicID,
            pageindex: 0,
            pagesize: 10,
            StartDate: moment(startDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            EndDate: moment(endDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            Description: all,
            searchData: patient,
            //patientID: "00000000-0000-0000-0000-000000000000",
            isUnassigned: isCheckboxChecked ? "Y" : "N"
        };

        //console.log('Passing data to FileList:', passedData);

        // Navigate to FileList and pass the data
        navigation.navigate('FileList', {
            myclinicID: ClinicID,
            pageindex: 0,
            pagesize: 10,
            StartDate: moment(startDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            EndDate: moment(endDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            Description: all,
            searchData: patient,
            isUnassigned: isCheckboxChecked ? "Y" : "N",
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            <Modal isOpen={showStartDatePicker} onClose={() => setShowStartDatePicker(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Please select Start Date</Text></Modal.Header>
                    <Modal.Body>
                        <Calendar
                            onChange={onStartDateChange}
                            value={startDate}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showEndDatePicker} onClose={() => setShowEndDatePicker(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Please select End Date</Text></Modal.Header>
                    <Modal.Body>
                        <Calendar
                            onChange={onEndDateChange}
                            value={endDate}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <View style={{ marginTop: 5, padding: 10 }}>
                <Stack space={2} w="100%" mx="auto">
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Input
                            width={'100%'}
                            height={height * 0.07}
                            size="lg"
                            value={patient}
                            onChangeText={(value) => setPatient(value)}
                            style={styles.inputPlaceholder}
                            borderRadius={5}
                            placeholderTextColor={'#808080'}
                            placeholder="Search "
                        />
                    </View>
                    <View>
                        <Picker width={width - 15} size={'lg'}
                            style={{
                                height: height * 0.07,
                                borderColor: '#e0e0e0',
                                fontFamily: 'Poppins-Regular',
                                paddingLeft: 10,
                                fontSize: 16,
                                borderRadius: 5,
                                backgroundColor: "white"
                            }}
                            selectedValue={all}
                            onValueChange={itemValue => setAll(itemValue)}>
                            <Picker.Item label="All" value={null} color='black' />
                            {folderId.map(item => (
                                <Picker.Item label={item.description} value={item.description} key={item.folderId} />
                            ))}
                        </Picker>
                    </View>
                    {/* {['Testimonials', 'Scanned Image','Patient Reports'].includes(all) && (
                        <Checkbox
                            colorScheme="blue"
                            isChecked={isCheckboxChecked}
                            onChange={(isSelected) => setIsCheckboxChecked(isSelected)}
                            accessibilityLabel="Unassign"
                        >
                            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular' }}>Unassign</Text>
                        </Checkbox>
                    )} */}
                    {['Testimonials', 'Scanned Image', 'Patient Reports'].includes(all || '') && (
                        <Checkbox
                            colorScheme="blue"
                            isChecked={isCheckboxChecked}
                            onChange={(isSelected) => setIsCheckboxChecked(isSelected)}
                            accessibilityLabel="Unassign"
                        >
                            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular' }}>
                                Unassign
                            </Text>
                        </Checkbox>
                    )}
                    <View>
                        <Picker
                            width={width - 15}
                            size="lg"
                            style={{
                                height: height * 0.07,
                                borderColor: '#e0e0e0',
                                fontFamily: 'Poppins-Regular',
                                fontSize: 16,
                                borderRadius: 5,
                                backgroundColor: "white",
                                paddingLeft: 10
                            }}
                            selectedValue={today}
                            onValueChange={handleTodayChange}
                        >
                            <Picker.Item label="Today" value="T" />
                            <Picker.Item label="Last 7 days" value="L" />
                            <Picker.Item label="This Week" value="W" />
                            <Picker.Item label="This Month" value="M" />
                            <Picker.Item label="Last Week" value="LW" />
                            <Picker.Item label="Last Month" value="LM" />
                            <Picker.Item label="Between" value="B" />
                        </Picker>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Input
                            width={'92%'}
                            onFocus={() => setShowStartDatePicker(true)}
                            height={height * 0.07}
                            style={styles.inputPlaceholder}
                            borderRadius={5}
                            placeholderTextColor={'#888888'}
                            placeholder="Select Start Date"
                            value={moment(startDate).format('LL')}
                        />
                        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                            <Image
                                source={require('../../assets/images/calendarDash.png')}
                                alt="Start Date Picker"
                                style={{ height: 34, width: 36, borderRadius: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.text}>
                        <Text>To</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Input
                            width={'92%'}
                            onFocus={() => setShowEndDatePicker(true)}
                            height={height * 0.07}
                            style={styles.inputPlaceholder}
                            borderRadius={5}
                            placeholderTextColor={'#888888'}
                            placeholder="Select End Date"
                            value={moment(endDate).format('LL')}
                        />
                        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                            <Image
                                source={require('../../assets/images/calendarDash.png')}
                                alt="End Date Picker"
                                style={{ height: 34, width: 36, borderRadius: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                        <TouchableOpacity onPress={() =>
                            onFilter()
                        } >

                            <View style={CommonStylesheet.buttonContainerdelete}>
                                <Text style={CommonStylesheet.ButtonText}>Apply Filter</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Stack>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#A6A6A6',
        backgroundColor: '#FFFFFF',
    },
    text: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        alignItems: 'center',
        padding: 5,
    },
});

export default FilterFile;
