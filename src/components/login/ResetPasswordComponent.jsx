import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, } from 'react-native';
  import React, { useContext, useState } from 'react';
  import Ionicons from '@react-native-vector-icons/ionicons';
  import MaterialIcons from '@react-native-vector-icons/material-icons';
  import { useSelector } from 'react-redux';
  import AbaciLoader from '../AbaciLoader';
  import { ToastContext } from '../../context/ToastContext';
  import { resetPassword } from '../../apis/authentication';
  import Error from '../../helpers/Error';
  
  const ResetPasswordComponent = ({ setCurrentScreen }) => {
    const [newPassword, setNewPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const toastContext = useContext(ToastContext);
    const loginCredentials = useSelector(
      state => state.authSlice.loginCredentials,
    );
  
    const resetPasswordHandler = async () => {
      if (!newPassword || !confirmPassword) {
        toastContext.showToast('Please fill all fields', 'short', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        toastContext.showToast('Passwords do not match', 'short', 'error');
        return;
      }
  
      setIsLoading(true);
      try {
        await resetPassword(
          loginCredentials?.username,
          loginCredentials?.current_password,
          newPassword,
        );
        //   await removeData('loginCredentials');
        toastContext.showToast(
          'Password reset successful. Please login with your new password.',
          'short',
          'success',
        );
        setCurrentScreen('login');
      } catch (error) {
        console.log('error', error);
        let err_msg = Error(error);
        toastContext.showToast(err_msg, 'short', 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <AbaciLoader visible={isLoading} />
        <View style={styles.titleContainer}>
          <Text style={styles.greeting}>Hi, User </Text>
          <Text style={styles.title}>Let's lock things down</Text>
          <Text style={styles.subtitle}>Choose a new password</Text>
        </View>
        <View style={[styles.field_container, { marginTop: 20 }]}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.input_container}>
            <View style={styles.icon_container}>
              <Image
                source={require('../../assets/images/password.png')}
                style={styles.icon}
              />
            </View>
            <TextInput
              style={[styles.input, { width: '70%' }]}
              placeholder="********"
              placeholderTextColor={'#62808A'}
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              secureTextEntry={!showPassword}
            />
            <View style={styles.icon_container}>
              <Ionicons
                name="eye-outline"
                size={16}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              />
            </View>
          </View>
        </View>
        <View style={[styles.field_container, { marginTop: 5 }]}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.input_container}>
            <View style={styles.icon_container}>
              <Image
                source={require('../../assets/images/password.png')}
                style={styles.icon}
              />
            </View>
            <TextInput
              style={[styles.input, { width: '70%' }]}
              placeholder="********"
              placeholderTextColor={'#62808A'}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              secureTextEntry={!showPassword}
            />
            <View style={styles.icon_container}>
              <Ionicons
                name="eye-outline"
                size={16}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={resetPasswordHandler}
          disabled={isLoading}
          // onPress={() => {
          //   setCurrentScreen('login');
          // }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.button_label}>Reset</Text>
              <MaterialIcons
                name="login"
                color={'white'}
                size={23}
                style={{ marginLeft: 5 }}
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    titleContainer: {
      marginTop: 20,
      marginBottom: 10,
    },
    greeting: {
      fontSize: 26,
      color: '#114B5F',
      fontFamily: 'Poppins-SemiBold',
      textAlign: 'left',
    },
    title: {
      fontSize: 22,
      color: '#114B5F',
      fontFamily: 'Poppins-SemiBold',
      textAlign: 'left',
    },
    subtitle: {
      fontSize: 16,
      color: '#114B5F',
      fontFamily: 'Poppins-Regular',
      textAlign: 'left',
      marginTop: 0,
      lineHeight: 20,
    },
    field_container: {
      width: '100%',
      paddingBottom: 10,
      marginTop: 20,
    },
    label: {
      fontFamily: 'Poppins-Medium',
      fontSize: 12,
      color: '#5F687C',
    },
    input_container: {
      width: '100%',
      height: 55,
      backgroundColor: 'rgba(34, 185, 190,0.1)',
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
      borderWidth: 1,
      borderColor: '#DDE8EA',
    },
    icon_container: {
      width: '15%',
      height: '85%',
      borderRightWidth: 1,
      borderColor: '#DDE8EA',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    input: {
      width: '85%',
      height: '100%',
      paddingHorizontal: 10,
      paddingRight: 20,
      color: '#62808A',
    },
    button: {
      width: '70%',
      height: 55,
      backgroundColor: '#114B5F',
      borderRadius: 10,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 25,
    },
    button_label: {
      color: 'white',
      fontFamily: 'Poppins-Medium',
      fontSize: 14,
    },
  });
  
  export default ResetPasswordComponent;
  