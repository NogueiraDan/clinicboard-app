import { formatters } from "@/utils/formatters";
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
import { User } from "@/types";

interface RegisterForm {
  name: string;
  email: string;
  contact: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  contact?: string;
  password?: string;
}

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    contact: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

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

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const data: User = {
        name: form.name,
        email: form.email,
        contact: form.contact,
        password: form.password,
      };
      await signUp(data);
      // Navegação automática será feita pelo AuthProvider
    } catch {
      Alert.alert(
        "Erro no Cadastro",
        "Ocorreu um erro ao criar sua conta. Tente novamente."
      );
    }
  };

  const navigateToLogin = () => {
    router.push("/(auth)/login");
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
          <ThemedText type="title" style={styles.title}>
            Criar Conta
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Preencha os dados para criar sua conta
          </ThemedText>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Nome</ThemedText>
              <Input
                value={form.name}
                onChangeText={(name) => setForm((prev) => ({ ...prev, name }))}
                placeholder="Digite seu nome completo"
                autoCapitalize="words"
                autoComplete="name"
                error={errors.name}
                isRequired
                style={styles.input}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <Input
                value={form.email}
                onChangeText={(email) =>
                  setForm((prev) => ({ ...prev, email }))
                }
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                isRequired
                style={styles.input}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Contato</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText style={{
                  backgroundColor: '#F3F6FF',
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  fontSize: 16,
                  color: '#222',
                  borderWidth: 0,
                  borderRightWidth: 1,
                  borderColor: '#E6E6E6',
                }}>+55</ThemedText>
                <Input
                  value={form.contact.replace(/^\+55/, '')}
                  onChangeText={(value) => {
                    setForm((prev) => ({ ...prev, contact: formatters.formatContactToBrazilE164(value) }));
                  }}
                  placeholder="11987654321"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoComplete="tel"
                  error={errors.contact}
                  isRequired
                  style={[styles.input, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                  maxLength={11}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Senha</ThemedText>
              <Input
                value={form.password}
                onChangeText={(password) =>
                  setForm((prev) => ({ ...prev, password }))
                }
                placeholder="Digite sua senha"
                secureTextEntry
                autoComplete="new-password"
                error={errors.password}
                isRequired
                style={styles.input}
              />
            </View>
            <Button
              title="Criar Conta"
              onPress={handleRegister}
              isLoading={isLoading}
              disabled={isLoading}
              style={styles.buttonWeb}
              textStyle={{ color: "#000", fontWeight: "bold", fontSize: 20 }}
            />
            <ThemedText
              style={styles.linkPrimaryWeb}
              onPress={navigateToLogin}
              accessibilityRole="link"
              accessibilityLabel="Já tem uma conta? Entrar"
            >
              Já tem uma conta? Entrar
            </ThemedText>
            <ThemedText
              style={styles.linkSecondaryWeb}
              onPress={navigateBack}
              accessibilityRole="link"
              accessibilityLabel="Voltar"
            >
              Voltar
            </ThemedText>
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
    marginBottom: 8,
    lineHeight: 44,
    letterSpacing: 0.2,
    alignSelf: "flex-start",
  },
  subtitle: {
    color: "#fff",
    fontSize: 17,
    marginBottom: 24,
    opacity: 0.85,
    textAlign: "left",
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
  linkPrimaryWeb: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textDecorationLine: "none",
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  linkSecondaryWeb: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textDecorationLine: "none",
    opacity: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignSelf: "flex-start",
  },
});
