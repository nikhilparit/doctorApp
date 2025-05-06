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
import Axios from "axios";
import Api from "../../../../api/Api";
import Loader from "../../../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeaders } from "../../../../utils/apiHeaders";

const CategoryList = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const itemCategory = route.params.paramKey1;
    const name = route.params.paramKey2;
    console.log(itemCategory, name);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [myClinicID, setmyClinicID] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = await getHeaders();
                const userString = await AsyncStorage.getItem('user');
                const user = JSON.parse(userString);
                setmyClinicID(user.clinicID);

                if (isFocused) {
                    const formData = {
                        clinicID: user.clinicID,
                        search: "",
                        itemCategory: itemCategory,
                        pageIndex: 0,
                        pageSize: 0
                    };

                    setLoading(true);
                    const response = await Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formData, { headers });
                    console.log('Get Look Ups By Category For Mobile', response.data);
                    setCategory(response.data);
                    setLoading(false);
                }

                setRefresh(!refresh);
            } catch (error) {
                console.log(error);
                setLoading(false); // Ensure loading is stopped in case of error
            }
        };

        fetchData();
    }, [isFocused]);
    return (
        <>
            <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>

                {/* <View style={{ justifyContent: 'center', alignSelf: 'center', backgroundColor: '#2196ed', marginTop: 20,width:"50%" }}>
                    <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Poppins-Bold', textAlign: 'center' }}>{name}</Text>
                </View> */}
                {loading ? <Loader /> :
                    <ScrollView>
                        <View >
                            {
                                category.length == 0 ? <View><Text style={[CommonStylesheet.Text, { textAlign: 'center' }]}>Data is not available. Please add new one by clicking (+) button.</Text></View> :
                                    category.map(item => (
                                        <TouchableOpacity onPress={() => navigation.navigate('EditCategory', {
                                            clinicID: myClinicID,
                                            category: itemCategory,
                                            name: name,
                                            medicalTypeID: item.id
                                        })} key={item.id}>
                                            <View style={[CommonStylesheet.borderforcardatHomeScreen, CommonStylesheet.shadow, { marginTop: 20 }]}>
                                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>


                                                    <View style={CommonStylesheet.cardtextSettingScreen}>

                                                        <Text style={CommonStylesheet.dashboardText}>
                                                            {item.itemTitle}
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
                }
            </View>

            <View>

                <Fab
                    backgroundColor={'#2196f3'}
                    renderInPortal={false} size={'md'} icon={<Icon
                        name="plus"
                        size={10}
                        color={"white"}
                    />} onPress={() => navigation.navigate('AddCategory', {
                        clinicID: myClinicID,
                        category: itemCategory,
                        name: name

                    })} />

            </View>

        </>
    );
};

export default CategoryList;