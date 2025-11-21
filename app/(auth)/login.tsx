import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import React, { useCallback } from "react";
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

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();

  // Callbacks memoizados para navegação
  const navigateToRegister = useCallback(() => {
    router.push("/(auth)/register");
  }, []);

  const navigateBack = useCallback(() => {
    router.push("/(auth)/onboarding");
  }, []);

  // Inicialização do TanStack Form
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn(value.email, value.password);
        // Navegação automática será feita pelo AuthProvider
      } catch {
        Alert.alert(
          "Erro no Login",
          "Credenciais inválidas. Verifique seu email e senha."
        );
      }
    },
    onSubmitInvalid: () => {
      Alert.alert(
        "Campos Obrigatórios",
        "Por favor, preencha todos os campos corretamente."
      );
    },
  });

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
          <ThemedText style={styles.title}>Bem-vindo de volta</ThemedText>
          <ThemedText style={styles.subtitle}>
            Faça login para continuar
          </ThemedText>

          <View style={styles.form}>
              {/* Campo de Email com validação */}
              <form.Field
                name="email"
                validators={{
                  onSubmit: ({ value }) => {
                    if (!value.trim()) {
                      return "Email é obrigatório";
                    }
                    if (!/\S+@\S+\.\S+/.test(value)) {
                      return "Email inválido";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>Email</ThemedText>
                    <Input
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      placeholder="seu@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      isRequired
                      style={styles.input}
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                  </View>
                )}
              </form.Field>

              {/* Campo de Senha com validação */}
              <form.Field
                name="password"
                validators={{
                  onSubmit: ({ value }) => {
                    if (!value.trim()) {
                      return "Senha é obrigatória";
                    }
                    if (value.length < 6) {
                      return "Senha deve ter pelo menos 6 caracteres";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>Senha</ThemedText>
                    <Input
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      placeholder="••••••••"
                      secureTextEntry
                      autoComplete="password"
                      isRequired
                      style={styles.input}
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                  </View>
                )}
              </form.Field>

              {/* Botão de Submit com estado do formulário */}
              <form.Subscribe
                selector={(state) => ({
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ isSubmitting }) => (
                  <Button
                    title="Entrar"
                    onPress={form.handleSubmit}
                    isLoading={isSubmitting || isLoading}
                    disabled={isSubmitting || isLoading}
                    style={styles.buttonPrimary}
                    textStyle={styles.buttonPrimaryText}
                  />
                )}
              </form.Subscribe>

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
                <ThemedText style={styles.linkSecondary} onPress={navigateBack}>
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
