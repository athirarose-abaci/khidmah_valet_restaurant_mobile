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
  const dispatch = useDispatch();
  const authToggle = useSelector(state => state.authSlice.authToggle);
  const [systemStatus, setSystemStatus] = useState('loading');
  const [mounted, setMounted] = useState(false);


  const fetchProfile = async () => {
    AsyncStorage.getItem('data').then(async(response)=>{
      const data=JSON.parse(response)
      console.log(data,'data')
      if(data!==null){
        if(Platform.OS==='ios'){
        storedCookie=await AsyncStorage.getItem('cookie')
        if(storedCookie){
          const cookie=JSON.parse(storedCookie)
          for(const[key,value] of Object.entries(cookie)){
            await CookieManager.set(BASE_URL,{ name:key, value:value.value, path:'/', secure:true, httpOnly:false, })
          }
        }
      }
    try {
      const profile = await userProfile();
      console.log(profile,'profile')
      const isPermitted=true;
      const authData = { ...profile, authenticated: isPermitted };

      if (!isPermitted) {
        await removeData('data');
        dispatch(setAuthState({}));
        return;
      }

      dispatch(setAuthState(authData));
      await storeData('data', JSON.stringify(authData));
      setSystemStatus('success');
    } catch (err) {
      console.log('error------------------------------------------from app', err);
      AsyncStorage.removeItem('data')
      clearCookies();
      dispatch(setAuthState({}));
      setSystemStatus('success');
    }
  }})
  setSystemStatus('success');
  };

  const fetchSystemStatus = async () => {
    try {
      setSystemStatus('loading');
      const {success, adminUsersExist} = await checkSystemStatus();
      console.log(success, adminUsersExist,'success, adminUsersExist')
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
