import React, {useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, } from 'react-native';
import {Colors} from '../../constants/customStyles';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useSelector } from 'react-redux';
import ProfileImagePicker from '../ProfileImagePicker';


const {width, height} = Dimensions.get('window');

const EditProfileModal = ({ isVisible, onRequestClose, profileInfo, onProfileUpdate, }) => {
  const [entityName, setEntityName] = useState(profileInfo?.entity?.name || '');
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isDarkMode = useSelector(state => state.themeSlice?.isDarkMode);

  console.log('profileInfo', profileInfo);

  useEffect(() => {
    if(profileInfo){
      setEntityName(profileInfo?.entity?.name || '');
      if(profileInfo?.avatar){
        setProfileImage({uri: profileInfo?.avatar});
      }else{
        setProfileImage(null);
      }
    }
  }, [profileInfo, isVisible]);

  const handleSave = () => {
    const updatedProfile = {
      ...profileInfo,
      entity_name: entityName,
      avatar: profileImage?.uri,
    };
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent={false}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDarkMode
                ? Colors.container_dark_bg
                : Colors.white,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? Colors.white : Colors.font_primary },
            ]}
          >
            Edit Restaurant Details
          </Text>

          {/* Avatar */}
          <View style={styles.profileContainer}>
            {/* <View style={styles.profileImageContainer}>
              <Image
                source={
                  profileImage ||
                  require('../../assets/images/no_image_avatar.png')
                }
                style={styles.profileImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="create" size={18} color={Colors.white} />
              </TouchableOpacity>
            </View> */}
            <ProfileImagePicker
              initialImage={profileInfo?.entity?.avatar}
              onImageSelected={(base64, uri) => {
                console.log('Picked image:', uri);
              }}
            />

          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text
              style={[
                styles.label,
                { color: isDarkMode ? Colors.white : Colors.font_primary },
              ]}
            >
              Restaurant Name
            </Text>
            <TextInput
              style={styles.input}
              value={entityName}
              onChangeText={setEntityName}
            />

            {/* <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            /> */}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isDarkMode
                  ? Colors.small_container_dark_bg
                  : '#F9F9F9',
                borderWidth: isDarkMode ? 0 : 1,   
                borderColor: isDarkMode ? 'transparent' : '#BDBDBD',
              },
            ]}
            onPress={onRequestClose}
          >
            <Text
              style={[
                styles.buttonText,
                { color: isDarkMode ? Colors.white : Colors.font_primary },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
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
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
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
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
    fontFamily: 'Inter-Regular',
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
  saveButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  saveButtonText: {
    color: Colors.white,
  },
});

export default EditProfileModal;

