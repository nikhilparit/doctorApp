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
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../../api/Api';
//import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Loader from '../../../../components/Loader';
import { getHeaders } from '../../../../utils/apiHeaders';
import Toast from 'react-native-toast-message';


const AddMedicine = ({ route }) => {
    const navigation = useNavigation();
    //const myClinicID = route.params.clinicID;
    const [AllFrequencyData, setAllFrequencyData] = useState([]);
    const [itemTitle, setitemTitle] = useState('');
    const [dosageID, setdosageID] = useState('');
    const [AllDosageData, setAllDosageData] = useState([]);
    const [medicineName, setMedicineName] = useState('');
    const [moleculeName, setMoleculeName] = useState('');
    const [dosage, setDosage] = useState('');
    const [duration, setDuration] = useState('');
    const [myClinicID, setmyClinicID] = useState('');
    const [loading, setLoading] = useState(true);

    const readData = async () => {
        setLoading(true);
        try {
            const headers = await getHeaders();
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            setmyClinicID(user.clinicID);

            const myFormDataFrequency = {
                clinicID: user.clinicID,
                itemCategory: "Frequency",
            };

            const myFormDataDosage = {
                clinicID: user.clinicID,
                itemCategory: "Dosage",
            };

            const [frequencyResponse, dosageResponse] = await Promise.all([
                Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormDataFrequency, { headers }),
                Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormDataDosage, { headers }),
            ]);

            setAllFrequencyData(frequencyResponse.data);
            setAllDosageData(dosageResponse.data);
            console.log(dosageResponse.data);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        readData();
    }, []);

    const addMedicine = async () => {
        const headers = await getHeaders();
        const selectedFrequncyID = AllFrequencyData.filter(item => item.itemTitle == itemTitle);
        console.log("ID", selectedFrequncyID[0]);
        const selectedDosageID = AllDosageData.find(item => item.itemTitle.toString() == dosageID);
        console.log("DOSAGE ID", selectedDosageID);
        if (medicineName == '') {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Medicine Name is required.',
                text2: 'Please add medicine name to continue',
            });
            //alert('Medicine Name is required.');
            return;
        }
        if (moleculeName == '') {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Molecule Name is required.',
                text2: 'Please add molecule name to continue',
            });
            //alert('Molecule Name is required.');
            return;
        }

        // Validate frequencyID
        if (selectedFrequncyID.length === 0 || !selectedFrequncyID[0].itemID) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Frequency is required.',
                text2: 'Please select a valid Frequency.',
            });
            //alert('Please select a valid Frequency.');
            return;
        }
        // Validate dosageID
        if (!selectedDosageID) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Dosage is required.',
                text2: 'Please select a valid Dosage.',
            });
            //alert('Please select a valid Dosage.');
            return;
        }
        const formData = {
            drugId: "00000000-0000-0000-0000-000000000000",
            genericName: medicineName,
            moleculeName: moleculeName,
            lastUpdatedBy: "SYSTEM",
            lastUpdatedOn: moment().toISOString(),
            isDeleted: false,
            isFavourite: true,
            createdOn: moment().toISOString(),
            createdBy: "SYSTEM",
            flag: false,
            idForDeletion: "string",
            rowguid: "00000000-0000-0000-0000-000000000000",
            clinicID: myClinicID,
            recordCount: 0,
            dosageID: selectedDosageID ? selectedDosageID.itemTitle.toString() : '',
            frequencyID: selectedFrequncyID[0].itemID,
            frequency: itemTitle,
            duration: duration
        }
        console.log("ADD MEDICINE FORM DATA", formData);

        try {
            Axios.post(`${Api}Setting/AddMedicine`, formData, { headers }).then(resp => {
                console.log(resp.data);
                // Snackbar.show({
                //     text: 'Medicine added sucessfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                //     fontSize: 10
                // });
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Medicine added sucessfully.',
                   // text2: 'Please select a valid Dosage.',
                });
                //alert('Medicine added sucessfully.');
                navigation.navigate('MedicineList', {
                    clinicID: myClinicID
                })
            })
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {loading ? (
                <Loader />
            ) : (
                <ScrollView>
                    <View style={CommonStylesheet.container}>
                        <Stack space={2} w="100%" mx="auto" marginTop={2} padding={1}>
                            <Input
                                size="lg"
                                value={medicineName}
                                onChangeText={(value) => setMedicineName(value)}
                                placeholderTextColor={'#808080'}
                                height={height * 0.07}
                                borderRadius={5}
                                style={styles.inputPlaceholder}
                                placeholder="Medicine Name"
                            />
                            <Input
                                size="lg"
                                value={moleculeName}
                                onChangeText={(value) => setMoleculeName(value)}
                                placeholderTextColor={'#808080'}
                                height={height * 0.07}
                                borderRadius={5}
                                style={styles.inputPlaceholder}
                                placeholder="Molecule Name"
                            />
                            <Input
                                size="lg"
                                value={duration}
                                onChangeText={(value) => setDuration(value)}
                                placeholderTextColor={'#808080'}
                                height={height * 0.07}
                                borderRadius={5}
                                style={styles.inputPlaceholder}
                                placeholder="Duration"
                            />
                            <Picker
                                selectedValue={itemTitle}
                                style={styles.picker}
                                onValueChange={itemValue => setitemTitle(itemValue)}
                            >
                                <Picker.Item label="Frequency" value={null} />
                                {AllFrequencyData.map(item => (
                                    <Picker.Item label={item.itemTitle} value={item.itemTitle} key={item.id} />
                                ))}
                            </Picker>
                            <Picker
                                selectedValue={dosageID.toString()}
                                style={styles.picker}
                                onValueChange={itemValue => setdosageID(itemValue)}
                            >
                                <Picker.Item label="Dosage" value={null}/>
                                {AllDosageData.map(item => (
                                    <Picker.Item label={item.itemTitle} value={item.itemTitle.toString()} key={item.id} />
                                ))}
                            </Picker>
                        </Stack>
                    </View>
                    <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <View style={{}}>
                            <TouchableOpacity onPress={addMedicine}>
                                <View style={CommonStylesheet.buttonContainersave}>
                                    <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Box>
                </ScrollView>
            )}
        </View>
    );
};

export default AddMedicine;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
    },
    picker: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: '#fff',
        height: height * 0.07,
        borderColor: '#e0e0e0',
        paddingLeft: 10,
    },
    Text: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-SemiBold'
    },
});