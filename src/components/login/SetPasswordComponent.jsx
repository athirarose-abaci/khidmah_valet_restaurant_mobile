import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Colors } from '../../constants/customStyles';
import { useSelector } from 'react-redux';
import { ToastContext } from '../../context/ToastContext';
import { getData, removeData } from '../../helpers/asyncStorageHelper';
import { submitForgotPassword } from '../../apis/authentication';
import Error from '../../helpers/Error';
import Ionicons from '@react-native-vector-icons/ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const SetPasswordComponent = ({ setCurrentScreen }) => {
    const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
    const toastContext = useContext(ToastContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdatePassword = async () => {
        const username = await getData('username');
        if (!newPassword || !confirmPassword) {
            toastContext.showToast('Please fill in all fields', 'short', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            toastContext.showToast('Passwords do not match', 'short', 'error');
            return;
        }
        if (newPassword.length < 8) {
            toastContext.showToast('Password must be at least 8 characters', 'short', 'error');
            return;
        }
        if (!username) {
            toastContext.showToast('User information not found', 'short', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const otpCode = await getData('otp_code');
            const response = await submitForgotPassword(username, otpCode, newPassword);
            if (response.status === 'success') {
                toastContext.showToast('Password reset successfully', 'short', 'success');
                await removeData('otp_code');
                setCurrentScreen('login');
            } else {
                toastContext.showToast(response.message || 'Failed to reset password', 'short', 'error');
            }
        } catch (error) {
            const err_msg = Error(error);
            toastContext.showToast(err_msg, 'short', 'error');
        } finally {
            setIsLoading(false);
        }
    };

	return (
    <KeyboardAwareScrollView
        style={styles.kbAware}
        contentContainerStyle={styles.kbAwareContent}
        enableOnAndroid={true}
        extraScrollHeight={0}
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
    >    
        <View style={styles.formContainer}>
            <View style={styles.textHeader}>
                <Text style={[styles.mainTitle, { color: isDarkMode ? Colors.white : Colors.primary }]}>Set New Password</Text>
                <Text style={[styles.subTitle, { color: isDarkMode ? Colors.white : Colors.primary }]}>Please enter your new password</Text>
            </View>

            <View style={styles.field_container}>
                <Text style={[styles.label, styles.labelColor(isDarkMode)]}>New Password</Text>
                <View
                        style={[
                            styles.input_container,
                            styles.inputContainerColor(isDarkMode),
                        ]}
                >
                    <View
                        style={[
                            styles.icon_container,
                            styles.iconBorderColor(isDarkMode),
                        ]}
                    >
                        <Image
                            source={require('../../assets/images/password.png')}
                            style={styles.icon}
                            tintColor={'#rgba(34, 185, 190,0.5)'}
                        />
                    </View>
                    <TextInput
                        style={[styles.input, styles.inputWidth]}
                        placeholder="Enter new password"
                        placeholderTextColor={isDarkMode ? Colors.input_placeholder_dark : Colors.input_placeholder}
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                        style={styles.eye_icon_container}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={!showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                            color={isDarkMode ? '#D3D3D3' : Colors.black}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.field_container, styles.fieldContainerSpacing]}>
                <Text style={[styles.label, styles.labelColor(isDarkMode)]}>Confirm New Password</Text>
                <View
                        style={[
                            styles.input_container,
                            styles.inputContainerColor(isDarkMode),
                        ]}
                >
                    <View
                        style={[
                            styles.icon_container,
                            styles.iconBorderColor(isDarkMode),
                        ]}
                    >
                        <Image
                            source={require('../../assets/images/password.png')}
                            style={styles.icon}
                            tintColor={'#rgba(34, 185, 190,0.5)'}
                        />
                    </View>
                    <TextInput
                        style={[styles.input, styles.inputWidth]}
                        placeholder="Confirm new password"
                        placeholderTextColor={isDarkMode ? Colors.input_placeholder_dark : Colors.input_placeholder}
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.eye_icon_container}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={!showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                            color={isDarkMode ? '#D3D3D3' : Colors.black}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>

			<View style={styles.footerContainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={handleUpdatePassword} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.confirmButtonText}>UPDATE PASSWORD</Text>
                    )}
                </TouchableOpacity>
			</View>
            {/* Back to Login Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentScreen('login')}
            >
                <MaterialIcons
                    name="arrow-back"
                    color={isDarkMode ? '#F5F5F5' : Colors.primary}
                    size={24}
                />
                <Text style={[styles.backText, styles.backTextColor(isDarkMode)]}>
                    Back to Login
                </Text>
            </TouchableOpacity>
		</View>
    </KeyboardAwareScrollView>
	);
};

export default SetPasswordComponent;

const styles = StyleSheet.create({
    kbAware: {
        flex: 1,
    },
    kbAwareContent: {
        flexGrow: 1,
       //  paddingBottom: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
	textHeader: {
		alignSelf: 'flex-start',
		marginBottom: 30,
	},
	mainTitle: {
		fontSize: 22,
		fontFamily: 'Inter-Medium',
		marginBottom: 10,
		textAlign: 'left',
	},
	subTitle: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		textAlign: 'left',
		lineHeight: 20,
	},
    field_container: {
        width: '100%',
        paddingBottom: 10,
        marginTop: 20,
    },
    fieldContainerSpacing: {
        marginTop: 5,
    },
    label: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        marginBottom: 5,
    },
    labelColor: (isDarkMode) => ({
        color: isDarkMode ? '#D3D3D3' : Colors.primary,
    }),
    input_container: {
        width: '100%',
        height: 55,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
    },
    inputContainerColor: (isDarkMode) => ({
        backgroundColor: isDarkMode ? Colors.input_bg_dark : Colors.input_bg,
        borderColor: isDarkMode ? Colors.input_border_dark : Colors.input_border,
    }),
    icon_container: {
        width: '15%',
        height: '85%',
        borderRightWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBorderColor: (isDarkMode) => ({
        borderColor: isDarkMode ? 'rgba(230, 236, 237, 0.1)' : '#DDE8EA',
    }),
    eye_icon_container: {
        width: '12%',
        height: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 22,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    input: {
        height: '100%',
        paddingHorizontal: 10,
        paddingRight: 20,
        color: '#62808A',
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        textAlign: 'justify',
    },
    inputWidth: {
        width: '73%',
    },
	footerContainer: {
		width: '100%',
		alignItems: 'center',
		marginTop: 10,
	},
	confirmButton: {
		width: '70%',
		height: 55,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.primary,
	},
	confirmButtonText: {
		color: '#fff',
		fontSize: 16,
		fontFamily: 'Inter-Medium',
	},
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignSelf: 'center',
        marginTop: 65,
    },
    backText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        marginLeft: 5,
    },
    backTextColor: (isDarkMode) => ({
        color: isDarkMode ? '#F5F5F5' : Colors.primary,
    }),
});

