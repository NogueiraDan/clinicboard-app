import { CalendarSection } from "@/components/appointments/calendar-section";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Select, SelectOption } from "@/components/ui/select";
import { useAppointments } from "@/hooks/tanstack/use-appointments";
import { usePatients } from "@/hooks/tanstack/use-patients";
import { Patient } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

// Mock de horários disponíveis (08:00 - 21:00)
const AVAILABLE_TIMES = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
];

// Mock de pacientes (temporário - remover quando API voltar)
const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+5511987654321",
    user_id: "mock-user",
    age: "35",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+5511976543210",
    user_id: "mock-user",
    age: "28",
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    phone: "+5511965432109",
    user_id: "mock-user",
    age: "42",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "+5511954321098",
    user_id: "mock-user",
    age: "31",
  },
];

export default function NewAppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const { appointments, isFetching: isFetchingAppointments } = useAppointments(selectedDate);
  const { patients: apiPatients, isFetching: isFetchingPatients, error } = usePatients();

  // TEMPORÁRIO: Usar mock quando API não retornar pacientes (Neon fora do ar)
  const patients = apiPatients && apiPatients.length > 0 ? apiPatients : MOCK_PATIENTS;
  React.useEffect(() => {
    if (patients === MOCK_PATIENTS) {
      console.log("⚠️ Usando MOCK_PATIENTS (Neon fora do ar)");
    }
  }, [patients, isFetchingPatients, error]);

  // Filtrar horários disponíveis (remover os que já têm agendamento)
  const availableTimes = useMemo(() => {
    if (!appointments) return AVAILABLE_TIMES;
    
    const bookedTimes = appointments.map(apt => {
      const date = new Date(apt.date);
      return `${date.getHours().toString().padStart(2, '0')}:00`;
    });
    
    return AVAILABLE_TIMES.filter(time => !bookedTimes.includes(time));
  }, [appointments]);

  // Opções de horário para o Select
  const timeOptions: SelectOption[] = useMemo(() => {
    return availableTimes.map(time => ({
      label: time,
      value: time,
    }));
  }, [availableTimes]);

  // Opções de pacientes para o Select
  const patientOptions: SelectOption[] = useMemo(() => {
    console.log("Gerando patientOptions:", patients);
    if (!patients || patients.length === 0) return [];
    return patients
      .map(patient => ({
        label: patient.name,
        value: patient.id || "",
      }))
      .filter(opt => opt.value !== "");
  }, [patients]);

  const selectedPatient = useMemo(() => {
    return patients?.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleCreateAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedPatientId) {
      Alert.alert(
        "Dados incompletos",
        "Por favor, selecione a data, horário e paciente."
      );
      return;
    }

    // TODO: Implementar criação do agendamento
    const patientName = selectedPatient?.name || "Desconhecido";
    Alert.alert(
      "Agendamento Criado!",
      `Paciente: ${patientName}\nID: ${selectedPatientId}\nData: ${selectedDate}\nHorário: ${selectedTime}`,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const currentMonthYear = useMemo(() => {
    const dateObj = new Date(selectedDate);
    return dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Novo Agendamento</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month/Year Title */}
        <ThemedText style={styles.monthTitle}>
          {currentMonthYear}
        </ThemedText>

        {/* Calendar Section */}
        <CalendarSection
          onDateSelect={handleDateSelect}
          appointments={appointments}
          isFetching={isFetchingAppointments}
        />

        {/* Seleção de Horário */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>HORÁRIO</ThemedText>
          {availableTimes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={32} color="rgba(255, 255, 255, 0.3)" />
              <ThemedText style={styles.emptyText}>
                Nenhum horário disponível nesta data
              </ThemedText>
            </View>
          ) : (
            <Select
              options={timeOptions}
              value={selectedTime}
              onValueChange={setSelectedTime}
              placeholder="Selecione o horário"
            />
          )}
        </View>

        {/* Seleção de Paciente */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>PACIENTE</ThemedText>
          {isFetchingPatients ? (
            <View style={styles.loadingState}>
              <Ionicons name="hourglass-outline" size={32} color="rgba(255, 255, 255, 0.3)" />
              <ThemedText style={styles.loadingText}>Carregando pacientes...</ThemedText>
            </View>
          ) : patientOptions.length > 0 ? (
            <>
              <Select
                options={patientOptions}
                value={selectedPatientId}
                onValueChange={setSelectedPatientId}
                placeholder="Selecione o paciente"
              />
              <ThemedText style={styles.helperText}>
                {patientOptions.length} paciente(s) disponível(is)
              </ThemedText>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={32} color="rgba(255, 255, 255, 0.3)" />
              <ThemedText style={styles.emptyText}>
                Nenhum paciente cadastrado
              </ThemedText>
              <Button
                title="Cadastrar Paciente"
                onPress={() => router.push("/(app)/patient-registration")}
                style={styles.emptyButton}
                textStyle={styles.emptyButtonText}
              />
            </View>
          )}
        </View>

        {/* Botão de Criar Agendamento */}
        <View style={styles.footer}>
          <Button
            title="Criar Agendamento"
            onPress={handleCreateAppointment}
            disabled={!selectedDate || !selectedTime || !selectedPatientId}
            style={[
              styles.createButton,
              (!selectedDate || !selectedTime || !selectedPatientId) && styles.createButtonDisabled,
            ]}
            textStyle={styles.createButtonText}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    marginBottom: 20,
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 1,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: "#1A1F3A",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: "rgba(91, 103, 202, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(91, 103, 202, 0.3)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  emptyButtonText: {
    color: "#5B67CA",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 14,
  },
  loadingState: {
    backgroundColor: "#1A1F3A",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },
  helperText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 8,
    marginLeft: 4,
  },
  footer: {
    marginTop: 32,
  },
  createButton: {
    backgroundColor: "#5B67CA",
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: "#5B67CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: "rgba(91, 103, 202, 0.3)",
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
