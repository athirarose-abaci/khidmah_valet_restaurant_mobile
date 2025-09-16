import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { scale } from 'react-native-size-matters';
import { Colors } from '../constants/customStyles';

const ProfileImagePicker = ({
  initialImage,
  onImageSelected,
  size = scale(100),
}) => {
  const [profileImage, setProfileImage] = useState(
    initialImage ? { uri: initialImage } : null
  );

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) return;
      if (response.error) {
        console.error('Error selecting image: ', response.error);
        return;
      }
      if (response.assets && response.assets[0]) {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);

        const imageType = response.assets[0].type || 'image/jpeg';
        const base64Data = `data:${imageType};base64,${response.assets[0].base64}`;
        onImageSelected(base64Data, response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileImageContainer}>
        <Image
          source={
            profileImage || require('../assets/images/no_image_avatar.png')
          }
          style={[
            styles.profileImage,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.editButton} onPress={selectImage}>
          <Image
            source={require('../assets/images/edit-outline.png')}
            style={{ width: 18, height: 18, tintColor: Colors.white }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 100,
  },
  profileImage: {
    elevation: 5,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default ProfileImagePicker;
