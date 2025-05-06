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
import { useSelector, useDispatch } from 'react-redux';
import { AuthenticateUserUsingOtp, loginUsingOTP, login } from '../../features/authSlice';
import { getHeaders } from '../../utils/apiHeaders';
const { width, height } = Dimensions.get('window');
import Toast from 'react-native-toast-message';

const PasswordOTP = ({ route }) => {
  const user = route.params.userName;
  //console.log("user", user)
  const dispatch = useDispatch();
  //navigation
  const navigation = useNavigation();
  //logical part
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [data, setOTPData] = useState({});

  const readData = async () => {
    const formData = {
      userName: user, // Ensure `user` is defined
    };

    try {
      const response = await Axios.post(`${Api}Authenticate/GetUserIDByUserName`, formData);
      //console.log(response.data);

      if (!response.data || !response.data.userName) {
        throw new Error("Invalid response from server");
      }

      const myData = {
        mobileNo: response.data.userName.trim(), // Ensure no leading/trailing spaces
      };

      try {
        // Dispatch the loginUsingOTP thunk
        const resultAction = await dispatch(loginUsingOTP(myData));

        if (loginUsingOTP.fulfilled.match(resultAction)) {
          const user = resultAction.payload;
          setOTPData(user);
          Toast.show({
            type: "success",
            text1: `${user.message}`,
          });

        } else {
          Toast.show({
            type: "error",
            text1: "Login failed.",
            text2: "An unexpected error occurred. Please try again.",
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Login failed.",
          text2: "An unexpected error occurred. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in readData:", error);
    }
  };

  useEffect(() => {
    readData();
  }, []);
  const onSubmit = () => {
   // console.log(data.otp, formData.Email)
    if (!formData.Email) {
      Toast.show({
        type: "error",
        text1: `Please enter OTP to continue`,
      });
      return;
    }
  
    if (data.otp == formData.Email) {
      navigation.navigate('ResetPassword',{
        userName:user
      });
    } else {
      Toast.show({
        type: "error",
        text1: `Please check OTP`,
      });
    }
  }
  

  async function resendOTP () {
    const formData = {
      userName: user, // Ensure `user` is defined
    };

    try {
      const response = await Axios.post(`${Api}Authenticate/GetUserIDByUserName`, formData);
      //console.log(response.data);
      if (!response.data || !response.data.userName) {
        throw new Error("Invalid response from server");
      }

      const myData = {
        mobileNo: response.data.userName.trim(), // Ensure no leading/trailing spaces
      };

      try {
        // Dispatch the loginUsingOTP thunk
        const resultAction = await dispatch(loginUsingOTP(myData));

        if (loginUsingOTP.fulfilled.match(resultAction)) {
          const user = resultAction.payload;
          setOTPData(user);

          Toast.show({
            type: "success",
            text1: `${user.message}`,
          });

        } else {
          Toast.show({
            type: "error",
            text1: "Login failed.",
            text2: "An unexpected error occurred. Please try again.",
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Login failed.",
          text2: "An unexpected error occurred. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in readData:", error);
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

            <FormControl isRequired isInvalid={'Email' in errors} >
              <Input size="lg"
                borderColor={'#2196f3'}
                borderWidth={'1'}
                bgColor={'white'}
                style={{ marginLeft: 10, height: 40, fontFamily: 'Poppins-Regular' }}
                placeholder="Enter otp to continue" onChangeText={value => setData({ ...formData, Email: value })}
                InputLeftElement={<Icon name="envelope" size={20} style={{ marginLeft: 10, color: '#2196f3' }} />}
              />
              {'Email' in errors ? <FormControl.ErrorMessage>Please enter OTP.</FormControl.ErrorMessage> : <FormControl.HelperText>

              </FormControl.HelperText>}
            </FormControl>
            <TouchableOpacity onPress={resendOTP}>
                <Text style={{ alignSelf: 'flex-start', color: '#2196f3' }}>
                  Resend
                </Text>
            </TouchableOpacity>

            <Button
              onPress={onSubmit}
              style={{ height: 40, width: "100%", backgroundColor: '#DA251D', borderColor: '#005699', borderRadius: 5, alignSelf: 'center' }}>
              <Text style={CommonStylesheet.ButtonText}>Continue</Text>
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

export default PasswordOTP;