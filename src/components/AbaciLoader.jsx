import {View, Modal, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {BlurView} from '@react-native-community/blur';
import LottieView from 'lottie-react-native';
import { Loader, Colors } from '../constants/customStyles';

const AbaciLoader = props => {
  const animation = useRef();
//   const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

  useEffect(() => {
    // animation?.current?.play();
    if (props.visible) {
      animation?.current?.play();
    } else {
      animation?.current?.reset();
    }
  }, [props.visible]);

  return (
    <Modal transparent={true} visible={props.visible}>
      <StatusBar 
        backgroundColor={Colors.black} 
        barStyle={"light-content"} 
      />
      <BlurView
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor={Colors.white}
      />
      <View style={styles.lottie_container}>
        <LottieView
          style={{flex: 1}}
          source={Loader}
          ref={animation}
          autoPlay={props.visible}
          loop={props.visible}
        />
      </View>
    </Modal>
  );
};

export default AbaciLoader;

const styles = StyleSheet.create({
  lottie_container: {
    flex: 2,
    width: '50%',
    alignSelf: 'center',
    margin: '15%',
  },
});
