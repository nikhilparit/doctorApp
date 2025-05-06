import React, { useState, useEffect } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import {
  FormControl,
  Input,
  Text,
  Box,
  Stack,
  VStack,
  Button,
  Flex,
  Image,
} from 'native-base';
//common styles
import { CommonStyle } from "../../../commonStyles/CommonStyle";
import { StyleSheet, Dimensions, } from 'react-native';
const { height, width } = Dimensions.get('window');
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import MyProfile from "../MyProfile/MyProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LabWorkMasterData = ({ route }) => {
  const navigation = useNavigation();
  const [myClinicID, setClinicID] = useState('');
  const reaData = async () => {
    const clinicID = await AsyncStorage.getItem('clinicID');
    console.log(clinicID);
    setClinicID(clinicID);
  }
  useEffect(() => {
    reaData()
  }, []);
  return (

    <ImageBackground source={require('../../../assets/images/dashbg.jpeg')} style={CommonStyle.backgroundimage}>


      <ScrollView>
          <View style={{ marginTop: 10,padding:10 }}>

            <TouchableOpacity onPress={() => navigation.navigate('LabWorkComponentList', {
              clinicID: myClinicID,
              category: 'LabItem Sent',
              name: 'LabItem Sent'
            })}>
              <View style={CommonStyle.borderforcardatHomeScreen}>
                <View style={{ flexDirection: 'row', }}>
                  <View style={CommonStyle.iconatSettingScreen}>

                    <Image
                      source={require('../../../assets/images/myprofile.png')} alt="logo.png" />
                  </View>

                  <View style={CommonStyle.cardtextSettingScreen}>

                    <Text style={CommonStyle.headertext16}>
                      LabItem Sent
                    </Text>

                  </View>

                  <View style={CommonStyle.careticonatSettingScreen}>
                    <Icon style={CommonStyle.iconstylediscover}
                      name="caret-right">
                    </Icon>
                  </View>
                </View>
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: -10,
                    flexDirection: 'row',
                  }}>

                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('LabWorkComponentList', {
              clinicID: myClinicID,
              category: 'LabItemStage',
              name: 'LabItemStage'
            })}>
              <View style={CommonStyle.borderforcardatHomeScreen}>
                <View style={{ flexDirection: 'row', }}>
                  <View style={CommonStyle.iconatSettingScreen}>

                    <Image
                      source={require('../../../assets/images/doctorlist.png')} alt="logo.png" />
                  </View>

                  <View style={CommonStyle.cardtextSettingScreen}>

                    <Text style={CommonStyle.headertext16}>
                      LabItem Stage
                    </Text>

                  </View>

                  <View style={CommonStyle.careticonatSettingScreen}>
                    <Icon style={CommonStyle.iconstylediscover}
                      name="caret-right">
                    </Icon>
                  </View>
                </View>
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: -10,
                    flexDirection: 'row',
                  }}>

                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('LabWorkComponentList', {
              clinicID: myClinicID,
              category: ' Lab Work Component',
              name: 'Lab Work Component'
            })}>
              <View style={CommonStyle.borderforcardatHomeScreen}>
                <View style={{ flexDirection: 'row', }}>
                  <View style={CommonStyle.iconatSettingScreen}>

                    <Image
                      source={require('../../../assets/images/masterdata.png')} alt="logo.png" />
                  </View>

                  <View style={CommonStyle.cardtextSettingScreen}>

                    <Text style={CommonStyle.headertext16}>
                      Lab Work Component
                    </Text>

                  </View>

                  <View style={CommonStyle.careticonatSettingScreen}>
                    <Icon style={CommonStyle.iconstylediscover}
                      name="caret-right">
                    </Icon>
                  </View>
                </View>
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: -10,
                    flexDirection: 'row',
                  }}>

                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ManageLab', {
              clinicID: myClinicID
            })}>
              <View style={CommonStyle.borderforcardatHomeScreen}>
                <View style={{ flexDirection: 'row', }}>
                  <View style={CommonStyle.iconatSettingScreen}>

                    <Image
                      source={require('../../../assets/images/clinicdetails.png')} alt="logo.png" />
                  </View>

                  <View style={CommonStyle.cardtextSettingScreen}>

                    <Text style={CommonStyle.headertext16}>
                      Manage Lab
                    </Text>

                  </View>

                  <View style={CommonStyle.careticonatSettingScreen}>
                    <Icon style={CommonStyle.iconstylediscover}
                      name="caret-right">
                    </Icon>
                  </View>
                </View>
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: -10,
                    flexDirection: 'row',
                  }}>

                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ManageLabItems', {
              clinicID: myClinicID
            })}>
              <View style={CommonStyle.borderforcardatHomeScreen}>
                <View style={{ flexDirection: 'row', }}>
                  <View style={CommonStyle.iconatSettingScreen}>

                    <Image
                      source={require('../../../assets/images/managerxtemplate.png')} alt="logo.png" />
                  </View>

                  <View style={CommonStyle.cardtextSettingScreen}>

                    <Text style={CommonStyle.headertext16}>
                      Manage LabItems
                    </Text>

                  </View>

                  <View style={CommonStyle.careticonatSettingScreen}>
                    <Icon style={CommonStyle.iconstylediscover}
                      name="caret-right">
                    </Icon>
                  </View>
                </View>
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: -10,
                    flexDirection: 'row',
                  }}>

                </View>
              </View>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default LabWorkMasterData;