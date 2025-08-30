import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Switch, StatusBar, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Colors } from '../constants/customStyles';
import { useNavigation } from '@react-navigation/native';
import EditProfileModal from '../components/modals/EditProfileModal';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import ConfirmationModal from '../components/modals/ConfirmationModal'; 

const Profile = ({}) => {
  const [isLoading,setIsLoading]=useState(false)
  const navigation = useNavigation();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);
  const [profileInfo, setProfileInfo] = useState({first_name: 'Restaurant', last_name: 'Name', avatar: null});

//   const handleLogout = async () => {
//     setIsLogoutConfirmVisible(false);
//     setIsLoading(true);
//     try {
//       await logoutUser();
//       dispatch(setAuthState({}));
//       clearCookies();
//       await removeData('data');
//       setIsLoading(false);
//     } catch (error) {
//       let err_msg = Error(error);
//       toastContext.showToast(err_msg, 'short', 'error');
//     }finally{
//       setIsLoading(false);
//     }
//   };

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
            
            <Text style={styles.userName}>Restaurant Name</Text>
        {/*             
            <View style={styles.driverIdContainer}>
              <Text style={styles.driverIdText}>Driver ID</Text>
            </View> */}
          </View>
        </View>

        {/* BOTTOM SECTION*/}
        <View style={styles.bottomSection}>
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
                <Text style={[styles.settingText, {color: '#333333'}]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                trackColor={{
                  false: '#478AAA',
                  true: 'rgba(71, 138, 170, 0.42)',
                }}
                thumbColor="#2B617B"
                ios_backgroundColor="#E4E4E4"
                // onValueChange={onToggleDarkMode}
                // value={isDarkMode}
              />
            </View>

            <View style={styles.divider} />
            <View>
              <Text style={styles.profileText}>PROFILE</Text>
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
                <Text style={[styles.settingText, {color: '#333333'}]}>
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
                <Text style={[styles.settingText, {color: '#333333'}]}>
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
                <Text style={[styles.settingText, styles.logoutText]}>
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
        onProfileUpdate={(updated) => setProfileInfo(updated)}
      />
      <ChangePasswordModal
        isVisible={isChangePasswordModalVisible}
        onRequestClose={() => setIsChangePasswordModalVisible(false)}
      />
      <ConfirmationModal
        isVisible={isLogoutConfirmVisible}
        onRequestClose={() => setIsLogoutConfirmVisible(false)}
        onConfirm={() => {
        //   handleLogout();
        }}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flex: 1,
  },
  backButton: {
    marginTop: -30,
    marginLeft: 10,
  },
  // TOP SECTION STYLES
  topSection: {
    // backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 30,
  },
  // BOTTOM SECTION STYLES  
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
    marginTop: '10%',
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
    // borderWidth: 1,
    borderRadius: 100,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#D9D9D9',
    elevation: 5,
  },
  userName: {
    fontSize: 28,
    // fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 3,
    alignSelf: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  driverIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10, 
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
    fontSize: 14,
    marginLeft: 12,
    fontFamily: 'Segoe UI',
    lineHeight: 18,
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
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginTop: 15,
    paddingHorizontal: 35,
  },
  logoutIconContainer: {
    backgroundColor: '#FFEFEF',
  },
  logoutText: {
    color: '#FF4141',
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
    marginTop: 20,
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