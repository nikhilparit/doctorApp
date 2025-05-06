import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'native-base';
import Axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import Api from '../api/Api';
import CommonStylesheet from '../common_stylesheet/CommonStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeaders } from '../utils/apiHeaders';

const { height, width } = Dimensions.get('window');

const PatientHeader = ({ patientID }) => {
   // console.log("mypatientID AT Header",patientID);
    const [item, setItem] = useState({});
    const cardwidth = width < 600 ? 100 : 100;
    const MaxWidth = width < 600 ? 200 : 400;

    const fetchData = useCallback(async () => {
        const headers = await getHeaders();
        try {
            const myformData = {
                patientID: patientID
            };
           // console.log("Sending myformData:", myformData); // Log the payload to verify it's correct
     if (myformData.patientID) {
        const response = await Axios.post(`${Api}Patient/GetPatientAllDetailForMobile`, myformData, { headers });
        setItem(response.data);
       // console.log('patientdata', response.data); 
     }
     // Log the response to check the structure of data
        } catch (error) {
            console.error(error); // Log any errors that occur during the API call
        }
    }, [patientID]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    return (
         <View style={[Styles.cardContainer, CommonStylesheet.shadow]}  key={item.patientID}>
            <View style={{ width: cardwidth, height: '100%' }}>
                {item.imagethumbnail ? (
                    <Image
                        source={{ uri: `data:image/png;base64,${item.imagethumbnail}` }}
                        alt="logo.png"
                        style={CommonStylesheet.imageatPatient}
                    />
                ) : item.gender === "M" ? (
                <Image
                    source={require('../assets/images/Male.jpg')}
                    alt="logo.png"
                    style={CommonStylesheet.imageatPatient}
                />
                ) : item.gender === "F" ? (
                    <Image
                        source={require('../assets/images/Female1.png')}
                        alt="logo.png"
                        style={CommonStylesheet.imageatPatient}
                    />
                ) : (
                    <Image
                        source={require('../assets/images/default.png')}
                        alt="logo.png"
                        style={CommonStylesheet.imageatPatient}
                    />
                )}
            </View>
            <View style={{ alignItems: 'flex-start', height: '100%', padding: 10, marginLeft: 10 }}>
                <View>
                    <Text style={CommonStylesheet.headertextatPatientDetails1}>
                        {item.pateintFullName}
                    </Text>
                    {item.strPateintMedicalAttributes ? (
                        <View style={{ justifyContent: 'flex-start', marginTop: 5, marginBottom: 5 }}>
                            <Text style={[Styles.medicalText, { color: 'red', justifyContent: 'flex-start' }]}>{item.strPateintMedicalAttributes}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={{ width: MaxWidth }}>
                    <View style={Styles.cardtext}>
                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular' }}>{item.patientCode}</Text>
                        <Text style={{ marginRight: 20, fontFamily: 'Poppins-Regular' }}>Cost: {item.netTreatmentCost}/-</Text>
                    </View>
                    <View style={Styles.cardtext}>
                        <Text style={{ color: '#000', fontFamily: 'Poppins-Regular' }}>{item.mobileNumber}</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular' }}>Balance: {item.balance}/-</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const Styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    cardtext: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    medicalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },
});

export default PatientHeader;
