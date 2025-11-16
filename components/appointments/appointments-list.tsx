import { ThemedText } from "@/components/themed-text";
import { Appointment } from "@/types";
import React from "react";
import { Pressable, PressableStateCallbackType, StyleSheet, View } from "react-native";

interface AppointmentsListProps {
  appointments: Appointment[] | null;
  isFetching: boolean;
  onAppointmentPress?: (appointment: Appointment) => void;
}

interface AppointmentItemProps {
  appointment: Appointment;
  onPress?: (appointment: Appointment) => void;
}

const AppointmentItem = React.memo<AppointmentItemProps>(
  ({ appointment, onPress }) => {
    const handlePress = React.useCallback(() => {
      onPress?.(appointment);
    }, [appointment, onPress]);

    const getCardStyle = React.useCallback(
      ({ pressed }: PressableStateCallbackType) => [
        styles.appointmentCard,
        pressed && styles.appointmentCardPressed,
      ],
      []
    );

    return (
      <Pressable
        style={getCardStyle}
        onPress={handlePress}
        android_ripple={{
          color: 'rgba(255, 255, 255, 0.1)',
          borderless: false,
        }}
        accessibilityRole="button"
        accessibilityLabel={`Agendamento às ${appointment.hour} - ${appointment.type}`}
        accessibilityHint="Toque para ver detalhes do agendamento"
      >
        <ThemedText style={styles.appointmentText}>
          {appointment.hour} - {appointment.type}
        </ThemedText>
      </Pressable>
    );
  }
);
AppointmentItem.displayName = 'AppointmentItem';

export const AppointmentsList = React.memo<AppointmentsListProps>(
  ({ appointments, isFetching, onAppointmentPress }) => {
    const hasAppointments = appointments && appointments.length > 0;

    if (isFetching) {
      return <ThemedText style={styles.statusText}>Carregando...</ThemedText>;
    }

    if (!hasAppointments) {
      return (
        <ThemedText style={styles.statusText}>
          Nenhum atendimento agendado para a data selecionada.
        </ThemedText>
      );
    }

    return (
      <View style={styles.appointmentsContainer}>
        {appointments.map((appointment) => (
          <AppointmentItem 
            key={appointment.id} 
            appointment={appointment}
            onPress={onAppointmentPress}
          />
        ))}
      </View>
    );
  }
);
AppointmentsList.displayName = 'AppointmentsList';

const styles = StyleSheet.create({
  appointmentsContainer: {
    width: '100%',
    gap: 8,
    paddingHorizontal: 4,
  },
  appointmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentCardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 0.98 }],
  },
  appointmentText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.85,
    textAlign: 'center',
    alignSelf: 'center',
    fontStyle: 'italic',
  },
});