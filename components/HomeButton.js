import React from 'react';
import { TouchableOpacity,Dimensions} from 'react-native';
import  Icon  from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const Icon_Size =  Math.min(width, height) * 0.05; // Adjust the multiplier as per your requirement

const HomeButton = () => {
    const navigation = useNavigation();
    return(
        <TouchableOpacity onPress={()=>navigation.navigate('HomeScreen')}>
              <Icon name="home" size={Icon_Size} color="white" style={{ marginRight: 5 }} />
        </TouchableOpacity>
    )
}

export default HomeButton;