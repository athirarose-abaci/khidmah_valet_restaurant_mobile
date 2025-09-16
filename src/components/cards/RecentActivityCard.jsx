import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/customStyles';
import { useSelector } from 'react-redux';

const RecentActivityCard = ({ plate, amount, onLayout }) => {
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

  return (
    <View style={styles.transactionItemContainer} onLayout={onLayout}>
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
        <Text
          style={[
            styles.plateNumberText,
            { flex: 1, color: isDarkMode ? Colors.white : Colors.primary },
          ]}
        >
          {plate}
        </Text>
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
      </View>
    </View>
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
});
