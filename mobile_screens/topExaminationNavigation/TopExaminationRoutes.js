import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//screens-top navigation
import Examination from '../patient/Examination/Examination';
import DentalChart from '../patient/Examination/DentalChart';

const Tab = createMaterialTopTabNavigator();
const myFontfamily = 'Poppins-Bold';
const myFontSize = 12;
export default function TopExaminationRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: 'red' }, // Change the underline color here
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: 'white' },
      }}
    >

      <Tab.Screen
        name="Examination"
        options={{
          headerTitleStyle: {
            fontFamily: myFontfamily,
            fontSize: myFontSize

          },

        }}

        component={Examination} />
      {/* <Tab.Screen name="DentalChart" component={DentalChart} />   */}
    </Tab.Navigator>
  );
}