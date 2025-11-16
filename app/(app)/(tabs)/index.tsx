import { CalendarSection } from "@/components/appointments/calendar-section";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/tanstack/use-appointments";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function DashboardScreen() {
  const { user } = useAuth();
  const [date, setDate] = React.useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  const { appointments, refetchAppointments, isFetching } =
    useAppointments(date);

  const navigateToPatientRegistration = React.useCallback(() => {
    router.push("/(app)/patient-registration");
  }, []);

  const navigateToPatientsList = React.useCallback(() => {
    router.push("/(app)/(tabs)/patients");
  }, []);

  const handleDateSelect = React.useCallback(
    (dateString: string) => {
      setDate(dateString);
      refetchAppointments();
    },
    [refetchAppointments]
  );

  const welcomeMessage = React.useMemo(
    () => `Olá, ${user?.name}!`,
    [user?.name]
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.innerContent}>
        <ThemedText
          type="title"
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={welcomeMessage}
        >
          {welcomeMessage}
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Bem-vindo ao seu dashboard
        </ThemedText>

        <CalendarSection
          onDateSelect={handleDateSelect}
          appointments={appointments}
          isFetching={isFetching}
        />

        <View style={styles.actionButtons}>
          <Button
            title="Cadastrar Paciente"
            onPress={navigateToPatientRegistration}
            style={styles.buttonWeb}
            textStyle={styles.buttonWebText}
            variant="primary"
          />
          <Button
            title="Ver Todos os Pacientes"
            onPress={navigateToPatientsList}
            style={styles.buttonOutline}
            textStyle={styles.buttonOutlineText}
            variant="outline"
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  innerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: 24,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 38,
    fontWeight: Platform.OS === "ios" ? "800" : "bold",
    color: "#fff",
    marginBottom: 10,
    lineHeight: 44,
    letterSpacing: 0.2,
    alignSelf: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 17,
    opacity: 0.85,
    marginBottom: 32,
    textAlign: "center",
    alignSelf: "center",
  },
  actionButtons: {
    gap: 16,
    marginTop: 0,
    width: "100%",
  },
  buttonWeb: {
    backgroundColor: "#10213A",
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: "stretch",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonWebText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 0.1,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: "stretch",
    width: "100%",
  },
  buttonOutlineText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 0.1,
    opacity: 0.7,
  },
});
