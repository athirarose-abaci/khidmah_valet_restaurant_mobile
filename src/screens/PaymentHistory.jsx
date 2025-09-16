import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../constants/customStyles';
import PaymentHistoryCard from '../components/cards/PaymentHistoryCard';
import { paymentHistoryData } from '../constants/dummyData';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentHistory = () => {
  const [searchText, setSearchText] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({});
  const navigation = useNavigation();

  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);

  const handleDateFilterPress = () => {
    // TODO: Implement date filter action (e.g., open date picker)
  };

  const toggleSection = (date) => {
    setCollapsedSections(prev => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDarkMode ? Colors.dark_bg : Colors.white}]}>
      <StatusBar 
        backgroundColor={isDarkMode ? Colors.dark_bg : Colors.white} 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
      />
      <Text style={[styles.title, {color: isDarkMode ? Colors.white : Colors.primary}]}>Payment History</Text>
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
        <View style={[styles.searchBar, {backgroundColor: isDarkMode ? '#313131' : '#F6F7FB'}]}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#B6B6B6"
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            style={[styles.searchInput, {color: isDarkMode ? Colors.white : Colors.black}]}
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

      {/* <FlatList
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
                index={index}
              />
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      /> */}
      <FlatList
        data={paymentHistoryData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            {/* Header always visible */}
            <PaymentHistoryCard
              showHeader={true}
              date={item.date}
              totalCount={item.transactions.length}
              isCollapsed={collapsedSections[item.date]}
              onHeaderPress={() => toggleSection(item.date)}
            />

            {/* Render transactions only if expanded */}
            {!collapsedSections[item.date] &&
              item.transactions.map((txn, index) => (
                <PaymentHistoryCard
                  key={txn.id}
                  item={txn}
                  showHeader={false}
                  date={item.date}
                  totalCount={item.transactions.length}
                  index={index}
                />
              ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

    </SafeAreaView>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
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
