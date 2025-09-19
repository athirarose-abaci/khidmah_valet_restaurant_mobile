// components/CalendarModal.js
import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getMarkedDates } from '../../helpers/markedDatesHelper';
import { Colors } from '../../constants/customStyles';

const CalendarModal = ({
  visible,
  onClose,
  selectedDate,
  setSelectedDate,
  selectedDateRef,
  onRangeSelected,
  onClear
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Calendar
            markingType={'period'}
            markedDates={getMarkedDates(
              selectedDate?.startDate,
              selectedDate?.endDate
            )}
            onDayPress={(day) => {
              if (!selectedDate?.startDate || (selectedDate?.startDate && selectedDate?.endDate)) {
                const newSelection = { startDate: day.dateString, endDate: null };
                setSelectedDate(newSelection);
                selectedDateRef.current = newSelection;
              } else if (selectedDate?.startDate && !selectedDate?.endDate) {
                const newSelection = { ...selectedDate, endDate: day.dateString };
                setSelectedDate(newSelection);
                selectedDateRef.current = newSelection;

                // ✅ pass the completed range back to parent
                onRangeSelected(newSelection);
              }
            }}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setSelectedDate(null);
              selectedDateRef.current = null;
              onClear?.();
              onClose();
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Clear & Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
});
