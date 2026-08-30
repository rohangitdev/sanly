import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration, useCelebrations } from '@/src/celebrations-context';

const todayKey = () => {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const daysUntil = (date: string) => {
  const [day, month] = date.split('/').map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(now.getFullYear(), month - 1, day);
  if (target < today) target = new Date(now.getFullYear() + 1, month - 1, day);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

const occasionEmoji = (occasion: Celebration['occasionType']) => {
  const map: Record<Celebration['occasionType'], string> = {
    Birthday: '🎂', Anniversary: '💞', Engagement: '💍', Wedding: '🥂', Graduation: '🎓',
    'New Job': '💼', Festival: '🪔', Achievement: '🏆', Other: '🎁',
  };
  return map[occasion];
};

export default function HomeScreen() {
  const { celebrations, hydrated } = useCelebrations();
  const today = todayKey();
  const todaysCelebrations = celebrations.filter((item) => item.date === today);
  const upcoming = celebrations
    .filter((item) => item.date !== today)
    .slice()
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date));

  const heroTitle = todaysCelebrations.length === 1
    ? `It’s ${todaysCelebrations[0].name}’s special day ${occasionEmoji(todaysCelebrations[0].occasionType)}`
    : todaysCelebrations.length > 1
      ? `${todaysCelebrations.length} people to celebrate today 🎉`
      : 'No special day today — yet ✨';

  const heroBody = todaysCelebrations.length === 1
    ? `${todaysCelebrations[0].occasionType} today. A thoughtful wish takes seconds — make it count.`
    : todaysCelebrations.length > 1
      ? 'Your people are waiting for a little SANLY magic today.'
      : 'We’ll put today’s birthdays and celebrations right here when they arrive.';

  const CelebrationCard = ({ person, todayCard = false }: { person: Celebration; todayCard?: boolean }) => (
    <View style={[styles.personCard, todayCard && styles.todayCard]}>
      <View style={[styles.initial, todayCard && styles.todayInitial]}>
        <Text style={styles.initialText}>{occasionEmoji(person.occasionType)}</Text>
      </View>
      <View style={styles.personText}>
        <Text style={styles.personName}>{person.name}</Text>
        <Text style={styles.personMeta}>{person.occasionType} • {person.date} • {person.relationship}</Text>
      </View>
      <Pressable onPress={() => router.push(`/wish/${person.id}`)} style={({ pressed }) => [styles.wishButton, pressed && styles.pressed]}>
        <Text style={styles.wishButtonText}>Wish</Text><Ionicons name="sparkles" size={15} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>SANLY</Text>
            <Text style={styles.tagline}>Don’t forget to wish your loved ones.</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>💜</Text></View>
        </View>

        <View style={[styles.hero, todaysCelebrations.length > 0 && styles.heroToday]}>
          <Text style={styles.heroSparkle}>{todaysCelebrations.length > 0 ? '🎈' : '✨'}</Text>
          <Text style={styles.eyebrow}>आज • TODAY</Text>
          <Text style={styles.heroTitle}>{hydrated ? heroTitle : 'Remembering your celebrations…'}</Text>
          <Text style={styles.heroBody}>{hydrated ? heroBody : 'One moment while SANLY gets today ready.'}</Text>
          {hydrated && todaysCelebrations.length === 1 && (
            <Pressable onPress={() => router.push(`/wish/${todaysCelebrations[0].id}`)} style={({ pressed }) => [styles.heroWishButton, pressed && styles.pressed]}>
              <Text style={styles.heroWishText}>Wish {todaysCelebrations[0].name}</Text>
              <Ionicons name="sparkles" size={17} color="#FFFFFF" />
            </Pressable>
          )}
        </View>

        {hydrated && todaysCelebrations.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today</Text>
              <Text style={styles.todayCount}>{todaysCelebrations.length} special {todaysCelebrations.length === 1 ? 'moment' : 'moments'}</Text>
            </View>
            <View style={styles.cards}>{todaysCelebrations.map((person) => <CelebrationCard key={person.id} person={person} todayCard />)}</View>
          </>
        )}

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
        ) : upcoming.length === 0 ? (
          <View style={styles.allTodayCard}>
            <Text style={styles.allTodayEmoji}>🎉</Text>
            <Text style={styles.allTodayTitle}>Everything saved is happening today!</Text>
            <Text style={styles.allTodayBody}>Enjoy the celebrations — you can add another special person anytime.</Text>
          </View>
        ) : (
          <View style={styles.cards}>{upcoming.map((person) => <CelebrationCard key={person.id} person={person} />)}</View>
        )}

        <Text style={styles.marathiNote}>आपल्या माणसांना शुभेच्छा द्यायला विसरू नका. 💜</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9F5' }, container: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 36 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }, brandBlock: { flex: 1, paddingRight: 12 },
  brand: { fontSize: 26, fontWeight: '900', letterSpacing: 2.8, color: '#6D28A8' }, tagline: { marginTop: 5, fontSize: 13, color: '#756878' }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5EEFA', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E6D6F0' }, avatarText: { fontSize: 19 },
  hero: { backgroundColor: '#F5EEFA', borderRadius: 30, padding: 24, minHeight: 190, justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E9DDF1' }, heroToday: { backgroundColor: '#FFF0E8', borderColor: '#F4D5C5' }, heroSparkle: { position: 'absolute', right: 20, top: 18, fontSize: 34 }, eyebrow: { fontSize: 12, fontWeight: '900', letterSpacing: 1.3, color: '#6D28A8', marginBottom: 10 }, heroTitle: { fontSize: 29, lineHeight: 35, fontWeight: '900', color: '#35143F', maxWidth: 315 }, heroBody: { marginTop: 12, fontSize: 15, lineHeight: 22, color: '#756878', maxWidth: 310 }, heroWishButton: { marginTop: 18, alignSelf: 'flex-start', minHeight: 48, borderRadius: 16, paddingHorizontal: 18, backgroundColor: '#6D28A8', flexDirection: 'row', alignItems: 'center', gap: 7 }, heroWishText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
  sectionHeader: { marginTop: 30, marginBottom: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sectionTitle: { fontSize: 20, fontWeight: '900', color: '#35143F' }, addLink: { color: '#6D28A8', fontWeight: '900', fontSize: 13 }, todayCount: { color: '#E85D8E', fontWeight: '800', fontSize: 12 }, loading: { color: '#756878', paddingVertical: 20 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 28, paddingHorizontal: 24, paddingVertical: 28, alignItems: 'center', borderWidth: 1, borderColor: '#EFE4F4' }, giftCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF0E8', alignItems: 'center', justifyContent: 'center', marginBottom: 17 }, gift: { fontSize: 32 }, emptyTitle: { fontSize: 20, lineHeight: 26, fontWeight: '900', color: '#35143F', textAlign: 'center' }, emptyBody: { marginTop: 9, fontSize: 14, lineHeight: 21, color: '#756878', textAlign: 'center', maxWidth: 300 },
  primaryButton: { marginTop: 22, minHeight: 56, width: '100%', borderRadius: 18, backgroundColor: '#6D28A8', flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' }, primaryButtonText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' }, cards: { gap: 12 }, personCard: { minHeight: 86, borderRadius: 22, backgroundColor: '#FFFFFF', padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EFE4F4' }, todayCard: { borderColor: '#F3C8DA', backgroundColor: '#FFF9FC' }, initial: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F5EEFA', alignItems: 'center', justifyContent: 'center' }, todayInitial: { backgroundColor: '#FFF0E8' }, initialText: { fontSize: 23 },
  personText: { flex: 1, marginLeft: 12, marginRight: 8 }, personName: { fontSize: 17, fontWeight: '900', color: '#2B2030' }, personMeta: { fontSize: 12, lineHeight: 18, marginTop: 3, color: '#756878' }, wishButton: { height: 42, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#6D28A8', flexDirection: 'row', alignItems: 'center', gap: 5 }, wishButtonText: { color: '#FFFFFF', fontWeight: '900' }, pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  allTodayCard: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#EFE4F4', padding: 20, alignItems: 'center' }, allTodayEmoji: { fontSize: 30 }, allTodayTitle: { marginTop: 8, fontWeight: '900', color: '#35143F', fontSize: 16, textAlign: 'center' }, allTodayBody: { marginTop: 5, color: '#756878', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  marathiNote: { marginTop: 24, textAlign: 'center', fontSize: 13, lineHeight: 20, color: '#756878' },
});
