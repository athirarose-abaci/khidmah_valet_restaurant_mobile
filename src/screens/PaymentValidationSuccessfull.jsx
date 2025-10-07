import { StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../constants/customStyles';
import CheckLottie from '../components/lottie/CheckLottie';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import DeliveryRequestModal from '../components/modals/DeliveryRequestModal';

const PaymentValidationSuccessfull = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { alreadyValidated, isVipVehicle } = route.params || {};
    const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
    const currentAuthState = useSelector(state => state.authSlice.authState);

    const [deliveryRequestModal, setDeliveryRequestModal] = useState(false);

    const handleConfirmDeliveryRequest = () => {
        setDeliveryRequestModal(true);
    }

  return (
    <View style={[styles.container, {backgroundColor: isDarkMode ? Colors.dark_bg : Colors.screen_bg}]}>
      <StatusBar 
        backgroundColor={isDarkMode ? Colors.black : Colors.screen_bg} 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <CheckLottie style={styles.lottie} />
        <Text style={[styles.title, {color: isDarkMode ? '#CCCCCC' : Colors.btn}]}>
          {alreadyValidated
            ? `Customer’s valet parking${'\n'}has already been validated successfully.`
            : isVipVehicle
            ? `This is a VIP vehicle and${'\n'} does not require validation for valet parking.`
            : `Customer’s valet parking payment${'\n'}was successfully validated.`}
        </Text>

        <View style={styles.buttonRow}>
          {currentAuthState?.entity?.is_allow_delivery_requests ? (
            <>
              {/* Back to Home */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Dashboard')}
              >
                <MaterialIcons name="home" size={20} color="white" />
                <Text style={styles.buttonText}>Back to Home</Text>
              </TouchableOpacity>

              {/* Delivery Request */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleConfirmDeliveryRequest}
              >
                <MaterialIcons name="local-shipping" size={20} color="white" />
                <Text style={styles.buttonText}>Delivery Request</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Only Back to Home (centered if delivery is not allowed)
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <MaterialIcons name="home" size={20} color="white" />
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <DeliveryRequestModal
        isVisible={deliveryRequestModal}
        onClose={() => setDeliveryRequestModal(false)}
        onConfirmed={() => {
          setDeliveryRequestModal(false);
          navigation.navigate('Dashboard');
        }}
      />
    </View>
  );
};

export default PaymentValidationSuccessfull;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  lottie: {
    width: '65%',
    height: '65%',
    alignSelf: 'center',
    marginBottom: -150,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    // color: '#313131',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',  
    marginTop: 45,
  }, 
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    width: 180,         
    marginHorizontal: 8, 
  }, 
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
});
