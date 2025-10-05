import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';

export default function OnboardingScreen() {
  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Bem-vindo ao ClinicBoard
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Gerencie seus pacientes e atendimentos de forma simples e eficiente
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Fazer Login" 
          onPress={navigateToLogin}
          variant="primary"
        />
        
        <Button 
          title="Criar Conta" 
          onPress={navigateToRegister}
          variant="secondary"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 32,
  },
});