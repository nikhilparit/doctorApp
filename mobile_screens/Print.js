import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    Platform,
    SafeAreaView,
    Linking

} from 'react-native';
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
//common styles
import CommonStylesheet from '../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Axios from 'axios';
import Api from '../api/Api';
const { height, width } = Dimensions.get('window');
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import Loader from '../components/Loader';
import { getHeaders } from '../utils/apiHeaders';


const supportedURL = 'https://www.dentee.com/denteeuinew/images/logo.png';

const Print = ({ route }) => {
    const myClinicID = route.params.clinicID;
    const myPatientID = route.params.patientID;
    const myViewName = route.params.viewName;
    const mySelection = route.params.selection;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [PageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filePath, setFilePath] = useState('');

    const readData = async () => {
        const headers = await getHeaders();
        const formData = {
            viewName: myViewName,
            clinicID: myClinicID,
            patientID: myPatientID,
            selection: mySelection
        }
        console.log(formData);

        try {
            Axios.post(`${Api}Clinic/GetViewToHTMLString`, formData, { headers }).then(resp => {
                console.log(resp.data);
                setPageData(resp.data);
            })
        } catch (error) {

        }
    }
    useEffect(() => {
        readData()
    }, [isFocused]);


    const openURL = () => {
        Linking.openURL(supportedURL);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {PageData == null ?
                <Loader /> :
                <>
                    <View style={{ flex: 1 }}>
                        {/* <WebView
                            source={{ html: `${PageData}` }}

                        /> */}
                        <iframe
                            srcDoc={PageData}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allow="fullscreen"
                            title="External Content"
                        />
                    </View>
                    {/* <Button onPress={() => openURL()}>Open URL</Button> */}
                </>
            }
        </View>
    );
};

export default Print;

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
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        fontSize: 18,
        padding: 10,
        color: 'black',
        textAlign: 'center',
    },
    imageStyle: {
        width: 30,
        height: 30,
        margin: 5,
        resizeMode: 'stretch',
    },

});