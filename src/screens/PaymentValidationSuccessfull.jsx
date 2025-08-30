import { StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../constants/customStyles';
import CheckLottie from '../components/CheckLottie';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';

const PaymentValidationSuccessfull = () => {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.screen_bg} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <CheckLottie style={styles.lottie} />
        <Text style={styles.title}>
          Customer's valet parking{'\n'}payment has been validated{'\n'}
          successfully.
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
            <MaterialIcons name="home" size={20} color="white" />
            <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PaymentValidationSuccessfull;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screen_bg,
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
    color: '#313131',
    textAlign: 'center',
  },
  backButton: {
    width: '40%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 80,
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    gap: 4,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    textAlign: 'center',
  },
});
