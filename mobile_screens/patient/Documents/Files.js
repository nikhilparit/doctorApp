// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
// import Svg, { Polygon, Text as SvgText, Path } from 'react-native-svg';
// import axios from 'axios';
// import Loader from '../../../components/Loader.js';
// const { height, width } = Dimensions.get('window');

// const Files = () => {
//   const apiKey = 'QoMVAvHuBYp2MT9jv3qq3aWUCiT1BnF4MbUNnWkf';
//   const intrinsicWidth = 776; // Original image width
//   const intrinsicHeight = 400; // Original image height

//   // Scale down the rendered size by a factor (e.g., 0.7 for 70% of the original rendered size)
//   const scaleFactor = 0.6;
//   const renderedWidth = 1242 * scaleFactor; // Scaled rendered width
//   const renderedHeight = 640 * scaleFactor; // Scaled rendered height

//   const [selectedImages, setSelectedImages] = useState([]);
//   const [resultAtr, setResultAtr] = useState(false);
//   const [imageData, setImageData] = useState([]);
//   const [loading, setIsLoading] = useState(false);
//   const [imageUrl, setimageUrl] = useState('');
//   const [hiddenTags, setHiddenTags] = useState({});
//   const [analysisData, setAnalysisData] = useState(imageData?.findings?.Analysis || {});
//   const [drawing, setDrawing] = useState(false);
//   const [drawnPath, setDrawnPath] = useState('');

//   const pickImages = async () => {
//     // Ask the user for permission to access their photos
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera roll permissions to make this work!');
//       return;
//     }
//     // Open the image picker to select multiple images
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//     });

//     //console.log("result", result);

//     if (!result.canceled) {
//       setSelectedImages(result.assets);
//       //console.log("imageURL", result.assets);
//       setimageUrl(result.assets[0].uri);
//     }
//   };
//   const takePhoto = async () => {
//     // Ask the user for permission to use their camera
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera permissions to make this work!');
//       return;
//     }

//     // Open the camera to take a photo
//     const result = await ImagePicker.launchCameraAsync();

//     if (!result.canceled) {
//       setSelectedImages([...selectedImages, result]);
//     }
//   };
//   const removeImage = (uri) => {
//     setSelectedImages(selectedImages.filter(image => image.uri !== uri));
//   };
//   // Transform points to fit the rendered image dimensions
//   const transformPoints = (points) => {
//     //console.log(resultAtr, "resultAtr"); // This logs the resultAtr, assuming it's needed for debugging

//     // Transform points based on scaling
//     return points.map(point => [
//       (point[0] / intrinsicWidth) * renderedWidth,
//       (point[1] / intrinsicHeight) * renderedHeight,
//     ]);
//   };

//   // const onProcess = async () => {
//   //   setIsLoading(true);
//   //   setResultAtr(true);

//   //   // Create a new FormData object
//   //   const formData = new FormData();
//   //   formData.append('patient_id', '1');
//   //   formData.append('practice_id', '101');
//   //   formData.append('business_id', '1001');
//   //   formData.append('domain_address', 'http://localhost:8000');
//   //   formData.append('mixed', false);
//   //   formData.append('co_or', false);

//   //   // Loop through selected images and convert each to binary format
//   //   for (const image of selectedImages) {
//   //     const response = await fetch(image.uri);
//   //     const blob = await response.blob();
//   //     const originalFileName = image.uri.split('/').pop(); // Get the original file name
//   //     formData.append('images', blob, `image_${originalFileName}`); // Maintain the file name
//   //   }

//   //   try {
//   //     // First API request
//   //     const apiUrl = 'http://localhost:8000/dental_ai/upload_direct_images_opg';
//   //     const res = await fetch(apiUrl, {
//   //       method: 'POST',
//   //       body: formData,
//   //       headers: {
//   //         'x-api-key': apiKey,
//   //         'accept': 'application/json',
//   //       },
//   //     });

//   //     // Handle the first response
//   //     const result = await res.json();
//   //     //console.log(result);

//   //     // Check if result is successful and contains the hlink
//   //     if (result && result.hlink) {
//   //       const myUrl = result.hlink;
//   //       const finalDataUrl = myUrl.replace("http://localhost:8000/frame/finding?data=", "");
//   //       const myDataUrl = encodeURIComponent(finalDataUrl);

