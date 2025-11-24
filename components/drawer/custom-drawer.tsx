import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface DrawerMenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  onPress?: () => void;
  isDanger?: boolean;
}

interface CustomDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  visible,
  onClose,
}) => {
  const { user, signOut } = useAuth();

  const handleNavigate = React.useCallback(
    (route: string) => {
      onClose();
      router.push(route as any);
    },
    [onClose]
  );

  const handleLogout = React.useCallback(async () => {
    onClose();
    await signOut();
  }, [onClose, signOut]);

  const menuItems: DrawerMenuItem[] = React.useMemo(
    () => [
      {
        id: "settings",
        label: "Configurações",
        icon: "settings-outline",
        route: "/(app)/settings",
      },
      {
        id: "reports",
        label: "Relatórios",
        icon: "stats-chart-outline",
        route: "/(app)/reports",
      },
      {
        id: "clinic",
        label: "Minha Clínica",
        icon: "business-outline",
        route: "/(app)/clinic",
      },
      {
        id: "help",
        label: "Ajuda & Suporte",
        icon: "help-circle-outline",
        route: "/(app)/help",
      },
      {
        id: "about",
        label: "Sobre",
        icon: "information-circle-outline",
        route: "/(auth)/about",
      },
      {
        id: "logout",
        label: "Sair",
        icon: "log-out-outline",
        onPress: handleLogout,
        isDanger: true,
      },
    ],
    [handleLogout]
  );

  const renderMenuItem = React.useCallback(
    (item: DrawerMenuItem) => (
      <TouchableOpacity
        key={item.id}
        style={[styles.menuItem, item.isDanger && styles.menuItemDanger]}
        onPress={() =>
          item.onPress ? item.onPress() : handleNavigate(item.route!)
        }
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.menuIconContainer,
            item.isDanger && styles.menuIconContainerDanger,
          ]}
        >
          <Ionicons
            name={item.icon}
            size={22}
            color={item.isDanger ? "#FF3B30" : "#5B67CA"}
          />
        </View>
        <ThemedText
          style={[styles.menuLabel, item.isDanger && styles.menuLabelDanger]}
        >
          {item.label}
        </ThemedText>
        {!item.isDanger && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color="rgba(255, 255, 255, 0.3)"
          />
        )}
      </TouchableOpacity>
    ),
    [handleNavigate]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.drawerContainer}>
              {/* Header do Drawer */}
              <View style={styles.drawerHeader}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="person" size={32} color="#5B67CA" />
                </View>
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>
                    {user?.name || "Usuário"}
                  </ThemedText>
                  <ThemedText style={styles.userEmail}>
                    {user?.email || "email@exemplo.com"}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                </TouchableOpacity>
              </View>

              {/* Menu Items */}
              <ScrollView
                style={styles.menuContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.menuContent}
              >
                {menuItems.map(renderMenuItem)}
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <ThemedText style={styles.footerText}>
                  ClinicBoard v1.0.0
                </ThemedText>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flexDirection: "row",
  },
  drawerContainer: {
    width: "80%",
    maxWidth: 320,
    backgroundColor: "#1A1F3A",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  drawerHeader: {
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
    position: "relative",
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(91, 103, 202, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(91, 103, 202, 0.3)",
  },
  userInfo: {
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: 0.2,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: Platform.OS === "ios" ? 60 : 40,
    padding: 4,
  },
  menuContainer: {
    flex: 1,
  },
  menuContent: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 59, 48, 0.2)",
    marginTop: 8,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(91, 103, 202, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIconContainerDanger: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  menuLabelDanger: {
    color: "#FF3B30",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 0.5,
  },
});
