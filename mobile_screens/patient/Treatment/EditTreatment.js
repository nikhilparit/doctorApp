import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
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
    Radio, Modal
} from 'native-base';

//common styles
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const { height, width } = Dimensions.get('window');
import Axios from 'axios';
import Api from '../../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { getHeaders } from '../../../utils/apiHeaders';
import Toast from 'react-native-toast-message';
//import Snackbar from 'react-native-snackbar';

const secondaryCardHeader = Math.min(width, height) * 0.03;
const regularFontSize = width < 600 ? 15 : 18;
const primaryFontSize = width < 600 ? 17 : 22;


const EditTreatment = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [groupValues, setGroupValues] = React.useState([]);
    const [service, setService] = React.useState(0);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const mypatientID = route.params.patientID;
    const mypatientTreatmentDoneID = route.params.patientTreatmentDoneID;
    const mypatientTreatmentTypeDoneID = route.params.patientTreatmentTypeDoneID;
    const mytreatmentTypeID = route.params.treatmentTypeID;
    //Data_Binding
    const [GetPatientTreatment, setGetPatientTreatment] = useState([]);
    const [PatientTreatmentData, setPatientTreatmentData] = useState([]);
    const [provider, setProvider] = useState([]);
    const [treatmentType, settreatmentType] = useState('');
    const [providerName, setproviderName] = useState('');
    const [treatmentDate, setTreatmentDate] = useState('');
    const [value, setValue] = useState('');
    const [originalPrice, setOriginalPrice] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [myClinicID, setmyClinicID] = useState(0);
    const [note, setNote] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTeeth, setSelectedTeeth] = useState('');
    const [toothCount, setToothCount] = useState('');
    const [token, setToken] = useState('');
    const [userName, setuserName] = useState('');
    let discountAmount = 0
    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     //console.log(currentDate);
    //     setShow(false);
    //     setDate(currentDate);
    //     setTreatmentDate(currentDate);
    // };
    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
           // console.log(formattedDate);
            setModalVisible(false);
            setDate(moment(formattedDate));
            setTreatmentDate(moment(formattedDate));
        }
    };
    const showDatepicker = () => {
        setShow(true);
    };

    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setSelectedTeeth('');
        setToothCount('');
        setmyClinicID(user.clinicID);
        setuserName(user.userName);
        const formData0 =
        {
            applicationDTO: {
                clinicID: user.clinicID,
            }
        }
        try {
            Axios.post(`${Api}patient/GetProviderInfo`, formData0, { headers }).then(resp => {
                //console.log('Provider Info', resp.data);
                setProvider(resp.data);
            });
        } catch (error) {
            //console.log(error.message);
        }
        const formData = {
            searchDTO: {
                patientID: mypatientID
            },
            patientTreatmentDTO: [
                {
                    patientTreatmentDoneID: mypatientTreatmentDoneID
                }
            ]
        }
        //console.log("Form Data", formData);

        try {
            const response = await Axios.post(`${Api}Patient/GetPatientTreatment`, formData, { headers });
           // console.log("MY DATA", response.data);
            setPatientTreatmentData(response.data);
            const filteredTreatment = response.data.find((item) => item.patientTreatmentDoneID === mypatientTreatmentDoneID);
           // console.log('Filtered Data', filteredTreatment);
            const selectedTeeth = (filteredTreatment.patientTreatmentDTO[0].displayTeethTreatment);
            const teethArray = selectedTeeth.split(',');
            const toothCount = teethArray.length;
           // console.log("selectedTeeth", selectedTeeth, toothCount);
            setSelectedTeeth(selectedTeeth);
            setToothCount(toothCount);
          //  console.log(filteredTreatment.discountType, "discountType");
            setValue(filteredTreatment.discountType);
            setGetPatientTreatment(filteredTreatment);
            const {
                title,                                          
                treatmentStatus,
                teethTreatmentNote
            } = filteredTreatment.patientTreatmentDTO[0];
            settreatmentType(title);
            setService(treatmentStatus);
            setNote(teethTreatmentNote);
            const {
                providerName,
                treatmentDate,
                treatmentCost,
                //treatmentDiscount,
                discountValue,
            } = filteredTreatment;
            setproviderName(providerName);
            setTreatmentDate(treatmentDate);
            setOriginalPrice(treatmentCost)
            //setDiscountPercentage(treatmentDiscount);
            setDiscountPercentage(discountValue);
        } catch (error) {
            //console.log(error.message);
        }

    }
    useEffect(() => {
        readData()
    }, [isFocused]);

    const getDiscountedPrice = () => {
        if (value == 'NUMBER') {
            discountAmount = discountPercentage;
            //console.log("DISCOUNT", discountAmount);
            //setDiscountAmount(discountAmount);
            if (toothCount > 0) {
                const discountedPrice = (originalPrice * toothCount) - discountAmount;
                return discountedPrice;
            } else {
                const discountedPrice = originalPrice - discountAmount;
                return discountedPrice;
            }

        }
        if (value == 'PERCENT') {
            discountAmount = (originalPrice * toothCount) * (discountPercentage / 100);
            // setDiscountAmount(discountAmount);
           // console.log('DISCOUNT', discountAmount);

            if (toothCount > 0) {
                const discountedPrice = (originalPrice * toothCount) - (discountAmount);
                return discountedPrice;
            } else {
                const discountedPrice = originalPrice - discountAmount;
                return discountedPrice;
            }
        }
    }
    const getDiscounte = () => {

        if (value == 'NUMBER') {
            const discountAmount = discountPercentage;
            return discountAmount;
        }
        if (value == 'PERCENT') {
            const discountAmount = originalPrice * (discountPercentage / 100);
            return discountAmount;
        }
    }

    const updateTreatment = async () => {
        const headers = await getHeaders();
        //console.log('TRETMENT DATE', treatmentDate);
        const updatedItems = [...PatientTreatmentData];
        //console.log("UPDATED ITEMS", updatedItems);
        const selectedproviderID = provider.filter(item => item.providerName == providerName);
        //console.log('ID', selectedproviderID);

        const filteredTreatment = PatientTreatmentData.find((item) => item.patientTreatmentDoneID === mypatientTreatmentDoneID);
        //console.log('Filtered Data Edit Function', filteredTreatment);
        //console.log("Treatment Status", service);
        if (getDiscountedPrice() == undefined || getDiscountedPrice() < 0) {
            // Snackbar.show({
            //     text: 'Negative price calculation! Please check cost and discount.',
            //     duration: Snackbar.LENGTH_SHORT,
            //     backgroundColor: 'red',
            //     fontFamily: 'Poppins-Medium',
            //     fontSize: 10
            // });
           // alert('Please enter valid discount amount.')
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Invalid discount',
                text2: 'Please enter valid discount amount.',
            });
            return;
        }

        const formData = {
            lastUpdatedOn: date.toISOString(),
            patientTreatmentID: "00000000-0000-0000-0000-000000000000",
            patientID: mypatientID,
            treatmentStatus: parseInt(service),
            providerId: selectedproviderID[0].providerID,
            treatmentPayment: 0,
            treatmentDate: treatmentDate,
            treatmentCost: parseFloat(originalPrice),
            treatmentBalance: getDiscountedPrice(),
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
            treatmentDiscount: parseFloat(discountAmount),
            treatmentTax: 0,
            netTreatmentCost: getDiscountedPrice(),
            parentPatientTreatmentDoneID: "00000000-0000-0000-0000-000000000000",
            treatmentWiseTotalPayment: 0,
            treatmentWiseBalance: 0,
            isTreatmentStepSettings: false,
            patientTreatmentDTOCount: 0,
            title: null,
            treatmentTypeID: "00000000-0000-0000-0000-000000000000",
            amount: 0,
            amountToBeCollected: 0,
            waitingAreaID: "00000000-0000-0000-0000-000000000000",
            treatmentTotalCost: getDiscountedPrice(),
            patientTreatmentDoneID: mypatientTreatmentDoneID,
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
            patientPaymentSummary: {
                patientID: mypatientID,
                netTreatmentCost: getDiscountedPrice(),
                paid: 0,
                balance: 0,
                discount: 0,
                billedTreatmentCost: 0,
                nonBilledTreatmentCost: 0,
                billedDiscount: 0,
                nonBilledDiscount: 0,
                settledPayment: 0,
                nonSettledPaid: 0,
                refundAmount: 0,
                currencySymbol: null,
                billedBalance: 0,
                invoiceNumber: null
            },
            patientTreatmentHeaderChildListDTO: [],
            patientTreatmentDTO: [],
            nonbilledBalanceAmount: 0,
            billedAmount: 0,
            discountValue: parseInt(discountPercentage),
            discountType: value,
            isBillGenrate: false,
            isPaymentAccept: false,
            clinicID: myClinicID,
            treatmentTotalPayment: 0,
            lastUpdatedBy: userName
        }

        // let formData = [...PatientTreatmentData];
        // formData.lastUpdatedOn = date.toISOString(),
        //     formData.patientID = mypatientID,
        //     formData.treatmentStatus = parseInt(service),
        //     formData.providerId = selectedproviderID[0].providerID,
        //     formData.treatmentDate = date.toISOString(),
        //     formData.treatmentDiscount = parseFloat(originalPrice) - getDiscountedPrice(),
        //     formData.treatmentCost = parseFloat(originalPrice),
        //     formData.treatmentTotalCost = getDiscountedPrice(),
        //     formData.patientTreatmentHeaderChildListDTO = [],
        //     formData.patientTreatmentDTO = []

        if (PatientTreatmentData && PatientTreatmentData.length > 0) {
            for (let i = 0; i < PatientTreatmentData.length; i++) {
                if (PatientTreatmentData[i].patientTreatmentDoneID === mypatientTreatmentDoneID) {
                    let arrObj1 =
                    {
                        lastUpdatedOn: date.toISOString(),
                        patientTreatmentID: "00000000-0000-0000-0000-000000000000",
                        patientID: mypatientID,
                        treatmentStatus: parseInt(service),
                        providerId: selectedproviderID[0].providerID,
                        treatmentPayment: 0,
                        treatmentDate: treatmentDate,
                        treatmentCost: parseFloat(originalPrice),
                        treatmentBalance: getDiscountedPrice(),
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
                        treatmentDiscount: parseFloat(discountAmount),
                        treatmentTax: 0,
                        netTreatmentCost: getDiscountedPrice(),
                        parentPatientTreatmentDoneID: "00000000-0000-0000-0000-000000000000",
                        treatmentWiseTotalPayment: 0,
                        treatmentWiseBalance: 0,
                        isTreatmentStepSettings: false,
                        patientTreatmentDTOCount: 0,
                        title: treatmentType,
                        treatmentTypeID: mytreatmentTypeID,
                        amount: 0,
                        amountToBeCollected: 0,
                        waitingAreaID: "00000000-0000-0000-0000-000000000000",
                        treatmentTotalCost: getDiscountedPrice(),
                        patientTreatmentDoneID: mypatientTreatmentDoneID,
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
                        patientPaymentSummary: {
                            patientID: mypatientID,
                            netTreatmentCost: getDiscountedPrice(),
                            paid: 0,
                            balance: 0,
                            discount: 0,
                            billedTreatmentCost: 0,
                            nonBilledTreatmentCost: 0,
                            billedDiscount: 0,
                            nonBilledDiscount: 0,
                            settledPayment: 0,
                            nonSettledPaid: 0,
                            refundAmount: 0,
                            currencySymbol: null,
                            billedBalance: 0,
                            invoiceNumber: null
                        },
                        patientTreatmentHeaderChildListDTO: [
                            null
                        ],
                        patientTreatmentDTO: [
                            {
                                patientTreatmentID: "00000000-0000-0000-0000-000000000000",
                                patientTreatmentDoneID: mypatientTreatmentDoneID,
                                patientTreatmentTypeDoneID: mypatientTreatmentTypeDoneID,
                                patientID: mypatientID,
                                isInvoiceGenerated: false,
                                providerID: selectedproviderID[0].providerID,
                                teethTreatment: selectedTeeth.toString(),
                                displayTeethTreatment: selectedTeeth.toString(),
                                title: treatmentType,
                                treatmentDetails: null,
                                treatmentCost: parseFloat(originalPrice),
                                treatmentBalance: getDiscountedPrice(),
                                treatmentPayment: 0,
                                addedBy: userName,
                                addedOn: date.toISOString(),
                                lastUpdatedBy: userName,
                                lastUpdatedOn: date.toISOString(),
                                treatmentDate: treatmentDate,
                                dtTreatment: null,
                                providerDTO: {
                                    providerSlotDTOlst: [
                                        {
                                            providerSlotID: "00000000-0000-0000-0000-000000000000",
                                            providerID: selectedproviderID[0].providerID,
                                            startDateTime: date.toISOString(),
                                            endDateTime: date.toISOString(),
                                            slotInterval: 0,
                                            createdOn: date.toISOString(),
                                            createdBy: userName,
                                            lastUpdatedOn: date.toISOString(),
                                            lastUpdatedBy: userName,
                                            isDeleted: false
                                        }
                                    ],
                                    providerID: selectedproviderID[0].providerID,
                                    providerName: null,
                                    location: null,
                                    phoneNumber: null,
                                    email: null,
                                    experience: null,
                                    lastUpdatedBy: userName,
                                    lastUpdatedOn: date.toISOString(),
                                    isDeleted: false,
                                    providerImage: null,
                                    isDel: false,
                                    sequence: 0,
                                    registrationNumber: null,
                                    category: null,
                                    attribute1: null,
                                    attribute2: null,
                                    attribute3: null,
                                    proImagePath: null,
                                    isSelected: false,
                                    displayInAppointmentsView: false,
                                    showAllProviders: false,
                                    userClinicInfoID: "00000000-0000-0000-0000-000000000000",
                                    clinicID: myClinicID
                                },
                                lookUpDTO: {
                                    id: "00000000-0000-0000-0000-000000000000",
                                    clinicID: myClinicID,
                                    itemID: 0,
                                    itemTitle: null,
                                    itemDescription: null,
                                    gender: null,
                                    itemCategory: null,
                                    isDeleted: false,
                                    importance: 0,
                                    lastUpdatedBy: userName,
                                    lastUpdatedOn: date.toISOString(),
                                    rowguid: "00000000-0000-0000-0000-000000000000",
                                    recordCount: 0,
                                    medicalTypeID: "00000000-0000-0000-0000-000000000000",
                                    patientAttributeData: null,
                                    patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
                                },
                                flag: false,
                                providerInchargeID: "00000000-0000-0000-0000-000000000000",
                                dateoftreatment: null,
                                rowguid: "00000000-0000-0000-0000-000000000000",
                                rowStatus: "Edited",
                                isExpanded: false,
                                treatmentAddition: 0,
                                treatmentDiscount: parseFloat(discountAmount) || 0,
                                treatmentTax: 0,
                                netTreatmentCost: getDiscountedPrice(),
                                treatmentTotalCost: getDiscountedPrice(),
                                treatmentTypeID: mytreatmentTypeID,
                                treatmentType: treatmentType,
                                treatmentSubType: null,
                                treatmentSubTypeID: "00000000-0000-0000-0000-000000000000",
                                teethTreatmentNote: note,
                                treatmentStatus: parseInt(service),
                                discountValue: parseFloat(discountPercentage),
                                discountType: value,
                                treatmentSummary: null,
                                examinationChartDetailID: "00000000-0000-0000-0000-000000000000"
                            }
                        ],
                        nonbilledBalanceAmount: 0,
                        billedAmount: 0,
                        discountValue: parseFloat(discountPercentage),
                        discountType: value,
                        isBillGenrate: false,
                        isPaymentAccept: false,
                        clinicID: myClinicID,
                        treatmentTotalPayment: 0,
                        lastUpdatedBy: userName
                    }
                    formData.patientTreatmentHeaderChildListDTO.push(arrObj1)
                }
            }
        }
        if (PatientTreatmentData && PatientTreatmentData.length > 0) {
            for (let i = 0; i < PatientTreatmentData.length; i++) {
                if (PatientTreatmentData[i].patientTreatmentDoneID === mypatientTreatmentDoneID) {
                    let arrObj2 =
                    {
                        patientTreatmentID: "00000000-0000-0000-0000-000000000000",
                        patientTreatmentDoneID: mypatientTreatmentDoneID,
                        patientTreatmentTypeDoneID: mypatientTreatmentTypeDoneID,
                        patientID: mypatientID,
                        isInvoiceGenerated: false,
                        providerID: selectedproviderID[0].providerID,
                        teethTreatment: selectedTeeth.toString(),
                        displayTeethTreatment: selectedTeeth.toString(),
                        title: treatmentType,
                        treatmentDetails: null,
                        treatmentCost: parseFloat(originalPrice),
                        treatmentBalance: getDiscountedPrice(),
                        treatmentPayment: 0,
                        addedBy: userName,
                        addedOn: date.toISOString(),
                        lastUpdatedBy: userName,
                        lastUpdatedOn: date.toISOString(),
                        treatmentDate: treatmentDate,
                        dtTreatment: null,
                        providerDTO: {
                            providerSlotDTOlst: [
                                {
                                    providerSlotID: "00000000-0000-0000-0000-000000000000",
                                    providerID: selectedproviderID[0].providerID,
                                    startDateTime: date.toISOString(),
                                    endDateTime: date.toISOString(),
                                    slotInterval: 0,
                                    createdOn: date.toISOString(),
                                    createdBy: userName,
                                    lastUpdatedOn: date.toISOString(),
                                    lastUpdatedBy: userName,
                                    isDeleted: false
                                }
                            ],
                            providerID: selectedproviderID[0].providerID,
                            providerName: null,
                            location: null,
                            phoneNumber: null,
                            email: null,
                            experience: null,
                            lastUpdatedBy: userName,
                            lastUpdatedOn: date.toISOString(),
                            isDeleted: false,
                            providerImage: null,
                            isDel: false,
                            sequence: 0,
                            registrationNumber: null,
                            category: null,
                            attribute1: null,
                            attribute2: null,
                            attribute3: null,
                            proImagePath: null,
                            isSelected: false,
                            displayInAppointmentsView: false,
                            showAllProviders: false,
                            userClinicInfoID: "00000000-0000-0000-0000-000000000000",
                            clinicID: myClinicID
                        },
                        lookUpDTO: {
                            id: "00000000-0000-0000-0000-000000000000",
                            clinicID: myClinicID,
                            itemID: 0,
                            itemTitle: null,
                            itemDescription: null,
                            gender: null,
                            itemCategory: null,
                            isDeleted: false,
                            importance: 0,
                            lastUpdatedBy: userName,
                            lastUpdatedOn: date.toISOString(),
                            rowguid: "00000000-0000-0000-0000-000000000000",
                            recordCount: 0,
                            medicalTypeID: "00000000-0000-0000-0000-000000000000",
                            patientAttributeData: null,
                            patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
                        },
                        flag: false,
                        providerInchargeID: "00000000-0000-0000-0000-000000000000",
                        dateoftreatment: null,
                        rowguid: "00000000-0000-0000-0000-000000000000",
                        rowStatus: "Edited",
                        isExpanded: false,
                        treatmentAddition: 0,
                        treatmentDiscount: parseFloat(discountAmount) || 0,
                        treatmentTax: 0,
                        netTreatmentCost: getDiscountedPrice(),
                        treatmentTotalCost: getDiscountedPrice(),
                        treatmentTypeID: mytreatmentTypeID,
                        treatmentType: treatmentType,
                        treatmentSubType: null,
                        treatmentSubTypeID: "00000000-0000-0000-0000-000000000000",
                        teethTreatmentNote: note,
                        treatmentStatus: parseInt(service),
                        discountValue: parseFloat(discountPercentage),
                        discountType: value,
                        treatmentSummary: null,
                        examinationChartDetailID: "00000000-0000-0000-0000-000000000000"
                    }
                    formData.patientTreatmentDTO.push(arrObj2)
                }
            }
        }

       // console.log("Edit Treatment Form Data", formData);

        try {
            Axios.post(`${Api}Patient/SavePatientTreatment`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                if (resp.data) {
                    // Snackbar.show({
                    //     text: 'Edit treatment sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'Edit treatment sucessfully.',
                        //text2: 'Please enter valid discount amount.',
                    });
                   // alert('Edit treatment sucessfully.');
                    navigation.goBack('Treatment', {
                        clinicID: myClinicID,
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
            <ScrollView>
                <View style={{ marginTop: 10, marginLeft: 5 }}>
                    <Text style={{ color: '#2196f3', fontFamily: 'Poppins-Bold', fontSize: regularFontSize, fontWeight: 500, margin: 10 }}>{treatmentType}</Text>
                </View>
                <View style={CommonStylesheet.container}>
                    <Stack space={2} w="100%" mx="auto" mt={1}>
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
                        {toothCount > 1 ?
                            <Input
                                size="lg"
                                keyboardType='numeric'
                                style={Styles.inputPlaceholder}
                                borderRadius={5}
                                placeholderTextColor={'#808080'}
                                height={height * 0.07}
                                placeholder="Selected Tooth"
                                value={selectedTeeth}
                                aria-disabled
                            /> : <View></View>
                        }
                        <Input
                            size="lg"
                            keyboardType='numeric'
                            onChangeText={value => setOriginalPrice(value)}
                            style={Styles.inputPlaceholder}
                            borderRadius={5}
                            placeholderTextColor={'#808080'}
                            height={height * 0.07}
                            placeholder="Cost"
                            value={originalPrice}
                        />
                        <Input
                            size="lg"
                            keyboardType='numeric'
                            onChangeText={value => setDiscountPercentage(value)}
                            style={Styles.inputPlaceholder}
                            borderRadius={5}
                            placeholderTextColor={'#808080'}
                            placeholder="Discount Value"
                            height={height * 0.07}
                            value={discountPercentage}
                        />



                        {/* <RadioButtonGroup
                            name="exampleGroup"
                            value={value}
                            onChange={(nextValue) => {
                                setValue(nextValue);
                            }}
                            accessibilityLabel="pick a size"
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButtonItem value="NUMBER">
                                    <Text style={Styles.Text1}>Discount in number</Text>
                                </RadioButtonItem>
                                <RadioButtonItem value="PERCENT" style={{ marginLeft: 5 }}>
                                    <Text style={Styles.Text1}>Discount in percent</Text>
                                </RadioButtonItem>
                            </View>
                        </RadioButtonGroup> */}

                        <RadioButton.Group
                            onValueChange={nextValue => setValue(nextValue)}
                            value={value}
                        >
                            <View style={Styles.row}>
                                <View style={Styles.radioButtonContainer}>
                                    <RadioButton
                                        value="NUMBER"
                                        color="#2196f3"
                                        uncheckedColor="gray"
                                    />
                                    <Text style={Styles.Text}>Discount in number</Text>
                                </View>
                                <View style={Styles.radioButtonContainer}>
                                    <RadioButton
                                        value="PERCENT"
                                        color="#2196f3"
                                        uncheckedColor="gray"
                                    />
                                    <Text style={Styles.Text}>Discount in percent</Text>
                                </View>
                            </View>
                        </RadioButton.Group>

                        {/* <Text style={Styles.totalCost}>
                                Discount Amount : {getDiscounte()} /-
                            </Text> */}
                        {/* <Input size="lg" value={cost} style={Styles.inputPlaceholder} borderRadius={10} placeholderTextColor={'#000'} placeholder="Total Cost" fontFamily={'Poppins-Regular'} /> */}

                        {/* <Input size="lg" value={cost} style={Styles.inputPlaceholder} borderRadius={10} placeholderTextColor={'#000'} placeholder="Total Cost" fontFamily={'Poppins-Regular'} /> */}

                        {/* <Input size="lg" style={Styles.inputPlaceholder} borderRadius={10} placeholderTextColor={'#000'} placeholder="Select Teeth" fontFamily={'Poppins-Regular'} /> */}
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            {/* <View style={{ width: '20%', justifyContent: 'center' }}>
                                <Text style={{ marginLeft: 10, marginTop: 10, fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>Status</Text>
                            </View> */}
                            <View style={{ width: '100%', justifyContent: 'center' }}>
                                <Picker
                                    selectedValue={service}
                                    style={{
                                        height: height * 0.07,
                                        borderColor: "#e0e0e0",
                                        fontFamily: 'Poppins-Regular',
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    mt={1} onValueChange={itemValue => setService(itemValue)}>
                                    <Picker.Item label="Status" value={null} />
                                    <Picker.Item label="Planned" value={1} fontFamily={'Poppins-Regular'} />
                                    <Picker.Item label="In Progress" value={2} fontFamily={'Poppins-Regular'} />
                                    <Picker.Item label="Completed" value={3} fontFamily={'Poppins-Regular'} />
                                    <Picker.Item label="Discontinued" value={4} fontFamily={'Poppins-Regular'} />
                                </Picker>
                            </View>

                        </View>

                        <Input
                            size="lg"
                            value={note} onChangeText={(value) => setNote(value)}
                            style={Styles.inputPlaceholder}
                            borderRadius={5}
                            height={height * 0.07}
                            placeholderTextColor={'#808080'}
                            placeholder="Note"


                        />
                        <View style={{ marginTop: 10, marginLeft: 5, }}>

                            <Text style={{ color: '#2196f3', fontFamily: 'Poppins-Bold', fontSize: regularFontSize, fontWeight: 550, margin: 10 }}>
                                Total Cost : {getDiscountedPrice()} /-
                            </Text>
                        </View>
                        {/* <Input size="lg" style={Styles.inputPlaceholder} borderRadius={10} placeholderTextColor={'#808080'} placeholder="Total Cost" fontFamily={'Poppins-Regular'}>{getDiscountedPrice()}</Input> */}

                        <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                            <View style={{}}>
                                <TouchableOpacity onPress={() => updateTreatment()}>
                                    <View style={CommonStylesheet.buttonContainersaveatForm}>
                                        <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Box>

                    </Stack>

                </View>
            </ScrollView>
        </View>
    )
}

export default EditTreatment;

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
    totalCost: {
        fontFamily: 'Poppins-Bold',
        fontSize: regularFontSize,
        color: '#2196f3',
        padding: 10

    },
    Text1: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-Medium'

    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    Text: {
        fontSize: regularFontSize,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular',
        lineHeight: Math.min(width, height) * 0.05, // Adjust as needed

    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        //justifyContent: 'space-between',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
    },


})