//   //       // Second API request
//   //       const secondApiUrl = `http://localhost:8000/dental_ai/Get_AI_Images_New?data=${myDataUrl}`;
//   //       const secondRes = await fetch(secondApiUrl, {
//   //         method: 'GET',
//   //         headers: {
//   //           'x-api-key': apiKey,
//   //           'accept': 'application/json',
//   //         },
//   //       });

//   //       // Handle the second response
//   //       const secondResult = await secondRes.json();
//   //       //console.log('secondResult findings:', secondResult);

//   //       // Set the image data based on the response
//   //       setImageData(secondResult);
//   //     } else {
//   //       console.error('No hlink found in the response');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error during processing:', error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
// //   const onProcess = async () => {
// //     setIsLoading(true);
// //     setResultAtr(true);

// //     const formData = new FormData();
// //     formData.append('patient_id', '1');
// //     formData.append('practice_id', '101');
// //     formData.append('business_id', '1001');
// //     formData.append('domain_address', 'http://axis.cliniqo.com');
// //     formData.append('mixed', false);
// //     formData.append('co_or', false);

// //     for (const image of selectedImages) {
// //       const response = await fetch(image.uri);
// //       const blob = await response.blob();
// //       const originalFileName = image.uri.split('/').pop();
// //       formData.append('images', blob, `image_${originalFileName}`);
// //     }

// //     try {
// //       // First API request using Axios
// //       const apiUrl = 'https://api.toothinsights.com/upload_direct_images';
// //       const res = await axios.post(apiUrl, formData, {
// //         headers: {
// //           'x-api-key': apiKey,
// //           'Accept': 'application/json',
// //           'Content-Type': 'multipart/form-data',
// //           'Access-Control-Allow-Origin': '*', // CORS header
// //         },
// //       });

// //       const result = res.data;
// //       //console.log(result);

// //       if (result && result.hlink) {
// //         const myUrl = result.hlink;
// //         const finalDataUrl = myUrl.replace("http://axis.cliniqo.com/frame/finding?data=", "");
// //         const myDataUrl = encodeURIComponent(finalDataUrl);

// //         // Second API request using Axios
// //         const secondApiUrl = `http://axis.cliniqo.com/dental_ai/Get_AI_Images_New?data=${myDataUrl}`;
// //         const secondRes = await axios.get(secondApiUrl, {
// //           headers: {
// //             'x-api-key': apiKey,
// //             'Accept': 'application/json',
// //             'Access-Control-Allow-Origin': '*', // CORS header
// //           },
// //         });

// //         const secondResult = secondRes.data;
// //         //console.log('secondResult findings:', secondResult);

// //         setImageData(secondResult);
// //       } else {
// //         console.error('No hlink found in the response');
// //       }
// //     } catch (error) {
// //       console.error('Error during processing:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// // };

// const toggleTagVisibility = (tagName, idx) => {
//     setHiddenTags(prevState => ({
//       ...prevState,
//       [idx]: !prevState[idx],
//     }));
//   };
//   const deleteTag = (tagName, index) => {
//     // Clone the current imageData to avoid direct mutation
//     const updatedImageData = { ...imageData };

//     // Iterate over each analysis in the findings to find the matching tag
//     Object.keys(updatedImageData.findings.Analysis).forEach((imageName) => {
//       const analysisData = updatedImageData.findings.Analysis[imageName];

//       // Remove the specific tag by filtering out the matching index
//       updatedImageData.findings.Analysis[imageName] = analysisData.filter((_, idx) => idx !== index);
//     });

//     // Update the state with the modified data
//     setImageData(updatedImageData);
//   };

//   const handleEnd = () => {
//     //console.log('End drawing');
//     setDrawing(false);
//   };
//   const getCoordinates = (e) => {
//     // Handle touch or mouse events
//     if (e.nativeEvent.locationX !== undefined) {
//       return { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
//     } else if (e.nativeEvent.clientX !== undefined) {
//       const { clientX, clientY } = e.nativeEvent;
//       const rect = e.target.getBoundingClientRect();
//       return { x: clientX - rect.left, y: clientY - rect.top };
//     }
//     return { x: 0, y: 0 }; // Fallback in case neither is available
//   };

//   const handleStart = (e) => {
//     const { x, y } = getCoordinates(e);
//     //console.log('Start drawing at:', x, y);
//     setDrawing(true);
//     setDrawnPath(`M${x},${y}`);
//   };

