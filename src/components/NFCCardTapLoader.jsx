import { View, Text, Modal, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Colors } from '../constants/customStyles';
import { useIsFocused } from '@react-navigation/native';

// messages: { header: string, instruction: string, action: string }
//  ─ header:      Top heading of the modal (e.g., "Tap the NFC Card")
//  ─ instruction: Sentence shown below the image (e.g., "Please tap …")
//  ─ action:      Highlighted sentence shown after the instruction (e.g., "Start the Delivery Process")
// All keys are optional – unspecified keys fall back to the default English copy.

const NFCCardTapLoader = ({
  isVisible,
  setRfid,
  setIsLoading,
  messages = {},
}) => {
    const isFocused=useIsFocused();
    const timeoutRef = useRef(null);
    const rfidTimeout=useRef(null)

    const fetchRfid=()=>{
        // Clear the timeout since RFID was fetched successfully
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (rfidTimeout.current) {
            clearTimeout(rfidTimeout.current);
            rfidTimeout.current = null;
        }
        setRfid('1234567890')
    }

    useEffect(() => {
        if (isVisible) {
            setRfid(null);
            rfidTimeout.current = setTimeout(() => {
                fetchRfid();
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
          backgroundColor: Colors.white,
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
            color: '#313131',
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
