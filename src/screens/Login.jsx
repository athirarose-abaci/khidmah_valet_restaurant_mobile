import { View, Image, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, BackHandler, } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackgroundImage from '../components/BackgroundImage';
import { Colors } from '../constants/customStyles';
import ResetPasswordComponent from '../components/login/ResetPasswordComponent';
import LoginComponent from '../components/login/LoginComponent';

const Login = () => {
  const [currentScreen, setCurrentScreen] = useState('login');

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (currentScreen === 'resetPassword') {
          setCurrentScreen('login');
          return true;
        }
        return false;
      }
    );
    return () => subscription.remove();
  }, [currentScreen]); // <-- include currentScreen here!

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor='transparent' barStyle="light-content" />
      <View style={styles.main_container}>
        <BackgroundImage>
          <View style={styles.logo_container}>
            <Image
              source={require('../assets/images/logoLight.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.form_container}>
            {currentScreen === 'login' ? (
              <LoginComponent
                key={'login'}
                setCurrentScreen={setCurrentScreen}
              />
            ) : (
              <ResetPasswordComponent
                key={'resetPassword'}
                setCurrentScreen={setCurrentScreen}
              />
            )}
          </View>
        </BackgroundImage>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  logo_container: {
    width: 100,
    height: '35%',
    paddingBottom: 10,
    paddingLeft: 30,
    justifyContent: 'flex-end',
  },
  logo: { width: 200, height: 100, resizeMode: 'contain' },
  form_container: {
    width: '100%',
    height: '65%',
    backgroundColor: Colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    padding: 30,
  },
});

export default Login;
