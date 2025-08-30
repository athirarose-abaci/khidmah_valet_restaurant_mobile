import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { privateRoutes, publicRoutes } from './index';
import { useSelector } from 'react-redux';

enableScreens();

const Stack = createStackNavigator();

const MainRouter = () => {
  const authState = useSelector(state => state.authSlice.authState);

  return (
  <NavigationContainer>
    {authState.authenticated ? (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {publicRoutes.map((route, idx) => (
          <Stack.Screen key={idx} name={route.name} component={route.component} />
        ))}
      </Stack.Navigator>
    ) : (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {privateRoutes.map((route, idx) => (
          <Stack.Screen key={idx} name={route.name} component={route.component} />
        ))}
      </Stack.Navigator>
    )}
  </NavigationContainer>
  )
};

export default MainRouter;
