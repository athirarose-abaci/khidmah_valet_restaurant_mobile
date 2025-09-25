import React, { useEffect, useState, useContext } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Dimensions, } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '../../constants/customStyles';
import { useSelector } from 'react-redux';
import { deliveryValetPoints } from '../../apis/entities';
import { acceptDeliveryRequest } from '../../apis/jobs';
import ConfirmationModal from './ConfirmationModal';
import Error from '../../helpers/Error';
import { ToastContext } from '../../context/ToastContext';

const { width, height } = Dimensions.get('window');

const DeliveryRequestModal = ({ isVisible, onClose, onConfirmed }) => {
  const isDarkMode = useSelector(state => state.themeSlice.isDarkMode);
  const currentNfcId = useSelector(state => state.jobSlice.currentNfcId);
  const toastContext = useContext(ToastContext);

  const [valetPoints, setValetPoints] = useState([]);
  const [selectedValet, setSelectedValet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      fetchValetPoints();
    } else {
      resetState();
    }
  }, [isVisible]);

  const resetState = () => {
    setSelectedValet(null);
    setConfirmModal(false);
    setSubmitLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose && onClose();
  };

  const fetchValetPoints = async () => {
    setLoading(true);
    try {
      const response = await deliveryValetPoints();
      setValetPoints(response?.results || []);
    } catch (error) {
      let err_msg = Error(error);
      toastContext.showToast(err_msg, 'long', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setSubmitLoading(true);
    try {
      if (!currentNfcId) {
        toastContext.showToast('Card not found', 'short', 'error');
        handleClose();
        return;
      }

      await acceptDeliveryRequest(currentNfcId, selectedValet);
      toastContext.showToast('Delivery request sent', 'short', 'success');
      setConfirmModal(false);
      onConfirmed && onConfirmed(selectedValet);
      handleClose();
    } catch (error) {
      let err_msg = Error(error);
      toastContext.showToast(err_msg, 'long', 'error');
      handleClose();
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={false}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? Colors.container_dark_bg : Colors.white },
          ]}
        >
          {/* Title */}
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? '#4FB7C5' : Colors.font_primary },
            ]}
          >
            Delivery Request
          </Text>

          {loading || submitLoading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text
                style={[
                  styles.loadingText,
                  { color: isDarkMode ? Colors.white : Colors.font_secondary },
                ]}
              >
                Loading...
              </Text>
            </View>
          ) : (
            <>
              <Text
                style={[
                  styles.label,
                  { color: isDarkMode ? Colors.white : Colors.font_secondary },
                ]}
              >
                Choose the valet point
              </Text>
              <Dropdown
                data={valetPoints}
                labelField="name"
                valueField="id"
                placeholder="Select Point"
                value={selectedValet}
                onChange={item => setSelectedValet(item.id)}
                style={[
                  styles.dropdown,
                  { borderColor: isDarkMode ? '#444' : '#CFCFCF' },
                ]}
                placeholderStyle={{ color: '#888', fontFamily: 'Inter-Regular' }}
                selectedTextStyle={{
                  color: isDarkMode ? Colors.white : Colors.font_primary,
                }}
              />

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: isDarkMode
                        ? Colors.small_container_dark_bg
                        : '#F5F5F5',
                      borderWidth: isDarkMode ? 0 : 1,
                      borderColor: isDarkMode ? 'transparent' : '#E0E0E0',
                    },
                  ]}
                  onPress={handleClose}
                  disabled={submitLoading}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: isDarkMode ? Colors.white : '#666666' },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    !selectedValet && { opacity: 0.6 },
                  ]}
                  disabled={!selectedValet || submitLoading}
                  onPress={() => setConfirmModal(true)}
                >
                  <Text style={[styles.buttonText, styles.saveButtonText]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={confirmModal}
        onRequestClose={() => setConfirmModal(false)}
        onConfirm={handleConfirm}
        title="Confirm Delivery Request"
        message="Are you sure you want to raise a delivery request?"
        confirmText="Yes, Proceed"
        cancelText="Cancel"
      />

    </Modal>
  );
};

export default DeliveryRequestModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    maxHeight: height * 0.85,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 28,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    marginTop: 8,
    lineHeight: 22,
    alignSelf: 'flex-start',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 55,
    marginBottom: 25,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '6%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 22,
  },
  saveButtonText: {
    color: Colors.white,
  },
  loadingWrapper: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});
