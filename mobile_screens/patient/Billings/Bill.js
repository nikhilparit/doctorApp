
import React, {
    useContext,
    Provider,
    createContext,
    useState, useEffect
} from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Image,
    Stack,
    Input,
    Button,
    Thumbnail, List, ListItem, Separator
} from 'native-base';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import TopRoutes from '../../topNavigation/TopRoutes';
import Axios from 'axios';
import Api from '../../../api/Api';
import PatientHeader from '../../../components/PatientHeader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeaders } from '../../../utils/apiHeaders';
//Use-ContextHook
const contextData = createContext();

function Bill({ route }) {
    const patientID = route.params.patientID;
    ////console.log('Bill', patientID);
    const clinicID = route.params.clinicID;
    ////console.log('Bill clinicID', clinicID);
    const navigation = useNavigation();
    const [patientInfo, setPatientInfo] = useState({});
    const [token, setToken] = useState('');

    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const formData = {
            patientID: patientID,
            examinationCount: 0,
            fileCount: 0,
            treatmentsCount: 0,
            prescriptionsCount: 0,
            billlingAmount: 0,
            pateintFullName: "string",
            mobileNumber: "string",
            imagethumbnail: null,
            netTreatmentCost: 0,
            balance: 0,
            nextAppointmentDate: "2023-03-09T08:39:06.099Z",
            appointmentCount: 0
        }
        ////console.log('Data To Pass', formData);
        try {
            Axios.post(`${Api}Patient/GetPatientAllDetailForMobile`, formData, { headers }).then(resp => {
                ////console.log('Patient Details', resp.data);
                setPatientInfo(resp.data);
            });
        } catch (error) {
            //console.log(error);
        }
    }
    useEffect(() => {
        readData();
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <PatientHeader patientID={patientID} />
            <contextData.Provider value={{ route, patientInfo }}>
                <TopRoutes />
            </contextData.Provider>
        </View>
    );
}

export default Bill;
export { contextData }

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'gray',
        alignItems: 'center'

    },
    imageContainer: {
        width: width - 0,
        height: 190,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40
    },
    imgContainer: {
        marginBottom: 10
    }
})