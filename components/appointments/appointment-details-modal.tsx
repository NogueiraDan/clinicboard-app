import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { useDeleteAppointment } from "@/hooks/tanstack/use-delete-appointment";
import { usePatient } from "@/hooks/tanstack/use-patient";
import { Appointment } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface AppointmentDetailsModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

export const AppointmentDetailsModal: React.FC<
  AppointmentDetailsModalProps
> = ({ visible, appointment, onClose }) => {
  const { patient } = usePatient(appointment?.patient_id || "");
  const { deleteAppointment } = useDeleteAppointment();
  
  const handleDeleteAppointment = React.useCallback((appointmentId: string) => {
    deleteAppointment(appointmentId);
    onClose();
  }, [deleteAppointment, onClose]);

  const appointmentDate = React.useMemo(() => {
    if (!appointment?.date) return "";
    const date = new Date(appointment.date);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [appointment?.date]);

  enum APPOINTMENT_TYPE {
    MARCACAO = "Consulta Marcada",
    REMARCACAO = "Consulta Remarcada",
  }

  if (!appointment) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerIndicator} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                </TouchableOpacity>
              </View>

              {/* Title */}
              <View style={styles.titleSection}>
                <View style={styles.iconContainer}>
                  <Ionicons name="calendar" size={28} color="#5B67CA" />
                </View>
                <ThemedText style={styles.title}>
                  Detalhes do Agendamento
                </ThemedText>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {/* Date Info */}
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#5B67CA"
                      />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <ThemedText style={styles.infoLabel}>Data</ThemedText>
                      <ThemedText style={styles.infoValue}>
                        {appointmentDate}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {/* Time Info */}
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Ionicons name="time-outline" size={20} color="#5B67CA" />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <ThemedText style={styles.infoLabel}>Horário</ThemedText>
                      <ThemedText style={styles.infoValue}>
                        {appointment.hour}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {/* Patient Info */}
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color="#5B67CA"
                      />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <ThemedText style={styles.infoLabel}>Paciente</ThemedText>
                      <ThemedText style={styles.infoValue}>
                        Paciente: {patient?.name}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                
                {/* Type Info */}
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Ionicons
                        name="medical-outline"
                        size={20}
                        color="#5B67CA"
                      />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <ThemedText style={styles.infoLabel}>Tipo</ThemedText>
                      <ThemedText style={styles.infoValue}>
                        {APPOINTMENT_TYPE[appointment.type as keyof typeof APPOINTMENT_TYPE]}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Button
                  title="Fechar"
                  onPress={onClose}
                  style={styles.secondaryButton}
                  textStyle={styles.secondaryButtonText}
                />
                <Button
                  title="Excluir"
                  onPress={() => appointment.id && handleDeleteAppointment(appointment.id)}
                  style={styles.dangerButton}
                  textStyle={styles.dangerButtonText}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1A1F3A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    position: "relative",
  },
  headerIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 12,
    padding: 4,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(91, 103, 202, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    gap: 12,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    letterSpacing: 0.2,
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  secondaryButtonText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  dangerButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  dangerButtonText: {
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
