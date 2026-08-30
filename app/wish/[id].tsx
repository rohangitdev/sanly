import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration, useCelebrations } from '@/src/celebrations-context';

function wishesFor(person: Celebration) {
  const occasion = person.occasionType;
  if (person.wishLanguage === 'Marathi') {
    if (occasion === 'Birthday') return [
      { label: 'मनापासून', text: `प्रिय ${person.name}, वाढदिवसाच्या मनःपूर्वक शुभेच्छा! तुमचा दिवस आनंदाने आणि सुंदर क्षणांनी भरलेला जावो. 🎉🎂` },
      { label: 'उबदार', text: `${person.name}, तुमच्या आयुष्यात आनंद, आरोग्य आणि भरभराट सदैव नांदो. वाढदिवसाच्या खूप खूप शुभेच्छा! ❤️🎈` },
      { label: 'धमाल', text: `आजचा दिवस फक्त तुमचाच, ${person.name}! केक खा, हसा, मजा करा आणि भरपूर आठवणी बनवा. 🥳🎂🎉` },
    ];
    return [
      { label: 'मनापासून', text: `प्रिय ${person.name}, ${occasion}च्या या खास प्रसंगी मनःपूर्वक शुभेच्छा! हा आनंदाचा क्षण कायम स्मरणात राहो. ❤️✨` },
      { label: 'उबदार', text: `${person.name}, या सुंदर ${occasion} निमित्त तुम्हाला खूप आनंद, प्रेम आणि यश लाभो. हार्दिक शुभेच्छा! 🎉🌸` },
      { label: 'आनंदी', text: `${occasion} साजरा करण्याची वेळ आली! ${person.name}, आजचा खास क्षण मनसोक्त जगा आणि भरपूर आठवणी बनवा. 🥳🎈` },
    ];
  }
  if (occasion === 'Birthday') return [
    { label: 'Heartfelt', text: `Happy birthday, ${person.name}! Wishing you a beautiful day filled with joy, laughter and wonderful memories. 🎉🎂` },
    { label: 'Warm', text: `${person.name}, may the year ahead bring you happiness, good health and everything you’re hoping for. Happy birthday! ❤️🎈` },
    { label: 'Fun', text: `It’s your day, ${person.name}! Eat cake, laugh loudly and make some brilliant memories. Happy birthday! 🥳🎂` },
  ];
  return [
    { label: 'Heartfelt', text: `Dear ${person.name}, heartfelt wishes on your ${occasion}. May this special moment become a beautiful memory. ❤️✨` },
    { label: 'Warm', text: `${person.name}, wishing you so much happiness and success as you celebrate this ${occasion}. Congratulations! 🎉` },
    { label: 'Fun', text: `Time to celebrate your ${occasion}, ${person.name}! Enjoy every minute and make it unforgettable. 🥳🎈` },
  ];
}

