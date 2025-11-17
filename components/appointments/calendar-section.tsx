import { ThemedText } from "@/components/themed-text";
import { calendarTheme } from "@/constants/theme";
import { Appointment } from "@/types";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
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

    const handleDayPress = React.useCallback(
      (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
        onDateSelect(day.dateString);
      },
      [onDateSelect]
    );

    const handleAppointmentPress = React.useCallback(
      (appointment: Appointment) => {
        Alert.alert(
          "Detalhes do Agendamento",
          `Horário: ${appointment.hour}\nTipo: ${appointment.type}`,
          [
            {
              text: "Fechar",
              style: "cancel",
            },
            {
              text: "Ver Detalhes",
              style: "default",
              onPress: () => {
                // TODO: Implementar navegação para tela de detalhes
              },
            },
          ],
          { cancelable: true }
        );
      },
      []
    );

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
