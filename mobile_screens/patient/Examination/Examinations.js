import React, {
    useState, useEffect, useContext,
    Provider,
    createContext,
} from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Image,
    Stack,
    Input,
    Button,
    Thumbnail,
    List,
    ListItem,
    Separator,
    Badge
} from 'native-base';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import TopExaminationRoutes from '../../topExaminationNavigation/TopExaminationRoutes';
import Axios from 'axios';
import Api from '../../../api/Api';
import PatientHeader from '../../../components/PatientHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeaders } from '../../../utils/apiHeaders';
import Loader from '../../../components/Loader';
import { useSelector, useDispatch } from "react-redux";
import { GetPatientExamination } from '../../../features/examinationSlice';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const mainCardHeader = Math.min(width, height) * 0.04;
//const secondaryCardHeader = Math.min(width, height) * 0.030;
const secondaryCardHeader = 16;//jyo1
//Use-ContextHook
const contextData = createContext();
function Examinations({ route }) {
    const dispatch = useDispatch();
    const examination = useSelector((state)=>state.examination.patientExamination) || [];
    const myPatientID = route.params.patientID;
    const navigation = useNavigation();
    const [dashboard, setDashboard] = useState({});
    //const [examination, setExamination] = useState([]);
    const [name, setName] = useState('');
    const [myClinicID, setmyClinicID] = useState('');
    const [loading, setLoading] = useState(true);

    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setmyClinicID(user.clinicID);
        try {

            const formData1 = {
                clinicID: user.clinicID,
                patientID: myPatientID,
                pageIndex: 0,
                pageSize: 0
            };
            //console.log("FORM DATA", formData1);
            dispatch(GetPatientExamination(formData1)).unwrap();
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            readData();
        });
        return unsubscribe;
    }, [navigation]);
    const operationString = () => {
        let text = name;
        if (text) {
            //console.log(text);
            let initials = text
                .split(' ') // Split the string into an array of words
                .slice(1)
                .filter(word => word.length > 0) // Remove empty elements
                .map(word => word[0]) // Get the first character of each word
                .join(' '); // Join the characters with a space
           // console.log(initials);

            return initials;
        } else {
           // console.log('patientFullName is undefined or not accessible.');
            // Handle the case where patientFullName is undefined or not accessible
        }
    }
    return (
        // <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={[CommonStylesheet.backgroundimage]}>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {loading ? <Loader /> :
                <View style={Styles.container}>
                    <View style={Styles.containerPatientInfo}>

                        <PatientHeader patientID={myPatientID} />

                        <contextData.Provider value={{ examination, myClinicID, myPatientID }}>
                            <TopExaminationRoutes />
                        </contextData.Provider>
                    </View>
                </View>
            }
        </View>

    );
}
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        // borderColor: 'red',
        // borderWidth: 2,
        width: '100%',
        height: '100%',

    },
    containerPatientInfo: {
        // borderColor: 'green',
        // borderWidth: 2,
        width: '100%',
        height: '100%',
        //padding: 10
    },
    cardContainer: {
        width: '100%',
        padding: 10,
        // borderColor: 'green',
        // borderWidth: 2,
        backgroundColor: 'green',
        // flexDirection: 'row',


    },


    highlighted: {
        backgroundColor: 'yellow',
        fontFamily: 'Poppins-Bold',
        fontSize: secondaryCardHeader,
    },
    medicalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: secondaryCardHeader,
    },
    imageContainer: {
        // width: windowWidth - 10,
        // height: windowHeight * 0.35,
        // borderRadius: 50,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10
        // marginTop: -40,
    },
    imageatQualification1: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // borderWidth: 1,
        width: 70,
        height: 70,
        borderRadius: 50,
        marginTop: 20

    },
});

export default Examinations;
export { contextData }

