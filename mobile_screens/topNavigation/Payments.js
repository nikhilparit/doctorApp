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
    HStack, Divider
} from 'native-base';
//common styles
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { contextData } from "../patient/Billings/Bill";
import Axios from "axios";
import Api from "../../api/Api";
import moment from "moment";
const { height, width } = Dimensions.get('window');
import AsyncStorage from "@react-native-async-storage/async-storage";
import Collapsible from 'react-collapsible';
import { getHeaders } from "../../utils/apiHeaders";
const secondaryCardHeader = Math.min(width, height) * 0.033;
const regularFontSize = width < 600 ? 14 : 16;


const Payments = () => {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [expandedStates, setExpandedStates] = useState({});
    const channelName = useContext(contextData);
    const { route, patientInfo } = channelName;
    ////console.log('DATA FROM PATIENT BILLING SCREEN', channelName);
    const [myBill, setMybill] = useState([]);
    const [myReceipt, setMyReceipt] = useState([]);
    const [token, setToken] = useState('');
    const readData = async () => {
        const headers = await getHeaders();
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
        // //console.log('Data To Pass', formData);
        // try {
        //     Axios.post(`${Api}Patient/GetPatientPassbookForMobile`, formData, { headers }).then(resp => {
        //         const newData = resp.data;
        //         const billData = newData.filter(item => item.type === "Bill");
        //         //console.log("Bill Data", billData);
        //         setMybill(billData);
        //         const receiptData = newData.filter(item => item.type === "Receipt");
        //         //console.log("Receipt Data", receiptData);
        //         setMyReceipt(receiptData);
        //     });
        // } catch (error) {
        //     //console.log(error);
        // }
        const formData = {
            applicationDTO: {
                clinicID: channelName.route.params.clinicID,
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
            Axios.post(`${Api}Accounts/GetPatientReceipt`, formData, { headers }).then(resp => {
                const newData = resp.data;
                // const unSettalledamt = resp.data.filter(item=>item.unsettledAmount>0)
                setMybill(newData);
                //console.log('GetPatientReceipt', newData);
                // //console.log('unSettalledamt',unSettalledamt);
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
    const toggleExpanded = (ledgerID) => {
        ////console.log(`Toggling ${ledgerID}`);  // Debugging line
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
            clinicID: channelName.route.params.clinicID,
            patientID: channelName.route.params.patientID,
            viewName: '_printreceipt',
            selection: myBill[0].receiptID,
        });
        setShowModal(false);
    }
    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <TouchableOpacity onPress={printData}>
                                <HStack alignItems="center" marginBottom="11"  >
                                    <Text style={{ fontFamily: 'Poppins-Regular' }}>Print</Text>
                                </HStack>
                            </TouchableOpacity>
                            <Divider />

                            <HStack alignItems="center" marginBottom="11"  >
                                <Text style={{ fontFamily: 'Poppins-Regular' }}>Send Email</Text>
                            </HStack>
                        </VStack>
                    </Modal.Body>

                </Modal.Content>
            </Modal>
            <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>

                <ScrollView>
                    <View style={CommonStylesheet.container}>
                        <View style={{ marginTop: 6, justifyContent: 'flex-end', flexDirection: 'row', width: '100%' }}>


                            <TouchableOpacity onPress={() => navigation.navigate('AddPayment', {
                                clinicID: channelName.route.params.clinicID,
                                patientID: channelName.route.params.patientID

                            })}>
                                <View style={[Styles.buttonContainer, { flexDirection: 'row' }]}>
                                    <Icon name="credit-card" size={20} color={'white'} style={{ flexDirection: 'row', marginRight: 5 }} />
                                    <Text style={CommonStylesheet.ButtonText}>Add Payment</Text>
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
                                        <TouchableOpacity onPress={() => toggleExpanded(item.receiptID)}>
                                            <View style={Styles.header}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={Styles.headerText}>{moment(item.receiptDate).format('LL')}</Text>
                                                    <Text style={Styles.headerText}>{item.receiptNumber}</Text>
                                                    <Text style={Styles.headerText}> Payment: {item.treatmentPayment == 0 ? <Text>-</Text> : item.treatmentPayment}</Text>
                                                    <Text style={Styles.headerText}> Status: {item.statusDescription}</Text>
                                                    <Icon name="caret-down" size={22} color={'white'} style={{ flexDirection: 'row', marginTop: 3 }} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                        <Collapsible open={expandedStates[item.receiptID]}>
                                            <View style={[Styles.content, { height: 'auto' }]}>
                                                <View style={{ flexDirection: 'row', fontWeight: 500, width: '100%', justifyContent: 'space-between', marginTop: -10 }}>

                                                    <Text style={{ textAlign: 'left', marginLeft: -12, fontSize: 16, fontFamily: 'Poppins-Regular' }}>
                                                        <Icon name="user" size={15} color={"#2196f3"} />
                                                        <Text style={{ marginLeft: 5 }}>{item.patientName}</Text>

                                                    </Text>

                                                    <TouchableOpacity onPress={() => openActionMenu(item.receiptID)}>
                                                        <View style={{ justifyContent: 'center', marginRight: -10 }}>
                                                            <Icon name="ellipsis-v" size={20} color={"#2196f3"} />
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

                                            <View style={[{ marginLeft: 10, marginBottom: 10, backgroundColor: '#fff' }]}>
                                                <TouchableOpacity >
                                                    <View key={item.receiptID} >
                                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                                            <Text style={{ width: width < 600 ? 100 : 100, color: 'black', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                Receipt
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                :{'       '}
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                {item.receiptNumber}
                                                            </Text>
                                                        </View>
                                                    </View></TouchableOpacity >

                                                <TouchableOpacity >
                                                    <View key={item.receiptID} >
                                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                                            <Text style={{ width: width < 600 ? 100 : 100, color: 'black', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                Amount
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                :{'       '}
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                {item.treatmentPayment == 0 ? <Text>-</Text> : item.treatmentPayment}
                                                            </Text>
                                                        </View>
                                                    </View></TouchableOpacity >
                                                <TouchableOpacity >
                                                    <View key={item.receiptID} >
                                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                                            <Text style={{ width: width < 600 ? 100 : 100, color: 'black', fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize }}>
                                                                Mode
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 30 : 30, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                :
                                                            </Text>
                                                            <Text style={{ width: width < 600 ? 250 : 150, color: 'black', fontFamily: 'Poppins-Regular', fontSize: regularFontSize }}>
                                                                {item.modeofPayment}
                                                            </Text>
                                                        </View>
                                                    </View></TouchableOpacity >



                                            </View>


                                        </Collapsible>
                                    </View>
                                )}</View>

                        {/* {myReceipt.map(item => (
                            <View style={{ marginTop: 10 }}>
                                <View key={item.ledgerID}>
                                    
                                        <View style={{ marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                <Text style={CommonStylesheet.headertextDailyCollectionScreen}>
                                                    Receipt:
                                                </Text>
                                                <Text style={CommonStylesheet.hdertxtatDailyCollectionScreen}>
                                                  {item.details}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                <Text style={CommonStylesheet.headertextDailyCollectionScreen}>
                                                    Amount:
                                                </Text>
                                                <Text style={CommonStylesheet.hdertxtatDailyCollectionScreen}>
                                                   {item.credit}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                                <Text style={CommonStylesheet.headertextDailyCollectionScreen}>
                                                    Mode:
                                                </Text>
                                                <Text style={CommonStylesheet.hdertxtatDailyCollectionScreen}>
                                                    Cash
                                                </Text>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        ))} */}
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
        padding: 10


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
        height: 150,

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
        width: 130,
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

    providerName: {
        marginRight: 10
    },



})


export default Payments;