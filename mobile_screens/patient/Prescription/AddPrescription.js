import React, { useState, useEffect } from "react";
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
    Modal,
    HStack,
    Select,
    CheckIcon,
    Checkbox
} from 'native-base';
// import DateTimePicker from '@react-native-community/datetimepicker'
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from 'react-native-paper';
//import Snackbar from "react-native-snackbar";
import Axios from 'axios';
import Api from "../../../api/Api";
import moment from "moment";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { getHeaders } from "../../../utils/apiHeaders";
import Loader from "../../../components/Loader";
import Toast from "react-native-toast-message";



const { height, width } = Dimensions.get('window');
const regularFontSize = width < 600 ? 15 : 20;
const ICON_SIZE = Math.min(width, height) * 0.04;
const regularFontSize1 = width < 600 ? 14 : 16;


const AddPrescription = ({ route }) => {
    const mypatientID = route.params.patientID;
    // const myclinicID = route.params.clinicID;
    const [query, setQuery] = useState('');
    //ALL DATA STORED
    const [AllFrequencyData, setAllFrequencyData] = useState([]);
    const [AllDosageData, setAllDosageData] = useState([]);
    const [groupValues, setGroupValues] = React.useState([]);
    const [treatmentType, settreatmentType] = React.useState([]);
    const [drug, setDrug] = useState([]);
    const [providerInfo, setProviderInfo] = useState([]);
    const [selectedDrug, setselectedDrug] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const navigation = useNavigation();

    const [service, setService] = React.useState("");
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    //handle-UserInput
    const [selectedProvider, setSelectedProvider] = useState("");
    const [note, setNote] = useState('');
    const [drugID, setDrugID] = useState('');
    const [frequency, setfrequency] = useState('0-0-1');
    const [duration, setduration] = useState('1 Days');
    const [dosageID, setdosageID] = useState('100mg');
    const [dosage, setdosage] = useState('');
    const [drugnote, setdrugnote] = useState('');

    //const [itemTitle, setitemTitle] = useState("");
    const [frequencyID, setfrequencyID] = useState(0);
    const [isActiveStatus, setIsActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [genericName, setGenericName] = useState('');
    const [userName, setuserName] = useState('');
    const [token, setToken] = useState('');
    const [MedicalNotes, setMedicalNotes] = useState([]);
    const [myclinicID, setmyclinicID] = useState('');
    const [loading, setLoading] = useState(false);


    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     //console.log(currentDate);
    //     setShow(false);
    //     setDate(currentDate);
    // };

    const resetModal = () => {
        setDrugID('');
        setfrequency('');
        setduration('');
        setdosageID('');
        setdrugnote('');

    }

    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
            //console.log(formattedDate);
            setSelectedDate(formattedDate);// Assuming this is a Date object
            setModalVisible(false);
            setDate(moment(formattedDate));
        }
    };


    const showDatepicker = () => {
        setShow(true);
    };
    const readData = async () => {
        setLoading(true);
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyclinicID(user.clinicID);
        setSelectedProvider(user.name);
        setuserName(user.userName);
        const myFormData = {
            clinicID: user.clinicID,
            itemCategory: "Frequency"
        }
        ////console.log("Frequency Form Data", myFormData);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormData, { headers }).then(resp => {
                ////console.log("Frequency Data", resp.data);
                setAllFrequencyData(resp.data);
            })
        } catch (error) {
            //console.log(error.message);
        }
        const myFormData1 = {
            clinicID: user.clinicID,
            itemCategory: "Dosage"
        }
        ////console.log("Dosage Form Data", myFormData);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormData1, { headers }).then(resp => {
                ////console.log("Dosage Data", resp.data);
                setAllDosageData(resp.data);
            })
        } catch (error) {
            //console.log(error.message);
        }
        const formData =
        {
            applicationDTO: {
                clinicID: user.clinicID,
            }
        }
        ////console.log('Data To Pass', formData1);
        try {
            Axios.post(`${Api}patient/GetProviderInfo`, formData, { headers }).then(resp => {
                ////console.log('Provider Info', resp.data);
                setProviderInfo(resp.data);
            });
        } catch (error) {
            //console.log(error.message);
        }
        const formData1 = {
            clinicID: user.clinicID,
            genericName: null
        }
        try {
            Axios.post(`${Api}Patient/GetDrugInfo`, formData1, { headers }).then(resp => {
                //  //console.log(resp.data);
                setDrug(resp.data);
            })
        } catch (error) {
            //console.log(error.message);
        }
        const myFormData2 = {
            clinicID: user.clinicID,
            itemCategory: "Medicine Notes"
        }
        ////console.log("Frequency Form Data", myFormData);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, myFormData2, { headers }).then(resp => {
                //console.log("Medical Notes", resp.data);
                setMedicalNotes(resp.data);
            })
        } catch (error) {
            //console.log(error.message);
        }
        setLoading(false);

    }

    useEffect(() => {
        readData()
    }, []);

    const openModal = () => {
        //resetModal();
        setShowModal(true);
    }

    const handleCheckBox = () => {
        //console.log(groupValues);
        const data = [];

        for (let i = 0; i < groupValues.length; i++) {
            const id = groupValues[i];

            // Find the corresponding author information
            const author = drug.find(item => item.drugId === id);
            //console.log('CHECKBOXES', author);

            if (author) {
                // Add the additional properties to each selected drug
                const updatedAuthor = {
                    ...author,
                    frequency: '0-0-1',
                    duration: '1 Days',
                    dosageID: '100mg',
                    frequencyID: 1

                };
                data.push(updatedAuthor);
            }
        }

        ////console.log("FINAL DATA TO ADD", data);
        setselectedDrug(data);
        setShowModal(false);
    }
    const changeValues = (changes, drugID, frequency, duration, dosageID) => {
        //resetModal();
        //console.log(drugID, changes);
        const selectedFreqID = AllFrequencyData.find(item => item.itemTitle === frequency);
        // //console.log("FreqID", selectedFreqID.itemID);
        // //console.log('SELECTED DRUG', selectedDrug)
        const indexToUpdate = selectedDrug.findIndex(item => item.drugId === drugID);
        ////console.log('INDEX TO UPDATE', indexToUpdate);

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
            frequencyID: selectedFreqID.itemID
        };

        // Step 3: Create a new array with the updated object at the correct index
        const updatedArray = [
            ...selectedDrug.slice(0, indexToUpdate),
            updatedObject,
            ...selectedDrug.slice(indexToUpdate + 1),
        ];
        //console.log(updatedArray);
        setselectedDrug(updatedArray);
        setShowModal1(false);
    };
    const openModal1 = (id, genericName, dosageID, frequency, duration) => {
        //console.log('Selected DrugID', id, genericName, dosageID, frequency, duration);
        const selectedPresciptionInModal = selectedDrug.find(item => item.drugId === id);
        //console.log('selected Tretment', selectedPresciptionInModal);
        setDrugID(id);
        setdosageID(selectedPresciptionInModal.dosageID);
        setfrequency(selectedPresciptionInModal.frequency);
        setduration(selectedPresciptionInModal.duration);
        setGenericName(genericName);
        setShowModal1(true);
    }
    const handleCheckBox1 = () => {
        //console.log(frequency, duration, dosageID);
        setShowModal1(false);

    }
    const addPrescription = async () => {
        const headers = await getHeaders();
        //console.log("ProviderID", selectedProvider);
        const provider = providerInfo.find(item => item.providerName === selectedProvider);
        //console.log("provider", provider);
        // //console.log("Date", date.toISOString());
        ////console.log("selected drug 149", selectedDrug);
        if (selectedProvider == undefined || selectedProvider == '') {
            // Snackbar.show({
            //     text: 'Please select doctor.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select doctor',
                text2: 'Please select doctor to continue.',
            });
            return;
        }
        if (selectedDrug.length == 0) {
            // Snackbar.show({
            //     text: 'Please add medicines.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please add medicines',
                text2: 'Please add medicines to continue.',
            });
            return
        }

        const formData =
        {
            patientPrescriptionID: "00000000-0000-0000-0000-000000000000",
            clinicID: myclinicID,
            patientID: mypatientID,
            providerID: provider.providerID,
            providerName: null,
            prescriptionNote: note,
            dateOfPrescription: date.toISOString(),
            dtOfPrescription: date.toISOString(),
            nextFollowUp: null,
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
                    patientDrugsPrescriptionsID: "00000000-0000-0000-0000-000000000000",
                    patientPrescriptionID: "00000000-0000-0000-0000-000000000000",
                    drugID: selectedDrug[i].drugId,
                    drugName: selectedDrug[i].genericName,
                    frequencyID: selectedDrug[i].frequencyID,
                    frequency: selectedDrug[i].frequency,
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
                        frequencyID: 0,
                        frequency: null,
                        duration: null

                    },
                    drugnote: drugnote
                }
                formData.patientDrugPrescriptionDTOList.push(arrObj)
            }
        }
        //console.log("ADD Prescription FormData", formData);

        try {
            Axios.post(`${Api}Patient/InsertUpdatePatientPrescription`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                // Snackbar.show({
                //     text: 'New presciption added sucessfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                //     fontSize: 10
                // });
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'New presciption added sucessfully.',
                   // text2: 'Please select patient to continue.',
                });
                //alert('New presciption added sucessfully.');
                navigation.goBack('Prescription', {
                    clinicID: myclinicID,
                    patientID: mypatientID
                });
            })
        } catch (error) {
            //console.log(error.message);
            // Snackbar.show({
            //     text: 'Something went wrong.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
        }
    }

    const onChangeSearch = query => {
        //console.log(query);
        if (query == "") {
            readData()
        }
        setQuery(query);
        const filteredData = drug.filter((item) =>
            item.genericName.toLowerCase().includes(query.toLowerCase())
        );
        setDrug(filteredData);
        setSelectedDate(filteredData);

    };
    const handleToggle = () => {
        setIsActive(!isActiveStatus);
    }

    return (
        <>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Please select Date</Text></Modal.Header>
                    <Modal.Body>
                        <Calendar
                            onChange={onChange}
                            value={date}
                            maxDate={new Date()}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {/* <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}> */}
            <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    {/* <Modal.Content width={350} height={500}>
                        <Modal.CloseButton />
                        <Modal.Header><Text style={{
                            fontSize: regularFontSize,
                            color: '#5f6067',
                            fontFamily: 'Poppins-Bold',
                        }}>Drugs Name</Text></Modal.Header>
                        <Modal.Body>
                            <Searchbar
                                theme={{ colors: { primary: 'gray' } }}
                                placeholder="Search"
                                value={query}
                                style={{ width: 300, margin: 2, marginLeft: 5 }}
                                onChangeText={onChangeSearch}
                                defaultValue='clear'
                                inputStyle={{
                                    fontSize: regularFontSize,
                                    color: '#5f6067',
                                    fontFamily: 'Poppins-Regular'
                                }}
                            />
                            <View style={{ paddingHorizontal: 15, marginTop: 5 }}>

                                <Checkbox.Group onChange={setGroupValues} value={groupValues}>
                                    {drug.map(item =>
                                        <Checkbox value={item.drugId} my="1" marginBottom={4} key={item.drugId}>
                                            <Text style={{
                                                fontSize: regularFontSize,
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
                    </Modal.Content> */}
                    <Modal.Content width={350} height={500}>
                        <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                        <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Drugs Name</Text></Modal.Header>
                        <Modal.Body>
                            <Searchbar
                                theme={{ colors: { primary: 'gray' } }}
                                placeholder="Search"
                                value={query}
                                style={{ width: 300, margin: 2, marginLeft: 5 }}
                                onChangeText={onChangeSearch}
                                defaultValue='clear'
                                inputStyle={{
                                    fontSize: regularFontSize1,
                                    color: '#5f6067',
                                    fontFamily: 'Poppins-Regular'
                                }}
                            />
                            <View style={{ paddingHorizontal: 15, marginTop: 5 }}>

                                <Checkbox.Group onChange={setGroupValues} value={groupValues}>
                                    {drug.map(item =>
                                        <Checkbox value={item.drugId} my="1" marginBottom={4} key={item.drugId} colorScheme="blue">
                                            <Text style={{
                                                fontSize: regularFontSize1,
                                                color: '#5f6067',
                                                fontFamily: 'Poppins-Regular',
                                            }}>{item.genericName}</Text>
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
                        {/* <Modal.Header 
                        style={CommonStylesheet.popheader}>
                            <Text style={{color:'white',fontFamily:'poppins-bold',fontSize:regularFontSize}}>{genericName}</Text>
                        </Modal.Header> */}
                        <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Select Frequency, Duration</Text>
                        </Modal.Header>
                        <Modal.Body>
                            <Picker
                                selectedValue={frequency}
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
                                mt={1}
                                onValueChange={itemValue => setfrequency(itemValue)}>
                                <Picker.Item label='Choose Frequency' value={null} />
                                {AllFrequencyData.map(item => (
                                    <Picker.Item label={item.itemTitle} value={item.itemTitle} key={item.frequencyID} />
                                ))}
                            </Picker>

                            <View style={Styles.inputModal}>
                                <Picker
                                    selectedValue={dosageID}
                                    placeholder="Choose Dosage"
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
                                    mt={1}
                                    onValueChange={itemValue => setdosageID(itemValue)}>
                                    <Picker.Item label='Choose Dosage' value={null} />
                                    {AllDosageData.map(item => (
                                        <Picker.Item label={item.itemTitle} value={item.itemTitle} key={item.dosageID} />
                                    ))}
                                </Picker>
                            </View>
                            <View style={Styles.inputModal}>

                                <Input
                                    size="lg"
                                    value={duration}
                                    onChangeText={(val) => setduration(val)}
                                    height={height * 0.07}
                                    style={[Styles.inputPlaceholder,]}
                                    borderRadius={5}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Duration" />
                            </View>
                            <View style={Styles.inputModal}>
                                <Picker
                                    selectedValue={drugnote}
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
                                    mt={1}
                                    onValueChange={itemValue => setdrugnote(itemValue)}>
                                    <Picker.Item label='Choose Medicine Notes' value={null} />
                                    {MedicalNotes.map(item => (
                                        <Picker.Item label={item.itemTitle} value={item.itemTitle} key={item.id} />
                                    ))}
                                </Picker>
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
                            <TouchableOpacity onPress={() => changeValues(
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
                                <View style={CommonStylesheet.buttonContainersave1}>
                                    <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                <ScrollView>
                    {loading ? <Loader /> :
                        <View style={Styles.container}>
                            <View >
                                <Stack space={2} w="100%" mx="auto" mt={5} paddingRight={1} >
                                    <View>
                                        <Picker
                                            selectedValue={selectedProvider}
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
                                            onValueChange={itemValue => setSelectedProvider(itemValue)}>
                                            <Picker.Item label="Select Doctor" value={null} />
                                            {providerInfo.map(item => (
                                                <Picker.Item label={item.providerName} value={item.providerName} style={Styles.fontFamilyForSelectItem} key={item.providerID} />
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

                                    <Input
                                        width={'100%'}
                                        height={height * 0.07}
                                        size="lg"
                                        style={Styles.inputPlaceholder}
                                        borderRadius={5}
                                        placeholderTextColor={'#808080'}
                                        placeholder="Add Medicine"
                                        onFocus={() => openModal()}
                                    />
                                </Stack>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#e0e0e0', height: 40, marginTop: 10 }}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize1, marginLeft: 12 }}>Medicine</Text>

                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize1 }}>Dosage</Text>

                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize1 }}>Frequency</Text>

                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize1 }}>Duration</Text>

                                    </View>
                                    {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                <Text style={{ color: '#000', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Action</Text>
                                </View> */}

                                </View>
                                {selectedDrug.map(item =>
                                    <TouchableOpacity key={item.drugId} onPress={() => openModal1(item.drugId, item.genericName, item.dosageID, item.frequency, item.duration)}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginTop: 5, height: 40, borderRadius: 5, shadowColor: '#000', shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }}>
                                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize1, marginLeft: 12 }}>{item.genericName}</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize1 }}>{item.dosageID}</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize1 }}>{item.frequency}</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize1 }}>{item.duration}</Text>
                                            </View>

                                            <View style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginRight: 5, justifyContent: 'center', marginTop: 5 }}>
                                                <Icon name='chevron-right' />
                                            </View>


                                        </View>
                                    </TouchableOpacity>

                                )}
                                {/* <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 30, marginTop: 10 }}>
                                        <Checkbox value={isActiveStatus} my={2} onChange={handleToggle} isChecked={isActiveStatus == true ? true : false}>
                                            <Text style={CommonStylesheet.Text}>Create template for this prescription</Text>
                                        </Checkbox>
                                    </View> */}
                                <View style={{ marginTop: 10 }}>
                                    <Input
                                        size="lg"
                                        width={'100%'}
                                        height={height * 0.07}
                                        value={note} onChangeText={(value) => setNote(value)}
                                        style={Styles.inputPlaceholder}
                                        borderRadius={5}
                                        placeholderTextColor={'#808080'}
                                        placeholder="Add Notes"
                                    />
                                </View>
                                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => addPrescription()}>
                                            <View style={CommonStylesheet.buttonContainersaveatForm}>
                                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Box>
                            </View>
                        </View>
                    }
                </ScrollView>
            </View>
        </>
    );
};


const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        padding: 10,
        width: '100%'

    },
    iconDot: {
        marginRight: 20,
        marginTop: -6
    },
    card: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#2196f3',
        height: 120,
        width: width - 40,
        backgroundColor: '#ffff',
        margin: 10

    },
    hdertxt: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginRight: 15
    },
    hdertxtCost: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 182
    },
    hdertxtDuration: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 195

    },
    hdertxtUnit: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 200
    },
    hdertxtTreatment: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 5,
        marginTop: -3

    },
    ButtonText: {
        fontSize: regularFontSize,
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 320,
        height: 260,
        display: 'flex',
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#A6A6A6',
        backgroundColor: '#FFFFFF',

    },
    fontFamilyForSelectItem: {
        fontFamily: 'Poppins-Regular'
    },
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
    inputModal: {
        marginTop: 10
    },
    logo: {
        width: width * 0.05, // Adjust width based on screen width
        height: height * 0.04, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    },
})

export default AddPrescription;