import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CelebrationProvider } from '@/src/celebrations-context';

const BackButton = ({ toHome = false }: { toHome?: boolean }) => (
  <Pressable
    onPress={() => {
      if (toHome) {
        router.replace('/');
        return;
      }
      if (router.canGoBack()) router.back();
      else router.replace('/');
    }}
    hitSlop={12}
    style={{ paddingVertical: 6, paddingRight: 12 }}>
    <Ionicons name="chevron-back" size={28} color="#5F258F" />
  </Pressable>
);

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
        <Stack.Screen
          name="wish/[id]"
          options={{
            title: 'Make their day',
            headerLeft: () => <BackButton toHome />,
          }}
        />
        <Stack.Screen
          name="custom-wish/[id]"
          options={{
            title: 'Write a wish',
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </CelebrationProvider>
  );
}
