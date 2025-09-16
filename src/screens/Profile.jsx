import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Switch, StatusBar, ImageBackground } from 'react-native';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useContext, useEffect, useState } from 'react';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Colors } from '../constants/customStyles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import EditProfileModal from '../components/modals/EditProfileModal';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import ConfirmationModal from '../components/modals/ConfirmationModal'; 
import { useDispatch, useSelector } from 'react-redux';
import { setIsDarkMode } from '../../store/themeSlice';
import { logoutUser, userProfile } from '../apis/authentication';
import { setAuthState } from '../../store/authSlice';
import { removeData } from '../helpers/asyncStorageHelper';
import { clearCookies } from '../helpers/clearCookieHelper';
import { ToastContext } from '../context/ToastContext';
import Error from '../helpers/Error';

const Profile = ({}) => {
  const navigation = useNavigation();
  const [isLoading,setIsLoading] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isDarkMode = useSelector(state => state.themeSlice?.isDarkMode);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    profileData();
  }, [isFocused]);
  
  const profileData = async () => {
    setIsLoading(true);
    try {
      const response = await userProfile();
      console.log('profileData', response);
      setProfileInfo(response);
    } catch (error) {
      let err_msg = Error(error);
      toastContext.showToast(err_msg, 'short', 'error');
    }finally{
      setIsLoading(false);
    }
  }
  
  const handleLogout = async () => {
    setIsLogoutConfirmVisible(false);
    setIsLoading(true);
    try {
      await logoutUser();
      dispatch(setAuthState({}));
      clearCookies();
      await removeData('data');
      setIsLoading(false);
    } catch (error) {
      let err_msg = Error(error);
      toastContext.showToast(err_msg, 'short', 'error');
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/profile_background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor='transparent' barStyle="light-content" />
      
      <View style={styles.mainContainer}>
        {/* TOP secttion part */}
        <View style={styles.topSection}>
          <View style={styles.headerContainer}>
          <MaterialIcons
            name="chevron-left"
            size={35}
            color={Colors.back_arrow}
            style={styles.backButton}
            onPress={() => { navigation.goBack()}}
          />
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logoLight.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
          
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('../assets/images/no_image_avatar.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
            
            <Text style={styles.userName}>{profileInfo?.entity?.name}</Text>
        {/*             
            <View style={styles.driverIdContainer}>
              <Text style={styles.driverIdText}>Driver ID</Text>
            </View> */}
          </View>
        </View>

        {/* BOTTOM SECTION*/}
        <View style={[styles.bottomSection, {backgroundColor: isDarkMode ? Colors.dark_bg : Colors.white}]}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.settingItem, styles.firstSettingItem]}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../assets/images/dark-mode.png')}
                    style={styles.settingIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingText, {color: isDarkMode ? Colors.white : Colors.font_primary}]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                trackColor={{
                  false: 'rgba(71, 138, 170, 0.42)',
                  true: '#478AAA',
                }}
                thumbColor="#2B617B"
                ios_backgroundColor="#E4E4E4"
                onValueChange={() => dispatch(setIsDarkMode(!isDarkMode))}
                value={isDarkMode}
              />
            </View>

            <View style={styles.divider} />
            <View>
              <Text style={[styles.profileText,{color: isDarkMode ? '#4FB7C5' : Colors.black}]}>PROFILE</Text>
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={() => setIsEditModalVisible(true)}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../assets/images/profile.png')}
                    style={styles.settingIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingText, {color: isDarkMode ? Colors.white : Colors.font_primary}]}>
                  Edit Restaurant Details
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.icon_primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} 
              onPress={() => setIsChangePasswordModalVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../assets/images/password-icon.png')}
                    style={styles.settingIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingText, {color: isDarkMode ? Colors.white : Colors.font_primary}]}>
                  Change Password
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.icon_primary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.lastSettingItem]}
              onPress={() => setIsLogoutConfirmVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, styles.logoutIconContainer]}>
                  <AntDesign name="logout" size={22} color="#FF4141" />
                </View>
                <Text style={[styles.settingText, styles.logoutText, {color: isDarkMode ? Colors.white : Colors.font_primary}]}>
                  Logout
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C01928" />
            </TouchableOpacity>

            <View style={styles.versionContainer}>
              <Text style={[styles.versionText, {color: '#999999'}]}>
                {'v1.0.0'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
      <EditProfileModal
        isVisible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
        profileInfo={profileInfo}
        onProfileUpdate={updatedInfo => {
          setProfileInfo(updatedInfo);
          setIsEditModalVisible(false);
        }}
      />
      <ChangePasswordModal
        isVisible={isChangePasswordModalVisible}
        onRequestClose={() => setIsChangePasswordModalVisible(false)}
      />
      <ConfirmationModal
        isVisible={isLogoutConfirmVisible}
        onRequestClose={() => setIsLogoutConfirmVisible(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flex: 1,
  },
  backButton: {
    marginLeft: 10,
  },
  // TOP SECTION STYLES
  topSection: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  // BOTTOM SECTION STYLES  
  bottomSection: {
    flex: 1,
    borderTopLeftRadius: scale(40), 
    borderTopRightRadius: scale(40),
    marginTop: 10, 
    paddingHorizontal: 20,        
    paddingTop: 10, 
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: '85%',
    height: '100%',
    justifyContent: 'center',
  },
  logoImage: {
    width: '50%',
    height: '100%',
    borderRadius: 15,
    marginLeft: '15%',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 35,
    position: 'relative',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 100,
  },
  profileImage: {
    width: scale(100),         
    height: scale(100),
    borderRadius: scale(60),
    borderWidth: scale(4),
    borderColor: '#D9D9D9',
    elevation: 5,
  },
  userName: {
    fontSize: moderateScale(23),
    color: Colors.white,
    marginBottom: 50,            
    alignSelf: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  driverIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverIdText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: Colors.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    width: '100%',
    paddingHorizontal: 35,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#F0F9F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    fontSize: moderateScale(12), 
    marginLeft: 12,              
    fontFamily: 'Inter-Regular',
    lineHeight: moderateScale(18),
  },
  settingIcon: {
    width: 22,
    height: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#ABCEC8',
    marginVertical: 10,
    marginHorizontal: 35, 
  },
  profileText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 15,
    paddingHorizontal: 35,
  },
  logoutIconContainer: {
    backgroundColor: '#FFEFEF',
  },
  logoutText: {
    color: '#909090',
  },
  firstSettingItem: {
    marginTop: 15,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  versionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 35,
    marginTop: 50,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Segoe UI',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
  }
});

export default Profile;