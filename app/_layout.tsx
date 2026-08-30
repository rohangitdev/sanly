import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CelebrationProvider } from '@/src/celebrations-context';

export default function RootLayout() {
  return (
    <CelebrationProvider>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: '#492C2A',
          contentStyle: { backgroundColor: '#FFF9F4' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-person" options={{ title: 'Add someone', presentation: 'modal' }} />
        <Stack.Screen name="wish/[id]" options={{ title: 'Make their day' }} />
      </Stack>
      <StatusBar style="dark" />
    </CelebrationProvider>
  );
}
