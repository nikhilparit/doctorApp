import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet.js';
import Svg, { Polygon, Text as SvgText, Path } from 'react-native-svg';
import axios from 'axios';
import Loader from '../../components/Loader.js';
import Api from '../../api/Api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
const { height, width } = Dimensions.get('window');

const AI_Document = ({ route }) => {
  const viewRef = useRef(null);
  const navigation = useNavigation();
  //const ClinicID = route.params.clinicID;
  const apiKey = 'QoMVAvHuBYp2MT9jv3qq3aWUCiT1BnF4MbUNnWkf';
  const intrinsicWidth = 776; // Original image width
  const intrinsicHeight = 400; // Original image height

  // Scale down the rendered size by a factor (e.g., 0.7 for 70% of the original rendered size)
  const scaleFactor = 0.6;
  const renderedWidth = 1242 * scaleFactor; // Scaled rendered width
  const renderedHeight = 640 * scaleFactor; // Scaled rendered height

  const [selectedImages, setSelectedImages] = useState([]);
  const [resultAtr, setResultAtr] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [imageUrl, setimageUrl] = useState('');
  const [hiddenTags, setHiddenTags] = useState({});
  const [analysisData, setAnalysisData] = useState(imageData?.findings?.Analysis || {});
  const [drawing, setDrawing] = useState(false);
  const [drawnPath, setDrawnPath] = useState('');
  const [all, setAll] = useState('');
  const [ClinicID, setClinicid] = useState('');
  const [token, setToken] = useState('');
  const [userName, setuserName] = useState('');
  const [folderId, setfolderId] = useState([]);
  const [selectedFolder, setselectedFolder] = useState('');


  const readData = async () => {
    const userString = await AsyncStorage.getItem('user');
    const user = JSON.parse(userString);
    setuserName(user.userName);
    setToken(user.token);
    setClinicid(user.clinicID);
    const formData1 = {
      clinicID: user.clinicID,
      folderId: 0,
    };
    const headers = {
      'Content-Type': 'application/json',
      'AT': 'MobileApp',
      'Authorization': user.token,
    };
    const response = await axios.post(`${Api}Document/GetDocumentFolderById`, formData1, { headers });
    //console.log('Folder ID:', response.data);
    setfolderId(response.data);
    if (response.data && response.data.length > 0) {
      setAll(response.data[3].description);  // Set the first folder as the default value
      setselectedFolder(response.data[3].folderId);
      //console.log('setselectedFolder', response.data[3].folderId);

    }
  }

  useEffect(() => {
    readData()
  }, []);

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
      allowsMultipleSelection: false,
    });

    //console.log("result", result);

    if (!result.canceled) {
      setSelectedImages(result.assets);
      //console.log("imageURL", result.assets);
      setimageUrl(result.assets[0].uri);
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
  // Transform points to fit the rendered image dimensions
  const transformPoints = (points) => {
    //console.log(resultAtr, "resultAtr"); // This logs the resultAtr, assuming it's needed for debugging

    // Transform points based on scaling
    return points.map(point => [
      (point[0] / intrinsicWidth) * renderedWidth,
      (point[1] / intrinsicHeight) * renderedHeight,
    ]);
  };
  const toggleTagVisibility = (tagName, idx) => {
    setHiddenTags(prevState => ({
      ...prevState,
      [idx]: !prevState[idx],
    }));
  };
  const deleteTag = (tagName, index) => {
    // Clone the current imageData to avoid direct mutation
    const updatedImageData = { ...imageData };

    // Iterate over each analysis in the findings to find the matching tag
    Object.keys(updatedImageData.findings.Analysis).forEach((imageName) => {
      const analysisData = updatedImageData.findings.Analysis[imageName];

      // Remove the specific tag by filtering out the matching index
      updatedImageData.findings.Analysis[imageName] = analysisData.filter((_, idx) => idx !== index);
    });

    // Update the state with the modified data
    setImageData(updatedImageData);
  };

  const handleEnd = () => {
    //console.log('End drawing');
    setDrawing(false);
  };
  const getCoordinates = (e) => {
    // Handle touch or mouse events
    if (e.nativeEvent.locationX !== undefined) {
      return { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
    } else if (e.nativeEvent.clientX !== undefined) {
      const { clientX, clientY } = e.nativeEvent;
      const rect = e.target.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    }
    return { x: 0, y: 0 }; // Fallback in case neither is available
  };

  const handleStart = (e) => {
    const { x, y } = getCoordinates(e);
    //console.log('Start drawing at:', x, y);
    setDrawing(true);
    setDrawnPath(`M${x},${y}`);
  };

  const handleMove = (e) => {
    if (!drawing) return;
    const { x, y } = getCoordinates(e);
    //console.log('Move to:', x, y);
    setDrawnPath((prevPath) => `${prevPath} L${x},${y}`);
  };

  const onProcess = async () => {
    setIsLoading(true);
    setResultAtr(true);

    const formData = new FormData();
    formData.append('patient_id', '1');
    formData.append('practice_id', '101');
    formData.append('business_id', '1001');
    formData.append('domain_address', 'http://axis.cliniqo.com');
    formData.append('mixed', false);
    formData.append('co_or', false);

    for (const image of selectedImages) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const originalFileName = image.uri.split('/').pop();
      formData.append('images', blob, `image_${originalFileName}`);
    }

    try {
      // First API request using Axios
      const apiUrl = 'http://axis.cliniqo.com/dental_ai/upload_direct_images';
      //const apiUrl = 'http://localhost:5000/dental_ai/upload_direct_images';
      const res = await axios.post(apiUrl, formData, {
        headers: {
          'x-api-key': apiKey,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*', // CORS header
        },
      });

      const result = res.data;
      //console.log("1st API Response", result);

      if (result && result.hlink) {
        const myUrl = result.hlink;
        const finalDataUrl = myUrl.replace("http://axis.cliniqo.com/frame/finding?data=", "");
        //const finalDataUrl = myUrl.replace("http://localhost:8000/frame/finding?data=", "");
        const myDataUrl = encodeURIComponent(finalDataUrl);

        // Second API request using Axios
        const secondApiUrl = `http://axis.cliniqo.com/dental_ai/Get_AI_Images_New?data=${myDataUrl}`;
        // const secondApiUrl = `http://localhost:5000/dental_ai/Get_AI_Images_New?data=${myDataUrl}`;
        const secondRes = await axios.get(secondApiUrl, {
          headers: {
            'x-api-key': apiKey,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*', // CORS header
          },
        });

        const secondResult = secondRes.data;
        //console.log('secondResult findings:', secondResult);

        setImageData(secondResult);
      } else {
        console.error('No hlink found in the response');
      }
    } catch (error) {
      console.error("Error in API call:", error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const UploadMyFile = async () => {
    setIsLoading(true);
    // const uri = await captureRef(viewRef, {
    //   format: 'png',
    //   quality: 1.0,
    // });
    // //console.log('Captured image URI:', uri);

    // Capture the view and get the URI
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1.0,
    });

    //console.log('Captured image URI:', uri);

    // Fetch the file as a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    //console.log('Blob Created:', blob);

    // Create a FormData object
    const formData = new FormData();
    const fileName = `image_${Date.now()}.png`; // Generate a file name
    formData.append('cliniLogofile', blob, fileName);

    // Log FormData (Debugging purposes)
    for (const pair of formData.entries()) {
      //console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      // First API call: Upload files
      const response = await axios.post(
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

      // //console.log("First API response:", { ClinicID, data: response.data });


      // Prepare data for the second API call
      const formDataSecondCall = {
        clinicID: ClinicID,
        description: all,
        folderId: selectedFolder,
        patientID: '00000000-0000-0000-0000-000000000000',
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
            patientID: "00000000-0000-0000-0000-000000000000",
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
      const response1 = await axios.post(
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
      navigation.navigate('FileList');
      setIsLoading(false);


      //  //console.log("Second API response:", response1.data);

    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {selectedImages.length === 0 ? (
          <TouchableOpacity onPress={pickImages} style={{ justifyContent: 'center', alignItems: 'center', width: width * 0.8, height: 150, margin: 20 }}>
            <View style={styles.uploadContainer}>
              <Text style={styles.headertext}>( Click to browse or upload a Photo )</Text>
              <View style={{ marginTop: 10 }}>
                <Button title="Upload Image" onPress={pickImages} />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            {!resultAtr && (
              <>
                <View contentContainerStyle={styles.imageContainer}>
                  {selectedImages.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image source={{ uri: image.uri }} style={styles.image} />

                      <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(image.uri)}>
                        <Icon name="times" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                  <TouchableOpacity onPress={onProcess}>
                    <View style={CommonStylesheet.buttonContainersaveatForm}>
                      <Text style={CommonStylesheet.ButtonText}>Process</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Loader Component */}
            {loading && (
              <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                <Loader />
              </View>
            )}

            {/* Conditionally render this section based on resultAtr */}
            {!loading && resultAtr && (
              <View style={{}}>
                {/* Left Side - Image with Points */}
                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', width: '100%', height: '100%' }}>
                  <View ref={viewRef} style={{
                    width: renderedWidth,
                    height: renderedHeight,
                    overflow: 'hidden',
                  }}>
                    <Image
                      source={imageUrl}
                      style={[styles.imageResult, { width: renderedWidth, height: renderedHeight }]}
                    />
                    <Svg
                      height={renderedHeight}
                      width={renderedWidth}
                      style={styles.svg}
                      onTouchStart={handleStart}
                      onTouchMove={handleMove}
                      onTouchEnd={handleEnd}
                      onMouseDown={handleStart} // Mouse events for web
                      onMouseMove={handleMove}  // Mouse events for web
                      onMouseUp={handleEnd}     // Mouse events for web
                    >
                      <Path d={drawnPath} stroke="red" strokeWidth={5} fill="none" />
                      {imageData && imageData.findings && imageData.findings.Analysis && Object.keys(imageData.findings.Analysis).length > 0 &&
                        Object.keys(imageData.findings.Analysis).map((imageName, index) => {
                          const analysisData = imageData.findings.Analysis[imageName];

                          return analysisData.map((item, idx) => {
                            const transformedPoints = transformPoints(item.points);
                            const pointsString = transformedPoints.map(point => point.join(',')).join(' ');

                            // Check if the tag is hidden
                            if (hiddenTags[idx]) return null;

                            return (
                              <React.Fragment key={idx}>
                                <Polygon
                                  points={pointsString}
                                  fill="rgba(255, 0, 0, 0)"
                                  stroke="red"
                                  strokeWidth="2"
                                />
                                <SvgText
                                  x={transformedPoints[0][0] + 10}
                                  y={transformedPoints[0][1]}
                                  fontSize="16"
                                  fill="yellow"
                                  stroke="yellow"
                                  strokeWidth="0.5"
                                >
                                  {item.tag_name}
                                </SvgText>
                              </React.Fragment>
                            );
                          });
                        })
                      }
                    </Svg>
                  </View>

                  {/* Right Side - Analysis Cards */}
                  <View style={{ height: renderedHeight, overflow: 'hidden', marginLeft: 20 }}>
                    <ScrollView style={{ height: renderedHeight }}>
                      {imageData && imageData.findings && imageData.findings.Analysis && Object.keys(imageData.findings.Analysis).length > 0 &&
                        Object.keys(imageData.findings.Analysis).map((imageName, index) => {
                          const analysisData = imageData.findings.Analysis[imageName];

                          return analysisData.map((item, idx) => (
                            <View key={idx} style={styles.cardContainer}>
                              <View style={styles.card}>
                                <Text style={styles.tagName}><strong>{item.tag_name}</strong></Text>
                                <Text style={styles.score}>Score: {item.score.toFixed(3)}</Text>
                                <View style={styles.buttonContainer}>
                                  <TouchableOpacity onPress={() => toggleTagVisibility(item.tag_name, idx)} style={styles.viewButton}>
                                    <Text style={styles.buttonText}>
                                      {hiddenTags[idx] ? 'Show' : 'Hide'}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => deleteTag(item.tag_name, idx)} style={styles.deleteButton}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          ));
                        })
                      }
                    </ScrollView>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => UploadMyFile()}>
                    <View style={CommonStylesheet.buttonContainersaveatForm}>
                      <Text style={CommonStylesheet.ButtonText}>Save</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E3DBDB ',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    width: width-20,
    height: 150,
  },
  headertext: {
    fontSize: 16,
    color: '#5f6067',
    fontFamily: 'Poppins-Medium',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  imageWrapper: {
    position: 'relative',
    margin: 30,
  },
  image: {
    width: 600,
    height: 300,
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 2,
  },
  imageResult: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1
  },

  cardContainer: {
    marginBottom: 15,
    flex: 1, // Allow the card to take remaining space
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow effect
  },
  tagName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff', // Bootstrap primary color
  },
  score: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default AI_Document;
