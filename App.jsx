import MainRouter from './routes/MainRouter';
import { ThemeProvider } from './src/context/ThemeContext';
import { useEffect, useState } from 'react';
import { Appearance, Platform, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDarkMode } from './store/themeSlice';
import AbaciToast from './src/components/AbaciToast';
import { checkSystemStatus, userProfile } from './src/apis/authentication';
import { removeData, storeData } from './src/helpers/asyncStorageHelper';
import { setAuthState } from './store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCookies } from './src/helpers/clearCookieHelper';
import SystemStatusErrorScreen from './src/screens/SystemStatusError';
import AbaciLoader from './src/components/AbaciLoader';

const App = () => {
  const [systemStatus, setSystemStatus] = useState('loading');
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const authToggle = useSelector(state => state.authSlice.authToggle);

  const fetchProfile = async () => {
    try {
      const response = await AsyncStorage.getItem('data');
      const data = response ? JSON.parse(response) : null;
  
      if (data !== null) {
        if (Platform.OS === 'ios') {
          const storedCookie = await AsyncStorage.getItem('cookie');
          if (storedCookie) {
            const cookie = JSON.parse(storedCookie);
            for (const [key, value] of Object.entries(cookie)) {
              await CookieManager.set(BASE_URL, {
                name: key,
                value: value.value,
                path: '/',
                secure: true,
                httpOnly: false,
              });
            }
          }
        }
  
        try {
          const profile = await userProfile();
          const isPermitted = true;
  
          if (!isPermitted) {
            await removeData('data');
            dispatch(setAuthState({}));
            setSystemStatus('success');
            return;
          }
  
          const authData = { ...profile, authenticated: isPermitted };
          dispatch(setAuthState(authData));
          await storeData('data', JSON.stringify(authData));
          setSystemStatus('success'); 
        } catch (err) {
          await AsyncStorage.removeItem('data');
          clearCookies();
          dispatch(setAuthState({}));
          setSystemStatus('success');
        }
      } else {
        setSystemStatus('success');
      }
    } catch (err) {
      setSystemStatus('success');
    }
  };
  
  const fetchSystemStatus = async () => {
    try {
      setSystemStatus('loading');
      const {success, adminUsersExist} = await checkSystemStatus();
      if(success && adminUsersExist){
        fetchProfile();
      }else{
        setSystemStatus('error');
      }
    } catch (error) {
      clearCookies();
      setSystemStatus('error');
    }
  };

    useEffect(() => {
    if (mounted) {
      fetchSystemStatus();
    }
  }, [mounted, authToggle]);

  useEffect(() => {
    setMounted(true);
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      dispatch(setIsDarkMode(colorScheme === 'dark'));
    });

    return () => subscription?.remove();
  }, []);

  return (
    <ThemeProvider>
      <View style={{flex: 1}}>
        {systemStatus === 'error' ? (
          <SystemStatusErrorScreen />
        ): systemStatus === 'success' ? (
          <MainRouter />
        ): (
          <AbaciLoader visible={true} />
        )}
        <AbaciToast />
      </View>
    </ThemeProvider>
  );

};

export default App;
