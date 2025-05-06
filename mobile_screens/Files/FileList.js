import React, { useState, useEffect, useRef,useCallback } from 'react';
import { View, Text, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { Center, Checkbox, Spinner } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Api from '../../api/Api';
import { Fab } from 'native-base';
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import moment from 'moment';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Buffer } from 'buffer';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles, deleteFile,resetFiles } from '../../features/filesSlice';
import { getHeaders } from '../../utils/apiHeaders';
const { height, width } = Dimensions.get('window');
const imageWidth = width * 0.65; // 80% of screen width
const imageHeight = height * 0.4; // 40% of screen height


const FileList = ({route }) => {
    const navigation = useNavigation();
    //const [files, setFiles] = useState([]);
    //const [pageindex, setPageIndex] = useState(0);
    const [index, setIndex] = useState(0);
    const [recordCount, setRecordCount] = useState(0);
    //const [loading, setLoading] = useState(true);
    const [groupValues, setGroupValues] = useState([]); // Tracks selected checkboxes
    const [isModalVisible, setIsModalVisible] = useState(false);
    //const [mybase64Image, setBase64Image] = useState([]);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [userName, setuserName] = useState('');
    const [previousFiles, setPreviousFiles] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [FileID, setFileID] = useState(null);
    const [Virtualpath, setVirtualpath] = useState(null);
    const [fileSize, setfileSize] = useState(null);
    const [myClinicID, setmyClinicID] = useState('');
    //const [hasMoreFiles, setHasMoreFiles] = useState(true);
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { files, base64Images, pageindex, hasMoreFiles, currentPage, error } = useSelector((state) => state.fileData);

    // const { myclinicID, pagesize = 6, StartDate, EndDate, Description = "All", isCheckboxChecked, searchData } = route.params || {};
    const dispatch = useDispatch();
    const prevParamsRef =  useRef(null);
    useFocusEffect(
        useCallback(() => {
            const fetchInitialData = async () => {
                dispatch(resetFiles());
                try {
                    setLoading(true);
                    const userString = await AsyncStorage.getItem('user');
                    const user = JSON.parse(userString);
                    setmyClinicID(user.clinicID);
    
                    const params = route.params && Object.keys(route.params).length > 0
                        ? {  
                            clinicID: route.params.myclinicID || user.clinicID,
                            pageindex: route.params.pageindex ?? 0,
                            pagesize: route.params.pagesize ?? 10,
                            StartDate: route.params.StartDate ?? moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                            EndDate: route.params.EndDate ?? moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                            Description: route.params.Description ?? 'All',
                            searchData: route.params.searchData ?? '',
                            isCheckboxChecked: route.params.isUnassigned === 'Y'
                        }
                        : {  
                            clinicID: user.clinicID, 
                            pageindex: 0, 
                            pagesize: 10, 
                            StartDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), 
                            EndDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), 
                            Description: 'All', 
                            searchData: '', 
                            isCheckboxChecked: false 
                        };
    
                    await dispatch(fetchFiles(params)).unwrap();
                } catch (error) {
                    console.error('An error occurred:', error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchInitialData();
    
            // Listener to reload when navigating back to this screen
            const unsubscribe = navigation.addListener('focus', () => {
                fetchInitialData();
            });
    
            return unsubscribe; // Cleanup on unmount
        }, [dispatch, route.params, navigation]) // Added `navigation` as a dependency
    );
 
    const handleScrollEnd = ({ nativeEvent }) => {
        console.log("currentPage",currentPage)
        if (isCloseToBottom(nativeEvent) && hasMoreFiles && status !== 'loading') {
            dispatch(fetchFiles({
                pageindex: currentPage,
                pagesize: 10,
                StartDate: new Date(),
                EndDate: new Date(),
                Description: 'All',
                searchData: '',
            }));
        }
    };
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    };
    const handleImageClick = (imageUri) => {
        setSelectedImage(imageUri);
        setIsModalVisible(true);
    };
    const handleDeleteWithConfirmation = async () => {
        setIsConfirmVisible(false); // Close the confirmation modal

        if (!selectedImage) return; // Ensure a file is selected

        // Find the file ID associated with the selected image
        const fileToDelete = files.find((file, index) => base64Images[index].uri === selectedImage);

        if (fileToDelete) {
            const payload = {
                FileID: fileToDelete.id,
                userName: userName, // Replace with actual username or fetch from state
                token: await AsyncStorage.getItem('token'), // Ensure token retrieval
            };

            // Dispatch the Redux action for deletion
            dispatch(deleteFile(payload))
                .unwrap()
                .then(() => {
                    setIsModalVisible(false); // Close the modal on success
                })
                .catch((error) => {
                    alert(`Failed to delete file: ${error}`);
                });
        } else {
            alert('No file found to delete.');
        }
    };

    const handleInfo = () => {
        const info = files.find((file, index) => base64Images[index].uri === selectedImage);
        setfileSize(info.fileSize);
        setVirtualpath(info.virtualFilePath)

        setIsInfoModalVisible(true);
    };
    const assignTo = () => {
        const selectedGroupvalues = groupValues;
        navigation.navigate('AssignTo', {
            selectedFiles: groupValues,
        });
        setGroupValues([]); // Clear group values
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return moment(dateString).format('DD-MM-YYYY');
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
                    >
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.modalImage}
                                resizeMode='contain'
                            />
                        )}
                    </TouchableOpacity>
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
                        <TouchableOpacity
                        // onPress={() => handleInfo()}
                        >
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
                                    handleDeleteWithConfirmation();
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

                        <TouchableOpacity onPress={() => setIsInfoModalVisible(false)} style={styles.closeButton}>
                            <Icon name="times" size={30} color="#FF6347" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>File Details</Text>
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

                    {!files || files.length === 0 ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <Text style={styles.text}>
                                There is no file uploaded. Please add a file first.
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            onScroll={({ nativeEvent }) => handleScrollEnd({ nativeEvent })}
                            scrollEventThrottle={16} // For smooth performance
                        >
                            <View style={[styles.fileRow,{marginTop:10}]}>
                                {files.map((item, index) => (
                                    <View style={styles.fileWrapper} key={item.id}>
                                        {base64Images[index] && (
                                            <TouchableOpacity onPress={() => handleImageClick(base64Images[index].uri)}>
                                                <Image
                                                    source={{ uri: base64Images[index].uri }}
                                                    style={styles.image}
                                                    resizeMode="contain"
                                                />
                                            </TouchableOpacity>
                                        )}
                                        {item.patientName && item.patientName.trim() ? (
                                            <Text style={[styles.text, { color: '#000' }]}>{item.patientName}</Text>
                                        ) : (
                                            <View style={styles.iconContainer}>
                                                <Icon name="user" size={16} color="#000" />
                                                <Icon name="plus" size={10} color="#000" style={styles.icon} />
                                            </View>
                                        )}
                                        <Text style={[styles.text, { color: '#000' }]}>{item.description}</Text>
                                        <Text style={styles.text}>{formatDate(item.publishedOn) || '-'}</Text>
                                        <View style={styles.checkbox}>
                                            {item.patientName && item.patientName.trim() ? (
                                                <View></View>
                                            ) : (
                                                <Checkbox
                                                    colorScheme="blue"
                                                    isChecked={groupValues.some((entry) => entry.id === item.id)}
                                                    onChange={() =>
                                                        setGroupValues((prev) => {
                                                            if (prev.some((entry) => entry.id === item.id)) {
                                                                // Remove the item from the list
                                                                return prev.filter((entry) => entry.id !== item.id);
                                                            } else {
                                                                // Add the item to the list
                                                                return [
                                                                    ...prev,
                                                                    { id: item.id, description: item.description, folderId: item.folderId },
                                                                ];
                                                            }
                                                        })
                                                    }
                                                    accessibilityLabel={`Select file ${item.id}`}
                                                />
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    )}

                    {groupValues.length > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                            <TouchableOpacity onPress={() => assignTo(groupValues)}>
                                <View style={CommonStylesheet.buttonContainerdelete}>
                                    <Text style={CommonStylesheet.ButtonText}>Assign To</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    <Fab
                        style={styles.fab}
                        renderInPortal={false}
                        size="md"
                        icon={<Icon name="plus" size={10} color="white" />}
                        onPress={() =>
                            navigation.navigate('UploadFile', {
                                clinicID: myClinicID,
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
        backgroundColor: '#f2f8ff',


    },
    text1: {
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',

    },
    fab: {
        position: 'absolute',
        backgroundColor: '#2196f3',
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
    },
    fileRow: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allows wrapping of items to the next line
        justifyContent: 'space-between', // Adds equal spacing between items
        width: '100%',

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
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: '#eaeaea',
    },
    innerContainer: {
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
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
    checkbox: {
        position: 'absolute', // Position the checkbox in the top-left corner
        top: 5,
        left: 5,

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f8ff',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: imageWidth,
        height: imageHeight,
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
    Icon: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        zIndex: 2,
    },
    iconsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
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
    infoModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f8ff',
    },
    infoModalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },



    confirmContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    confirmBox: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
    confirmText: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
    confirmActions: { flexDirection: 'row', justifyContent: 'space-between' },
    confirmButton: { padding: 10, margin: 5, borderRadius: 5, backgroundColor: '#2196f3' },
    cancelButton: { backgroundColor: '#f44336' },
    buttonText: { color: 'white', fontSize: 16 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        alignItems: 'flex-start'
    },
});

export default FileList;
