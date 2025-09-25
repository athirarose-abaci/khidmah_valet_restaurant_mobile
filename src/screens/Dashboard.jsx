import React, { useState, useRef, useEffect, useContext } from 'react'
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions,} from 'react-native'
import { Colors } from '../constants/customStyles'
import RecentActivityCard from '../components/cards/RecentActivityCard'
import NFCCardTapLoader from '../components/NFCCardTapLoader'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { parkingValidationDetails } from '../apis/jobs'
import Error from '../helpers/Error'
import { ToastContext } from '../context/ToastContext'
import { setEntityDetails } from '../../store/jobSlice'
import { transactionHistory, transactionSummary } from '../apis/entities'
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment'
import transformPaymentHistory from '../utility/PaymentHistoryFormat'
import transformRecentActivity from '../utility/RecentActivityFormat'
import { clearPaymentHistory, formattedPaymentHistory, formattedRecentActivity, setPaymentHistory } from '../../store/entitySlice'
import AbaciLoader from '../components/AbaciLoader'
import NoDataLottie from '../components/lottie/NoDataLottie'

const Dashboard = ({navigation}) => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused();
  const [isNFCLoading, setIsNFCLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
  const toastContext = useContext(ToastContext);
  const currentAuthState = useSelector(state => state.authSlice.authState);
  const entityId = currentAuthState?.entity?.id;
  const paymentHistoryData = useSelector(state => state.entitySlice.formattedRecentActivity);
  const flatListRef = useRef(null)

  const [isNavigating, setIsNavigating] = useState(false)
  const [rfid, setRfid] = useState(null)

  const todayStart = moment().format('YYYY-MM-DD');  
  const todayEnd = moment().add(1, 'day').format('YYYY-MM-DD'); 
  const [transactionSummaryData, setTransactionSummaryData] = useState(null);

  // const [showAll, setShowAll] = useState(false)
  const [itemHeight, setItemHeight] = useState(0)
  const windowHeight = Dimensions.get('window').height
  const visibleArea = windowHeight * 0.50
  const dynamicListMinHeight = windowHeight * 0.48;
  const maxVisible = itemHeight ? Math.max(1, Math.floor(visibleArea / itemHeight)) : 3 // fallback

  // const buttonAnim = useRef(new Animated.Value(1)).current
  // const lastOffset = useRef(0)

  // const animatedButtonStyle = {
  //   opacity: buttonAnim,
  //   transform: [
  //     {
  //       translateY: buttonAnim.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [50, 0],
  //       }),
  //     },
  //   ],
  // }

  // const handleScroll = (e) => {
  //   const y = e.nativeEvent.contentOffset.y
  //   const diff = y - lastOffset.current
  //   if (diff > 5) {
  //     // scrolling down -> hide
  //     Animated.timing(buttonAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start()
  //   } else if (diff < -5) {
  //     // scrolling up -> show
  //     Animated.timing(buttonAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start()
  //   }
  //   lastOffset.current = y
  // }

  // useEffect(() => {
  //   Animated.timing(buttonAnim, { toValue: showAll ? 0 : 1, duration: 200, useNativeDriver: true }).start()
  //   if (!showAll && flatListRef.current) {
  //     flatListRef.current.scrollToOffset({ offset: 0, animated: false })
  //     lastOffset.current = 0
  //   }
  // }, [showAll])

  useEffect(() => {
    if(isFocused){
      fetchTransactionSummary();
      dispatch(clearPaymentHistory());
      paymentHistory(entityId, 1, '', 10);
    }
  }, [isFocused]);

  const parkingValidationDetailsHandler = async () => {
    setIsDataLoading(true);
    setRefreshing(true);
    setIsNavigating(true);
    try {
      const response = await parkingValidationDetails(rfid);
      dispatch(setEntityDetails(response));
      if (response?.parking_already_validated === true) {
        navigation.navigate('PaymentValidationSuccessfull', { alreadyValidated: true });
      } else if(response?.vip_vehicle === true){
        navigation.navigate('PaymentValidationSuccessfull', { isVipVehicle: true });
      }else {
        navigation.navigate('ValidatePayment', { validationDetails: response, rfid: rfid });
      }
    } catch (error) {
      let err_msg = Error(error);
      toastContext.showToast(err_msg, 'long', 'error');
    } finally {
      setRfid(null);
      setIsDataLoading(false);
      setIsNFCLoading(false);
      setRefreshing(false);
      setIsNavigating(false);
    }
  }

  const paymentHistory = async (entityId, pageNumber, searchQuery, limit) => {
    setIsDataLoading(true);
    setRefreshing(true);
    try{
      const response = await transactionHistory(entityId, pageNumber, searchQuery, limit);
      const transformePaymentHistoryData = transformPaymentHistory(response?.results);
      const transformedRecentActivity = transformRecentActivity(response?.results);
      dispatch(setPaymentHistory(response));
      dispatch(formattedPaymentHistory(transformePaymentHistoryData));
      dispatch(formattedRecentActivity(transformedRecentActivity));
    }catch(error){
      let error_msg = Error(error);
      toastContext.showToast(error_msg,'short','error');
    }finally{
      setIsDataLoading(false);
      setRefreshing(false);
    }
  }

  const fetchTransactionSummary = async () => {
    setIsDataLoading(true);
    setRefreshing(true);
    try {
      const response = await transactionSummary(entityId, todayStart, todayEnd);
      setTransactionSummaryData(response);
    } catch (error) {
      let err_msg = Error(error);
      toastContext.showToast(err_msg, 'short', 'error');
    }finally{
      setIsDataLoading(false);
      setRefreshing(false);
    }
  }
  // Navigate once RFID is captured
  useEffect(() => {
    if (rfid && !isNavigating) {
      parkingValidationDetailsHandler();
    }
  }, [rfid, isNavigating, navigation]);

  const refreshControl = () => {
    fetchTransactionSummary();
    dispatch(clearPaymentHistory());
    paymentHistory(entityId, 1, '', 10);
  }

  return (
    <SafeAreaView  style={[styles.container, {backgroundColor: isDarkMode ? '#1B1E1C' : Colors.screen_bg}]}>
      <NFCCardTapLoader
        isVisible={isNFCLoading}
        setRfid={setRfid}
        setIsLoading={setIsNFCLoading}
      />
      <StatusBar 
        backgroundColor={isDarkMode ? Colors.black : Colors.screen_bg} 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
      />

      <AbaciLoader visible={isDataLoading} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.restaurantWrapper} 
          onPress={() => {navigation.navigate('Profile')}}
        >
          <Image
            source={
              currentAuthState?.entity?.entity_logo 
              ? {uri: currentAuthState?.entity?.entity_logo}
              : require('../assets/images/restaurant_default_logo.png')
            }
            style={styles.avatar}
          />
          <Text style={[styles.restaurantName, {color: isDarkMode ? Colors.white : Colors.primary}]}>{currentAuthState?.entity?.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.historyButton, {backgroundColor: isDarkMode ? Colors.btn : Colors.black}]} 
          onPress={() => {navigation.navigate('PaymentHistory')}}
        >
          <Image
            source={require('../assets/images/history.png')}
            style={styles.historyIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Today's Transactions Card */}
      <View style={styles.transactionCard}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionCardLeftText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Valet Transactions Today
          </Text>
          <Text style={styles.transactionValue}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {transactionSummaryData?.total_amount} <Text style={styles.currency}
            numberOfLines={1}
            adjustsFontSizeToFit
            >AED</Text>
          </Text>
        </View>

        {/* Right stats */}
        <View style={styles.statsContainer}>
          <View style={styles.iconRow}>
            <Image
              source={require('../assets/images/car_fill.png')}
              style={styles.carFillIcon}
            />
            <Text style={styles.carFillIconText}>{transactionSummaryData?.total_count}</Text>
          </View>
          <Text style={styles.paymentsCompletedText}>
            Payments {'\n'}Completed
          </Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.recentTransactions}>
        <Text style={styles.recentTransactionsText}>Recent Activity</Text>
        {/* <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowAll(!showAll)}>
          <Text style={styles.viewAllText}>{showAll ? 'View Less' : 'View All'}</Text>
          <ArrowRight name="keyboard-arrow-right" size={20} color='#909090' />
        </TouchableOpacity> */}
      </View>

      {/* Transactions List */}
      {/* <View style={[styles.transactionsList, {backgroundColor: isDarkMode ? Colors.container_dark_bg : '#EBECF0'}, showAll && { flex: 1 }] }>
        <FlatList
          ref={flatListRef}
          data={paymentHistoryData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <RecentActivityCard 
              plate={item.plate} 
              amount={item.amount} 
              onLayout={e => {
              if (!itemHeight) {
                setItemHeight(e.nativeEvent.layout.height + 8) // include marginBottom 8
              }
            }} />
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={showAll}
          style={showAll ? { flex: 1 } : { maxHeight: itemHeight * maxVisible }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View> */}
      <View style={[styles.transactionsList, styles.transactionsListDark(isDarkMode), {minHeight: dynamicListMinHeight}] }>
        {paymentHistoryData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <NoDataLottie isDarkMode={isDarkMode} refreshControl={refreshControl} />
          </View>
        ) : paymentHistoryData.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={paymentHistoryData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <RecentActivityCard 
                plate={item.plate} 
                amount={item.amount} 
                date={item.date}
                time={item.time}
                txn_id={item.txn_id}
                onLayout={e => {
                  if (!itemHeight) {
                    setItemHeight(e.nativeEvent.layout.height + 8)
                  }
                }} 
              />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}  
            style={{ maxHeight: itemHeight * maxVisible }} 
            refreshing={refreshing}
            onRefresh={refreshControl}
          />
        ) : null}
      </View>


      {/* Validate Payment Button */}
      {/* <Animated.View style={[
        styles.buttonContainer, 
        { paddingBottom: insets.bottom || 12, backgroundColor: isDarkMode ? '#262626' : Colors.white },
        animatedButtonStyle
        ]}> */}
      <View style={[
        styles.buttonContainer, 
        { paddingBottom: insets.bottom || 12, backgroundColor: isDarkMode ? '#262626' : Colors.white }
        ]}>
        <TouchableOpacity
          style={[styles.validateButton, {backgroundColor: isDarkMode ? Colors.primary : Colors.btn}]}
          onPress={() => {
            setRfid(null)
            setIsNFCLoading(true)
            setIsNavigating(false)

          }}
        >
          <Text style={[styles.validateButtonText, {color: isDarkMode ? Colors.white : Colors.white}]}>Validate Payment</Text>
        </TouchableOpacity>
      {/* </Animated.View> */}
      </View>
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    minHeight: 280,
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10, 
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  restaurantWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#B4DADC',
    marginRight: 10,
  },
  restaurantName: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },
  historyButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIcon: {
    width: 28,
    height: 28,
  },

  /** Transaction Card */
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 15,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 5,
  },
  transactionCardLeftText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: Colors.secondary,
  },
  transactionValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 30,
    color: Colors.white,
  },
  currency: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.white,
  },

  /** Stats Section */
  statsContainer: {
    backgroundColor: '#2F6578',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 6,
    alignItems: 'center',
    marginRight: 5,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carFillIcon: {
    marginTop: 4,
    width: 25,
    height: 25,
  },
  carFillIconText: {
    fontFamily: 'Inter-Regular',
    fontSize: 30,
    color: Colors.secondary,
    marginLeft: 4,
  },
  paymentsCompletedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 6,
  },

  /** Recent Transactions */
  recentTransactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 13,
  },
  recentTransactionsText: {
    marginLeft: 15,
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#6E6E6E',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#909090',
  },
  /** Transactions List */
  transactionsList: {
    marginTop: 10,
    marginHorizontal: 18,
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 15,
    minHeight: 450, 
  },
  transactionsListDark: (isDarkMode) => ({
    backgroundColor: isDarkMode ? Colors.container_dark_bg : '#EBECF0',
  }),
  buttonContainer: {
    position: 'absolute', 
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 10 ,
  },
  validateButton: {
    height: 65,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  validateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.white,
  }
})
