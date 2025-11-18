import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/providers/auth-provider";

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
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (form.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
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
        "Erro no Login",
        "Credenciais inválidas. Verifique seu email e senha."
      );
    }
  };

  const navigateToRegister = () => {
    router.push("/(auth)/register");
  };

  const navigateBack = () => {
    router.push("/(auth)/onboarding");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContent}>
          <ThemedText style={styles.title}>
            Bem-vindo de volta
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Faça login para continuar
          </ThemedText>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <Input
                value={form.email}
                onChangeText={(email) =>
                  setForm((prev) => ({ ...prev, email }))
                }
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors?.email}
                isRequired
                style={styles.input}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Senha</ThemedText>
              <Input
                value={form.password}
                onChangeText={(password) =>
                  setForm((prev) => ({ ...prev, password }))
                }
                placeholder="••••••••"
                secureTextEntry
                autoComplete="password"
                error={errors?.password}
                isRequired
                style={styles.input}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
              />
            </View>
            
            <Button
              title="Entrar"
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={isLoading}
              style={styles.buttonPrimary}
              textStyle={styles.buttonPrimaryText}
            />
            
            <View style={styles.linksContainer}>
              <ThemedText style={styles.linkText}>
                Não possui conta?{" "}
                <ThemedText
                  style={styles.linkHighlight}
                  onPress={navigateToRegister}
                >
                  Cadastre-se
                </ThemedText>
              </ThemedText>
              <ThemedText
                style={styles.linkSecondary}
                onPress={navigateBack}
              >
                Voltar para home
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
      {isLoading && <LoadingSpinner overlay />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 40,
  },
  innerContent: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "#1A1F3A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#fff",
  },
  buttonPrimary: {
    backgroundColor: "#5B67CA",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#5B67CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  linksContainer: {
    gap: 12,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  linkHighlight: {
    color: "#5B67CA",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  linkSecondary: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
});
