import { ThemedText } from "@/components/themed-text";
import { calendarTheme } from "@/constants/theme";
import { Appointment } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { AppointmentDetailsModal } from "./appointment-details-modal";
import { AppointmentsList } from "./appointments-list";

interface CalendarSectionProps {
  onDateSelect: (dateString: string) => void;
  appointments: Appointment[] | null;
  isFetching: boolean;
}

export const CalendarSection = React.memo<CalendarSectionProps>(
  ({ onDateSelect, appointments, isFetching }) => {
    const [selectedDate, setSelectedDate] = React.useState<string>(
      new Date().toISOString().split("T")[0]
    );
    const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handleDayPress = React.useCallback(
      (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
        onDateSelect(day.dateString);
      },
      [onDateSelect]
    );

    const handleAppointmentPress = React.useCallback(
      (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsModalVisible(true);
      },
      []
    );

    const handleCloseModal = React.useCallback(() => {
      setIsModalVisible(false);
      setSelectedAppointment(null);
    }, []);

    const markedDates = React.useMemo(() => {
      return {
        [selectedDate]: {
          selected: true,
          selectedColor: '#5B67CA',
        },
      };
    }, [selectedDate]);

    return (
      <View style={styles.container}>
        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            style={styles.calendar}
            theme={calendarTheme}
            enableSwipeMonths={true}
          />
        </View>

        {/* Appointments Section */}
        <View style={styles.appointmentsSection}>
          <ThemedText style={styles.sectionTitle}>
            Atendimentos de Hoje
          </ThemedText>
          <AppointmentsList
            appointments={appointments}
            isFetching={isFetching}
            onAppointmentPress={handleAppointmentPress}
          />
        </View>

        {/* Appointment Details Modal */}
        <AppointmentDetailsModal
          visible={isModalVisible}
          appointment={selectedAppointment}
          onClose={handleCloseModal}
        />
      </View>
    );
  }
);

CalendarSection.displayName = "CalendarSection";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 20,
  },
  calendarCard: {
    backgroundColor: "#1A1F3A",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  appointmentsSection: {
    width: "100%",
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
});
