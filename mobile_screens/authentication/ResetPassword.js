import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ImageBackground, StyleSheet, Alert, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, Stack, HStack, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from '@react-navigation/native';
//Common Styles
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Snackbar from 'react-native-snackbar';
// import components; 
import Loader from '../../components/Loader';
import Api from '../../api/Api';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { login, loginUsingOTP } from '../../features/authSlice';
import { getHeaders } from '../../utils/apiHeaders';
const { width, height } = Dimensions.get('window');
import Toast from 'react-native-toast-message';

const ResetPassword = ({route}) => {
    const user = route.params.userName;
    //console.log("user At reset Password", user)
    const dispatch = useDispatch();
    //navigation
    const navigation = useNavigation();
    //logical part
    const [formData, setData] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = useState(false);
    const [userDetails, setUser] = useState({});
    
    const readData = async () => {
        const formData = {
            userName: user, // Ensure `user` is defined
          };
      
        try {
            const response = await Axios.post(`${Api}Authenticate/GetUserIDByUserName`, formData);
            //console.log(response.data);
            setUser(response.data);
       
        } catch (error) {
           // console.log(error)
        }
    }

    useEffect(()=>{
        readData()
    },[]);

    const onSubmit = async () => {
        //console.log(formData.password, formData.conPassword);
        if (formData.password != formData.conPassword) {
            Toast.show({
                type: "error",
                text1: `Please enter the same password in both fields`,
            });
            return;
        }
            try {
             const myFormData =    {
                    userID: userDetails.userID,
                    userName: userDetails.userName,
                    password: formData.password ,
                    lastUpdatedBy: userDetails.userName,
                    mobileNo: userDetails.userName,
                  }
                  //console.log("FormData",myFormData);

                  const response = await Axios.post(`${Api}Authenticate/UpdatePassword`,myFormData)
                  //console.log(response.data);
                  Toast.show({
                    type: "success",
                    text1: `Password is updated.`,
                });
                  navigation.navigate('Login')
            } catch (error) {
               // console.log(error);
            }

    }

    return (
        <ImageBackground source={require('../../assets/images/bg1.png')} style={CommonStylesheet.bg} >

            {loading ? <Loader /> :
                <View style={[CommonStylesheet.container]}>
                    <View >
                        <Image source={require('../../assets/images/logo.png')} alt="logo.png" style={CommonStylesheet.parentConatiner} />
                    </View>

                    <View style={{
                        height: 1.5,
                        backgroundColor: '#2196f3',
                        alignSelf: 'center',
                        width: wp('30%'),
                        marginTop: 10,
                        marginBottom: 10
                    }} />

                    <Stack space={4} w="90%" maxW="400px" mt={5}  >

                        <FormControl isRequired isInvalid={'password' in errors} >
                            <Input size="lg"
                                borderColor={'#2196f3'}
                                borderWidth={'1'}
                                bgColor={'white'}
                                style={{ marginLeft: 10, height: 40, fontFamily: 'Poppins-Regular' }}
                                placeholder="Enter new password" onChangeText={value => setData({ ...formData, password: value })}
                                InputLeftElement={<Icon name="envelope" size={20} style={{ marginLeft: 10, color: '#2196f3' }} />}
                            />
                            {'password' in errors ? <FormControl.ErrorMessage>Enter new password</FormControl.ErrorMessage> : <FormControl.HelperText>

                            </FormControl.HelperText>}
                        </FormControl>

                        <FormControl isRequired isInvalid={'conPassword' in errors} >
                            <Input size="lg"
                                borderColor={'#2196f3'}
                                borderWidth={'1'}
                                bgColor={'white'}
                                style={{ marginLeft: 10, height: 40, fontFamily: 'Poppins-Regular' }}
                                placeholder="Confirm new password" onChangeText={value => setData({ ...formData, conPassword: value })}
                                InputLeftElement={<Icon name="envelope" size={20} style={{ marginLeft: 10, color: '#2196f3' }} />}
                            />
                            {'conPassword' in errors ? <FormControl.ErrorMessage>Reset Password</FormControl.ErrorMessage> : <FormControl.HelperText>

                            </FormControl.HelperText>}
                        </FormControl>

                        <Button
                            onPress={onSubmit}
                            style={{ height: 40, width: "100%", backgroundColor: '#DA251D', borderColor: '#005699', borderRadius: 5, alignSelf: 'center' }}>
                            <Text style={CommonStylesheet.ButtonText}>Submit</Text>
                        </Button>



                        <View style={{
                            height: 1.5,
                            backgroundColor: '#2196f3',
                            alignSelf: 'center',
                            width: wp('30%'),
                            marginTop: 10,
                        }} />

                        <Text style={{ alignSelf: 'center', color: '#2196f3' }}>
                            or
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ alignSelf: 'center', color: '#2196f3' }}>
                                Sign In
                            </Text>
                        </TouchableOpacity>

                        <HStack mt="1" justifyContent="center">
                        </HStack>
                    </Stack>
                </View>
            }


        </ImageBackground>
    )
}

export default ResetPassword;