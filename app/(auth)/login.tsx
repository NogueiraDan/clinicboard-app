import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContent}>
          <ThemedText
            type="title"
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="Faça login na sua conta"
          >
            Faça login na sua conta
          </ThemedText>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <Input
                value={form.email}
                onChangeText={(email) =>
                  setForm((prev) => ({ ...prev, email }))
                }
                placeholder="john.doe@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors?.email}
                isRequired
                style={styles.input}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Senha</ThemedText>
              <Input
                value={form.password}
                onChangeText={(password) =>
                  setForm((prev) => ({ ...prev, password }))
                }
                placeholder="••••••••••••••"
                secureTextEntry
                autoComplete="password"
                error={errors?.password}
                isRequired
                style={styles.input}
              />
            </View>
              <Button
                title="Entrar"
                onPress={handleLogin}
                isLoading={isLoading}
                disabled={isLoading}
                style={styles.buttonWeb}
                textStyle={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}
              />
            <View style={styles.linksBlockWeb}>
              <View style={styles.linksRowWeb}>
                <ThemedText style={styles.linksLabelWeb}>
                  Não possui conta?
                </ThemedText>
                <ThemedText
                  style={styles.linkPrimaryWeb}
                  onPress={navigateToRegister}
                  accessibilityRole="link"
                  accessibilityLabel="Cadastre-se"
                >
                  Cadastre-se
                </ThemedText>
              </View>
              <ThemedText
                style={styles.linkSecondaryWeb}
                onPress={navigateBack}
                accessibilityRole="link"
                accessibilityLabel="Voltar para home"
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
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  innerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    textAlign: "left",
    fontSize: 38,
    fontWeight: Platform.OS === "ios" ? "800" : "bold",
    color: "#fff",
    marginBottom: 32,
    lineHeight: 44,
    letterSpacing: 0.2,
    alignSelf: "flex-start",
  },
  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  inputGroup: {
    marginBottom: 12,
    width: "100%",
  },
  input: {
    width: "100%",
    backgroundColor: "#F3F6FF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222",
    borderWidth: 0,
    marginBottom: 8,
    alignSelf: "stretch",
  },
  inputLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 2,
  },
  linkWeb: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 8,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  buttonWeb: {
    backgroundColor: "#E6E6E6",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 24,
    alignSelf: "stretch",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonWebText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 0.1,
  },
  linksBlockWeb: {
    marginTop: 8,
    width: "100%",
    alignItems: "flex-start",
  },
  linksRowWeb: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  linksLabelWeb: {
    color: "#fff",
    fontSize: 17,
    marginRight: 6,
    fontWeight: "bold",
    opacity: 1,
  },
  linkPrimaryWeb: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textDecorationLine: "none",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  linkSecondaryWeb: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textDecorationLine: "none",
    opacity: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
