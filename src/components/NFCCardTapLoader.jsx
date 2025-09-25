import { View, Text, Modal, Image, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { Colors } from '../constants/customStyles';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentNfcId, clearCurrentNfcId } from '../../store/jobSlice';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { ToastContext } from '../context/ToastContext';

// messages: { header: string, instruction: string, action: string }
//  ─ header:      Top heading of the modal (e.g., "Tap the NFC Card")
//  ─ instruction: Sentence shown below the image (e.g., "Please tap …")
//  ─ action:      Highlighted sentence shown after the instruction (e.g., "Start the Delivery Process")
// All keys are optional – unspecified keys fall back to the default English copy.

const NFCCardTapLoader = ({ isVisible, setRfid, setIsLoading, messages = {} }) => {
  const isFocused = useIsFocused();
  const timeoutRef = useRef(null);
  const rfidTimeout = useRef(null);

  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
  const toastContext = useContext(ToastContext);

  // const fetchRfid = () => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //     timeoutRef.current = null;
  //   }
  //   if (rfidTimeout.current) {
  //     clearTimeout(rfidTimeout.current);
  //     rfidTimeout.current = null;
  //   }
  //   setRfid('0458F98A4B7580');
  // };

  const readNfc = async () => {
    try {
      await NfcManager.requestTechnology([
        NfcTech.NfcA,
        NfcTech.NfcB,
        NfcTech.NfcF,
        NfcTech.NfcV,
      ]);

      const tag = await NfcManager.getTag();
      if (tag && tag.id) {
        const cardId = tag.id;
        
        setRfid(cardId);
        dispatch(setCurrentNfcId(cardId));

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else {
        toastContext.showToast('Invalid card format', 'short', 'error');
      }
    } catch (ex) {
      if (ex.message && !ex.message.includes('cancelled')) {
        toastContext.showToast('Failed to read card', 'short', 'error');
      }
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  // useEffect(() => {
  //   if (isVisible) {
  //     setRfid(null);
  //     fetchRfid();

  //     const errorTimeout = setTimeout(() => {
  //       setIsLoading('error');
  //     }, 30000);

  //     timeoutRef.current = errorTimeout;
  //   }

  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //       timeoutRef.current = null;
  //     }
  //     if (rfidTimeout.current) {
  //       clearTimeout(rfidTimeout.current);
  //       rfidTimeout.current = null;
  //     }
  //   };
  // }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      dispatch(clearCurrentNfcId());
      setRfid(null);
      rfidTimeout.current = setTimeout(() => {
        // fetchRfid();
        readNfc();
      }, 1000);
      // Set timeout and store reference
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 10000);
    }

    // Cleanup function to clear timeout when component unmounts or focus changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rfidTimeout.current) {
        clearTimeout(rfidTimeout.current);
        rfidTimeout.current = null;
      }
    };
  }, [isVisible]);

  const defaultMessages = {
    header: 'Tap the NFC Card',
    instruction: 'Please tap the NFC card on the key to',
    action: 'Raise a Delivery Request',
  };

  const { header, instruction, action } = { ...defaultMessages, ...messages };

  return (
    <Modal visible={isVisible}>
      <View style={[ styles.container,styles.containerColor(isDarkMode), ]}>
        <Text style={styles.header}>{header}</Text>
        <View style={styles.content}>
          <Image
            source={require('../assets/images/NFCCard.png')}
            style={styles.image}
          />
          <Text style={[ styles.instruction, styles.instructionColor(isDarkMode), ]} >
            {instruction}
          </Text>
          <Text style={styles.action}>{action}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default NFCCardTapLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
    paddingTop: 30,
  },
  containerColor: (isDarkMode) => ({
    backgroundColor: isDarkMode ? Colors.dark_mode_background : Colors.white,
  }),
  header: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#22B9BE',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '35%',
    resizeMode: 'contain',
  },
  instruction: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  instructionColor: (isDarkMode) => ({
    color: isDarkMode ? Colors.light_blue : '#313131',
  }),
  action: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#03C5B7',
    textAlign: 'center',
  },
});
