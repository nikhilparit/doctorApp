// utils/apiHeaders.js
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getHeaders = async () => {
    const userString = await AsyncStorage.getItem("user");
    const user = JSON.parse(userString);
    //console.log("User retrieved:", user);
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        AT: 'MobileApp',
        Authorization: user?.token
    };
};
