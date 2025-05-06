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

const ForgotPassword = ({ route }) => {
    const dispatch = useDispatch();
    //navigation
    const navigation = useNavigation();
    //logical part
    const [formData, setData] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = useState(false);


    const onSubmit = async() => {
        if (!formData.Email) {
            Toast.show({
                type: 'error',
                text1: 'Please enter email address / mobile number.',
            });
            return
        } 
        const myformData = {
            userName: formData.Email, // Ensure `user` is defined
          };

        try {
            const response = await Axios.post(`${Api}Authenticate/GetUserIDByUserName`, myformData);
            //console.log(response.data);
            if(response.status === 204){
                Toast.show({
                    type: 'error',
                    text1: 'User not found.',
                    text2: 'Please check email address / mobile number.',
                });
                return
            }
        
        } catch (error) {
            //console.log(error)
        }
        //console.log(formData.Email)
        navigation.navigate("PasswordOTP", {
            userName: formData.Email
        });
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

                    <Text style={CommonStylesheet.Text}>Enter the email address / mobile number associated with your account to reset your password</Text>


                    <Stack space={4} w="90%" maxW="400px" mt={5}  >

                        <FormControl isRequired isInvalid={'Email' in errors} >
                            <Input size="lg"
                                borderColor={'#2196f3'}
                                borderWidth={'1'}
                                bgColor={'white'}
                                style={{ marginLeft: 10, height: 40, fontFamily: 'Poppins-Regular' }}
                                placeholder="Email Address / Mobile No." onChangeText={value => setData({ ...formData, Email: value })}
                                InputLeftElement={<Icon name="envelope" size={20} style={{ marginLeft: 10, color: '#2196f3' }} />}
                            />
                            {'Email' in errors ? <FormControl.ErrorMessage>Please enter email address / mobile no.</FormControl.ErrorMessage> : <FormControl.HelperText>

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

export default ForgotPassword;