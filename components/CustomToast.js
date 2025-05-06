import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const fontFamily = 'Poppins-Regular';

export const CustomToast = ({ text1, text2 }) => (
    <View style={styles.toastContainer}>
        {text1 && <Text style={[styles.text1, { fontFamily }]}>{text1}</Text>}
        {text2 && <Text style={[styles.text2, { fontFamily }]}>{text2}</Text>}
    </View>
);

const styles = StyleSheet.create({
    toastContainer: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 20,
    },
    text1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    text2: {
        fontSize: 18,
        color: '#ddd',
    },
});

export const toastConfig = {
    customToast: (props) => <CustomToast {...props} />,
};
