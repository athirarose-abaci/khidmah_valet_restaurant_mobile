import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BackgroundImage from '../components/BackgroundImage';
import { Colors } from '../constants/customStyles';
import ResetPasswordComponent from '../components/login/ResetPasswordComponent';
import LoginComponent from '../components/login/LoginComponent';
import ForgotPasswordComponent from '../components/login/ForgotPasswordComponent';
import VerifyOTPComponent from '../components/login/VerifyOTPComponent';
import SetPasswordComponent from '../components/login/SetPasswordComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const Login = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (currentScreen === 'resetPassword' || currentScreen === 'forgotPassword' || currentScreen === 'verifyOTP' || currentScreen === 'setPassword') {
          setCurrentScreen('login');
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [currentScreen]); // <-- include currentScreen here!

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.main_container}>
        <BackgroundImage>
          <View style={styles.logo_container}>
            <Image
              source={require('../assets/images/logoLight.png')}
              style={styles.logo}
            />
          </View>

          <View style={[styles.form_container, {backgroundColor: isDarkMode ? Colors.dark_bg : Colors.white} ]}>
            {currentScreen === 'login' ? (
              <LoginComponent
                key={'login'}
                setCurrentScreen={setCurrentScreen}
              />
            ) : currentScreen === 'forgotPassword' ? (
              <ForgotPasswordComponent
                key={'forgotPassword'}
                setCurrentScreen={setCurrentScreen}
              />
            ) : currentScreen === 'verifyOTP' ? (
              <VerifyOTPComponent
                key={'verifyOTP'}
                setCurrentScreen={setCurrentScreen}
              />
            ) : currentScreen === 'setPassword' ? (
              <SetPasswordComponent
                key={'setPassword'}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
