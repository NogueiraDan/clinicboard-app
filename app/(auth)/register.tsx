import { formatters } from "@/utils/formatters";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/providers/auth-provider";
import { User } from "@/types";

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  // Callbacks memoizados para navegação
  const navigateToLogin = useCallback(() => {
    router.push("/(auth)/login");
  }, []);

  const navigateBack = useCallback(() => {
    router.push("/(auth)/onboarding");
  }, []);

  // Inicialização do TanStack Form
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const data: User = {
          name: value.name,
          email: value.email,
          contact: value.contact,
          password: value.password,
        };
        await signUp(data);
        // Navegação automática será feita pelo AuthProvider
      } catch {
        Alert.alert(
          "Erro no Cadastro",
          "Ocorreu um erro ao criar sua conta. Tente novamente."
        );
      }
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
          <ThemedText style={styles.title}>Criar Conta</ThemedText>
          <ThemedText style={styles.subtitle}>
            Preencha os dados para criar sua conta
          </ThemedText>

          <View style={styles.form}>
            <form.Field
              name="name"
              validators={{
                onBlur: ({ value }) => {
                  if (value.trim().length < 2) {
                    return "Nome deve ter pelo menos 2 caracteres";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Nome Completo
                  </ThemedText>
                  <Input
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="Seu nome completo"
                    autoCapitalize="words"
                    autoComplete="name"
                    isRequired
                    style={styles.input}
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  />
                  {!field.state.meta.isValid && (
                    <ThemedText style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </ThemedText>
                  )}
                </View>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) => {
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
                  {!field.state.meta.isValid && (
                    <ThemedText style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </ThemedText>
                  )}
                </View>
              )}
            </form.Field>

            <form.Field
              name="contact"
              validators={{
                onBlur: ({ value }) => {
                  if (!value.trim()) {
                    return "Contato é obrigatório";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Telefone</ThemedText>
                  <View style={styles.phoneContainer}>
                    <View style={styles.phonePrefix}>
                      <ThemedText style={styles.phonePrefixText}>
                        +55
                      </ThemedText>
                    </View>
                    <View style={styles.phoneInputWrapper}>
                      <Input
                        value={field.state.value.replace(/^\+55/, "")}
                        onChangeText={(value) => {
                          field.handleChange(
                            formatters.formatContactToBrazilE164(value)
                          );
                        }}
                        onBlur={field.handleBlur}
                        placeholder="11987654321"
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        autoComplete="tel"
                        isRequired
                        style={styles.phoneInput}
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        maxLength={11}
                      />
                    </View>
                  </View>
                  {!field.state.meta.isValid && (
                    <ThemedText style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </ThemedText>
                  )}
                </View>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onBlur: ({ value }) => {
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
                    autoComplete="new-password"
                    isRequired
                    style={styles.input}
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  />
                  {!field.state.meta.isValid && (
                    <ThemedText style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </ThemedText>
                  )}
                </View>
              )}
            </form.Field>

            <Button
              title="Criar Conta"
              onPress={form.handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
              style={styles.buttonPrimary}
              textStyle={styles.buttonPrimaryText}
            />

            <View
              style={[
                { paddingBottom: Math.max(insets.bottom, 16) },
                styles.linksContainer,
              ]}
            >
              <ThemedText style={styles.linkText}>
                Já possui conta?
                <ThemedText
                  style={styles.linkHighlight}
                  onPress={navigateToLogin}
                >
                  Entrar
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
    marginTop: 16,
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
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    fontWeight: Platform.OS === "ios" ? "500" : "normal",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 0,
  },
  phonePrefix: {
    backgroundColor: "#1A1F3A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderRightWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    minWidth: 60,
    height: 54,
  },
  phonePrefixText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  phoneInputWrapper: {
    flex: 1,
  },
  phoneInput: {
    backgroundColor: "#1A1F3A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#fff",
    borderLeftWidth: 0,
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
