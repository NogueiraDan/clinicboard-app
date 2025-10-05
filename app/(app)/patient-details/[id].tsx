import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientInfoCard } from '@/components/patient/patient-info-card';
import { PatientInfoRow } from '@/components/patient/patient-info-row';
import { Colors } from '@/constants/theme';
import { Metrics } from '@/constants/metrics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePatientData } from '@/hooks/use-patient-data';
import { formatters } from '@/utils/formatters';

interface ActionButtonProps {
  icon: string;
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

const ActionButton = React.memo<ActionButtonProps>(({ 
  icon, 
  title, 
  onPress, 
  variant = 'secondary' 
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const buttonColors = useMemo(() => {
    switch (variant) {
      case 'primary':
        return { background: colors.tint, text: '#FFFFFF', icon: '#FFFFFF' };
      case 'danger':
        return { background: '#FF6B6B', text: '#FFFFFF', icon: '#FFFFFF' };
      default:
        return { background: colors.icon + '20', text: colors.text, icon: colors.icon };
    }
  }, [variant, colors]);

  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: buttonColors.background }]}
      onPress={onPress}
      activeOpacity={Metrics.touchableOpacity}
    >
      <IconSymbol
        name={icon as any}
        size={Metrics.iconSize.md}
        color={buttonColors.icon}
      />
      <ThemedText
        style={[styles.actionButtonText, { color: buttonColors.text }]}
        numberOfLines={1}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
});

