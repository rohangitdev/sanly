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
          headerTintColor: '#5F258F',
          headerTitleStyle: { color: '#35143F', fontWeight: '800' },
          contentStyle: { backgroundColor: '#FFF9F5' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-person" options={{ title: 'Add someone special', presentation: 'modal' }} />
        <Stack.Screen name="wish/[id]" options={{ title: 'Make their day' }} />
        <Stack.Screen name="custom-wish/[id]" options={{ title: 'Write a wish' }} />
      </Stack>
      <StatusBar style="dark" />
    </CelebrationProvider>
  );
}
