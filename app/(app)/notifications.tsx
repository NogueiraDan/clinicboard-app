import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Notification } from "@/types";
import { mockNotifications } from "@/utils/mocks/notifications";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);

  const handleBack = React.useCallback(() => {
    router.back();
  }, []);

  const handleMarkAsRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const handleMarkAllAsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const getNotificationIcon = React.useCallback((type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return 'calendar';
      case 'reminder':
        return 'alarm';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  }, []);

  const renderNotification = React.useCallback(
    ({ item }: { item: Notification }) => (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.isRead && styles.notificationCardUnread,
        ]}
        onPress={() => handleMarkAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.notificationIconContainer,
            !item.isRead && styles.notificationIconContainerUnread,
          ]}
        >
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={!item.isRead ? "#5B67CA" : "rgba(255, 255, 255, 0.5)"}
          />
        </View>
        <View style={styles.notificationContent}>
          <ThemedText style={styles.notificationTitle}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.notificationMessage}>
            {item.message}
          </ThemedText>
          <ThemedText style={styles.notificationTime}>
            {new Date(item.createdAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </ThemedText>
        </View>
        {!item.isRead && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    ),
    [getNotificationIcon, handleMarkAsRead]
  );

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Notificações</ThemedText>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <ThemedText style={styles.markAllButtonText}>
              Marcar todas
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Notificações */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color="rgba(255, 255, 255, 0.3)"
            />
            <ThemedText style={styles.emptyText}>
              Nenhuma notificação
            </ThemedText>
          </View>
        }
      />
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
    gap: 12,
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
    flex: 1,
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    letterSpacing: 0.3,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markAllButtonText: {
    color: "#5B67CA",
    fontSize: 14,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 12,
  },
  notificationCardUnread: {
    backgroundColor: "rgba(91, 103, 202, 0.08)",
    borderColor: "rgba(91, 103, 202, 0.2)",
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIconContainerUnread: {
    backgroundColor: "rgba(91, 103, 202, 0.15)",
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#fff",
    letterSpacing: 0.2,
  },
  notificationMessage: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 4,
    textTransform: "capitalize",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5B67CA",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
});
