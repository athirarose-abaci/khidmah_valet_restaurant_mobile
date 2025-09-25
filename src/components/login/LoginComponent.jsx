import { useContext, useState } from 'react';
import { ToastContext } from '../../context/ToastContext';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../apis/authentication';
import { setAuthState, setLoginCredentials } from '../../../store/authSlice';
import { storeData } from '../../helpers/asyncStorageHelper';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import Error from '../../helpers/Error';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { Colors } from '../../constants/customStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginComponent = ({ setCurrentScreen }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toastContext = useContext(ToastContext);
  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

  const handleLogin = async () => {
    if (!userEmail || userEmail.trim().length === 0) {
      toastContext.showToast('Please enter a valid email address', 'short', 'error');
      return;
    }

    if (!password || password.trim().length === 0) {
      toastContext.showToast('Please enter a valid password', 'short', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const userData = await userLogin(userEmail, password);
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
      }
    } catch (error) {
      let err_msg = Error(error);
      toastContext.showToast(err_msg, 'short', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.kbAware}
      contentContainerStyle={styles.kbAwareContent}
      enableOnAndroid={true}
      extraScrollHeight={0}     
      showsVerticalScrollIndicator={false} 
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, styles.titleColor(isDarkMode)]}>
        Sign in
      </Text>

      {/* Email Field */}
      <View style={styles.field_container}>
        <Text style={[styles.label, styles.labelColor(isDarkMode)]}>
          Email Address
        </Text>
        <View style={[ styles.input_container,styles.inputContainerColor(isDarkMode), ]} >
          <View
            style={[
              styles.icon_container,styles.iconContainerBorder(isDarkMode),
            ]}
          >
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

      {/* Password Field */}
      <View style={[styles.field_container, { marginTop: 5 }]}>
        <Text style={[styles.label, styles.labelColor(isDarkMode)]}>
          Password
        </Text>
        <View style={[ styles.input_container,styles.inputContainerColor(isDarkMode), ]} >
          <View
            style={[
              styles.icon_container,
              styles.iconContainerBorder(isDarkMode),
            ]}
          >
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
          <TouchableOpacity
            style={styles.eye_icon_container}
            onPress={() => { setShowPassword(!showPassword); }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={!showPassword ? 'eye-outline' : 'eye-off-outline'}
              color={styles.eyeIconColor(isDarkMode)}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text
              style={[
                styles.button_label,styles.buttonLabelColor(isDarkMode),
              ]}
            >
              Sign In
            </Text>
            <MaterialIcons
              name="login"
              color={isDarkMode ? '#F5F5F5' : Colors.white}
              size={23}
              style={{ marginLeft: 15 }}
            />
          </>
        )}
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity
        style={styles.fgp_container}
        onPress={() => setCurrentScreen('forgotPassword')}
      >
        <Text style={styles.forgot_password}>Forgot Password ?</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  kbAware: {
    flex: 1,
  },
  kbAwareContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Medium',
    paddingTop: 10,
    marginBottom: 10,
    color: Colors.primary,
  },
  titleColor: (isDarkMode) => ({
    color: isDarkMode ? Colors.white : Colors.primary,
  }),
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
  labelColor: (isDarkMode) => ({
    color: isDarkMode ? '#D3D3D3' : Colors.primary,
  }),
  input_container: {
    width: '100%',
    height: 55,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
  },
  inputContainerColor: (isDarkMode) => ({
    backgroundColor: isDarkMode ? Colors.input_bg_dark : Colors.input_bg,
    borderColor: isDarkMode ? Colors.input_border_dark : Colors.input_border,
  }),
  icon_container: {
    width: '15%',
    height: '85%',
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerBorder: (isDarkMode) => ({
    borderColor: isDarkMode ? 'rgba(230, 236, 237, 0.1)' : '#DDE8EA',
  }),
  eye_icon_container: {
    width: '12%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 22,
  },
  eyeIconColor: (isDarkMode) => ({
    color: isDarkMode ? '#D3D3D3' : Colors.black,
  }),
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
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    textAlign: 'justify',
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
  buttonLabelColor: (isDarkMode) => ({
    color: isDarkMode ? '#F5F5F5' : Colors.white,
  }),
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
