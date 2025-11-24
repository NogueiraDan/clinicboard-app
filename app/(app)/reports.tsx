import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface StatCard {
  id: string;
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: string;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

export default function ReportsScreen() {
  const handleBack = React.useCallback(() => {
    router.back();
  }, []);

  const stats: StatCard[] = React.useMemo(
    () => [
      {
        id: "total-patients",
        label: "Total de Pacientes",
        value: 142,
        icon: "people",
        color: "#5B67CA",
        trend: "+12%",
      },
      {
        id: "appointments-month",
        label: "Consultas Este Mês",
        value: 68,
        icon: "calendar",
        color: "#34C759",
        trend: "+8%",
      },
      {
        id: "pending",
        label: "Pendentes",
        value: 12,
        icon: "time",
        color: "#FF9500",
      },
      {
        id: "completed",
        label: "Concluídas",
        value: 56,
        icon: "checkmark-circle",
        color: "#30D158",
      },
    ],
    []
  );

  const renderStatCard = React.useCallback((stat: StatCard) => (
    <View key={stat.id} style={styles.statCard}>
      <View
        style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}
      >
        <Ionicons name={stat.icon} size={28} color={stat.color} />
      </View>
      <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
      <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
      {stat.trend && (
        <View style={styles.trendContainer}>
          <Ionicons name="trending-up" size={14} color="#34C759" />
          <ThemedText style={styles.trendText}>{stat.trend}</ThemedText>
        </View>
      )}
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
        <ThemedText style={styles.headerTitle}>Relatórios</ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <ThemedText style={styles.periodLabel}>Período</ThemedText>
          <View style={styles.periodButtons}>
            {["7D", "30D", "3M", "1A"].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  period === "30D" && styles.periodButtonActive,
                ]}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.periodButtonText,
                    period === "30D" && styles.periodButtonTextActive,
                  ]}
                >
                  {period}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>{stats.map(renderStatCard)}</View>

        {/* Quick Insights */}
        <View style={styles.insightsSection}>
          <ThemedText style={styles.sectionTitle}>
            Insights Rápidos
          </ThemedText>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIconContainer}>
                <Ionicons name="trophy" size={24} color="#FFD700" />
              </View>
              <ThemedText style={styles.insightTitle}>
                Melhor Dia
              </ThemedText>
            </View>
            <ThemedText style={styles.insightValue}>
              Segunda-feira
            </ThemedText>
            <ThemedText style={styles.insightDescription}>
              Média de 15 consultas por segunda-feira
            </ThemedText>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIconContainer}>
                <Ionicons name="trending-up" size={24} color="#34C759" />
              </View>
              <ThemedText style={styles.insightTitle}>
                Crescimento
              </ThemedText>
            </View>
            <ThemedText style={styles.insightValue}>+18%</ThemedText>
            <ThemedText style={styles.insightDescription}>
              Aumento no número de consultas vs. mês anterior
            </ThemedText>
          </View>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
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
  periodContainer: {
    marginBottom: 24,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: "row",
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: "#5B67CA",
    borderColor: "#5B67CA",
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "rgba(255, 255, 255, 0.6)",
  },
  periodButtonTextActive: {
    color: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 8,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 18,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  trendText: {
    fontSize: 12,
    color: "#34C759",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  insightsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  insightCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 8,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 0.2,
  },
  insightValue: {
    fontSize: 28,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: -0.5,
  },
  insightDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    lineHeight: 20,
  },
});
