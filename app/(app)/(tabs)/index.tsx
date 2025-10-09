
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

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
    <ThemedView style={styles.container}>
      <View style={styles.innerContent}>
        <ThemedText
          type="title"
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={`Olá, ${user?.name}!`}
        >
          Olá, {user?.name}!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Bem-vindo ao seu dashboard
        </ThemedText>

        <View style={styles.sectionBox}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Atendimentos de Hoje
          </ThemedText>
          <ThemedText style={styles.noAppointments}>
            Nenhum atendimento agendado para hoje
          </ThemedText>
        </View>

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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
    color: '#fff',
    marginBottom: 10,
    lineHeight: 44,
    letterSpacing: 0.2,
    alignSelf: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 17,
    opacity: 0.85,
    marginBottom: 32,
    textAlign: 'center',
    alignSelf: 'center',
  },
  sectionBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    letterSpacing: 0.1,
    textAlign: 'center',
    alignSelf: 'center',
  },
  noAppointments: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.85,
    textAlign: 'center',
    alignSelf: 'center',
  },
  actionButtons: {
    gap: 16,
    marginTop: 0,
    width: '100%',
  },
  buttonWeb: {
    backgroundColor: '#10213A',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'stretch',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonWebText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.1,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'stretch',
    width: '100%',
  },
  buttonOutlineText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.1,
    opacity: 0.7,
  },
});