import { StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../constants/customStyles';
import CheckLottie from '../components/CheckLottie';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ConfirmationModal from '../components/modals/ConfirmationModal';

const PaymentValidationSuccessfull = ({route}) => {
    const {parkingValidation} = route.params;
    console.log(parkingValidation,'validationDetails');
    const navigation = useNavigation();
    const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

    const [modalVisible, setModalVisible] = useState(false);

    const handleConfirmDeliveryRequest = () => {
        setModalVisible(false);
        navigation.navigate('DeliveryRequest');
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
          Customer's valet parking{'\n'}payment has been validated{'\n'}
          successfully.
        </Text>

        {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
            <MaterialIcons name="home" size={20} color="white" />
            <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity> */}
        <View style={styles.buttonRow}>
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
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="local-shipping" size={20} color="white" />
            <Text style={styles.buttonText}>Delivery Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ConfirmationModal
        isVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDeliveryRequest}
        title="Delivery Request"
        message="Do you want to raise a delivery request?"
        confirmText="Yes"
        cancelText="No"
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
