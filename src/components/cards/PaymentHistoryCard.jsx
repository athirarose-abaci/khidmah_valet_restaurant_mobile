import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/customStyles';

const PaymentHistoryCard = ({ item, showHeader = false, date, totalCount }) => {
  return (
    <View style={styles.mainContainer}>
      {showHeader && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerDate}>{date}</Text>
          <Text style={styles.headerCount}>{`${totalCount} Transactions`}</Text>
        </View>
      )}

      <View style={styles.container}>
        <Image source={item.image} style={styles.avatar} />
        <Text style={styles.plate}>{item.plate}</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{item.amount}</Text>
          <Text style={styles.currency}> AED</Text>
        </View>

        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

export default PaymentHistoryCard;

const styles = StyleSheet.create({
  mainContainer: {
      width: '100%',
      backgroundColor: Colors.white,
  },
  headerContainer: {
    width: '100%',  
    backgroundColor: '#F6F7FB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25, 
  },
  headerDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#909090',
  },
  headerCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#909090',
  },
  divider: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#E0E0E0',
    marginHorizontal: 35,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 15,
  },
  plate: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 2,
    marginRight: 35,
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.black,
  },
  currency: {
    fontFamily: 'Inter-Light',
    fontSize: 14,
    color: '#313131',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#909090',
  },
});