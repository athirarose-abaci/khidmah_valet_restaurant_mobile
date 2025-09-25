import { Image, StatusBar, StyleSheet, Text, View, Animated, PanResponder, InteractionManager, TouchableOpacity, ScrollView, } from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import { Colors } from '../constants/customStyles';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { parkingValidation } from '../apis/jobs';
import Error from '../helpers/Error';
import { ToastContext } from '../context/ToastContext';
import { setEntityValidationDetails } from '../../store/jobSlice';
import AbaciLoader from '../components/AbaciLoader';

const ValidatePayment = ({ route }) => {
  const { validationDetails, rfid } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
  const toastContext = useContext(ToastContext);

  const knobWidth = 68;
  const slideX = useRef(new Animated.Value(5)).current;

  const handleValidatePayment = async () => {
    setIsLoading(true);
    setValidated(true);
    try {
      const response = await parkingValidation(rfid);
      dispatch(setEntityValidationDetails(response.data));
      if (response.status === 201) {
        navigation.navigate('PaymentValidationSuccessfull', {
          validationDetails: response.data,
        });
      }
    } catch (error) {
      let err_msg = Error(error);
      toastContext.showToast(err_msg, 'long', 'error');

      Animated.timing(slideX, {
        toValue: 5,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } finally {
      setValidated(false);
      setIsLoading(false);
    }
  };

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
              handleValidatePayment();
            });
          } else {
            setValidated(false);
          }
        });
      },
    }),
  ).current;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark_bg : Colors.screen_bg },
      ]}
    >
      <StatusBar
        backgroundColor={isDarkMode ? Colors.dark_bg : Colors.screen_bg}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <AbaciLoader visible={isLoading} />
      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[ styles.title, { color: isDarkMode ? Colors.white : Colors.primary }, ]} >
          Validate Payment
        </Text>

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

        <View
          style={[
            styles.paymentDetailsContainer,
            {
              backgroundColor: isDarkMode
                ? Colors.container_dark_bg
                : Colors.white,
            },
          ]}
        >
          <Image
            source={
              isDarkMode
                ? require('../assets/images/logoLight.png')
                : require('../assets/images/logoDark.png')
            }
            style={styles.logo}
          />

          <Text style={[ styles.plateNoTitle, { color: isDarkMode ? Colors.white : Colors.primary }, ]} >
            Plate No.
          </Text>
          <Text style={[ styles.plateNoValue, { color: isDarkMode ? Colors.white : Colors.primary }, ]} >
            {validationDetails?.vehicle?.plate_number}
          </Text>

          <View
            style={[
              styles.paymentCard,
              {
                backgroundColor: isDarkMode
                  ? Colors.card_dark_bg
                  : Colors.white,
              },
            ]}
          >
            <Text style={[styles.entityName]}>
              <Text
                style={{
                  color: isDarkMode ? Colors.white : Colors.secondary,
                }}
              >
                {validationDetails?.entity?.name}
              </Text>
            </Text>
            <Text
              style={[
                styles.paymentCardTitle,
                { color: isDarkMode ? Colors.white : '#A0A0A0' },
              ]}
            >
              Payment Details
            </Text>

            {/* Service Charge */}
            <View style={styles.paymentRow}>
              <Text style={styles.paymentDetailsText}>Service Charge</Text>
              <Text
                style={[
                  styles.paymentDetailsValue,
                  { color: isDarkMode ? Colors.white : '#5C5C5C' },
                ]}
              >
                {validationDetails?.original_service_charge + ' AED'}
              </Text>
            </View>
            <View style={styles.divider} />

            {/* VAT */}
            <View style={styles.paymentRow}>
              <Text style={styles.paymentDetailsText}>{validationDetails?.tax_type}</Text>
              <Text
                style={[
                  styles.paymentDetailsValue,
                  { color: isDarkMode ? Colors.white : '#5C5C5C' },
                ]}
              >
                {validationDetails?.tax_amount + ' AED'}
              </Text>
            </View>
            <View style={styles.divider} />

            {/* Total Amount */}
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentDetailsText]}>Total Amount</Text>
              <Text
                style={[
                  styles.paymentDetailsValue,
                  { color: isDarkMode ? Colors.white : '#5C5C5C' },
                  styles.totalValue,
                ]}
              >
                {validationDetails?.total_amount + ' AED'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Slider at Bottom */}
      <TouchableOpacity
        style={[
          styles.sliderWrapper,
          {
            paddingBottom: insets.bottom || 10,
            backgroundColor: isDarkMode
              ? Colors.container_dark_bg
              : Colors.screen_bg,
          },
        ]}
      >
        <View
          style={[
            styles.sliderTrack,
            { backgroundColor: isDarkMode ? Colors.btn_dark : Colors.btn },
          ]}
          onLayout={e => {
            trackWidthRef.current = e.nativeEvent.layout.width;
          }}
        >
          {validated ? (
            <Text style={styles.validatedLabel}>Validated!!</Text>
          ) : (
            <View
              style={styles.sliderTrackLabelContainer}
              pointerEvents="none"
            >
              <Text style={styles.sliderTrackLabelRegular}>Slide to </Text>
              <Text style={styles.sliderTrackLabelBold}>
                Validate Payment
              </Text>
            </View>
          )}

          {/* Draggable knob */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.knob,
              {
                width: knobWidth,
                transform: [{ translateX: slideX }],
              },
            ]}
          >
            <MaterialIcons name="chevron-right" size={28} color={Colors.black} />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ValidatePayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
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
    borderRadius: 20,
    marginTop: 20,
    padding: 20,
    marginHorizontal: 30,
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
    alignSelf: 'center',
    marginTop: 30,
  },
  plateNoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    alignSelf: 'center',
  },
  paymentCard: {
    width: '100%',
    borderRadius: 10,
    marginTop: 20,
    paddingBottom: 20,
  },
  paymentCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    paddingHorizontal: 25,
    paddingBottom: 10,
  },
  entityName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    paddingBottom: 20,
    textAlign: 'center',
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
    bottom: 0,
    alignItems: 'center',
    paddingTop: 8,
  },
  sliderTrack: {
    width: '90%',
    height: 68,
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 7,
  },
  sliderTrackLabelContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 75,
  },
  sliderTrackLabelRegular: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: Colors.white,
  },
  sliderTrackLabelBold: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.white,
  },
  knob: {
    position: 'absolute',
    left: 2,
    height: 56,
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
    fontSize: 17,
    color: Colors.white,
    textAlign: 'center',
  },
});
