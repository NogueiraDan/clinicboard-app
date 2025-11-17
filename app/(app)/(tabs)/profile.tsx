import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/providers/auth-provider";

interface ProfileOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
}

const ProfileOption = React.memo<ProfileOptionProps>(
  ({
    icon,
    title,
    subtitle,
    onPress,
    isDestructive = false,
    showChevron = true,
  }) => {
    const textColor = isDestructive ? "#FF6B6B" : "#fff";
    const iconColor = isDestructive ? "#FF6B6B" : "#5B67CA";

    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
      >
        <View style={styles.optionLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color={iconColor} />
          </View>
          <View style={styles.optionText}>
            <ThemedText style={{ color: textColor, fontWeight: Platform.OS === "ios" ? "600" : "bold" }} numberOfLines={1}>
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText style={styles.optionSubtitle} numberOfLines={1}>
                {subtitle}
              </ThemedText>
            )}
          </View>
        </View>

        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.4)" />
        )}
      </TouchableOpacity>
    );
  }
);

ProfileOption.displayName = "ProfileOption";

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();

  const handleEditProfile = useCallback(() => {
    Alert.alert(
      "Em desenvolvimento",
      "Esta funcionalidade estará disponível em breve."
    );
  }, []);

  const handleChangePassword = useCallback(() => {
    Alert.alert(
      "Em desenvolvimento",
      "Esta funcionalidade estará disponível em breve."
    );
  }, []);

  const handleNotifications = useCallback(() => {
    Alert.alert(
      "Em desenvolvimento",
      "Esta funcionalidade estará disponível em breve."
    );
  }, []);

  const handlePrivacy = useCallback(() => {
    Alert.alert(
      "Em desenvolvimento",
      "Esta funcionalidade estará disponível em breve."
    );
  }, []);

  const handleSupport = useCallback(() => {
    Alert.alert(
      "Em desenvolvimento",
      "Esta funcionalidade estará disponível em breve."
    );
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert(
                "Erro",
                "Não foi possível fazer logout. Tente novamente."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [signOut]);

  const userInitials = React.useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user?.name]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner overlay />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Perfil</ThemedText>
        </View>

        {/* Card com informações do usuário */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>{userInitials}</ThemedText>
          </View>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName} numberOfLines={1}>
              {user?.name || "Nome não disponível"}
            </ThemedText>
            <ThemedText style={styles.userEmail} numberOfLines={1}>
              {user?.email || "Email não disponível"}
            </ThemedText>
            <View style={styles.badgeContainer}>
              <ThemedText style={styles.badgeText}>
                {user?.role === "professional" ? "Profissional" : "Administrador"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Seção Conta */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>CONTA</ThemedText>
          <View style={styles.sectionCard}>
            <ProfileOption
              icon="person-outline"
              title="Editar Perfil"
              subtitle="Nome, email e outras informações"
              onPress={handleEditProfile}
            />
            <ProfileOption
              icon="key-outline"
              title="Alterar Senha"
              subtitle="Atualize sua senha de acesso"
              onPress={handleChangePassword}
            />
          </View>
        </View>

        {/* Seção Configurações */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>CONFIGURAÇÕES</ThemedText>
          <View style={styles.sectionCard}>
            <ProfileOption
              icon="notifications-outline"
              title="Notificações"
              subtitle="Gerencie suas notificações"
              onPress={handleNotifications}
            />
            <ProfileOption
              icon="shield-checkmark-outline"
              title="Privacidade"
              subtitle="Política de privacidade e termos"
              onPress={handlePrivacy}
            />
          </View>
        </View>

        {/* Seção Suporte */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>SUPORTE</ThemedText>
          <View style={styles.sectionCard}>
            <ProfileOption
              icon="help-circle-outline"
              title="Ajuda e Suporte"
              subtitle="Central de ajuda e contato"
              onPress={handleSupport}
            />
            <ProfileOption
              icon="information-circle-outline"
              title="Sobre o App"
              subtitle="Versão 1.0.0"
              showChevron={false}
            />
          </View>
        </View>

        {/* Botão de Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <ThemedText style={styles.logoutText}>Sair da Conta</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>ClinicBoard v1.0.0</ThemedText>
          <ThemedText style={styles.footerText}>
            {Platform.OS === "ios" ? "iOS" : "Android"} • React Native
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  userCard: {
    backgroundColor: "#1A1F3A",
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5B67CA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  badgeContainer: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#5B67CA",
    backgroundColor: "rgba(91, 103, 202, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: "#1A1F3A",
    borderRadius: 12,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(91, 103, 202, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.2)",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#FF6B6B",
  },
  footer: {
    alignItems: "center",
    paddingTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
  },
});
