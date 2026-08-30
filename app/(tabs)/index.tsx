import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>SANLY</Text>
            <Text style={styles.tagline}>Don’t forget to wish your loved ones.</Text>
          </View>
          <Pressable style={styles.avatar} accessibilityLabel="Open profile">
            <Text style={styles.avatarText}>स</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>आज • TODAY</Text>
          <Text style={styles.heroTitle}>Make someone’s day 🎉</Text>
          <Text style={styles.heroBody}>Your celebrations will appear here, right when they matter.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Coming up</Text>
          <Text style={styles.sectionHint}>पुढील सण</Text>
        </View>

        <View style={styles.emptyCard}>
          <View style={styles.giftCircle}>
            <Text style={styles.gift}>🎁</Text>
          </View>
          <Text style={styles.emptyTitle}>Your celebration circle starts here</Text>
          <Text style={styles.emptyBody}>
            Add someone you care about. SANLY will remember the date so you can remember the person.
          </Text>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add someone</Text>
          </Pressable>
        </View>

        <Text style={styles.marathiNote}>आपल्या माणसांना शुभेच्छा द्यायला विसरू नका. ❤️</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9F4' },
  container: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 36 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  brand: { fontSize: 25, fontWeight: '900', letterSpacing: 2.8, color: '#492C2A' },
  tagline: { marginTop: 5, fontSize: 13, color: '#876D68' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F6E4D7', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 19, fontWeight: '700', color: '#B85C45' },
  hero: { backgroundColor: '#FCE9DE', borderRadius: 28, padding: 24, minHeight: 184, justifyContent: 'center' },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.3, color: '#B85C45', marginBottom: 10 },
  heroTitle: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: '#492C2A', maxWidth: 280 },
  heroBody: { marginTop: 12, fontSize: 15, lineHeight: 22, color: '#755D59', maxWidth: 300 },
  sectionHeader: { marginTop: 30, marginBottom: 13, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#492C2A' },
  sectionHint: { fontSize: 13, color: '#A28781' },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 28, paddingHorizontal: 24, paddingVertical: 28, alignItems: 'center', shadowColor: '#573B35', shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  giftCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#FFF2E9', alignItems: 'center', justifyContent: 'center', marginBottom: 17 },
  gift: { fontSize: 31 },
  emptyTitle: { fontSize: 20, lineHeight: 26, fontWeight: '800', color: '#492C2A', textAlign: 'center' },
  emptyBody: { marginTop: 9, fontSize: 14, lineHeight: 21, color: '#876D68', textAlign: 'center', maxWidth: 300 },
  primaryButton: { marginTop: 22, minHeight: 54, width: '100%', borderRadius: 18, backgroundColor: '#C75D43', flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  marathiNote: { marginTop: 24, textAlign: 'center', fontSize: 13, lineHeight: 20, color: '#A28781' },
});
