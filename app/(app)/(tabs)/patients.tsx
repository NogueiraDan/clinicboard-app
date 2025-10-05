import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Colors, Fonts } from '@/constants/theme';
import { Metrics } from '@/constants/metrics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Patient } from '@/types';

// Mock data - substituir por hook de dados reais
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1985-03-15',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    emergencyContact: {
      name: 'Maria Silva',
      phone: '(11) 88888-8888',
      relationship: 'Esposa',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Ana Santos',
    email: 'ana@email.com',
    phone: '(11) 77777-7777',
    birthDate: '1990-07-22',
    address: {
      street: 'Avenida Paulista',
      number: '456',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    emergencyContact: {
      name: 'Carlos Santos',
      phone: '(11) 66666-6666',
      relationship: 'Pai',
    },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
];

interface PatientItemProps {
  patient: Patient;
  onPress: (patientId: string) => void;
}

const PatientItem = React.memo<PatientItemProps>(({ patient, onPress }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handlePress = useCallback(() => {
    onPress(patient.id);
  }, [patient.id, onPress]);

  const formattedPhone = useMemo(() => {
    return patient.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }, [patient.phone]);

  return (
    <TouchableOpacity
      style={[styles.patientItem, { borderBottomColor: colors.icon }]}
      onPress={handlePress}
      activeOpacity={Metrics.touchableOpacity}
    >
      <ThemedView style={styles.patientInfo}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {patient.name}
        </ThemedText>
        <ThemedText style={[styles.patientDetail, { color: colors.icon }]} numberOfLines={1}>
          {patient.email}
        </ThemedText>
        <ThemedText style={[styles.patientDetail, { color: colors.icon }]} numberOfLines={1}>
          {formattedPhone}
        </ThemedText>
      </ThemedView>
      
      <IconSymbol
        name="chevron.right"
        size={Metrics.iconSize.md}
        color={colors.icon}
      />
    </TouchableOpacity>
  );
});

PatientItem.displayName = 'PatientItem';

export default function PatientsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    router.push('/(app)/patient-registration');
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simular reload de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Aqui seria chamada a API real para recarregar os dados
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a lista de pacientes');
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

  const renderEmptyState = useCallback(() => (
    <ThemedView style={styles.emptyContainer}>
      <IconSymbol
        name="person.2.fill"
        size={64}
        color={colors.icon}
        style={styles.emptyIcon}
      />
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        {searchQuery ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
      </ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: colors.icon }]}>
        {searchQuery
          ? 'Tente buscar com outros termos'
          : 'Cadastre seu primeiro paciente para começar'}
      </ThemedText>
    </ThemedView>
  ), [colors.icon, searchQuery]);

  const headerComponent = useMemo(() => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Pacientes</ThemedText>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddPatient}
          activeOpacity={Metrics.touchableOpacity}
        >
          <IconSymbol
            name="plus"
            size={Metrics.iconSize.md}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={[styles.searchContainer, { borderColor: colors.icon }]}>
        <IconSymbol
          name="magnifyingglass"
          size={Metrics.iconSize.md}
          color={colors.icon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar pacientes..."
          placeholderTextColor={colors.icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <IconSymbol
              name="xmark.circle.fill"
              size={Metrics.iconSize.md}
              color={colors.icon}
            />
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  ), [colors, searchQuery, handleAddPatient]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <LoadingSpinner />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
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
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={15}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  header: {
    padding: Metrics.padding.lg,
    gap: Metrics.margin.md,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Metrics.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Metrics.borderRadius.md,
    paddingHorizontal: Metrics.padding.md,
    paddingVertical: Metrics.padding.sm,
    gap: Metrics.margin.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Metrics.fontSize.md,
    fontFamily: Fonts.sans,
    minHeight: 20,
  },
  clearButton: {
    padding: 4,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.padding.lg,
    paddingVertical: Metrics.padding.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  patientInfo: {
    flex: 1,
    gap: 4,
  },
  patientDetail: {
    fontSize: Metrics.fontSize.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Metrics.padding.xl,
    paddingVertical: Metrics.padding.xl * 2,
  },
  emptyIcon: {
    marginBottom: Metrics.margin.lg,
    opacity: 0.3,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: Metrics.margin.sm,
  },
  emptySubtitle: {
    textAlign: 'center',
    fontSize: Metrics.fontSize.sm,
  },
});