import { Image, StatusBar, StyleSheet, Text, View, ScrollView, } from 'react-native';
import moment from 'moment';
  import React, { useContext, useEffect, useState } from 'react';
  import { Colors } from '../constants/customStyles';
  import { MaterialIcons } from '@react-native-vector-icons/material-icons';
  import { SafeAreaView, } from 'react-native-safe-area-context';
  import { useNavigation, useRoute } from '@react-navigation/native';
  import Error from '../helpers/Error';
  import { ToastContext } from '../context/ToastContext';
  import { transactionHistoryDetails } from '../apis/entities';
  import { useSelector } from 'react-redux';
  import AbaciLoader from '../components/AbaciLoader';
  import NoDataLottie from '../components/lottie/NoDataLottie';

const PaymentHistoryDetails = () => {
    const navigation = useNavigation();
    const { params } = useRoute();
    const { txnId } = params;
    const toastContext = useContext(ToastContext);
    const [transaction, setTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
  
    useEffect(() => {
      fetchDetails();
    }, [txnId]);
  
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await transactionHistoryDetails(txnId);
        setTransaction(response);
      } catch (error) {
        let err_msg = Error(error);
        toastContext.showToast(err_msg, 'short', 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    const refreshControl = () => {
      fetchDetails();
    };
  
    const modifiedTime = transaction?.created_at ? moment(transaction?.created_at).format('DD.MM.YYYY hh.mm A') : '';
  
  return (
      <SafeAreaView style={[ styles.container, styles.containerDark(isDarkMode), ]} >
        <StatusBar
          backgroundColor={isDarkMode ? Colors.dark_bg : Colors.screen_bg}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
  
        {isLoading ? (
          <AbaciLoader visible={true} />
        ) : (
          <View style={{ flex: 1 }}>
            {/* Title and overlay back button */}
            <Text style={[ styles.title, styles.titleDark(isDarkMode), ]} >
              Transaction Details
            </Text>
            <MaterialIcons
              name="chevron-left"
              size={35}
              color={Colors.back_arrow}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            />
  
            {!transaction ? (
              <View style={styles.noDataContainer}>
                <NoDataLottie isDarkMode={isDarkMode} refreshControl={refreshControl} />
    </View>
            ) : (
              <ScrollView
                contentContainerStyle={[styles.scrollContent, {flexGrow:1, justifyContent:'center'}]}
                showsVerticalScrollIndicator={false}
              >
                <View style={[ styles.paymentDetailsContainer, styles.paymentDetailsContainerDark(isDarkMode),]} >
                  <Image
                    source={
                      isDarkMode
                        ? require('../assets/images/logoLight.png')
                        : require('../assets/images/logoDark.png')
                    }
                    style={styles.logo}
                  />
  
                  <Text style={[ styles.plateNoTitle, styles.titleDark(isDarkMode), ]} >
                    Plate Number
                  </Text>
                  <Text style={[ styles.plateNoValue, styles.titleDark(isDarkMode), ]} >
                    {transaction?.vehicle?.plate_number}
                  </Text>
  
                    <Text style={[ styles.entityName, styles.titleDark(isDarkMode), ]} >
                      {transaction?.entity?.name}
                    </Text>
                  <View style={[ styles.paymentCard, styles.paymentCardDark(isDarkMode), ]} >
                    <Text style={[ styles.paymentCardTitle, styles.paymentCardTitleDark(isDarkMode), ]} >
                      Payment Details
                    </Text>
  
                    {/* Service Charge row */}
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentDetailsText}>Service Charge</Text>
                      <Text style={[ styles.paymentDetailsValue, styles.paymentDetailsValueDark(isDarkMode), ]} >
                        {`${transaction?.original_service_charge} AED`}
                      </Text>
                    </View>
  
                    <View style={styles.divider} />
  
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentDetailsText}>{transaction?.tax_type?.name}</Text>
                      <Text style={[ styles.paymentDetailsValue,styles.paymentDetailsValueDark(isDarkMode), ]} >
                        {`${transaction?.tax_amount} AED`}
                      </Text>
                    </View>
  
                    <View style={styles.divider} />
  
                    {/* Total Amount row */}
                    <View style={styles.paymentRow}>
                      <Text style={[styles.paymentDetailsText, styles.totalValue]}>
                        Total Amount
                      </Text>
                      <Text style={[ styles.paymentDetailsValue, styles.totalValue, ]} >
                        {`${transaction?.rate} AED`}
                      </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Modified By row */}
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentDetailsText}>Validated By</Text>
                      <View style={{alignItems:'flex-end'}}>
                        <Text
                          style={[
                            styles.paymentDetailsValue,
                            styles.paymentDetailsValueDark(isDarkMode),
                          ]}
                        >
                          {transaction?.modified_by?.full_name ?? '-'}
                        </Text>
                        {modifiedTime !== '' && (
                          <Text style={styles.modifiedTime}>{modifiedTime}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  };
  
  export default PaymentHistoryDetails;
  
  const styles = StyleSheet.create({
    container: { flex: 1 },
    containerDark: (isDarkMode) => ({ 
      backgroundColor: isDarkMode ? Colors.dark_bg : Colors.screen_bg 
    }),
    backButton: {
      marginTop: -30,
      marginLeft: 20,
    },
    title: {
      fontFamily: 'Inter-Medium',
      fontSize: 20,
      textAlign: 'center',
      marginTop: 20,
    },
    titleDark: (isDarkMode) => ({ 
        color: isDarkMode ? Colors.white : Colors.primary 
    }),
    noDataContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center', 
    },
    scrollContent: { 
      paddingBottom: 60 
    },
    paymentDetailsContainer: {
      borderRadius: 20,
      marginTop: 20,
      padding: 20,
      marginHorizontal: 30,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { 
        width: 0, 
        height: 4 
        },
      elevation: 1,
    },
    paymentDetailsContainerDark: (isDarkMode) => ({ 
      backgroundColor: isDarkMode ? Colors.container_dark_bg : Colors.white 
    }),
    logo: {
      width: 200,
      height: 100,
      resizeMode: 'contain',
      alignSelf: 'center',
      },
    plateNoTitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      alignSelf: 'center',
      marginTop: 30,
    },
    plateNoValue: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 26,
      alignSelf: 'center',
      marginBottom: 25,
    },
    paymentCard: {
      width: '100%',
      borderRadius: 10,
      marginTop: 20,
      paddingTop: 25, 
      paddingBottom: 20,
    },
    paymentCardDark: (isDarkMode) => ({ 
      backgroundColor: isDarkMode ? Colors.card_dark_bg : Colors.white 
    }),
    paymentCardTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      paddingHorizontal: 25,
      paddingBottom: 10,
    },
    paymentCardTitleDark: (isDarkMode) => ({ 
      color: isDarkMode ? Colors.white : '#A0A0A0' 
    }),
    entityName: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 22,
      textAlign: 'center',
      color: Colors.primary
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 25,
      paddingVertical: 8,
    },
    paymentDetailsText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#A0A0A0',
    },
    paymentDetailsValue: { 
      fontFamily: 'Inter-SemiBold', 
      fontSize: 16 ,
      color: Colors.secondary
    },    
    paymentDetailsValueDark: (isDarkMode) => ({ 
      color: isDarkMode ? Colors.white : '#5C5C5C' 
    }),
    totalValue: { 
      color: '#03C5B7', 
      fontSize: 18 
    },
    divider: {
      borderBottomWidth: 1,
      borderStyle: 'dotted',
      borderColor: '#E0E0E0',
      marginHorizontal: 25,
    },
    modifiedTime:{
      fontFamily:'Inter-Regular',
      fontSize:12,
      color:'#909090'
    },
  });
  