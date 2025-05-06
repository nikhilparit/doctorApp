import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
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
} from 'native-base';
//common styles
import CommonStylesheet from "../../../../common_stylesheet/CommonStylesheet";
import { StyleSheet, Dimensions, } from 'react-native';
const { height, width } = Dimensions.get('window');
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import Api from "../../../../api/Api";
import Loader from "../../../../components/Loader";
import { Searchbar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeaders } from "../../../../utils/apiHeaders";

const MedicineList = ({ route }) => {
    const [medicine, setMedicins] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [myClinicID, setmyClinicID] = useState('');

    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyClinicID(user.clinicID);
        setQuery('');
        const formData = {
            clinicID:user.clinicID
        }
        try {
            setLoading(true);
            Axios.post(`${Api}Setting/GetAllMedicine`, formData,{headers}).then(resp => {
                console.log('Get All Medicine', resp.data);
                setMedicins(resp.data);
                setLoading(false)
            })
        } catch (error) {
            console.log(error.message);
        }
    }
    useEffect(() => {
        readData()
    }, [isFocused]);
    const onChangeSearch = query => {
        console.log(query);
        if (query == "") {
            readData();
        }
        setQuery(query);
        const filteredData = medicine.filter((item) =>
            item.genericName.toLowerCase().includes(query.toLowerCase())
        );
        setMedicins(filteredData);

    };
    return (
        <>
           <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>

                {loading ? <Loader /> :
                    <>
                        <Searchbar
                            theme={{ colors: { primary: 'gray' } }}
                            placeholder="Search"
                            value={query}
                            style={{ backgroundColor: 'white', width: - 20 }}
                            onChangeText={onChangeSearch}
                            defaultValue='clear'
                            iconColor={'#2196F3'}
                            placeholderTextColor={'#2196F3'}
                            inputStyle={{
                                fontSize: 14,
                                color: '#5f6067',
                                fontFamily: 'Poppins-Regular'
                            }}
                        />
                        <ScrollView>
                            <View >
                                {medicine.map(item => (
                                    <TouchableOpacity onPress={() => navigation.navigate('EditMedicine', {
                                        clinicID: myClinicID,
                                        drugID: item.drugId
                                    })} key={item.drugId}>
                                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>


                                                <View style={CommonStylesheet.cardtextSettingScreen}>

                                                    <Text style={CommonStylesheet.dashboardText}>
                                                        {item.genericName}
                                                    </Text>

                                                </View>
                                                {/* <View style={CommonStylesheet.countatTreatmentList}>
                                                        <Text>{item.recordCount}</Text>
                                                    </View> */}

                                                <View style={CommonStylesheet.careticonatSettingScreen}>
                                                    <Icon style={CommonStylesheet.iconstylediscover}
                                                        name="chevron-right">
                                                    </Icon>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    marginHorizontal: 20,
                                                    marginTop: -10,
                                                    flexDirection: 'row',
                                                }}>

                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </>
                }
            </View>

            <View>

                <Fab bgColor={'#2196f3'} renderInPortal={false} size={'md'} icon={<Icon
                    name="plus"
                    size={10}
                    color={"white"}
                />} onPress={() => navigation.navigate('AddMedicine', {
                    clinicID: myClinicID
                })} />

            </View>

        </>
    );
};

export default MedicineList;