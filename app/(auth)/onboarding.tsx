import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';

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

  // Responsividade baseada na largura da tela
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 350;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={[styles.logo, isSmallScreen && { width: 56, height: 56 }]}
          resizeMode="contain"
          accessibilityLabel="Logo ClinicBoard"
        />
      </View>
      <View style={styles.content}>
        <ThemedText
          style={[
            styles.mainTitle,
            isSmallScreen && { fontSize: 28, lineHeight: 34 },
          ]}
          accessibilityRole="header"
          accessibilityLabel="Clinicboard, é praticidade"
        >
          Clinicboard, é{"\n"}praticidade
        </ThemedText>
        <ThemedText
          style={[
            styles.description,
            isSmallScreen && { fontSize: 14, lineHeight: 20 },
          ]}
          accessibilityLabel="Centralize os atendimentos do consultório em um só lugar e tenha o controle com acesso fácil, simples e objetivo."
        >
          Centralize os atendimentos do consultório em um só lugar e tenha o controle com acesso fácil, simples e objetivo.
        </ThemedText>
        <Button
          title="Sobre nós"
          variant="primary"
          style={[styles.aboutButton, styles.buttonWeb, isSmallScreen && { minWidth: 120, paddingVertical: 10 }]}
          onPress={() => router.push('/(auth)/about')}
          accessibilityLabel="Sobre nós"
          accessibilityRole="button"
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="Fazer Login"
          onPress={navigateToLogin}
          variant="primary"
          style={[styles.buttonHalf, styles.buttonWeb, isSmallScreen && { paddingVertical: 10 }]}
          accessibilityLabel="Fazer Login"
          accessibilityRole="button"
        />
        <Button
          title="Cadastre-se"
          onPress={navigateToRegister}
          variant="primary"
          style={[styles.buttonHalf, styles.buttonWeb, isSmallScreen && { paddingVertical: 10 }]}
          accessibilityLabel="Cadastre-se"
          accessibilityRole="button"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    backgroundColor: '#000', // fundo escuro
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: 38,
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
    color: '#fff',
    marginBottom: 32,
    lineHeight: 44,
    letterSpacing: 0.2,
  },
  description: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    opacity: 0.92,
    marginBottom: 32,
    lineHeight: 28,
    paddingHorizontal: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  buttonHalf: {
    flex: 1,
    minWidth: 0,
  },
  aboutButton: {
    alignSelf: 'center',
    marginTop: 8,
    minWidth: 160,
    paddingVertical: 12,
  },
  buttonWeb: {
    backgroundColor: '#10213A',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 0,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});