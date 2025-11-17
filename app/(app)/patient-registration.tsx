import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCreatePatient } from "@/hooks/tanstack/use-create-patient";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useAuth } from "@/providers/auth-provider";
import { Patient } from "@/types";
import { formatters } from "@/utils/formatters";
import { validationRules } from "@/utils/validation";

const INITIAL_VALUES: Patient = {
  name: "",
  email: "",
  phone: "",
  age: "",
  additional_info: "",
  user_id: "",
};

const VALIDATION_RULES = {
  name: [validationRules.required, validationRules.minLength(2)],
  email: [validationRules.required, validationRules.email],
  phone: [validationRules.required, validationRules.phone],
  age: [validationRules.required],
  additional_info: [],
};

export default function PatientRegistrationScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { createPatient } = useCreatePatient();

  const {
    values,
    errors,
    setValue,
    setFieldTouched: setFieldTouchedRaw,
    validateForm,
  } = useFormValidation(INITIAL_VALUES, VALIDATION_RULES);

  const setFieldTouched = useCallback(
    (field: keyof Patient | string) => {
      setFieldTouchedRaw(field as any);
    },
    [setFieldTouchedRaw]
  );

  const handleInputChange = useCallback(
    (field: keyof Patient | string, value: string) => {
      if (field.includes(".")) {
        // Handle nested fields
        const [parent, child] = field.split(".");
        const parentValue = values[parent as keyof Patient];

        if (
          typeof parentValue === "object" &&
          parentValue !== null &&
          !Array.isArray(parentValue)
        ) {
          setValue(parent as keyof Patient, {
            ...(parentValue as Record<string, any>),
            [child]: value,
          });
        }
      } else {
        if (field === "phone") {
          const formattedValue = formatters.smartPhone(value);
          setValue(field as keyof Patient, formattedValue);
        } else {
          setValue(field as keyof Patient, value);
        }
      }
    },
    [values, setValue]
  );

  const getFieldValue = useCallback(
    (field: string): string => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        const parentValue = values[parent as keyof Patient];

        if (typeof parentValue === "object" && parentValue !== null) {
          return String((parentValue as any)[child] || "");
        }
      }

      return String(values[field as keyof Patient] || "");
    },
    [values]
  );

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      if (field.includes(".")) {
        return errors[field as keyof typeof errors];
      }

      return errors[field as keyof Patient];
    },
    [errors]
  );

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert(
        "Erro de Validação",
        "Por favor, corrija os erros no formulário."
      );
      return;
    }
    setIsLoading(true);
    try {
      // Simulação de fetching
      await new Promise((resolve) => setTimeout(resolve, 500));
      const payload = {
        ...values,
        user_id: user?.id || "",
      };
      await createPatient(payload);
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o paciente. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [createPatient, user?.id, validateForm, values]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      "Cancelar Cadastro",
      "Tem certeza que deseja cancelar? Todos os dados preenchidos serão perdidos.",
      [
        { text: "Continuar Editando", style: "cancel" },
        {
          text: "Cancelar",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  }, []);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Novo Paciente</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Preencha as informações do paciente
          </ThemedText>
        </View>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card de Informações */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={24} color="#5B67CA" />
              <ThemedText style={styles.cardTitle}>Informações Pessoais</ThemedText>
            </View>
            
            <Input
              label="Nome Completo"
              value={getFieldValue("name")}
              onChangeText={(value) => handleInputChange("name", value)}
              onBlur={() => setFieldTouched("name")}
              placeholder="Digite o nome completo"
              autoCapitalize="words"
              error={getFieldError("name")}
              isRequired
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
            
            <Input
              label="Idade"
              value={getFieldValue("age")}
              onChangeText={(value) => handleInputChange("age", value)}
              onBlur={() => setFieldTouched("age")}
              placeholder="Digite a idade"
              keyboardType="numeric"
              error={getFieldError("age")}
              isRequired
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
            
            <Input
              label="Email"
              value={getFieldValue("email")}
              onChangeText={(value) => handleInputChange("email", value)}
              onBlur={() => setFieldTouched("email")}
              placeholder="exemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={getFieldError("email")}
              isRequired
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
            
            <Input
              label="Telefone"
              value={getFieldValue("phone")}
              onChangeText={(value) => handleInputChange("phone", value)}
              onBlur={() => setFieldTouched("phone")}
              placeholder="(11) 98765-4321"
              keyboardType="phone-pad"
              error={getFieldError("phone")}
              isRequired
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
            
            <Input
              label="Informações Adicionais"
              value={getFieldValue("additional_info")}
              onChangeText={(value) => handleInputChange("additional_info", value)}
              onBlur={() => setFieldTouched("additional_info")}
              placeholder="Adicione informações adicionais se tiver..."
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
              autoCapitalize="sentences"
              error={getFieldError("additional_info")}
              style={[styles.input, styles.textArea]}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
          </View>
        </ScrollView>
        
        {/* Footer com botões */}
        <View style={styles.footer}>
          <Button
            title="Cancelar"
            onPress={handleCancel}
            variant="outline"
            disabled={isLoading}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
          <Button
            title="Cadastrar"
            onPress={handleSubmit}
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            textStyle={styles.submitButtonText}
          />
        </View>
      </KeyboardAvoidingView>
      
      {isLoading && <LoadingSpinner overlay />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: "#1A1F3A",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#fff",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#0A0E27",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cancelButtonText: {
    color: "#fff",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#5B67CA",
  },
  submitButtonText: {
    color: "#fff",
  },
});
