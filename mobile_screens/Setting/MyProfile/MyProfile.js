import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import {
    FormControl,
    Input,
    Text,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    Image,
} from 'native-base';
//common styles
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Api from '../../../api/Api';
import Loader from '../../../components/Loader';
//import Snackbar from 'react-native-snackbar';

const { width, height } = Dimensions.get('window');


const MyProfile = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [refresh, setRefresh] = useState(false);
    //Handling user info in states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    //Update profile
    const [userID, setUserID] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            try {
                setUserID(user.userID);
                const formData = {
                    userID: user.userID,
                };
                console.log("formData", formData);                       
                const resp = await Axios.post(`${Api}Authenticate/GetUserProfileUserIDForMobile`, formData);
                console.log('User Profile', resp.data);
                const {
                    name,
                    email,
                    mobileNo,
                    password
                } = resp.data
                setName(name);
                setEmail(email);
                setMobile(mobileNo);
                setPassword(password)
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }

            setRefresh(!refresh);
        };

        fetchData();
    }, [isFocused]);

    const updateProfile = () => {
        const formData = {
            userID: userID,
            userName: mobile,
            name: name,
            password: password,
            mobileNo: mobile,
            lastUpdatedBy: "system",
            createdBy: "system",
            email: email
        }
        console.log("FORM DATA", formData);

        try {
            Axios.post(`${Api}Authenticate/UpdateUserProfileforMobile`, formData).then(resp => {
                console.log(resp.data);
                alert('User profile Updated sucessfully.');
                // Snackbar.show({
                //     text: 'User profile Updated sucessfully.',
                //     duration: Snackbar.LENGTH_SHORT,
                //     backgroundColor: 'green',
                //     fontFamily: 'Poppins-Medium',
                //     fontSize: 10
                // });
                navigation.navigate('Settings');

            });
        } catch (error) {
            console.log(error.message);
        }
    }

    return (

        <View style={[CommonStylesheet.formContainer, CommonStylesheet.backgroundimage]}>
            {loading ? <Loader /> :
                <>
                    <ScrollView>
                        <View style={[Styles.container, { marginTop: 10 }]}>
                            {/* <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
                        <Image
                            source={require('../../../assets/images/person.png')}
                            alt="logo.png"
                            style={Styles.Image} />
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: -25,
                                marginLeft: 60,
                                zIndex: 1,
                                 }}>
                             <Icon
                                name="camera"
                                size={30}
                                color={"#576067"}
                                />
                        </View>
                    </TouchableOpacity> */}
                            <Stack space={2} w="100%" mx="auto" padding={2}>
                                <Input
                                    size="lg"
                                    value={name}
                                    onChangeText={(value) => setName(value)}
                                    placeholderTextColor={'#808080'}
                                    height={height * 0.07}
                                    borderRadius={5}
                                    placeholder="Name"
                                    style={Styles.inputPlaceholder}
                                />
                                <Input
                                    size="lg"
                                    value={password}
                                    onChangeText={(value) => setPassword(value)}
                                    placeholder="Password"
                                    placeholderTextColor={'#808080'}
                                    height={height * 0.07}
                                    borderRadius={5}
                                    style={Styles.inputPlaceholder}
                                />
                                <Input
                                    size="lg"
                                    aria-disabled value={email}
                                    onChangeText={(value) => setEmail(value)}
                                    placeholder="Email"
                                    placeholderTextColor={'#808080'}
                                    height={height * 0.07}
                                    borderRadius={5}
                                    style={Styles.inputPlaceholder}
                                />
                                <View style={{ flexDirection: 'row', width: '100%', }}>
                                    <Input
                                        size="lg"
                                        aria-disabled w="20%"
                                        height={height * 0.07}
                                        borderRadius={5}
                                        style={Styles.inputPlaceholder}
                                        value='+91'
                                    />
                                    <Input
                                        size="lg"
                                        style={Styles.inputPlaceholder}
                                        aria-disabled value={mobile}
                                        height={height * 0.07}
                                        borderRadius={5}
                                        onChangeText={(value) => setMobile(value)}
                                        marginLeft={'5%'}
                                        w="75%"
                                        placeholder="Mobile Number" />
                                </View>
                            </Stack>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <TouchableOpacity onPress={() => updateProfile()}>
                                    <View style={CommonStylesheet.buttonContainersave}>
                                        <Text style={CommonStylesheet.ButtonText}>Save</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </>
            }
        </View>
    );
};

const Styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    Image: {

        width: width < 600 ? 110 : 200,
        height: width < 600 ? 100 : 100,

        resizeMode: 'contain', // You can adjust the resizeMode as needed
    },
    inputPlaceholder: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        // opacity: 0.7,


    },
})

export default MyProfile;