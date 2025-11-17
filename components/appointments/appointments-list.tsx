import { ThemedText } from "@/components/themed-text";
import { Appointment } from "@/types";
import { Ionicons } from '@expo/vector-icons';
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
  index: number;
}

const APPOINTMENT_COLORS = [
  { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32', icon: 'fitness' as const },
  { bg: '#FFF3E0', border: '#FF9800', text: '#E65100', icon: 'calendar' as const },
  { bg: '#E3F2FD', border: '#2196F3', text: '#0D47A1', icon: 'medkit' as const },
  { bg: '#FCE4EC', border: '#E91E63', text: '#880E4F', icon: 'time' as const },
];

const AppointmentItem = React.memo<AppointmentItemProps>(
  ({ appointment, onPress, index }) => {
    const handlePress = React.useCallback(() => {
      onPress?.(appointment);
    }, [appointment, onPress]);

    const colorScheme = APPOINTMENT_COLORS[index % APPOINTMENT_COLORS.length];

    const getCardStyle = React.useCallback(
      ({ pressed }: PressableStateCallbackType) => [
        styles.appointmentCard,
        { 
          backgroundColor: colorScheme.bg,
          borderLeftColor: colorScheme.border,
        },
        pressed && styles.appointmentCardPressed,
      ],
      [colorScheme]
    );

    return (
      <Pressable
        style={getCardStyle}
        onPress={handlePress}
        android_ripple={{
          color: colorScheme.border,
          borderless: false,
        }}
        accessibilityRole="button"
        accessibilityLabel={`Agendamento às ${appointment.hour} - ${appointment.type}`}
        accessibilityHint="Toque para ver detalhes do agendamento"
      >
        <View style={styles.appointmentIcon}>
          <Ionicons name={colorScheme.icon} size={20} color={colorScheme.border} />
        </View>
        <View style={styles.appointmentInfo}>
          <ThemedText style={[styles.appointmentTitle, { color: colorScheme.text }]}>
            {appointment.type}
          </ThemedText>
          <ThemedText style={[styles.appointmentTime, { color: colorScheme.text }]}>
            {appointment.hour}
          </ThemedText>
        </View>
        <View style={styles.appointmentBadge}>
          <ThemedText style={[styles.badgeText, { color: colorScheme.border }]}>
            All day
          </ThemedText>
        </View>
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
        {appointments.map((appointment, index) => (
          <AppointmentItem 
            key={appointment.id} 
            appointment={appointment}
            onPress={onAppointmentPress}
            index={index}
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
    gap: 12,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
    gap: 4,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  appointmentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    paddingVertical: 24,
    fontStyle: 'italic',
  },
});