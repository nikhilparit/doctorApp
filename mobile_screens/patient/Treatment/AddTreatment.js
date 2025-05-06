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
    Radio,
    Modal,
    TextArea,
    Checkbox
} from 'native-base';
//common styles
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Axios from 'axios';
import Api from '../../../api/Api';
//import Snackbar from 'react-native-snackbar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Searchbar } from "react-native-paper";
import { RadioButton } from 'react-native-paper';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

const { height, width } = Dimensions.get('window');
const icon_size = Math.min(width, height) * 0.05;
//const secondaryCardHeader = Math.min(width, height) * 0.033;
const secondaryCardHeader = 16;
const modalfontSize = Math.min(width, height) * 0.011;
const regularFontSize = width < 600 ? 14 : 16;//jyo12
const primaryFontSize = width < 600 ? 17 : 22;

const AddTreatment = ({ route }) => {
    let globalDiscountAmount = 0;
    const mypatientID = route.params.patientID;
    //const myclinicID = route.params.clinicID;
    //console.log('My Patient ID', mypatientID);
    //console.log('My Clinic ID', myclinicID);
    const navigation = useNavigation();
    const [service, setService] = useState("");
    const [value, setValue] = useState('NUMBER');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [providerInfo, setProviderInfo] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [showModal, setShowModal] = useState(false);
    //treatment Modal
    const [treatmentType, settreatmentType] = useState([]);
    const [selectedTreatmentType, setselectedTreatmentType] = useState([]);
    const [groupValues, setGroupValues] = useState([]);
    const [showModal1, setShowModal1] = useState(false);
    //Handling pop-up calculations input
    const [selectedTeeth, setSelectedTeeth] = useState('');
    const [originalPrice, setOriginalPrice] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    //data binding at Modal
    const [treatmentTypeID, settreatmentTypeID] = useState('');
    const [generalTreatmentCost, setgeneralTreatmentCost] = useState(0);
    const [query, setQuery] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [userName, setuserName] = useState('');
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [myclinicID, setmyclinicID] = useState('');



    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
            //console.log(formattedDate);
            setSelectedDate(formattedDate);// Assuming this is a Date object
            setModalVisible(false);
            setDate(moment(formattedDate));
        }
    };

    const readData = async () => {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setToken(user.token);
        setmyclinicID(user.clinicID);
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': user.token
        };
        setuserName(user.userName);
        //console.log('UserID', userID);

        const formData =
        {
            applicationDTO: {
                clinicID: user.clinicID,
            }
        }
        try {
            Axios.post(`${Api}patient/GetProviderInfo`, formData, { headers }).then(resp => {
                //console.log('Provider Info', resp.data);
                setProviderInfo(resp.data);
            });
        } catch (error) {
            //console.log(error);
        }
        const formData1 = {
            clinicID: user.clinicID,
        }
        //console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}Patient/GetTreatmentType`, formData1, { headers }).then(resp => {
                //console.log('Patient Treatment', resp.data);
                settreatmentType(resp.data);

            });
        } catch (error) {
            //console.log(error);
        }
    }
    useEffect(() => {
        readData()
    }, []);
    const addingTreatment = () => {
        console.log(selectedProvider)
        if (selectedProvider == '' || selectedProvider == undefined || date == '' || date == undefined) {
            // Snackbar.show({
            //     text: 'Required all credentials.',
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
            //alert('Required all credentials.');
            return
        }
        //console.log("141", selectedTreatmentType);
        if (selectedTreatmentType.length == 0) {
            // Snackbar.show({
            //     text: 'Required all credentials.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select treatment',
                text2: 'Please select treatment to continue.',
            });
            //alert('Required all credentials.');
            return
        }

        // const formData = {
        //     lastUpdatedOn: date.toISOString(),
        //     patientTreatmentID: "00000000-0000-0000-0000-000000000000",
        //     patientID: mypatientID,
        //     treatmentStatus: 1,
        //     providerId: selectedProvider,
        //     treatmentPayment: 0,
        //     treatmentDate: date.toISOString(),
        //     treatmentCost: parseInt(originalPrice),
        //     treatmentBalance: 0,
        //     registrationNumber: null,
        //     providerName: null,
        //     modeOfPayment: null,
        //     chequeNo: null,
        //     count: 0,
        //     chequeDate: null,
        //     bankName: null,
        //     creditCardBankID: 0,
        //     creditCardDigit: null,
        //     creditCardOwner: null,
        //     creditCardValidFrom: null,
        //     creditCardValidTo: null,
        //     receiptNo: 0,
        //     receiptNumber: null,
        //     invoiceID: "00000000-0000-0000-0000-000000000000",
        //     invoiceNumber: null,
        //     flag: false,
        //     treatmentAddition: 0,
        //     treatmentDiscount: parseInt(globalDiscountAmount),
        //     treatmentTax: 0,
        //     netTreatmentCost: 0,
        //     parentPatientTreatmentDoneID: "00000000-0000-0000-0000-000000000000",
        //     treatmentWiseTotalPayment: 0,
        //     treatmentWiseBalance: 0,
        //     isTreatmentStepSettings: false,
        //     patientTreatmentDTOCount: 0,
        //     title: null,
        //     treatmentTypeID: "00000000-0000-0000-0000-000000000000",
        //     amount: 0,
        //     amountToBeCollected: 0,
        //     waitingAreaID: "00000000-0000-0000-0000-000000000000",
        //     treatmentTotalCost: parseInt(originalPrice)-parseInt(globalDiscountAmount),
        //     patientTreatmentDoneID: "00000000-0000-0000-0000-000000000000",
        //     generateInvoiceYN: null,
        //     treatmentSummary: null,
        //     lastUpdatedDTOString: null,
        //     patientTreatmentDTOString: null,
        //     lastUpdatedDTO: {
        //         createdBy: userName,
        //         createdOn: date.toISOString(),
        //         lastUpdatedBy: userName,
        //         lastUpdatedOn: date.toISOString()
        //     },
        //     patientPaymentSummary: {
        //         patientID: mypatientID,
        //         netTreatmentCost: 0,
        //         paid: 0,
        //         balance: 0,
        //         discount: 0,
        //         billedTreatmentCost: 0,
        //         nonBilledTreatmentCost: 0,
        //         billedDiscount: 0,
        //         nonBilledDiscount: 0,
        //         settledPayment: 0,
        //         nonSettledPaid: 0,
        //         refundAmount: 0,
        //         currencySymbol: null,
        //         billedBalance: 0,
        //         invoiceNumber: null
        //     },
        //     patientTreatmentHeaderChildListDTO: [],
        //     patientTreatmentDTO: [],
        //     nonbilledBalanceAmount: 0,
        //     billedAmount: 0,
        //     discountValue:parseInt(discountPercentage),
        //     discountType: value,
        //     isBillGenrate: false,
        //     isPaymentAccept: false,
        //     clinicID: myclinicID,
        //     treatmentTotalPayment: 0,
        //     lastUpdatedBy: userName
        // }
        const formData = {
            lastUpdatedOn: date.toISOString(),
            patientTreatmentID: "00000000-0000-0000-0000-000000000000",
            patientID: mypatientID,
            treatmentStatus: 1,
            providerId: selectedProvider,
            lastUpdatedDTO: {
                createdBy: userName,
                createdOn: date.toISOString(),
                lastUpdatedBy: userName,
                lastUpdatedOn: date.toISOString()
            },

            patientTreatmentHeaderChildListDTO: [],
            patientTreatmentDTO: [],
            clinicID: myclinicID,
            lastUpdatedBy: userName
        }
        if (selectedTreatmentType && selectedTreatmentType.length > 0) {
            for (let i = 0; i < selectedTreatmentType.length; i++) {
                let arrObj1 =
                {
                    lastUpdatedOn: date.toISOString(),
                    patientTreatmentID: "00000000-0000-0000-0000-000000000000",
                    patientID: mypatientID,
                    treatmentStatus: 1,
                    providerId: selectedProvider,
                    treatmentPayment: 0,
                    treatmentDate: date.toISOString(),
                    treatmentCost: selectedTreatmentType[i].generalTreatmentCost,
                    treatmentBalance: 0,
                    registrationNumber: null,
                    providerName: null,
                    modeOfPayment: null,
                    chequeNo: null,
                    count: 0,
                    chequeDate: null,
                    bankName: null,
                    creditCardBankID: 0,
                    creditCardDigit: null,
                    creditCardOwner: null,
                    creditCardValidFrom: null,
                    creditCardValidTo: null,
                    receiptNo: 0,
                    receiptNumber: null,
                    invoiceID: "00000000-0000-0000-0000-000000000000",
                    invoiceNumber: null,
                    flag: false,
                    treatmentAddition: 0,
                    treatmentDiscount: selectedTreatmentType[i].generalTreatmentCost - selectedTreatmentType[i].specialistTreatmentCost,
                    treatmentTax: 0,
                    netTreatmentCost: selectedTreatmentType[i].generalTreatmentCost - (selectedTreatmentType[i].generalTreatmentCost - selectedTreatmentType[i].specialistTreatmentCost),
                    parentPatientTreatmentDoneID: "00000000-0000-0000-0000-000000000000",
                    treatmentWiseTotalPayment: 0,
                    treatmentWiseBalance: 0,
                    isTreatmentStepSettings: false,
                    patientTreatmentDTOCount: 0,
                    title: null,
                    treatmentTypeID: selectedTreatmentType[i].treatmentTypeID,
                    amount: 0,
                    amountToBeCollected: 0,
                    waitingAreaID: "00000000-0000-0000-0000-000000000000",
                    treatmentTotalCost: selectedTreatmentType[i].generalTreatmentCost - (selectedTreatmentType[i].generalTreatmentCost - selectedTreatmentType[i].specialistTreatmentCost),
                    patientTreatmentDoneID: "00000000-0000-0000-0000-000000000000",
                    generateInvoiceYN: null,
                    treatmentSummary: null,
                    lastUpdatedDTOString: null,
                    patientTreatmentDTOString: null,
                    lastUpdatedDTO: {
                        createdBy: userName,
                        createdOn: date.toISOString(),
                        lastUpdatedBy: userName,
                        lastUpdatedOn: date.toISOString()
                    },

                    patientTreatmentDTO: [
                        {
                            patientTreatmentID: "00000000-0000-0000-0000-000000000000",
                            patientTreatmentDoneID: "00000000-0000-0000-0000-000000000000",
                            patientTreatmentTypeDoneID: "00000000-0000-0000-0000-000000000000",
                            patientID: mypatientID,
                            isInvoiceGenerated: false,
                            providerID: selectedProvider,
                            teethTreatment: null,
                            displayTeethTreatment: null,
                            title: null,
                            treatmentDetails: null,
                            treatmentCost: selectedTreatmentType[i].generalTreatmentCost,
                            treatmentBalance: 0,
                            treatmentPayment: 0,
                            addedBy: null,
                            addedOn: date.toISOString(),
                            lastUpdatedBy: userName,
                            lastUpdatedOn: date.toISOString(),
                            treatmentDate: date.toISOString(),
                            dtTreatment: null,
                            flag: false,
                            providerInchargeID: "00000000-0000-0000-0000-000000000000",
                            dateoftreatment: null,
                            rowguid: "00000000-0000-0000-0000-000000000000",
                            rowStatus: "Added",
                            isExpanded: false,
                            treatmentAddition: 0,
                            treatmentDiscount: parseInt(globalDiscountAmount) || 0,
                            treatmentTax: 0,
                            netTreatmentCost: selectedTreatmentType[i].generalTreatmentCost - (selectedTreatmentType[i].generalTreatmentCost - selectedTreatmentType[i].specialistTreatmentCost),
                            treatmentTotalCost: selectedTreatmentType[i].generalTreatmentCost,
                            treatmentTypeID: selectedTreatmentType[i].treatmentTypeID,
                            treatmentType: null,
                            treatmentSubType: null,
                            treatmentSubTypeID: "00000000-0000-0000-0000-000000000000",
                            teethTreatmentNote: selectedTreatmentType[i].teethTreatmentNote,
                            treatmentStatus: 1,
                            discountValue: selectedTreatmentType[i].discountValue,
                            discountType: selectedTreatmentType[i].discountType,
                            treatmentSummary: null,
                            examinationChartDetailID: "00000000-0000-0000-0000-000000000000"
                        }
                    ],
                    nonbilledBalanceAmount: 0,
                    billedAmount: 0,
                    discountValue: parseInt(discountPercentage),
                    discountType: value,
                    isBillGenrate: false,
                    isPaymentAccept: false,
                    clinicID: myclinicID,
                    treatmentTotalPayment: 0,
                    lastUpdatedBy: userName
                }
                formData.patientTreatmentHeaderChildListDTO.push(arrObj1)
            }
        }
        if (selectedTreatmentType && selectedTreatmentType.length > 0) {
            for (let i = 0; i < selectedTreatmentType.length; i++) {
                let arrObj2 =
                {
                    patientTreatmentID: "00000000-0000-0000-0000-000000000000",
                    patientTreatmentDoneID: "00000000-0000-0000-0000-000000000000",
                    patientTreatmentTypeDoneID: "00000000-0000-0000-0000-000000000000",
                    patientID: mypatientID,
                    isInvoiceGenerated: false,
                    providerID: selectedProvider,
                    teethTreatment: null,
                    displayTeethTreatment: null,
                    title: null,
                    treatmentDetails: null,
                    treatmentCost: selectedTreatmentType[i].generalTreatmentCost,
                    treatmentBalance: 0,
                    treatmentPayment: 0,
                    addedBy: null,
                    addedOn: date.toISOString(),
                    lastUpdatedBy: userName,
                    lastUpdatedOn: date.toISOString(),
                    treatmentDate: date.toISOString(),
                    dtTreatment: null,
                    flag: false,
                    providerInchargeID: "00000000-0000-0000-0000-000000000000",
                    dateoftreatment: null,
                    rowguid: "00000000-0000-0000-0000-000000000000",
                    rowStatus: "Added",
                    isExpanded: false,
                    treatmentAddition: 0,
                    treatmentDiscount: selectedTreatmentType[i].generalTreatmentCost - selectedTreatmentType[i].specialistTreatmentCost,
                    treatmentTax: 0,
                    netTreatmentCost: selectedTreatmentType[i].generalTreatmentCost - (selectedTreatmentType[i].generalTreatmentCost - selectedTreatmentType[i].specialistTreatmentCost),
                    treatmentTotalCost: selectedTreatmentType[i].generalTreatmentCost - (selectedTreatmentType[i].generalTreatmentCost - selectedTreatmentType[i].specialistTreatmentCost),
                    treatmentTypeID: selectedTreatmentType[i].treatmentTypeID,
                    treatmentType: null,
                    treatmentSubType: null,
                    treatmentSubTypeID: "00000000-0000-0000-0000-000000000000",
                    teethTreatmentNote: selectedTreatmentType[i].teethTreatmentNote,
                    treatmentStatus: 1,
                    discountValue: selectedTreatmentType[i].discountValue,
                    discountType: selectedTreatmentType[i].discountType,
                    treatmentSummary: null,
                    examinationChartDetailID: "00000000-0000-0000-0000-000000000000"
                }
                formData.patientTreatmentDTO.push(arrObj2)
            }
        }
        //console.log("Adding Treatment Form Data", formData);
        const headers = {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
        };
        try {
            Axios.post(`${Api}Patient/SavePatientTreatment`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                if (resp.data) {
                    // Snackbar.show({
                    //     text: 'New treatment added sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'New treatment added sucessfully.',
                        //text2: 'Please select patient to continue.',
                    });
                    // alert('New treatment added sucessfully.');
                    navigation.goBack('Treatment', {
                        clinicID: myclinicID,
                        patientID: mypatientID
                    });
                }
            })
        } catch (error) {
            // console.log(error.message);
            // Snackbar.show({
            //     text: 'Something went wrong.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
        }
    }
    // const getDiscountedPrice = () => {
    //     console.log("VALUE", value);
    //     if (value == 'NUMBER') {
    //         const discountAmount = discountPercentage;
    //         globalDiscountAmount = discountAmount;
    //         console.log("DISCOUNT", discountAmount);
    //         const discountedPrice = originalPrice - discountAmount;
    //         console.log("discountedPrice", discountAmount);
    //         return discountedPrice
    //     } else {
    //         const discountAmount = originalPrice * (discountPercentage / 100);
    //         globalDiscountAmount = discountAmount;
    //         console.log("DISCOUNT", discountAmount);
    //         const discountedPrice = originalPrice - discountAmount;
    //         console.log("discountedPrice", discountAmount);
    //         return discountedPrice
    //     }
    // }
    const getDiscountedPrice = () => {
        // Ensure originalPrice and discountPercentage are numbers and not NaN or undefined
        const validOriginalPrice = isNaN(originalPrice) ? 0 : originalPrice;
        const validDiscountPercentage = isNaN(discountPercentage) ? 0 : discountPercentage;

        //console.log("VALUE", value);

        if (value === 'NUMBER') {
            const discountAmount = validDiscountPercentage;
            globalDiscountAmount = discountAmount;
            // console.log("DISCOUNT", discountAmount);
            const discountedPrice = validOriginalPrice - discountAmount;
            // console.log("discountedPrice", discountedPrice);
            return discountedPrice;
        } else if (value === 'PERCENT') {  // Assuming the other possible value for percentage discount
            const discountAmount = originalPrice * (discountPercentage / 100);
            globalDiscountAmount = discountAmount;
            // console.log("DISCOUNT", discountAmount);
            const discountedPrice = originalPrice - discountAmount;
            //console.log("discountedPrice", discountAmount);
            return discountedPrice
        } else {
            return 0;  // Return 0 if no valid value is selected
        }
    };

    const openModal1 = () => {
        setShowModal1(true);
    }
    const handleCheckBox = () => {
        //console.log(groupValues);
        const data = [];
        for (let i = 0; i < groupValues.length; i++) {
            const id = groupValues[i];

            // Find the corresponding author information
            const author = treatmentType.find(item => item.treatmentTypeID === id);

            if (author) {
                data.push(author);
            }
        }
        //console.log("FINAL DATA FOR TRATEMENT", data);
        setselectedTreatmentType(data);
        setValue('NUMBER');
        setShowModal1(false);
        // setSelectedComplaint(patientChiefComplaint.filter(item => item.id == id));
    }
    const openModal = (id, specialistTreatmentCost, discountValue, discountType, title) => {
        setTitle(title);
        //console.log(value,"At open Modal");
        //console.log("selected Tretment type ID", id,specialistTreatmentCost||0,discountValue||0,discountType);
        //console.log(selectedTreatmentType);
        const selectedTreatmentInModal = selectedTreatmentType.find(item => item.treatmentTypeID === id);
        //console.log('selected Tretment', selectedTreatmentInModal);
        settreatmentTypeID(id);
        setOriginalPrice(selectedTreatmentInModal.generalTreatmentCost || 0);
        setDiscountPercentage(selectedTreatmentInModal.discountValue || 0);
        setValue(selectedTreatmentInModal.discountType || 'NUMBER');
        setShowModal(true);
    }
    const changeValues = (changes) => {
        // console.log(value);
        if (value == undefined) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select discount',
                text2: 'Please select discount in number / percent.',
            });
            // alert('Please select discount in number / percent.')
            return;
        }
        if (getDiscountedPrice() == undefined || getDiscountedPrice() < 0) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Invalid discount amount.',
                text2: 'Please enter valid discount amount.',
            });
            //alert('Please enter valid discount amount.')
            return;
        }
        setOriginalPrice(0);
        setDiscountPercentage(0);
        setNote('');
        // console.log(treatmentTypeID, selectedTeeth, originalPrice, discountPercentage, totalCost, value, changes);
        //Create a copy of the original array
        const newArray = [...selectedTreatmentType];
       // console.log("NEW ARRAY", newArray);
        const indexToUpdate = newArray.findIndex(item => item.treatmentTypeID === treatmentTypeID);
        // console.log('INDEX TO UPDATE', indexToUpdate);
        // If the drugID is not found, you can handle the error accordingly.
        if (indexToUpdate === -1) {
            console.error("Drug ID not found in the 'changes' array.");
            return;
        }
        // Step 2: Create a new object with updated values
        const updatedObject = {
            ...selectedTreatmentType[indexToUpdate],
            generalTreatmentCost: parseInt(originalPrice),
            specialistTreatmentCost: getDiscountedPrice(),
            discountType: value,
            discountValue: parseFloat(discountPercentage),
            teethTreatmentNote:note
        };
        // Step 3: Create a new array with the updated object at the correct index
        const updatedArray = [
            ...selectedTreatmentType.slice(0, indexToUpdate),
            updatedObject,
            ...selectedTreatmentType.slice(indexToUpdate + 1),
        ];
         //console.log("updatedArray",updatedArray);
        setselectedTreatmentType(updatedArray);
        setShowModal(false);
    }
    const onChangeSearch = query => {
        //console.log(query);
        if (query == "") {
            readData()
        }
        setQuery(query);
        const filteredData = treatmentType.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        settreatmentType(filteredData);

    };
    const removeItem = (id) => {
        setselectedTreatmentType(prev => prev.filter(item => item.treatmentTypeID !== id));
    };

    return (

        // <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content maxWidth="350">
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

            <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
                <Modal.Content width={350} height={600}>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Treatment Types</Text></Modal.Header>
                    <Modal.Body>
                        <Searchbar
                            theme={{ colors: { primary: 'gray' } }}
                            placeholder="Search"

                            value={query}
                            style={{ width: 310, margin: 5, height: height * 0.07, justifyContent: 'center', marginTop: -5 }}
                            onChangeText={onChangeSearch}
                            defaultValue='clear'
                            inputStyle={{
                                fontSize: secondaryCardHeader,
                                color: '#5f6067',
                                fontFamily: 'Poppins-Regular',
                                lineHeight: Math.min(width, height) * 0.05,
                                marginTop: -5,
                            }}
                        />
                        <View style={{ paddingHorizontal: 15, marginTop: 5 }}>

                            <Checkbox.Group onChange={setGroupValues} value={groupValues}>
                                {treatmentType.map(item =>
                                    <Checkbox value={item.treatmentTypeID} my="1" marginBottom={4} key={item.treatmentTypeID} colorScheme={"blue"}>
                                        <Text style={{
                                            fontSize: secondaryCardHeader,
                                            color: '#5f6067',
                                            fontFamily: 'Poppins-Medium',
                                            lineHeight: Math.min(width, height) * 0.05,
                                        }}>{item.title}</Text>
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
                                <Text style={CommonStylesheet.ButtonText}> Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckBox()}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}> Save</Text>
                            </View>
                        </TouchableOpacity>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content width={400} height={400}>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Treatment</Text></Modal.Header>
                    <Modal.Body>

                        {/* <View style={{ marginTop: 10 }}>
                            <Input size="lg" value={selectedTeeth} onChangeText={(value) => setSelectedTeeth(value)} style={Styles.inputPlaceholder} borderRadius={10} placeholderTextColor={'#000'} placeholder="Select Teeth" fontFamily={'Poppins-Regular'} />
                        </View> */}
                        <View >
                            <Input value={originalPrice} onChangeText={value => setOriginalPrice(value)}
                                size="lg" style={Styles.inputPlaceholder} keyboardType={'numeric'} borderRadius={5} placeholderTextColor={'#000'}
                                placeholder="Cost" fontFamily={'Poppins-Regular'} />
                        </View>
                        <RadioButton.Group
                            onValueChange={nextValue => setValue(nextValue)}
                            value={value}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -5 }}>
                                    <RadioButton
                                        value="NUMBER"
                                        color="#2196f3"
                                        uncheckedColor="gray"
                                    />
                                    <Text style={Styles.Text}>Discount in number</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <RadioButton
                                        value="PERCENT"
                                        color="#2196f3"
                                        uncheckedColor="gray"
                                    />
                                    <Text style={Styles.Text}>Discount in percent</Text>
                                </View>
                            </View>
                        </RadioButton.Group>
                        <View style={{ marginTop: 10 }}>
                            <Input size="lg"
                                value={discountPercentage}
                                onChangeText={value => setDiscountPercentage(value)}
                                style={Styles.inputPlaceholder} keyboardType={'numeric'}
                                borderRadius={5} placeholderTextColor={'#000'} placeholder="Discount Value" fontFamily={'Poppins-Regular'} />

                        </View>




                        <View style={{ marginTop: 10, marginLeft: 5 }}>
                            <Text style={{ color: '#2196f3', fontFamily: 'Poppins-Bold', fontSize: regularFontSize, fontWeight: 550 }}>
                                Total Price : {getDiscountedPrice()} /-
                            </Text>

                        </View>
                        {/* <View style={{ marginTop: 10, marginLeft: 5 }}>

                            <Text style={Styles.totalCost}>
                               Diff. : {globalDiscountAmount} /-
                            </Text>
                        </View> */}
                        <View style={{ marginTop: 10 }}>
                            <Input
                                size="lg"
                                style={Styles.inputPlaceholder}
                                borderRadius={5}
                                placeholderTextColor={'#000'}
                                placeholder="Note"
                                onChangeText={(value) => setNote(value)} />
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => changeValues([
                                { treatmentTypeID: treatmentTypeID, generalTreatmentCost: totalCost, discountType:value, 
                                    discountValue : discountPercentage},
                            ])}>
                                Save
                            </Button>
                        </Button.Group> */}

                        <TouchableOpacity onPress={() => {
                            setShowModal(false);
                        }}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}> Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeValues([
                            {
                                treatmentTypeID: treatmentTypeID, generalTreatmentCost: totalCost, discountType: value,
                                discountValue: discountPercentage
                            },
                        ])}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}> Save</Text>
                            </View>
                        </TouchableOpacity>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <ScrollView>
                <View style={CommonStylesheet.container}>
                    {/* <View style={{ marginTop: 10 }}>
                        <Text style={Styles.headerText}>Crowns</Text>
                    </View> */}

                    <Stack space={2} w="100%" mx="auto" justifyContent={'center'} mt={5} paddingRight={1} >
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
                                    <Picker.Item label={item.providerName} value={item.providerID} style={Styles.fontFamilyForSelectItem} key={item.providerID} />
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
                            placeholder="Select Treatment"
                            onFocus={() => openModal1()}
                        />


                        <View >
                            {selectedTreatmentType.length > 0 ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#e0e0e0', height: 50 }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: secondaryCardHeader, lineHeight: Math.min(width, height) * 0.07, marginLeft: 12 }}>Treatment</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: secondaryCardHeader, lineHeight: Math.min(width, height) * 0.07, }}>Unit</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: secondaryCardHeader, lineHeight: Math.min(width, height) * 0.07, marginRight: 12 }}>Total Cost</Text>
                                    </View>
                                    {/* <View>
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14 }}>Action</Text>
                                </View> */}
                                </View> :
                                <View></View>}
                            {selectedTreatmentType.map(item => (
                                <TouchableOpacity onPress={() => openModal(item.treatmentTypeID, item.specialistTreatmentCost, item.discountValue, item.discountType, item.title)} key={item.treatmentTypeID}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginTop: 10, height: 50, borderRadius: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, lineHeight: Math.min(width, height) * 0.07, marginLeft: 12 }} >{item.title}</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, lineHeight: Math.min(width, height) * 0.07 }}>(1)</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, lineHeight: Math.min(width, height) * 0.07, marginRight: 12 }}>{item.specialistTreatmentCost}/-</Text>
                                        </View>
                                        <View style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginRight: 5, justifyContent: 'center' }}>
                                            <Icon name='chevron-right' />
                                        </View>
                                        {/* <TouchableOpacity onPress={() => removeItem(item.treatmentTypeID)}>
                                            <View style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginRight: 5, justifyContent: 'center' }}>
                                                <Icon name="trash" size={24} color="red" />
                                            </View>
                                        </TouchableOpacity> */} 
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <View style={{}}>
                                <TouchableOpacity onPress={() => addingTreatment()}>
                                    <View style={CommonStylesheet.buttonContainersaveatForm}>
                                        <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Box>
                        {/* <Button onPress={() => addingTreatment()}
                            size="sm" style={{ height: '20%', width: "30%", borderColor: '#005699', borderRadius: 8, alignSelf: 'center', marginBottom: 10, backgroundColor: '#2196f3' }}>
                            <Text style={CommonStylesheet.ButtonText}>Save </Text>
                        </Button> */}

                    </Stack>
                </View>
            </ScrollView>
        </View>
    );
};

export default AddTreatment;

const Styles = StyleSheet.create({


    header: {
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#90caf9',
        padding: 10,
    },
    headerText: {
        fontSize: regularFontSize,
        fontFamily: 'Poppins-Bold',
        color: '#2196f3'
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
    totalCost: {
        fontFamily: 'Poppins-Bold',
        fontSize: regularFontSize,
        color: '#90caf9'

    },
    iconLogo: {
        width: 45, // Adjust width based on screen width
        height: 45, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    },
    Text: {
        fontSize: regularFontSize,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular',
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed

    },
});