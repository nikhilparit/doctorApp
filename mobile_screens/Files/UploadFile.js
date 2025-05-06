import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Input, Box, Stack, VStack, Button, Image, Modal, HStack, Divider } from 'native-base';
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Api from '../../api/Api';
import { useNavigation } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');
import { resetFiles, fetchFiles, uploadFiles, saveMultipleDocumentFiles } from '../../features/filesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getHeaders } from '../../utils/apiHeaders';
import Loader from '../../components/Loader';




// import * as ImagePicker from 'expo-image-picker';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Axios from 'axios';
// import Api from '../../api/Api';
// const FileList = () => {
//     const [selectedImages, setSelectedImages] = useState([]);

//     const readData = async () => {
//         try {
//           const myClinicID = await AsyncStorage.getItem('clinicID');
//           //console.log(myClinicID);

//           const formData = {
//             clinicID: myClinicID,
//             pageSize: 10,
//             pageIndex: 0,
//             patientID: "00000000-0000-0000-0000-000000000000",
//             description: "All",
//             searchData: "",
//             startDate: "2024-06-02T08:07:11.764Z",
//             EndDate: "2024-06-17T08:07:11.764Z"
//           };

//           const response = await Axios.post(`${Api}Document/GetDocumentsByClinicIDWithPagingformobileweb`, formData);
//           //console.log(response.data);
//           setSelectedImages(response.data);
//         } catch (error) {
//           console.error(error);
//         }
//     }
// useEffect(()=>{
//     readData()
// },[]);

// const BASE_URL = "http://localhost"; // Replace with your actual base URL

// return (
//   <View style={styles.container}>
//     <ScrollView contentContainerStyle={styles.imageContainer}>
//         {selectedImages.map((image, index) => {
//           const imageUri = `${BASE_URL}${image.imageSrcMobile}`;
//           return (
//             <View key={index} style={styles.imageWrapper}>
//               <Image source={{ uri: imageUri }} style={styles.image} />
//             </View>
//           );
//         })}
//       </ScrollView>
//   </View>
// );
// };

// const styles = StyleSheet.create({
// container: {
//   flex: 1,
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: 20,
// },
// title: {
//   fontSize: 18,
//   marginBottom: 20,
// },
// imageContainer: {
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   marginTop: 20,
// },
// imageWrapper: {
//   position: 'relative',
//   margin: 5,
// },
// image: {
//   width: 100,
//   height: 100,
// },
// });

// export default FileList;


