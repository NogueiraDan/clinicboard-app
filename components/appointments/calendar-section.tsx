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
    const handleDayPress = React.useCallback(
      (day: { dateString: string }) => {
        onDateSelect(day.dateString);
      },
      [onDateSelect]
    );

    const handleAppointmentPress = React.useCallback(
      (appointment: Appointment) => {
        // TODO: Navegar para tela de detalhes do agendamento
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

    return (
      <View style={styles.sectionBox}>
        <Calendar
          onDayPress={handleDayPress}
          style={styles.calendar}
          theme={calendarTheme}
        />
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Atendimentos de Hoje
        </ThemedText>
        <AppointmentsList
          appointments={appointments}
          isFetching={isFetching}
          onAppointmentPress={handleAppointmentPress}
        />
      </View>
    );
  }
);

CalendarSection.displayName = "CalendarSection";

const styles = StyleSheet.create({
  sectionBox: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    height: 380,
    width: 300,
    borderRadius: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
    letterSpacing: 0.1,
    textAlign: "center",
    alignSelf: "center",
    marginTop: 16,
  },
});
