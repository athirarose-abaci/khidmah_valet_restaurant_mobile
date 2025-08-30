import React, { useState, useRef, useEffect } from 'react'
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions, Animated } from 'react-native'
import { Colors } from '../constants/customStyles'
import ArrowRight from '@react-native-vector-icons/material-icons'
import { recentTransactions } from '../constants/dummyData'
import RecentActivityCard from '../components/cards/RecentActivityCard'
import NFCCardTapLoader from '../components/NFCCardTapLoader'
import { useNavigation } from '@react-navigation/native'

const Dashboard = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [rfid, setRfid] = useState(null)

  const [showAll, setShowAll] = useState(false)
  const [itemHeight, setItemHeight] = useState(0)
  const windowHeight = Dimensions.get('window').height
  const visibleArea = windowHeight * 0.55
  const maxVisible = itemHeight ? Math.max(1, Math.floor(visibleArea / itemHeight)) : 3 // fallback

  const buttonAnim = useRef(new Animated.Value(1)).current
  const lastOffset = useRef(0)
  const flatListRef = useRef(null)

  const animatedButtonStyle = {
    opacity: buttonAnim,
    transform: [
      {
        translateY: buttonAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  }


  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y
    const diff = y - lastOffset.current
    if (diff > 5) {
      // scrolling down -> hide
      Animated.timing(buttonAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start()
    } else if (diff < -5) {
      // scrolling up -> show
      Animated.timing(buttonAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    }
    lastOffset.current = y
  }

  useEffect(() => {
    Animated.timing(buttonAnim, { toValue: showAll ? 0 : 1, duration: 200, useNativeDriver: true }).start()
    if (!showAll && flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false })
      lastOffset.current = 0
    }
  }, [showAll])

    // Navigate once RFID is captured
    useEffect(() => {
      if (rfid && isLoading) {
        
        // Navigate immediately
        navigation.navigate('ValidatePayment');
        
        // Dismiss loader after navigation with a longer delay
        setTimeout(() => {
          setIsLoading(false);
          setRfid(null);
        }, 300); 
      }
    }, [rfid, isLoading, navigation]);

  return (
    <View style={styles.container}>
      <NFCCardTapLoader
        isVisible={isLoading}
        setRfid={setRfid}
        setIsLoading={setIsLoading}
        messages={{
          header: 'Tap the NFC Card',
          instruction: 'Please tap the NFC card on the key to',
          action: 'Start the Delivery Process',
        }}
      />
      <StatusBar backgroundColor={Colors.screen_bg} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.restaurantWrapper} 
          onPress={() => {navigation.navigate('Profile')}}
        >
          <Image
            source={require('../assets/images/restaurant_avatar.png')}
            style={styles.avatar}
          />
          <Text style={styles.restaurantName}>Smoked & Co.</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.historyButton} 
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
          <Text style={styles.transactionCardLeftText}>
            Valet Transactions Today
          </Text>
          <Text style={styles.transactionValue}>
            225.20 <Text style={styles.currency}>AED</Text>
          </Text>
        </View>

        {/* Right stats */}
        <View style={styles.statsContainer}>
          <View style={styles.iconRow}>
            <Image
              source={require('../assets/images/car_fill.png')}
              style={styles.carFillIcon}
            />
            <Text style={styles.carFillIconText}>24</Text>
          </View>
          <Text style={styles.paymentsCompletedText}>
            Payments {'\n'}Completed
          </Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.recentTransactions}>
        <Text style={styles.recentTransactionsText}>Recent Activity</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowAll(!showAll)}>
          <Text style={styles.viewAllText}>{showAll ? 'View Less' : 'View All'}</Text>
          <ArrowRight name="keyboard-arrow-right" size={20} color='#909090' />
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <View style={[styles.transactionsList, showAll && { flex: 1 }] }>
        <FlatList
          ref={flatListRef}
          data={recentTransactions}
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
      </View>

      {/* Validate Payment Button */}
      <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
        <TouchableOpacity
          style={styles.validateButton}
          onPress={() => {
            setRfid(null)
            setIsLoading(true)
          }}
        >
          <Text style={styles.validateButtonText}>Validate Payment</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screen_bg,
    padding: 10,
  },

  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
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
    color: Colors.primary,
  },
  historyButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: Colors.black,
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
    fontSize: 35,
    color: Colors.white,
  },
  currency: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 25,
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
    width: 30,
    height: 30,
  },
  carFillIconText: {
    fontFamily: 'Inter-Regular',
    fontSize: 35,
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
    marginTop: 20,
    marginHorizontal: 15,
  },
  recentTransactionsText: {
    marginLeft: 15,
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#6E6E6E',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#909090',
  },
  /** Transactions List */
  transactionsList: {
    marginTop: 10,
    marginHorizontal: 15,
    backgroundColor: '#EBECF0',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  validateButton: {
    height: 65,
    backgroundColor: '#313131',
    borderRadius: 25,
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
    fontSize: 18,
    color: Colors.white,
  }
})
