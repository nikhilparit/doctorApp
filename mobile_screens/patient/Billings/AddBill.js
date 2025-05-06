import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Alert, } from 'react-native';
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
    Checkbox
} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import { contextData } from "./Bill";
import Calendar from 'react-calendar';
import Axios from "axios";
import Api from "../../../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-calendar/dist/Calendar.css';
import { Picker } from '@react-native-picker/picker';
import { getHeaders } from "../../../utils/apiHeaders";
const { height, width } = Dimensions.get('window');
import Toast from "react-native-toast-message";
const regularFontSize = width < 600 ? 14 : 16;

const AddBill = ({ route }) => {
    // const clinicID = route.params.clinicID;
    const patientID = route.params.patientID;
    ////console.log(clinicID,patientID);
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [token, setToken] = useState('');
    //  const [myclinicID, setclinicID] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [billedAmount, setBilledAmount] = useState(1500);
    const [TreatmentsForPaymentNew, setTreatmentsForPaymentNew] = useState([]);
    const [totalBilledAmount, setTotalBilledAmount] = useState(0);
    const [checkedItems, setCheckedItems] = useState([]);
    const [userName, setuserName] = useState('');
    const [modalVisibleforcal, setModalVisibleforcal] = useState(false);
    const [providerInfo, setProviderInfo] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [cost, setCost] = useState('');
    const [billed, setBilled] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [selectedTreatmentID, setselectedTreatmentID] = useState('');
    const [totalbalance, setTotalBalance] = useState(0);
    const [myclinicID, setmyClinicID] = useState('');
    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyClinicID(user.clinicID);
        setSelectedProvider(user.name);
        setuserName(user.userName);
        const formData = {
            applicationDTO: {
                clinicID: user.clinicID
            },
            searchDTO: {
                parameter: ["0", "1"],
                patientID: patientID
            }
        }

        try {
            const response = await Axios.post(`${Api}Accounts/GetPatientTreatmentsForPaymentNew`, formData, { headers });
            const data = response.data;
            //console.log('GetPatientTreatmentsForPaymentNew', data);

            const displayData = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].nonbilledBalanceAmount > 0) {
                    displayData.push(data[i]);
                }
            }
            ////console.log('displayData',displayData);
            setTreatmentsForPaymentNew(displayData);
            setCheckedItems(new Array(displayData.length).fill(true));
        } catch (error) {
            //console.log(error);
        }
        const formData1 =
        {
            applicationDTO: {
                clinicID: user.clinicID,
            }
        }
        try {
            Axios.post(`${Api}patient/GetProviderInfo`, formData1, { headers }).then(resp => {
                ////console.log('Provider Info', resp.data);
                setProviderInfo(resp.data);
            });
        } catch (error) {
            ////console.log(error);
        }
    }

    useEffect(() => {
        readData();
    }, []);

    // useEffect(() => {
    //     const total = TreatmentsForPaymentNew.reduce((acc, item, index) => {
    //         return (checkedItems[index] && item.nonbilledBalanceAmount > 0) ? acc + parseFloat(item.treatmentCost || 0) : acc;
    //     }, 0);
    //     setTotalBilledAmount(total);
    // }, [checkedItems, TreatmentsForPaymentNew]);
    const calculateTotalBilledAmount = (treatments) => {
        const total = treatments.reduce((acc, item, index) => {
            return (checkedItems[index] && item.nonbilledBalanceAmount > 0) ? acc + parseFloat(item.nonbilledBalanceAmount || 0) : acc;
        }, 0);
        setTotalBilledAmount(total);
    };

    useEffect(() => {
        calculateTotalBilledAmount(TreatmentsForPaymentNew);
    }, [checkedItems, TreatmentsForPaymentNew]);

    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
            ////console.log(formattedDate);
            setSelectedDate(formattedDate);// Assuming this is a Date object
            setModalVisible(false);
            setDate(moment(formattedDate));
        }
    };
    const showDatepicker = () => {
        setShow(true);
    };
    const handleCheckboxChange = (index, amount) => {
        const updatedCheckedItems = [...checkedItems];
        updatedCheckedItems[index] = !updatedCheckedItems[index];
        setCheckedItems(updatedCheckedItems);
    };
    const genarateBill = async () => {
        const headers = await getHeaders();
        if (totalBilledAmount == 0) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please add treatment',
                text2: 'Please add treatment to continue.',
            });
            // alert('Please add treatment');
            return
        }
        ////console.log("genarateBill",TreatmentsForPaymentNew);
        const selectedItems = TreatmentsForPaymentNew.filter((item, index) => checkedItems[index]);
        // //console.log('Selected items:', selectedItems);
        const totalDiscount = selectedItems.reduce((acc, item) => acc + parseFloat(item.treatmentDiscount || 0), 0);
        const totalCost = selectedItems.reduce((acc, item) => acc + parseFloat(item.treatmentCost || 0), 0);

        const formData = {
            clinicID: myclinicID,
            invoiceDate: moment(date).format('YYYY-MM-DDTHH:mm:ss'),
            patientID: patientID,
            invoiceID: "00000000-0000-0000-0000-000000000000",
            treatmentCost: totalCost,
            treatmentAddition: 0,
            treatmentDiscount: totalDiscount,
            treatmentTax: 0,
            treatmentTotalCost: totalBilledAmount,
            createdBy: userName,
            patientInvoicesDetailsDTO: [],
            //totalInvoiceAmount: totalBilledAmount,
            strInvoiceDate: moment(date).format('YYYY-MM-DDTHH:mm:ss'),
            notes: "",
            receiptID: "00000000-0000-0000-0000-000000000000"
        }

        if (selectedItems && selectedItems.length > 0) {
            for (let i = 0; i < selectedItems.length; i++) {
                let arrObj1 =
                {
                    invoiceDetailID: "00000000-0000-0000-0000-000000000000",
                    receiInvoiceIDptID: "00000000-0000-0000-0000-000000000000",
                    patientTreatmentDoneID: selectedItems[i].patientTreatmentDoneID,
                    treatmentDate: selectedItems[i].treatmentDate,
                    treatmentSummary: selectedItems[i].title,
                    teethTreatment: "",
                    treatmentCost: selectedItems[i].treatmentCost,
                    total: 0,
                    treatmentTotalWithTeethCount: 0,
                    treatmentAddition: selectedItems[i].treatmentAddition,
                    treatmentDiscount: selectedItems[i].treatmentDiscount,
                    treatmentTax: selectedItems[i].treatmentTax,
                    treatmentTotalCost: totalBilledAmount,
                    providerID: selectedItems[i].providerId,
                    AddedBy: userName
                }
                formData.patientInvoicesDetailsDTO.push(arrObj1)
            }
            //console.log(formData);

        }
        try {
            const response = Axios.post(`${Api}Accounts/GeneratePatientInvoice`, formData, { headers });
            ////console.log(response);
            Toast.show({
                type: 'success', // Match the custom toast type
                text1: 'Bill geberated succesfully',
                //text2: 'Please select patient to continue.',
            });
            //alert('Bill Generated succesfully.')
            navigation.goBack('TopRoutes', { screen: 'Payments' })

        } catch (error) {
            //console.log(error);
        }
    }

    const handleChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setCost(numericValue);
    };

    const handleChangeBill = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setBilled(numericValue);
    };

    const handleChangeAmount = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setAmount(numericValue);
        if (numericValue > cost) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please check the amount.',
                text2: 'Please check the amount you entered.',
            });
            //alert('Please check the amount you entered.');
            return;
        } else {
            const balance = cost - billed - numericValue;
            setBalance(balance);
        }
    };

    const openModal = (id) => {
        setselectedTreatmentID(id);
        // setCost('');
        // setBilled('');
        // setAmount('');
        //console.log('patientTreatmentDoneID', id);
        const filteredData = TreatmentsForPaymentNew.filter(item => item.patientTreatmentDoneID === id);
        //console.log('filteredData', filteredData);
        if (filteredData.length > 0) {
            setCost(filteredData[0].treatmentCost);
            setBilled(filteredData[0].billedAmount);
            setAmount(filteredData[0].nonbilledBalanceAmount);
            setBalance(filteredData[0].treatmentCost - filteredData[0].treatmentCost);
        }
        setModalVisibleforcal(true);
    };


    const handlePopupBox = () => {
        //console.log(billed, balance, cost, amount);
        const updatedTreatments = TreatmentsForPaymentNew.map(item => {
            if (item.patientTreatmentDoneID === selectedTreatmentID) {
                return {
                    ...item,

                    nonbilledBalanceAmount: amount,
                    // billedAmount: billed,
                    treatmentBalance: cost - billed - balance,
                    // treatmentCost: cost,
                    // treatmentTotalCost: cost - balance
                };
            }
            return item;
        });
        setTreatmentsForPaymentNew(updatedTreatments);
        setModalVisibleforcal(false);
        //console.log('updatedTreatments', updatedTreatments);
    };

    return (
        <>
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
            <Modal isOpen={modalVisibleforcal} onClose={() => setModalVisibleforcal(false)}>
                <Modal.Content maxWidth="500">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Bill</Text></Modal.Header>
                    <Modal.Body>
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
                                    marginBottom: 10,
                                }}
                                onValueChange={itemValue => setSelectedProvider(itemValue)}>
                                {/* <Picker.Item label="Select Doctor" value={null} /> */}
                                {providerInfo.map(item => (
                                    <Picker.Item label={item.providerName} value={item.providerID} style={Styles.fontFamilyForSelectItem} key={item.providerID} />
                                ))}
                            </Picker>
                            <View style={{ marginBottom: 10 }}>
                                <Input value={cost} onChangeText={handleChange} height={height * 0.07}
                                    ari size="lg" style={Styles.inputPlaceholder} keyboardType={'numeric'} borderRadius={5}
                                    placeholder="Cost" fontFamily={'Poppins-Regular'} aria-disabled />
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Input value={billed} onChangeText={handleChangeBill} height={height * 0.07}
                                    size="lg" style={Styles.inputPlaceholder} keyboardType={'numeric'} borderRadius={5}
                                    placeholder="Billed" fontFamily={'Poppins-Regular'} aria-disabled />
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Input value={amount} onChangeText={handleChangeAmount} height={height * 0.07}
                                    size="lg" style={Styles.inputPlaceholder} keyboardType={'numeric'} borderRadius={5}
                                    placeholder="Amount" fontFamily={'Poppins-Regular'} />
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Input value={balance} height={height * 0.07}
                                    size="lg" style={Styles.inputPlaceholder} keyboardType={'numeric'} borderRadius={5}
                                    placeholder="Balance" fontFamily={'Poppins-Regular'} aria-disabled />
                            </View>

                        </View>
                    </Modal.Body>
                    <Modal.Footer>

                        <TouchableOpacity onPress={() => { setModalVisibleforcal(false) }}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}> Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePopupBox()}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}>  Save</Text>
                            </View>
                        </TouchableOpacity>


                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                <ScrollView>

                    <View style={CommonStylesheet.container}>
                        <View style={{ marginTop: 10 }}>
                            <Stack space={3} mx="auto">
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View >
                                        <Input
                                            width={width - 65}
                                            height={height * 0.07}
                                            onFocus={setModalVisible}
                                            style={Styles.inputPlaceholder}
                                            borderRadius={5}
                                            placeholderTextColor={'#808080'}
                                            placeholder="Date"
                                            value={moment(date).format('LL')}></Input>
                                        {show && (
                                            <DateTimePicker
                                                value={date}
                                                mode={'date'}
                                                is24Hour={true}
                                                onChange={onChange}
                                            />
                                        )}
                                    </View>
                                    <View style={{}}>
                                        <TouchableOpacity onPress={() => {
                                            setModalVisible(!modalVisible);
                                        }}>
                                            <Image
                                                source={require('../../../assets/images/calendarDash.png')} alt="logo.png"
                                                style={{ height: 34, width: 36, marginTop: 5 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {TreatmentsForPaymentNew && TreatmentsForPaymentNew.map((item, index) => (
                                    <View style={[Styles.cardatAddBillScreen, CommonStylesheet.shadow]} key={index}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, alignItems: 'center' }}>

                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                marginLeft: 10 // Add some margin if needed to separate the checkbox and text
                                            }}>
                                                <Image
                                                    source={require('../../../assets/images/calendarDash.png')} alt="logo.png"
                                                    style={{ height: 30, width: 30, marginTop: 5 }} />
                                                <Text style={Styles.headertextDailyCollectionScreen}>
                                                    Date:
                                                </Text>
                                                <Text style={CommonStylesheet.hdertxtatDailyCollectionScreen}>
                                                    {moment(item.treatmentDate).format('LL').toString()}
                                                </Text>
                                            </View>
                                            <Checkbox
                                                isChecked={checkedItems[index]}
                                                my={2}
                                                ml={3}
                                                onChange={() => handleCheckboxChange(index, item.treatmentCost)}
                                                colorScheme={'blue'}
                                            />
                                        </View>

                                        <View style={{
                                            height: 0.5,
                                            backgroundColor: '#2196f3',
                                            alignSelf: 'center',
                                            width: '100%',
                                        }} />
                                        <TouchableOpacity onPress={() => openModal(item.patientTreatmentDoneID)}>
                                            <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 5 }}>
                                                <Text style={{ width: width < 600 ? 170 : 170, color: '#2196f3', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                    Treatment Type
                                                </Text>
                                                <Text style={{ width: width < 600 ? 30 : 30, color: '#2196f3', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    :
                                                </Text>
                                                <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    {item.title}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                <Text style={{ width: width < 600 ? 170 : 170, color: '#2196f3', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                    Treatment Cost
                                                </Text>
                                                <Text style={{ width: width < 600 ? 30 : 30, color: '#2196f3', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    :
                                                </Text>
                                                <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    {item.treatmentCost}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                <Text style={{ width: width < 600 ? 170 : 170, color: '#2196f3', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                    Discount
                                                </Text>
                                                <Text style={{ width: width < 600 ? 30 : 30, color: '#2196f3', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    :
                                                </Text>
                                                <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    {item.treatmentDiscount}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                <Text style={{ width: width < 600 ? 170 : 170, color: '#2196f3', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                    Billed
                                                </Text>
                                                <Text style={{ width: width < 600 ? 30 : 30, color: '#2196f3', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    :
                                                </Text>
                                                <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    {item.billedAmount}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                <Text style={{ width: width < 600 ? 170 : 170, color: '#2196f3', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                    Amount to be Billed
                                                </Text>
                                                <Text style={{ width: width < 600 ? 30 : 30, color: '#2196f3', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    :
                                                </Text>
                                                <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    {item.nonbilledBalanceAmount}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                <Text style={{ width: width < 600 ? 170 : 170, color: '#2196f3', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                    Balanced
                                                </Text>
                                                <Text style={{ width: width < 600 ? 30 : 30, color: '#2196f3', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    :
                                                </Text>
                                                <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                    {balance}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                            </Stack>
                        </View>
                        <View style={{
                            height: 1,
                            backgroundColor: '#2196f3',
                            alignSelf: 'center',
                            width: '100%',
                            marginTop: 15,
                            marginBottom: 10

                        }} />
                        <Text style={Styles.headertextDailyCollectionScreen}>Billed Amount {totalBilledAmount} /-</Text>

                        <View style={{ justifyContent: 'center', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => genarateBill()}>
                                <View style={CommonStylesheet.buttonContainersave}>
                                    <Text style={CommonStylesheet.ButtonText}>Generate Bill</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const Styles = StyleSheet.create({
    cardatAddBillScreen: {
        borderRadius: 15,
        height: 'auto',
        width: width - 22,
        backgroundColor: '#ffff',
        marginTop: 10,
        alignSelf: 'center',

    },
    headertextDailyCollectionScreen: {
        fontSize: regularFontSize,
        color: '#000',
        fontFamily: 'Poppins-Regular',
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
    }
})

export default AddBill;
