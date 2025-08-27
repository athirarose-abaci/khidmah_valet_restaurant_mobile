import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { View, Text } from 'react-native';
import { publicRoutes } from './index';

enableScreens();

const Stack = createStackNavigator();

const MainRouter = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {publicRoutes.map((route, idx) => (
        <Stack.Screen key={idx} name={route.name} component={route.component} />
      ))}
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainRouter;
