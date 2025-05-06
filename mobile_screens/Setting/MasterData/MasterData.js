import React from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, } from 'react-native';
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
} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
const { height, width } = Dimensions.get('window');
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';


const MasterData = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const navigation = useNavigation();
    return (

        <View style={[CommonStylesheet.formContainer,CommonStylesheet.backgroundimage]}>


            <ScrollView>
                    <View >
                        <TouchableOpacity onPress={() => navigation.navigate('TreatmentList', {
                            clinicID: myClinicID
                        })}>
                           <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                <View style={{ flexDirection: 'row',justifyContent:'space-between', width: '100%', alignItems: 'center', height: '100%' }}>
                                    <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="first-aid"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={[CommonStylesheet.cardtextSettingScreen,{width:"94%"}]}>

                                    <Text style={[CommonStylesheet.dashboardText]}>
                                            Treatment
                                        </Text>

                                    </View>

                                    <View style={[CommonStylesheet.careticonatSettingScreen,{width:"2%"}]}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('MedicineList', {
                            clinicID: myClinicID
                        })}>
                           <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="file-prescription"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={[CommonStylesheet.cardtextSettingScreen,{width:"96%"}]}>

                                    <Text style={[CommonStylesheet.dashboardText]}>
                                            Medicine
                                        </Text>

                                    </View>

                                    <View style={[CommonStylesheet.careticonatSettingScreen,{width:"2%"}]}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SelectCategory', {
                            clinicID: myClinicID
                        })}>
                            <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                <View style={[CommonStylesheet.iconatSettingScreen,{width:"2%"}]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="user-cog"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                    </View>

                                    <View style={[CommonStylesheet.cardtextSettingScreen,{width:"96%"}]}>

                                    <Text style={CommonStylesheet.dashboardText}>
                                        Manage Master
                                        </Text>

                                    </View>

                                    <View style={[CommonStylesheet.careticonatSettingScreen,{width:"2%"}]}>
                                        <Icon style={CommonStylesheet.iconstylediscover}
                                            name="chevron-right">
                                        </Icon>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    logo: {
        width: width * 0.07, // Adjust width based on screen width
        height: height * 0.07, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    }
})
export default MasterData;