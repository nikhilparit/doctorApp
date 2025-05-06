import * as React from 'react';
import { View, Image, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import {
  FormControl,
  Input,
  Text,
  Box,
  Stack,
  VStack,
  Button,
  Flex,
  HStack,
  Pressable,
  Link
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
//Login Screen
import Login from './Login';
//common styles
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Snackbar from 'react-native-snackbar';
import Axios from 'axios';
import Api from '../../api/Api';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';
import { AuthenticateUserUsingOtp, loginUsingOTP } from '../../features/authSlice';
import Toast from 'react-native-toast-message';
const { width, height } = Dimensions.get('window');
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

function Otp() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  //console.log("UserOTP",user);
  //const mobileNumber = route.params.mobileNo;
  //logical part
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  // const image = {uri: '../assets/images/bg.jpeg'};

  const onSubmit = async () => {
    // ✅ Handle missing OTP correctly
    if (!formData.Otp) { 
        setErrors(prevErrors => ({
            ...prevErrors,
            Otp: 'OTP is required'
        }));
        return;
    }

    const myformData = {
        userName: user.userName,
        loginFromMobile: true,
        otp: formData.Otp
    };

    try {
        const resultAction = await dispatch(AuthenticateUserUsingOtp(myformData));
       // console.log("API Response:", resultAction);
        if (resultAction.type == 'AuthenticateUserUsingOtp/rejected') {
            Toast.show({
                type: 'error',
                text1: 'Invalid OTP.',
                text2:' Please try again.'
            });
            return;
        }
        navigation.navigate('ClinicList');

    } catch (error) {
        console.error("Authentication failed:", error);
        Toast.show({
            type: 'error',
            text1: 'Something went wrong. Please try again.',
        });
    }
};


  const onOtp = async () => {
    navigation.navigate('Login');
  }

  const resendOTP = async () => {
    const myData = {
      mobileNo: user.userName, // Ensure no leading/trailing spaces
    };

    try {
      // Dispatch the loginUsingOTP thunk
      const resultAction = await dispatch(loginUsingOTP(myData));

      // Check the outcome of the async thunk
      if (loginUsingOTP.fulfilled.match(resultAction)) {
        const user = resultAction.payload; // Access the user data
        //console.log("OTP login successful:", user);
        Toast.show({
          type: 'success', // Match the custom toast type
          text1: `${user.message}`,
        });
        // Perform navigation or other actions here
        navigation.navigate('Otp');
      } else {
        Toast.show({
          type: 'error', // Match the custom toast type
          text1: 'Login failed.',
          text2: 'An unexpected error occurred. Please try again.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error', // Match the custom toast type
        text1: 'Login failed.',
        text2: 'An unexpected error occurred. Please try again.',
      });
    }
  }

  return (
    <ImageBackground source={require('../../assets/images/bg1.png')} style={CommonStylesheet.backgroundimage}>
      <View style={Styles.formContainer}>
        <View style={{ marginBottom: '10' }}>
          <Image source={require('../../assets/images/logo.png')} alt="logo.png"
            style={CommonStylesheet.parentConatiner} />
        </View>
        <View style={{ margin: 10 }}>
          <Text style={CommonStylesheet.TextForgotScreen}>
            We've sent a code to mobile number {user.userName}. Please enter below to complete verification.
          </Text>
        </View>
        <Stack space={3} w="90%" maxW="400px" mx="auto" marginTop={0}>
          <FormControl isRequired isInvalid={'Otp' in errors} >
            <Input keyboardType='numeric' maxLength={6}
              size="lg" borderColor={'#2196f3'}
              bgColor={'white'}
              style={{ marginLeft: 10, fontFamily: 'Poppins-Regular' }}
              placeholder="Enter OTP" onChangeText={value => setData({
                ...formData,
                Otp: value,
              })}
              InputLeftElement={<Icon name="envelope"
                size={20}
                style={{ marginLeft: 10, color: '#2196f3' }} />}
            />
            {'Otp' in errors ? <FormControl.ErrorMessage fontSize={CommonStylesheet.regularFontSize}>Please enter otp</FormControl.ErrorMessage> : <FormControl.HelperText>

            </FormControl.HelperText>}
          </FormControl>
          <Button size="sm" onPress={onSubmit}
            style={{ height: 40, backgroundColor: '#DA251D', width: "100%", borderColor: '#2196f3', borderRadius: 5, alignSelf: 'center' }}>
            <Text style={CommonStylesheet.ButtonText}>Sign In</Text>
          </Button>
          <Link
            _text={{
              fontSize: 'sm',
              fontWeight: '500',
              color: '#3399ff',
            }}
            onPress={() => resendOTP()}
            alignSelf="center"
            mt={1}
          >
            Resend OTP
          </Link>
          <View style={{
            height: 1.5,
            backgroundColor: '#2196f3',
            alignSelf: 'center',
            width: wp('30%'),
          }} />
          <Text style={{ alignSelf: 'center', color: '#2196f3' }}>
            or
          </Text>
          <Button size="sm" onPress={onOtp}
            style={{ height: 40, width: '100%', backgroundColor: '#2196f3', borderColor: '#2196f3', borderRadius: 5, alignSelf: 'center' }}>
            <Text style={CommonStylesheet.ButtonText}>Login with your password</Text>
          </Button>
        </Stack>
      </View>
    </ImageBackground>
  );
}
const Styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

})
export default Otp;
