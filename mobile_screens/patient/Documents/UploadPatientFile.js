import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Input, Box, Stack, VStack, Button, Image, Modal, HStack, Divider } from 'native-base';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Api from '../../../api/Api';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../components/Loader';
import { getHeaders } from '../../../utils/apiHeaders';
const { height, width } = Dimensions.get('window');


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


const UploadPatientFile = ({ route }) => {
    const PatientID = route.params.PatientID;
    //console.log('PatientID', PatientID);
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
    const [userName, setuserName] = useState('');
    // const openModal = () => {
    //     // setSelectedComplaint([]);
    //     setShowModal(true);
    // }

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
        setLoading(true);
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        try {
            setToken(user.token);
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
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        readData();
    }, []);
    const UploadMyFile = async () => {
        setLoading(true);
        // Create a FormData object
        //  //console.log('selectedImages', selectedImages);
        const formData = new FormData();

        for (const image of selectedImages) {
            // Log selected image details
            // //console.log("Processing Image:", image);

            // Extract Base64 data
            const base64Data = image.uri.split(',')[1];
            // //console.log("Base64 Data:", base64Data);

            if (!base64Data) {
                console.error("Invalid Base64 Data for image:", image);
                continue;
            }

            // Convert Base64 to Blob
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length)
                .fill(0)
                .map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: image.mimeType });
            ////console.log("Blob Created:", blob);

            // Append to FormData
            const originalFileName = image.fileName || `image_${Date.now()}.png`;
            //  //console.log("File Name:", originalFileName);
            formData.append('cliniLogofile', blob, originalFileName);
        }

        // Log FormData entries
        // //console.log("FormData Contents:");
        for (let pair of formData.entries()) {
            //  //console.log(pair[0] + ':', pair[1]);
        }

        try {
            // First API call: Upload files
            const response = await Axios.post(
                `${Api}Document/UploadFiles?ClinicID=${ClinicID}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'AT': 'MobileApp',
                        'Authorization': token,
                    }
                }
            );

            //console.log("First API response:", { ClinicID, data: response.data });


            // Prepare data for the second API call
            const formDataSecondCall = {
                clinicID: ClinicID,
                description: all,
                folderId: selectedFolder,
                patientID: PatientID,
                documentsFileDTOListDTO: response.data.map(imageData => ({
                    documentsFileDTO: {
                        clinicID: ClinicID,
                        patientName: null,
                        mobileNumber: null,
                        patientCode: null,
                        id: 0,
                        pageSize: 0,
                        pageIndex: 0,
                        documentID: 0,
                        versionNumber: 0,
                        relatedVersionID: 0,
                        relatedVersionNumber: 0,
                        folderId: selectedFolder,
                        statusID: 0,
                        patientID: PatientID,
                        contactName: null,
                        description: null,
                        folderDesc: null,
                        fileName: imageData.fileName,  // Use fileName from each image response
                        firstName: null,
                        lastName: null,
                        uploadedFileName: null,
                        fileSize: imageData.fileSize,  // Use fileSize from each image response
                        fileType: imageData.fileType,  // Use fileType from each image response
                        fileThumbImage: null,
                        virtualFilePath: imageData.virtualFilePath,  // Use virtualFilePath from each image response
                        physicalFilePath: imageData.physicalFilePath,  // Use physicalFilePath from each image response
                        publishedOn: new Date().toISOString(),
                        expiredOn: null,
                        lastUpdatedDTO: {
                            createdBy: userName,
                            createdOn: new Date().toISOString(),
                            lastUpdatedBy: userName,
                            lastUpdatedOn: new Date().toISOString()
                        },
                        imageBase64: imageData.imageBase64  // Use fileThumbImage from each image response
                    }
                }))
            };

            // //console.log("Second API request data:", formDataSecondCall);
            // Second API call: Save document
            const response1 = await Axios.post(
                `${Api}Document/SaveMultipleDocumentFiles`,
                formDataSecondCall,
                {
                    headers: {
                        "Content-Type": "application/json",
                        'AT': 'MobileApp',
                        'Authorization': token
                    }
                }
            );
            setLoading(false);
            navigation.navigate('Files', { patientID: PatientID });


            //  //console.log("Second API response:", response1.data);

        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };


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

    // const handleSearch = (query) => {
    //     setPatient(query); // Update the state with the search input
    //     if (query.length < 3) {
    //         setSearchResults([]);
    //         return
    //     }  

    //     const formData = {
    //         clinicID: ClinicID,
    //         //startDat: "2023-01-01",
    //         //endDate: "2023-12-31",
    //         providerID: "",
    //         modeofpayment: "All",
    //         reportType: "",
    //         sortOrder: "",
    //         sortColumn: "",
    //         Searchby: "AllPatients",
    //         // pageIndex: 1,
    //         // pageSize: 100,
    //         communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000",
    //         patientName: query, // Send the search query
    //     };

    //     Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`,formData,
    //         {
    //             headers:{
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 'AT': 'MobileApp',
    //                 'Authorization': token
    //             }
    //         }
    //     }) 
    //         .then((resp) => {
    //            // //console.log("Patient List on Search", resp.data);
    //             setSearchResults(resp.data); // Update dropdown with results
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching patients:", error);
    //             setSearchResults([]); // Clear results on error
    //         });
    // };
    // const handleSelectPatient = (patient) => {
    //    // //console.log('patient',patient);

    //     setPatient(patient.patientName); // Set selected patient's name in the input
    //     setPatientID(patient.patientID);
    //     setSearchResults([]); // Clear the dropdown
    // };


    return (
        //   <View style={styles.container}>
        //     <Text style={styles.title}> Welcome UploadFile Screen</Text>

        //   </View>
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            {loading?<Loader/>:
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

                        {/* <View>
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
                    </View> */}
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

export default UploadPatientFile;
