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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Searchbar } from 'react-native-paper';
import { getHeaders } from "../../../../utils/apiHeaders";
//fonts_for_tablet_and_mobile

const regularFontSize = width < 600 ? 15 : 20;
const primaryFontSize = width < 600 ? 17 : 22;


const TreatmentList = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [token, setToken] = useState('');
    const [query, setQuery] = useState('');
    const fetchData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        try {
            const clinicID = await AsyncStorage.getItem('clinicID');
            setToken(token);
            const formData = {
                clinicID: myClinicID,
            };
            setLoading(true);
            const response = await Axios.post(`${Api}Patient/GetTreatmentType`, formData, { headers });
            console.log('Treatment Type', response.data);
            setTreatments(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused, refresh]);

    const onChangeSearch = query => {
        console.log(query);
        setQuery(query);

        if (query === "") {
            fetchData();
        } else {
            const filteredData = treatments.filter(item =>
                item.description.toLowerCase().includes(query.toLowerCase())
            );
            setTreatments(filteredData);
        }
    };


    return (
        <>
            <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>
                {loading ? <Loader /> :
                    <>
                        <Searchbar
                            theme={{ colors: { primary: 'white' } }}
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
                                {treatments.map(item => (
                                    <TouchableOpacity onPress={() => navigation.navigate('EditTreatmentAtSettings', {
                                        treatmentTypeID: item.treatmentTypeID
                                    })} key={item.treatmentTypeID}>
                                        <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                                {/* <View style={{ marginLeft: 10 }}>
                                            </View> */}

                                                <View style={CommonStylesheet.cardtextSettingScreen}>

                                                    <Text style={CommonStylesheet.dashboardText}>
                                                        {item.title}
                                                    </Text>

                                                </View>
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
                />} onPress={() => navigation.navigate('AddTreatmentAtSettings', {
                    clinicID: myClinicID
                })} />

            </View>

        </>
    );
};

export default TreatmentList;