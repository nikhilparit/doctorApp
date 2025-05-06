import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import CommonStylesheet from '../../../common_stylesheet/CommonStylesheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Button, Modal, Checkbox, CheckIcon, Input, Box, Stack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Api from '../../../api/Api';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const TreatmentType = ({ route }) => {
  const mypatientID = route.params.patientID;
  const myclinicID = route.params.clinicID;
  // //console.log('My Clinic ID', myclinicID);
  const navigation = useNavigation();
  const [selected, setSelected] = React.useState("");
  const [treatmentType, settreatmentType] = useState([]);
  const [selectedTreatmentType, setselectedTreatmentType] = useState([]);
  const [groupValues, setGroupValues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState('');

  const readData = async() => {
    const token = await AsyncStorage.getItem('token');
    setToken(token);
    const headers = {
        'Content-Type': 'application/json',
        'AT': 'MobileApp',
        'Authorization': token
    };
    const formData = {
      clinicID: myclinicID
    }
    //console.log('Data To Pass', formData);
    try {
      Axios.post(`${Api}Patient/GetTreatmentType`, formData,{headers}).then(resp => {
        //console.log('Patient Treatment', resp.data);
        settreatmentType(resp.data);

      });
    } catch (error) {
      //console.log(error);
    }
  }
  useEffect(() => {
    readData()
  }, []);
  const openModal = () => {
    //setSelectedComplaint([]);
    setShowModal(true);
  }
  const handleCheckBox = () => {
    //console.log(groupValues);
    const data = [];
    for (let i = 0; i < groupValues.length; i++) {
      const id = groupValues[i];

      // Find the corresponding author information
      const author = treatmentType.find(item => item.treatmentTypeID === id);

      if (author) {
        data.push(author);
      }
    }

    //console.log("FINAL DATA FOR TRATEMENT", data);
    setselectedTreatmentType(data)
    setShowModal(false);
    // setSelectedComplaint(patientChiefComplaint.filter(item => item.id == id));
  }
  const saveAndGenarateBill = () => {

    navigation.navigate('AddTreatment', {
      patientID: mypatientID,
      clinicID: myclinicID,
      selectedTreatmentType
    })
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>
      <ScrollView>
        <View>
          <View style={{ paddingHorizontal: 15, marginTop: 15 }}>

            {/* <View style={{marginTop:-10,flexDirection:'row'}}>
        {
          treatmentType.map((item) => {
            return(
              <Text key={item} style={{marginTop:10,color:'#005699',marginLeft:5,fontFamily: 'Poppins-Bold'}}>{item}</Text>
            )
          })
        }
        
      </View> */}
            {/* <MultipleSelectList 
        setSelected={(val) => settreatmentType(val)} 
        data={data} 
        save="value"
        label="treatmentType"
        boxStyles={{marginTop:25,borderColor:'#000'}}
    /> */}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content width={350} height={500}>
                <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Treatment Types</Text></Modal.Header>
                <Modal.Body>
                  <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
                    <Checkbox.Group onChange={setGroupValues} value={groupValues}>
                      {treatmentType.map(item =>
                        <Checkbox value={item.treatmentTypeID} my="1" marginBottom={4} key={item.treatmentTypeID}>
                          <Text style={{
                            fontSize: 14,
                            color: '#5f6067',
                            fontFamily: 'Poppins-Medium',
                          }}>{item.title}</Text>
                        </Checkbox>
                      )}
                    </Checkbox.Group>
                  </View>
                </Modal.Body>
                <Modal.Footer>
                  <TouchableOpacity onPress={() => {
                      setShowModal(false);
                    }}>
                    <View style={[CommonStylesheet.buttonContainerdelete1, { marginRight: 10 }]}>
                      <Text style={CommonStylesheet.ButtonText}> Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCheckBox()}>
                    <View style={CommonStylesheet.buttonContainersave1}>
                      <Text style={CommonStylesheet.ButtonText}> Save</Text>
                    </View>
                  </TouchableOpacity>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </View>
          <Stack space={2} w="100%" mx="auto" paddingLeft={1} paddingRight={1}>
            <Input
              size="lg"
              style={Styles.inputPlaceholder}
              borderRadius={5}
              placeholderTextColor={'#808080'}
              placeholder="Select Treatment Type"
              onFocus={() => openModal()}
              value={selectedTreatmentType.map(item => item.title).join(', ')}>
                
            </Input>
          </Stack>
          {/* <View style={{ marginTop: 10 }}>
            <Text style={Styles.Text}>Selected Treatment :
              {selectedTreatmentType.map(item => (
                <Text style={Styles.Text} key={item.treatmentTypeID}> {`  `}{item.title}</Text>
              ))}
            </Text>
          </View> */}
          <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <View style={{}}>
              <TouchableOpacity onPress={() => saveAndGenarateBill()}>
                <View style={Styles.buttonContainersaveatForm}>
                  <Text style={CommonStylesheet.ButtonText}>Save and Generate Bill</Text>
          </View>
              </TouchableOpacity>
          </View>
          </Box>
        </View>
      </ScrollView>
    </View>
  )

};

export default TreatmentType;

const Styles = StyleSheet.create({
  ButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 50,

  },
  inputPlaceholder: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    borderColor: '#A6A6A6',
    backgroundColor: '#FFFFFF',
    height: hp('7%'),
    //opacity: 0.5,

    // borderRadius:10
  },
  buttonContainersaveatForm: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: 160,
    height: 40,
    backgroundColor: '#2196f3',
    borderColor: '#1c80cf',
    borderRadius: 5,
  },
  Text: {
    fontSize: 14,
    color: '#5f6067',
    fontFamily: 'Poppins-Regular',
    // lineHeight: Math.min(width, height) * 0.05, 
    textAlign: 'center'
  },
})