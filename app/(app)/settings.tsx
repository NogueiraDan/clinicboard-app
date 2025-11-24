import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";

interface SettingItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: "toggle" | "nav";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);

  const handleBack = React.useCallback(() => {
    router.back();
  }, []);

  const settingsSections: { title: string; items: SettingItem[] }[] =
    React.useMemo(
      () => [
        {
          title: "Preferências",
          items: [
            {
              id: "notifications",
              label: "Notificações Push",
              icon: "notifications-outline",
              type: "toggle",
              value: notifications,
              onToggle: setNotifications,
            },
            {
              id: "reminders",
              label: "Lembretes de Consulta",
              icon: "alarm-outline",
              type: "toggle",
              value: reminders,
              onToggle: setReminders,
            },
            {
              id: "darkMode",
              label: "Modo Escuro",
              icon: "moon-outline",
              type: "toggle",
              value: darkMode,
              onToggle: setDarkMode,
            },
          ],
        },
        {
          title: "Conta",
          items: [
            {
              id: "profile",
              label: "Editar Perfil",
              icon: "person-outline",
              type: "nav",
              onPress: () => router.push("/(app)/(tabs)/profile"),
            },
            {
              id: "password",
              label: "Alterar Senha",
              icon: "lock-closed-outline",
              type: "nav",
              onPress: () => alert("Funcionalidade em desenvolvimento"),
            },
          ],
        },
        {
          title: "Sobre",
          items: [
            {
              id: "terms",
              label: "Termos de Uso",
              icon: "document-text-outline",
              type: "nav",
              onPress: () => alert("Funcionalidade em desenvolvimento"),
            },
            {
              id: "privacy",
              label: "Política de Privacidade",
              icon: "shield-checkmark-outline",
              type: "nav",
              onPress: () => alert("Funcionalidade em desenvolvimento"),
            },
          ],
        },
      ],
      [notifications, reminders, darkMode]
    );

  const renderSettingItem = React.useCallback((item: SettingItem) => {
    if (item.type === "toggle") {
      return (
        <View key={item.id} style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Ionicons name={item.icon} size={22} color="#5B67CA" />
          </View>
          <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: "#3A3F5C", true: "#5B67CA" }}
            thumbColor={item.value ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3A3F5C"
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingIconContainer}>
          <Ionicons name={item.icon} size={22} color="#5B67CA" />
        </View>
        <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="rgba(255, 255, 255, 0.3)"
        />
      </TouchableOpacity>
    );
  }, []);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Configurações</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
});
