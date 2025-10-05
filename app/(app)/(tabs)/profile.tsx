import React, { useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Colors } from '@/constants/theme';
import { Metrics } from '@/constants/metrics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/providers/auth-provider';

interface ProfileOptionProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
}

const ProfileOption = React.memo<ProfileOptionProps>(({
  icon,
  title,
  subtitle,
  onPress,
  isDestructive = false,
  showChevron = true,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const textColor = isDestructive ? '#FF6B6B' : colors.text;
  const iconColor = isDestructive ? '#FF6B6B' : colors.icon;

  return (
    <TouchableOpacity
      style={[styles.optionItem, { borderBottomColor: colors.icon }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? Metrics.touchableOpacity : 1}
    >
      <ThemedView style={styles.optionLeft}>
        <ThemedView style={[styles.iconContainer, { backgroundColor: colors.icon + '20' }]}>
          <IconSymbol
            name={icon as any}
            size={Metrics.iconSize.md}
            color={iconColor}
          />
        </ThemedView>
        
        <ThemedView style={styles.optionText}>
          <ThemedText
            type="defaultSemiBold"
            style={[{ color: textColor }]}
            numberOfLines={1}
          >
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText
              style={[styles.optionSubtitle, { color: colors.icon }]}
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
          color={colors.icon}
        />
      )}
    </TouchableOpacity>
  );
});

ProfileOption.displayName = 'ProfileOption';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const handleEditProfile = useCallback(() => {
    Alert.alert('Em desenvolvimento', 'Esta funcionalidade estará disponível em breve.');
  }, []);

  const handleChangePassword = useCallback(() => {
    Alert.alert('Em desenvolvimento', 'Esta funcionalidade estará disponível em breve.');
  }, []);

  const handleNotifications = useCallback(() => {
    Alert.alert('Em desenvolvimento', 'Esta funcionalidade estará disponível em breve.');
  }, []);

  const handlePrivacy = useCallback(() => {
    Alert.alert('Em desenvolvimento', 'Esta funcionalidade estará disponível em breve.');
  }, []);

  const handleSupport = useCallback(() => {
    Alert.alert('Em desenvolvimento', 'Esta funcionalidade estará disponível em breve.');
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [signOut]);

  const userInitials = React.useMemo(() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [user?.name]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <LoadingSpinner overlay />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com informações do usuário */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Perfil</ThemedText>
          
          <ThemedView style={styles.userInfo}>
            <ThemedView style={[styles.avatar, { backgroundColor: colors.tint }]}>
              <ThemedText style={styles.avatarText}>{userInitials}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.userDetails}>
              <ThemedText type="subtitle" numberOfLines={1}>
                {user?.name || 'Nome não disponível'}
              </ThemedText>
              <ThemedText style={[styles.userEmail, { color: colors.icon }]} numberOfLines={1}>
                {user?.email || 'Email não disponível'}
              </ThemedText>
              <ThemedView style={styles.roleContainer}>
                <ThemedText style={[styles.roleText, { backgroundColor: colors.tint + '20', color: colors.tint }]}>
                  {user?.role === 'professional' ? 'Profissional' : 'Administrador'}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Seção Conta */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
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
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
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
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
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
        <ThemedView style={styles.section}>
          <ProfileOption
            icon="arrow.right.square"
            title="Sair"
            onPress={handleLogout}
            isDestructive
            showChevron={false}
          />
        </ThemedView>

        {/* Footer com versão */}
        <ThemedView style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: colors.icon }]}>
            ClinicBoard v1.0.0
          </ThemedText>
          <ThemedText style={[styles.footerText, { color: colors.icon }]}>
            {Platform.OS === 'ios' ? 'iOS' : 'Android'} • React Native
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Metrics.padding.xl,
  },
  header: {
    padding: Metrics.padding.lg,
    gap: Metrics.margin.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrics.margin.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Metrics.fontSize.lg,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userEmail: {
    fontSize: Metrics.fontSize.sm,
  },
  roleContainer: {
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: Metrics.fontSize.xs,
    fontWeight: '600',
    paddingHorizontal: Metrics.padding.sm,
    paddingVertical: 4,
    borderRadius: Metrics.borderRadius.sm,
    overflow: 'hidden',
  },
  section: {
    marginBottom: Metrics.margin.lg,
  },
  sectionTitle: {
    paddingHorizontal: Metrics.padding.lg,
    paddingBottom: Metrics.padding.sm,
    opacity: 0.7,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.padding.lg,
    paddingVertical: Metrics.padding.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrics.margin.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Metrics.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionSubtitle: {
    fontSize: Metrics.fontSize.sm,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: Metrics.padding.lg,
    paddingTop: Metrics.padding.xl,
    gap: 4,
  },
  footerText: {
    fontSize: Metrics.fontSize.xs,
    textAlign: 'center',
  },
});