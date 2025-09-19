import { View, Text, Button, ScrollView, Image, TouchableOpacity, StatusBar, } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Colors } from '../constants/customStyles';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import NFCCardTapLoader from '../components/NFCCardTapLoader';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { createDeliveryRequest } from '../apis/jobs';
import Error from '../helpers/Error';
import { ToastContext } from '../context/ToastContext';
 
const SelectServiceScreen = ({route, navigation }) => {
  const [isLoading,setIsLoading] = useState(false);
  const [rfid,setRfid] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false);
  const isFocused = useIsFocused()
  const isDarkMode=useSelector(state=>state.themeSlice.isDarkMode)
  const toastContext=useContext(ToastContext)
 
  const createDeliveryRequestHandler=async()=>{
    try{
      const deliveryRequestResponse=await createDeliveryRequest(rfid)
      setIsNavigating(true);
      
      // Navigate immediately
      navigation.navigate('RaiseDeliveryRequestCompletionScreen',{deliveryDetails:deliveryRequestResponse});
    }catch(error){
      let err_msg=Error(error)
      toastContext.showToast(err_msg,'short','error')
    }finally{
      setIsLoading(false)
      setRfid(null)
      setIsNavigating(false)
    }
  }
 
  useEffect(() => {
    if (rfid && !isNavigating) {
      createDeliveryRequestHandler()
      // // Dismiss loader after navigation with a longer delay
      // setTimeout(() => {
      //   setIsLoading(false);
      //   setRfid(null);
      //   setIsNavigating(false);
      // }, 500); // Increased delay to ensure navigation completes
    }
  }, [rfid, isNavigating, navigation]);
 
  return (
    <View style={{ flex: 1, backgroundColor:isDarkMode?Colors.dark_mode_background:Colors.white }}>
      <StatusBar barStyle={isDarkMode?'light-content':'dark-content'} backgroundColor={isDarkMode?Colors.dark_mode_background:Colors.white} />
      <NFCCardTapLoader isVisible={isLoading} setRfid={setRfid} setIsLoading={setIsLoading}/>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View style={{ width: '10%' }}>
          <MaterialIcons
            name="chevron-left"
            size={35}
            color={Colors.back_arrow}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={{ width: '90%', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 18,
              color: '#22B9BE',
              marginLeft: '-10%',
            }}
          >
            Select Service
          </Text>
        </View>
      </View>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 10 }}
        contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly' }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={require('../assets/images/valet-service.png')}
            style={{ width: '100%', height: '50%', resizeMode: 'contain' }}
          />
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 16,
              color: '#858585',
              textAlign: 'center',
              marginTop: 10,
            }}
          >
            Please confirm your next action to {'\n'} proceed with valet service.
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingVertical: 20,
            justifyContent: 'space-evenly',
          }}
        >
          <TouchableOpacity
            style={{
              width: '45%',
              height: 150,
              backgroundColor: '#22B9BE',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={()=>{navigation.navigate('NewVehicleParkingScreen')}}
          >
            <Image
              source={require('../assets/images/Parking.png')}
              style={{ width: '50%', height: '50%', resizeMode: 'contain' }}
            />
            <Text style={{marginTop:5,color:Colors.white,fontFamily:'Poppins-Medium',fontSize:13}}>Park a Vehicle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '45%',
              height: 150,
              backgroundColor: '#114B5F',
              borderRadius: 20,
              justifyContent:'center',
              alignItems:'center'
            }}
            onPress={()=>{
              setRfid(null)
              setIsLoading(true)
              setIsNavigating(false)
            }}
          >
              <Image
              source={require('../assets/images/Delivery.png')}
              style={{ width: '50%', height: '50%', resizeMode: 'contain' }}
            />
            <Text style={{marginTop:5,color:Colors.white,fontFamily:'Poppins-Medium',fontSize:13}}>Raise a delivery</Text>
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
      </ScrollView>
    </View>
  );
};
 
export default SelectServiceScreen;
 
 