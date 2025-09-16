import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, StatusBar, } from 'react-native';
import React, { useState } from 'react';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Colors } from '../../constants/customStyles';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const ChangePasswordModal = ({ isVisible, onRequestClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

  const handleSave = () => {
    // Add your validation logic here
    console.log('Save password changes');
    // Clear form and close modal
    handleCancel();
  };

  const handleCancel = () => {
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onRequestClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
      statusBarTranslucent={true}>
      <View style={styles.modalOverlay}>
      <View style={[ styles.modalContent, { backgroundColor: isDarkMode ? Colors.container_dark_bg : Colors.white,},]} >          
      <Text style={[styles.title,{ color: isDarkMode ? Colors.white : Colors.font_primary },]}>Change Password</Text>
          <View style={styles.formContainer}>
            {/* Current Password */}
            <Text style={[styles.label,{ color: isDarkMode ? Colors.white : Colors.font_primary },]}>Current Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry={!showCurrentPassword}
                placeholderTextColor="#62808A"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons
                  name={showCurrentPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <Text style={[styles.label,{ color: isDarkMode ? Colors.white : Colors.font_primary },]}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
                placeholderTextColor="#62808A"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons
                  name={showNewPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm New Password */}
            <Text style={[styles.label,{ color: isDarkMode ? Colors.white : Colors.font_primary },]}>Confirm New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#62808A"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isDarkMode ? Colors.small_container_dark_bg : '#F5F5F5',
                borderWidth: isDarkMode ? 0 : 1,    
                borderColor: isDarkMode ? 'transparent' : '#E0E0E0',
              },
            ]}
            onPress={handleCancel}>
            <Text
              style={[
                styles.buttonText,
                { color: isDarkMode ? Colors.white : '#666666' },
              ]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}>
            <Text style={[styles.buttonText, styles.saveButtonText]}>
              Save
            </Text>
          </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.83,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 24,  
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    maxHeight: height * 0.85, 
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 28,
  },
  formContainer: {
    width: '100%',
    // marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    marginTop: 12,
    lineHeight: 22,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    lineHeight: 22,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '6%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: Colors.primary, 
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold', 
    fontWeight: '600',
    lineHeight: 22,
  },
  cancelButtonText: {
    color: '#666666',
  },
  saveButtonText: {
    color: 'white',
  },
});

export default ChangePasswordModal;