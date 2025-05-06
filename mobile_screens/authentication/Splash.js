import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromStorage } from "../../features/authSlice"; 

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
  
          if (user.token && user.userID) {
            await dispatch(loadUserFromStorage()); // Dispatch user data to the Redux store
            navigation.navigate("ClinicList"); // Navigate to ClinicList if authenticated
          } else {
            navigation.navigate("Login"); // Navigate to Login if data is incomplete
          }
        } else {
          navigation.navigate("Login"); // Navigate to Login if no user data is found
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigation.navigate("Login"); // Navigate to Login in case of error
      }
    };
  
    checkAuthentication();
  }, [navigation, dispatch]);
}

const styles = StyleSheet.create({
  logo: {
    width: 200, // Adjust size as needed
    height: 200,
    resizeMode: "contain",
  },
});

export default Splash;