//   const handleMove = (e) => {
//     if (!drawing) return;
//     const { x, y } = getCoordinates(e);
//     //console.log('Move to:', x, y);
//     setDrawnPath((prevPath) => `${prevPath} L${x},${y}`);
//   };

//   const onProcess = async () => {
//     setIsLoading(true);
//     setResultAtr(true);

//     const formData = new FormData();
//     formData.append('patient_id', '1');
//     formData.append('practice_id', '101');
//     formData.append('business_id', '1001');
//     formData.append('domain_address', 'http://axis.cliniqo.com');
//     formData.append('mixed', false);
//     formData.append('co_or', false);

//     for (const image of selectedImages) {
//       const response = await fetch(image.uri);
//       const blob = await response.blob();
//       const originalFileName = image.uri.split('/').pop();
//       formData.append('images', blob, `image_${originalFileName}`);
//     }

//     try {
//       // First API request using Axios
//       const apiUrl = 'http://axis.cliniqo.com/dental_ai/upload_direct_images';
//       //const apiUrl = 'http://localhost:5000/dental_ai/upload_direct_images';
//       const res = await axios.post(apiUrl, formData, {
//         headers: {
//           'x-api-key': apiKey,
//           'Accept': 'application/json',
//           'Content-Type': 'multipart/form-data',
//           'Access-Control-Allow-Origin': '*', // CORS header
//         },
//       });

//       const result = res.data;
//       //console.log("1st API Response",result);

//       if (result && result.hlink) {
//         const myUrl = result.hlink;
//         const finalDataUrl = myUrl.replace("http://axis.cliniqo.com/frame/finding?data=", "");
//         //const finalDataUrl = myUrl.replace("http://localhost:8000/frame/finding?data=", "");
//         const myDataUrl = encodeURIComponent(finalDataUrl);

//         // Second API request using Axios
//          const secondApiUrl = `http://axis.cliniqo.com/dental_ai/Get_AI_Images_New?data=${myDataUrl}`;
//         //const secondApiUrl = `http://localhost:5000/dental_ai/Get_AI_Images_New?data=${myDataUrl}`;
//         const secondRes = await axios.get(secondApiUrl, {
//           headers: {
//             'x-api-key': apiKey,
//             'Accept': 'application/json',
//             'Access-Control-Allow-Origin': '*', // CORS header
//           },
//         });

//         const secondResult = secondRes.data;
//         //console.log('secondResult findings:', secondResult);

