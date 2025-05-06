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
    Checkbox,
} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import Axios from "axios";
import Api from "../../../api/Api";
import { getHeaders } from "../../../utils/apiHeaders";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get('window');

const AddPayment = ({ route }) => {
    //const clinicID = route.params.clinicID;
    const patientID = route.params.patientID;
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();
    const [groupValues, setGroupValues] = React.useState([]);
    const [service, setService] = React.useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [userName, setuserName] = useState('');
    // const [myclinicID, setclinicID] = useState('');
    const [token, setToken] = useState('');
    const [category, setCategory] = useState([]);
    const [oldtreatmentCost, setoldTretmentcost] = useState(0);
    const [advanceamtequalcost, setadvanceamtequalcost] = useState(0);
    const [treatmentTotalCost, settreatmentTotalCost] = useState(0);
    const [advanceAmount, setAdvanceAmount] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [payNowAmount, setPayNowAmount] = useState(0);
    const [patientAdvancedAmount, setPatientAdvancedAmount] = useState(0);
    const [remainingAdvance, setRemainingAdvance] = useState(0);
    const [dueAfterPayment, setDueAfterPayment] = useState(0);
    const [chequeNo, setchequeNumber] = useState('');
    const [bankAccNo, setbankAccNo] = useState('');
    const [myclinicID, setmyClinicID] = useState('');
    const [isChecked, setIsChecked] = React.useState(true);

    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyClinicID(user.clinicID);
        // setSelectedProvider(user.name);
        setuserName(user.userName);
        const formData =
        {
            clinicID: user.clinicID,
            patientID: patientID,
            isGetforInvoices: false

        }

        try {
            const response = await Axios.post(`${Api}Accounts/GetPatientTreatmentsForPayment`, formData, { headers });
            const data = response.data;
            //console.log('GetPatientTreatmentsForPaymentNew', data);
            const totalCost = data.reduce((acc, item) => {
                if (item.treatmentBalance > 0) {
                    return acc + parseFloat(item.treatmentBalance || 0);
                }
                return acc;
            }, 0);
            // settreatmentTotalCost(totalCost);
            setoldTretmentcost(totalCost);
            setadvanceamtequalcost(totalCost);
            setTotalCost(totalCost);
        } catch (error) {
            //console.log(error);
        }
        try {
            // First API Call
            const response2 = await Axios.post(
                `${Api}Setting/GetApplicationLookupsDetailByCategory?ItemCategory=ModeOfPayment&ClinicID=${user.clinicID}`,
                {},
                { headers }
            );
            //console.log('New Data', response2.data);

            // Second API Call
            const formData1 = {
                clinicID: user.clinicID,
                search: "",
                itemCategory: 'ModeOfPayment',
                pageIndex: 0,
                pageSize: 0
            };
            const response = await Axios.post(
                `${Api}Setting/GetLookUpsByCategoryForMobile`,
                formData1,
                { headers }
            );
            //console.log('Get Look Ups By Category For Mobile', response.data);

            // Combine Results
            if (Array.isArray(response2.data) && Array.isArray(response.data)) {
                setCategory([...response2.data, ...response.data]);
            } else {
                console.error('Unexpected response format:', response2.data, response.data);
            }
        } catch (error) {
            console.error('Error in API calls:', error.response || error.message);
        }
        const formData2 =
        {
            patientID: patientID,
            // receiptId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            //clinicID:clinicID
        }

        try {
            Axios.post(`${Api}Accounts/GetPatientAdvancedAmountByPatientID`, formData2, { headers }).then(resp => {
                setPatientAdvancedAmount(resp.data);
                setAdvanceAmount(resp.data.advancedAmount);
                //console.log("GetPatientAdvancedAmountByPatientID", resp.data);
            })
        } catch (error) {
            //console.log(error);
        }


    }
    useEffect(() => {
        readData();
    }, []);
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

    // const calculatePayment = () => {
    //     var advamount = 0;
    //     var totamount = 0;
    //     var PayNowamount = 0;
    //     totamount = totalCost;
    //     if (isNaN(totamount)) {
    //         totamount = 0;
    //     }
    //     advamount = patientAdvancedAmount.advancedAmount;
    //     if (isNaN(advamount)) {
    //         advamount = 0;
    //     }
    //     if (advamount > 0) {
    //         //////////
    //         $("#payFromAdvance").show();
    //         if (advamount > totamount) {
    //             PayNowamount = 0;
    //             var amt = advamount - totamount;
    //             $("#payFromAdvance").val(totamount);
    //         }
    //         else {
    //             PayNowamount = totamount - advamount;
    //             $("#payFromAdvance").val(advamount);
    //             // $("#lblfinalamount").html(PayNowamount);
    //             $("#dueadv").html(PayNowamount);
    //         }
    //     }
    //     else {
    //         PayNowamount = totamount;
    //     }
    //     $("#payNow").val(PayNowamount);

    //     if (PayNowamount == 0) {
    //         $("#payNow").val("");
    //     }
    //     var pval = $("#payFromAdvance").val();
    //     if (pval == 0) {
    //         $("#payFromAdvance").val("");
    //     }
    // };


    // const calculatePayment = () => {
    //     let advAmount = patientAdvancedAmount.advancedAmount || 0;
    //     let totAmount = totalCost || 0;

    //     let payNowAmount;
    //     if (advAmount > 0) {
    //         if (advAmount > totAmount) {
    //             payNowAmount = 0;
    //             setRemainingAdvance(advAmount - totAmount);
    //         } else {
    //             payNowAmount = totAmount - advAmount;
    //             setRemainingAdvance(0);
    //         }
    //         setAdvanceAmount(advAmount);
    //     } else {
    //         payNowAmount = totAmount;
    //     }

    //     setPayNowAmount(payNowAmount);
    //     setDueAfterPayment(payNowAmount);

    //     // Reset payNow and payFromAdvance fields if needed
    //     if (payNowAmount === 0) {
    //         setPayNowAmount('');
    //     }
    // };
    // useEffect(() => {
    //     calculatePayment();
    // }, [patientAdvancedAmount, totalCost]);

    const calculatePayment = () => {
        let advAmount = patientAdvancedAmount.advancedAmount || 0;
        let totAmount = totalCost || 0;
        let payNowAmt = payNowAmount || 0;
        let payFromAdv = advanceAmount || 0;

        if (advanceAmount > patientAdvancedAmount.advancedAmount) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please check the amount.',
                text2: 'Please check the amount you entered.',
            });
            //alert('Please check amount you entered');
            setAdvanceAmount(totalCost);
            return
        }

        // Calculate the amount covered by the advance
        let amountCoveredByAdvance = Math.min(payFromAdv, totAmount);
        let remainingAdvAmount = advAmount - amountCoveredByAdvance;
        //console.log("remainingAdvAmount", remainingAdvAmount);

        // Calculate Due After Payment
        let dueAfterPayment = Math.max(0, totAmount - amountCoveredByAdvance - payNowAmt);
        //console.log("dueAfterPayment", dueAfterPayment);

        // Adjust Advance Amount and Due After Payment based on Pay Now amount
        if (dueAfterPayment === 0) {
            remainingAdvAmount += (payNowAmt - (totAmount - amountCoveredByAdvance));
        }

        setAdvanceAmount(amountCoveredByAdvance);
        setRemainingAdvance(remainingAdvAmount > 0 ? remainingAdvAmount : 0);
        setDueAfterPayment(dueAfterPayment);
    };
    const handleAdvanceChange = (val) => {
        let advanceVal = parseFloat(val);
        if (isNaN(advanceVal)) {
            advanceVal = 0;
        }
        setAdvanceAmount(advanceVal);
    };

    const handlePayNowChange = (val) => {
        let payNowVal = parseFloat(val);
        if (isNaN(payNowVal)) {
            payNowVal = 0;
        }
        setPayNowAmount(payNowVal);
    };
    useEffect(() => {
        calculatePayment();
    }, [patientAdvancedAmount, totalCost, advanceAmount, payNowAmount]);


    const savePayment = async () => {
        const headers = await getHeaders();
        if (payNowAmount == 0 && advanceAmount == 0) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please check the amount.',
                text2: 'Please check the amount you entered.',
            });
            // alert('Please enter some amount.');
            return;
        }
        if (!service) {
            Toast.show({
                type: 'error', // Match the custom toast type
                text1: 'Please select mode of payment.',
                text2: 'Please select mode of payment to continue.',
            });
            //  alert("Please select mode of payment");
            return;
        }

        const formData =
        {
            receiptID: "00000000-0000-0000-0000-000000000000",
            clinicID: myclinicID,
            patientID: patientID,
            paymentDate: moment(date).format('YYYY-MM-DDTHH:mm:ss'),
            paymentTypeID: 0,
            amount: parseInt(payNowAmount),
            modeOfPayment: service,
            chequeNo: chequeNo,
            chequeDate: "2024-07-26T05:21:50.486Z",
            bankName: bankAccNo,
            creditCardBankID: 0,
            creditCardDigit: "string",
            creditCardOwner: "string",
            creditCardValidFrom: "string",
            creditCardValidTo: "string",
            isDeleted: false,
            createdBy: userName,
            lastUpdatedBy: userName,
            finalAdvpayment: advanceAmount,
            advAfterpayment: 0,
        }
        //console.log(formData);

        // if(advanceAmount == 0 && advanceAmount == 0){
        //     alert('Please enter some amount.');
        //     return;
        // }

        try {
            Axios.post(`${Api}Accounts/InsertUpdatePatientPaymentNewForMobile`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Receipt Generated succesfully.',
                    // text2: 'Please select patient to continue.',
                });
                //alert('Receipt Generated succesfully.')
                navigation.goBack('TopRoutes', { screen: 'Payments' })
            })
        } catch (error) {
            //console.log(error);
        }

    };
    return (
        <ScrollView style={{ flex: 1 }}>
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

            <View style={{ backgroundColor: '#f2f8ff' }}>
                <View style={CommonStylesheet.container}>
                    <View style={[Styles.card, CommonStylesheet.shadow]}>
                        <View style={{ margin: 10, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[Styles.hdertxt, { width: 150 }]}>
                                        Total Payable Amount
                                    </Text>
                                    <Text style={[Styles.hdertxt, { width: 10 }]}>
                                        :
                                    </Text>
                                    <Text style={[Styles.hdertxt, { flex: 1, textAlign: 'right', marginRight: 10 }]}>
                                        {oldtreatmentCost}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[Styles.hdertxt, { width: 150 }]}>
                                        Available Advance
                                    </Text>
                                    <Text style={[Styles.hdertxt, { width: 10 }]}>
                                        :
                                    </Text>
                                    <Text style={[Styles.hdertxt, { flex: 1, textAlign: 'right', marginRight: 10 }]}>
                                        {patientAdvancedAmount.advancedAmount}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[Styles.hdertxt, { width: 150 }]}>
                                        Due After Advance
                                    </Text>
                                    <Text style={[Styles.hdertxt, { width: 10 }]}>
                                        :
                                    </Text>
                                    <Text style={[Styles.hdertxt, { flex: 1, textAlign: 'right', marginRight: 10 }]}>
                                        {dueAfterPayment}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Stack space={2} mx="auto">
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Input
                                        width={width - 55}
                                        style={Styles.inputPlaceholder}
                                        borderRadius={10}
                                        onFocus={() => setModalVisible(true)}
                                        placeholderTextColor={'#888888'}
                                        placeholder="Date of Birth"
                                        value={moment(date).format('LL')}
                                    />
                                    {/* DateTimePicker component */}
                                </View>
                                <View style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                        <Image
                                            source={require('../../../assets/images/calendarDash.png')}
                                            style={{ height: 34, width: 36, borderRadius: 5 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {patientAdvancedAmount.advancedAmount > 0 ?

                                <Input
                                    size="lg"
                                    width="100%"
                                    style={Styles.inputPlaceholder}
                                    borderRadius={5}
                                    placeholderTextColor={"#888888"}
                                    placeholder="Pay From Advance"
                                    value={String(advanceAmount)}
                                    onChangeText={handleAdvanceChange}
                                /> :
                                <View>

                                </View>
                            }
                            <Input
                                size="lg"
                                width="100%"
                                style={Styles.inputPlaceholder}
                                borderRadius={5}
                                placeholderTextColor={"#888888"}
                                placeholder="Pay Now"
                                value={String(payNowAmount)}
                                onChangeText={handlePayNowChange}
                            />
                            <View>
                                <Picker
                                    selectedValue={service}
                                    style={{
                                        height: 50,
                                        width: '100%',
                                        borderColor: '#e0e0e0',
                                        fontFamily: 'Poppins-Regular',
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white"
                                    }}
                                    onValueChange={(itemValue) => setService(itemValue)}
                                >
                                    <Picker.Item label="Select Payment Mode" value={null} />
                                    {category.map(item => (
                                        <Picker.Item label={item.itemDescription} value={item.itemTitle} key={item.id} />
                                    ))}
                                </Picker>


                                {service === 'Cheque' && (
                                    <View style={{ marginTop: 10 }}>
                                        <View style={Styles.inputContainer}>
                                            <Input
                                                size="lg"
                                                width='100%'
                                                style={Styles.inputPlaceholder}
                                                borderRadius={5}
                                                placeholderTextColor={"#888888"}
                                                placeholder="Cheque Number"
                                                onChangeText={(val) => setchequeNumber(val)}
                                                value={chequeNo}
                                            />
                                        </View>
                                        <View style={Styles.inputContainer}>
                                            <Input
                                                size="lg"
                                                width='100%'
                                                style={Styles.inputPlaceholder}
                                                borderRadius={5}
                                                placeholderTextColor={"#888888"}
                                                placeholder="Date of Cheque"
                                                value={moment(date).format('LL')}
                                            />
                                        </View>
                                        <View style={Styles.inputContainer}>
                                            <Input
                                                size="lg"
                                                width='100%'
                                                style={Styles.inputPlaceholder}
                                                borderRadius={5}
                                                placeholderTextColor={"#888888"}
                                                placeholder="Bank Name"
                                                onChangeText={(val) => setbankAccNo(val)}
                                                value={bankAccNo}
                                            />
                                        </View>
                                    </View>
                                )}

                            </View>


                            {dueAfterPayment && dueAfterPayment > 0 ?
                                <View>
                                    <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color: 'red' }}>
                                        Due after payment: {dueAfterPayment} /-
                                    </Text>
                                </View> : <View></View>
                            }
                            {remainingAdvance && remainingAdvance > 0 ?
                                <View>
                                    <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color: 'green' }}>
                                        Advance after payment: {remainingAdvance} /-
                                    </Text>
                                </View> :
                                <View></View>}

                            {/* <Checkbox
                                checked={isChecked} // Bind the checked state
                                onChange={() => setIsChecked(!isChecked)} // Toggle state on change
                                style={{ backgroundColor: '#f2f2f2', opacity: 0.5 }}
                            >
                                <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular' }}>Send payment SMS</Text>
                            </Checkbox> */}

                            <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                                <TouchableOpacity onPress={() => savePayment()}>
                                    <View style={CommonStylesheet.buttonContainersaveatForm}>
                                        <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                    </View>
                                </TouchableOpacity>
                            </Box>
                        </Stack>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};


const Styles = StyleSheet.create({

    iconDot: {
        marginRight: 20,
        marginTop: -6
    },
    card: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#2196f3',
        height: 90,
        width: width - 11,
        backgroundColor: '#ffff',

        marginTop: 8,
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#FFFFFF',
        height: height * 0.07
    },
    hdertxt: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginRight: 15
    },
    ButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    headertextDailyCollectionScreen: {
        fontSize: 12,
        // color: '#2196f3',
        color: '#000',
        fontFamily: 'Poppins-Regular',
        marginLeft: 15,
    },
    inputContainer:
    {
        marginBottom: 10,
    },
})

export default AddPayment;