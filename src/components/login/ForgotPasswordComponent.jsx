import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from "../../constants/customStyles";
import { useSelector } from "react-redux";
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useContext, useState } from 'react';
import { ToastContext } from "../../context/ToastContext";
import Error from "../../helpers/Error";
import { requestForgotPasswordOTP } from "../../apis/authentication";
import { storeData } from "../../helpers/asyncStorageHelper";
// import { useNavigation } from "@react-navigation/native";

const ForgotPasswordComponent = ({ setCurrentScreen }) => {
    const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
    const toastContext = useContext(ToastContext);
    // const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetOTP = async () => {
        if (!email || email.trim().length === 0) {
            toastContext.showToast('Please enter a valid email address', 'short', 'error');
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await requestForgotPasswordOTP(email);
            console.log(response, "response from forgotpasswordcomponent");
            console.log(email, 'email from forgotpasswordscreen')
            if(response?.status === 'success'){
                await storeData('username', email);
                toastContext.showToast('OTP sent to your email address', 'short', 'success');
                setCurrentScreen('verifyOTP');
            }
        } catch (error) {
            console.log('error from the forgot password comp', error)
            let err_msg = Error(error);
            console.log('error message from forgot password', err_msg)
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
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.textHeader}>
                <Text style={[styles.mainTitle, styles.mainTitleColor(isDarkMode)]}>
                    Oops, locked out?
                </Text>
                <Text style={[styles.subTitle, styles.subTitleColor(isDarkMode)]}>
                    Don't stress
                </Text>
                <Text style={[styles.subTitle, styles.subTitleColor(isDarkMode)]}>
                    We'll help you reset it!
                </Text>
            </View>

            {/* Email Input Field */}
            <View style={styles.field_container}>
                <Text style={[styles.label, styles.labelColor(isDarkMode)]}>
                    Email Address
                </Text>
                <View
                    style={[
                        styles.input_container,
                        styles.inputContainerStyle(isDarkMode),
                    ]}
                >
                    <View
                        style={[
                            styles.icon_container,
                            styles.iconContainerBorder(isDarkMode),
                        ]}
                    >
                        <Image
                            source={require('../../assets/images/email.png')}
                            style={styles.icon}
                            tintColor={'#rgba(34, 185, 190,0.5)'}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="emailaddress@domain.com"
                        placeholderTextColor={isDarkMode ? Colors.input_placeholder_dark : Colors.input_placeholder}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>

            {/* GET OTP Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleGetOTP}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Text style={[styles.button_label, styles.buttonLabelColor(isDarkMode)]}>
                            GET OTP!
                        </Text>
                    </>
                )}
            </TouchableOpacity>

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
    )
}

const styles = StyleSheet.create({
     kbAware: {
         flex: 1,
     },
     kbAwareContent: {
         flexGrow: 1,
        //  paddingBottom: 20,
     },
    container: {
        flex: 1,
        // paddingHorizontal: 20,
    },
    textHeader: {
        alignItems: 'flex-start',
        marginBottom: 40,
        marginTop: 20,
    },
    mainTitle: {
        fontSize: 22,
        fontFamily: 'Inter-Medium',
        marginBottom: 10,
        textAlign: 'left',
    },
    subTitle: {
        fontSize: 18,
        fontFamily: 'Inter-Regular',
        textAlign: 'left',
        marginBottom: 5,
        lineHeight: 22,
    },
    field_container: {
        width: '100%',
        paddingBottom: 10,
        // marginTop: 20,
    },
    label: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        marginBottom: 5,
    },
    input_container: {
        width: '100%',
        height: 55,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
    },
    icon_container: {
        width: '15%',
        height: '85%',
        borderRightWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    input: {
        width: '100%',
        height: 60,
        paddingHorizontal: 10,
        paddingRight: 20,
        color: '#62808A',
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        textAlign: 'justify',
    },
    button: {
        width: '70%',
        height: 55,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    button_label: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
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
    mainTitleColor: (isDarkMode) => ({
        color: isDarkMode ? Colors.white : Colors.primary,
    }),
    subTitleColor: (isDarkMode) => ({
        color: isDarkMode ? '#D3D3D3' : Colors.primary,
    }),
    labelColor: (isDarkMode) => ({
        color: isDarkMode ? '#D3D3D3' : Colors.primary,
    }),
    inputContainerStyle: (isDarkMode) => ({
        backgroundColor: isDarkMode ? Colors.input_bg_dark : Colors.input_bg,
        borderColor: isDarkMode ? Colors.input_border_dark : Colors.input_border,
    }),
    iconContainerBorder: (isDarkMode) => ({
        borderColor: isDarkMode ? 'rgba(230, 236, 237, 0.1)' : '#DDE8EA',
    }),
    buttonLabelColor: (isDarkMode) => ({
        color: isDarkMode ? '#F5F5F5' : Colors.white,
    }),
});

export default ForgotPasswordComponent;