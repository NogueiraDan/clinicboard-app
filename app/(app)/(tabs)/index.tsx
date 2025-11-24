import { CalendarSection } from "@/components/appointments/calendar-section";
import { CustomDrawer } from "@/components/drawer/custom-drawer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppointments } from "@/hooks/tanstack/use-appointments";
import { Notification } from "@/types";
import { fetchNotifications, getUnreadCount } from "@/utils/mocks/notifications";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

export default function DashboardScreen() {
  const [date, setDate] = React.useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const { appointments, refetchAppointments, isFetching } =
    useAppointments(date);

  // Carrega notificações ao montar o componente
  React.useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    loadNotifications();
  }, []);

  // const navigateToPatientsList = React.useCallback(() => {
  //   router.push("/(app)/(tabs)/patients");
  // }, []);

  const navigateToNewAppointment = React.useCallback(() => {
    router.push("/(app)/new-appointment");
  }, []);

  const navigateToNotifications = React.useCallback(() => {
    router.push("/(app)/notifications");
  }, []);

  const toggleDrawer = React.useCallback(() => {
    setDrawerVisible((prev) => !prev);
  }, []);

  const closeDrawer = React.useCallback(() => {
    setDrawerVisible(false);
  }, []);

  const handleDateSelect = React.useCallback(
    (dateString: string) => {
      setDate(dateString);
      refetchAppointments();
    },
    [refetchAppointments]
  );

  const currentMonthYear = React.useMemo(() => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, [date]);

  const unreadNotificationsCount = React.useMemo(
    () => getUnreadCount(notifications),
    [notifications]
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={toggleDrawer}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={navigateToNotifications}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={28} color="#fff" />
          {unreadNotificationsCount > 0 && (
            <View style={styles.notificationBadge}>
              <ThemedText style={styles.notificationBadgeText}>
                {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month/Year Title */}
        <ThemedText style={styles.monthTitle}>
          {currentMonthYear}
        </ThemedText>

        {/* Calendar Section */}
        <CalendarSection
          onDateSelect={handleDateSelect}
          appointments={appointments}
          isFetching={isFetching}
        />

        {/* Action Buttons */}
        {/* <View style={styles.actionButtons}>
          <Button
            title="Ver Todos os Pacientes"
            onPress={navigateToPatientsList}
            style={styles.buttonPrimary}
            textStyle={styles.buttonPrimaryText}
            variant="primary"
          />
        </View> */}
      </ScrollView>

      {/* FAB - Floating Action Button para Novo Agendamento */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={navigateToNewAppointment}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Drawer Navigation */}
      <CustomDrawer visible={drawerVisible} onClose={closeDrawer} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#0A0E27",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    lineHeight: 14,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#5B67CA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B67CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    marginBottom: 20,
    textTransform: "capitalize",
    letterSpacing: 0.5,
    alignSelf: 'center',
  },
  actionButtons: {
    marginTop: 24,
    width: "100%",
  },
  buttonPrimary: {
    backgroundColor: "#5B67CA",
    borderRadius: 16,
    paddingVertical: 18,
    alignSelf: "stretch",
    width: "100%",
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5B67CA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B67CA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});
