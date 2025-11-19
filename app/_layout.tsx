import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/providers/auth-provider";
import TanstackQueryProvider from "@/providers/tanstack-query-provider";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <TanstackQueryProvider>
        <AuthProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </AuthProvider>
      </TanstackQueryProvider>
    </SafeAreaProvider>
  );
}
