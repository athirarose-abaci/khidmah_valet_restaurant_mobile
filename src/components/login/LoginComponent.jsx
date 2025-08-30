import { useContext, useState } from 'react';
import { ToastContext } from '../../context/ToastContext';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../apis/authentication';
import { setAuthState, setLoginCredentials } from '../../../store/authSlice';
import { storeData } from '../../helpers/asyncStorageHelper';
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import Error from '../../helpers/Error';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const LoginComponent = ({ setCurrentScreen }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toastContext = useContext(ToastContext);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setIsLoading(true);
    if (!userEmail || userEmail.length === 0) {
      toastContext.showToast( 'Please enter a valid email address', 'short', 'error', );
    } else if (password.length === 0) {
      toastContext.showToast('Please enter a valid password', 'short', 'error');
    } else {
      try {
        const userData = await userLogin(userEmail, password);
        console.log('userData', userData);
        if (userData?.password_reset_required) {
          const loginData = {
            username: userEmail,
            current_password: password,
            first_name: userData?.user?.first_name,
          };
          dispatch(setLoginCredentials(loginData));
          setCurrentScreen('resetPassword');
        } else {
          const authData = { ...userData?.user, authenticated: true };
          dispatch(setAuthState(authData));
          await storeData('data', JSON.stringify(authData));
          // dispatch(setSelectedParkingArea(loginData?.user?.parking_areas[0]))
          if (Platform.OS === 'ios') {
            CookieManager.get(BASE_URL)
              .then(cookie => {
                storeData('cookie', JSON.stringify(cookie));
              })
              .catch(err => {
                // Pass
                //Comment added for push
              });
          }
        }
      } catch (error) {
        console.log('catch error', error);
        setPassword(null);
        let err_msg = Error(error);
        toastContext.showToast(err_msg, 'short', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" 
      keyboardDismissMode='on-drag'
    >
      <Text style={styles.title}>Sign in</Text>
      <View style={styles.field_container}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.input_container}>
          <View style={styles.icon_container}>
            <Image
              source={require('../../assets/images/email.png')}
              style={styles.icon}
              tintColor={'#rgba(34, 185, 190,0.5)'}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="emailaddress@domain.com"
            placeholderTextColor={'#62808A'}
            value={userEmail}
            onChangeText={text => setUserEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      <View style={[styles.field_container, { marginTop: 5 }]}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.input_container}>
          <View style={styles.icon_container}>
            <Image
              source={require('../../assets/images/password.png')}
              style={styles.icon}
            />
          </View>
          <TextInput
            style={[styles.input, { width: '70%' }]}
            placeholder="**************"
            placeholderTextColor={'#62808A'}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={!showPassword}
          />
          <View style={styles.icon_container}>
            <Ionicons
              name={!showPassword?"eye-outline":"eye-off-outline"}
              size={20}
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
        // onPress={() => {
        //   setCurrentScreen('ResetPassword');
        // }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={styles.button_label}>Sign In</Text>
            <MaterialIcons
              name="login"
              color={'white'}
              size={23}
              style={{ marginLeft: 5 }}
            />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.field_container}
        onPress={() => setCurrentScreen('forgotPassword')}
      >
        <Text
          style={styles.forgot_password}
        >
          Forgot Password ?
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#114B5F',
    fontSize: 30,
    fontFamily: 'Poppins-Medium',
  },
  field_container: {
    width: '100%',
    paddingBottom: 10,
    marginTop: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
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
    fontFamily:'Poppins-Regular',
    fontSize:15,
    textAlign:'justify'
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
    fontSize: 16,
  },
  forgot_password: {
    alignSelf: 'center',
    color: '#7B7B7B',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
});

export default LoginComponent;
