import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/providers/auth-provider';

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await signIn(form.email, form.password);
      // Navegação automática será feita pelo AuthProvider
    } catch (error) {
      Alert.alert(
        'Erro no Login',
        'Credenciais inválidas. Verifique seu email e senha.'
      );
    }
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
  };

  const navigateBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Entrar
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Entre com suas credenciais para acessar sua conta
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <Input
            label="Email"
            value={form.email}
            onChangeText={(email) => setForm(prev => ({ ...prev, email }))}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            isRequired
          />

          <Input
            label="Senha"
            value={form.password}
            onChangeText={(password) => setForm(prev => ({ ...prev, password }))}
            placeholder="Digite sua senha"
            secureTextEntry
            autoComplete="password"
            error={errors.password}
            isRequired
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
            variant="primary"
          />

          <Button
            title="Criar uma conta"
            onPress={navigateToRegister}
            variant="outline"
            disabled={isLoading}
          />

          <Button
            title="Voltar"
            onPress={navigateBack}
            variant="secondary"
            disabled={isLoading}
          />
        </ThemedView>
      </ScrollView>

      {isLoading && <LoadingSpinner overlay />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 80,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
});