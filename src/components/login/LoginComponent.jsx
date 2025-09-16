import { useContext, useState } from 'react';
import { ToastContext } from '../../context/ToastContext';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../apis/authentication';
import { setAuthState, setLoginCredentials } from '../../../store/authSlice';
import { storeData } from '../../helpers/asyncStorageHelper';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import Error from '../../helpers/Error';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { Colors } from '../../constants/customStyles';

const LoginComponent = ({ setCurrentScreen }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toastContext = useContext(ToastContext);
  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

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
              });
          }
        }
      } catch (error) {
        console.log('catch error', error);
        setPassword(null);
        let err_msg = Error(error);
        console.log('err_msg', err_msg);
        toastContext.showToast(err_msg, 'short', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
    <ScrollView style={{ flex: 1 }} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" 
      keyboardDismissMode='on-drag'
    >
      <Text style={[styles.title, {color: isDarkMode ? Colors.white : Colors.primary}]}>Sign in</Text>
      <View style={styles.field_container}>
        <Text style={[styles.label, {color: isDarkMode ? '#D3D3D3' : Colors.primary}]}>Email Address</Text>
        <View style={[
            styles.input_container, 
            {backgroundColor: isDarkMode ? Colors.input_bg_dark : Colors.input_bg,
            borderColor: isDarkMode ? Colors.input_border_dark : Colors.input_border
          }]}>
          <View style={[styles.icon_container, {borderColor: isDarkMode ? 'rgba(230, 236, 237, 0.1)' : '#DDE8EA'}]}>
            <Image
              source={require('../../assets/images/email.png')}
              style={styles.icon}
              tintColor={'#rgba(34, 185, 190,0.5)'}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="emailaddress@domain.com"
            placeholderTextColor={isDarkMode ? Colors.input_placeholder_dark : Colors.input_placeholder}
            value={userEmail}
            onChangeText={text => setUserEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      <View style={[styles.field_container, { marginTop: 5 }]}>
        <Text style={[styles.label, {color: isDarkMode ? '#D3D3D3' : Colors.primary}]}>Password</Text>
        <View style={[
            styles.input_container, 
            {backgroundColor: isDarkMode ? Colors.input_bg_dark : Colors.input_bg,
            borderColor: isDarkMode ? Colors.input_border_dark : Colors.input_border
          }]}>
          <View style={[styles.icon_container, {borderColor: isDarkMode ? 'rgba(230, 236, 237, 0.1)' : '#DDE8EA'}]}>
            <Image
              source={require('../../assets/images/password.png')}
              style={styles.icon}
              tintColor={'#rgba(34, 185, 190,0.5)'}
            />
          </View>
          <TextInput
            style={[styles.input, { width: '73%' }]}
            placeholder="**************"
            placeholderTextColor={isDarkMode ? Colors.input_placeholder_dark : Colors.input_placeholder}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={!showPassword}
          />
          <View style={[styles.eye_icon_container, {borderColor: isDarkMode ? 'rgba(230, 236, 237, 0.1)' : '#DDE8EA'}]}>
            <Ionicons
              name={!showPassword?"eye-outline":"eye-off-outline"}
              color={isDarkMode ? '#D3D3D3' : Colors.black}
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
            <Text style={[styles.button_label, {color: isDarkMode ? '#F5F5F5' : Colors.white}]}>Sign In</Text>
            <MaterialIcons
              name="login"
              color={isDarkMode ? '#F5F5F5' : Colors.white}
              size={23}
              style={{ marginLeft: 15 }}
            />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fgp_container}
        onPress={() => setCurrentScreen('forgotPassword')}
      >
        <Text
          style={styles.forgot_password}
        >
          Forgot Password ?
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Medium',
    paddingTop: 10,
    marginBottom: 10,
    color: Colors.primary,
  },
  field_container: {
    width: '100%',
    paddingBottom: 10,
    marginTop: 40,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginBottom: 5,
  },
  input_container: {
    width: '100%',
    height: 55,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
  },
  icon_container: {
    width: '15%',
    height: '85%',
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye_icon_container: {
    width: '12%', 
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 25,   
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
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 45,
  },
  button_label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  fgp_container: {
    marginTop: 15,
  },
  forgot_password: {
    alignSelf: 'center',
    color: '#7B7B7B',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
});

export default LoginComponent;
