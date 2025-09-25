import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/customStyles';
import { useSelector } from 'react-redux';

const RecentActivityCard = ({ plate, amount, date, time, txn_id, onLayout }) => {
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
  const navigation = useNavigation();

  const handlePress = () => {
    if (txn_id) {
      navigation.navigate('PaymentHistoryDetails', { txnId: txn_id });
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={styles.transactionItemContainer} onLayout={onLayout}>
      <View
        style={[
          styles.transactionInnerCard,
          { backgroundColor: isDarkMode ? Colors.card_dark_bg : Colors.white },
        ]}
      >
        <View style={styles.transactionAvatar}>
          <Image
            source={require('../../assets/images/car_avatar.png')}
            style={styles.transactionCarImg}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              styles.plateNumberText,
              { color: isDarkMode ? Colors.white : Colors.primary },
            ]}
            numberOfLines={1}
          >
            {plate}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={[
              styles.amountContainer,
              {
                backgroundColor: isDarkMode
                  ? Colors.small_container_dark_bg
                  : '#F9F9F9',
              },
            ]}
          >
            <Text
              style={[
                styles.amountText,
                { color: isDarkMode ? Colors.white : Colors.black },
              ]}
            >
              {amount}{' '}
              <Text
                style={[
                  styles.currencyText,
                  { color: isDarkMode ? Colors.white : Colors.black },
                ]}
              >
                AED
              </Text>
            </Text>
          </View>

          {(date || time) && (
            <View style={{ marginLeft: 8, alignItems: 'flex-start' }}>
              {date && (
                <Text
                  style={[
                    styles.dateText,
                    { color: isDarkMode ? '#CCCCCC' : '#6B6B6B' },
                  ]}
                >
                  {date}
                </Text>
              )}
              {time && (
                <Text
                  style={[
                    styles.timeText,
                    { color: isDarkMode ? '#A0A0A0' : '#8A8A8A' },
                  ]}
                >
                  {time}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentActivityCard;

const styles = StyleSheet.create({
  transactionItemContainer: {
    paddingBottom: 5,
    marginTop: 4,
    marginBottom: 6,
  },
  transactionInnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 45,
    height: 45,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  plateNumberText: {
    fontFamily: 'Inter-Medium',
    fontSize: 17,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
  },
  amountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
  },
  currencyText: {
    fontFamily: 'Inter-Light',
    fontSize: 14,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 2,
  },
});
