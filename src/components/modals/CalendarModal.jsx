import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { getMarkedDates } from '../../helpers/markedDatesHelper';
import { Colors } from '../../constants/customStyles';

const CalendarModal = ({
  visible,
  onClose,
  selectedDate,
  setSelectedDate,
  selectedDateRef,
  onRangeSelected,
  onClear,
  isDarkMode = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: isDarkMode ? Colors.container_dark_bg : '#fff'}]}>
          <Calendar
            markingType={'period'}
            markedDates={getMarkedDates(
              selectedDate?.startDate,
              selectedDate?.endDate
            )}
            theme={{
              backgroundColor: isDarkMode ? Colors.container_dark_bg : '#fff',
              calendarBackground: isDarkMode ? Colors.container_dark_bg : '#fff',
              textSectionTitleColor: isDarkMode ? Colors.white : Colors.primary,
              selectedDayBackgroundColor: Colors.secondary,
              selectedDayTextColor: Colors.white,
              todayTextColor: Colors.secondary,
              dayTextColor: isDarkMode ? Colors.white : Colors.black,
              textDisabledColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              dotColor: Colors.secondary,
              selectedDotColor: Colors.white,
              arrowColor: isDarkMode ? Colors.white : Colors.primary,
              disabledArrowColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              monthTextColor: isDarkMode ? Colors.white : Colors.primary,
              indicatorColor: Colors.secondary,
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            onDayPress={(day) => {
              if (!selectedDate?.startDate || (selectedDate?.startDate && selectedDate?.endDate)) {
                const newSelection = { startDate: day.dateString, endDate: null };
                setSelectedDate(newSelection);
                selectedDateRef.current = newSelection;
                console.log('newSelection1',newSelection)
              } else if (selectedDate?.startDate && !selectedDate?.endDate) {
                // Check if the selected date is before the start date
                if (day.dateString < selectedDate.startDate) {
                  // If previous date is selected, make it the new start date
                  const newSelection = { startDate: day.dateString, endDate: null };
                  setSelectedDate(newSelection);
                  selectedDateRef.current = newSelection;
                  console.log('newSelection_previous',newSelection)
                } else {
                  // Normal end date selection
                  const newSelection = { ...selectedDate, endDate: day.dateString };
                  setSelectedDate(newSelection);
                  selectedDateRef.current = newSelection;
                  console.log('newSelection2',newSelection)
                  onRangeSelected(newSelection);
                }
              }
            }}
          />

          <TouchableOpacity
            style={[styles.closeButton, {backgroundColor: Colors.secondary}]}
            onPress={() => {
              setSelectedDate(null);
              selectedDateRef.current = null;
              onClear?.();
              onClose();
            }}
          >
            <Text style={{ color: Colors.white, fontWeight: '600' }}>Clear & Close</Text>
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
    width: '85%',
    borderRadius: 12,
    paddingVertical: 32,
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
