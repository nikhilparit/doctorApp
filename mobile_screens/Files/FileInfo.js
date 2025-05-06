import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommonStylesheet from '../../common_stylesheet/CommonStylesheet';

const FileInfo = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
            <View style={styles.container}>
            <Text style={styles.text}>Details</Text>
                <View style={styles.innerContainer}>
                    <Text style={styles.text} >Path: /storage/emulated/0/Pictures/DenteeReports/091c27c2-1a38-4cb6-bee2/DenteeReports/</Text>
                    <Text style={styles.text}>Size: 126 KB</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f8ff', 
    },
     innerContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '90%', 
        height:'80%',
        padding: 20,
        backgroundColor: '#f0f0f0', 
        borderRadius: 10,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, 
        flexDirection: 'column',
        overflow: 'hidden',
    },
    text: {
        fontSize:16,
        color: '#333', // Set a color that matches your design
        // textAlign: 'center',
        marginBottom:20,
        flexWrap: 'wrap', 
        maxWidth: '100%',    
    },
});

export default FileInfo;
