import LottieView from 'lottie-react-native';
import {View} from 'react-native';
import {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';

const WarningLottie = () => {
  const animation = useRef();
  useEffect(() => {
    animation.current.play();
  }, []);
  return (
    <View style={styles.lottie_container}>
      <LottieView
        style={{flex: 1}}
        ref={animation}
        source={require('../../assets/lottie/warning.json')}
      />
    </View>
  );
};

export default WarningLottie;

const styles = StyleSheet.create({
  lottie_container: {
    // position: 'absolute',
    // top: 50,
    width: '50%',
    height: '50%',
    alignSelf: 'center',
  },
});
