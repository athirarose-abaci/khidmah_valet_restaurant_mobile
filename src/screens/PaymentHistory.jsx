import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, } from 'react-native';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Colors } from '../constants/customStyles';
import PaymentHistoryCard from '../components/cards/PaymentHistoryCard';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Error from '../helpers/Error';
import { ToastContext } from '../context/ToastContext';
import { transactionHistory } from '../apis/entities';
import { clearPaymentHistory, formattedPaymentHistory, formattedRecentActivity, setPaymentHistory, } from '../../store/entitySlice';
import transformPaymentHistory from '../utility/PaymentHistoryFormat';
import NoDataLottie from '../components/lottie/NoDataLottie';
import AbaciLoader from '../components/AbaciLoader';
import transformRecentActivity from '../utility/RecentActivityFormat';
import mergePaymentHistory from '../utility/mergePaymentHistory';
import CalendarModal from '../components/modals/CalendarModal';

const PaymentHistory = () => {
  const [isLoading, setIsLoading] = useState(true); 
  const [isPaginating, setIsPaginating] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('null');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedDateRef = useRef(null);

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const isDarkMode = useSelector((state) => state.themeSlice.isDarkMode);
  const currentAuthState = useSelector((state) => state.authSlice.authState);
  const entityId = currentAuthState?.entity?.id;
  const paymentHistoryData = useSelector( (state) => state.entitySlice.formattedPaymentHistory );
  const toastContext = useContext(ToastContext);

  const limit = 10;
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  useEffect(() => {
    selectedDateRef.current = selectedDate;  
  }, [selectedDate]);

  useEffect(() => {
    if(isFocused){
      dispatch(clearPaymentHistory());
      paymentHistory(entityId, 1, searchQuery, limit);
      setPage(1);
      setSelectedDate(null);
      selectedDateRef.current = null;
    }
  }, [isFocused]);

  const paymentHistory = async ( entityId, pageNumber, searchQuery, limit, dateRange ) => {
    if (pageNumber === 1) {
      setIsLoading(true); 
    } else {
      setIsPaginating(true); 
    }
    if (pageNumber === 1) {
      // show full screen loader instead of top refresh
      setRefreshing(false);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await transactionHistory( entityId, pageNumber, searchQuery, limit, dateRange );

      const transformePaymentHistoryData = transformPaymentHistory( response?.results );
      const transformedRecentActivity = transformRecentActivity( response?.results );
      dispatch(setPaymentHistory(response));

      if (pageNumber > 1) {
        const merged = mergePaymentHistory( paymentHistoryData, transformePaymentHistoryData );
        dispatch(formattedPaymentHistory(merged));
      } else {
        dispatch(formattedPaymentHistory(transformePaymentHistoryData));
      }

      setPage(pageNumber + 1);
      // Determine if there is a next page
      if (response?.results?.length < limit || !response?.next) {
        setHasNextPage(false);
      } else {
        setHasNextPage(true);
      }
      dispatch(formattedRecentActivity(transformedRecentActivity));
    } catch (error) {
      let error_msg = Error(error);
      toastContext.showToast(error_msg, 'short', 'error');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setIsPaginating(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isFocused && searchQuery !== 'null') {
        setIsSearchLoading(true);
        (async () => {
          dispatch(clearPaymentHistory());
          setPage(1);
          await paymentHistory(entityId, 1, searchQuery, limit, selectedDateRef.current);
          setIsSearchLoading(false);
        })();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const refreshControl = () => {
    const defaultSearch = 'null';
    if (searchQuery !== defaultSearch) {
      setSearchQuery(defaultSearch);
    }

    dispatch(clearPaymentHistory());
    setPage(1);
    setHasNextPage(true);

    paymentHistory(entityId, 1, defaultSearch, limit, selectedDateRef.current);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark_bg : Colors.white },
      ]}
    >
      <StatusBar
        backgroundColor={isDarkMode ? Colors.dark_bg : Colors.white}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <Text style={[ styles.title, { color: isDarkMode ? Colors.white : Colors.primary }, ]} >
        Payment History
      </Text>

      <MaterialIcons
        name="chevron-left"
        size={35}
        color={Colors.back_arrow}
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.filterContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: isDarkMode ? '#313131' : '#F6F7FB' },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color="#B6B6B6"
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDarkMode ? Colors.white : Colors.black },
            ]}
            placeholder="Search Vehicle..."
            placeholderTextColor="#B6B6B6"
            value={searchQuery!=='null' ? searchQuery : ''}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={25}
            color={Colors.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Show active date filter */}
      {selectedDate?.startDate && selectedDate?.endDate && (
        <View style={styles.dateFilterBadge}>
          <Text style={styles.dateFilterText}>
            {`${moment(selectedDate.startDate).format('DD MMM YYYY')} - ${moment(selectedDate.endDate).format('DD MMM YYYY')}`}
          </Text>
          <TouchableOpacity
            style={styles.clearFilterBtn}
            onPress={() => {
              setSelectedDate(null);
              selectedDateRef.current = null;
              dispatch(clearPaymentHistory());
              setPage(1);
              setHasNextPage(true);
              paymentHistory(entityId, 1, searchQuery, limit, null);
            }}
          >
            <Ionicons name="close" size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Show small loader for search */}
      {isSearchLoading && (
        <View style={{ alignSelf: 'center', marginVertical: 10 }}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}

      {/* Inline content */}
      {paymentHistoryData.length === 0 && !isLoading ? (
        <View style={styles.noDataContainer}>
          <NoDataLottie
            isDarkMode={isDarkMode}
            refreshControl={refreshControl}
          />
        </View>
      ) : paymentHistoryData.length > 0 ? (
        <FlatList
          data={paymentHistoryData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
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
          refreshing={refreshing}
          onRefresh={refreshControl}
          onEndReachedThreshold={0.01}
          onEndReached={() => {
            if (hasNextPage && !isPaginating && !isLoading && page > 1) {
              paymentHistory( entityId, page, searchQuery, limit, selectedDateRef.current );
            }
          }}
          ListFooterComponent={
            isPaginating ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
          }
        />
      ) : null}

      {/* Full screen loader */}
      <AbaciLoader visible={isLoading && searchQuery === 'null'} />

      {/* Calendar modal */}
      <CalendarModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedDateRef={selectedDateRef}
        onRangeSelected={(newSelection) => {
          setShowDatePicker(false);
          dispatch(clearPaymentHistory());
          setPage(1);
          paymentHistory(entityId, 1, searchQuery, limit, newSelection);
        }}
        onClear={() => {
          dispatch(clearPaymentHistory());
          setPage(1);
          paymentHistory(entityId, 1, searchQuery, limit, null);
        }}
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
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateFilterBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 25,
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateFilterText: {
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginRight: 6,
  },
  clearFilterBtn: {
    padding: 2,
  },
});
