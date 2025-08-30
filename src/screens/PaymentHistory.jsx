import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../constants/customStyles';
import PaymentHistoryCard from '../components/cards/PaymentHistoryCard';
import { paymentHistoryData } from '../constants/dummyData';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';

const PaymentHistory = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const handleDateFilterPress = () => {
    // TODO: Implement date filter action (e.g., open date picker)
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <Text style={styles.title}>Payment History</Text>
      <MaterialIcons
        name="chevron-left"
        size={35}
        color={Colors.back_arrow}
        style={styles.backButton}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.filterContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#B6B6B6"
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Vehicle..."
            placeholderTextColor="#B6B6B6"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={handleDateFilterPress}
        >
          <Ionicons
            name="calendar-outline"
            size={25}
            color={Colors.secondary}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={paymentHistoryData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            {item.transactions.map((txn, index) => (
              <PaymentHistoryCard
                key={txn.id}
                item={txn}
                showHeader={index === 0}
                date={item.date}
                totalCount={item.transactions.length}
              />
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginTop: -30,
    marginLeft: 20,
  },
  filterContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    borderRadius: 7,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 15,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: '#CFCFCF',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    paddingRight: 10,
    color: '#000',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  dateButton: {
    width: 45,
    height: 45,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sectionContainer: {
    // width: '100%',
    // backgroundColor: Colors.white,
    // backgroundColor: 'blue',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
});
