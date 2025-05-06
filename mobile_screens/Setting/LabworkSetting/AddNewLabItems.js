import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions, Alert } from 'react-native';
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
    Modal,
    Radio,
    Checkbox
} from 'native-base';

import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
//common styles
import { CommonStyle } from "../../../commonStyles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../../../api/Api';
import Snackbar from 'react-native-snackbar';
const { height, width } = Dimensions.get('window');
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddNewLabItems = ({ route }) => {
    const myClinicID = route.params.clinicID;
    console.log(myClinicID);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [itemTitle, setitemTitle] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [ManageLabItems, setManageLabItems] = useState([]);
    const [LabItems, setLabItems] = useState(0);
    const [componentName, setComponentName] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');

    useEffect(() => {
        const formData = {
            clinicID: myClinicID,
            search: "",
            itemCategory: 'LabWorkComponent',
            pageIndex: 0,
            pageSize: 0
        }
        console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formData).then(resp => {
                console.log('Get Look Ups By Category For Mobile', resp.data);
                setManageLabItems(resp.data);
            });
        } catch (error) {
            console.log(error);
        }

        setRefresh(!refresh);
    }, [isFocused]);

    const addLabItems = async () => {
        // if (itemTitle == '' || itemTitle == undefined) {
        //     Snackbar.show({
        //         text: 'Required item title type.',
        //         duration: Snackbar.LENGTH_SHORT,
        //         backgroundColor: 'red',
        //         fontFamily: 'Poppins-Medium',
        //     });
        //     return
        // }
        const itemID = ManageLabItems.filter(item => item.itemID == LabItems);
        console.log("Selelcted LAB ITEM", itemID);
        const formData = {
            labWorkComponentID: "00000000-0000-0000-0000-000000000000",
            clinicID: myClinicID,
            componentName: componentName,
            itemDescription: description,
            componentDescription: description,
            labWorkCost: parseInt(cost),
            componentCategoryID: "C36C914D-D687-41DC-AD0D-0558166B9847",
            isDeleted: false,
            createdOn: moment().toISOString(),
            createdBy: "SYSTEM",
            lastUpdatedOn: moment().toISOString(),
            lastUpdatedBy: "SYSTEM",
            flag: true,
            itemID: itemID[0].itemID
        }
        console.log("FORM DATA", formData);
        try {
            Axios.post(`${Api}Setting/InsertUpdateLabItems`, formData).then(resp => {
                console.log(resp.data);
                Snackbar.show({
                    text: `Lab Work Item added sucessfully.`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 10
                });
                navigation.navigate('ManageLabItems', {
                    clinicID: myClinicID,
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStyle.backgroundimage}>
            <ScrollView>
                    <Stack space={2} w="100%"  mx="auto" marginTop={2} padding={5}>
                        <Select
                            placeholderTextColor={'#808080'}
                            fontSize={14}
                            fontFamily={'Poppins-Regular'}
                            //opacity={0.7}
                            bgColor={'#FFFFFF'}
                            borderRadius={10}
                            selectedValue={LabItems}
                            accessibilityLabel="Component Category"
                            placeholder="Component Category" _selectedItem={{
                                bg: "#2196f3",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setLabItems(itemValue)}>
                            {ManageLabItems.map(item => (
                                <Select.Item label={item.itemTitle} value={item.itemID} key={item.itemID} />
                            ))}
                        </Select>
                        <Input size="lg" value={componentName} onChangeText={(value) => setComponentName(value)} placeholderTextColor={'#808080'} style={styles.inputPlaceholder} placeholder="Component Name" />
                        <Input size="lg" value={description} onChangeText={(value) => setDescription(value)} placeholderTextColor={'#808080'} style={styles.inputPlaceholder} placeholder="Component Description" />
                        <Input keyboardType='numeric' size="lg" value={cost} onChangeText={(value) => setCost(value)} placeholderTextColor={'#808080'} style={styles.inputPlaceholder} placeholder="Cost" />

                    </Stack>
                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <View style={{}}>
                        <TouchableOpacity onPress={() => addLabItems()}>
                            <View style={CommonStyle.buttonContainersave}>
                                <Text style={CommonStyle.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Box>
            </ScrollView>
        </ImageBackground>
    );
};

export default AddNewLabItems;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        padding: 10,
        color: 'black',
    },
    buttonStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#DDDDDD',
        padding: 5,
    },

    inputPlaceholder: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        // opacity: 0.7,


    },
    Text: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-SemiBold'

    },

});