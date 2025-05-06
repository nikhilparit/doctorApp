import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { NativeBaseProvider, Box } from "native-base";
import { Provider } from 'react-redux';
import store from './store/store';
import Toast from 'react-native-toast-message';
import { toastConfig } from './components/CustomToast';

//importing navigations
import StackScreens from './navigation/Stack';
import MyDrawer from './navigation/Drawer';


function App() {
  return (
     <Provider store={store}>
      <NavigationContainer>
        <NativeBaseProvider>
          <StackScreens />
        </NativeBaseProvider>
        <Toast config={toastConfig} />
      </NavigationContainer>
     </Provider>
  );
}

export default App;