ActionButton.displayName = 'ActionButton';

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const { patient, isLoading, error, refetch } = usePatientData(id || '');

  const formattedData = useMemo(() => {
    if (!patient) return null;

    return {
      phone: formatters.phone(patient.phone),
      emergencyPhone: formatters.phone(patient.emergencyContact.phone),
      birthDate: formatters.date(patient.birthDate),
      createdAt: formatters.dateTime(patient.createdAt),
      fullAddress: `${patient.address.street}, ${patient.address.number}${
        patient.address.complement ? `, ${patient.address.complement}` : ''
      }, ${patient.address.neighborhood}, ${patient.address.city} - ${patient.address.state}, ${patient.address.zipCode}`,
    };
  }, [patient]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleEditPatient = useCallback(() => {
    Alert.alert(
      'Em desenvolvimento',
      'A funcionalidade de edição estará disponível em breve.'
    );
  }, []);

  const handleCallPatient = useCallback(async () => {
    if (!patient?.phone) return;

    const phoneNumber = patient.phone.replace(/\D/g, '');
    const url = `tel:${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o app de telefone');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer a ligação');
    }
  }, [patient?.phone]);

  const handleCallEmergency = useCallback(async () => {
    if (!patient?.emergencyContact.phone) return;

    const phoneNumber = patient.emergencyContact.phone.replace(/\D/g, '');
    const url = `tel:${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o app de telefone');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer a ligação');
    }
  }, [patient?.emergencyContact.phone]);

  const handleScheduleAppointment = useCallback(() => {
    Alert.alert(
      'Em desenvolvimento',
      'A funcionalidade de agendamento estará disponível em breve.'
    );
  }, []);

  const handleDeletePatient = useCallback(() => {
    Alert.alert(
      'Excluir Paciente',
      `Tem certeza que deseja excluir ${patient?.name}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // Simular exclusão
            Alert.alert('Sucesso', 'Paciente excluído com sucesso', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
        },
      ]
    );
  }, [patient?.name]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <LoadingSpinner />
      </ThemedView>
    );
  }

  if (error || !patient) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={Metrics.touchableOpacity}
          >
            <IconSymbol
              name="chevron.left"
              size={Metrics.iconSize.md}
              color={colors.icon}
            />
          </TouchableOpacity>
          <ThemedText type="title">Erro</ThemedText>
        </ThemedView>

        <ThemedView style={styles.errorContainer}>
          <IconSymbol
            name="exclamationmark.triangle"
            size={64}
            color={colors.icon}
            style={styles.errorIcon}
          />
          <ThemedText type="subtitle" style={styles.errorTitle}>
            {error || 'Paciente não encontrado'}
          </ThemedText>
          <Button
            title="Tentar Novamente"
            onPress={refetch}
            variant="primary"
          />
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={Metrics.touchableOpacity}
        >
          <IconSymbol
            name="chevron.left"
            size={Metrics.iconSize.md}
            color={colors.icon}
          />
        </TouchableOpacity>
        
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" numberOfLines={1}>
            {patient.name}
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            Detalhes do paciente
          </ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditPatient}
          activeOpacity={Metrics.touchableOpacity}
        >
          <IconSymbol
            name="pencil"
            size={Metrics.iconSize.md}
            color={colors.icon}
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
      >
        {/* Ações Rápidas */}
        <ThemedView style={styles.actionsContainer}>
          <ActionButton
            icon="phone.fill"
            title="Ligar"
            onPress={handleCallPatient}
            variant="primary"
          />
          <ActionButton
            icon="calendar.badge.plus"
            title="Agendar"
            onPress={handleScheduleAppointment}
          />
          <ActionButton
            icon="phone.badge.plus"
            title="Emergência"
            onPress={handleCallEmergency}
          />
        </ThemedView>

        {/* Informações Pessoais */}
        <PatientInfoCard
          title="Informações Pessoais"
          icon="person.circle"
          isEditable
          onEdit={handleEditPatient}
        >
          <PatientInfoRow label="Nome Completo" value={patient.name} />
          <PatientInfoRow label="Email" value={patient.email} />
          <PatientInfoRow label="Telefone" value={formattedData?.phone || ''} />
          <PatientInfoRow 
            label="Data de Nascimento" 
            value={formattedData?.birthDate || ''} 
            isLast
          />
        </PatientInfoCard>

        {/* Endereço */}
        <PatientInfoCard
          title="Endereço"
          icon="house"
          isEditable
          onEdit={handleEditPatient}
        >
          <PatientInfoRow 
            label="Endereço Completo" 
            value={formattedData?.fullAddress || ''} 
            isLast
          />
        </PatientInfoCard>

        {/* Contato de Emergência */}
        <PatientInfoCard
          title="Contato de Emergência"
          icon="person.2"
        >
          <PatientInfoRow 
            label="Nome" 
            value={patient.emergencyContact.name} 
          />
          <PatientInfoRow 
            label="Telefone" 
            value={formattedData?.emergencyPhone || ''} 
          />
          <PatientInfoRow 
            label="Parentesco" 
            value={patient.emergencyContact.relationship} 
            isLast
          />
        </PatientInfoCard>

        {/* Informações Médicas */}
        <PatientInfoCard
          title="Informações Médicas"
          icon="heart.text.square"
          isEditable
          onEdit={handleEditPatient}
        >
          <PatientInfoRow 
            label="Histórico Médico" 
            value={patient.medicalHistory || 'Não informado'} 
          />
          <PatientInfoRow 
            label="Alergias" 
            value={patient.allergies || []} 
            isLast
          />
        </PatientInfoCard>

        {/* Informações do Sistema */}
        <PatientInfoCard
          title="Informações do Sistema"
          icon="info.circle"
        >
          <PatientInfoRow 
            label="Cadastrado em" 
            value={formattedData?.createdAt || ''} 
            isLast
          />
        </PatientInfoCard>

        {/* Ações Perigosas */}
        <ThemedView style={styles.dangerZone}>
          <ThemedText type="defaultSemiBold" style={styles.dangerTitle}>
            Zona de Perigo
          </ThemedText>
          <Button
            title="Excluir Paciente"
            onPress={handleDeletePatient}
            variant="secondary"
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.padding.lg,
    paddingVertical: Metrics.padding.md,
    gap: Metrics.margin.md,
  },
  backButton: {
    padding: Metrics.padding.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: Metrics.fontSize.sm,
    marginTop: 2,
  },
  editButton: {
    padding: Metrics.padding.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Metrics.padding.lg,
    paddingBottom: Metrics.padding.xl,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Metrics.margin.sm,
    marginBottom: Metrics.margin.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: Metrics.padding.md,
    paddingHorizontal: Metrics.padding.sm,
    borderRadius: Metrics.borderRadius.lg,
    gap: Metrics.margin.xs,
  },
  actionButtonText: {
    fontSize: Metrics.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Metrics.padding.xl,
  },
  errorIcon: {
    marginBottom: Metrics.margin.lg,
    opacity: 0.3,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: Metrics.margin.lg,
  },
  dangerZone: {
    marginTop: Metrics.margin.xl,
    paddingTop: Metrics.padding.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#FF6B6B30',
  },
  dangerTitle: {
    color: '#FF6B6B',
    marginBottom: Metrics.margin.md,
    textAlign: 'center',
  },
});