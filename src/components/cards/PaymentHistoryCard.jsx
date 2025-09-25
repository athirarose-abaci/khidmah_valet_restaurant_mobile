import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/customStyles';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const PaymentHistoryCard = ({ item, showHeader = false, date, totalCount, index }) => {
  const navigation = useNavigation();
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

  const handlePress = () => {
    if (item?.id) {
      navigation.navigate('PaymentHistoryDetails', { txnId: item.id });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[ styles.mainContainer, { backgroundColor: isDarkMode ? Colors.container_dark_bg : Colors.white }, ]}
    >
      {showHeader && (
        <View style={[ styles.headerContainer, { backgroundColor: isDarkMode ? '#313131' : '#F9F9F9' }, ]} >
          <Text style={styles.headerDate}>{date}</Text>
          <Text style={styles.headerCount}>{`${totalCount} Transactions`}</Text>
        </View>
      )}

      {item && (
        <View style={styles.itemContainer}>
          <View style={styles.container}>
            <Image source={item.image} style={styles.avatar} />
            <Text style={[ styles.plate, { color: isDarkMode ? Colors.secondary : Colors.primary }, ]} >
              {item.plate}
            </Text>

            <View style={[ styles.amountContainer, { backgroundColor: isDarkMode ? Colors.small_container_dark_bg : '#F9F9F9', }, ]} >
              <Text style={[ styles.amount, { color: isDarkMode ? Colors.white : '#909090' }, ]} >
                {item.amount}
              </Text>
              <Text style={[ styles.currency, { color: isDarkMode ? Colors.white : '#909090' }, ]} >
                {' '}AED
              </Text>
            </View>

            <Text style={[ styles.time, { color: isDarkMode ? Colors.white : '#909090' }, ]} >
              {item.time}
            </Text>
          </View>
        </View>
      )}

      {item && index < totalCount - 1 && <View style={styles.divider} />}
    </TouchableOpacity>
  );
};

export default PaymentHistoryCard;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
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
  itemContainer: {
    width: '100%',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
  modifiedByContainer: {
    paddingHorizontal: 35,
    paddingBottom: 10,
    marginLeft: 65,
  },
  modifiedByText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  modifiedByName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.primary,
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
    fontSize: 15,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 35,
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
  },
  currency: {
    fontFamily: 'Inter-Light',
    fontSize: 14,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
});
