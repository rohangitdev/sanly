import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { CelebrationProvider } from '@/src/celebrations-context';
import { LanguageProvider, useLanguage } from '@/src/language-context';
import { Notifications } from '@/src/notifications';

const BackButton = ({ toHome = false }: { toHome?: boolean }) => (
  <Pressable onPress={() => { if (toHome) return router.replace('/'); if (router.canGoBack()) router.back(); else router.replace('/'); }} hitSlop={12} style={{ paddingVertical: 6, paddingRight: 12 }}>
    <Ionicons name="chevron-back" size={28} color="#5F258F" />
  </Pressable>
);

function Navigation() {
  const { language } = useLanguage();
  const marathi = language === 'Marathi';

  useEffect(() => {
    const openFromResponse = (response: Notifications.NotificationResponse | null) => {
      const id = response?.notification.request.content.data?.celebrationId;
      if (typeof id === 'string' && id) router.push(`/wish/${id}`);
    };

    Notifications.getLastNotificationResponseAsync().then(openFromResponse).catch(() => undefined);
    const subscription = Notifications.addNotificationResponseReceivedListener(openFromResponse);
    return () => subscription.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShadowVisible: false, headerTintColor: '#5F258F', headerTitleStyle: { color: '#35143F', fontWeight: '800' }, contentStyle: { backgroundColor: '#FFF9F5' } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="language" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="add-person" options={{ title: marathi ? 'खास व्यक्ती जोडा' : 'Add someone special', presentation: 'modal' }} />
      <Stack.Screen name="wish/[id]" options={{ title: marathi ? 'आजचा दिवस खास करा' : 'Make their day', headerLeft: () => <BackButton toHome /> }} />
      <Stack.Screen name="custom-wish/[id]" options={{ title: marathi ? 'तुमची शुभेच्छा लिहा' : 'Write a wish', headerLeft: () => <BackButton /> }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <CelebrationProvider>
        <Navigation />
        <StatusBar style="dark" />
      </CelebrationProvider>
    </LanguageProvider>
  );
}
