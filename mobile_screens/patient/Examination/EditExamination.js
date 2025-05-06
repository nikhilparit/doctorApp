import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import {
    FormControl,
    Text,
    Input,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    Image,
    Modal,
    HStack, Fab,
    TextInput,
    Select,
    CheckIcon,
    Checkbox

} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import { SelectCountry } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
//import DateTimePicker from '@react-native-community/datetimepicker'
import Axios from "axios";
import Api from "../../../api/Api";
import moment from "moment";
import { Picker } from '@react-native-picker/picker';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeaders } from "../../../utils/apiHeaders";
import Loader from "../../../components/Loader";
//import Snackbar from "react-native-snackbar";
import { fetchExaminationData, InsertPatientExaminationDetail, fetchPatientExaminationByID } from "../../../features/examinationSlice";
import { providerList } from "../../../features/commonSlice";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get('window');
const icon_size = Math.min(width, height) * 0.05;
const secondaryCardHeader = Math.min(width, height) * 0.033;
const fontSize = Math.min(width, height) * 0.03; // Adjust the multiplier as per your requirement

const EditExamination = ({ route }) => {
    const dispatch = useDispatch();
    const examinationID = route.params.patientExaminationID;
    //console.log("EXAMINATIONID", examinationID);
    const clinicID = route.params.clinicID;
    //console.log("Clinic ID", clinicID);
    const myPatientID = route.params.patientID;
    const [getexaminationbyID, setgetexaminationbyID] = useState({});
    const navigation = useNavigation();
    const [groupValues, setGroupValues] = useState([]);
    const [groupValues1, setGroupValues1] = useState([]);
    const [service, setService] = React.useState("");
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [confirmationWindow, setconfirmationWindow] = useState(false);
    //handling user inputs
    const [provider, setProvider] = useState([]);
    const [providerName, setproviderName] = useState('');
    const [chiefComplaintDescription, setchiefComplaintDescription] = useState('');
    const [patientExaminationDiagnosis, setpatientExaminationDiagnosis] = useState('');
    const [note, setNote] = useState('');

    const [patientChiefComplaint, setPatientChiefComplaint] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState([]);
    const [patientdiagnosisType, setPatientDiagnosisType] = useState([]);
    const [selecteddiagnosisType, setSelectedPatientDiagnosisType] = useState([]);
    const [providerInfo, setProviderInfo] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedTitle, setselectedTitle] = useState('');
    const [selectedtitleDiagnosis, setselectedtitleDiagnosis] = useState('');
    const [dateOfDiagnosis, setdateOfDiagnosis] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [userName, setuserName] = useState('');
    const [token, setToken] = useState('');
    const [loading, setloading] = useState(true);



    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     ////console.log(currentDate);
    //     setShow(false);
    //     setdateOfDiagnosis(currentDate);
    //     setDate(currentDate);
    // };

    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setuserName(user.userName);
        // Define form data
        const formData = {
            clinicID: user.clinicID,
            itemCategory: "PatientChiefComplaint"
        };

        const formData1 = {
            clinicID: user.clinicID,
            itemCategory: "Diagnosis"
        };

        const formData3 = {
            applicationDTO: {
                clinicID: user.clinicID,
            }
        };
        const formData2 = {

            parameter: {
                clinicID: clinicID,
                patientExaminationID: examinationID
            }
        }
        try {
            const [examinationResponse, providerInfoResponse, patientExaminationByID] = await Promise.all([
                dispatch(fetchExaminationData({ formData, formData1 })).unwrap(),
                dispatch(providerList(formData3)).unwrap(),
                dispatch(fetchPatientExaminationByID({ clinicID, examinationID }))
            ]);

            const chiefComplaint = patientExaminationByID.payload?.patientExaminationChiefComplaintListDTO || [];
            const diagnosis = patientExaminationByID.payload?.patientExaminationDiagnosisListDTO || [];
            const dateOfDiagnosis = patientExaminationByID.payload?.dateOfDiagnosis ? moment(patientExaminationByID.payload.dateOfDiagnosis).format('YYYY-MM-DD') : "Not Available";
            const providerName = patientExaminationByID.payload?.providerName || "Not Available";
            const diagnosisID = diagnosis.map(item => item.treatmentTypeID);
            const complaintID = chiefComplaint.map(item => item.chiefComplaintID);
            const complaint = chiefComplaint.map(item => item.chiefComplaintDescription);
            const diagnosisdes = diagnosis.map(item => item.description);
            setProvider(providerInfoResponse);
            setPatientChiefComplaint(examinationResponse.chiefComplaint);
            setPatientDiagnosisType(examinationResponse.diagnosis);
            setgetexaminationbyID(patientExaminationByID.payload);
            setproviderName(providerName);
            setNote(patientExaminationByID.payload.patientDiagnosisNotes);
            setdateOfDiagnosis(dateOfDiagnosis);
            setGroupValues(complaintID);
            setGroupValues1(diagnosisID);
            setchiefComplaintDescription(complaint);
            setpatientExaminationDiagnosis(diagnosisdes);
            // console.log("chiefComplaint", chiefComplaint);
            // console.log("diagnosis", diagnosis);
            // console.log("diagnosisID", diagnosisID);
            // console.log("complaintID", complaintID);
            // console.log("dateOfDiagnosis",dateOfDiagnosis);
            // console.log("providerName",providerName);
            // console.log("Chief Complaint Data:", examinationResponse.chiefComplaint);
            // console.log("Diagnosis Data:", examinationResponse.diagnosis);
        } catch (error) {
            console.error("Error fetching data:", error);
            //setloading(false);
        } finally {
            setloading(false);
        }

    }

    useEffect(() => {
        readData()
    }, [clinicID, examinationID, providerName, dispatch]);


    const onChange = (day) => {
        if (day) {
            const formattedDate = moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString();
           // console.log(formattedDate);
            setdateOfDiagnosis(formattedDate);// Assuming this is a Date object
            setModalVisible(false);
            setDate(moment(formattedDate));
        }
    };
    const showDatepicker = () => {
        setShow(true);
    };

    const deleteExamination = async () => {
        const headers = await getHeaders();
        const formData =
            [
                {
                    patientExaminationID: examinationID

                }
            ]

        //console.log("Delete FormData", formData);
        try {
            Axios.post(`${Api}Patient/DeletePatientExaminationDone`, formData, { headers }).then(resp => {
                //console.log(resp.data);
                setconfirmationWindow(false);
                if (resp.data) {
                    // Snackbar.show({
                    //     text: 'Delete examination sucessfully.',
                    //     duration: Snackbar.LENGTH_SHORT,
                    //     backgroundColor: 'green',
                    //     fontFamily: 'Poppins-Medium',
                    //     fontSize: 10
                    // });
                    Toast.show({
                        type: 'success', // Match the custom toast type
                        text1: 'Delete examination sucessfully.',
                    });
                    //alert('Delete examination sucessfully.');
                    navigation.goBack('Examination', {
                        clinicID: clinicID,
                        patientID: myPatientID
                    });
                }
            })
        } catch (error) {
            //console.log(error.message);
        }
    }

    const openModal = () => {
        setSelectedComplaint([]);
        setShowModal(true);
    }
    const openModal1 = () => {
        //setSelectedPatientDiagnosisType([]);
        setShowModal1(true);
    }
    const handleCheckBox = () => {
        if (groupValues.length === 0) {
            alert('Please select at least one complaint.');
            return;
        }

        const data = [];
        for (let i = 0; i < groupValues.length; i++) {
            const id = groupValues[i];
            // Find the corresponding complaint based on ID
            const author = patientChiefComplaint.find(item => item.itemID === id);

            if (author) {
                data.push(author);
            }
        }

        // Update state with selected complaints and titles
        setselectedTitle(data.map(item => item.itemTitle));
        setSelectedComplaint(data);
        setShowModal(false);  // Close modal after selection
    };

    const handleCheckBox1 = () => {
        if (groupValues1.length === 0) {
            // If no checkboxes are selected, reset the diagnosis and close the modal
            setpatientExaminationDiagnosis('');
            setselectedtitleDiagnosis('');
            setSelectedPatientDiagnosisType([]);
            setShowModal1(false);
        } else {
            const data = [];
            for (let i = 0; i < groupValues1.length; i++) {
                const id = groupValues1[i];
                const author = patientdiagnosisType.find(item => item.itemID === id);

                if (author) {
                    data.push(author);
                }
            }

            // Update the state with the selected diagnosis descriptions
            setselectedtitleDiagnosis(data.map(item => item.itemDescription));
            setSelectedPatientDiagnosisType(data);
        }

        // Close the modal after selection or if no boxes are selected
        setShowModal1(false);
    };

    // const onEditExamination = () => {
    //     console.log(selectedComplaint);
    //     console.log(selecteddiagnosisType);
    //     const drID = provider.filter(item => item.providerName == providerName);
    //     //console.log("DR ID", drID[0].providerID);
    //     const myselectedChiefComplaint = selectedComplaint.map(item => item.itemTitle || item.chiefComplaintDescription);
    //     //console.log("FINAL COMPLAIN", myselectedChiefComplaint);
    //     let formData = { ...getexaminationbyID };
    //     //console.log("302 FormData",formData);
    //     if (selectedComplaint.length == 0 && selecteddiagnosisType.length == 0) {
    //         formData.providerID = drID[0].providerID;
    //         formData.dateOfDiagnosis = date.toISOString();
    //         formData.patientDiagnosisNotes = note;
    //         try {
    //             Axios.post(`${Api}Patient/InsertPatientExaminationDetail`, formData).then(resp => {
    //                 //console.log(resp.data);
    //                 if (resp.data) {
    //                     // Snackbar.show({
    //                     //     text: 'Edit examination sucessfully.',
    //                     //     duration: Snackbar.LENGTH_SHORT,
    //                     //     backgroundColor: 'green',
    //                     //     fontFamily: 'Poppins-Medium',
    //                     //     fontSize: 10
    //                     // });
    //                     alert('Edit examination sucessfully.')
    //                     navigation.goBack('Examination', {
    //                         clinicID: clinicID,
    //                         patientID: myPatientID
    //                     });
    //                 }
    //             })
    //         } catch (error) {
    //             console.log(error.message);
    //             // Snackbar.show({
    //             //     text: 'Something went wrong.',
    //             //     duration: Snackbar.LENGTH_SHORT,
    //             //     backgroundColor: 'red',
    //             //     fontFamily: 'Poppins-Medium',
    //             //     fontSize: 10
    //             // });
    //         }
    //         return
    //     }
    //     formData.dateOfDiagnosis = moment(dateOfDiagnosis).toISOString();
    //     console.log("DATE OF DIAGNOSIS", formData.dateOfDiagnosis);
    //     formData.patientExaminationChiefComplaintListDTO = [];
    //     formData.patientExaminationDiagnosisListDTO = [];
    //     if (selecteddiagnosisType && selecteddiagnosisType.length > 0) {
    //         for (let i = 0; i < selecteddiagnosisType.length; i++) {
    //             let arrObj1 = {
    //                 patientExaminationDiagnosisID: "00000000-0000-0000-0000-000000000000",
    //                 patientExaminationID: "00000000-0000-0000-0000-000000000000",
    //                 itemTitle: selecteddiagnosisType[i].itemTitle,
    //                 treatmentTypeID: selecteddiagnosisType[i].itemID,
    //                 description: selecteddiagnosisType[i].itemDescription,
    //                 teethTreatments: null,
    //                 isDeleted: false,
    //                 createdOn: date.toISOString(),
    //                 createdBy: null,
    //                 lastUpdatedOn: date.toISOString(),
    //                 lastUpdatedBy: null,
    //                 lookUpsDTO: {
    //                     id: "00000000-0000-0000-0000-000000000000",
    //                     clinicID: clinicID,
    //                     itemID: selecteddiagnosisType[i].itemID,
    //                     itemTitle: selecteddiagnosisType[i].itemTitle,
    //                     itemDescription: selecteddiagnosisType[i].itemDescription,
    //                     gender: null,
    //                     itemCategory: selecteddiagnosisType[i].itemCategory,
    //                     isDeleted: false,
    //                     importance: 0,
    //                     lastUpdatedBy: null,
    //                     lastUpdatedOn: date.toISOString(),
    //                     rowguid: "00000000-0000-0000-0000-000000000000",
    //                     recordCount: 0,
    //                     medicalTypeID: "00000000-0000-0000-0000-000000000000",
    //                     patientAttributeData: null,
    //                     patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
    //                 },
    //                 rowguid: "00000000-0000-0000-0000-000000000000"
    //             }
    //             formData.patientExaminationDiagnosisListDTO.push(arrObj1)
    //         }

    //         if (selectedComplaint && selectedComplaint.length > 0) {
    //             for (let i = 0; i < selectedComplaint.length; i++) {
    //                 let arrObj2 = {
    //                     patientExaminationChiefComplentID: "00000000-0000-0000-0000-000000000000" || selectedComplaint[i].chiefComplaintDescription,
    //                     patientExaminationID: examinationID,
    //                     chiefComplaintID: selectedComplaint[i].itemID,
    //                     chiefComplaintDescription: selectedComplaint[i].itemDescription || selectedComplaint[i].chiefComplaintDescription,
    //                     patientExaminationID: examinationID,
    //                     isDeleted: false,
    //                     createdOn: date.toISOString(),
    //                     createdBy: null,
    //                     lastUpdatedOn: date.toISOString(),
    //                     lastUpdatedBy: null
    //                 }
    //                 formData.patientExaminationChiefComplaintListDTO.push(arrObj2);
    //             }
    //         }
    //         try {
    //             Axios.post(`${Api}Patient/InsertPatientExaminationDetail`, formData).then(resp => {
    //                 //console.log(resp.data);
    //                 if (resp.data) {
    //                     // Snackbar.show({
    //                     //     text: 'Edit examination sucessfully.',
    //                     //     duration: Snackbar.LENGTH_SHORT,
    //                     //     backgroundColor: 'green',
    //                     //     fontFamily: 'Poppins-Medium',
    //                     //     fontSize: 10
    //                     // });
    //                     alert('Edit examination sucessfully.')
    //                     navigation.goBack('Examination', {
    //                         clinicID: clinicID,
    //                         patientID: myPatientID
    //                     });
    //                 }
    //             })
    //         } catch (error) {
    //             console.log(error.message);
    //             // Snackbar.show({
    //             //     text: 'Something went wrong.',
    //             //     duration: Snackbar.LENGTH_SHORT,
    //             //     backgroundColor: 'red',
    //             //     fontFamily: 'Poppins-Medium',
    //             //     fontSize: 10
    //             // });
    //         }
    //     }
    //     else {
    //         if (selectedComplaint.length == 0) {
    //             console.log("NO CHANGE IN COMPLAINT",);
    //             formData.patientExaminationChiefComplaintListDTO = getexaminationbyID.patientExaminationChiefComplaintListDTO;
    //         } else {
    //             if (selectedComplaint && selectedComplaint.length > 0) {
    //                 for (let i = 0; i < selectedComplaint.length; i++) {
    //                     let arrObj2 = {
    //                         patientExaminationChiefComplentID: "00000000-0000-0000-0000-000000000000" || selectedComplaint[i].chiefComplaintDescription,
    //                         patientExaminationID: examinationID,
    //                         chiefComplaintID: selectedComplaint[i].itemID,
    //                         chiefComplaintDescription: selectedComplaint[i].itemDescription || selectedComplaint[i].chiefComplaintDescription,
    //                         patientExaminationID: examinationID,
    //                         isDeleted: false,
    //                         createdOn: date.toISOString(),
    //                         createdBy: null,
    //                         lastUpdatedOn: date.toISOString(),
    //                         lastUpdatedBy: null
    //                     }
    //                     formData.patientExaminationChiefComplaintListDTO.push(arrObj2);
    //                 }
    //             }
    //         }
    //         if (selecteddiagnosisType.length == 0) {
    //             console.log("NO CHANGE IN Diagnosisi",);
    //             formData.patientExaminationDiagnosisListDTO = getexaminationbyID.patientExaminationDiagnosisListDTO;
    //         } else {
    //             if (selecteddiagnosisType && selecteddiagnosisType.length > 0) {
    //                 for (let i = 0; i < selecteddiagnosisType.length; i++) {
    //                     let arrObj1 = {
    //                         patientExaminationDiagnosisID: "00000000-0000-0000-0000-000000000000",
    //                         patientExaminationID: "00000000-0000-0000-0000-000000000000",
    //                         itemTitle: selecteddiagnosisType[i].itemTitle,
    //                         treatmentTypeID: selecteddiagnosisType[i].itemID,
    //                         description: selecteddiagnosisType[i].itemDescription,
    //                         teethTreatments: null,
    //                         isDeleted: false,
    //                         createdOn: date.toISOString(),
    //                         createdBy: null,
    //                         lastUpdatedOn: date.toISOString(),
    //                         lastUpdatedBy: null,
    //                         lookUpsDTO: {
    //                             id: "00000000-0000-0000-0000-000000000000",
    //                             clinicID: clinicID,
    //                             itemID: selecteddiagnosisType[i].itemID,
    //                             itemTitle: selecteddiagnosisType[i].itemTitle,
    //                             itemDescription: selecteddiagnosisType[i].itemDescription,
    //                             gender: null,
    //                             itemCategory: selecteddiagnosisType[i].itemCategory,
    //                             isDeleted: false,
    //                             importance: 0,
    //                             lastUpdatedBy: null,
    //                             lastUpdatedOn: date.toISOString(),
    //                             rowguid: "00000000-0000-0000-0000-000000000000",
    //                             recordCount: 0,
    //                             medicalTypeID: "00000000-0000-0000-0000-000000000000",
    //                             patientAttributeData: null,
    //                             patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
    //                         },
    //                         rowguid: "00000000-0000-0000-0000-000000000000"
    //                     }
    //                     formData.patientExaminationDiagnosisListDTO.push(arrObj1)
    //                 }
    //             }
    //         }
    //         console.log("FormData Line 486", formData);
    //         try {
    //             Axios.post(`${Api}Patient/InsertPatientExaminationDetail`, formData).then(resp => {
    //                 //console.log(resp.data);
    //                 if (resp.data) {
    //                     // Snackbar.show({
    //                     //     text: 'Edit examination sucessfully.',
    //                     //     duration: Snackbar.LENGTH_SHORT,
    //                     //     backgroundColor: 'green',
    //                     //     fontFamily: 'Poppins-Medium',
    //                     //     fontSize: 10
    //                     // });
    //                     alert('Edit examination sucessfully.');
    //                     navigation.goBack('Examination', {
    //                         clinicID: clinicID,
    //                         patientID: myPatientID
    //                     });
    //                 }
    //             })
    //         } catch (error) {
    //             console.log(error.message);
    //             // Snackbar.show({
    //             //     text: 'Something went wrong.',
    //             //     duration: Snackbar.LENGTH_SHORT,
    //             //     backgroundColor: 'red',
    //             //     fontFamily: 'Poppins-Medium',
    //             //     fontSize: 10
    //             // });
    //         }
    //     }

    // }

    const onEditExamination = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);

        try {
           // console.log("Selected Complaint:", selectedComplaint);
          //  console.log("Selected Diagnosis Type:", selecteddiagnosisType);

            // Get provider ID based on providerName
            const drID = provider.find(item => item.providerName === providerName)?.providerID;
            if (!drID) {
                throw new Error("Provider not found");
            }

            // Create formData from existing examination data
            let formData = { ...getexaminationbyID };
            formData.providerID = drID;
            formData.dateOfDiagnosis = dateOfDiagnosis;
            formData.patientDiagnosisNotes = note;
            formData.createdOn = date.toISOString();
            formData.createdBy = user.userName;
            formData.lastUpdatedOn = date.toISOString();
            formData.lastUpdatedBy = user.userName;
            formData.patientExaminationChiefComplaintListDTO = [];
            formData.patientExaminationDiagnosisListDTO = [];

            // Populate Chief Complaints
            if (selectedComplaint.length > 0) {
                formData.patientExaminationChiefComplaintListDTO = selectedComplaint.map(item => ({
                    patientExaminationChiefComplentID: "00000000-0000-0000-0000-000000000000",
                    patientExaminationID: examinationID,
                    chiefComplaintID: item.itemID,
                    chiefComplaintDescription: item.itemDescription || item.chiefComplaintDescription,
                    isDeleted: false,
                    createdOn: date.toISOString(),
                    createdBy: user.userName,
                    lastUpdatedOn: date.toISOString(),
                    lastUpdatedBy: user.userName,
                }));
            } else {
                // If no complaints selected, retain the original chief complaints data
                formData.patientExaminationChiefComplaintListDTO = getexaminationbyID.patientExaminationChiefComplaintListDTO;
            }

            // Populate Diagnosis Types
            if (selecteddiagnosisType && selecteddiagnosisType.length > 0) {
                formData.patientExaminationDiagnosisListDTO = selecteddiagnosisType.map(item => ({
                    patientExaminationDiagnosisID: "00000000-0000-0000-0000-000000000000",
                    patientExaminationID: "00000000-0000-0000-0000-000000000000",
                    itemTitle: item.description,
                    treatmentTypeID: item.itemID,
                    description: item.itemDescription,
                    teethTreatments: null,
                    isDeleted: false,
                    createdOn: date.toISOString(),
                    createdBy: user.userName,
                    lastUpdatedOn: date.toISOString(),
                    lastUpdatedBy: user.userName,
                    lookUpsDTO: {
                        id: "00000000-0000-0000-0000-000000000000",
                        clinicID: clinicID,
                        itemID: item.itemID,
                        itemTitle: item.itemDescription,
                        itemDescription: item.itemDescription,
                        gender: null,
                        itemCategory: item.itemCategory,
                        isDeleted: false,
                        importance: 0,
                        lastUpdatedBy: user.userName,
                        lastUpdatedOn: date.toISOString(),
                        rowguid: "00000000-0000-0000-0000-000000000000",
                        recordCount: 0,
                        medicalTypeID: "00000000-0000-0000-0000-000000000000",
                        patientAttributeData: null,
                        patientAttributeDataID: "00000000-0000-0000-0000-000000000000"
                    },
                    rowguid: "00000000-0000-0000-0000-000000000000"
                }));
            } else {
                // If no diagnosis selected, retain the original diagnosis data
                formData.patientExaminationDiagnosisListDTO = getexaminationbyID.patientExaminationDiagnosisListDTO;
            }

           // console.log("Final Form Data:", formData);
            //Send data to API
            const response = await Axios.post(`${Api}Patient/InsertPatientExaminationDetail`, formData, { headers });
            if (response.data) {
                //alert('Edit examination successfully.');
                Toast.show({
                    type: 'success', // Match the custom toast type
                    text1: 'Edit examination successfully.',
                });
                navigation.goBack('Examination', {
                    clinicID: clinicID,
                    patientID: myPatientID
                });
            }
        } catch (error) {
            //console.log(error.message);
           // alert('Something went wrong.');
        }
    }



    return (
        <>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Please select Date</Text></Modal.Header>
                    <Modal.Body>
                        <Calendar
                            onChange={onChange}
                            value={date}
                            maxDate={new Date()}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <Modal isOpen={confirmationWindow} onClose={() => setconfirmationWindow(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                    <Modal.Body>
                        <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to delete this record ?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity onPress={() => {
                            setconfirmationWindow(false);
                        }}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}>  No</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteExamination()}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}>  Yes</Text>
                            </View>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content width={350} height={500}>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}>
                        <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Chief Complaint</Text>
                    </Modal.Header>
                    <Modal.Body>
                        <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
                            <Checkbox.Group
                                onChange={setGroupValues}
                                value={groupValues}  // Sync value with selected checkboxes
                            >
                                {patientChiefComplaint.map(item =>
                                    <Checkbox
                                        value={item.itemID}
                                        my="1"
                                        marginBottom={4}
                                        key={item.itemID}  // Use item.itemID as the key for uniqueness
                                         colorScheme="blue"
                                    >
                                        <Text style={{ fontFamily: "poppins-regular" }}>{item.itemTitle}</Text>
                                    </Checkbox>
                                )}
                            </Checkbox.Group>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity onPress={() => setShowModal(false)}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCheckBox}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
                <Modal.Content width={350} height={500}>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}>
                        <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Diagnosis Type</Text>
                    </Modal.Header>
                    <Modal.Body>
                        <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
                            <Checkbox.Group
                                onChange={setGroupValues1}
                                value={groupValues1}  // Sync value with selected checkboxes
                            >
                                {patientdiagnosisType.map(item =>
                                    <Checkbox
                                        value={item.itemID}
                                        my="1"
                                        marginBottom={4}
                                        key={item.itemID}  // Use item.itemID as the key for uniqueness
                                         colorScheme="blue"
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#5f6067',
                                            fontFamily: 'Poppins-Medium',
                                        }}>{item.itemDescription}</Text>
                                    </Checkbox>
                                )}
                            </Checkbox.Group>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity onPress={() => setShowModal1(false)}>
                            <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                <Text style={CommonStylesheet.ButtonText}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCheckBox1}>
                            <View style={CommonStylesheet.buttonContainersave1}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {/* <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStylesheet.backgroundimage}> */}
            <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
                {loading ? <Loader /> :
                    <View style={{
                        width: '100%', height: 'auto', padding: 12
                        //borderColor:'red',borderWidth:2, padding:10 
                    }}>
                        <Stack space={2} w="100%" mx="auto" justifyContent={'center'}>
                            <View>
                                <Picker
                                    selectedValue={providerName}
                                    fontSize={secondaryCardHeader}
                                    style={{
                                        height: height * 0.07,
                                        size: "lg",
                                        borderColor: '#e0e0e0',
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: '#fff',
                                        paddingLeft: 10,
                                    }} onValueChange={itemValue => setproviderName(itemValue)}>
                                    {provider.map(item => (
                                        <Picker.Item label={item.providerName} value={item.providerName} key={item.providerID} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ flexDirection: 'row' }}>

                                <Input
                                    width={'92%'}
                                    onFocus={setModalVisible}
                                    height={height * 0.07}
                                    style={styles.inputPlaceholder}
                                    borderRadius={5}
                                    placeholderTextColor={'#888888'}
                                    placeholder="Date Of Diagnosis"
                                    value={moment(dateOfDiagnosis).format('LL')}>
                                </Input>
                                <View style={{ justifyContent: 'center', padding: 5, width: '10%' }}>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                        <Image
                                            source={require('../../../assets/images/calendarDash.png')} alt="logo.png"
                                            style={{ height: 34, width: 36, borderRadius: 5 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <TouchableOpacity onPress={() => openModal()}> */}
                            <View>
                                <Input
                                    height={height * 0.07}
                                    size="lg"
                                    value={selectedComplaint.length === 0 ? chiefComplaintDescription.toString() : selectedTitle.join(', ')}
                                    style={styles.inputPlaceholder}
                                    borderRadius={5}
                                    placeholderTextColor={'#888888'}
                                    placeholder="Chief Complaint"
                                    onFocus={() => openModal()}
                                />
                            </View>

                            <View>
                                <Input
                                    height={height * 0.07}
                                    size="lg"
                                    value={selecteddiagnosisType.length === 0 ? patientExaminationDiagnosis.toString() : selectedtitleDiagnosis.join(', ')}
                                    style={styles.inputPlaceholder}
                                    borderRadius={5}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Diagnosis Type"
                                    onFocus={() => openModal1()}
                                />
                            </View>

                            {/* </TouchableOpacity> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Input
                                    width={'100%'}
                                    height={height * 0.07}
                                    size="lg"
                                    value={note}
                                    onChangeText={(value) => setNote(value)}
                                    style={styles.inputPlaceholder}
                                    borderRadius={5}
                                    placeholderTextColor={'#808080'}
                                    placeholder="Add Notes"
                                />
                                {/* <TouchableOpacity>
                            <View style={{justifyContent:'center',padding:5,width:'10%'}}>
                                <Icon
                                    name="microphone"
                                    size={icon_size}
                                    color={"#2196f3"}
                                     />
                                </View>
                            </TouchableOpacity> */}
                            </View>

                            <Box style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <View style={{}}>
                                    <TouchableOpacity onPress={() => onEditExamination()}>
                                        <View style={CommonStylesheet.buttonContainersave}>
                                            <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{}}>
                                    <TouchableOpacity onPress={() => setconfirmationWindow(true)}>
                                        <View style={CommonStylesheet.buttonContainerdelete}>
                                            <Text style={CommonStylesheet.ButtonText}>Delete</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Box>
                        </Stack>
                    </View>
                }
            </View>


        </>
    );
};


const styles = StyleSheet.create({


    dropdown: {
        margin: 16,
        height: 40,
        width: 340,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    imageStyle: {
        width: 24,
        height: 24,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    ButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 300,
        height: 260,
        display: 'flex',
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#A6A6A6',
        backgroundColor: '#FFFFFF',
        //opacity: 0.5,

        // borderRadius:10
    },
    iconLogo: {
        width: width * 0.07, // Adjust width based on screen width
        height: height * 0.07, // Adjust height based on screen height
        resizeMode: 'contain', // You can adjust the resizeMode as needed
    }

})

export default EditExamination;