export default function WishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { celebrations } = useCelebrations();
  const person = celebrations.find((item) => item.id === id);

  if (!person) return <SafeAreaView style={styles.safe}><View style={styles.missing}><Text style={styles.title}>We couldn’t find this celebration.</Text><Pressable onPress={() => router.replace('/')}><Text style={styles.link}>Back home</Text></Pressable></View></SafeAreaView>;

  const wishes = wishesFor(person);
  const shareWish = async (message: string) => Share.share({ message });
  const openWhatsApp = async (message: string) => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url); else await shareWish(message);
  };
  const customize = (message = '') => router.push({ pathname: '/custom-wish/[id]', params: { id: person.id, draft: message } });

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.celebrationHero}>
          <Text style={[styles.float, styles.leftBalloon]}>🎈</Text><Text style={[styles.float, styles.rightBalloon]}>🎈</Text>
          <Text style={[styles.float, styles.confettiOne]}>✨</Text><Text style={[styles.float, styles.confettiTwo]}>🎊</Text>
          <Text style={styles.heroEmoji}>{person.occasionType === 'Birthday' ? '🎂' : '🎉'}</Text>
          <Text style={styles.heroKicker}>{person.occasionType} • {person.date}</Text>
          <Text style={styles.heroTitle}>Celebrate {person.name}! 🥳</Text>
          <Text style={styles.heroSubtitle}>Pick something that feels like you.</Text>
        </View>

        <View style={styles.personLine}><Text style={styles.personLineText}>{person.relationship} • wishes in {person.wishLanguage}</Text></View>
        <Text style={styles.sectionTitle}>Choose a wish</Text>

        {wishes.map((wish) => (
          <View key={wish.label} style={styles.wishCard}>
            <View style={styles.wishHeader}><Text style={styles.wishLabel}>{wish.label}</Text><Text>💜</Text></View>
            <Text style={styles.wishText}>{wish.text}</Text>
            <Pressable onPress={() => customize(wish.text)} style={styles.customizeLink}><Ionicons name="pencil-outline" size={16} color="#7650A8" /><Text style={styles.customizeText}>Customize this wish</Text></Pressable>
            <View style={styles.actions}>
              <Pressable onPress={() => shareWish(wish.text)} style={styles.secondaryButton}><Ionicons name="share-outline" size={18} color="#7650A8" /><Text style={styles.secondaryText}>Share</Text></Pressable>
              <Pressable onPress={() => openWhatsApp(wish.text)} style={styles.whatsappButton}><Ionicons name="logo-whatsapp" size={19} color="#FFFFFF" /><Text style={styles.whatsappText}>WhatsApp</Text></Pressable>
            </View>
          </View>
        ))}

        <Pressable onPress={() => customize('')} style={styles.writeOwn}><Ionicons name="create-outline" size={20} color="#7650A8" /><View><Text style={styles.writeOwnTitle}>Write my own wish</Text><Text style={styles.writeOwnBody}>Start from a blank page and make it personal.</Text></View></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F4' }, container: { padding: 22, paddingBottom: 40 }, missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, link: { color: '#7650A8', fontWeight: '800', marginTop: 16 },
  celebrationHero: { minHeight: 235, backgroundColor: '#F4EAFE', borderRadius: 30, padding: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, float: { position: 'absolute', fontSize: 34 }, leftBalloon: { left: 13, top: 48 }, rightBalloon: { right: 14, top: 30 }, confettiOne: { left: 44, bottom: 27, fontSize: 22 }, confettiTwo: { right: 42, bottom: 26, fontSize: 24 }, heroEmoji: { fontSize: 55, marginBottom: 9 }, heroKicker: { color: '#7650A8', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 }, heroTitle: { fontSize: 28, lineHeight: 34, fontWeight: '900', color: '#3F2C53', textAlign: 'center', marginTop: 5 }, heroSubtitle: { color: '#786A85', marginTop: 7 },
  personLine: { alignItems: 'center', marginTop: 14 }, personLineText: { fontSize: 12, color: '#8A768E' }, sectionTitle: { fontSize: 21, fontWeight: '900', color: '#3F2C53', marginTop: 24, marginBottom: 2 }, title: { fontSize: 24, fontWeight: '900', color: '#492C2A' },
  wishCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#EDE2F4' }, wishHeader: { flexDirection: 'row', justifyContent: 'space-between' }, wishLabel: { fontSize: 14, fontWeight: '900', color: '#7650A8' }, wishText: { fontSize: 17, lineHeight: 28, color: '#45374C', marginTop: 12 }, customizeLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 15 }, customizeText: { color: '#7650A8', fontWeight: '800', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 }, secondaryButton: { flex: 1, minHeight: 48, borderRadius: 16, backgroundColor: '#F6EFFC', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, secondaryText: { color: '#7650A8', fontWeight: '800' }, whatsappButton: { flex: 1.25, minHeight: 48, borderRadius: 16, backgroundColor: '#2F7D55', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, whatsappText: { color: '#FFFFFF', fontWeight: '800' },
  writeOwn: { marginTop: 16, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#BCA4D3', backgroundColor: '#FBF7FF' }, writeOwnTitle: { fontWeight: '900', color: '#5D3D80' }, writeOwnBody: { fontSize: 12, color: '#8A768E', marginTop: 3, maxWidth: 260 },
});
