import React, { useState, useEffect } from "react";
import { View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {
    FormControl,
    Input,
    Text,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    Modal,
    HStack,
    Center,
    NativeBaseProvider,
    Radio,
    Popover,
    Fab
} from 'native-base';
import moment from "moment";
import { CommonStyle } from "../../../commonStyles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from "axios";
import Api from "../../../api/Api";
import Loader from "../../../Components/Loader";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ManageLabItems = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const myclinicID = route.params.clinicID
    //console.log('ClinicID At Manage Lab', myclinicID);
    const today = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
    const [ManageLabItems, setManageLabItems] = useState([]);
    const [ShowModal, setShowModal] = useState(false);
    const [SupplierID, setSupplierID] = useState('');
    const [LabWorkComponentID, setLabWorkComponentID] = useState('');
    //Loader
    const [loading, setLoading] = useState(false);

    //Year wise start date, end date calculations
    const currentYear = moment().format('YYYY');
    const startDate = moment(`${currentYear}-01-01`);
    const endDate = moment(`${currentYear}-12-31`);
    const [confirmationWindow, setconfirmationWindow] = useState(false);

    const readData = () => {
        const formData = {
            clinicID: myclinicID,
        }
        //console.log('Data To Pass', formData);
        setLoading(true);
        try {
            Axios.post(`${Api}Setting/GetLabItemsDetails`, formData).then(resp => {
                //console.log('Get Lab Items Details', resp.data);
                setManageLabItems(resp.data);
                setLoading(false);
            });
        } catch (error) {
            //console.log(error);
        }
    };
    useEffect(() => {
        readData();
    }, [isFocused]);

    const openModal = (id) => {
        //console.log("labSupplierID",id);
        setLabWorkComponentID(id);
        setShowModal(true);
    }

    const printData = () => {
        navigation.navigate('Print', {
            clinicID: myclinicID,
            patientID: patientID,
            viewName: '_PrintReceipt',
            selection: receiptID,
        });
    }
    const onOpendeleteConfirmation = () => {
        setShowModal(false);
        setconfirmationWindow(true);
    }
    const deleteLab = () => {
        const formData = {
            labSupplierID: SupplierID,
            clinicID: myclinicID,
            labSupplierIDCSV: SupplierID,
            key: "Delete"
        }
        console.log('Form Data', formData);
        try {
            Axios.post(`${Api}Setting/InsertUpdateLabSuppliers`, formData).then(resp => {
                //console.log(resp.data);
                setconfirmationWindow(false);
                readData();
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <ScrollView>
                <SafeAreaView>
                    <View>
                        <View style={Styles.containerForHeader}>
                            <Text style={Styles.headerText}>
                                Category
                            </Text>
                            <Text style={Styles.headerText}>
                                Name
                            </Text>
                            <Text style={Styles.headerText}>
                                Description
                            </Text>
                        </View>
                        <View>
                            {ManageLabItems.length == 0 ?
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={CommonStyle.Text}> Data is not availble</Text>
                                </View> :
                                ManageLabItems.map(item => (
                                    <TouchableOpacity onPress={() => openModal(item.labWorkComponentID)} key={item.labWorkComponentID}>
                                        <View style={Styles.containerForSubHeader} key={item.labWorkComponentID}>
                                            <Text style={Styles.headerSubText}>
                                                {item.itemDescription}
                                            </Text>
                                            <Text style={Styles.headerSubText}>
                                                {item.componentName}
                                            </Text>
                                            <Text style={Styles.headerSubText}>
                                                {/* {item.componentDescription} */}
                                                {item.componentDescription.slice(0, Math.floor(item.componentDescription.length / 2))} {`\n`} {item.componentDescription.slice((item.componentDescription.length / 2))}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
            <Fab
                bgColor={'#2196f3'}
                renderInPortal={false} size={'md'} icon={<Icon
                    name="plus"
                    size={20}
                    color={"white"}
                />}
                onPress={() => navigation.navigate('AddNewLabItems', {
                    clinicID: myclinicID
                })}
            />

            <Modal isOpen={ShowModal} onClose={() => setShowModal(false)} size={"lg"}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStyle.Text}>Actions</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <TouchableOpacity style={{ margin: 9 }} onPress={() => navigation.navigate('EditLabItems', {
                            labWorkComponentID: LabWorkComponentID,
                            clinicID: myclinicID
                        })}>
                            <Text style={CommonStyle.Text}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ margin: 9 }} onPress={() => onOpendeleteConfirmation()}>
                            <Text style={CommonStyle.Text}>Delete</Text>
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStyle.Text}>Confirmation</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <Text style={CommonStyle.Text}>Are you sure want to delete this record ?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setconfirmationWindow(false);
                            }}>
                                No
                            </Button>
                            <Button onPress={() => {
                                deleteLab();
                            }}>
                                Yes
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerForStatus: {
        width: windowWidth,
        height: 40,
        backgroundColor: '#A9A9A9',
        marginVertical: 8,
        justifyContent: 'center',
    },
    treatmentStatusText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15
    },
    containerForBal: {
        width: 150,
        height: 40,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    balText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    containerForHeader: {
        width: windowWidth,
        height: 40,
        backgroundColor: '#A9A9A9',
        marginVertical: 8,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15,
    },
    containerForSubHeader: {
        width: windowWidth,
        height: 40,
        backgroundColor: 'white',
        marginVertical: 8,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerSubText: {
        fontSize: 10,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 15,
    },
    iconDot: {
        marginRight: 20
    }
});


export default ManageLabItems;