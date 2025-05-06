import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet.js';
import Svg, { Polygon, Text as SvgText, Path } from 'react-native-svg';
import axios from 'axios';
import Loader from '../../../components/Loader.js';
import Api from '../../../api/Api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';

const { width, height } = Dimensions.get('window'); // Get the screen width and height
// Constants for scaling images
// const intrinsicWidth = 738;
// const intrinsicHeight = 400;
let intrinsicWidth = 0; //original dimensions of the image.
let intrinsicHeight = 0; //original dimensions of the image.
let renderedWidth = 0 //The actual width at which the element is displayed on the screen.
let renderedHeight = 0 //The actual height at which the element is displayed on the screen.
let isDesktop = width > 768;

const AI_Document = ({ route }) => {
  const viewRef = useRef(null);
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [resultAtr, setResultAtr] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [imageUrl, setimageUrl] = useState('');
  const [hiddenTags, setHiddenTags] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [drawnPath, setDrawnPath] = useState('');
  const [all, setAll] = useState('');
  const [ClinicID, setClinicid] = useState('');
  const [token, setToken] = useState('');
  const [userName, setuserName] = useState('');
  const [folderId, setfolderId] = useState([]);
  const [selectedFolder, setselectedFolder] = useState(0);

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
    // console.log("API",response.data)
    if (response.data && response.data.length > 0) {
      setAll(response.data[2].description);
      setselectedFolder(response.data[2].folderId);
      // console.log("folderId",response.data[2].folderId);
    }
  };

  useEffect(() => {
    readData();
  }, [intrinsicWidth, intrinsicHeight]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
    });
  
    if (!result.canceled) {
      setSelectedImages(result.assets);
      setimageUrl(result.assets[0].uri); 
      Image.getSize(result.assets[0].uri, (widthImage, heightImage) => {
        intrinsicWidth = widthImage;
        intrinsicHeight = heightImage;
  
        // Adjust the rendered size to fit the fixed container
        const containerWidth = 700; // Should match resultImageWrapper width
        const containerHeight = 500; // Should match resultImageWrapper height
  
        const scaleFactor = Math.min(containerWidth / intrinsicWidth, containerHeight / intrinsicHeight);
        renderedWidth = intrinsicWidth * scaleFactor;
        renderedHeight = intrinsicHeight * scaleFactor;
      });
    }
  };
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setSelectedImages([...selectedImages, result]);
    }
  };

  const removeImage = (uri) => {
    setSelectedImages(selectedImages.filter(image => image.uri !== uri));
  };

  const transformPoints = (points) => {
    const scaleFactor = Math.min(renderedWidth / intrinsicWidth, renderedHeight / intrinsicHeight);
    return points.map(point => [
      point[0] * scaleFactor,
      point[1] * scaleFactor
    ]);
  };

  const toggleTagVisibility = (tagName, idx) => {
    setHiddenTags(prevState => ({
      ...prevState,
      [idx]: !prevState[idx],
    }));
  };

  const deleteTag = (tagName, index) => {
    const updatedImageData = { ...imageData };
    Object.keys(updatedImageData.findings.Analysis).forEach((imageName) => {
      const analysisData = updatedImageData.findings.Analysis[imageName];
      updatedImageData.findings.Analysis[imageName] = analysisData.filter((_, idx) => idx !== index);
    });
    setImageData(updatedImageData);
  };

  const handleEnd = () => {
    setDrawing(false);
  };

  const getCoordinates = (e, container) => {
    const rect = container.getBoundingClientRect();

    let x = 0;
    let y = 0;

    if (e.nativeEvent.locationX !== undefined) {
      x = e.nativeEvent.locationX - rect.left;
      y = e.nativeEvent.locationY - rect.top;
    } else if (e.nativeEvent.clientX !== undefined) {
      const { clientX, clientY } = e.nativeEvent;
      x = clientX - rect.left;
      y = clientY - rect.top;
    }

    console.log("Coordinates:", x, y); // Add logging to see if coordinates are correct

    return { x, y };
  };

  const handleStart = (e, container) => {
    const { x, y } = getCoordinates(e, container);
    setDrawing(true);
    setDrawnPath(`M${x},${y}`); // Initialize the path at the starting point
  };

  const handleMove = (e, container) => {
    if (!drawing) return;
    const { x, y } = getCoordinates(e, container);
    setDrawnPath((prevPath) => `${prevPath} L${x},${y}`); // Add line to the current point
  };

  const onProcess = async () => {
    setIsLoading(true);
    setResultAtr(true);
    const formData = new FormData();
    formData.append('patient_id', '1');
    formData.append('practice_id', '101');
    formData.append('business_id', '1001');
    // formData.append('domain_address', 'http://axis.cliniqo.com');
    formData.append('domain_address', 'https://cliniqo.com');
    formData.append('mixed', false);
    formData.append('co_or', true);

    for (const image of selectedImages) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const originalFileName = image.uri.split('/').pop();
      formData.append('images', blob, `image_${originalFileName}`);
    }

    try {
      //const apiUrl = 'http://axis.cliniqo.com/dental_ai/upload_direct_images';
      const apiUrl = 'https://api.toothinsights.com/upload_direct_images';
      const res = await axios.post(apiUrl, formData, {
        headers: {
          'x-api-key': 'QoMVAvHuBYp2MT9jv3qq3aWUCiT1BnF4MbUNnWkf',
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = res.data;
      console.log("result", result);
      setImageData(result);
      // if (result && result.hlink) {
      //   const myUrl = result.hlink;
      //   const finalDataUrl = myUrl.replace("http://axis.cliniqo.com/frame/finding?data=", "");
      //   const myDataUrl = encodeURIComponent(finalDataUrl);
      //   const secondApiUrl = `http://axis.cliniqo.com/dental_ai/Get_AI_Images_New?data=${myDataUrl}`;
      //   const secondRes = await axios.get(secondApiUrl, {
      //     headers: {
      //       'x-api-key': 'QoMVAvHuBYp2MT9jv3qq3aWUCiT1BnF4MbUNnWkf',
      //       'Accept': 'application/json',
      //     },
      //   });
      //   console.log(secondRes.data);
      //   setImageData(secondRes.data);
      // }
    } catch (error) {
      console.error("Error in API call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const UploadMyFile = async () => {
    setIsLoading(true);
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
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {selectedImages.length === 0 ? (
          <TouchableOpacity onPress={pickImages} style={styles.uploadContainer}>
            <Text style={styles.headertext}>(Click to browse or upload a Photo)</Text>
            <Button title="Upload Image" onPress={pickImages} />
          </TouchableOpacity>
        ) : (
          <>
            {!resultAtr && (
              <View>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                    <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(image.uri)}>
                      <Icon name="times" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity onPress={onProcess} style={styles.processButton}>
                    <Text style={styles.buttonText}>Process</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {loading && <Loader />}

            {!loading && resultAtr && (
              <View style={styles.resultContainer}>
                {/* Image on the left or top */}
                <>
                  <View style={styles.resultImageWrapper} ref={viewRef}>
                    <Image source={{ uri: imageUrl }} style={[styles.imageResult, { width: renderedWidth, height: renderedHeight }]} />
                    <Svg
                      height={renderedHeight}
                      width={renderedWidth}
                      style={styles.svg}
                      ref={viewRef}
                      onTouchStart={(e) => handleStart(e, viewRef.current)}
                      onTouchMove={(e) => handleMove(e, viewRef.current)}
                      onTouchEnd={handleEnd}
                    >
                      <Path d={drawnPath} stroke="red" strokeWidth={5} fill="none" />
                      {imageData?.findings?.Analysis && Object.keys(imageData.findings.Analysis).map((imageName, index) => {
                        return imageData.findings.Analysis[imageName].map((item, idx) => {
                          const transformedPoints = transformPoints(item.points);
                          const pointsString = transformedPoints.map(point => point.join(',')).join(' ');
                          if (hiddenTags[idx]) return null;

                          return (
                            <React.Fragment key={idx}>
                              <Polygon points={pointsString} fill="rgba(255, 0, 0, 0)" stroke="red" strokeWidth={isDesktop ? 2 : 1} />
                              <SvgText x={transformedPoints[0][0] + 10} y={transformedPoints[0][1]} fontSize={isDesktop ? 16 : 12} fill="yellow" stroke="yellow" strokeWidth="0.5">
                                {item.tag_name}
                              </SvgText>
                            </React.Fragment>
                          );
                        });
                      })}
                    </Svg>
                  </View>

                  {/* Analysis view on the right or below */}

                  <ScrollView
                    style={[styles.analysisContainer, { maxHeight: 500 }]} // Set maxHeight for scrolling area
                    contentContainerStyle={{ paddingVertical: 10 }}
                  >
                    {imageData?.findings?.Analysis && Object.keys(imageData.findings.Analysis).map((imageName, index) => {
                      return imageData.findings.Analysis[imageName].map((item, idx) => {
                        const isHidden = hiddenTags[idx]; // Check if the tag is hidden
                        return (
                          <View key={idx} style={styles.cardContainer}>
                            <View style={styles.card}>
                              <Text style={styles.tagName}>{item.tag_name}</Text>
                              <Text style={styles.score}>{(item.score).toFixed(2)} %</Text>
                              <TouchableOpacity onPress={() => toggleTagVisibility(item.tag_name, idx)} style={styles.hideShowButton}>
                                <Text style={styles.buttonText}>{isHidden ? "Show" : "Hide"}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => deleteTag(item.tag_name, idx)} style={styles.deleteButton}>
                                <Text style={styles.buttonText}>Delete</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      });
                    })}
                  </ScrollView>
                </>
              </View>
            )}
          </>
        )}
      </View>

      {!loading && resultAtr && (
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => UploadMyFile()}>
            <View style={CommonStylesheet.buttonContainersaveatForm}>
              <Text style={CommonStylesheet.ButtonText}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E3DBDB',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    width: '100%',
    height: '20%',
    marginVertical: 20,
  },
  headertext: {
    fontSize: 16,
    color: '#5f6067',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  image: {
    width: isDesktop ? width * 0.5 : width * 0.8, // 80% of screen width for images
    height: isDesktop ? width * 0.3 : width * 0.5, // Adjust based on width to keep aspect ratio
    resizeMode: 'contain',
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 5,
  },
  processButton: {
    backgroundColor: '#2196f3',
    borderColor: '#1c80cf',
    width: 150,
    height: 40,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  resultContainer: {
    flex: 1,
    flexDirection: isDesktop ? 'row' : 'column', // Row for desktop, column for mobile
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  resultImageWrapper: {
    width: 700,  // Fixed width
    height: 500, // Fixed height
    position: 'relative',
    overflow: 'hidden',
   // backgroundColor: 'black', // To visualize bounds
  },
  analysisContainer: {
    flex: 1, // Ensure it occupies available space
    maxHeight: '100%', // Prevent overflow when inside desktop view
    padding: 10,
    marginHorizontal: 10,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: isDesktop ? 'auto' : renderedWidth,
  },
  tagName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 12,
    color: 'gray',
  },
  buttonText: {
    color: 'white',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hideShowButton: {
    backgroundColor: '#408000',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  imageResult: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default AI_Document;
