import {createContext, useCallback, useContext, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import {ToastContext} from './ToastContext';
import Geolocation from 'react-native-geolocation-service';

export const WifiContext = createContext();

export const WifiProvider = ({children}) => {
  const [currentSSID, setCurrentSSID] = useState(null);
  const toastContext = useContext(ToastContext);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs location permission to access Wi-Fi SSID',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    } else {
      try {
        const auth = await Geolocation.requestAuthorization('whenInUse'); // or 'always'
        return auth === 'granted';
      } catch (err) {
        return false;
      }
    }
    //   return true; // iOS automatically grants this
  };

  const fetchCurrentSSID = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      toastContext.showToast(
        'Please enable location permission',
        'short',
        'error',
      );
      return null;
    }

    try {
      const ssid = await WifiManager.getCurrentWifiSSID();
      setCurrentSSID(ssid);
      return ssid;
    } catch (error) {
      return null;
    }
  }, []);

  return (
    <WifiContext.Provider value={{currentSSID, fetchCurrentSSID}}>
      {children}
    </WifiContext.Provider>
  );
};
