import React, { useCallback } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Metrics } from "@/constants/metrics";
import { useAuth } from "@/providers/auth-provider";

interface ProfileOptionProps {
  icon: string;
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
    // Forçar dark igual ao resto do app
    const textColor = isDestructive ? "#FF6B6B" : "#fff";
    const iconColor = isDestructive ? "#FF6B6B" : "#fff";

    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          { backgroundColor: "#000", borderBottomColor: "#fff2" },
        ]}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? Metrics.touchableOpacity : 1}
      >
        <ThemedView style={[styles.optionLeft, { backgroundColor: "#000" }]}>
          <ThemedView
            style={[styles.iconContainer, { backgroundColor: "#fff2" }]}
          >
            <IconSymbol
              name={icon as any}
              size={Metrics.iconSize.md}
              color={iconColor}
            />
          </ThemedView>
          <ThemedView style={[styles.optionText, { backgroundColor: "#000" }]}>
            <ThemedText
              type="defaultSemiBold"
              style={[{ color: textColor }]}
              numberOfLines={1}
            >
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText
                style={[styles.optionSubtitle, { color: "#fff", opacity: 0.7 }]}
                numberOfLines={1}
              >
                {subtitle}
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>

        {showChevron && onPress && (
          <IconSymbol
            name="chevron.right"
            size={Metrics.iconSize.md}
            color="#fff"
          />
        )}
      </TouchableOpacity>
    );
  }
);

ProfileOption.displayName = "ProfileOption";

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  // Forçar dark mode igual ao patients.tsx
  const colors = {
    background: "#000",
    text: "#fff",
    icon: "#fff",
    border: "#fff2",
    placeholder: "#fff9",
    primary: "#0096FF",
    danger: "#FF6B6B",
    tint: "#0096FF",
  };
  const insets = useSafeAreaInsets();

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
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <LoadingSpinner overlay />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com informações do usuário */}
        <ThemedView style={[styles.header, { backgroundColor: "#000" }]}>
          <ThemedText type="title" style={{ color: colors.text }}>
            Perfil
          </ThemedText>
          <ThemedView style={styles.userInfoCard}>
            <ThemedView style={styles.avatarWrapper}>
              <ThemedView style={[styles.avatar, { backgroundColor: colors.primary }] }>
                <ThemedText style={styles.avatarText}>{userInitials}</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={[styles.userDetails, { backgroundColor: '#000' }] }>
              <ThemedText
                type="subtitle"
                numberOfLines={1}
                style={{ color: colors.text, fontWeight: "bold" }}
              >
                {user?.name || "Nome não disponível"}
              </ThemedText>
              <ThemedText
                style={[styles.userEmail, { color: colors.text, opacity: 0.8 }]}
                numberOfLines={1}
              >
                {user?.email || "Email não disponível"}
              </ThemedText>
              <ThemedView style={styles.roleContainer}>
                <ThemedText
                  style={[
                    styles.roleText,
                    {
                      backgroundColor: colors.primary + "20",
                      color: colors.primary,
                    },
                  ]}
                >
                  {user?.role === "professional"
                    ? "Profissional"
                    : "Administrador"}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Seção Conta */}
        <ThemedView
          style={[styles.section, { backgroundColor: colors.background }]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionTitle, { color: colors.text, opacity: 0.7 }]}
          >
            Conta
          </ThemedText>
          <ProfileOption
            icon="person.circle"
            title="Editar Perfil"
            subtitle="Nome, email e outras informações"
            onPress={handleEditProfile}
          />
          <ProfileOption
            icon="key"
            title="Alterar Senha"
            subtitle="Atualize sua senha de acesso"
            onPress={handleChangePassword}
          />
        </ThemedView>

        {/* Seção Configurações */}
        <ThemedView
          style={[styles.section, { backgroundColor: colors.background }]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionTitle, { color: colors.text, opacity: 0.7 }]}
          >
            Configurações
          </ThemedText>
          <ProfileOption
            icon="bell"
            title="Notificações"
            subtitle="Gerencie suas notificações"
            onPress={handleNotifications}
          />
          <ProfileOption
            icon="lock.shield"
            title="Privacidade"
            subtitle="Política de privacidade e termos"
            onPress={handlePrivacy}
          />
        </ThemedView>

        {/* Seção Suporte */}
        <ThemedView
          style={[styles.section, { backgroundColor: colors.background }]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionTitle, { color: colors.text, opacity: 0.7 }]}
          >
            Suporte
          </ThemedText>
          <ProfileOption
            icon="questionmark.circle"
            title="Ajuda e Suporte"
            subtitle="Central de ajuda e contato"
            onPress={handleSupport}
          />
          <ProfileOption
            icon="info.circle"
            title="Sobre o App"
            subtitle="Versão 1.0.0"
            showChevron={false}
          />
        </ThemedView>

        {/* Logout */}
        <ThemedView
          style={[styles.section, { backgroundColor: colors.background }]}
        >
          <ProfileOption
            icon="arrow.right.square"
            title="Sair"
            onPress={handleLogout}
            isDestructive
            showChevron={false}
          />
        </ThemedView>

        {/* Footer com versão */}
        <ThemedView
          style={[styles.footer, { backgroundColor: colors.background }]}
        >
          <ThemedText style={[styles.footerText, { color: colors.icon }]}>
            ClinicBoard v1.0.0
          </ThemedText>
          <ThemedText style={[styles.footerText, { color: colors.icon }]}>
            {Platform.OS === "ios" ? "iOS" : "Android"} • React Native
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Metrics.padding.xl,
    backgroundColor: "#000",
  },
  header: {
    padding: Metrics.padding.lg,
    gap: Metrics.margin.lg,
    backgroundColor: "#000",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Metrics.margin.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0096FF",
  },
  avatarText: {
    color: "#fff",
    fontSize: Metrics.fontSize.lg,
    fontWeight: "bold",
  },
  // Removido duplicidade, já está definido abaixo com backgroundColor: '#000', gap e minWidth
  userEmail: {
    fontSize: Metrics.fontSize.sm,
    color: "#fff",
    opacity: 0.8,
  },
  roleContainer: {
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: Metrics.fontSize.xs,
    fontWeight: "600",
    paddingHorizontal: Metrics.padding.sm,
    paddingVertical: 4,
    borderRadius: Metrics.borderRadius.sm,
    overflow: "hidden",
    backgroundColor: "#0096FF20",
    color: "#0096FF",
  },
  section: {
    marginBottom: Metrics.margin.lg,
    backgroundColor: "#000",
  },
  sectionTitle: {
    paddingHorizontal: Metrics.padding.lg,
    paddingBottom: Metrics.padding.sm,
    opacity: 0.7,
    color: "#fff",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Metrics.padding.lg,
    paddingVertical: Metrics.padding.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#fff2",
    backgroundColor: "#000",
  },
  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Metrics.margin.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Metrics.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff2",
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionSubtitle: {
    fontSize: Metrics.fontSize.sm,
    color: "#fff",
    opacity: 0.7,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: Metrics.padding.lg,
    paddingTop: Metrics.padding.xl,
    gap: 4,
    backgroundColor: "#000",
  },
  footerText: {
    fontSize: Metrics.fontSize.xs,
    textAlign: "center",
    color: "#fff",
    opacity: 0.7,
  },
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 0,
    alignSelf: 'stretch',
    minHeight: 80,
  },
  avatarWrapper: {
    marginRight: 16,
    marginLeft: 0,
    backgroundColor: 'transparent',
    // Garante que não cole na lateral
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
    gap: 4,
    backgroundColor: '#000',
    minWidth: 0,
  },
});
