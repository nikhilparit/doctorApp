import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
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
import CommonStylesheet from "../../../../common_stylesheet/CommonStylesheet";
import { StyleSheet, Dimensions, } from 'react-native';
const { height, width } = Dimensions.get('window');
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';


const SelectCategory = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const navigation = useNavigation();
    const [category, setCategory] = useState([
        {
            id: 1,
            value: 'Allergies',
            name: 'Allergies'
        },
        {
            id: 2,
            value: 'CreditCardName',
            name: 'Credit Card Name'
        },
        {
            id: 3,
            value: 'DentalHistory',
            name: 'Dental History'
        },
        {
            id: 4,
            value: 'Diagnosis',
            name: 'Diagnosis'
        },
        {
            id: 5,
            value: 'Dosage',
            name: 'Dosage'
        },
        {
            id: 6,
            value: 'Empanel',
            name: 'Empanel'
        },
        {
            id: 7,
            value: 'ExpenseIN',
            name: 'Receipt'
        },
        {
            id: 8,
            value: 'ExpenseOut',
            name: 'Payment'
        },
        {
            id: 9,
            value: 'Frequency',
            name: 'Frequency'
        },
        {
            id: 10,
            value: 'LabItemSent',
            name: 'LabItem Sent'
        },
       
        {
            id: 12,
            value: 'LabItemStage',
            name: 'LabItemStage'
        },
        {
            id: 14,
            value: 'LabWorkComponent',
            name: 'Lab Work Component'
        },
        {
            id: 15,
            value: 'LeadStatus',
            name: 'Lead Status'
        },
        {
            id: 16,
            value: 'MaritalStatus',
            name: 'Marital Status'
        },
        {
            id: 17,
            value: 'MedicalCondition',
            name: 'Medical Condition'
        },
        {
            id: 18,
            value: 'MedicalDisease',
            name: 'Medical Disease'
        },
        {
            id: 19,
            value: 'MedicalHistory',
            name: 'Medical History'
        },
        {
            id: 20,
            value: 'Medicine Notes',
            name: 'Medicine Notes'
        },
        {
            id: 21,
            value: 'ModeOfPayment',
            name: 'Mode Of Payment'
        },
        {
            id: 22,
            value: 'Nationality',
            name: 'Nationality'
        },
        {
            id: 23,
            value: 'Occupation',
            name: 'Occupation'
        },
        {
            id: 24,
            value: 'PatientChiefComplaint',
            name: 'Patient Chief Complaint'
        },
        {
            id: 25,
            value: 'PatientMedicalAttributes',
            name: 'Patient Medical Attributes'
        },
        {
            id: 26,
            value: 'PatientMedicalHistoryAttributes',
            name: 'Patient Medical History Attributes'
        },
        {
            id: 27,
            value: 'PatientPersonalAttributes',
            name: 'Patient Personal Attributes'
        },
        {
            id: 28,
            value: 'PatientTags',
            name: 'Patient Tags'
        },
        {
            id: 29,
            value: 'ProgramCategory',
            name: 'Program Category'
        },
        {
            id: 30,
            value: 'Reasons',
            name: 'Reasons'
        },
        {
            id: 31,
            value: 'ReferenceSource',
            name: 'Reference Source'
        },
        {
            id: 32,
            value: 'ReminderPeriod',
            name: 'Reminder Period'
        },
        {
            id: 33,
            value: 'Shade',
            name: 'Shade'
        },
        {
            id: 34,
            value: 'Status',
            name: 'Status'
        },
        {
            id: 35,
            value: 'Title',
            name: 'Title'
        },
        {
            id: 36,
            value: 'TreatmentStatus',
            name: 'Treatment Status'
        },
        {
            id: 37,
            value: 'TreatmentType',
            name: 'Treatment Type'
        },



    ]);
    return (

        <View style={[CommonStylesheet.formContainer,CommonStylesheet.backgroundimage]}>
            
            <ScrollView>
                    <View >
                        {category.map(item => (
                            <TouchableOpacity onPress={() => navigation.navigate('CategoryList', {
                                paramKey1: item.value,
                                clinicID: myClinicID,
                                paramKey2: item.name,
                            }
                            )} key={item.id}>
                                 <View style={[CommonStylesheet.borderforcardatHomeScreen,CommonStylesheet.shadow,{marginTop:20}]}>
                                     <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }}>
                                        <View style={CommonStylesheet.iconatSettingScreen}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon style={CommonStylesheet.iconstylediscover}
                                                name="cog"
                                                size={40}
                                                color={"#2196f3"} >

                                            </Icon>
                                        </View>
                                        </View>

                                        <View style={CommonStylesheet.cardtextSettingScreen}>

                                        <Text style={CommonStylesheet.dashboardText}>
                                                {item.name}
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
        </View>
    );
};

export default SelectCategory;