import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface InfoCard {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function ClinicScreen() {
  const handleBack = React.useCallback(() => {
    router.back();
  }, []);

  const clinicInfo: InfoCard[] = React.useMemo(
    () => [
      {
        id: "name",
        label: "Nome da Clínica",
        value: "ClinicBoard - Gestão Médica",
        icon: "business",
      },
      {
        id: "address",
        label: "Endereço",
        value: "Rua das Flores, 123 - Centro",
        icon: "location",
      },
      {
        id: "phone",
        label: "Telefone",
        value: "(11) 98765-4321",
        icon: "call",
      },
      {
        id: "email",
        label: "E-mail",
        value: "contato@clinicboard.com.br",
        icon: "mail",
      },
      {
        id: "hours",
        label: "Horário de Funcionamento",
        value: "Seg-Sex: 8h às 18h",
        icon: "time",
      },
    ],
    []
  );

  const renderInfoCard = React.useCallback((item: InfoCard) => (
    <View key={item.id} style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={item.icon} size={24} color="#5B67CA" />
      </View>
      <View style={styles.infoContent}>
        <ThemedText style={styles.infoLabel}>{item.label}</ThemedText>
        <ThemedText style={styles.infoValue}>{item.value}</ThemedText>
      </View>
    </View>
  ), []);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Minha Clínica</ThemedText>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="business" size={48} color="#5B67CA" />
          </View>
          <ThemedText style={styles.bannerTitle}>
            Informações da Clínica
          </ThemedText>
          <ThemedText style={styles.bannerSubtitle}>
            Gerencie os dados da sua clínica
          </ThemedText>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          {clinicInfo.map(renderInfoCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <ThemedText style={styles.sectionTitle}>Ações Rápidas</ThemedText>
          
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={() => alert("Funcionalidade em desenvolvimento")}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="settings-outline" size={22} color="#5B67CA" />
            </View>
            <ThemedText style={styles.actionLabel}>
              Editar Informações
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255, 255, 255, 0.3)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={() => alert("Funcionalidade em desenvolvimento")}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="people-outline" size={22} color="#5B67CA" />
            </View>
            <ThemedText style={styles.actionLabel}>
              Gerenciar Equipe
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255, 255, 255, 0.3)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={() => alert("Funcionalidade em desenvolvimento")}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="card-outline" size={22} color="#5B67CA" />
            </View>
            <ThemedText style={styles.actionLabel}>
              Planos e Assinatura
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255, 255, 255, 0.3)"
            />
          </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(91, 103, 202, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  banner: {
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(91, 103, 202, 0.2)",
  },
  bannerIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(91, 103, 202, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  infoSection: {
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 16,
    alignItems: "center",
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    letterSpacing: 0.2,
  },
  actionsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 16,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
});
