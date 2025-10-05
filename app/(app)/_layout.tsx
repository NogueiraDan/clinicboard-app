import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="patient-registration" options={{ presentation: 'modal' }} />
      <Stack.Screen name="patient-details/[id]" />
    </Stack>
  );
}