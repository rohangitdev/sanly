import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCelebrations } from '@/src/celebrations-context';

const marathiWishes = [
  { label: 'Simple', text: 'वाढदिवसाच्या मनःपूर्वक शुभेच्छा! तुमचा दिवस आनंदाने आणि सुंदर क्षणांनी भरलेला जावो. 🎉' },
  { label: 'Warm', text: 'तुमच्या आयुष्यात आनंद, आरोग्य आणि भरभराट सदैव नांदो. वाढदिवसाच्या खूप खूप शुभेच्छा! ❤️🎂' },
  { label: 'Fun', text: 'आजचा दिवस फक्त तुमचाच! केक खा, हसा, मजा करा आणि भरपूर आठवणी बनवा. वाढदिवसाच्या धमाल शुभेच्छा! 🥳' },
];

const englishWishes = [
  { label: 'Simple', text: 'Happy birthday! Wishing you a wonderful day filled with happiness and good memories. 🎉' },
  { label: 'Warm', text: 'Wishing you a year full of joy, good health and beautiful moments. Happy birthday! ❤️🎂' },
  { label: 'Fun', text: 'It’s your day! Eat cake, laugh loudly and make some great memories. Happy birthday! 🥳' },
];

export default function WishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { celebrations } = useCelebrations();
  const person = celebrations.find((item) => item.id === id);

  if (!person) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missing}>
          <Text style={styles.title}>We couldn’t find this celebration.</Text>
          <Pressable onPress={() => router.replace('/')}><Text style={styles.link}>Back home</Text></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const wishes = person.wishLanguage === 'Marathi' ? marathiWishes : englishWishes;

  const shareWish = async (message: string) => {
    await Share.share({ message });
  };

  const openWhatsApp = async (message: string) => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
    else await shareWish(message);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.personCard}>
          <View style={styles.initial}><Text style={styles.initialText}>{person.name.charAt(0).toUpperCase()}</Text></View>
          <View style={styles.personMeta}>
            <Text style={styles.kicker}>{person.relationship} • {person.wishLanguage}</Text>
            <Text style={styles.title}>A wish for {person.name}</Text>
            <Text style={styles.date}>Birthday • {person.birthday}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Choose the feeling</Text>
        <Text style={styles.sectionBody}>Pick one and send it as-is, or tweak it in WhatsApp.</Text>

        {wishes.map((wish) => (
          <View key={wish.label} style={styles.wishCard}>
            <View style={styles.wishHeader}>
              <Text style={styles.wishLabel}>{wish.label}</Text>
              <Text style={styles.sparkle}>✨</Text>
            </View>
            <Text style={styles.wishText}>{wish.text}</Text>
            <View style={styles.actions}>
              <Pressable onPress={() => shareWish(wish.text)} style={styles.secondaryButton}>
                <Ionicons name="share-outline" size={18} color="#8F4937" />
                <Text style={styles.secondaryText}>Share</Text>
              </Pressable>
              <Pressable onPress={() => openWhatsApp(wish.text)} style={styles.whatsappButton}>
                <Ionicons name="logo-whatsapp" size={19} color="#FFFFFF" />
                <Text style={styles.whatsappText}>WhatsApp</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F4' }, container: { padding: 22, paddingBottom: 36 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, link: { color: '#C75D43', fontWeight: '800', marginTop: 16 },
  personCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FCE9DE', borderRadius: 26, padding: 20 },
  initial: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  initialText: { fontSize: 25, fontWeight: '900', color: '#C75D43' }, personMeta: { flex: 1, marginLeft: 15 },
  kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5, color: '#B05A44', textTransform: 'uppercase' },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '900', color: '#492C2A', marginTop: 3 }, date: { fontSize: 13, color: '#876D68', marginTop: 4 },
  sectionTitle: { fontSize: 21, fontWeight: '900', color: '#492C2A', marginTop: 28 }, sectionBody: { color: '#876D68', lineHeight: 21, marginTop: 5, marginBottom: 13 },
  wishCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#F2E5DE' },
  wishHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, wishLabel: { fontSize: 14, fontWeight: '900', color: '#B05A44' }, sparkle: { fontSize: 16 },
  wishText: { fontSize: 17, lineHeight: 28, color: '#492C2A', marginTop: 12 }, actions: { flexDirection: 'row', gap: 10, marginTop: 19 },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: 16, backgroundColor: '#FFF3EC', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  secondaryText: { color: '#8F4937', fontWeight: '800' }, whatsappButton: { flex: 1.25, minHeight: 48, borderRadius: 16, backgroundColor: '#2F7D55', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, whatsappText: { color: '#FFFFFF', fontWeight: '800' },
});
