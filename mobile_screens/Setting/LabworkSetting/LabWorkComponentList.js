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
import { CommonStyle } from "../../../commonStyles/CommonStyle";
import { StyleSheet, Dimensions, } from 'react-native';
const { height, width } = Dimensions.get('window');
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import Api from "../../../api/Api";
import Loader from "../../../Components/Loader";


const LabWorkComponentList = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const myCategory = route.params.category;
    const myName = route.params.name;
    console.log(myCategory, myName);
    const [LabComponents, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        const formData = {
            clinicID: myClinicID,
            search: "",
            itemCategory: myCategory,
            pageIndex: 0,
            pageSize: 0
        }
        //console.log('Data To Pass', formData);
        try {
            setLoading(true);
            Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formData).then(resp => {
                console.log('Get Look Ups By Category For Mobile', resp.data);
                setCategory(resp.data);
                setLoading(false);
            });
        } catch (error) {
            console.log(error);
        }

        setRefresh(!refresh);
    }, [isFocused]);
    return (
        <>
            <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStyle.backgroundimage}>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffff', marginTop: 20 }}>
                    <Text style={{ color: '#2196f3', fontSize: 16, fontFamily: 'Poppins-Bold', textAlign: 'center' }}>{myName}</Text>
                </View>
                {loading ? <Loader /> :
                    <ScrollView>
                            <View style={{ marginTop: 10,padding:10 }}>
                                {LabComponents.map(item => (
                                    <TouchableOpacity onPress={() => navigation.navigate('EditLabWorkCoponent', {
                                        Id: item.id,
                                        category: myCategory,
                                        clinicID: myClinicID,
                                        name: myName
                                    })} key={item.id}>
                                        <View style={CommonStyle.borderforcardatHomeScreen}>
                                            <View style={{ flexDirection: 'row', }}>
                                                <View style={{ marginLeft: 10 }}>
                                                </View>

                                                <View style={CommonStyle.cardtextSettingScreen}>

                                                    <Text style={CommonStyle.headertextTreatmentScreen}>
                                                        {item.itemTitle}
                                                    </Text>

                                                </View>
                                                <View style={CommonStyle.careticonatSettingScreen}>
                                                    <Icon style={CommonStyle.iconstylediscover}
                                                        name="caret-right">
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
            </ImageBackground>

            <View>

                <Fab bgColor={'#2196f3'} renderInPortal={false} size={'md'} icon={<Icon
                    name="plus"
                    size={20}
                    color={"white"}
                />} onPress={() => navigation.navigate('AddLabWorkComponent', {
                    clinicID: myClinicID,
                    category: myCategory,
                    name: myName

                })} />

            </View>

        </>
    );
};

export default LabWorkComponentList;