import React from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, } from 'react-native';
import {
    FormControl,
    Input,
    Text,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    CheckIcon,
    Modal,
    Radio,
    Checkbox,
    Image,
} from 'native-base';
//common styles
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import { useNavigation } from "@react-navigation/native";

const DentalChart = () => {

    const [groupValues, setGroupValues] = React.useState([]);
    const [service, setService] = React.useState("");
    const [isActiveStatus, setIsActive] = React.useState(false);
    const [selectedTooth, setSelectedTooth] = React.useState(null);
    const navigation = useNavigation();
    const handleToggle = () => {
        setIsActive(!isActiveStatus);
    }
    // Function to handle tooth onPress
    const handleToothonPress = (toothNumber) => {
        console.log("handleToothonPress",toothNumber);
        // If the selected tooth is the same as the current tooth, deselect it
        if (selectedTooth === toothNumber) {
            setSelectedTooth(null);
        } else {
            setSelectedTooth(toothNumber);
        }
    };

    // Function to get the style of the tooth
    const getToothStyle = (toothNumber) => {
        console.log("getToothStyle",toothNumber);
        if (selectedTooth === toothNumber) {
            return { ...styles.imageIcon, tintColor: '#666' }; // Highlight selected tooth
        }
        return styles.imageIcon;
    };
    return (
        <>
            <ScrollView>
                <View style={{ marginTop: 15 }}>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 12, marginTop: 10 }}>
                        <Checkbox value={isActiveStatus} my={2} onChange={handleToggle} isChecked={isActiveStatus == true ? true : false}>
                            <Text style={CommonStylesheet.Text}>Primary Teeth</Text>
                        </Checkbox>
                    </View>


                </View>
                <View>
                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>
                        <TouchableOpacity onPress={() => handleToothonPress(18)}>
                            <Image source={require('../../../assets/images/upperTeeth/18toothupper.png')}
                                alt="logo.png"
                                style={getToothStyle(18)} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleToothonPress(17)}>
                            <Image source={require('../../../assets/images/upperTeeth/17toothupper.png')} alt="logo.png"
                                 style={getToothStyle(17)} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleToothonPress(16)}>
                            <Image source={require('../../../assets/images/upperTeeth/16toothupper.png')} alt="logo.png"
                                 style={getToothStyle(16)} />
                        </TouchableOpacity>
                        <TouchableOpacity ononPress={() => handleToothonPress(15)}>
                            <Image source={require('../../../assets/images/upperTeeth/15toothupper.png')} alt="logo.png"
                               style={getToothStyle(15)} />
                        </TouchableOpacity>
                        <TouchableOpacity ononPress={() => handleToothonPress(14)}>
                            <Image source={require('../../../assets/images/upperTeeth/14toothupper.png')} alt="logo.png"
                                style={getToothStyle(14)} />
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/13toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/12toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/11toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>


                        <View style={styles.verticleLine}></View>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/21toothupper.png')} alt="logo.png"
                                style={styles.imageIcon17} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/22toothupper.png')} alt="logo.png"
                                style={styles.imageIcon17} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/23toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/24toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/25toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/26toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/27toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/28toothupper.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/18toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/17toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/16toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/15toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/14toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/13toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/12toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/11toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/21toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/22toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/23toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/24toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/25toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/26toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/27toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/upperTeeth/28toothfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        height: 0.5,
                        backgroundColor: '#005599',
                        alignSelf: 'center',
                        width: '100%',
                        marginTop: 10
                    }} />
                    <View style={{ flexDirection: 'row', marginTop: 2, justifyContent: 'space-between', marginRight: 5, marginLeft: 0 }}>

                        <Text style={[styles.textFontTeethNo]}>18</Text>
                        <Text style={styles.textFontTeethNo}>17</Text>
                        <Text style={styles.textFontTeethNo}>16</Text>
                        <Text style={styles.textFontTeethNo}>15</Text>
                        <Text style={styles.textFontTeethNo}>14</Text>
                        <Text style={styles.textFontTeethNo}>13</Text>
                        <Text style={styles.textFontTeethNo}>12</Text>
                        <Text style={styles.textFontTeethNo}>11</Text>
                        <Text style={styles.textFontTeethNo}>21</Text>
                        <Text style={styles.textFontTeethNo}>22</Text>
                        <Text style={styles.textFontTeethNo}>23</Text>
                        <Text style={styles.textFontTeethNo}>24</Text>
                        <Text style={styles.textFontTeethNo}>25</Text>
                        <Text style={styles.textFontTeethNo}>26</Text>
                        <Text style={styles.textFontTeethNo}>27</Text>
                        <Text style={styles.textFontTeethNo}>28</Text>
                    </View>
                    <View style={{
                        height: 0.5,
                        backgroundColor: '#005599',
                        alignSelf: 'center',
                        width: '100%',
                        marginTop: 5
                    }} />

                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/48lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/47lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/46lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/45lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/44lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/43lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/42lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/41lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/31lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/32lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/33lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/34lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/35lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/36lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/37lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/38lowerfront.png')} alt="logo.png"
                                style={styles.imageIconToothFront} />
                        </TouchableOpacity>


                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>
                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/48lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon17} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/47lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon17} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/46lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/45lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/44lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/43lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/42lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/41lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/31lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon17} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/32lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon17} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/33lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/34lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/35lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/36lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/37lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <Image source={require('../../../assets/images/lowerTeeth/38lowertooth.png')} alt="logo.png"
                                style={styles.imageIcon} />
                        </TouchableOpacity>

                    </View>
                    <View style={{
                        height: 0.5,
                        backgroundColor: '#005599',
                        alignSelf: 'center',
                        width: '100%',
                        marginTop: 10
                    }} />
                    <View style={{ flexDirection: 'row', marginTop: 2, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>

                        <Text style={styles.textFontTeethNo}>48</Text>
                        <Text style={styles.textFontTeethNo}>47</Text>
                        <Text style={styles.textFontTeethNo}>46</Text>
                        <Text style={styles.textFontTeethNo}>45</Text>
                        <Text style={styles.textFontTeethNo}>44</Text>
                        <Text style={styles.textFontTeethNo}>43</Text>
                        <Text style={styles.textFontTeethNo}>42</Text>
                        <Text style={styles.textFontTeethNo}>41</Text>
                        <Text style={styles.textFontTeethNo}>31</Text>
                        <Text style={styles.textFontTeethNo}>32</Text>
                        <Text style={styles.textFontTeethNo}>33</Text>
                        <Text style={styles.textFontTeethNo}>34</Text>
                        <Text style={styles.textFontTeethNo}>35</Text>
                        <Text style={styles.textFontTeethNo}>36</Text>
                        <Text style={styles.textFontTeethNo}>37</Text>
                        <Text style={styles.textFontTeethNo}>38</Text>
                    </View>
                    <View style={{
                        height: 0.5,
                        backgroundColor: '#005599',
                        alignSelf: 'center',
                        width: '100%',
                        marginTop: 5
                    }} />


                </View>




                {isActiveStatus == true ?
                    <View style={{ marginTop: 10, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>
                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/15toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/14toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/13toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/12toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/11toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <View style={styles.verticleLine}></View>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/21toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon17} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/22toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon17} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/23toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/24toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/25toothupper.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>


                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>
                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/15toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/14toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/13toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/12toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/11toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/21toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/22toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/23toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/24toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/upperTeeth/25toothfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>





                        </View>
                        <View style={{
                            height: 0.5,
                            backgroundColor: '#005599',
                            alignSelf: 'center',
                            width: '100%',
                            marginTop: 10
                        }} />
                        <View style={{ flexDirection: 'row', marginTop: 2, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>
                            <Text style={styles.textFontTeethNo}>1E</Text>
                            <Text style={styles.textFontTeethNo}>1D</Text>
                            <Text style={styles.textFontTeethNo}>1C</Text>
                            <Text style={styles.textFontTeethNo}>1B</Text>
                            <Text style={styles.textFontTeethNo}>1A</Text>
                            <Text style={styles.textFontTeethNo}>2A</Text>
                            <Text style={styles.textFontTeethNo}>2B</Text>
                            <Text style={styles.textFontTeethNo}>2C</Text>
                            <Text style={styles.textFontTeethNo}>2D</Text>
                            <Text style={styles.textFontTeethNo}>2E</Text>


                        </View>
                        <View style={{
                            height: 0.5,
                            backgroundColor: '#005599',
                            alignSelf: 'center',
                            width: '100%',
                            marginTop: 5
                        }} />

                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/45lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/44lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/43lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/42lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/41lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/31lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/32lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/33lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/34lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/35lowerfront.png')} alt="logo.png"
                                    style={styles.imageIconToothFront} />
                            </TouchableOpacity>







                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>
                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/45lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/44lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/43lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/42lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/41lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/31lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon17} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/32lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon17} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/33lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/34lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity >
                                <Image source={require('../../../assets/images/lowerTeeth/35lowertooth.png')} alt="logo.png"
                                    style={styles.imageIcon} />
                            </TouchableOpacity>

                        </View>
                        <View style={{
                            height: 0.5,
                            backgroundColor: '#005599',
                            alignSelf: 'center',
                            width: '100%',
                            marginTop: 10
                        }} />
                        <View style={{ flexDirection: 'row', marginTop: 2, justifyContent: 'space-between', marginRight: 5, marginLeft: 5 }}>
                            <Text style={styles.textFontTeethNo}>4E</Text>
                            <Text style={styles.textFontTeethNo}>4D</Text>
                            <Text style={styles.textFontTeethNo}>4C</Text>
                            <Text style={styles.textFontTeethNo}>4B</Text>
                            <Text style={styles.textFontTeethNo}>4A</Text>
                            <Text style={styles.textFontTeethNo}>3A</Text>
                            <Text style={styles.textFontTeethNo}>3B</Text>
                            <Text style={styles.textFontTeethNo}>3C</Text>
                            <Text style={styles.textFontTeethNo}>3D</Text>
                            <Text style={styles.textFontTeethNo}>3E</Text>

                        </View>
                        <View style={{
                            height: 0.5,
                            backgroundColor: '#005599',
                            alignSelf: 'center',
                            width: '100%',
                            marginTop: 5
                        }} />


                    </View> :
                    null
                }

            </ScrollView>
        </>


    );
};

export default DentalChart;
const styles = StyleSheet.create({

    imageIcon: {
        height: 40,
        width: 20,
    },
    imageIcon17: {
        height: 40,
        width: 20,
    },

    textFontTeethNo: {
        fontSize: 14,
        color: '#5f6067',
        fontFamily: 'Poppins-Regular'
    },
    imageIconToothFront: {
        height: 17,
        width: 15,
    },
    verticleLine: {
        height: '545%',
        width: 1,
        backgroundColor: '#909090',
    },
    imageIcon: {
        height: 40,
        width: 20,
        tintColor: null, // Default color
    },


})