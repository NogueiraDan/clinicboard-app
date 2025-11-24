import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Linking,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface HelpItem {
  id: string;
  question: string;
  answer: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ContactOption {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
}

export default function HelpScreen() {
  const handleBack = React.useCallback(() => {
    router.back();
  }, []);

  const faqs: HelpItem[] = React.useMemo(
    () => [
      {
        id: "1",
        question: "Como criar um novo agendamento?",
        answer:
          "Toque no botão '+' flutuante na tela inicial ou navegue até a aba de agendamentos.",
        icon: "calendar",
      },
      {
        id: "2",
        question: "Como cadastrar um novo paciente?",
        answer:
          "Na aba 'Pacientes', toque no botão '+' e preencha os dados solicitados.",
        icon: "person-add",
      },
      {
        id: "3",
        question: "Como visualizar relatórios?",
        answer:
          "Acesse o menu lateral (☰) e toque em 'Relatórios' para ver estatísticas da clínica.",
        icon: "stats-chart",
      },
      {
        id: "4",
        question: "Como alterar minhas configurações?",
        answer:
          "Abra o menu lateral (☰) e selecione 'Configurações' para personalizar o app.",
        icon: "settings",
      },
    ],
    []
  );

  const contactOptions: ContactOption[] = React.useMemo(
    () => [
      {
        id: "email",
        label: "E-mail",
        value: "suporte@clinicboard.com.br",
        icon: "mail",
        action: () => Linking.openURL("mailto:suporte@clinicboard.com.br"),
      },
      {
        id: "phone",
        label: "Telefone",
        value: "(11) 98765-4321",
        icon: "call",
        action: () => Linking.openURL("tel:+5511987654321"),
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        value: "(11) 98765-4321",
        icon: "logo-whatsapp",
        action: () =>
          Linking.openURL("https://wa.me/5511987654321?text=Olá! Preciso de ajuda."),
      },
    ],
    []
  );

  const [expandedFaq, setExpandedFaq] = React.useState<string | null>(null);

  const toggleFaq = React.useCallback((id: string) => {
    setExpandedFaq((prev) => (prev === id ? null : id));
  }, []);

  const renderFaqItem = React.useCallback(
    (item: HelpItem) => {
      const isExpanded = expandedFaq === item.id;
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.faqItem}
          onPress={() => toggleFaq(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.faqHeader}>
            <View style={styles.faqIconContainer}>
              <Ionicons name={item.icon} size={20} color="#5B67CA" />
            </View>
            <ThemedText style={styles.faqQuestion}>{item.question}</ThemedText>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="rgba(255, 255, 255, 0.5)"
            />
          </View>
          {isExpanded && (
            <ThemedText style={styles.faqAnswer}>{item.answer}</ThemedText>
          )}
        </TouchableOpacity>
      );
    },
    [expandedFaq, toggleFaq]
  );

  const renderContactOption = React.useCallback((item: ContactOption) => (
    <TouchableOpacity
      key={item.id}
      style={styles.contactCard}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={styles.contactIconContainer}>
        <Ionicons name={item.icon} size={24} color="#5B67CA" />
      </View>
      <View style={styles.contactContent}>
        <ThemedText style={styles.contactLabel}>{item.label}</ThemedText>
        <ThemedText style={styles.contactValue}>{item.value}</ThemedText>
      </View>
      <Ionicons
        name="open-outline"
        size={20}
        color="rgba(255, 255, 255, 0.3)"
      />
    </TouchableOpacity>
  ), []);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Ajuda & Suporte</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="help-circle" size={64} color="#5B67CA" />
          </View>
          <ThemedText style={styles.heroTitle}>Como podemos ajudar?</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Encontre respostas ou entre em contato conosco
          </ThemedText>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Perguntas Frequentes
          </ThemedText>
          <View style={styles.faqList}>{faqs.map(renderFaqItem)}</View>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Entre em Contato</ThemedText>
          <View style={styles.contactList}>
            {contactOptions.map(renderContactOption)}
          </View>
        </View>

        {/* Additional Help */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#5B67CA" />
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoTitle}>
              Precisa de mais ajuda?
            </ThemedText>
            <ThemedText style={styles.infoText}>
              Nossa equipe de suporte está disponível de segunda a sexta, das 8h
              às 18h.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  heroIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  faqIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  faqAnswer: {
    marginTop: 12,
    paddingLeft: 48,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
  },
  contactList: {
    gap: 12,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 16,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  contactContent: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    letterSpacing: 0.2,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(91, 103, 202, 0.2)",
  },
  infoContent: {
    flex: 1,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
  },
});
