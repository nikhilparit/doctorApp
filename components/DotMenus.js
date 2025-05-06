import React from "react";
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { Button, Modal, VStack, HStack,  Radio, Center, NativeBaseProvider } from "native-base";
import { useState } from "react";

const DotMenus = () => {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
    return(
        <TouchableOpacity
        onPress={() => setShowModal(true)}>
        <Icon
          name="ellipsis-v"
          size={22}
          color={'#576067'}
          
          // style={{flexDirection: 'row', marginTop:-10,  }}
        />



<Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
            <Modal.Content maxWidth="300px" borderRadius="15px" >
                <Modal.CloseButton style={styles.CloseButton} />
                <Modal.Header style={styles.header}>Actions</Modal.Header>
                <Modal.Body>
                    <VStack space={2}>
                        
                        <TouchableOpacity onPress={() => viewProfile()}>
                                <HStack alignItems="center" style={{ alignItems: 'center',}} >
                                    <Text fontFamily="poppins-regular" >View Profile</Text>
                                </HStack>
                            </TouchableOpacity> <Divider/>

                            
                            <TouchableOpacity onPress={() => addAppointment()}>
                                <HStack alignItems="center" style={{ alignItems: 'center',marginTop:5}} >
                                    <Text fontFamily="poppins-regular">Add Appointment</Text>
                                </HStack>
                            </TouchableOpacity> <Divider/>
                           
                           
                            <TouchableOpacity onPress={() => openMissedConfirmation()} >
                                <HStack alignItems="center" alignContent="center" style={{ alignItems: 'center',marginTop:5}} >
                                    <Text  fontFamily="poppins-regular">Delete Patient</Text>
                                </HStack>
                            </TouchableOpacity> 


                        
                    </VStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>






<Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Actions</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <HStack alignItems="center"  >
                <Text fontWeight="medium">View Profile</Text>               
              </HStack>

              <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                <Text fontWeight="medium">Add Appointment</Text>              
              </HStack>

              <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                <Text fontWeight="medium">Request Consent Form</Text>               
              </HStack>

              <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                <Text fontWeight="medium">Call</Text>               
              </HStack>

              <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                <Text fontWeight="medium">Send SMS</Text>               
              </HStack>

              <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                <Text fontWeight="medium">Whatsapp Message</Text>               
              </HStack>

              <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                <Text fontWeight="medium">Send Covid-19 consent SMS/Whatsapp</Text>               
              </HStack>

              <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                <Text fontWeight="medium">Delete Patient</Text>               
              </HStack>

              <HStack alignItems="center" justifyContent="space-between" marginTop={3}>
                <Text fontWeight="medium">Add to contacts address book</Text>               
              </HStack>


            </VStack>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button flex="1" onPress={() => {
            setShowModal2(true);
          }}>
              Continue
            </Button>
          </Modal.Footer> */}
        </Modal.Content>
      </Modal>

      
      <Modal isOpen={showModal3} size="lg" onClose={() => setShowModal3(false)}>
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Payment Options</Modal.Header>
          <Modal.Body>
            <Radio.Group name="payment" size="sm">
              <VStack space={3}>
                <Radio alignItems="flex-start" _text={{
                mt: "-1",
                ml: "2",
                fontSize: "sm"
              }} value="payment1">
                  Cash on delivery
                </Radio>
                <Radio alignItems="flex-start" _text={{
                mt: "-1",
                ml: "2",
                fontSize: "sm"
              }} value="payment2">
                  Credit/ Debit/ ATM Card
                </Radio>
                <Radio alignItems="flex-start" _text={{
                mt: "-1",
                ml: "2",
                fontSize: "sm"
              }} value="payment3">
                  UPI
                </Radio>
              </VStack>
            </Radio.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button flex="1" onPress={() => {
            setShowModal(false);
            setShowModal2(false);
            setShowModal3(false);
          }}>
              Checkout
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>


      </TouchableOpacity>
    )
}
export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
          <DotMenus />
      </Center>
    </NativeBaseProvider>
  );
};





