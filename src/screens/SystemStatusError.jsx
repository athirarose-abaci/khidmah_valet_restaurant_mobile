import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, StatusBar} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AbaciLoader from '../components/AbaciLoader';
import {Colors} from '../constants/customStyles';
import {useDispatch, useSelector} from 'react-redux';
import {setAuthToggle} from '../../store/authSlice';
// import BackgroundImage from '../components/BackgroundImage'; 
// import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {checkSystemStatus} from '../apis/authentication';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import WarningLottie from '../components/lottie/WarningLottie';

const SystemStatusErrorScreen = () => {
  const dispatch = useDispatch();
  const authToggle = useSelector(state => state.authSlice.authToggle);
  const {width} = Dimensions.get('window');
//   const logoScale = useSharedValue(1);
  const [isRetrying, setIsRetrying] = useState(false);
  const animation=useRef(null)

  useEffect(()=>{
    if(animation.current){
      animation.current.play()
    }
    //to commit it
  },[])
  

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const {success, adminUsersExist} = await checkSystemStatus();
      
      if (success && adminUsersExist) {
        // If system is now available, trigger the auth toggle to show main app
        dispatch(setAuthToggle(!authToggle));
      } else {
        // If still error, just toggle to trigger a re-render without going through loading
        dispatch(setAuthToggle(!authToggle));
      }
    } catch (err) {
      // On error, still toggle to trigger re-render
      dispatch(setAuthToggle(!authToggle));
    } finally {
      setIsRetrying(false);
    }
  };

  return (
        // <BackgroundImage>
    //   <SafeAreaView style={styles.mainContainer}>
    //     <View style={styles.contentContainer}>
    //       {/* Logo Section */}
    //       <Animated.View style={[styles.logoContainer]}>
    //         <Image
    //           source={require('../assets/images/logoLight.png')}
    //           style={{width: width * 0.5, height: 110}}
    //           resizeMode="contain"
    //         />
    //       </Animated.View> 

    //       {/* Warning and Message Section */}
    //       <View style={styles.middleContainer}>
    //         <WarningLottie />
    //         <Text style={styles.messageText}>
    //           Please contact the System Administrator to initiate the system.
    //         </Text>
    //       </View>

    //       {/* Button Section */}
    //       <View style={styles.buttonContainer}>
    //         <View
    //           style={[styles.gradientButton, isRetrying && styles.disabledButton]}>
    //           <TouchableOpacity
    //             style={styles.buttonInner}
    //             onPress={handleRetry}
    //             disabled={isRetrying}>
    //             <MaterialIcons
    //               name="refresh"
    //               size={20}
    //               color="#FFFFFF"
    //               style={{marginRight: 2}}
    //             />
    //             <Text style={styles.buttonText}>
    //               Retry
    //             </Text>
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //     </View>
    //   </SafeAreaView>
      
    //   {/* AbaciLoader for retry operation */}
    //   <AbaciLoader visible={isRetrying} />
    // </BackgroundImage>
    <View style={styles.main_container}>
      {/* <BackgroundImage> */}
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.logo_container}>
        <Image
          source={require('../assets/images/logoLight.png')}
          style={styles.logo}
        />
      </View>
      {/* <View style={styles.form_container}> */}

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flex: 1, justifyContent: 'space-evenly'}}>
        <WarningLottie />
        <Text style={styles.messageText}>
          Please contact the System Administrator{'\n'}to initiate the system.
        </Text>

        <View style={styles.buttonContainer}>
          <View
            style={[
              styles.gradientButton,
              isRetrying && styles.disabledButton,
            ]}>
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={handleRetry}
              disabled={isRetrying}>
              <MaterialIcons
                name="refresh"
                size={20}
                color="#FFFFFF"
                style={{marginRight: 2}}
              />
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* </View> */}
      <AbaciLoader visible={isRetrying} />
      {/* </BackgroundImage> */}

    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 35,
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 10,
  },
  middleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    // color: Colors.khidmah_font_gray,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    // marginTop: 20,
  },
  buttonContainer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  gradientButton: {
    width: '60%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary, 
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginTop: 3,
  },
  main_container: {
    flex: 1,
    // backgroundColor: 'black',
    backgroundColor: Colors.primary, 
  },
  logo_container: {
    // width: 100,
    // height: '35%',
    // paddingBottom: 10,
    // paddingLeft: 30,
    // justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logo: { width: 200, height: 100, resizeMode: 'contain' },
  // form_container: { 
  //   width: '100%',
  //   height: '65%',
  //   backgroundColor: Colors.white,
  //   borderTopRightRadius: 50,
  //   borderTopLeftRadius: 50,
  //   padding: 30,
  // },
});

export default SystemStatusErrorScreen;