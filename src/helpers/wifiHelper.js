import WifiManager from 'react-native-wifi-reborn';
import { PermissionsAndroid, Platform } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';

export const fetchCurrentSSID = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return null;
    }
    //  else {
    //   const auth = await Geolocation.requestAuthorization('whenInUse');
    //   if (auth !== 'granted') return null;
    // }
    const ssid = await WifiManager.getCurrentWifiSSID();
    return ssid;
  } catch (err) {
    return null;
  }
};