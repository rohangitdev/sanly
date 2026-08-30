import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration, useCelebrations } from '@/src/celebrations-context';
import { useLanguage } from '@/src/language-context';

const todayKey = () => { const now = new Date(); return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`; };
const daysUntil = (date: string) => { const [day, month] = date.split('/').map(Number); const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); let target = new Date(now.getFullYear(), month - 1, day); if (target < today) target = new Date(now.getFullYear() + 1, month - 1, day); return Math.round((target.getTime() - today.getTime()) / 86400000); };
const occasionEmoji = (occasion: Celebration['occasionType']) => ({ Birthday: '🎂', Anniversary: '💞', Engagement: '💍', Wedding: '🥂', Graduation: '🎓', 'New Job': '💼', Festival: '🪔', Achievement: '🏆', Other: '🎁' }[occasion]);
const occasionMr: Record<Celebration['occasionType'], string> = { Birthday: 'वाढदिवस', Anniversary: 'वर्धापनदिन', Engagement: 'साखरपुडा', Wedding: 'लग्न', Graduation: 'पदवीदान', 'New Job': 'नवीन नोकरी', Festival: 'सण', Achievement: 'यश', Other: 'खास प्रसंग' };
const relationshipMr: Record<Celebration['relationship'], string> = { Friend: 'मित्र/मैत्रीण', Family: 'कुटुंब', Partner: 'जोडीदार', Colleague: 'सहकारी' };

export default function HomeScreen() {
  const { celebrations, hydrated } = useCelebrations();
  const { language, hydrated: languageHydrated, t } = useLanguage();
  const mr = language === 'Marathi';
  useEffect(() => { if (languageHydrated && !language) router.replace('/language'); }, [languageHydrated, language]);

  const today = todayKey();
  const todaysCelebrations = celebrations.filter((item) => item.date === today);
  const upcoming = celebrations.filter((item) => item.date !== today).slice().sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
  const occasionName = (p: Celebration) => mr ? occasionMr[p.occasionType] : p.occasionType;
  const relationshipName = (p: Celebration) => mr ? relationshipMr[p.relationship] : p.relationship;

  const heroTitle = todaysCelebrations.length === 1
    ? mr ? `${todaysCelebrations[0].name}${t('specialDay')} ${occasionEmoji(todaysCelebrations[0].occasionType)}` : `It’s ${todaysCelebrations[0].name}’s ${t('specialDay')} ${occasionEmoji(todaysCelebrations[0].occasionType)}`
    : todaysCelebrations.length > 1 ? `${todaysCelebrations.length} ${t('manyToday')}` : t('noToday');
  const heroBody = todaysCelebrations.length === 1 ? `${occasionName(todaysCelebrations[0])} • ${t('oneTodayBody')}` : todaysCelebrations.length > 1 ? (mr ? 'आज तुमच्या खास माणसांसाठी थोडा आनंद पसरवा.' : 'Your people are waiting for a little SANLY magic today.') : t('noTodayBody');

  const CelebrationCard = ({ person, todayCard = false }: { person: Celebration; todayCard?: boolean }) => (
    <View style={[styles.personCard, todayCard ? styles.todayCard : styles.upcomingCard]}>
      <View style={[styles.initial, todayCard ? styles.todayInitial : styles.upcomingInitial]}><Text style={styles.initialText}>{occasionEmoji(person.occasionType)}</Text></View>
      <View style={styles.personText}><Text style={styles.personName}>{person.name}</Text><Text style={styles.personMeta}>{occasionName(person)} • {person.date} • {relationshipName(person)}</Text></View>
      <View style={styles.cardActions}>
        <Pressable accessibilityLabel={mr ? 'तपशील बदला' : 'Edit'} onPress={() => router.push(`/edit-person/${person.id}`)} style={styles.editButton}><Ionicons name="pencil-outline" size={17} color="#6D28A8" /></Pressable>
        <Pressable onPress={() => router.push(`/wish/${person.id}`)} style={({ pressed }) => [styles.wishButton, todayCard && styles.todayWishButton, pressed && styles.pressed]}><Text style={styles.wishButtonText}>{t('wish')}</Text><Ionicons name="sparkles" size={15} color="#FFFFFF" /></Pressable>
      </View>
    </View>
  );

  if (!languageHydrated || !language) return <SafeAreaView style={styles.safeArea} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}><ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View style={styles.brandBlock}><Text style={styles.brand}>SANLY</Text><Text style={styles.tagline}>{t('tagline')}</Text></View><Pressable onPress={() => router.push('/language')} style={styles.languageButton}><Text style={styles.languageButtonText}>{mr ? 'मराठी' : 'EN'}</Text></Pressable></View>
      <View style={[styles.hero, todaysCelebrations.length > 0 && styles.heroToday]}><Text style={styles.heroSparkle}>{todaysCelebrations.length > 0 ? '🎈' : '✨'}</Text><Text style={[styles.eyebrow, todaysCelebrations.length > 0 && styles.eyebrowToday]}>{t('today').toUpperCase()}</Text><Text style={styles.heroTitle}>{hydrated ? heroTitle : t('loading')}</Text><Text style={styles.heroBody}>{hydrated ? heroBody : t('loading')}</Text>{hydrated && todaysCelebrations.length === 1 && <Pressable onPress={() => router.push(`/wish/${todaysCelebrations[0].id}`)} style={({ pressed }) => [styles.heroWishButton, pressed && styles.pressed]}><Text style={styles.heroWishText}>{t('wish')} {todaysCelebrations[0].name}</Text><Ionicons name="sparkles" size={17} color="#FFFFFF" /></Pressable>}</View>
      {hydrated && todaysCelebrations.length > 0 && <><View style={styles.sectionHeader}><Text style={[styles.sectionTitle, styles.todaySectionTitle]}>{t('today')}</Text><Text style={styles.todayCount}>{todaysCelebrations.length} {todaysCelebrations.length === 1 ? t('specialMoment') : t('specialMoments')}</Text></View><View style={styles.cards}>{todaysCelebrations.map((person) => <CelebrationCard key={person.id} person={person} todayCard />)}</View></>}
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{t('comingUp')}</Text><Pressable onPress={() => router.push('/add-person')} hitSlop={10}><Text style={styles.addLink}>{t('addSomeone')}</Text></Pressable></View>
      {!hydrated ? <Text style={styles.loading}>{t('loading')}</Text> : celebrations.length === 0 ? <View style={styles.emptyCard}><View style={styles.giftCircle}><Text style={styles.gift}>🎁</Text></View><Text style={styles.emptyTitle}>{t('emptyTitle')}</Text><Text style={styles.emptyBody}>{t('emptyBody')}</Text><Pressable onPress={() => router.push('/add-person')} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Ionicons name="add" size={22} color="#FFFFFF" /><Text style={styles.primaryButtonText}>{t('addSomeone').replace('+ ', '')}</Text></Pressable></View> : upcoming.length === 0 ? <View style={styles.allTodayCard}><Text style={styles.allTodayEmoji}>🎉</Text><Text style={styles.allTodayTitle}>{t('allTodayTitle')}</Text><Text style={styles.allTodayBody}>{t('allTodayBody')}</Text></View> : <View style={styles.cards}>{upcoming.map((person) => <CelebrationCard key={person.id} person={person} />)}</View>}
      <Text style={styles.marathiNote}>{t('marathiNote')}</Text>
    </ScrollView></SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9F5' }, container: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 36 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }, brandBlock: { flex: 1, paddingRight: 12 }, brand: { fontSize: 26, fontWeight: '900', letterSpacing: 2.8, color: '#6D28A8' }, tagline: { marginTop: 5, fontSize: 13, color: '#756878' }, languageButton: { minWidth: 52, height: 42, paddingHorizontal: 11, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8DFF0', alignItems: 'center', justifyContent: 'center' }, languageButtonText: { color: '#6D28A8', fontWeight: '900', fontSize: 12 },
  hero: { backgroundColor: '#F5EEFA', borderRadius: 30, padding: 24, minHeight: 190, justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E3D3EE' }, heroToday: { backgroundColor: '#FFF0F5', borderColor: '#F2C1D4' }, heroSparkle: { position: 'absolute', right: 20, top: 18, fontSize: 34 }, eyebrow: { fontSize: 12, fontWeight: '900', letterSpacing: 1.3, color: '#6D28A8', marginBottom: 10 }, eyebrowToday: { color: '#D63E75' }, heroTitle: { fontSize: 29, lineHeight: 37, fontWeight: '900', color: '#35143F', maxWidth: 315 }, heroBody: { marginTop: 12, fontSize: 15, lineHeight: 23, color: '#756878', maxWidth: 310 }, heroWishButton: { marginTop: 18, alignSelf: 'flex-start', minHeight: 48, borderRadius: 16, paddingHorizontal: 18, backgroundColor: '#E85D8E', flexDirection: 'row', alignItems: 'center', gap: 7 }, heroWishText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 }, sectionHeader: { marginTop: 30, marginBottom: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }, sectionTitle: { fontSize: 20, fontWeight: '900', color: '#5F258F' }, todaySectionTitle: { color: '#D63E75' }, addLink: { color: '#6D28A8', fontWeight: '900', fontSize: 12 }, todayCount: { color: '#D63E75', fontWeight: '800', fontSize: 12 }, loading: { color: '#756878', paddingVertical: 20 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 28, paddingHorizontal: 24, paddingVertical: 28, alignItems: 'center', borderWidth: 1, borderColor: '#EFE4F4' }, giftCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF0E8', alignItems: 'center', justifyContent: 'center', marginBottom: 17 }, gift: { fontSize: 32 }, emptyTitle: { fontSize: 20, lineHeight: 28, fontWeight: '900', color: '#35143F', textAlign: 'center' }, emptyBody: { marginTop: 9, fontSize: 14, lineHeight: 23, color: '#756878', textAlign: 'center', maxWidth: 300 }, primaryButton: { marginTop: 22, minHeight: 56, width: '100%', borderRadius: 18, backgroundColor: '#6D28A8', flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' }, primaryButtonText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' }, cards: { gap: 12 }, personCard: { minHeight: 86, borderRadius: 22, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1 }, todayCard: { borderColor: '#F3C8DA', backgroundColor: '#FFF8FB' }, upcomingCard: { borderColor: '#E4D6ED', backgroundColor: '#FCFAFE' }, initial: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' }, todayInitial: { backgroundColor: '#FFE6EF' }, upcomingInitial: { backgroundColor: '#EEE4F7' }, initialText: { fontSize: 23 }, personText: { flex: 1, marginLeft: 12, marginRight: 8 }, personName: { fontSize: 17, fontWeight: '900', color: '#2B2030' }, personMeta: { fontSize: 12, lineHeight: 18, marginTop: 3, color: '#756878' }, cardActions: { alignItems: 'flex-end', gap: 7 }, editButton: { width: 32, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5EEFA' }, wishButton: { minHeight: 39, paddingHorizontal: 10, borderRadius: 13, backgroundColor: '#6D28A8', flexDirection: 'row', alignItems: 'center', gap: 4 }, todayWishButton: { backgroundColor: '#E85D8E' }, wishButtonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 11 }, pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] }, allTodayCard: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#EFE4F4', padding: 20, alignItems: 'center' }, allTodayEmoji: { fontSize: 30 }, allTodayTitle: { marginTop: 8, fontWeight: '900', color: '#35143F', fontSize: 16, textAlign: 'center' }, allTodayBody: { marginTop: 5, color: '#756878', fontSize: 13, lineHeight: 19, textAlign: 'center' }, marathiNote: { marginTop: 24, textAlign: 'center', fontSize: 13, lineHeight: 21, color: '#756878' },
});
