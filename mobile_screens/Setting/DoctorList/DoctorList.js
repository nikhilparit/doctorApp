import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
    Fab,
    Modal,
    HStack,
    NativeBaseProvider,
    Divider
} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Loader from "../../../components/Loader";

import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Axios from 'axios';
import Api from "../../../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeaders } from "../../../utils/apiHeaders";
const HeightSizePerScreen = width < 600 ? 110 : 140;
const MaxWidth = width < 600 ? 100 : 100;

const DoctorList = ({ route }) => {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [drList, setDrList] = useState([]);
    const [myClinicID, setstoredClinicID] = useState(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [providerID, setProviderID] = useState(true);
     const [confirmationWindow, setconfirmationWindow] = useState(false);

    const readData = async () => {
        setLoading(true);   
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = await AsyncStorage.getItem('token');
        setstoredClinicID(user.clinicID);
        const formData =
        {
            clinicID: user.clinicID,
            showAllProviders: true,
            userClinicInfoID: "00000000-0000-0000-0000-000000000000"
        }
        console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}Setting/GetProviderInfoByParameterForMobile`, formData, { headers }).then(resp => {
                console.log('Doctor List', resp.data);
                setDrList(resp.data);
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useFocusEffect(
        useCallback(() => {
          readData();
        }, [])
      );
    function onSelectionOfDoctor(id) {
        setProviderID(id);
        setShowModal(true);
    }
    function onConfirmationWindow () {
        setShowModal(false);
        setconfirmationWindow(true);
    }

    async function deleteDoctor() {
        const headers = await getHeaders();
        console.log('providerID', providerID);
        const formData = {
            providerID: providerID,
            isDel:true

          }

        try {
            const response = await Axios.post(`${Api}Setting/DeleteProvider`, formData, { headers });
            //console.log(response.data);
            setconfirmationWindow(false);
            readData()
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350px" borderRadius="15px" >
                    <Modal.CloseButton style={styles.CloseButton}>
                        <Icon name="close" color="window-close" size={20} />
                    </Modal.CloseButton>
                    <Modal.Header style={styles.header}><Text style={{ color: 'white' }}>Actions</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={4}>
                        <TouchableOpacity onPress={() => 
                            onConfirmationWindow()

                            }>
                                <HStack alignItems="center" style={{ alignItems: 'center', }} >
                                    <Text fontFamily="poppins-regular">Delete Doctor</Text>
                                </HStack>
                            </TouchableOpacity>
                            <Divider />

                            <HStack alignItems="center" style={{ alignItems: 'center', }} >
                                <Text fontFamily="poppins-regular">Share Access code</Text>
                            </HStack><Divider />

                            <HStack alignItems="center" style={{ alignItems: 'center', }} >
                                <Text fontFamily="poppins-regular">Manage Access</Text>
                            </HStack><Divider />

                        </VStack>
                    </Modal.Body>
                    {/* <Modal.Footer>
            <Button flex="1" onPress={() => {
            setShowModal2(true);
          }}>
              Continue
            </Button>
          </Modal.Footer> */}
                </Modal.Content>
            </Modal>
            <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                    <Modal.Body padding={5}>
                        <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to delete this record ?</Text>
                    </Modal.Body>
                    <Modal.Footer>



                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => setconfirmationWindow(false)}>
                                <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                    <Text style={CommonStylesheet.ButtonText}>No</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() =>deleteDoctor()}>
                                <View style={CommonStylesheet.buttonContainersave1}>
                                    <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {loading ? <Loader /> :
                <>
                    <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>

                        <ScrollView>
                            <View style={styles.container}>
                                {drList.map(item => (
                                    <TouchableOpacity onPress={() => navigation.navigate('EditDoctor')} key={item.providerID} style={{ marginBottom: 8 }}>
                                        <View style={[CommonStylesheet.borderforcardatPatientListScreen, { height: HeightSizePerScreen, justifyContent: 'center' }]}>
                                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                                <View >
                                                    <Image
                                                        source={require('../../../assets/images/Male.jpg')}
                                                        alt="logo.png"
                                                        style={CommonStylesheet.imageatPatientScreen}
                                                    />
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'flex-start',
                                                        marginLeft: 15,
                                                    }}>
                                                    <Text style={CommonStylesheet.headertext16}>
                                                        {item.providerName}
                                                    </Text>

                                                    <Text style={CommonStylesheet.textPatientList}>
                                                        {item.email}
                                                    </Text>
                                                    <Text style={CommonStylesheet.textPatientList}>
                                                        {item.phoneNumber}
                                                    </Text>

                                                </View>
                                                <View style={{ width: 20, marginRight: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                                    {/* <Icon style={[CommonStylesheet.iconstylePicture, styles.iconPhone]}
                                            name="phone-volume"
                                        >

                                        </Icon> */}
                                                    <TouchableOpacity onPress={() => onSelectionOfDoctor(item.userClinicInfoID)}>
                                                        <Icon

                                                            name="ellipsis-v"
                                                            size={30}
                                                            color={'#576067'}
                                                            style={styles.iconDot}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                {/* <TouchableOpacity onPress={() => navigation.navigate('EditDoctor')}>
                                <View style={CommonStylesheet.borderforcardatPatientListScreen}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ margin: 8 }}>
                                            <Image
                                                source={require('../assets/images/human.png')}
                                                alt="logo.png"
                                                style={CommonStylesheet.imageatQualification}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: 'flex-start',
                                                alignItems: 'flex-start',
                                                marginTop: 10,
                                            }}>
                                            <Text style={CommonStylesheet.headertext16}>
                                                Dr.Tejaswini
                                            </Text>

                                            <Text style={CommonStylesheet.textPatientList}>
                                                ctejaswini@gmail.com
                                            </Text>
                                            <Text style={CommonStylesheet.textPatientList}>
                                                9689603228
                                            </Text>

                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14, marginRight: 8 }}>

                                            <TouchableOpacity
                                                onPress={() => setShowModal(true)}>
                                                <Button style={{ backgroundColor: '#00bc00' }}> Admin</Button>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>
                            </TouchableOpacity> */}
                            </View>
                        </ScrollView>
                    </View>
                    <View>

                        <Fab renderInPortal={false} size={'md'} bgColor={"#2196f3"} icon={<Icon
                            name="plus"
                            size={10}
                            color={"white"}
                        />} onPress={() => navigation.navigate('AddDoctor', {
                            clinicID: myClinicID,
                            key: 'Add'
                        })} />

                    </View>
                </>
            }
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        padding: 10
    },
    CloseButton: {
        position: 'absolute',
        backgroundColor: '#da251d',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        top: 7,
        height: 25,
        width: 25,
        // elevation: 2,
    },
    header: {
        backgroundColor: '#2196f3',
        textAlign: 'center',
        paddingVertical: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        fontSize: 18,
        fontFamily: "poppins-bold",
    },
    iconPhone: {
        marginRight: 10,
        marginTop: 10
    },

    logo: {
        width: width < 600 ? '100%' : '100%',
        height: width < 600 ? height * 0.10 : height * 0.10,
        borderRadius: width < 600 ? width * 0.05 : width * 0.01,
        //resizeMode: 'contain', // You can adjust the resizeMode as needed
    },
})

export default DoctorList;