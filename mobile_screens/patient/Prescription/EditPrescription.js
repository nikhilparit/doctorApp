import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, } from 'react-native';
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
    Checkbox,
    Modal

} from 'native-base';
//common styles
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Searchbar } from 'react-native-paper';
import Axios from 'axios';
import Api from '../../../api/Api';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeaders } from '../../../utils/apiHeaders';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';

//import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
const regularFontSize = width < 600 ? 14 : 16;//jyo6
const ICON_SIZE = Math.min(width, height) * 0.04;

const EditPrescription = ({ route }) => {
    const mypatientID = route.params.patientID;
    // const myclinicID = route.params.clinicID;
    const myprescriptionID = route.params.patientPrescriptionID;
    // ////console.log(myprescriptionID);
    const navigation = useNavigation();
    const [groupValues, setGroupValues] = React.useState([]);
    const [service, setService] = React.useState("");
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [drug, setDrug] = useState([]);
    const [drugID, setDrugID] = useState('');
    const [selectedDrug, setselectedDrug] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [AllFrequencyData, setAllFrequencyData] = useState([]);
    const [AllDosageData, setAllDosageData] = useState([]);
    //user-input
    const [GetPrescriptionByID, setGetPrescriptionByID] = useState([]);
    const [provider, setProvider] = useState([]);
    const [providerName, setproviderName] = useState('');
    const [prescriptionNote, setNotes] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [dosageID, setdosageID] = useState('5ml');
    const [itemTitle, setitemTitle] = useState("1-1-1");
    const [frequencyID, setfrequencyID] = useState(0);

    const [frequency, setfrequency] = useState("");
    const [duration, setduration] = useState("2 Days");
    const [dosage, setdosage] = useState("1 ml");
    const [drugNote, setdrugnote] = useState('');
    const [drugName, setDrugName] = useState('');
    const [userName, setuserName] = useState('');
    const [token, setToken] = useState('');
    const [MedicalNotes, setMedicalNotes] = useState([]);
    const [myclinicID, setmyclinicID] = useState('');
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const [loading, setLoading] = useState(false);
    // const onChangeDate = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     ////console.log(currentDate);
    //     setDate(currentDate);
    //     setShow(false);
    // };
    const onChangeDate = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
            ////console.log(formattedDate);
            setModalVisible(false);
            setDate(moment(formattedDate));
        }
    };
    const showDatepicker = () => {
        setShow(true);
    };

    const openModal = () => {
        setShowModal(true);
        const selectedIDs = GetPrescriptionByID.map(item => item.drugID);
        setGroupValues(selectedIDs);

    };

    const handleCheckBox = () => {
        // Convert current prescription list into a map for quick lookup
        const existingDataMap = new Map(GetPrescriptionByID.map(item => [item.drugID, item]));

        // Get the common patientPrescriptionID from the first existing record (if available)
        const commonPatientPrescriptionID = GetPrescriptionByID.length > 0 ? GetPrescriptionByID[0].patientPrescriptionID : "";

        // Create the updated list based on checked values
        const updatedList = groupValues.map(id => {
            // If drug is already present, keep the existing data
            if (existingDataMap.has(id)) {
                return existingDataMap.get(id);
            }

            // Find the drug details from the available list
            const drugItem = drug.find(item => item.drugId === id);
            if (!drugItem) return null; // Skip if not found

            // Construct the new drug object with full details
            return {
                patientPrescriptionID: commonPatientPrescriptionID,
                clinicID: "",
                patientID: drugItem.patientID || "",
                providerID: drugItem.providerID || "",
                providerName: drugItem.providerName || "",
                prescriptionNote: "",
                dateOfPrescription: "",
                dtOfPrescription: null,
                nextFollowUp: null,
                investigationAdvisedIDCSV: null,
                patientInvestigationID: "",
                isDeleted: false,
                createdOn: null,
                createdBy: null,
                lastUpdatedOn: "",
                lastUpdatedBy: "",
                rowguid: "",
                isFolloupSMSRequired: false,
                registrationNumber: "",
                patientDrugsPrescriptionsID: "00000000-0000-0000-0000-000000000000",
                drugID: id, // Ensure correct drug ID is assigned
                drugName: drugItem.genericName || drugItem.drugName,
                frequencyID: drugItem.frequencyID || 1,// Default frequency
                frequency: drugItem.frequency || null,
                dosageID: drugItem.dosageID || "100mg", // Default dosage
                patientDrugDTO: null,
                duration: drugItem.duration || "1 Day", // Default duration
                lookUpsDTO: null,
                drugNote: drugItem.drugNote || "",
                genericName: drugItem.genericName || drugItem.drugName,
                itemTitle: drugItem.itemTitle || "0-0-1",
                iDs: null,
                flag: false,
                patientDrugPrescriptionDTOList: null,
                patientInvestigationDTO: null,
                patientDrugPrescriptionDTOListString: null,
                patientInvestigationDTOString: null,
                clinicDTO: null,
                printYN: null,
                whatapplink: null
            };
        }).filter(item => item !== null); // Remove null values

        // Update the state with the final list
        setGetPrescriptionByID(updatedList);
        setselectedDrug(updatedList);
        setShowModal(false);

        //console.log("Updated List:", updatedList);
    };

    const openModal1 = (id, drugName, dosageID, itemTitle, duration) => {
        ////console.log('Selected DrugID', id, drugName, dosageID, itemTitle, duration);
        setDrugID(id);
        setdosageID(dosageID);
        setitemTitle(itemTitle);
        setduration(duration);
        setDrugName(drugName);
        setShowModal1(true);
    }
    const readData = async () => {
        setLoading(true); // Start loader
    
        try {
            const headers = await getHeaders();
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
    
            setuserName(user.userName);
            setmyclinicID(user.clinicID);
    
            const myFormData = {
                clinicID: user.clinicID,
                itemCategory: "Frequency"
            };
    
            // Wait for API calls one by one
            const frequencyResponse = await Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormData, { headers });
            setAllFrequencyData(frequencyResponse.data);
    
            const myFormData1 = {
                clinicID: user.clinicID,
                itemCategory: "Dosage"
            };
    
            const dosageResponse = await Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormData1, { headers });
            setAllDosageData(dosageResponse.data);
    
            const providerFormData = {
                applicationDTO: {
                    clinicID: user.clinicID,
                }
            };
    
            const providerResponse = await Axios.post(`${Api}patient/GetProviderInfo`, providerFormData, { headers });
            setProvider(providerResponse.data);
    
            const prescriptionFormData = {
                patientPrescriptionID: myprescriptionID,
                clinicID: user.clinicID
            };
    
            const prescriptionResponse = await Axios.post(`${Api}Patient/GetPrescriptionByID`, prescriptionFormData, { headers });
            setGetPrescriptionByID(prescriptionResponse.data);
    
            if (prescriptionResponse.data.length > 0) {
                const { providerName, prescriptionNote, drugNote } = prescriptionResponse.data[0];
                setproviderName(providerName);
                setNotes(prescriptionNote);
                setdrugnote(drugNote);
            }
    
            const drugFormData = {
                clinicID: user.clinicID,
                genericName: null
            };
    
            const drugResponse = await Axios.post(`${Api}Patient/GetDrugInfo`, drugFormData, { headers });
            setDrug(drugResponse.data);
    
            const medicalNotesFormData = {
                clinicID: user.clinicID,
                itemCategory: "Medicine Notes"
            };
    
            const medicalNotesResponse = await Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, medicalNotesFormData, { headers });
            setMedicalNotes(medicalNotesResponse.data);
    
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false); // Stop loader only after all requests finish
        }
    };
    
    useEffect(() => {
        readData();
    }, []);
    
    const changeValues = (changes) => {
        //////console.log(frequency, duration, dosage);
        ////console.log(drugID, itemTitle, frequencyID, dosageID, duration);
        const selectedFreqID = AllFrequencyData.filter(item => item.itemTitle === itemTitle);
        ////console.log(selectedFreqID[0].itemID);
        // Create a copy of the original array
        const newArray = [...GetPrescriptionByID];
        // Apply each change to the array
        changes.forEach(({ propertyName, newValue }) => {
            const index = newArray.findIndex(obj => obj.drugID === drugID);
            if (index !== -1) {
                newArray[index] = { ...newArray[index], itemTitle, frequencyID: selectedFreqID[0].itemID, dosageID, duration }
            }
        });

        ////console.log('NEW ARRAY', newArray);
        setGetPrescriptionByID(newArray);
        setselectedDrug(newArray);
        setShowModal1(false);
    };

    const editPrescription = async () => {
        const headers = await getHeaders();
        ////console.log("Before Editing", GetPrescriptionByID);
        ////console.log(providerName);
        ////console.log(selectedDrug);
        const providerID = provider.filter(item => item.providerName == providerName);
        ////console.log("ProviderID", providerID[0].providerID);
        ////console.log("Date", date.toISOString());
        ////console.log("selected drug", groupValues.toString());
        if (selectedDrug.length == 0) {
            ////console.log("INTO IF CONDITION", [...GetPrescriptionByID]);
            const formData =
            {
                patientPrescriptionID: myprescriptionID,
                clinicID: myclinicID,
                patientID: mypatientID,
                providerID: providerID[0].providerID,
                providerName: null,
                prescriptionNote: prescriptionNote,
                dateOfPrescription: date.toISOString(),
                dtOfPrescription: date.toISOString(),
                nextFollowUp: date.toISOString(),
                investigationAdvisedIDCSV: null,
                patientInvestigationID: "00000000-0000-0000-0000-000000000000",
                isDeleted: false,
                createdOn: date.toISOString(),
                createdBy: userName,
                lastUpdatedOn: date.toISOString(),
                lastUpdatedBy: userName,
                patientDrugPrescriptionDTOList: [],
            }
            if (GetPrescriptionByID && GetPrescriptionByID.length > 0) {
                for (let i = 0; i < GetPrescriptionByID.length; i++) {
                    let arrObj = {
                        patientDrugsPrescriptionsID: GetPrescriptionByID[i].patientDrugsPrescriptionsID,
                        patientPrescriptionID: myprescriptionID,
                        drugID: GetPrescriptionByID[i].drugID,
                        drugName: GetPrescriptionByID[i].genericName,
                        frequencyID: GetPrescriptionByID[i].frequencyID,
                        frequency: GetPrescriptionByID[i].itemTitle,
                        dosageID: GetPrescriptionByID[i].dosageID,
                        duration: GetPrescriptionByID[i].duration,
                        patientDrugDTO: {
                            drugId: "00000000-0000-0000-0000-000000000000",
                            genericName: null,
                            moleculeName: null,
                            contraindications: null,
                            interactions: null,
                            adverseEffects: null,
                            overdozeManagement: null,
                            precautions: null,
                            patientAlerts: null,
                            otherInfo: null,
                            lastUpdatedBy: userName,
                            lastUpdatedOn: date.toISOString(),
                            isDeleted: false,
                            isFavourite: false,
                            createdOn: date.toISOString(),
                            createdBy: userName,
                            flag: false,
                            idForDeletion: null,
                            rowguid: "00000000-0000-0000-0000-000000000000",
                            clinicID: "00000000-0000-0000-0000-000000000000",
                            recordCount: 0,
                            dosageID: null,
                            frequencyID: GetPrescriptionByID[i].frequencyID,
                            frequency: GetPrescriptionByID[i].itemTitle,
                            duration: null
                        },
                        drugNote: drugNote
                    }
                    formData.patientDrugPrescriptionDTOList.push(arrObj)
                }
            }
            //////console.log("Edit Prescription FormData If Condition", formData);
            try {
                Axios.post(`${Api}Patient/InsertUpdatePatientPrescription`, formData, { headers }).then(resp => {
                    ////console.log(resp.data);
                    // Snackbar.show({
                    //     text: 'Edit presciption sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'Edit presciption sucessfully.',
                        //text2: 'Please select patient to continue.',
                    });
                    //alert('Edit presciption sucessfully.');
                    navigation.goBack('Prescription', {
                        clinicID: myclinicID,
                        patientID: mypatientID
                    });
                })
            } catch (error) {
                ////console.log(error.message);
            }

            return
        }

        const formData =
        {
            patientPrescriptionID: myprescriptionID,
            clinicID: myclinicID,
            patientID: mypatientID,
            providerID: providerID[0].providerID,
            providerName: null,
            prescriptionNote: prescriptionNote,
            dateOfPrescription: date.toISOString(),
            dtOfPrescription: date.toISOString(),
            nextFollowUp: date.toISOString(),
            investigationAdvisedIDCSV: null,
            patientInvestigationID: "00000000-0000-0000-0000-000000000000",
            isDeleted: false,
            createdOn: date.toISOString(),
            createdBy: userName,
            lastUpdatedOn: date.toISOString(),
            lastUpdatedBy: userName,
            patientDrugPrescriptionDTOList: [],
        }
        if (selectedDrug && selectedDrug.length > 0) {
            for (let i = 0; i < selectedDrug.length; i++) {
                let arrObj = {
                    patientDrugsPrescriptionsID: selectedDrug[i].patientDrugsPrescriptionsID,
                    patientPrescriptionID: myprescriptionID,
                    drugID: selectedDrug[i].drugID,
                    drugName: selectedDrug[i].genericName,
                    frequencyID: selectedDrug[i].frequencyID,
                    frequency: selectedDrug[i].itemTitle,
                    dosageID: selectedDrug[i].dosageID,
                    duration: selectedDrug[i].duration,
                    patientDrugDTO: {
                        drugId: "00000000-0000-0000-0000-000000000000",
                        genericName: null,
                        moleculeName: null,
                        contraindications: null,
                        interactions: null,
                        adverseEffects: null,
                        overdozeManagement: null,
                        precautions: null,
                        patientAlerts: null,
                        otherInfo: null,
                        lastUpdatedBy: userName,
                        lastUpdatedOn: date.toISOString(),
                        isDeleted: false,
                        isFavourite: false,
                        createdOn: date.toISOString(),
                        createdBy: userName,
                        flag: false,
                        idForDeletion: null,
                        rowguid: "00000000-0000-0000-0000-000000000000",
                        clinicID: "00000000-0000-0000-0000-000000000000",
                        recordCount: 0,
                        dosageID: null,
                        frequencyID: selectedDrug[i].frequencyID,
                        frequency: selectedDrug[i].itemTitle,
                        duration: null
                    },
                    drugNote: drugNote
                }
                formData.patientDrugPrescriptionDTOList.push(arrObj)
            }
        }
        //////console.log("Edit Prescription FormData", formData);
        try {
            Axios.post(`${Api}Patient/InsertUpdatePatientPrescription`, formData, { headers }).then(resp => {
                ////console.log(resp.data);
                // Snackbar.show({
                //     text: 'Edit presciption sucessfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                //     fontSize: 10
                // });
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Edit presciption sucessfully.',
                    //text2: 'Please select patient to continue.',
                });
                //alert('Edit presciption sucessfully.');
                navigation.goBack('Prescription', {
                    clinicID: myclinicID,
                    patientID: mypatientID
                });
            })
        } catch (error) {
            ////console.log(error.message);
        }

    }
    const deletePrescription = async () => {
        const headers = await getHeaders();
        const formData =
            [
                {
                    patientPrescriptionID: myprescriptionID,
                }
            ]
        ////console.log("delete Notes FormData", formData);

        try {
            Axios.post(`${Api}Patient/DeletePrescription`, formData, { headers }).then(resp => {
                ////console.log(resp.data);
                if (resp.data) {
                    // Snackbar.show({
                    //     text: ' prescription deleted sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'Presciption deleted sucessfully.',
                        //text2: 'Please select patient to continue.',
                    });
                    // alert(' prescription deleted sucessfully.')
                    navigation.goBack('prescription', {
                        clinicID: myclinicID,
                        patientID: mypatientID
                    });
                }
            })
        } catch (error) {
            ////console.log(error.message);
        }
    }

    const onChangeSearch = query => {
        ////console.log(query);
        setSearchQuery(query);
    }
    return (

        // <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {loading ? <Loader /> :
                <>
                    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Please select Date</Text></Modal.Header>
                            <Modal.Body>
                                <Calendar
                                    onChange={onChangeDate}
                                    value={date}
                                    maxDate={new Date()}
                                />
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>

                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <Modal.Content width={350} height={400}>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Drugs Name</Text></Modal.Header>

                            <Modal.Body>
                                {/* <Searchbar
                            placeholder="Search"
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                        /> */}
                                <View style={{ paddingHorizontal: 15, marginTop: 5 }}>

                                    <Checkbox.Group onChange={setGroupValues} value={groupValues}>
                                        {drug.map(item =>
                                            <Checkbox value={item.drugId} my="1" marginBottom={4} key={item.drugId} colorScheme="blue">
                                                <Text style={{ fontFamily: "poppins-regular" }}>{item.genericName}</Text>
                                            </Checkbox>
                                        )}
                                    </Checkbox.Group>
                                </View>
                            </Modal.Body>
                            <Modal.Footer>
                                <TouchableOpacity onPress={() => {
                                    setShowModal(false);
                                }}>
                                    <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                        <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleCheckBox()}>
                                    <View style={CommonStylesheet.buttonContainersave1}>
                                        <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>

                    <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
                        <Modal.Content width={300} height={380}>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>{drugName}</Text></Modal.Header>
                            <Modal.Body>
                                <Select selectedValue={itemTitle} width={270}
                                    placeholderTextColor={'#808080'}
                                    fontSize={regularFontSize}
                                    fontFamily={'Poppins-Regular'}
                                    //opacity={0.5}
                                    bgColor={'#FFFFF'}
                                    borderRadius={10}
                                    accessibilityLabel="Choose Frequency" placeholder="Frequency" _selectedItem={{
                                        bg: "#2196f3",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1} onValueChange={itemValue => setitemTitle(itemValue)}>
                                    {AllFrequencyData.map(item => (
                                        <Select.Item label={item.itemTitle} value={item.itemTitle} />
                                    ))}
                                </Select>
                                <View style={Styles.inputModal}>
                                    <Select selectedValue={dosageID} width={270}
                                        placeholderTextColor={'#808080'}
                                        fontSize={regularFontSize}
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
                                <View style={Styles.inputModal}>
                                    <Input size="lg" marginTop={2} value={duration} onChangeText={(val) => setduration(val)} style={[Styles.inputPlaceholder,]} borderRadius={10} placeholderTextColor={'#808080'} placeholder="Duration" />
                                </View>
                                <View style={Styles.inputModal}>
                                    <Select
                                        selectedValue={drugNote}
                                        placeholderTextColor={'#808080'}
                                        fontSize={regularFontSize}
                                        fontFamily={'Poppins-Regular'}
                                        //opacity={0.5}
                                        bgColor={'#FFFFF'}
                                        borderRadius={10}
                                        mt={1}
                                        onValueChange={itemValue => setdrugnote(itemValue)}>
                                        <Select.Item label='Choose Medicine Notes' value={null} />
                                        {MedicalNotes.map(item => (
                                            <Select.Item label={item.itemTitle} value={item.itemTitle} key={item.id} />
                                        ))}
                                    </Select>
                                </View>
                            </Modal.Body>
                            <Modal.Footer>
                                <TouchableOpacity onPress={() => {
                                    setShowModal1(false);
                                }}>
                                    <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                        <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() =>
                                    changeValues([
                                        { drugID: drugID, itemTitle: itemTitle, frequencyID: frequencyID, dosageID: dosageID, duration: duration }
                                    ])
                                }>
                                    <View style={CommonStylesheet.buttonContainersave1}>
                                        <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                            <Modal.Body padding={5}>
                                <Text style={{ fontFamily: "Poppins-regular" }}>Are you sure want to delete this record?</Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <TouchableOpacity onPress={() => {
                                    setconfirmationWindow(false);
                                }}>
                                    <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                        <Text style={CommonStylesheet.ButtonText}>No</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deletePrescription()}>
                                    <View style={CommonStylesheet.buttonContainersave1}>
                                        <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <ScrollView>
                        <View style={{ marginTop: 10 }}>
                            {/* <Text style={Styles.headerText}>Medicine Name</Text> */}
                        </View>
                        <View style={CommonStylesheet.container}>
                            <Stack space={2} w="100%" mx="auto" paddingRight={1} >
                                <View>
                                    <Picker
                                        selectedValue={providerName}
                                        style=
                                        {{
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: 16,
                                            borderRadius: 5,
                                            backgroundColor: '#fff',
                                            height: height * 0.07,
                                            size: "lg",
                                            borderColor: '#e0e0e0',
                                            paddingLeft: 10,
                                            borderRadius: 5,
                                        }}
                                        onValueChange={itemValue => setproviderName(itemValue)}>
                                        <Picker.Item label="Select Doctor" value={null} />
                                        {provider.map(item => (
                                            <Picker.Item label={item.providerName} value={item.providerName} key={item.providerID} />
                                        ))}
                                    </Picker>

                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Input
                                        width={'92%'}
                                        onFocus={setModalVisible}
                                        height={height * 0.07}
                                        style={Styles.inputPlaceholder}
                                        borderRadius={5}
                                        placeholderTextColor={'#888888'}
                                        placeholder="Date of Birth"
                                        value={moment(date).format('LL')}
                                    />
                                    <View style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                                        <TouchableOpacity onPress={() => {
                                            setModalVisible(!modalVisible);
                                        }}>
                                            <Image
                                                source={require('../../../assets/images/calendarDash.png')} alt="logo.png"
                                                style={{ height: 34, width: 36, borderRadius: 5 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* <View style={{ marginTop: -2 }}>
                            <Select selectedValue={service} width={width - 15} size={'lg'}
                                placeholderTextColor={'#000000'}
                                fontSize={14}
                                fontFamily={'Poppins-Regular'}
                                opacity={0.5}
                                bgColor={'#f2f2f2'}
                                borderRadius={10}
                                accessibilityLabel="Choose Template" placeholder="Select Template" _selectedItem={{
                                    bg: "#2196f3",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                                <Select.Item label="Template A" value="Template A" fontFamily={'Poppins-Regular'} />
                                <Select.Item label="Template B" value="Template B" fontFamily={'Poppins-Regular'} />

                            </Select>

                        </View> */}
                                <Input
                                    size="lg"
                                    style={Styles.inputPlaceholder}
                                    borderRadius={10}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Add Medicine"
                                    onFocus={() => openModal()} />
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#e0e0e0', height: 50 }}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                            <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginLeft: 12 }}>Medicine</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Dosage</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Frequency</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                            <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Duration</Text>
                                        </View>
                                        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Action</Text>
                                </View> */}

                                    </View>
                                    {GetPrescriptionByID.map(item =>
                                        <TouchableOpacity onPress={() => openModal1(item.drugID, item.drugName, item.dosageID, item.itemTitle, item.duration, item.genericName)}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginTop: 10, height: 50, borderRadius: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }}>
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    {item.drugName ? item.drugName : item.genericName ? item.genericName : "No Name Available"}
                                                </View>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginTop: 5 }}>{item.dosageID}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginTop: 5 }}>{item.itemTitle}</Text>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, marginTop: 5 }}>{item.duration}</Text>
                                                </View>
                                                <View style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginRight: 5, justifyContent: 'center', marginTop: 5 }}>
                                                    <Icon name='chevron-right' />
                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity>
                                <Icon
                                    name="microphone"
                                    size={30}
                                    style={{ color: '#2196f3', marginTop: 5, marginLeft: 5 }}
                                />
                            </TouchableOpacity>

                            <View style={{ marginLeft: 10 }}>
                                <Input size="lg" width={width - 50} fontFamily={'Poppins-Regular'} borderColor={'#005599'} bgColor={'white'} placeholder="Prescription Note" />
                            </View>
                        </View> */}
                                <Input
                                    size="lg"
                                    value={prescriptionNote}
                                    onChangeText={(value) => setNotes(value)}
                                    height={height * 0.07}
                                    style={Styles.inputPlaceholder}
                                    borderRadius={5}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Prescription Note"
                                />
                                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity>
                                <Icon
                                    name="microphone"
                                    size={20}
                                    style={[{ color: '#2196f3', marginTop: 10,marginRight:10 }, Styles.iconLogo]}
                                />
                            </TouchableOpacity>
                            </View> */}
                                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Input size="lg" width={width - 40} style={Styles.inputPlaceholder} borderRadius={10} placeholderTextColor={'#000'} placeholder="Delete Prescription" isDisabled={true} />
                            <TouchableOpacity onPress={() => deletePrescription()}>
                                <Icon
                                    name="trash"
                                    size={20}
                                    style={{ color: 'red', marginTop: 8, marginLeft: 5, marginRight: 5 }}
                                />
                            </TouchableOpacity>



                        </View> */}

                                {/* <Checkbox.Group onChange={setGroupValues} value={groupValues} accessibilityLabel="choose numbers">

                            <Checkbox value="one" my={2} style={{ backgroundColor: '#f2f2f2', opacity: 0.5 }} ><Text style={{ fontFamily: 'Poppins-Regular' }}>Create template for this Prescription </Text> </Checkbox>


                        </Checkbox.Group> */}
                                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                            <Button size="sm" onPress={() => editPrescription()} style={{ height: 45, width: "40%", borderColor: '#005699', borderRadius: 8, alignSelf: 'center', marginBottom: 10, backgroundColor: '#2196f3' }}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </Button>
                            <Button size="sm" onPress={() => deletePrescription()} style={{ height: 45, width: "40%", borderColor: '#005699', borderRadius: 8, alignSelf: 'center', marginBottom: 10, backgroundColor: '#da251d' }}>
                                <Text style={CommonStylesheet.ButtonText}>Delete</Text>
                            </Button>
                        </View> */}
                                <Box style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => editPrescription()}>
                                            <View style={CommonStylesheet.buttonContainersave}>
                                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginRight: 2 }}>
                                        <TouchableOpacity onPress={() => setconfirmationWindow(true)}>
                                            <View style={CommonStylesheet.buttonContainerdelete}>
                                                <Text style={CommonStylesheet.ButtonText}>Delete</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Box>
                            </Stack>
                        </View>
                    </ScrollView>
                </>
            }
        </View>
    );
};

export default EditPrescription;

const Styles = StyleSheet.create({


    header: {
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#90caf9',
        padding: 10,
    },
    headerText: {
        fontSize: regularFontSize,
        fontFamily: 'Poppins-Regular',
        marginLeft: 10

    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#A6A6A6',
        backgroundColor: '#FFFFFF',
        //opacity: 0.5,

        // borderRadius:10
    },
    logo: {
        width: width * 0.06, // Adjust width based on screen width
        height: height * 0.06, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    },

})