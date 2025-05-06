import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Input, Box, Stack, VStack, Button, Image, Modal, HStack, Divider } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Api from '../../api/Api';
const { height, width } = Dimensions.get('window');
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import { useDispatch } from 'react-redux';
//import { updateFilesAfterAssign } from '../Files/filesSlice';
import { resetFiles, updateFilesformobile, fetchFiles } from '../../features/filesSlice';
import { getHeaders } from '../../utils/apiHeaders';
import Loader from '../../components/Loader';


const AssignTo = ({ route }) => {
    const { selectedFiles } = route.params;
    // //console.log('selectedFiles', selectedFiles);
    // if (selectedFiles?.length) {
    //     const [{ id, description, folderId }] = selectedFiles;
    //     //console.log('id:', id, 'description:', description, 'folderId1:', folderId);
    // } else {
    //     //console.log('No files selected');
    // }
    const [{ description = '' } = {}] = selectedFiles || [{ description: '' }];
    const [{ id = '' } = {}] = selectedFiles || [{ id: '' }];
    const [patient, setPatient] = useState('');
    const [all, setAll] = useState(description);
    // //console.log('all',all);

    const [folderId, setfolderId] = useState([{ id }]);
    const [dropdown, setDropdowndata] = useState([]);
    const [token, setToken] = useState('');
    const [ClinicID, setClinicid] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFolder, setselectedFolder] = useState('');
    const navigation = useNavigation();
    const [userName, setuserName] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const headers = {
        'Content-Type': 'application/json',
        'AT': 'MobileApp',
        'Authorization': token,
    };
    const readData = async () => {
        setLoading(true);
        const headers = await getHeaders();
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            setClinicid(user.clinicID);
            setuserName(user.userName);
            const formData1 = {
                clinicID: user.clinicID,
                folderId: 0,
            };

            const response = await Axios.post(`${Api}Document/GetDocumentFolderById`, formData1, { headers });
            // //console.log('Folder ID:', response.data);
            setfolderId(response.data);
            setDropdowndata(response.data);
            // //console.log("dropdown",dropdown);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching folder ID:', error);
        }
    };


    useEffect(() => {
        readData();
    }, []);

    const handleSearch = async (query) => {
        const headers = await getHeaders();
        setPatient(query); // Update the state with the search input
        if (query.length < 3) {
            setSearchResults([]);
            return
        }

        const formData = {
            clinicID: ClinicID,
            providerID: "",
            modeofpayment: "All",
            reportType: "",
            sortOrder: "",
            sortColumn: "",
            Searchby: "AllPatients",
            communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000",
            patientName: query, // Send the search query
        };

        Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData, { headers })
            .then((resp) => {
                // //console.log("Patient List on Search", resp.data);
                setSearchResults(resp.data); // Update dropdown with results
            })
            .catch((error) => {
                console.error("Error fetching patients:", error);
                setSearchResults([]); // Clear results on error
            });
    };
    const handleSelectPatient = (patient) => {
        setPatient(patient.patientName); // Set the selected patient name
        setSearchResults([]); // Clear the dropdown list
        setSelectedPatient(patient); // Store the selected patient for confirmation
        setModalVisible(true); // Show confirmation modal
    };

    const handleConfirm = async () => {
        setLoading(true);

        setModalVisible(false);

        const formData = {
            clinicID: ClinicID,
            patientID: selectedPatient.patientID || '00000000-0000-0000-0000-000000000000',
            lastUpdatedBy: userName,
            documentsFileDTOListDTO: selectedFiles.map((file) => ({
                documentsFileDTO: {
                    clinicID: ClinicID,
                    patientID: selectedPatient.patientID || '00000000-0000-0000-0000-000000000000',
                    description: all || file.description,
                },
                id: file.id,
                folderId: selectedFolder || file.folderId,
                description: all || file.description,
            })),
        };

        try {
            const response = await dispatch(updateFilesformobile({ formData, headers }));
            if (response.payload === 1) {
                // //console.log('Successfully updated files, refreshing file list...');
                dispatch(resetFiles());
                await dispatch(fetchFiles({ pageindex: 0, clinicID: ClinicID }));
                navigation.navigate('FileList');
                setLoading(false);
            } else {
                console.warn('No payload or unexpected payload returned from updateFilesformobile');
            }
        } catch (error) {
            console.error('Error calling updateFilesformobile thunk:', error);
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: "#f2f8ff" }}>
            {loading ? <Loader /> :
                <>
                    <View style={{ marginTop: 5, padding: 10 }}>
                        <Stack space={2} w="100%" mx="auto">
                            {/* Picker Dropdown */}
                            <View>
                                <Picker
                                    width={width - 15}
                                    size={"lg"}
                                    style={{
                                        height: height * 0.07,
                                        borderColor: "#e0e0e0",
                                        fontFamily: "Poppins-Regular",
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white",
                                    }}
                                    selectedValue={all}
                                    onValueChange={(itemValue) => {
                                        setAll(itemValue);  // Update `all` state with the selected description
                                        // Find the selected folder based on the description
                                        const selectedFolder = folderId.find(item => item.description === itemValue);
                                        setselectedFolder(selectedFolder ? selectedFolder.folderId : null);  // Set selectedFolder state
                                    }}
                                >
                                    {folderId.map((item) => (
                                        <Picker.Item
                                            label={item.description}
                                            value={item.description}
                                            key={item.folderId}
                                        />
                                    ))}
                                </Picker>
                            </View>

                            <View>
                                <Input
                                    width={"100%"}
                                    height={height * 0.07} // Adjust height as per your design
                                    size="lg"
                                    value={patient}
                                    onChangeText={handleSearch} // Function to handle search query
                                    style={{
                                        fontFamily: "Poppins-Regular",
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        borderColor: "#e0e0e0",
                                        borderRadius: 5,
                                        backgroundColor: "white",
                                    }}
                                    placeholder="Search Patient"
                                    placeholderTextColor="#808080"
                                />

                                {searchResults.length > 0 && (
                                    <View
                                        style={{
                                            position: "absolute",
                                            width: width - 15, // Match input width
                                            borderColor: "#e0e0e0",
                                            borderRadius: 5,
                                            backgroundColor: "white",
                                            maxHeight: 200, // Scrollable area
                                            zIndex: 1000,
                                            borderWidth: 1,
                                            top: height * 0.07, // Adjust position under the input field
                                        }}
                                    >
                                        {searchResults.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={{
                                                    padding: 10,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: "#e0e0e0",
                                                }}
                                                onPress={() => handleSelectPatient(item)} // Select patient from dropdown
                                            >
                                                <Text style={{ fontSize: 16, color: "#333" }}>{item.patientName}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>



                        </Stack>
                    </View>
                    <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
                        <Modal.Content>
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Confirmation</Text></Modal.Header>
                            <Modal.Body padding={5}>
                                <Text style={{ fontFamily: "poppins-regular" }}>Are you sure want to assign to this patient ?</Text>
                            </Modal.Body>
                            <Modal.Footer>



                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { setModalVisible(false) }}>
                                        <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                                            <Text style={CommonStylesheet.ButtonText}>No</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleConfirm}>
                                        <View style={CommonStylesheet.buttonContainersave1}>
                                            <Text style={CommonStylesheet.ButtonText}>Yes</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                </>
            }
        </View>

    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    scrollView: {
        alignItems: 'center',
    },
    inputPlaceholder: {
        fontSize: 16,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        backgroundColor: "white",
    },
    dropdownContainer: {
        position: "absolute",
        top: 50, // Adjust based on the input height
        width: "100%", // Matches the width of the input field
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        zIndex: 1000,
        maxHeight: "100%", // Makes the dropdown scrollable
        overflow: "hidden", // Prevents items from spilling out
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    dropdownText: {
        fontSize: 16,
        color: "#333",
    },
});

export default AssignTo;
