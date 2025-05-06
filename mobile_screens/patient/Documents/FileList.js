
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
  const [PatientID, setPatientID] = useState('');
  const [FileID, setFileID] = useState(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false)
  const [Virtualpath, setVirtualpath] = useState(null);
  const [fileSize, setfileSize] = useState(null);
  const navigation = useNavigation();
  const fetchData = async () => {
    setLoading(true);
    const ClinicID = await AsyncStorage.getItem('clinicID')
    setClinicid(ClinicID);
    const token = await AsyncStorage.getItem('token');
    setToken(token);
    const userName = await AsyncStorage.getItem('userName');
    setuserName(userName);
    const PatientID = route.params.patientID;
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
          headers: {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token,
          },
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
                  'Authorization': token,
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

  // useEffect(() => {
  //   
  //   fetchData();
  // }, [pageIndex]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation, pageIndex]);
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return moment(dateString).format('DD-MM-YYYY');
  };
  const handleInfo = () => {
    setIsInfoModalVisible(true);
};
  const handleDelete = async () => {
    try {
      setLoading(true);
      setIsConfirmVisible(false);
      const formData = {
        fileIds: FileID.toString(),
        lastUpdatedBy: userName
      };
      // Make the API request to delete the file
      const response = await Axios.post(
        `${Api}Document/DeleteDocumentFile`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'AT': 'MobileApp',
            'Authorization': token
          }
        }
      );
      // setFiles([]);
      //  setBase64Image([]);
      //  setPageIndex(0);
      // setHasMoreFiles(true);
      fetchData();
      // setTimeout(() => {
      setIsModalVisible(false);
      // }, 500);
    } catch (error) {
      console.error("Error deleting files:", error);
      Alert.alert("Error", "Failed to delete the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                  <Icon name="times" size={30} color="#FF6347" />
                              </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalBackground}
           // onPress={() => setIsModalVisible(false)}
          >
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
                resizeMode='contain'
              />
            )}
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
      <Modal
        visible={isInfoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsInfoModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer1}>
            {/* Close Icon in the top-right corner */}
            <TouchableOpacity onPress={() => setIsInfoModalVisible(false)} style={styles.closeButton}>
              <Icon name="times" size={30} color="#FF6347" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Details</Text>
            <View style={styles.innerContainer}>
              <View style={styles.row}>
                <Text style={styles.text}>Path:</Text>
                <Text style={styles.text}>/storage/emulated/0/Pictures/DenteeReports/{Virtualpath}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.text}>Size:</Text>
                 <Text style={styles.text}>   {fileSize}</Text> 
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          {files.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
              <Text style={styles.text}>
                There is no file uploaded. Please add a file first.
              </Text>
            </View>
          ) : (
            <ScrollView
            // onScroll={({ nativeEvent }) => handleScrollEnd({ nativeEvent })}
            // scrollEventThrottle={16} // For smooth performance
            >
              <View style={styles.fileRow}>
                {files.map((item, index) => (
                  <View style={styles.fileWrapper} key={item.id}>
                    {/* <TouchableOpacity style={styles.infoIcon}>
                      <Icon name="ellipsis-v" size={20} color="#2196f3" />
                    </TouchableOpacity> */}
                    {mybase64Image && mybase64Image[index] && (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedImage(mybase64Image[index]);
                          setIsModalVisible(true);
                          setFileID(item.id);
                          setVirtualpath(item.virtualFilePath)
                          setfileSize(item.fileSize)
                        }}
                      >
                        <Image
                          source={{ uri: mybase64Image[index] }}
                          style={styles.image}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                    {item.patientName && item.patientName.trim() ? (
                      <Text style={[styles.text, { color: '#000' }]}>{item.fileName}</Text>
                    ) : (
                      <View style={styles.iconContainer}>
                        <Icon name="user" size={16} color="#000" />
                        <Icon name="plus" size={10} color="#000" style={styles.icon} />
                      </View>
                    )}
                    <Text style={[styles.text, { color: '#000' }]}>{item.description}</Text>
                    <Text style={styles.text}>{formatDate(item.publishedOn) || '-'}</Text>

                  </View>
                ))}
              </View>
            </ScrollView>
          )}

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
        </View>
      )}

    </>
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
    flexWrap: 'wrap', // Allows wrapping of items to the next line
    justifyContent: 'space-between', // Adds equal spacing between items
    width: '100%'
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // marginTop: 10,
    // paddingVertical: 10,
  },
  icon: {
    marginBottom: 10,
  },
  fileWrapper: {
    width: '49%', // Slightly less than 50% to allow some spacing between items
    marginBottom: 10, // Adds spacing between rows
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
    position: 'relative',
    height: 200,
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
  infoIcon: {
    position: 'absolute',
    top: 5, // Adjust as needed
    right: 10, // Adjust as needed
    zIndex: 10, // Ensures it stays above other content
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
  confirmContainer: 
  { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  confirmBox: 
  { 
    width: 300, 
    padding: 20, 
    backgroundColor: 'white',
     borderRadius: 10,
      alignItems: 'center'
     },
  confirmText: 
  {
     fontSize: 18, 
     textAlign: 'center',
     marginBottom: 20 
    },
  confirmActions: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  confirmButton: 
  { 
    padding: 10, 
    margin: 5, 
    borderRadius: 5, 
    backgroundColor: '#2196f3'
   },
  cancelButton: 
  { 
    backgroundColor: '#f44336'
   },
 buttonText: 
    { color: 'white',
       fontSize: 16
       },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f8ff',
},
modalContainer1: {
  width: 500,
  padding: 20,
  backgroundColor: 'white',
  borderRadius: 10,
  position: 'relative',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
innerContainer: {
  marginTop: 10,
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 5,
   alignItems: 'flex-start'
},
closeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
},

});
export default Files; 