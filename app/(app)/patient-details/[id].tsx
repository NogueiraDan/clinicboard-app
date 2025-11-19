import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  Alert,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePatient } from "@/hooks/tanstack/use-patient";
import { formatters } from "@/utils/formatters";

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

const ActionButton = React.memo<ActionButtonProps>(
  ({ icon, title, onPress, variant = "secondary" }) => {
    const buttonColors = useMemo(() => {
      if (variant === "primary") {
        return { background: "#5B67CA", text: "#fff" };
      }
      return { background: "#1A1F3A", text: "#fff" };
    }, [variant]);

    return (
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: buttonColors.background },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.actionIconContainer}>
          <Ionicons name={icon} size={24} color={buttonColors.text} />
        </View>
        <ThemedText style={[styles.actionButtonText, { color: buttonColors.text }]}>
          {title}
        </ThemedText>
      </TouchableOpacity>
    );
  }
);

ActionButton.displayName = "ActionButton";

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { patient, isFetching, error, refetch } = usePatient(id || "");

  const formattedData = useMemo(() => {
    if (!patient) return null;

    return {
      phone: formatters.phone(patient.phone),
    };
  }, [patient]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleEditPatient = useCallback(() => {
    Alert.alert(
      "Em desenvolvimento",
      "A funcionalidade de edição estará disponível em breve."
    );
  }, []);

  const handleCallPatient = useCallback(async () => {
    if (!patient?.phone) return;

    const phoneNumber = patient.phone.replace(/\D/g, "");
    const url = `tel:${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Erro", "Não foi possível abrir o app de telefone");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer a ligação");
    }
  }, [patient?.phone]);

  // const handleCallEmergency = useCallback(async () => {
  //   if (!patient?.emergencyContact.phone) return;

  //   const phoneNumber = patient.emergencyContact.phone.replace(/\D/g, "");
  //   const url = `tel:${phoneNumber}`;

  //   try {
  //     const supported = await Linking.canOpenURL(url);
  //     if (supported) {
  //       await Linking.openURL(url);
  //     } else {
  //       Alert.alert("Erro", "Não foi possível abrir o app de telefone");
  //     }
  //   } catch (error) {
  //     Alert.alert("Erro", "Não foi possível fazer a ligação");
  //   }
  // }, [patient?.emergencyContact.phone]);

  const handleScheduleAppointment = useCallback(() => {
    Alert.alert(
      "Em desenvolvimento",
      "A funcionalidade de agendamento estará disponível em breve."
    );
  }, []);

  const handleDeletePatient = useCallback(() => {
    Alert.alert(
      "Excluir Paciente",
      `Tem certeza que deseja excluir ${patient?.name}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            // Simular exclusão
            Alert.alert("Sucesso", "Paciente excluído com sucesso", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
        },
      ]
    );
  }, [patient?.name]);

  if (isFetching) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LoadingSpinner />
      </ThemedView>
    );
  }

  if (error || !patient) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Erro</ThemedText>
          <View style={styles.backButton} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={80} color="rgba(255, 255, 255, 0.2)" />
          <ThemedText style={styles.errorTitle}>
            {error?.message || "Erro desconhecido"}
          </ThemedText>
          <Button
            title="Tentar Novamente"
            onPress={() => refetch()}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {patient.name}
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Detalhes do paciente
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPatient}>
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#5B67CA"
            colors={["#5B67CA"]}
          />
        }
      >
        {/* Ações Rápidas */}
        <View style={styles.actionsContainer}>
          <ActionButton
            icon="call"
            title="Ligar"
            onPress={handleCallPatient}
            variant="primary"
          />
          <ActionButton
            icon="calendar"
            title="Agendar"
            onPress={handleScheduleAppointment}
          />
        </View>

        {/* Informações Pessoais */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="person-circle" size={24} color="#5B67CA" />
            <ThemedText style={styles.infoTitle}>Informações Pessoais</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Nome Completo</ThemedText>
            <ThemedText style={styles.infoValue}>{patient.name}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={styles.infoValue}>{patient.email}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Telefone</ThemedText>
            <ThemedText style={styles.infoValue}>{formattedData?.phone || ""}</ThemedText>
          </View>
        </View>

        {/* Zona de Perigo */}
        <View style={styles.dangerZone}>
          <ThemedText style={styles.dangerTitle}>Zona de Perigo</ThemedText>
          <Button
            title="Excluir Paciente"
            onPress={handleDeletePatient}
            variant="secondary"
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 2,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    letterSpacing: 0.3,
  },
  infoCard: {
    backgroundColor: "#1A1F3A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "500" : "normal",
  },
  dangerZone: {
    marginTop: 8,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#FF6B6B",
    marginBottom: 16,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  deleteButton: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  deleteButtonText: {
    color: "#FF6B6B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#5B67CA",
    paddingHorizontal: 32,
  },
});
