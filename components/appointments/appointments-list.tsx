import { ThemedText } from "@/components/themed-text";
import { Appointment } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  PressableStateCallbackType,
  StyleSheet,
  View,
} from "react-native";

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

const APPOINTMENT_TYPE = {
  MARCACAO: {
    title: "Marcado",
    bg: "rgba(91, 103, 202, 0.08)",
    border: "#5B67CA",
    text: "#fff",
    icon: "calendar" as const,
  },
  REMARCACAO: {
    title: "Remarcado",
    bg: "rgba(124, 58, 237, 0.08)",
    border: "#7C3AED",
    text: "#fff",
    icon: "refresh" as const,
  },
} as const;

const AppointmentItem = React.memo<AppointmentItemProps>(
  ({ appointment, onPress, index }) => {
    const handlePress = React.useCallback(() => {
      onPress?.(appointment);
    }, [appointment, onPress]);

    const colorScheme =
      APPOINTMENT_TYPE[appointment.type as keyof typeof APPOINTMENT_TYPE] ||
      APPOINTMENT_TYPE.MARCACAO;

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
          <Ionicons
            name={colorScheme.icon}
            size={24}
            color={colorScheme.border}
          />
        </View>
        <View style={styles.appointmentInfo}>
          <ThemedText
            style={[styles.appointmentTitle, { color: colorScheme.text }]}
          >
            {APPOINTMENT_TYPE[appointment.type as keyof typeof APPOINTMENT_TYPE]
              ?.title || appointment.type}
          </ThemedText>
          <ThemedText
            style={[styles.appointmentTime, { color: colorScheme.text }]}
          >
            {appointment.hour}
          </ThemedText>
        </View>
        <View>
          <ThemedText style={[styles.badgeText, { color: colorScheme.border }]}>
            <Ionicons
              name={"arrow-forward-circle-sharp"}
              size={28}
              color={colorScheme.border}
            />
          </ThemedText>
        </View>
      </Pressable>
    );
  }
);
AppointmentItem.displayName = "AppointmentItem";

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
AppointmentsList.displayName = "AppointmentsList";

const styles = StyleSheet.create({
  appointmentsContainer: {
    width: "100%",
    gap: 12,
  },
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1F3A",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#5B67CA",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  appointmentCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  appointmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(91, 103, 202, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(91, 103, 202, 0.3)",
  },
  appointmentInfo: {
    flex: 1,
    gap: 4,
  },
  appointmentTitle: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.6,
  },
  appointmentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusText: {
    color: "#fff",
    fontSize: 15,
    opacity: 0.6,
    textAlign: "center",
    paddingVertical: 24,
    fontStyle: "italic",
  },
});
