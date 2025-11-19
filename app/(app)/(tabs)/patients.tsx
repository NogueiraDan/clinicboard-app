import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePatients } from "@/hooks/tanstack/use-patients";
import { Patient } from "@/types";
    
interface PatientItemProps {
  patient: Patient;
  onPress: (patientId: string) => void;
}

const PatientItem = React.memo<PatientItemProps>(({ patient, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(patient.id ?? "");
  }, [patient.id, onPress]);

  const formattedPhone = useMemo(() => {
    return patient.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }, [patient.phone]);

  const initials = useMemo(() => {
    const names = patient.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return patient.name.substring(0, 2).toUpperCase();
  }, [patient.name]);

  return (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.patientAvatar}>
        <ThemedText style={styles.avatarText}>{initials}</ThemedText>
      </View>
      <View style={styles.patientInfo}>
        <ThemedText style={styles.patientName} numberOfLines={1}>
          {patient.name}
        </ThemedText>
        <ThemedText style={styles.patientDetail} numberOfLines={1}>
          {patient.email}
        </ThemedText>
        <ThemedText style={styles.patientDetail} numberOfLines={1}>
          {formattedPhone}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.4)" />
    </TouchableOpacity>
  );
});

PatientItem.displayName = "PatientItem";

export default function PatientsScreen() {
  const { patients, isFetching } = usePatients();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);


  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;

    const query = searchQuery.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.includes(query)
    );
  }, [patients, searchQuery]);

  const handlePatientPress = useCallback((patientId: string) => {
    router.push(`/(app)/patient-details/${patientId}`);
  }, []);

  const handleAddPatient = useCallback(() => {
    router.push("/(app)/patient-registration");
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simular reload de dados
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Aqui seria chamada a API real para recarregar os dados
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a lista de pacientes");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const keyExtractor = useCallback((item: Patient) => item.id, []);

  const renderPatientItem = useCallback(
    ({ item }: { item: Patient }) => (
      <PatientItem patient={item} onPress={handlePatientPress} />
    ),
    [handlePatientPress]
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="people" size={80} color="rgba(255, 255, 255, 0.2)" />
        <ThemedText style={styles.emptyTitle}>
          {searchQuery
            ? "Nenhum paciente encontrado"
            : "Nenhum paciente cadastrado"}
        </ThemedText>
        <ThemedText style={styles.emptySubtitle}>
          {searchQuery
            ? "Tente buscar com outros termos"
            : "Cadastre seu primeiro paciente para começar"}
        </ThemedText>
      </View>
    ),
    [searchQuery]
  );

  const headerComponent = useMemo(
    () => (
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pacientes..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [searchQuery]
  );

  if (isFetching) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LoadingSpinner />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Pacientes</ThemedText>
        <View style={styles.headerIcon} />
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#5B67CA"
            colors={["#5B67CA"]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={15}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={false}
      />

      {/* FAB - Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddPatient}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add" size={28} color="#fff" />
      </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1F3A",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    minHeight: 20,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1F3A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#5B67CA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
  },
  patientInfo: {
    flex: 1,
    gap: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  patientDetail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5B67CA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B67CA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});