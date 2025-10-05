import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';

export default function DashboardScreen() {
  const { user } = useAuth();

  const navigateToPatientRegistration = () => {
    router.push('/(app)/patient-registration');
  };

  const navigateToPatientsList = () => {
    router.push('/(app)/(tabs)/patients');
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">
          Olá, {user?.name}!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Bem-vindo ao seu dashboard
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Atendimentos de Hoje
        </ThemedText>
        
        {/* Aqui você pode adicionar uma lista dos atendimentos do dia */}
        <ThemedText>Nenhum atendimento agendado para hoje</ThemedText>

        <ThemedView style={styles.actionButtons}>
          <Button
            title="Cadastrar Paciente"
            onPress={navigateToPatientRegistration}
            variant="primary"
          />
          
          <Button
            title="Ver Todos os Pacientes"
            onPress={navigateToPatientsList}
            variant="outline"
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 8,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  actionButtons: {
    gap: 12,
    marginTop: 24,
  },
});