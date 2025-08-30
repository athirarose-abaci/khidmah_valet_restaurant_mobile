import React, {useState, useEffect} from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, } from 'react-native';
import {Colors} from '../../constants/customStyles';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';


const {width, height} = Dimensions.get('window');

const EditProfileModal = ({ isVisible, onRequestClose, profileInfo = {}, onProfileUpdate, }) => {
  const [firstName, setFirstName] = useState(profileInfo.first_name || '');
  const [lastName, setLastName] = useState(profileInfo.last_name || '');
  const [profileImage, setProfileImage] = useState( profileInfo.avatar ? {uri: profileInfo.avatar} : null, );

  // Update form fields whenever the modal opens or profile info changes
  useEffect(() => {
    setFirstName(profileInfo.first_name || '');
    setLastName(profileInfo.last_name || '');
    setProfileImage(profileInfo.avatar ? {uri: profileInfo.avatar} : null); }, [profileInfo, isVisible]);

  const handleSave = () => {
    const updatedProfile = {
      ...profileInfo,
      first_name: firstName,
      last_name: lastName,
      avatar: profileImage?.uri,
    };

    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }

    onRequestClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent={false}
      presentationStyle="overFullScreen">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Profile</Text>

          {/* Avatar */}
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={ profileImage || require('../../assets/images/no_image_avatar.png') }
                style={styles.profileImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="create" size={18} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onRequestClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    maxHeight: height * 0.8,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    color: Colors.font_primary,
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 100,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 5,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: '#F9F9F9',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButtonText: {
    color: Colors.white,
  },
});

export default EditProfileModal;

