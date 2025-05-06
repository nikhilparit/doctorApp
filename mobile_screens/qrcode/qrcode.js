
import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet, Dimensions, Alert, Text, TouchableOpacity,Image } from 'react-native';
const { height, width } = Dimensions.get('window');
import { Input } from 'native-base';
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../api/Api';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
function QRCode() {
    const navigation = useNavigation();
    const [url, setUrl] = useState('https://www.google.com/');
    const [qrCode, setQRCode] = useState('')
    const [token, setToken] = useState('');
    const [clinicID, setClinicID] = useState('');

    const readData = async () => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        const clinicID = await AsyncStorage.getItem('clinicID');
        setClinicID(clinicID);
        //console.log("clinicID", clinicID);
    };
    useEffect(() => {
        readData();
    }, []);

    // function isValidURL(url) {
    //     const regex = /^https:\/\/www\.[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,6}(\/)?$/;
    //     return regex.test(url);
    // }
    // async function generateQRCode() {
    //     const urlCorrect = isValidURL(url);
    //     console.log("urlCorrect", urlCorrect);
    //     if (urlCorrect == true) {
    //         const headers = {
    //             'Content-Type': 'application/json',
    //             'AT': 'MobileApp',
    //             'Authorization': token
    //         };
    //         const formData =
    //         {
    //             textInput: url,
    //             clinicId: clinicID
    //         }
    //         console.log(formData)
    //         try {
    //             const response = await axios.post(`${Api}Clinic/GetClinicWebsiteQRCode`, formData, { headers });
    //             //console.log(response.data);
    //             setQRCode(response.data.qrCode);
    //         } catch (error) {
    //             console.error("Error generating QR code:", error);
    //             navigation.navigate('Login');
                
    //         }
    //     } else {
    //         alert("Invalid URL. Please enter a correct URL.");
    //         setQRCode('');
    //         return;
    //     }

    // }

    async function generateQRCode() {

            const headers = {
                'Content-Type': 'application/json',
                'AT': 'MobileApp',
                'Authorization': token
            };
            const formData =
            {
                textInput: url,
                clinicId: clinicID
            }
            console.log(formData)
            try {
                const response = await axios.post(`${Api}Clinic/GetClinicWebsiteQRCode`, formData, { headers });
                //console.log(response.data);
                setQRCode(response.data.qrCode);
            } catch (error) {
                console.error("Error generating QR code:", error);
                navigation.navigate('Login');
                
            }
            //setQRCode('');
            //return;

    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: '50%', marginTop: 20, flexDirection: 'row' }}>
                <Input
                    width={"100%"}
                    value={url}
                    keyboardType='numeric'
                    size="lg"
                    onChangeText={(value) => setUrl(value)}
                    marginLeft={2}
                    style={styles.inputFontStyle}
                    borderRadius={5}
                    placeholderTextColor={'#888888'}
                    placeholder="Enter website URL"

                />
                <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity onPress={() => generateQRCode()} style={{ marginTop: 3 }}>
                        <View style={CommonStylesheet.buttonContainersaveatForm}>
                            <Text style={CommonStylesheet.ButtonText}>Generate</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {qrCode?
            <View style={{ width: '50%', marginTop: 20, justifyContent:'center',alignItems:'center' }}>
                <Image
                    source={{ uri: qrCode }}
                    alt="logo.png"
                    style={{width:200, height:200}}
                />
            </View>:
            <View></View>
            }
        </SafeAreaView>
    )
}

export default QRCode;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputFontStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        backgroundColor: '#fff',
        height: height * 0.07,
    }

});