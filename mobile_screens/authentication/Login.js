import React, { useState,useEffect } from 'react';
import { View, SafeAreaView, ImageBackground, StyleSheet, Alert, Dimensions, Image } from 'react-native';
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
const headers = getHeaders();


const Login = () => {
  const dispatch = useDispatch();

  //navigation
  const navigation = useNavigation();
  //logical part
  const [formData, setData] = React.useState({ Email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.Email) tempErrors.Email = "Email is required";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onSubmit = async () => {
    // Reset errors before validation
    setErrors({});
    if (!validateForm()) return;
    const myData = {
      userName: formData.Email, // Align with `login` action payload
      password: formData.password,
      rememberMe: true,
      countryDialCode: "+91",
    };

    // Input validation
    if (!formData.Email) {
      setErrors((prevErrors) => ({ ...prevErrors, Email: "Email is required" }));
      return;
    }
    if (!formData.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "Password is required" }));
      return;
    }

    try {
      setLoading(true);

      // Dispatch the login action and wait for its result
      const result = await dispatch(
        login({
          userName: myData.userName,
          password: myData.password,
          rememberMe: myData.rememberMe,
          countryDialCode: myData.countryDialCode,
        })
      );

      // Check if the login was fulfilled
      if (login.fulfilled.match(result)) {
        // Navigate to the desired screen on success
        navigation.navigate("ClinicList");
      } else {
        // Handle login errors from `rejected` state
        //alert(result.payload || "Login failed. Please check username & password.")
        Toast.show({
          type: 'error', // Match the custom toast type
          text1: `${result.payload}` || `Login failed. Please check username & password.`,
          text2: 'Please check username & password.',
        });
      }
    } catch (error) {
      //console.error("Login failed:", error.message);
      Toast.show({
        type: 'error', // Match the custom toast type
        text1: 'An unexpected error occurred.',
        text2: 'Please try again.',
      });
      //alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Always hide the loader
    }
  };

  const onOtp = async () => {
    // Validate the mobile number input
    if (!formData.Email || formData.Email.trim() === "") {
      alert("Mobile number is required.");
      Toast.show({
        type: 'error', // Match the custom toast type
        text1: 'Mobile number is required.',
        text2: 'Please add valid mobile number.',
      });
      return;
    }

    // Prepare data for the OTP login
    const myData = {
      mobileNo: formData.Email.trim(), // Ensure no leading/trailing spaces
    };

    try {
      // Dispatch the loginUsingOTP thunk
      const resultAction = await dispatch(loginUsingOTP(myData));

      // Check the outcome of the async thunk
      if (loginUsingOTP.fulfilled.match(resultAction)) {
        const user = resultAction.payload; // Access the user data
        //console.log("OTP login successful:", user);
        if (resultAction.payload.code == 404 || resultAction.payload.status == "Failed") {
          Toast.show({
            type: 'error', // Match the custom toast type
            text1: `${user.message}`,
          });
          return
        } else {
          Toast.show({
            type: 'success', // Match the custom toast type
            text1: `${user.message}`,
          });
          // alert(`${user.message}`);
          // Perform navigation or other actions here
          navigation.navigate('Otp');
        }
      } else {
        const errorMessage = resultAction.payload ||
          Toast.show({
            type: 'error', // Match the custom toast type
            text1: 'Login failed.',
            text2: 'An unexpected error occurred. Please try again.',
          });
        //console.error("Error during OTP login:", errorMessage);
        // alert(errorMessage);
      }
    } catch (error) {
      console.error("Unexpected error during OTP login:", error);
      //alert("An unexpected error occurred. Please try again.");
      Toast.show({
        type: 'error', // Match the custom toast type
        text1: 'Unexpected error during OTP login',
        text2: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  useEffect(() => {
    setData({ Email: "", password: "" });
  }, []);

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
                placeholder="Email Address / Mobile No." onChangeText={value => setData({ ...formData, Email: value })}
                InputLeftElement={<Icon name="envelope" size={20} style={{ marginLeft: 10, color: '#2196f3' }} />}
              />
              {'Email' in errors ? <FormControl.ErrorMessage>Please enter email address / mobile no.</FormControl.ErrorMessage> : <FormControl.HelperText>

              </FormControl.HelperText>}
            </FormControl>

            <FormControl isRequired isInvalid={'password' in errors}>
              <Input
                size="lg"
                borderColor={'#2196f3'}
                bgColor={'white'}
                style={{ marginLeft: 10, height: 40, fontFamily: 'Poppins-Regular', }}
                type='password' placeholder="Enter Password"
                onChangeText={value => setData({ ...formData, password: value })}
                InputLeftElement={<Icon name="lock" size={20} style={{ marginLeft: 10, color: '#2196f3' }} />}
              />
              {'password' in errors ? <FormControl.ErrorMessage>Please enter password</FormControl.ErrorMessage> : <FormControl.HelperText>

              </FormControl.HelperText>}
            </FormControl>
            <Button
              onPress={onSubmit}
              style={{ height: 40, width: "100%", backgroundColor: '#DA251D', borderColor: '#005699', borderRadius: 5, alignSelf: 'center' }}>
              <Text style={CommonStylesheet.ButtonText}>Sign In</Text>
            </Button>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Link
                                _text={{
                                    fontSize: 'sm',
                                    fontWeight: '500',
                                    color: '#0a3ff0',

                                }}
                                onPress={() => Alert.alert('Work is in process...')}
                                alignSelf="flex-start"
                                mt={1}
                            >
                                Forget Password?
                            </Link>
                            <Link
                                _text={{
                                    fontSize: 'sm',
                                    fontWeight: '500',
                                    color: '#0a3ff0',
                                }}
                                onPress={() => navigation.navigate('SignupScreen')}
                                alignSelf="flex-end">
                                New here? Sign up
                            </Link>
                        </View> */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <Link
                _text={{
                  fontSize: 'sm',
                  fontWeight: '500',
                  color: '#2196f3',

                }}
                onPress={() => navigation.navigate('ForgotPassword')}
                alignSelf="flex-start"
                mt={1}
              >
                Forgot Password?
              </Link>
              <Link
                _text={{
                  fontSize: 'sm',
                  fontWeight: '500',
                  color: '#2196f3',
                }}
                onPress={() => navigation.navigate('Signup')}
                alignSelf="flex-end">
                New here? Sign up
              </Link>
            </View>
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

            <HStack mt="1" justifyContent="center">


              <Button
                onPress={() => onOtp()}
                style={{ height: 40, width: '100%', backgroundColor: '#2196f3', borderColor: '#005699', borderRadius: 5, alignSelf: 'center' }}>
                <Text style={CommonStylesheet.ButtonText}>Login using an OTP</Text>
              </Button>
            </HStack>
          </Stack>
        </View>
      }


    </ImageBackground>
  )
}


export default Login;
