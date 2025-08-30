import { Image, StatusBar, StyleSheet, Text, View, Animated, PanResponder, InteractionManager } from 'react-native';
import React, { useRef, useState } from 'react';
import { Colors } from '../constants/customStyles';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';

// row component
const PaymentRow = ({ label, value, isTotal }) => (
  <View style={styles.paymentRow}>
    <Text style={[styles.paymentDetailsText, isTotal && styles.totalText]}>
      {label}
    </Text>
    <Text style={[styles.paymentDetailsValue, isTotal && styles.totalValue]}>
      {value}
    </Text>
  </View>
);

const ValidatePayment = () => {
  const navigation = useNavigation();
  const knobWidth = 80;
  const slideX = useRef(new Animated.Value(5)).current; 
  const [validated, setValidated] = useState(false);

  // keep track width dynamically for responsive devices
  const trackWidthRef = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        slideX.stopAnimation();
      },
      onPanResponderMove: (_, gesture) => {
        const maxSlide = Math.max(0, trackWidthRef.current - knobWidth);
        const newX = Math.min(Math.max(0, gesture.dx * 0.7), maxSlide);
        slideX.setValue(newX);
      },
      onPanResponderRelease: (_, gesture) => {
        const maxSlide = Math.max(0, trackWidthRef.current - knobWidth);
        const successful = gesture.dx > maxSlide * 0.8;
        Animated.timing(slideX, {
          toValue: successful ? maxSlide : 5,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          if (successful) {
            setValidated(true);
            InteractionManager.runAfterInteractions(() => {
              setTimeout(() => {
                navigation.replace('PaymentValidationSuccessfull');
              }, 500);
            });
          } else {
            setValidated(false);
          }
        });
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.screen_bg} barStyle="dark-content" />

      <Text style={styles.title}>Validate Payment</Text>

      <MaterialIcons
        name="chevron-left"
        size={35}
        color={Colors.back_arrow}
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />

      <Text style={styles.headerText}>
        Please confirm the vehicle details{'\n'}and payment amount{'\n'}before
        validating.
      </Text>

      <View style={styles.paymentDetailsContainer}>
        <Image
          source={require('../assets/images/logoDark.png')}
          style={styles.logo}
        />

        <Text style={styles.plateNoTitle}>Plate No.</Text>
        <Text style={styles.plateNoValue}>A 31052</Text>

        <View style={styles.paymentCard}>
          <Text style={styles.paymentCardTitle}>Payment Details</Text>

          <PaymentRow label="Valet Charge" value="12.00 AED" />
          <View style={styles.divider} />
          <PaymentRow label="VAT" value="5.00 AED" />
          <View style={styles.divider} />
          <PaymentRow label="Total Amount" value="17.00 AED" isTotal />
        </View>
      </View>

      {/* Slide to Validate */}
      <View style={styles.sliderWrapper}>
        <View
          style={styles.sliderTrack}
          onLayout={e => { trackWidthRef.current = e.nativeEvent.layout.width }}
        >
          {validated ? (
            <Text style={styles.validatedLabel}>Validated!!</Text>
          ) : (
            <View style={styles.sliderTrackLabelContainer} pointerEvents="none">
              <Text style={styles.sliderTrackLabelRegular}>Slide to </Text>
              <Text style={styles.sliderTrackLabelBold}>Validate Payment</Text>
            </View>
          )}

          {/* Draggable knob */}
          <Animated.View {...panResponder.panHandlers}
            style={[ styles.knob, {
                transform: [{ translateX: slideX }], },]}
          >
            <MaterialIcons name="chevron-right" size={28} color={Colors.black } />
          </Animated.View>
        </View>
      </View>


    </View>
  );
};

export default ValidatePayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screen_bg,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginTop: -30,
    marginLeft: 20,
  },
  headerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8D8D8D',
    textAlign: 'center',
    marginVertical: 30,
  },
  paymentDetailsContainer: {
    height: '55%',
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginTop: 25,
    padding: 25,
    marginHorizontal: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  plateNoTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.primary,
    alignSelf: 'center',
    marginTop: 40,
  },
  plateNoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    color: Colors.primary,
    alignSelf: 'center',
  },
  paymentCard: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  paymentCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#5C5C5C',
    padding: 25,
    paddingBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  paymentDetailsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#A0A0A0',
  },
  paymentDetailsValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#5C5C5C',
  },
//   totalText: {
//     color: Colors.primary,
//   },
  totalValue: {
    color: '#03C5B7',
    fontSize: 18,
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#E0E0E0',
    marginHorizontal: 25,
  },
  /** Slider styles */
  sliderWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 25,
    alignItems: 'center',
  },
  sliderTrack: {
    width: '90%',
    height: 80,
    backgroundColor: '#313131',
    borderRadius: 25,
    justifyContent: 'center',
  },
  sliderTrackLabelContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 75,
  },
  sliderTrackLabelRegular: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: Colors.white,
  },
  sliderTrackLabelBold: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.white,
  },
  knob: {
    position: 'absolute',
    left: 3,
    width: 90,
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  validatedLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
  },
});
