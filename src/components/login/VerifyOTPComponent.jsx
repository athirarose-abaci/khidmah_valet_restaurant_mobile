import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState, useContext } from "react";
import { Colors } from "../../constants/customStyles";
import { useSelector } from "react-redux";
import { ToastContext } from "../../context/ToastContext";
import Error from "../../helpers/Error";
import { requestForgotPasswordOTP, verifyForgotPasswordOTP } from "../../apis/authentication";
import { getData, storeData } from "../../helpers/asyncStorageHelper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";import MaterialIcons from '@react-native-vector-icons/material-icons';


const OTP_LENGTH = 8;

const VerifyOTPComponent = ({ setCurrentScreen }) => {
	const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
	const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
	const inputRefs = useMemo(() => Array.from({ length: OTP_LENGTH }, () => React.createRef()), []);
    const toastContext = useContext(ToastContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [isResendLoading, setIsResendLoading] = useState(false);

	const handleChangeDigit = (text, index) => {
		const sanitized = text.replace(/\D/g, "").slice(0, 1);
		const nextDigits = [...otpDigits];
		nextDigits[index] = sanitized;
		setOtpDigits(nextDigits);
		if (sanitized && index < OTP_LENGTH - 1) {
			inputRefs[index + 1]?.current?.focus();
		}
	};

	const handleKeyPress = (e, index) => {
		if (e.nativeEvent.key === "Backspace" && !otpDigits[index] && index > 0) {
			inputRefs[index - 1]?.current?.focus();
		}
	};

	const composedOtp = otpDigits.join("");
	const isConfirmEnabled = composedOtp.length === OTP_LENGTH && /^\d{8}$/.test(composedOtp);

	const handleConfirm = async () => {
		if (composedOtp.length !== OTP_LENGTH) {
			toastContext.showToast('Please enter all 8 digits', 'short', 'error');
			return;
		}

		const username = await getData('username');
		if (!username) {
			toastContext.showToast('User information not found', 'short', 'error');
			return;
		}

		setIsConfirmLoading(true);
		try {
			const response = await verifyForgotPasswordOTP(composedOtp, username);
            console.log(response, "from resend otp");
			if (response.status === 'success') {
				toastContext.showToast('OTP verified successfully', 'short', 'success');
				await storeData('otp_code', composedOtp);
				setCurrentScreen('setPassword');
			} else {
				toastContext.showToast(response.message || 'Invalid OTP', 'short', 'error');
			}
		} catch (error) {
            console.log(error, "from resend otp")
			const err_msg = Error(error);
            console.log(err_msg, "from resend otp")
			toastContext.showToast(err_msg, 'short', 'error');
		} finally {
			setIsConfirmLoading(false);
		}
	};

	const handleResend = async () => {
        const username = await getData('username');
        if (!username) {
			toastContext.showToast('User information not found', 'short', 'error');
			return;
		}

        setIsResendLoading(true);
        try {
            const response = await requestForgotPasswordOTP(username);
            if(response.status === 'success') {
                toastContext.showToast('OTP resend to your email address successfully', 'short', 'success');
				await storeData('otp_code', composedOtp);
            }
        } catch (error) {
            let err_msg = Error(error);
            toastContext.showToast(err_msg, 'short', 'error');
        } finally {
            setIsResendLoading(false);
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
				<Text style={[styles.mainTitle, { color: isDarkMode ? Colors.white : Colors.primary }]}>Enter OTP</Text>
				<Text style={[styles.subTitle, { color: isDarkMode ? Colors.white : Colors.primary }]}>Please enter the 8-digit code sent to your email address</Text>
			</View>

			<View style={styles.otpContainer}>
				{Array.from({ length: OTP_LENGTH }).map((_, index) => (
					<TextInput
						key={index}
						ref={inputRefs[index]}
						style={[
							styles.otpInput,
							{
								borderColor: isDarkMode ? Colors.input_border_dark : Colors.input_border,
								backgroundColor: isDarkMode ? Colors.input_bg_dark : Colors.input_bg,
								color: isDarkMode ? Colors.white : Colors.primary,
							},
						]}
						maxLength={1}
						keyboardType="number-pad"
						value={otpDigits[index]}
						onChangeText={(t) => handleChangeDigit(t, index)}
						onKeyPress={(e) => handleKeyPress(e, index)}
						returnKeyType={index === OTP_LENGTH - 1 ? 'done' : 'next'}
					/>
				))}
			</View>

			<View style={styles.footerContainer}>
				<TouchableOpacity
					style={[styles.confirmButton, isConfirmEnabled ? styles.confirmButtonActive : styles.confirmButtonDisabled]}
					onPress={handleConfirm}
					disabled={!isConfirmEnabled || isConfirmLoading}
				>
					{isConfirmLoading ? (
						<ActivityIndicator size="small" color="#fff" />
					) : (
						<Text style={styles.confirmButtonText}>CONFIRM</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity style={styles.resendContainer} onPress={handleResend} disabled={isResendLoading}>
					<Text style={[
                        styles.resendText,
                        isResendLoading && styles.resendTextDisabled,
                      ]}>
						Didn’t receive the code? <Text style={[
                          styles.resendLink,
                          isResendLoading && styles.resendLinkDisabled,
                        ]}>Resend OTP</Text>
					</Text>
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

export default VerifyOTPComponent;

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
		// paddingHorizontal: 10,
	},
	textHeader: {
		alignSelf: 'flex-start',
		marginTop: -10,
		marginBottom: 40,
	},
	mainTitle: {
		fontSize: 22,
		fontFamily: 'Inter-Medium',
		marginBottom: 15,
		textAlign: 'left',
	},
	subTitle: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		textAlign: 'left',
		lineHeight: 20,
	},
	otpContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 30,
	},
	otpInput: {
		width: 38,
		height: 48,
		borderWidth: 1,
		borderRadius: 8,
		textAlign: 'center',
		fontSize: 18,
		fontFamily: 'Inter-Medium',
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
		opacity: 0.6,
	},
	confirmButtonActive: {
		opacity: 1,
	},
	confirmButtonDisabled: {
		opacity: 0.6,
	},
	confirmButtonText: {
		color: '#fff',
		fontSize: 16,
		fontFamily: 'Inter-Medium',
	},
	resendContainer: {
		marginTop: 15,
	},
	resendText: {
		fontSize: 13,
		color: '#7B7B7B',
		fontFamily: 'Inter-Regular',
	},
    resendTextDisabled: {
        opacity: 0.5,
    },
    resendLinkDisabled: {
    opacity: 0.5,
    },
	resendLink: {
		color: Colors.primary,
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
