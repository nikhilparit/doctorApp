import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import {
  FormControl,
  Input,
  Text,
  Box,
  Stack,
  VStack,
  Button,
  Flex,

} from 'native-base';
import { useNavigation, useIsFocused } from '@react-navigation/native';
//import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import Axios from 'axios';
import Api from '../../api/Api';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { signupUser } from '../../features/authSlice';
import Toast from 'react-native-toast-message';

//common styles
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
const Signup = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  //logical part
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  // user - Inputs
  const [fname, setfName] = React.useState('');
  const [lname, setlName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  // const image = {uri: '../assets/images/bg.jpeg'};
  //regex-error
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const [emailError, setEmailError] = React.useState(false);
  const mobileRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  const [mobileError, setMobileError] = React.useState(false);

  const resetForm = () => {
    setfName('');
    setEmail('');
    setMobile('');
  }
  useEffect(() => {
    resetForm()
  }, [isFocused])


  const onSubmit = async () => {
    if (email !== '') {
      if (!emailRegex.test(email)) {
        setEmailError(true);
        // alert("Invalid Email", "Please write email in correct format");
        Toast.show({
          type: 'error', // Match the custom toast type
          text1: 'Invalid Email',
          text2: 'Please write email in correct format',
        });
        //resetForm();
        return;
      }
    }
    if (mobile !== '') {
      if (!mobileRegex.test(mobile)) {
        setMobileError(true);
        //alert("Invalid Mobile No", "Please write mobile no in correct format");
        Toast.show({
          type: 'error', // Match the custom toast type
          text1: 'Invalid Mobile No',
          text2: 'Please write mobile no in correct format',
        });
        //resetForm();
        return;
      }
    }
    if (fname == "" || email == "" || mobile == "") {
      Toast.show({
        type: 'error', // Match the custom toast type
        text1: 'Required all credentials for signup.',
        //text2: 'Required all credentials for signup.',
      });
      return;
    }
    const selectedDate = moment().format();
    const formData = {
      firstName: "",
      name: fname,
      lastName: "",
      email: email,
      contactNumber: mobile,
      isOTPVerified: true,
      isEmailVerified: true,
      createdOn: selectedDate,
      createdBy: mobile,
      lastUpdatedOn: selectedDate,
      lastUpdatedBy: mobile,
      countryCode: "+91",
    }
    //console.log('Data To Pass', formData);
    try {
      const result = await dispatch(signupUser(formData));

      if (signupUser.fulfilled.match(result)) {
        const { isSucceed, errorCode, message } = result.payload;
        //console.log("result.payload", result.payload)

        if (isSucceed) {
          // Navigate to the ClinicList screen if signup succeeds
          Toast.show({
            type: 'success', // Match the custom toast type
            text1: `${message}..!!`,
            //text2: 'Required all credentials for signup.',
          });
         // alert(`${message}..!!`)
          navigation.navigate("Login");
        } else {
          // Show the error message from the server response
          Toast.show({
            type: 'error', // Match the custom toast type
            text1: message || "Signup failed. Please check your details.",
            //text2: 'Required all credentials for signup.',
          });
         // alert(message || "Signup failed. Please check your details.");
        }
      } else {
        // Handle generic rejected cases
       // alert(result.payload || "Signup failed. Please check your details.");
       Toast.show({
        type: 'error', // Match the custom toast type
        text1: result.payload  || "Signup failed. Please check your details.",
        //text2: 'Required all credentials for signup.',
      });
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("An unexpected error occurred:", error.message);
      //alert("An unexpected error occurred. Please try again.");
      Toast.show({
        type: 'error', // Match the custom toast type
        text1: "An unexpected error occurred. Please try again.",
        //text2: 'Required all credentials for signup.',
      });
    }

  }
  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailError(false);
  };
  const handleMobileChange = (value) => {
    setMobile(value);
    setMobileError(false);
  };

  return (
    <ImageBackground source={require('../../assets/images/bg1.png')} style={CommonStylesheet.backgroundimage}>
      <View style={CommonStylesheet.container}>
        <View style={{ marginBottom: 10 }}>
          <Image source={require('../../assets/images/logo.png')} />
        </View>
        <View style={{
          height: 1.5,
          backgroundColor: '#2196f3',
          alignSelf: 'center',
          width: wp('30%'),
          // marginBottom:10
        }} />

        <Stack space={5} w="90%" maxW="400px" mx="auto" margin={10}>
          <FormControl>
            <Input
              size="lg"
              borderColor={'#2196f3'}
              bgColor={'white'}
              style={{
                marginLeft: 10,
                height: 40,
                fontFamily: 'Poppins-Regular'
              }}
              placeholder="Enter Full Name"
              value={fname}
              onChangeText={newValue => setfName(newValue)}
              InputLeftElement={<Icon name="user"
                size={20} style={{ marginLeft: 10, color: '#2196f3' }} />}
            />
          </FormControl>

          {/* <FormControl>
            <Input 
            size="lg" 
            borderColor={'#005599'} 
            bgColor={'white'} 
            style={{ marginLeft: 10 }} 
            placeholder=" Last Name" 
            value={lname}
            onChangeText={newValue => setlName(newValue)}
            InputLeftElement={<Icon name="user" size={20} style={{ marginLeft: 10, color: '#005699' }} />}
            />
          </FormControl> */}
          <FormControl>
            <Input

              size="lg"
              borderColor={'#2196f3'}
              bgColor={'white'}
              style={{
                marginLeft: 10,
                height: 40, fontFamily: 'Poppins-Regular'
              }}
              placeholder="Enter Email Address"
              value={email}
              onChangeText={handleEmailChange}
              InputLeftElement={<Icon name="envelope" size={20} style={{ marginLeft: 10, color: '#2196f3' }}
              />}
            />
          </FormControl>
          <View style={{ flexDirection: 'row' }}>
            <FormControl style={{ width: "30%" }}>
              <Input
                size="lg"
                borderColor={'#2196f3'}
                bgColor={'white'}

                keyboardType='numeric'
                // maxLength={10}
                style={{ fontFamily: 'Poppins-Regular', height: 40, }}
                placeholder="country Code"
                value={'+91'}
                //onChangeText={handleMobileChange}
                InputLeftElement={<Icon name="mobile" size={20} style={{ marginLeft: 10, color: '#2196f3' }} />}
              />
            </FormControl>

            <FormControl style={{ width: "67.5%", marginLeft: 10 }}>
              <Input
                size="lg"
                borderColor={'#2196f3'}
                bgColor={'white'}
                keyboardType='numeric'
                maxLength={10}
                style={{ marginLeft: 10, height: 40, fontFamily: 'Poppins-Regular' }}
                placeholder=" Enter Mobile No"
                value={mobile}
                onChangeText={handleMobileChange}
              //InputLeftElement={<Icon name="mobile" size={20} style={{ marginLeft: 10, color: '#005699' }} />}
              />
            </FormControl>
          </View>
          <Button size="sm" onPress={() => onSubmit()}
            style={{ height: 40, width: "100%", borderColor: '#2196f3', borderRadius: 5, alignSelf: 'center', backgroundColor: '#da251d' }}>
            <Text style={CommonStylesheet.ButtonText}>Register Now</Text>
          </Button>

        </Stack>

        <View style={{
          height: 0.5,
          backgroundColor: '#2196f3',
          alignSelf: 'center',
          width: wp('30%'),

        }} />
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text mt="7" fontSize={14} fontWeight="medium" color="#2196f3">
              Already a Dentee member? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
export default Signup;
