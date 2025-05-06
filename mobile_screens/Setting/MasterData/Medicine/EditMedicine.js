import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Input, Text, Box, Stack, Button, Modal } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../../api/Api';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonStylesheet from '../../../../common_stylesheet/CommonStylesheet';
import Loader from '../../../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import { getHeaders } from '../../../../utils/apiHeaders';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

const EditMedicine = ({ route }) => {
    const navigation = useNavigation();
    //const myClinicID = route.params.clinicID;
    const myDrugID = route.params.drugID;
    const [AllFrequencyData, setAllFrequencyData] = useState([]);
    const [itemTitle, setitemTitle] = useState('');
    const [dosageID, setdosageID] = useState('');
    const [AllDosageData, setAllDosageData] = useState([]);
    const [medicineName, setMedicineName] = useState('');
    const [moleculeName, setMoleculeName] = useState('');
    const [duration, setDuration] = useState('');
    const [myClinicID, setmyClinicID] = useState('');
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const [loading, setLoading] = useState(true);

    const readData = async () => {
        try {
            const headers = await getHeaders();
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            setmyClinicID(user.clinicID);

            const formData = {
                clinicID: user.clinicID,
                itemCategory: "Frequency"
            };
            const formData1 = {
                clinicID: user.clinicID,
                itemCategory: "Dosage"
            };
            const formData2 = {
                clinicID: user.clinicID
            };

            const [frequencyResp, dosageResp, medicineResp] = await Promise.all([
                Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formData, { headers }),
                Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formData1, { headers }),
                Axios.post(`${Api}Setting/GetAllMedicine`, formData2, { headers })
            ]);
            console.log(formData2, 'get');
            setAllFrequencyData(frequencyResp.data);
            setAllDosageData(dosageResp.data);

            const selectedMedicine = medicineResp.data.find(item => item.drugId === myDrugID);
            if (selectedMedicine) {
                const {
                    genericName,
                    moleculeName,
                    duration,
                    frequency,
                    dosageID
                } = selectedMedicine;
                setMedicineName(genericName);
                setMoleculeName(moleculeName);
                setDuration(duration);
                setitemTitle(frequency);
                setdosageID(dosageID);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        readData();
    }, []);

    const editMedicine = async () => {
        const headers = await getHeaders();
        try {
            const selectedFrequency = AllFrequencyData.find(item => item.itemTitle === itemTitle);
            const selectedDosage = AllDosageData.find(item => item.itemTitle.toString() === dosageID);
            console.log("selectedFrequency",selectedFrequency);
            console.log("selectedDosage",selectedDosage);
            
            if (!medicineName) {
                Toast.show({
                    type: 'error', // Match the custom toast type
                    text1: 'Medicine name is required.',
                    text2: 'Please add medicine name to continue',
                });
                return;
            }
            const formData = {
                drugId: myDrugID,
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
                dosageID: selectedDosage ? selectedDosage.itemTitle.toString() : '',
                frequencyID: selectedFrequency ? selectedFrequency.itemID : '',
                frequency: itemTitle,
                duration: duration
            };
            //console.log("Selected Dosage:", selectedDosage);
            await Axios.post(`${Api}Setting/UpdateMedicine`, formData, { headers });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Medicine edited successfully.',
            });
            //alert('Medicine edited successfully.');
            navigation.navigate('MedicineList', { clinicID: myClinicID });
        } catch (error) {
            console.error(error.message);
        }
    };

    const deleteMedicine = async () => {
        try {
            const headers = await getHeaders();
            const formData = {
                drugId: myDrugID,
                lastUpdatedBy: "SYSTEM",
                clinicID: myClinicID
            };

            await Axios.post(`${Api}Setting/DeleteMedicine`, formData, { headers });
             Toast.show({
                            type: 'error', // Match the custom toast type
                            text1: 'Medicine deleted successfully.',
                        });
            navigation.navigate('MedicineList', { clinicID: myClinicID });
        } catch (error) {
            console.error(error.message);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            <ScrollView>
                <View style={CommonStylesheet.container}>
                    <Stack space={2} w="100%" mx="auto" marginTop={2} padding={1}>
                        <Input
                            size="lg"
                            height={height * 0.07}
                            borderRadius={5}
                            value={medicineName}
                            onChangeText={setMedicineName}
                            placeholderTextColor={'#808080'}
                            style={styles.inputPlaceholder}
                            placeholder="Medicine Name"
                        />
                        <Input
                            size="lg"
                            height={height * 0.07}
                            borderRadius={5}
                            value={moleculeName}
                            onChangeText={setMoleculeName}
                            placeholderTextColor={'#808080'}
                            style={styles.inputPlaceholder}
                            placeholder="Molecule Name"
                        />
                        <Input
                            size="lg"
                            height={height * 0.07}
                            borderRadius={5}
                            value={duration}
                            onChangeText={setDuration}
                            placeholderTextColor={'#808080'}
                            style={styles.inputPlaceholder}
                            placeholder="Duration"
                        />
                        <Picker
                            selectedValue={itemTitle}
                            style={styles.picker}
                            onValueChange={setitemTitle}
                        >
                            <Picker.Item label="Frequency" value={null} enabled={false} />
                            {AllFrequencyData.map(item => (
                                <Picker.Item label={item.itemTitle} value={item.itemTitle} key={item.id} />
                            ))}
                        </Picker>
                        <Picker
                            selectedValue={dosageID}
                            style={styles.picker}
                            onValueChange={setdosageID}
                        >
                            <Picker.Item label="Dosage" value={null} enabled={false} />
                            {AllDosageData.map(item => (
                                <Picker.Item label={item.itemTitle} value={item.itemTitle.toString()} key={item.id} />
                            ))}
                        </Picker>
                    </Stack>
                </View>
                <Box style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity onPress={editMedicine}>
                            <View style={CommonStylesheet.buttonContainersave}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginRight: 20 }}>
                        <TouchableOpacity onPress={() => setconfirmationWindow(true)}>
                            <View style={CommonStylesheet.buttonContainerdelete}>
                                <Text style={CommonStylesheet.ButtonText}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Box>
            </ScrollView>
            <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <Text style={{ fontFamily: "poppins-regular" }}>Are you sure you want to delete this record?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity onPress={() => {
                            setconfirmationWindow(false);
                        }}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}>  No</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deleteMedicine}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                            </View>
                        </TouchableOpacity>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </View>
    );
};

export default EditMedicine;

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
        borderRadius: 5,
    },
    Text: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-SemiBold'
    },
});
