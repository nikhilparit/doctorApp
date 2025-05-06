import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//screens-top navigation
import Passbook from './Passbook';
import Bills from './Bills';
import Payments from './Payments';

const Tab = createMaterialTopTabNavigator();

export default function TopRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: 'red' }, // Change the underline color here
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: 'white' },
      }}
    >
        <Tab.Screen name="Passbook" component={Passbook} />
        <Tab.Screen name="Bills" component={Bills} />
        <Tab.Screen name="Payments" component={Payments} />
      </Tab.Navigator>
  );
}
