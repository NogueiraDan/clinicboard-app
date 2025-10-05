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

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth();
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

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

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await signUp(form.name, form.email, form.password);
      // Navegação automática será feita pelo AuthProvider
    } catch (error) {
      Alert.alert(
        'Erro no Cadastro',
        'Ocorreu um erro ao criar sua conta. Tente novamente.'
      );
    }
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
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
            Criar Conta
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Preencha os dados para criar sua conta
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <Input
            label="Nome"
            value={form.name}
            onChangeText={(name) => setForm(prev => ({ ...prev, name }))}
            placeholder="Digite seu nome completo"
            autoCapitalize="words"
            autoComplete="name"
            error={errors.name}
            isRequired
          />

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
            autoComplete="new-password"
            error={errors.password}
            isRequired
          />

          <Input
            label="Confirmar Senha"
            value={form.confirmPassword}
            onChangeText={(confirmPassword) => 
              setForm(prev => ({ ...prev, confirmPassword }))
            }
            placeholder="Confirme sua senha"
            secureTextEntry
            autoComplete="new-password"
            error={errors.confirmPassword}
            isRequired
          />

          <Button
            title="Criar Conta"
            onPress={handleRegister}
            isLoading={isLoading}
            disabled={isLoading}
            variant="primary"
          />

          <Button
            title="Já tem uma conta? Entrar"
            onPress={navigateToLogin}
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