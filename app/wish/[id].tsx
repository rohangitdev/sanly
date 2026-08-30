import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
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
  const entrance = useRef(new Animated.Value(0)).current;
  const balloon = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(entrance, { toValue: 1, useNativeDriver: true, friction: 7, tension: 55 }),
      Animated.loop(Animated.sequence([
        Animated.timing(balloon, { toValue: 1, duration: 1700, useNativeDriver: true }),
        Animated.timing(balloon, { toValue: 0, duration: 1700, useNativeDriver: true }),
      ])),
    ]).start();
  }, [balloon, entrance]);

  if (!person) return <SafeAreaView style={styles.safe}><View style={styles.missing}><Text style={styles.title}>We couldn’t find this celebration.</Text><Pressable onPress={() => router.replace('/')}><Text style={styles.link}>Back home</Text></Pressable></View></SafeAreaView>;

  const wishes = wishesFor(person);
  const shareWish = async (message: string) => Share.share({ message });
  const openWhatsApp = async (message: string) => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url); else await shareWish(message);
  };
  const customize = (message = '') => router.push({ pathname: '/custom-wish/[id]', params: { id: person.id, draft: message } });
  const isMarathi = person.wishLanguage === 'Marathi';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.celebrationHero, { opacity: entrance, transform: [{ scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }] }]}> 
          <Animated.Text style={[styles.float, styles.leftBalloon, { transform: [{ translateY: balloon.interpolate({ inputRange: [0, 1], outputRange: [6, -9] }) }] }]}>🎈</Animated.Text>
          <Animated.Text style={[styles.float, styles.rightBalloon, { transform: [{ translateY: balloon.interpolate({ inputRange: [0, 1], outputRange: [-5, 10] }) }] }]}>🎈</Animated.Text>
          <Text style={[styles.float, styles.confettiOne]}>✨</Text><Text style={[styles.float, styles.confettiTwo]}>🎊</Text><Text style={[styles.float, styles.confettiThree]}>💫</Text>
          <Text style={styles.heroKicker}>आज • {person.occasionType} • {person.date}</Text>
          <Text style={styles.heroName}>{person.name}</Text>
          <Text style={styles.heroTitle}>{isMarathi ? 'चा खास दिवस आहे' : 'deserves a little celebration'}</Text>
          <Text style={styles.heroEmoji}>{person.occasionType === 'Birthday' ? '🎂' : '🎉'}</Text>
          <Text style={styles.heroSubtitle}>{isMarathi ? 'चला, त्यांना काहीतरी खास शुभेच्छा देऊया 💜' : 'Let’s make the wish feel personal. 💜'}</Text>
        </Animated.View>

        <View style={styles.personLine}><Text style={styles.personLineText}>{person.relationship} • wishes in {person.wishLanguage}</Text></View>
        <Text style={styles.sectionTitle}>{isMarathi ? 'शुभेच्छा निवडा' : 'Choose a wish'}</Text>

        {wishes.map((wish) => (
          <View key={wish.label} style={styles.wishCard}>
            <View style={styles.wishHeader}><Text style={styles.wishLabel}>{wish.label}</Text><Text>💜</Text></View>
            <Text style={styles.wishText}>{wish.text}</Text>
            <Pressable onPress={() => customize(wish.text)} style={styles.customizeLink}><Ionicons name="pencil-outline" size={16} color="#6D28A8" /><Text style={styles.customizeText}>{isMarathi ? 'ही शुभेच्छा बदला' : 'Customize this wish'}</Text></Pressable>
            <View style={styles.actions}>
              <Pressable onPress={() => shareWish(wish.text)} style={styles.secondaryButton}><Ionicons name="share-outline" size={18} color="#6D28A8" /><Text style={styles.secondaryText}>{isMarathi ? 'शेअर' : 'Share'}</Text></Pressable>
              <Pressable onPress={() => openWhatsApp(wish.text)} style={styles.whatsappButton}><Ionicons name="logo-whatsapp" size={19} color="#FFFFFF" /><Text style={styles.whatsappText}>WhatsApp</Text></Pressable>
            </View>
          </View>
        ))}

        <Pressable onPress={() => customize('')} style={styles.writeOwn}><Ionicons name="create-outline" size={20} color="#6D28A8" /><View><Text style={styles.writeOwnTitle}>{isMarathi ? 'माझ्या शब्दांत लिहा' : 'Write my own wish'}</Text><Text style={styles.writeOwnBody}>{isMarathi ? 'मनातलं स्वतःच्या शब्दांत लिहा.' : 'Start from a blank page and make it personal.'}</Text></View></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F5' }, container: { padding: 22, paddingBottom: 40 }, missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, link: { color: '#6D28A8', fontWeight: '900', marginTop: 16 },
  celebrationHero: { minHeight: 315, backgroundColor: '#35143F', borderRadius: 32, padding: 26, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, float: { position: 'absolute', fontSize: 38 }, leftBalloon: { left: 15, top: 48 }, rightBalloon: { right: 16, top: 31 }, confettiOne: { left: 43, bottom: 35, fontSize: 22 }, confettiTwo: { right: 42, bottom: 29, fontSize: 24 }, confettiThree: { right: 46, top: 110, fontSize: 20 }, heroKicker: { color: '#E8D8F4', fontSize: 12, fontWeight: '900', letterSpacing: 0.8 }, heroName: { fontSize: 44, lineHeight: 50, fontWeight: '900', color: '#F4A62A', textAlign: 'center', marginTop: 10 }, heroTitle: { fontSize: 24, lineHeight: 31, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginTop: 2 }, heroEmoji: { fontSize: 54, marginTop: 11 }, heroSubtitle: { color: '#F7ECFA', marginTop: 13, textAlign: 'center', fontSize: 14, lineHeight: 21, maxWidth: 270 },
  personLine: { alignItems: 'center', marginTop: 14 }, personLineText: { fontSize: 12, color: '#756878' }, sectionTitle: { fontSize: 22, fontWeight: '900', color: '#35143F', marginTop: 24, marginBottom: 2 }, title: { fontSize: 24, fontWeight: '900', color: '#35143F' },
  wishCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#EDE2F4' }, wishHeader: { flexDirection: 'row', justifyContent: 'space-between' }, wishLabel: { fontSize: 14, fontWeight: '900', color: '#6D28A8' }, wishText: { fontSize: 17, lineHeight: 28, color: '#2B2030', marginTop: 12 }, customizeLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 15 }, customizeText: { color: '#6D28A8', fontWeight: '800', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 }, secondaryButton: { flex: 1, minHeight: 48, borderRadius: 16, backgroundColor: '#F5EEFA', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, secondaryText: { color: '#6D28A8', fontWeight: '900' }, whatsappButton: { flex: 1.25, minHeight: 48, borderRadius: 16, backgroundColor: '#2F7D55', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, whatsappText: { color: '#FFFFFF', fontWeight: '900' },
  writeOwn: { marginTop: 16, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B99ACF', backgroundColor: '#F9F4FC' }, writeOwnTitle: { fontWeight: '900', color: '#5A2379' }, writeOwnBody: { fontSize: 12, color: '#756878', marginTop: 3, maxWidth: 260 },
});
