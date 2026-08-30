import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCelebrations } from '@/src/celebrations-context';

export default function HomeScreen() {
  const { celebrations, hydrated } = useCelebrations();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>SANLY</Text>
            <Text style={styles.tagline}>Don’t forget to wish your loved ones.</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>स</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroSparkle}>✨</Text>
          <Text style={styles.eyebrow}>आज • TODAY</Text>
          <Text style={styles.heroTitle}>{celebrations.length ? 'Someone worth celebrating 💜' : 'Make someone’s day 🎉'}</Text>
          <Text style={styles.heroBody}>{celebrations.length ? 'A thoughtful wish takes seconds. The feeling lasts much longer.' : 'Birthdays, anniversaries, festivals and the little wins worth remembering.'}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Coming up</Text>
          <Pressable onPress={() => router.push('/add-person')} hitSlop={10}><Text style={styles.addLink}>+ Add someone special</Text></Pressable>
        </View>

        {!hydrated ? <Text style={styles.loading}>Remembering your celebrations…</Text> : celebrations.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.giftCircle}><Text style={styles.gift}>🎁</Text></View>
            <Text style={styles.emptyTitle}>Your celebration circle starts here</Text>
            <Text style={styles.emptyBody}>Add someone special and an occasion. SANLY keeps it privately on this phone.</Text>
            <Pressable onPress={() => router.push('/add-person')} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Ionicons name="add" size={22} color="#FFFFFF" /><Text style={styles.primaryButtonText}>Add someone special</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cards}>{celebrations.map((person) => (
            <View key={person.id} style={styles.personCard}>
              <View style={styles.initial}><Text style={styles.initialText}>{person.name.charAt(0).toUpperCase()}</Text></View>
              <View style={styles.personText}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.personMeta}>{person.occasionType} • {person.date} • {person.relationship}</Text>
              </View>
              <Pressable onPress={() => router.push(`/wish/${person.id}`)} style={({ pressed }) => [styles.wishButton, pressed && styles.pressed]}>
                <Text style={styles.wishButtonText}>Wish</Text><Ionicons name="sparkles" size={15} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}</View>
        )}

        <Text style={styles.marathiNote}>आपल्या माणसांना शुभेच्छा द्यायला विसरू नका. 💜</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9F5' }, container: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 36 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }, brandBlock: { flex: 1, paddingRight: 12 },
  brand: { fontSize: 26, fontWeight: '900', letterSpacing: 2.8, color: '#6D28A8' }, tagline: { marginTop: 5, fontSize: 13, color: '#756878' }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5EEFA', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E6D6F0' }, avatarText: { fontSize: 19, fontWeight: '800', color: '#6D28A8' },
  hero: { backgroundColor: '#F5EEFA', borderRadius: 30, padding: 24, minHeight: 190, justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E9DDF1' }, heroSparkle: { position: 'absolute', right: 20, top: 18, fontSize: 34 }, eyebrow: { fontSize: 12, fontWeight: '900', letterSpacing: 1.3, color: '#6D28A8', marginBottom: 10 }, heroTitle: { fontSize: 31, lineHeight: 37, fontWeight: '900', color: '#35143F', maxWidth: 300 }, heroBody: { marginTop: 12, fontSize: 15, lineHeight: 22, color: '#756878', maxWidth: 310 },
  sectionHeader: { marginTop: 30, marginBottom: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sectionTitle: { fontSize: 20, fontWeight: '900', color: '#35143F' }, addLink: { color: '#6D28A8', fontWeight: '900', fontSize: 13 }, loading: { color: '#756878', paddingVertical: 20 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 28, paddingHorizontal: 24, paddingVertical: 28, alignItems: 'center', borderWidth: 1, borderColor: '#EFE4F4' }, giftCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF0E8', alignItems: 'center', justifyContent: 'center', marginBottom: 17 }, gift: { fontSize: 32 }, emptyTitle: { fontSize: 20, lineHeight: 26, fontWeight: '900', color: '#35143F', textAlign: 'center' }, emptyBody: { marginTop: 9, fontSize: 14, lineHeight: 21, color: '#756878', textAlign: 'center', maxWidth: 300 },
  primaryButton: { marginTop: 22, minHeight: 56, width: '100%', borderRadius: 18, backgroundColor: '#6D28A8', flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' }, primaryButtonText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' }, cards: { gap: 12 }, personCard: { minHeight: 86, borderRadius: 22, backgroundColor: '#FFFFFF', padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EFE4F4' }, initial: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F5EEFA', alignItems: 'center', justifyContent: 'center' }, initialText: { fontSize: 20, fontWeight: '900', color: '#6D28A8' },
  personText: { flex: 1, marginLeft: 12, marginRight: 8 }, personName: { fontSize: 17, fontWeight: '900', color: '#2B2030' }, personMeta: { fontSize: 12, lineHeight: 18, marginTop: 3, color: '#756878' }, wishButton: { height: 42, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#6D28A8', flexDirection: 'row', alignItems: 'center', gap: 5 }, wishButtonText: { color: '#FFFFFF', fontWeight: '900' }, pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] }, marathiNote: { marginTop: 24, textAlign: 'center', fontSize: 13, lineHeight: 20, color: '#756878' },
});
