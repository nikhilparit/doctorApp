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
import { CommonStyle } from "../../../commonStyles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../api/Api';
import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddManageRxTemplates = ({ route }) => {
    const myClinicID = route.params.clinicID;
    //console.log(myClinicID);
    const navigation = useNavigation();
    //List of All Data
    const [AllFrequencyData, setAllFrequencyData] = useState([]);
    const [AllDosageData, setAllDosageData] = useState([]);
    const [drug, setDrug] = useState([]);
    //Handling modal
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    //Handling selected drug , freq.
    const [selectedDrug, setselectedDrug] = useState([]);
    const [providerInfo, setProviderInfo] = useState([]);
    const [groupValues, setGroupValues] = useState([]);
    //handling dosage, frequncy, duration
    const [drugID, setDrugID] = useState('');
    const [dosageID, setdosageID] = useState('20 mg');
    const [frequency, setfrequency] = useState("1-0-0");
    const [duration, setduration] = useState("2 Days");

    const [itemTitle, setitemTitle] = useState("");
    const [frequencyID, setfrequencyID] = useState(0);
    const [dosage, setdosage] = useState("1 ml");

    //handle userInput
    const [name, setName] = useState('');
    const [user, setUser] = useState('');

    const readData = async () => {
        const mobile = await AsyncStorage.getItem('mobileNumber');
        //console.log("USER",mobile);
        setUser(mobile);
        const myFormData = {
            clinicID: myClinicID,
            itemCategory: "Frequency"
        }
        //console.log("Frequency Form Data", myFormData);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormData).then(resp => {
                //console.log("Frequency Data", resp.data);
                setAllFrequencyData(resp.data);
            })
        } catch (error) {
            //console.log(error.message);
        }
        const myFormData1 = {
            clinicID: myClinicID,
            itemCategory: "Dosage"
        }
        //console.log("Dosage Form Data", myFormData);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormData1).then(resp => {
                //console.log("Dosage Data", resp.data);
                setAllDosageData(resp.data);
            })
        } catch (error) {
            //console.log(error.message);
        }
        const formData =
        {
            applicationDTO: {
                clinicID: myClinicID,
            }
        }
        try {
            Axios.post(`${Api}patient/GetProviderInfo`, formData).then(resp => {
                //console.log('Provider Info', resp.data);
                setProviderInfo(resp.data);
            });
        } catch (error) {
            //console.log(error.message);
        }
        const formData1 = {
            clinicID: myClinicID,
            genericName: null
        }
        try {
            Axios.post(`${Api}Patient/GetDrugInfo`, formData1).then(resp => {
                //console.log(resp.data);
                setDrug(resp.data);
            })
        } catch (error) {
            //console.log(error.message);
        }
    }
    useEffect(() => {
        readData()
    }, []);

    const openModal = () => {
        //setSelectedComplaint([]);
        setShowModal(true);
    }
    const handleCheckBox = () => {
        //console.log(groupValues);
        const data = [];

        for (let i = 0; i < groupValues.length; i++) {
            const id = groupValues[i];
            // Find the corresponding author information
            const author = drug.find(item => item.drugId === id);
            if (author) {
                data.push(author);
            }
        }
        //console.log("FINAL DATA TO ADD", data);
        setselectedDrug(data);
        setShowModal(false);
    }
    const openModal1 = (id) => {
        //console.log('Selected DrugID', id);
        setDrugID(id);
        setShowModal1(true);
    }
    // const changeValues = (changes) => {
    //     console.log(drugID, frequency, duration, dosageID);
    //     const selectedFreqID = AllFrequencyData.find(item => item.itemTitle === frequency);
    //     console.log(selectedFreqID);
    //     // Create a copy of the original array
    //     const newArray = selectedDrug.map(obj => ({
    //         ...obj,
    //         frequency: selectedFreqID.itemTitle,
    //         frequencyID: selectedFreqID.itemID,
    //         duration: duration,
    //         dosageID: dosageID
    //     }));

    //     console.log("SELECTED ARRAY", newArray);

    //     // Apply each change to the array
    //     changes.forEach(({ propertyName, newValue }) => {
    //         const index = newArray.findIndex(obj => obj.drugID === drugID);
    //         if (index !== -1) {
    //             newArray.frequency = frequency;
    //             newArray.frequencyID = dosageID;
    //             newArray.duration = duration;
    //             newArray.dosageID = dosageID
    //         }
    //     });
    //     console.log('NEW ARRAY', newArray);
    //     setselectedDrug(newArray)
    //     setShowModal1(false);
    // };
    const changeValues = (changes, drugID, frequency, duration, dosageID) => {
        console.log(changes, drugID);
        const selectedFreqID = AllFrequencyData.find(item => item.itemTitle === frequency);
        console.log("FreqID", selectedFreqID.itemID);
        console.log('SELECTED DRUG', selectedDrug)
        const indexToUpdate = selectedDrug.findIndex(item => item.drugId === drugID);
        console.log('INDEX TO UPDATE', indexToUpdate);

        // If the drugID is not found, you can handle the error accordingly.
        if (indexToUpdate === -1) {
            console.error("Drug ID not found in the 'changes' array.");
            return;
        }

        // Step 2: Create a new object with updated values
        const updatedObject = {
            ...selectedDrug[indexToUpdate],
            frequency: frequency,
            duration: duration,
            dosageID: dosageID,
        };

        // Step 3: Create a new array with the updated object at the correct index
        const updatedArray = [
            ...selectedDrug.slice(0, indexToUpdate),
            updatedObject,
            ...selectedDrug.slice(indexToUpdate + 1),
        ];
        console.log(updatedArray);
        // Step 4: Update the state variable (selectedDrug) with the new array
        setselectedDrug(updatedArray);
        setShowModal1(false);
    };
    const addTemplate = () => {
        if (name == '') {
            Snackbar.show({
                text: 'Name is required.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                fontFamily: 'Poppins-Medium',
                fontSize: 10
            });
            return;
        }
        //console.log("SELECTED DRUG", selectedDrug);
        const formData = {
            prescriptionTemplateMasterID: "00000000-0000-0000-0000-000000000000",
            clinicId: myClinicID,
            templateCount: 0,
            prescriptionTemplateName: name,
            prescriptionTemplateDesc: name,
            isDeleted: false,
            createdOn: moment().toISOString(),
            createdBy: user,
            lastUpdatedOn: moment().toISOString(),
            lastUpdatedBy: user,
            prescriptionTemplateDTOList: [],
            key: "insert",
            prescriptionNote: "Testing",
        };
        if (selectedDrug && selectedDrug.length > 0) {
            for (let i = 0; i < selectedDrug.length; i++) {
                let arrObj = {
                    prescriptionTemplateID: "00000000-0000-0000-0000-000000000000",
                    clinicId: myClinicID,
                    templateName: name,
                    medicineId: selectedDrug[i].drugId,
                    medicineName: selectedDrug[i].genericName,
                    frequencyId: selectedDrug[i].frequencyID,
                    frequency: selectedDrug[i].frequency,
                    dosage: selectedDrug[i].dosageID,
                    prescriptionNote: "testing",
                    duration: selectedDrug[i].duration,
                    drugNote: "Before Meal",
                    isDeleted: false,
                    createdOn: moment().toISOString(),
                    createdBy: user,
                    lastUpdatedOn: moment().toISOString(),
                    lastUpdatedBy: user,
                    prescriptionTemplateMasterID: "00000000-0000-0000-0000-000000000000",
                    sequence: 0
                }
                formData.prescriptionTemplateDTOList.push(arrObj)
            }
        }
        console.log("ADD TEMPLATE", formData);
        try {
            Axios.post(`${Api}Setting/InsertUpdateDeletePrescriptionTemplateMaster`,formData).then(resp=>{
                console.log(resp.data);
                navigation.navigate('ManageRxTemplatesList',{
                    clinicID:myClinicID
                });
                Snackbar.show({
                    text: 'New Template added sucessfully.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 10
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStyle.backgroundimage}>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content width={350} height={500}>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={{
                        fontSize: 14,
                        color: '#5f6067',
                        fontFamily: 'Poppins-Bold',
                    }}>Drugs Name</Text></Modal.Header>
                    <Modal.Body>
                        <View style={{ paddingHorizontal: 15, marginTop: 5 }}>

                            <Checkbox.Group onChange={setGroupValues} value={groupValues}>
                                {drug.map(item =>
                                    <Checkbox value={item.drugId} my="1" marginBottom={4} key={item.drugId}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#5f6067',
                                            fontFamily: 'Poppins-Medium',
                                        }}>{item.genericName}</Text>
                                    </Checkbox>
                                )}
                            </Checkbox.Group>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => handleCheckBox()}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
                <Modal.Content width={300} height={380}>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={{
                        fontSize: 14,
                        color: '#5f6067',
                        fontFamily: 'Poppins-Bold',
                    }}>Select Frequency, Duration</Text></Modal.Header>
                    <Modal.Body>
                        <Select selectedValue={frequency} width={270}
                            placeholderTextColor={'#808080'}
                            fontSize={14}
                            fontFamily={'Poppins-Regular'}
                            //opacity={0.5}
                            bgColor={'#FFFFF'}
                            borderRadius={10}
                            accessibilityLabel="Choose Frequency" placeholder="Frequency" _selectedItem={{
                                bg: "#2196f3",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setfrequency(itemValue)}>
                            {AllFrequencyData.map(item => (
                                <Select.Item label={item.itemTitle} value={item.itemTitle} key={item.itemTitle} />
                            ))}
                        </Select>
                        <View>
                            <Select selectedValue={dosageID} width={270}
                                placeholderTextColor={'#808080'}
                                fontSize={14}
                                fontFamily={'Poppins-Regular'}
                                //opacity={0.5}
                                bgColor={'#FFFFF'}
                                borderRadius={10}
                                accessibilityLabel="Choose Dosage" placeholder="Choose Dosage" _selectedItem={{
                                    bg: "#2196f3",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setdosageID(itemValue)}>
                                {AllDosageData.map(item => (
                                    <Select.Item label={item.itemTitle} value={item.itemTitle} />
                                ))}
                            </Select>
                        </View>
                        <View>
                            <Input size="lg" marginTop={2} value={duration} onChangeText={(val) => setduration(val)} style={[styles.inputPlaceholder,]} borderRadius={10} placeholderTextColor={'#808080'} placeholder="Duration" />
                        </View>
                        <View>
                            <Input size="lg" marginTop={2} style={styles.inputPlaceholder} borderRadius={10} placeholderTextColor={'#808080'} placeholder="Note" />
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal1(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() =>
                                // changeValues([
                                //     { drugID: drugID, frequency: frequency, frequencyID: frequencyID, dosageID: dosageID }
                                // ])
                                changeValues(
                                    [
                                        { propertyName: 'frequency', newValue: frequency },
                                        { propertyName: 'duration', newValue: duration },
                                        { propertyName: 'dosageID', newValue: dosageID }
                                    ],
                                    drugID,
                                    frequency,
                                    duration,
                                    dosageID
                                )
                            }>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <ScrollView>
                <View style={CommonStyle.container}>
                    <Stack space={2} w="96%" maxW="500px" mx="auto" marginTop={2}>
                        <Input size="lg" value={name} onChangeText={(value) => setName(value)} placeholderTextColor={'#808080'} style={styles.inputPlaceholder} placeholder="Name" />
                        <Input size="lg" placeholderTextColor={'#808080'} style={styles.inputPlaceholder} placeholder="Add Medicine" onFocus={() => openModal()} />
                    </Stack>
                </View>
                <View style={{ marginTop: 20 }}>
                    {selectedDrug.length != 0 ?
                        <View style={{ flexDirection: 'row', marginLeft: 5, backgroundColor: 'gray', marginTop: -1, justifyContent: 'space-between' }}>

                            <Text style={{ color: '#fff', fontFamily: 'Poppins-Regular', fontSize: 14 }}>Medicine</Text>

                            <Text style={{ color: '#fff', fontFamily: 'Poppins-Regular', fontSize: 14 }}>Dosage</Text>

                            <Text style={{ color: '#fff', fontFamily: 'Poppins-Regular', fontSize: 14 }}>Frequency</Text>

                            <Text style={{ color: '#fff', fontFamily: 'Poppins-Regular', fontSize: 14 }}>Duration</Text>

                            <Text style={{ color: '#fff', fontFamily: 'Poppins-Regular', fontSize: 14 }}>Action</Text>
                        </View> :
                        null
                    }
                    {selectedDrug.map(item =>
                        <TouchableOpacity onPress={() => openModal1(item.drugId)}>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 5, backgroundColor: "#fff", justifyContent: 'space-between' }}>

                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>{item.genericName}</Text>

                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>{item.dosageID}</Text>

                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>{item.frequency}</Text>

                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>{item.duration}</Text>

                                <Icon name='chevron-right'
                                    size={12}
                                    style={{ marginTop: 5, marginRight: 5 }} />

                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <View style={{}}>
                        <TouchableOpacity onPress={() => addTemplate()}>
                            <View style={CommonStyle.buttonContainersave}>
                                <Text style={CommonStyle.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Box>
            </ScrollView>
        </ImageBackground>
    );
};

export default AddManageRxTemplates;

const styles = StyleSheet.create({
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

    inputPlaceholder: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
    },
    Text: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-SemiBold'
    },

});