import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={[styles.logo, isSmallScreen && { width: 64, height: 64 }]}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <ThemedText
          style={[
            styles.mainTitle,
            isSmallScreen && { fontSize: 32, lineHeight: 40 },
          ]}
        >
          Clinicboard, é{"\n"}praticidade
        </ThemedText>
        <ThemedText
          style={[
            styles.description,
            isSmallScreen && { fontSize: 15, lineHeight: 22 },
          ]}
        >
          Centralize os atendimentos do consultório em um só lugar e tenha o controle com acesso fácil, simples e objetivo.
        </ThemedText>
        
        <Button
          title="Sobre nós"
          onPress={() => router.push('/(auth)/about')}
          style={styles.aboutButton}
          textStyle={styles.aboutButtonText}
        />
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomSection}>
        <Button
          title="Fazer Login"
          onPress={navigateToLogin}
          style={styles.loginButton}
          textStyle={styles.loginButtonText}
        />
        <Button
          title="Cadastre-se"
          onPress={navigateToRegister}
          style={styles.registerButton}
          textStyle={styles.registerButtonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  logoSection: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#1A1F3A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B67CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 72,
    height: 72,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 48,
    letterSpacing: 0.5,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  aboutButton: {
    backgroundColor: 'rgba(91, 103, 202, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(91, 103, 202, 0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 160,
  },
  aboutButtonText: {
    color: '#fff',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 50 : 32,
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#5B67CA',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#5B67CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  registerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});