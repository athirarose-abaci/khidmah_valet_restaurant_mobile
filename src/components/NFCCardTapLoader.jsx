import { View, Text, Modal, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Colors } from '../constants/customStyles';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { Buffer } from 'buffer';
 
// messages: { header: string, instruction: string, action: string }
//  ─ header:      Top heading of the modal (e.g., "Tap the NFC Card")
//  ─ instruction: Sentence shown below the image (e.g., "Please tap …")
//  ─ action:      Highlighted sentence shown after the instruction (e.g., "Start the Delivery Process")
// All keys are optional – unspecified keys fall back to the default English copy.
 
const NFCCardTapLoader = ({ isVisible, setRfid, setIsLoading, messages = {}, }) => {
    const isFocused = useIsFocused();
    const timeoutRef = useRef(null);
    const rfidTimeout = useRef(null)
    const isDarkMode = useSelector(state=>state.themeSlice.isDarkMode)
 
    // const fetchRfid=()=>{
    //     // Clear the timeout since RFID was fetched successfully
    //     if (timeoutRef.current) {
    //         clearTimeout(timeoutRef.current);
    //         timeoutRef.current = null;
    //     }
    //     if (rfidTimeout.current) {
    //         clearTimeout(rfidTimeout.current);
    //         rfidTimeout.current = null;
    //     }
    //     setRfid('1778174125')
    // }
 
    const readNfc = async () => {
      try {
        await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA, NfcTech.IsoDep, NfcTech.MifareClassic]);
    
        // Optional timeout logic
        const timeoutId = setTimeout(() => {
          NfcManager.cancelTechnologyRequest();
        }, 10000); // cancel after 10 seconds
    
        const tag = await NfcManager.getTag();
        console.log(tag);
        setRfid(tag?.id)
        clearTimeout(timeoutId);
        const ndefRecord = tag.ndefMessage?.[0];
        if (ndefRecord?.payload) {
          const text = Buffer.from(ndefRecord.payload).toString('utf-8');
        }
      } catch (ex) {
        // console.log('Scan failed or cancelled', ex);
      } finally {
        NfcManager.cancelTechnologyRequest(); // always clean up
      }
    };
 
    // useEffect(() => {
    //   if (isVisible) {
    //     setRfid(null);
    //     readNfc();
    //     setTimeout(() => {
    //       setIsLoading('error');
    //     }, 30000);
    //   }
    // }, [isVisible]);
 
    useEffect(() => {
        if (isVisible) {
            setRfid(null);
            rfidTimeout.current = setTimeout(() => {
                // fetchRfid();
                readNfc();
            }, 10000);
            // Set timeout and store reference
            timeoutRef.current = setTimeout(() => {
                setIsLoading(false);
            }, 30000);
        }
        
        // // Cleanup function to clear timeout when component unmounts or focus changes
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isVisible]);
 
  // Merge supplied messages with defaults so callers can override only the parts they need.
  const defaultMessages = {
    header: 'Tap the NFC Card',
    instruction: 'Please tap the NFC card on the key to',
    action: 'Raise a Delivery Request',
  };
 
  const { header, instruction, action } = { ...defaultMessages, ...messages };
 
  return (
    <Modal visible={isVisible}>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: isDarkMode?Colors.dark_mode_background:Colors.white,
          alignItems: 'center',
          //   justifyContent: 'space-evenly',
          zIndex: 1000,
          padding: 20,
          paddingTop:30
        }}
      >
        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:18,color:'#22B9BE'}}>{header}</Text>
        <View style={{flex:1,width:'100%',justifyContent:'center',alignItems:'center'}}>
        <Image
          source={require('../assets/images/NFCCard.png')}
          style={{ width: '100%', height: '35%', resizeMode: 'contain' }}
        />
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 16,
            color: isDarkMode?Colors.light_blue:'#313131',
            textAlign: 'center',
          }}
        >
         {instruction}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 16,
            color: '#03C5B7',
            textAlign: 'center',
          }}
        >
         {action}
        </Text>
        </View>
      </View>
    </Modal>
  );
};
 
export default NFCCardTapLoader;