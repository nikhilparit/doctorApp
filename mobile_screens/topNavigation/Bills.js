import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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
    Divider
} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import { contextData } from "../patient/Billings/Bill";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from "axios";
import Api from "../../api/Api";
import moment from "moment";
const { height, width } = Dimensions.get('window');
import AsyncStorage from "@react-native-async-storage/async-storage";
import Collapsible from 'react-collapsible';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getHeaders } from "../../utils/apiHeaders";
const secondaryCardHeader = Math.min(width, height) * 0.033;
const regularFontSize = width < 600 ? 14 : 16;

const Bills = () => {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const channelName = useContext(contextData);
    const { route, patientInfo } = channelName;
    ////console.log('DATA FROM PATIENT BILLING SCREEN', channelName);
    const [myBill, setMybill] = useState([]);
    const [ledgerID, setselectedledgerID] = useState([])
    const [expandedStates, setExpandedStates] = useState({});
    const [myReceipt, setMyReceipt] = useState([]);
    const [clinicid, setclinicid] = useState('')
    const [token, setToken] = useState('');
    const [userName, setuserName] = useState('');
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    const [myclinicID, setmyclinicID] = useState('');
    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyclinicID(user.clinicID);
        //setSelectedProvider(user.name);
        setuserName(user.userName);
        // const formData =
        // {
        //     clinicID: channelName.params.clinicID,
        //     patientID: channelName.params.patientID,
        //     searchBy: "",
        //     startDate: "2023-01-01",
        //     endDate: "2023-12-31",
        //     pageSize: 0,
        //     pageIndex: 0,
        //     recorCount: 0,
        //     outputParameterDecimal1: 0,
        //     outputParameterDecimal2: 0
        // }
        ////console.log('Data To Pass', formData);
        // try {
        //     Axios.post(`${Api}Patient/GetPatientPassbookForMobile`, formData, { headers }).then(resp => {
        //         const newData = resp.data;
        //         const billData = newData.filter(item => item.type === "Bill");
        //         // //console.log("Bill Data", billData);
        //         setMybill(billData);
        //         const receiptData = newData.filter(item => item.type === "Receipt");
        //         ////console.log("Receipt Data", receiptData);
        //         setMyReceipt(receiptData);
        //     });
        // } catch (error) {
        //     //console.log(error);
        // }
        const formData = {
            applicationDTO: {
                clinicID: user.clinicID,
            },
            searchDTO: {

                pageIndex: 0,
                pageSize: 10,
                patientID: channelName.route.params.patientID,
                startDate: null,
                endDate: null,
                sortOrder: null,
                sortColumn: null,
                search: null
            }
        }
        try {
            Axios.post(`${Api}Accounts/GetPatientInvoice`, formData, { headers }).then(resp => {
                const newData = resp.data;
                setMybill(newData);
                //console.log('NewGetPatientInvoice', newData);
            });

        } catch (error) {
            //console.log(error);
        }
    };
    useFocusEffect(
        useCallback(() => {
            readData();
            ////console.log('Page is focused');

            return () => {
                readData();
                ////console.log('Page is unfocused');

            };
        }, [])
    );
     useEffect(() => {
            readData();
        }, []);
    const toggleExpanded = (ledgerID) => {
        // //console.log(`Toggling ${ledgerID}`);  // Debugging line
        setExpandedStates((prevState) => ({
            ...prevState,
            [ledgerID]: !prevState[ledgerID],
        }));
    };
    const openActionMenu = (id) => {
        setShowModal(!showModal);
        setselectedledgerID(id);
        ////console.log(id);
    }
    const printData = () => {
        navigation.navigate('Print', {
            clinicID: myclinicID,
            patientID: channelName.route.params.patientID,
            viewName: '_PrintInvoice',
            selection: myBill[0].invoiceID,
        });
        setShowModal(false);
    }
    const cancelbill = async () => {
        const headers = await getHeaders();
        ////console.log("invoiceID",ledgerID);
        const formData = {
            invoiceID: ledgerID,
            clinicID: myclinicID,
            cancellationNotes: "",
            lastUpdatedBy: userName
        }
        ////console.log('formData', formData);
        try {
            Axios.post(`${Api}Accounts/CancelPatientInvoice`, formData, { headers }).then(resp => {
                //console.log(resp.data);
            });
            setShowModal(false);
            setconfirmationWindow(false);
            readData();
        } catch (error) {
            //console.log(error);
        }
    }

    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <TouchableOpacity onPress={() => printData()}>
                                <HStack alignItems="center" marginBottom="11"  >
                                    <Text style={{ fontFamily: 'Poppins-Regular' }}>Print</Text>
                                </HStack><Divider />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => alert('Under Working...')}>
                                <HStack alignItems="center" marginBottom="11"  >
                                    <Text style={{ fontFamily: 'Poppins-Regular' }}>Send Email</Text>
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setconfirmationWindow(true)}>
                                <HStack alignItems="center" marginBottom="11"  >
                                    <Text style={{ fontFamily: 'Poppins-Regular' }}>Cancel Bill</Text>
                                </HStack>
                            </TouchableOpacity>
                        </VStack>
                    </Modal.Body>

                </Modal.Content>
            </Modal>
            <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to cancel this record ?</Text>
                    </Modal.Body>
                    <Modal.Footer>



                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => {
                                setShowModal(false)
                                setconfirmationWindow(false)
                            }}>
                                <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                    <Text style={CommonStylesheet.ButtonText}>No</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { cancelbill() }}>
                                <View style={CommonStylesheet.buttonContainersave1}>
                                    <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>


                <ScrollView>
                    <View style={CommonStylesheet.container}>

                        <View style={{ marginTop: 6, justifyContent: 'flex-end', flexDirection: 'row', width: '100%' }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AddBill', {
                                    clinicID: channelName.route.params.clinicID,
                                    patientID: channelName.route.params.patientID

                                })}
                            >
                                <View style={[Styles.buttonContainer, { flexDirection: 'row' }]}>
                                    <Icon name="file-invoice-dollar" size={20} color={'white'} style={{ flexDirection: 'row', marginRight: 5 }} />
                                    <Text style={CommonStylesheet.ButtonText}>Generate Bill
                                        {/* ( {channelName.patientInfo.treatmentsCount} ) */}
                                        {/* ( { myBill.length } ) */}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        </View>


                        <View style={{
                            height: 0.5,
                            backgroundColor: 'gray',
                            alignSelf: 'center',
                            width: '100%',
                            marginTop: 10
                            //    marginTop:2
                        }} />
                        <View style={{ width: '100%' }}>
                            {myBill &&
                                myBill.map((item) =>
                                    <View style={{ margin: 5, backgroundColor: 'white' }}>

                                        <TouchableOpacity onPress={() => toggleExpanded(item.invoiceID)}>
                                            <View style={Styles.header}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={Styles.headerText}>{moment(item.invoiceDate).format('LL')}</Text>
                                                    {/* <Text style={Styles.headerText}> {item.type}</Text> */}
                                                    <Text style={Styles.headerText}> {item.details}</Text>
                                                    <Text style={Styles.headerText}>Bill Amount: {item.treatmentTotalCost} /-</Text>
                                                    <Icon name="caret-down" size={22} color={'white'} style={{ flexDirection: 'row', marginTop: 3 }} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                        <Collapsible open={expandedStates[item.invoiceID]}>
                                            <View style={[Styles.content, { height: 'auto' }]}>
                                                <View style={{ flexDirection: 'row', fontWeight: 500, width: '100%', justifyContent: 'space-between', marginTop: -10 }}>

                                                    <Text style={{ textAlign: 'left', marginLeft: -12, fontSize: 16, fontFamily: 'Poppins-Regular' }}>
                                                        <Icon name="user" size={15} color={"#2196f3"} />
                                                        <Text style={{ marginLeft: 5 }}> {item.providerName}</Text>

                                                    </Text>

                                                    <TouchableOpacity onPress={() => openActionMenu(item.invoiceID)}>
                                                        <View style={{ justifyContent: 'center', marginRight: -10 }}>
                                                            <Icon name="ellipsis-v" size={15} color={"#2196f3"} />
                                                        </View>

                                                    </TouchableOpacity>


                                                </View>

                                                <View style={{
                                                    marginTop: 10,
                                                    height: 0.5,
                                                    backgroundColor: '#005599',
                                                    alignSelf: 'center',
                                                    width: '120%',
                                                }} />

                                            </View>
                                            <View style={[{ marginLeft: 10, marginBottom: 10, backgroundColor: '#fff', width: '100%' }]}>
                                                <TouchableOpacity onPress={() => openModal(item.invoiceID)}>
                                                    <View key={item.invoiceID} >
                                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                                            <Text style={{ width: width < 600 ? 250 : 170, color: 'black', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                Bill No
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                :{'       '}
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                {item.invoiceNumber}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                                            <Text style={{ width: width < 600 ? 250 : 170, color: 'black', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                Bill Amount
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                :{'        '}
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                Rs  {item.treatmentTotalCost == 0 ? <Text>-</Text> : item.treatmentTotalCost}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                                            <Text style={{ width: width < 600 ? 250 : 170, color: 'black', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                Treatment Total Payment
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                :{''}
                                                            </Text>

                                                            <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                Rs {item.treatmentTotalPayment == 0 ? <Text>-</Text> : item.treatmentTotalPayment}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                                            <Text style={{ width: width < 600 ? 250 : 170, color: 'black', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                Status
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                :{'       '}
                                                            </Text>
                                                            {item.paymentStatus == 'Paid' ?
                                                                <Text style={{ width: width < 600 ? 250 : 150, color: 'green', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                    {item.paymentStatus}
                                                                </Text> : (item.paymentStatus == 'Cancelled' ?
                                                                    <Text style={{ width: width < 600 ? 250 : 150, color: 'red', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                        {item.paymentStatus}
                                                                    </Text> :
                                                                    <Text style={{ width: width < 600 ? 250 : 150, color: '#1287A5', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                        {item.paymentStatus}
                                                                    </Text>
                                                                )}
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                        </Collapsible>
                                    </View>
                                )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const Styles = StyleSheet.create({

    iconDot: {
        marginRight: 20,
        marginTop: -6
    },
    cardatBillsScreen: {
        width: width,
        backgroundColor: '#ffff',
        margin: 10,

    },
    hdertxtatBillsScreen: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    fab: {
        position: 'absolute',
        backgroundColor: '#2196f3',
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    hdertxt: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    //from treastment list 
    content: {
        padding: 20,
        backgroundColor: '#fff',
        width: '100%',


    },
    cardtext: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom:5,
        // marginTop:5

    },
    line: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',
        paddingBottom: 5, // Adjust as needed
    },
    imageatQualification1: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // borderWidth: 1,
        width: 70,
        height: 70,
        borderRadius: 10,
        // marginTop: 20,
        alignSelf: 'center'

    },
    containerPatientInfo: {
        // borderColor: 'green',
        // borderWidth: 2,
        width: '100%',
        height: '100%',
        //padding: 10
    },

    cardContainer: {
        width: '100%',
        padding: 10,
        // borderColor: 'green',
        // borderWidth: 2,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    initialsContainer: {
        width: height / 11,
        height: height / 11,
        borderRadius: height / 11,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialsText: {
        fontSize: secondaryCardHeader,
        color: 'white',
        fontFamily: 'Poppins-Bold',
        textAlign: 'center'
    },

    highlighted: {
        backgroundColor: 'yellow',
        fontFamily: 'Poppins-Bold',
        fontSize: secondaryCardHeader,
    },
    medicalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: secondaryCardHeader,
    },
    fab: {
        position: 'absolute',
        backgroundColor: '#2196f3',
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        width: 150,
        height: 40,
        backgroundColor: '#2196f3',
        borderColor: '#1c80cf',
        borderRadius: 5,
        margin: 5
    },
    imageContainer: {
        width: width - 0,
        height: 200,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: -40
    },
    hdertexttreatScreen: {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },
    hdertxttreatScreen: {
        fontSize: 12,
        color: '#00bc00',
        fontFamily: 'Poppins-SemiBold',
        // marginLeft: 10
    },
    hdertxttreatcollapseScreen: {
        fontSize: 12,
        color: '#e5da00',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 10
    },

    header: {
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#90caf9',
        padding: 10,
    },
    headerText: {
        textAlign: 'left',
        fontSize: regularFontSize,
        fontWeight: '500',
        marginTop: 5,
        fontFamily: 'Poppins-Bold'

    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        width: '100%',
        height: 150,

    },
    userImage: {
        justifyContent: 'flex-start',
        width: 80,
        height: 80,
        borderRadius: 55,
        marginVertical: 70,
        marginHorizontal: 20
    },
    cardTreatment: {
        height: 350,
        width: width - 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 12,
    },
    treatmentDate: {
        marginLeft: 10
    },
    providerName: {
        marginRight: 10
    },
    initialsText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Poppins-Bold',
        marginTop: 5
    },
    statusPlanned: {
        fontSize: regularFontSize,
        color: 'blue',
        fontFamily: 'Poppins-SemiBold',

    },
    statusInprogress: {
        fontSize: 14,
        color: '#00bc00',
        fontFamily: 'Poppins-SemiBold',

    },
    statusComplete: {
        fontSize: 14,
        color: 'green',
        fontFamily: 'Poppins-SemiBold',

    },
    statusDiscountinues: {
        fontSize: 14,
        color: 'red',
        fontFamily: 'Poppins-SemiBold',

    },
    highlighted: {
        backgroundColor: 'yellow',
        fontFamily: 'Poppins-Bold',
        fontSize: 12,
    },
    medicalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    }
})



export default Bills;