//         setImageData(secondResult);
//       } else {
//         console.error('No hlink found in the response');
//       }
//     } catch (error) {
//       console.error("Error in API call:", error.response ? error.response.data : error.message);
//     } finally {
//       setIsLoading(false);
//     }
// };

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         {selectedImages.length === 0 ? (
//           <TouchableOpacity onPress={pickImages} style={{ justifyContent: 'center', alignItems: 'center', width: width * 0.8, height: 150, margin: 20 }}>
//             <View style={styles.uploadContainer}>
//               <Text style={styles.headertext}>( Click to browse or upload a Photo )</Text>
//               <View style={{ marginTop: 10 }}>
//                 <Button title="Upload Image" onPress={pickImages} />
//               </View>
//             </View>
//           </TouchableOpacity>
//         ) : (
//           <>
//             {!resultAtr && (
//               <>
//                 <View contentContainerStyle={styles.imageContainer}>
//                   {selectedImages.map((image, index) => (
//                     <View key={index} style={styles.imageWrapper}>
//                       <Image source={{ uri: image.uri }} style={styles.image} />

//                       <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(image.uri)}>
//                         <Icon name="times" size={20} color="red" />
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//                 </View>
//                 <View style={{ marginTop: 10, marginBottom: 10 }}>
//                   <TouchableOpacity onPress={onProcess}>
//                     <View style={CommonStylesheet.buttonContainersaveatForm}>
//                       <Text style={CommonStylesheet.ButtonText}>Process</Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}

//             {/* Loader Component */}
//             {loading && (
//               <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
//                 <Loader />
//               </View>
//             )}

//             {/* Conditionally render this section based on resultAtr */}
//             {!loading && resultAtr && (
//               <View style={{}}>
//                 {/* Left Side - Image with Points */}
//                 <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', width: '100%', height: '100%' }}>
//                   <Image
//                     source={imageUrl}
//                     style={[styles.imageResult, { width: renderedWidth, height: renderedHeight }]}
//                   />
//                   <Svg
//                     height={renderedHeight}
//                     width={renderedWidth}
//                     style={styles.svg}
//                     onTouchStart={handleStart}
//                     onTouchMove={handleMove}
//                     onTouchEnd={handleEnd}
//                     onMouseDown={handleStart} // Mouse events for web
//                     onMouseMove={handleMove}  // Mouse events for web
//                     onMouseUp={handleEnd}     // Mouse events for web
//                   >
//                     <Path d={drawnPath} stroke="red" strokeWidth={5} fill="none" />
//                     {imageData && imageData.findings && imageData.findings.Analysis && Object.keys(imageData.findings.Analysis).length > 0 &&
//                       Object.keys(imageData.findings.Analysis).map((imageName, index) => {
//                         const analysisData = imageData.findings.Analysis[imageName];

//                         return analysisData.map((item, idx) => {
//                           const transformedPoints = transformPoints(item.points);
//                           const pointsString = transformedPoints.map(point => point.join(',')).join(' ');

//                           // Check if the tag is hidden
//                           if (hiddenTags[idx]) return null;

//                           return (
//                             <React.Fragment key={idx}>
//                               <Polygon
//                                 points={pointsString}
//                                 fill="rgba(255, 0, 0, 0)"
//                                 stroke="red"
//                                 strokeWidth="2"
//                               />
//                               <SvgText
//                                 x={transformedPoints[0][0] + 10}
//                                 y={transformedPoints[0][1]}
//                                 fontSize="16"
//                                 fill="yellow"
//                                 stroke="yellow"
//                                 strokeWidth="0.5"
//                               >
//                                 {item.tag_name}
//                               </SvgText>
//                             </React.Fragment>
//                           );
//                         });
//                       })
//                     }
//                   </Svg>

//                   {/* Right Side - Analysis Cards */}
//                   <View style={{ height: renderedHeight, overflow: 'hidden', marginLeft: 20 }}>
//                     <ScrollView style={{ height: renderedHeight }}>
//                       {imageData && imageData.findings && imageData.findings.Analysis && Object.keys(imageData.findings.Analysis).length > 0 &&
//                         Object.keys(imageData.findings.Analysis).map((imageName, index) => {
//                           const analysisData = imageData.findings.Analysis[imageName];

//                           return analysisData.map((item, idx) => (
//                             <View key={idx} style={styles.cardContainer}>
//                               <View style={styles.card}>
//                                 <Text style={styles.tagName}><strong>{item.tag_name}</strong></Text>
//                                 <Text style={styles.score}>Score: {item.score.toFixed(3)}</Text>
//                                 <View style={styles.buttonContainer}>
//                                   <TouchableOpacity onPress={() => toggleTagVisibility(item.tag_name, idx)} style={styles.viewButton}>
//                                     <Text style={styles.buttonText}>
//                                       {hiddenTags[idx] ? 'Show' : 'Hide'}
//                                     </Text>
//                                   </TouchableOpacity>
//                                   <TouchableOpacity onPress={() => deleteTag(item.tag_name, idx)} style={styles.deleteButton}>
//                                     <Text style={styles.buttonText}>Delete</Text>
//                                   </TouchableOpacity>
//                                 </View>
//                               </View>
//                             </View>
//                           ));
//                         })
//                       }
//                     </ScrollView>
//                   </View>
//                 </View>
//                 <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//                   <TouchableOpacity>
//                     <View style={CommonStylesheet.buttonContainersaveatForm}>
//                       <Text style={CommonStylesheet.ButtonText}>Save</Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             )}
//           </>
//         )}
//       </View>
//     </ScrollView>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uploadContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor: '#E3DBDB ',
//     borderStyle: 'dashed',
//     borderWidth: 1.5,
//     width: width,
//     height: 150,
//   },
//   headertext: {
//     fontSize: 16,
//     color: '#5f6067',
//     fontFamily: 'Poppins-Medium',
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   imageContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 20,
//   },
//   imageWrapper: {
//     position: 'relative',
//     margin: 30,
//   },
//   image: {
//     width: 600,
//     height: 300,
//   },
//   removeIcon: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     borderRadius: 15,
//     padding: 2,
//   },
//   imageResult: {
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start'
//   },
//   svg: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     zIndex: 1
//   },

//   cardContainer: {
//     marginBottom: 15,
//     flex: 1, // Allow the card to take remaining space
//   },
//   card: {
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5, // For Android shadow effect
//   },
//   tagName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#007bff', // Bootstrap primary color
//   },
//   score: {
//     fontSize: 14,
//     color: 'gray',
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   viewButton: {
//     backgroundColor: '#4CAF50',
//     padding: 5,
//     borderRadius: 5,
//     flex: 1,
//     marginRight: 5,
//     alignItems: 'center',
//   },
//   deleteButton: {
//     backgroundColor: 'red',
//     padding: 5,
//     borderRadius: 5,
//     flex: 1,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//   },
// });

// export default Files;

import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Api from '../../../api/Api';
import MyBot from '../../../components/MyBot';
import moment from 'moment';
import { Spinner, Fab } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { getHeaders } from '../../../utils/apiHeaders';
import Loader from '../../../components/Loader';

const Files = ({ route }) => {


  const [files, setFiles] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mybase64Image, setBase64Image] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [userName, setuserName] = useState('');
  const [token, setToken] = useState('');
  const [ClinicID, setClinicid] = useState('');
  const [PatientID, setPatientID] = useState('')
  const navigation = useNavigation();
  const fetchData = async () => {
    setLoading(true);
    const headers = await getHeaders();
    const userString = await AsyncStorage.getItem('user');
    const user = JSON.parse(userString);
    setClinicid(user.clinicID);
    setuserName(user.userName);
    const PatientID = route.params.patientID || '00000000-0000-0000-0000-000000000000';
    setPatientID(PatientID);
    const description = route.params.description;
    //console.log('description1111', description);
    const folderId = route.params.folderId;
    //console.log('folderId', folderId);

    const formData = {
      pageindex: 0,
      pagesize: 10,
      FolderId: folderId,
      Description: description,
      PatientID: PatientID
    }

    try {
      const response = await Axios.post(
        `${Api}Document/GetDocumentsByPatientIDWithPaging`,
        formData,
        {
          headers
        }
      );
      if (response.data && response.data.length > 0) {
        // Map over response data to fetch images concurrently
        const base64Images = await Promise.all(
          response.data.map(async (image) => {
            const newResponse = await Axios.post(
              `${Api}Image/GetImage?imgSrc=${encodeURIComponent(image.physicalFilePath)}&type=patientfiles`, {}, // Data payload for POST (if none, use an empty object)
              {
                headers: {
                  'Content-Type': 'application/json',
                  'AT': 'MobileApp',
                  'Authorization': user.token,
                }
              }
            );
            return `data:image/jpeg;base64,${newResponse.data}`;
          })
        );
        //setFiles(prevFiles => [...prevFiles, ...response.data]);
        setFiles(response.data);
        setBase64Image(base64Images);
        setRecordCount(response.data[0].recordCount || 0);
      }
      else {
        // Clear state if no files are returned
        setFiles([]);
        setBase64Image([]);
        setRecordCount(0);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      Alert.alert('Error', 'Unable to fetch files. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('Screen focused, fetching data...');
      fetchData();
    });
    return unsubscribe;
  }, [navigation, pageIndex]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return moment(dateString).format('DD-MM-YYYY');
  };
  const handleInfo = () => {
    navigation.navigate('FileInfo')
    ////console.log(`Info with ID: ${files[index + 1].id}`);
    setModalVisible(false); // Close the modal after deletion
  };
  const handleDelete = async () => {
    const userString = await AsyncStorage.getItem('user');
    const user = JSON.parse(userString);
    // Handle the delete action here (e.g., remove file from list or call API)
    try {
      formData =
      {
        fileIds: selectedFileId.toString(),
        lastUpdatedBy: user.userName
      }
      const response = await Axios.post(
        `${Api}Document/DeleteDocumentFile`,
        formData, {
        headers: {
          'Content-Type': 'application/json',
          'AT': 'MobileApp',
          'Authorization': user.token
        }
      }
      );

      setIsConfirmVisible(false);
      setModalVisible(false);
      fetchData();

    } catch (error) {
      console.error("Error deleting files:", error);
    }
    // //console.log(`Deleted file with ID: ${files[index + 1].id}`);
    // setIsModalVisible(false); // Close the modal after deletion
  };
  const renderFile = (file, index) => {
    const BASE_URL = "https://ecgplus.net";
    const primaryImageUri = mybase64Image[index]
      ? { uri: mybase64Image[index] }
      : null;

    const secondaryImageUri = mybase64Image[index + 1]
      ? { uri: mybase64Image[index + 1] }
      : null;

    const handleImageClick = (imageUri, fileId) => {
      setSelectedImage(imageUri);
      setSelectedFileId(fileId);
      setModalVisible(true);
    };
    return (
      <View key={file.id} style={styles.fileRow}>
        <View style={styles.fileWrapper}>
          <TouchableOpacity onPress={() => handleImageClick(primaryImageUri, file.id)}>
            <Image source={primaryImageUri} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.text}>{file.fileName || '-'}</Text>
          <Text style={styles.text}>{file.description || '-'}</Text>
          <Text style={styles.text}>{formatDate(file.publishedOn) || '-'}</Text>
        </View>
        {/* Render second file in the row, if it exists */}
        {files[index + 1] && (
          <View style={styles.fileWrapper}>
            <TouchableOpacity onPress={() => handleImageClick(secondaryImageUri, files[index + 1].id)}>
              <Image
                source={secondaryImageUri}
                style={styles.image}
              />
            </TouchableOpacity>
            <Text style={styles.text}>{files[index + 1].fileName || '-'}</Text>
            <Text style={styles.text}>{files[index + 1].description || '-'}</Text>
            <Text style={styles.text}>{formatDate(files[index + 1].publishedOn) || '-'}</Text>
          </View>
        )}
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {loading ? <Loader /> :
        <>
          <View>
            {/* Modal for displaying selected image */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              {/* <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={selectedImage} style={styles.modalImage} />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View> */}
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  disabled
                  style={styles.modalBackground}
                //onPress={() => setModalVisible(false)}
                >
                  <Image source={selectedImage} style={styles.modalImage} />
                </TouchableOpacity>
                {/* Additional modal actions */}
                <View style={styles.iconsRow}>
                  <TouchableOpacity onPress={() => setIsConfirmVisible(true)}>
                    <Icon name="trash" size={30} color="#2196f3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Share clicked')}>
                    <Icon name="share" size={30} color="#2196f3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Email clicked')}>
                    <Icon name="envelope" size={30} color="#2196f3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleInfo}>
                    <Icon name="info-circle" size={30} color="#2196f3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Icon name="times" size={30} color="#2196f3" />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              visible={isConfirmVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsConfirmVisible(false)}
            >
              <View style={styles.confirmContainer}>
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmText}>
                    Are you sure you want to delete this item?
                  </Text>
                  <View style={styles.confirmActions}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => {
                        setIsConfirmVisible(false);
                        handleDelete();
                      }}
                    >
                      <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmButton, styles.cancelButton]}
                      onPress={() => setIsConfirmVisible(false)}
                    >
                      <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          {!loading && files.length === 0 && <Text style={styles.text}>No files found.</Text>}
          <ScrollView contentContainerStyle={styles.scrollView}>
            {files.map((file, index) => index % 2 === 0 && renderFile(file, index))} {/* Render only for even indices */}
            {files.length < recordCount && (
              <TouchableOpacity
                onPress={() => setPageIndex(pageIndex + 1)}
                style={styles.loadMore}
                disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Load More'}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          <Fab
            style={styles.fab}
            renderInPortal={false}
            size="md"
            icon={<Icon name="plus" size={10} color="white" />}
            onPress={() =>
              navigation.navigate('UploadPatientFile', {
                PatientID: PatientID,
              })
            }
          />
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures space between the two items
    width: '100%',
    marginBottom: 10,
  },
  fileWrapper: {
    //flex:0.5,
    width: '50%',
    marginHorizontal: 5,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#eaeaea',
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  // },
  fab: {
    position: 'absolute',
    backgroundColor: '#2196f3',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  // modalImage: {
  //   width: 300,
  //   height: 300,
  //   borderRadius: 10,
  //   marginBottom: 10,
  // },
  loadMore: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea', // Semi-transparent background
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: 600,
    height: 300,
    //resizeMode: 'contain',
  },
  Icon: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    zIndex: 2, // Ensure it appears above the image
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  confirmContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  confirmBox: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  confirmText: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  confirmActions: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmButton: { padding: 10, margin: 5, borderRadius: 5, backgroundColor: '#2196f3' },
  cancelButton: { backgroundColor: '#f44336' },
  buttonText: { color: 'white', fontSize: 16 },
});
export default Files; 