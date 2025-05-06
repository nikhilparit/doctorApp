import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import {
    FormControl,
    Input,
    Text,
    Box,
    Stack,
    VStack,
    HStack,
    Button,
    Flex,
    Image,
    Select,
    CheckIcon,
    Modal,
    Fab
} from 'native-base';
//common styles
import { CommonStyle } from "../../../commonStyles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');
import Snackbar from 'react-native-snackbar';
import { DataTable, Title } from 'react-native-paper';
import Axios from 'axios';
import Api from '../../../api/Api';
import Loader from '../../../Components/Loader';

const ManageRxTemplatesList = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [showModal, setShowModal] = useState(false);
    const [templateData, setTemplateData] = useState([]);
    const [prescriptionTemplateMasterID, setprescriptionTemplateMasterID] = useState('');
    //loader
    const [isLoading, setLoading] = useState(false);

    const readData = () => {
        const formData = {
            clinicId: myClinicID
        }
        console.log(formData);
        setLoading(true);
        try {
            Axios.post(`${Api}Setting/GetAllPrescriptionTemplateMasterList`, formData).then(resp => {
                console.log(resp.data);
                setTemplateData(resp.data);
            });
            setLoading(false);
        } catch (error) {

        }
    }
    useEffect(() => {
        readData();
    }, [isFocused]);
    const openModal = (id) => {
        setprescriptionTemplateMasterID(id);
        console.log(id);
        setShowModal(true)
    }
    const deleteTemplate = () => {
        const formData = {
            prescriptionTemplateMasterID: prescriptionTemplateMasterID,
            key: "delete"
        }
        console.log("DEL. FORMDATA", formData);
        try {
            Axios.post(`${Api}Setting/InsertUpdateDeletePrescriptionTemplateMaster`, formData).then(resp => {
                console.log(resp.data);
                Snackbar.show({
                    text: 'Template deleted sucessfully.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 10
                });
                setShowModal(false);
                readData();
            })
        } catch (error) {

        }
    }


    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header><Text style={CommonStyle.Text}>Actions</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={7}>
                        {/* onPress={() => navigation.navigate('EditManageRxTemplates', {
                                clinicID: myClinicID,
                                prescriptionTemplateMasterID: prescriptionTemplateMasterID

                            })} */}
                            <TouchableOpacity onPress={()=>Alert.alert('Work is in process...')}>
                                <HStack alignItems="center"  >
                                    <Text style={CommonStyle.Text}>Edit Template</Text>
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTemplate()}>
                                <HStack alignItems="center"  >
                                    <Text style={CommonStyle.Text}>Delete Template</Text>
                                </HStack>
                            </TouchableOpacity>
                        </VStack>
                    </Modal.Body>

                </Modal.Content>
            </Modal>
            <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStyle.backgroundimage}>
                {isLoading ? <Loader /> :
                    <DataTable style={styles.table}>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title>
                                <Title style={styles.headerTitle}>Name</Title>
                            </DataTable.Title>
                            <DataTable.Title>
                                <Title style={styles.headerTitle}>Medicine</Title>
                            </DataTable.Title>
                            <DataTable.Title>
                                <Title style={styles.headerTitle}>Description</Title>
                            </DataTable.Title>
                            <DataTable.Title>
                                {`     `} <Title style={styles.headerTitle}>Action</Title>
                            </DataTable.Title>
                        </DataTable.Header>
                        {templateData.map(item => (
                            <DataTable.Row style={styles.row} key={item.prescriptionTemplateMasterID}>
                                <DataTable.Cell style={styles.cell}>
                                    <DataTable.Title>
                                        <Title style={styles.headerTitleCell}>{item.prescriptionTemplateName}</Title>
                                    </DataTable.Title>
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>
                                    <DataTable.Title>
                                        {`   `} <Title style={styles.headerTitleCell}> <View style={styles.countContainerComplete}>
                                            <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 12,marginTop:3 }} >
                                                {item.templateCount}
                                            </Text></View></Title>
                                    </DataTable.Title>
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>
                                    <DataTable.Title>
                                        <Title style={styles.headerTitleCell}>{item.prescriptionTemplateDesc}</Title>
                                    </DataTable.Title>
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>
                                    <DataTable.Title>
                                        <Title style={styles.headerTitleCell}>
                                            <TouchableOpacity
                                                onPress={() => openModal(item.prescriptionTemplateMasterID)}>
                                                <Icon

                                                    name="ellipsis-v"
                                                    size={22}
                                                    color={'#576067'}
                                                    style={styles.iconDot}
                                                />
                                            </TouchableOpacity>

                                        </Title>
                                    </DataTable.Title>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                }
                <View>

                    <Fab bgColor={'#2196f3'} renderInPortal={false} size={'md'} icon={<Icon
                        name="plus"
                        size={20}
                        color={"white"}
                    />} onPress={() => navigation.navigate('AddManageRxTemplates', {
                        clinicID: myClinicID
                    })} />

                </View>
            </ImageBackground>
        </>
    );
};

export default ManageRxTemplatesList;
const styles = StyleSheet.create({
    table: {
        flex: 1,
        marginTop: 10
    },
    header: {
        backgroundColor: '#2196f3',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Poppins-Regular'
    },
    row: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
    },
    headerTitleCell: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    },
    countContainerComplete: {
        height: 25,
        width: 25,
        backgroundColor: '#00923f',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        marginRight: 20
    },
    iconDot: {
        marginLeft: 40,
    },
})