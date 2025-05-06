
import React from 'react';
import { View,Text,StyleSheet } from 'react-native';
import { Spinner } from 'native-base';
import CommonStylesheet from '../common_stylesheet/CommonStylesheet';

 const Loader=()=> {
    return (
       <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Spinner
         size={'lg'}
        />
        <Text style={styles.headerText}>Please wait...!!!</Text>
       </View>
    )
};
export default Loader;

const styles = StyleSheet.create({
   headerText:{
      fontSize:24,
      fontWeight:'600',
      fontFamily:'Poppins-Regular',
    },
})