const UploadFile = ({ }) => {
    const navigation = useNavigation();
    const [files, setFiles] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [recordCount, setRecordCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [ClinicID, setClinicid] = useState('');
    const [folderId, setfolderId] = useState([]);
    const [all, setAll] = useState('');
    const [token, setToken] = useState('');
    const [selectedFolder, setselectedFolder] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [PatientID, setPatientID] = useState('');
    const [userName, setuserName] = useState('');
    // const openModal = () => {
    //     // setSelectedComplaint([]);
    //     setShowModal(true);
    // }
    const dispatch = useDispatch();
    const [selectedImages, setSelectedImages] = useState([]);

    const pickImages = async () => {
        // Ask the user for permission to access their photos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Open the image picker to select multiple images
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
        });

        ////console.log("result", result);

        if (!result.canceled) {
            setSelectedImages(result.assets);
        }
    };

    const takePhoto = async () => {
        // Ask the user for permission to use their camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        // Open the camera to take a photo
        const result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
            setSelectedImages([...selectedImages, result]);
        }
    };
    const removeImage = (uri) => {
        setSelectedImages(selectedImages.filter(image => image.uri !== uri));
    };
    const readData = async () => {
        const headers = await getHeaders();
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            setClinicid(user.clinicID);
            setuserName(user.userName);
            ////console.log(userName,'userName');

            const formData1 = {
                clinicID: user.clinicID,
                folderId: 0,
            };

            const response = await Axios.post(`${Api}Document/GetDocumentFolderById`, formData1, { headers });
            ////console.log('Folder ID:', response.data);
            setfolderId(response.data);
            if (response.data && response.data.length > 0) {
                setAll(response.data[2].description);  // Set the first folder as the default value
                setselectedFolder(response.data[2].folderId);
                // //console.log('setselectedFolder' ,response.data[0].folderId);

            }
        } catch (error) {
            console.error('Error fetching folder ID:', error);
        }
    };

    useEffect(() => {
        readData();
    }, []);
    // const UploadMyFile = async () => {

    //     const formData = new FormData();

    //     for (const image of selectedImages) {
    //         const base64Data = image.uri.split(',')[1];

    //         if (!base64Data) {
    //             console.error("Invalid Base64 Data for image:", image);
    //             continue;
    //         }

    //         // Convert Base64 to Blob
    //         const byteCharacters = atob(base64Data);
    //         const byteNumbers = new Array(byteCharacters.length)
    //             .fill(0)
    //             .map((_, i) => byteCharacters.charCodeAt(i));
    //         const byteArray = new Uint8Array(byteNumbers);
    //         const blob = new Blob([byteArray], { type: image.mimeType });
    //         ////console.log("Blob Created:", blob);

    //         // Append to FormData
    //         const originalFileName = image.fileName || `image_${Date.now()}.png`;
    //       //  //console.log("File Name:", originalFileName);
    //         formData.append('cliniLogofile', blob, originalFileName);
    //     }

    //     // Log FormData entries
    //    // //console.log("FormData Contents:");
    //     for (let pair of formData.entries()) {
    //       //  //console.log(pair[0] + ':', pair[1]);
    //     }

    //     try {
    //         // First API call: Upload files
    //         const response = await Axios.post(
    //             `${Api}Document/UploadFiles?ClinicID=${ClinicID}`,
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                     'AT': 'MobileApp',
    //                     'Authorization': token,
    //                 }
    //             }
    //         );

    //        // //console.log("First API response:", { ClinicID, data: response.data });


    //         // Prepare data for the second API call
    //         const formDataSecondCall = {
    //             clinicID: ClinicID,
    //             description:all,
    //             folderId: selectedFolder,
    //             patientID: PatientID || '00000000-0000-0000-0000-000000000000',
    //             documentsFileDTOListDTO: response.data.map(imageData => ({
    //                 documentsFileDTO: {
    //                     clinicID: ClinicID,
    //                     id: 0,
    //                     pageSize: 0,
    //                     pageIndex: 0,
    //                     documentID: 0,
    //                     versionNumber: 0,
    //                     relatedVersionID: 0,
    //                     relatedVersionNumber: 0,
    //                     folderId: selectedFolder,
    //                     statusID: 0,
    //                     patientID: "00000000-0000-0000-0000-000000000000", 
    //                     fileName: imageData.fileName,  // Use fileName from each image response
    //                     fileSize: imageData.fileSize,  // Use fileSize from each image response
    //                     fileType: imageData.fileType,  // Use fileType from each image response
    //                     virtualFilePath: imageData.virtualFilePath,  // Use virtualFilePath from each image response
    //                     physicalFilePath: imageData.physicalFilePath,  // Use physicalFilePath from each image response
    //                     publishedOn: new Date().toISOString(),
    //                     lastUpdatedDTO: {
    //                         createdBy: userName,
    //                         createdOn: new Date().toISOString(),
    //                         lastUpdatedBy: userName,
    //                         lastUpdatedOn: new Date().toISOString()
    //                     },
    //                     imageBase64: imageData.imageBase64  // Use fileThumbImage from each image response
    //                 }
    //             }))
    //         };

    //        // //console.log("Second API request data:", formDataSecondCall);
    //         // Second API call: Save document
    //         const response1 = await Axios.post(
    //             `${Api}Document/SaveMultipleDocumentFiles`,
    //             formDataSecondCall,
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     'AT': 'MobileApp',
    //                     'Authorization': token
    //                 }
    //             }
    //         );
    //          if (response1.payload === 3) {
    //                    // //console.log('Successfully updated files, refreshing file list...');
    //                     dispatch(resetFiles());
    //                     await dispatch(fetchFiles({ pageindex: 0, clinicID: ClinicID }));
    //                     navigation.navigate('FileList');
    //                   } else {
    //                     console.warn('No payload or unexpected payload returned from updateFilesformobile');
    //                   }
    //     } catch (error) {
    //         console.error("Error uploading files:", error);
    //     }
    // };
    const UploadMyFile = async () => {
        setLoading(true);
        //console.log("selectedImages:", selectedImages);

        // Prepare FormData for the first API call
        const formData = new FormData();
        for (const image of selectedImages) {
            try {
                const base64Data = image.uri.split(',')[1];

                if (!base64Data) {
                    console.error("Invalid Base64 Data for image:", image);
                    continue;
                }

                // Convert Base64 to Uint8Array
                const byteArray = Uint8Array.from(atob(base64Data), char => char.charCodeAt(0));
                const blob = new Blob([byteArray], { type: image.mimeType });

                const originalFileName = image.fileName || `image_${Date.now()}.png`;

                // Append to FormData
                formData.append('cliniLogofile', blob, originalFileName);
                //console.log(`Appended file: ${originalFileName}`, blob); // Log Blob details
            } catch (error) {
                console.error("Error processing image:", error);
            }
        }

        // Debug FormData content
        //console.log("Final FormData content:");
        for (const [key, value] of formData.entries()) {
            //console.log(`${key}:`, value); // This should log the Blob and its filename
        }

        try {
            //console.log("formData",formData);
            // Dispatch the first API call
            const uploadResponse = await dispatch(
                uploadFiles({ formData, ClinicID })
            ).unwrap(); // Unwrap to handle success/failure

            //console.log('Dispatch the first API call:', uploadResponse);

            // Prepare data for the second API call
            const formDataSecondCall = {
                clinicID: ClinicID,
                description: all,
                folderId: selectedFolder,
                patientID: PatientID || '00000000-0000-0000-0000-000000000000',
                documentsFileDTOListDTO: uploadResponse.map((imageData) => ({
                    documentsFileDTO: {
                        clinicID: ClinicID,
                        fileName: imageData.fileName,
                        fileSize: imageData.fileSize,
                        fileType: imageData.fileType,
                        virtualFilePath: imageData.virtualFilePath,
                        physicalFilePath: imageData.physicalFilePath,
                        publishedOn: new Date().toISOString(),
                        lastUpdatedDTO: {
                            createdBy: userName,
                            createdOn: new Date().toISOString(),
                            lastUpdatedBy: userName,
                            lastUpdatedOn: new Date().toISOString(),
                        },
                        imageBase64: imageData.imageBase64,
                    },
                })),
            };
            //console.log('formDataSecondCall', formDataSecondCall);
            // Dispatch the second API call
            const saveResponse = await dispatch(
                saveMultipleDocumentFiles({ formDataSecondCall, token })
            ).unwrap();
            //console.log('saveResponse', saveResponse);


            if (saveResponse === 3) {
                dispatch(resetFiles());
                await dispatch(fetchFiles({ pageindex: 0, clinicID: ClinicID }));
                navigation.navigate('FileList');
            } else {
                console.warn('Unexpected payload:', saveResponse);
            }
        } catch (error) {
            console.error("Error in file upload process:", error);
        } finally {
            setLoading(false);
        }
    };


    // const UploadMyFile = async () => {
    //     dispatch(
    //         uploadFiles({ 
    //             selectedImages, 
    //             ClinicID, 
    //             selectedFolder,
    //              PatientID, 
    //              all, 
    //              token, 
    //              userName,
    //              }));

    // };

    // Helper function to convert Base64 to Blob
    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    };

    const handleSearch = async (query) => {
        // Guard clause to handle undefined or null query
        if (!query) {
            setPatient(""); 
            setSearchResults([]); 
            return; 
        }
    
        const headers = await getHeaders();
        setPatient(query); // Update the state with the search input
    
        if (query.length < 3) {
            setSearchResults([]); // Clear results if input is less than 3 characters
            return;
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
    
        try {
            const response = await Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData, { headers });
            setSearchResults(response.data); // Update dropdown with results
        } catch (error) {
            console.error("Error fetching patients:", error);
            setSearchResults([]); // Clear results on error
        }
    };
    const handleSelectPatient = (patient) => {
        // //console.log('patient',patient);

        setPatient(patient.patientName); // Set selected patient's name in the input
        setPatientID(patient.patientID);
        setSearchResults([]); // Clear the dropdown
    };


    return (
        //   <View style={styles.container}>
        //     <Text style={styles.title}> Welcome UploadFile Screen</Text>

        //   </View>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {loading ? <Loader /> :
                <>
                    <View style={{ marginTop: 5, padding: 10 }}>
                        <Stack space={2} w="100%" mx="auto">
                            <View>
                                <Picker width={width - 15} size={'lg'}
                                    style={{
                                        height: height * 0.07,
                                        borderColor: '#e0e0e0',
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: 16,
                                        borderRadius: 5,
                                        backgroundColor: "white",
                                        paddingLeft: 10
                                    }}
                                    selectedValue={all}
                                    // onValueChange={(itemValue) => setAll(itemValue)}
                                    onValueChange={(itemValue) => {
                                        setAll(itemValue);
                                        const selectedFolder = folderId.find(item => item.description === itemValue)
                                        setselectedFolder(selectedFolder.folderId);
                                    }}


                                >
                                    {/* <Picker.Item label={item.folderId} value={description} color="black" />  */}
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
                                    onChangeText={(query) => handleSearch(query)}
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
                            {/* <Box style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                        <View>
                            <TouchableOpacity onPress={pickImages}>

                                <View style={CommonStylesheet.buttonContainersaveatForm}>
                                    <Text style={CommonStylesheet.ButtonText}>Add File</Text>
                                </View>

                            </TouchableOpacity>
                            <ScrollView contentContainerStyle={styles.imageContainer}>
                                {selectedImages.map((image, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image source={{ uri: image.uri }} style={styles.image} />
                                        <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(image.uri)}>
                                            <Icon name="times" size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => UploadMyFile()}>
                                <View style={CommonStylesheet.buttonContainerdelete}>
                                    <Text style={CommonStylesheet.ButtonText}>Upload File</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Box> */}
                            <Box style={{ marginTop: 60, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={pickImages}>
                                        <View style={CommonStylesheet.buttonContainersaveatForm}>
                                            <Text style={CommonStylesheet.ButtonText}>Add File</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView contentContainerStyle={styles.imageContainer} style={{ marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {selectedImages.map((image, index) => (
                                            <View key={index} style={styles.imageWrapper}>
                                                <Image source={{ uri: image.uri }} style={styles.image} />
                                                <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(image.uri)}>
                                                    <Icon name="times" size={20} color="red" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>

                            </Box>
                            {selectedImages.length > 0 && (
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                    <TouchableOpacity onPress={() => UploadMyFile()}>
                                        <View style={CommonStylesheet.buttonContainerdelete}>
                                            <Text style={CommonStylesheet.ButtonText}>Upload File</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            )}

                            {/* <View style={styles.container}>
                        <Button title="Upload Image" onPress={pickImages} />
                        <ScrollView contentContainerStyle={styles.imageContainer}>
                            {selectedImages.map((image, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri: image.uri }} style={styles.image} />
                                    <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(image.uri)}>
                                        <Icon name="times" size={20} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View> */}

                        </Stack>
                    </View>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                            <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Add Files!</Text></Modal.Header>
                            <Modal.Body>
                                <VStack space={3}>
                                    <TouchableOpacity >
                                        <HStack alignItems="center" marginBottom="11" >
                                            <Text fontFamily="poppins-regular">Open Camera</Text>
                                        </HStack><Divider />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={pickImages}>
                                        <ScrollView contentContainerStyle={styles.imageContainer}>
                                            {selectedImages.map((image, index) => (
                                                <View key={index} style={styles.imageWrapper}>
                                                    <Image source={{ uri: image.uri }} style={styles.image} />
                                                    <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(image.uri)}>
                                                        <Icon name="times" size={20} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </ScrollView>
                                        <HStack alignItems="center" >
                                            <Text fontFamily="poppins-regular">Choose from Gallery</Text>
                                        </HStack>
                                    </TouchableOpacity>
                                </VStack>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     padding: 20,
    // },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // marginTop: 20,
    },
    imageWrapper: {
        position: 'relative',
        margin: 5,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    scrollView: {
        alignItems: 'center',
    },
    fileWrapper: {
        width: '48%',
        margin: '1%',
        padding: 10,
        borderColor: '#dcdcdc',
        borderWidth: 2,
        borderRadius: 8,
    },
    image: {
        width: 100,
        height: 100,
    },
    loadMore: {
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 8,
        marginTop: 10,
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#A6A6A6',
        backgroundColor: '#FFFFFF',

    },
    removeIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 15,
        padding: 2,
    },
});

export default UploadFile;
