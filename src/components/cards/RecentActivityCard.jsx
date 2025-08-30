import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Colors } from '../../constants/customStyles'

const RecentActivityCard = ({ plate, amount, onLayout }) => {
  return (
    <View style={styles.transactionItemContainer} onLayout={onLayout}>
      <View style={styles.transactionInnerCard}>
        <View style={styles.transactionAvatar}>
          <Image
            source={require('../../assets/images/car_avatar.png')}
            style={styles.transactionCarImg}
          />
        </View>
        <Text style={[styles.plateNumberText, { flex: 1 }]}>{plate}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>
            {amount}{' '}
            <Text style={styles.currencyText}>AED</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default RecentActivityCard

const styles = StyleSheet.create({
  transactionItemContainer: {
    padding: 4,
    marginBottom: 8,
  },
  transactionInnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    minHeight: 70,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionCarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  plateNumberText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.black,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
  },
  amountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.black,
  },
  currencyText: {
    fontFamily: 'Inter-Light',
    fontSize: 15,
    color: Colors.black,
  },
})
