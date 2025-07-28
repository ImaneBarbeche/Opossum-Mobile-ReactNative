import * as React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../theme';

interface DateTimeSelectorProps {
  date: Date;
  setDate: (v: Date) => void;
  showDatePicker: boolean;
  setShowDatePicker: (v: boolean) => void;
  showTimePicker: boolean;
  setShowTimePicker: (v: boolean) => void;
  onDateChange: (event: any, selectedDate?: Date) => void;
  onTimeChange: (event: any, selectedTime?: Date) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  date, setDate, showDatePicker, setShowDatePicker, showTimePicker, setShowTimePicker, onDateChange, onTimeChange
}) => (
  <>
    <Text style={{ fontSize: 15, marginBottom: 4, alignSelf: 'flex-start' }}>Quand l'avez-vous perdu/trouvé&nbsp;?</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, width: '100%' }}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.mediumGray, marginRight: 8, minWidth: 120 }} onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar" size={20} color={colors.primary} />
        <Text style={{ marginLeft: 6, fontSize: 15 }}>{date.toLocaleDateString('fr-FR')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.mediumGray, marginRight: 8, minWidth: 120 }} onPress={() => setShowTimePicker(true)}>
        <Ionicons name="time" size={20} color={colors.primary} />
        <Text style={{ marginLeft: 6, fontSize: 15 }}>{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
    </View>
    {showDatePicker && (
      <DateTimePicker
        value={date}
        mode="date"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onDateChange}
      />
    )}
    {showTimePicker && (
      <DateTimePicker
        value={date}
        mode="time"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onTimeChange}
      />
    )}
  </>
);

export default DateTimeSelector;
