import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLanguage, useLanguage } from '@/src/language-context';

export default function LanguageScreen() {
  const { language, setLanguage, t } = useLanguage();
  const choose = async (next: AppLanguage) => { await setLanguage(next); router.replace('/'); };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View><Text style={styles.brand}>SANLY</Text><Text style={styles.heart}>💗</Text></View>
        <View style={styles.copy}>
          <Text style={styles.title}>{language ? t('chooseLanguage') : 'तुमची भाषा निवडा'}</Text>
          <Text style={styles.titleEnglish}>Choose your language</Text>
          <Text style={styles.body}>SANLY चे सर्व पर्याय तुमच्या भाषेत दिसतील.{`\n`}The whole app will use your chosen language.</Text>
        </View>
        <View style={styles.options}>
          <Pressable onPress={() => choose('Marathi')} style={({ pressed }) => [styles.option, styles.marathi, pressed && styles.pressed]}>
            <View style={styles.languageIcon}><Text style={styles.languageIconText}>म</Text></View>
            <View style={styles.optionCopy}><Text style={styles.optionTitle}>मराठी</Text><Text style={styles.optionBody}>SANLY मराठीत वापरा</Text></View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
          <Pressable onPress={() => choose('English')} style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
            <View style={[styles.languageIcon, styles.englishIcon]}><Text style={styles.languageIconText}>A</Text></View>
            <View style={styles.optionCopy}><Text style={styles.optionTitle}>English</Text><Text style={styles.optionBody}>Use SANLY in English</Text></View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>
        <Text style={styles.note}>You can change this later. • हे नंतर बदलता येईल.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F5' }, container: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 28 },
  brand: { fontSize: 28, fontWeight: '900', letterSpacing: 3, color: '#6D28A8' }, heart: { position: 'absolute', left: 108, top: 2, fontSize: 22 }, copy: { marginTop: 74 },
  title: { fontSize: 32, lineHeight: 42, fontWeight: '900', color: '#35143F' }, titleEnglish: { marginTop: 4, fontSize: 22, fontWeight: '800', color: '#E85D8E' }, body: { marginTop: 16, fontSize: 15, lineHeight: 25, color: '#756878' },
  options: { marginTop: 36, gap: 14 }, option: { minHeight: 92, paddingHorizontal: 18, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8DFF0', flexDirection: 'row', alignItems: 'center' }, marathi: { backgroundColor: '#FFF5F8', borderColor: '#F2C7D8' },
  languageIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#E85D8E', alignItems: 'center', justifyContent: 'center' }, englishIcon: { backgroundColor: '#6D28A8' }, languageIconText: { color: '#FFFFFF', fontSize: 23, fontWeight: '900' }, optionCopy: { flex: 1, marginLeft: 15 }, optionTitle: { fontSize: 20, fontWeight: '900', color: '#35143F' }, optionBody: { marginTop: 4, color: '#756878', fontSize: 13 }, arrow: { fontSize: 34, color: '#A98CB8', marginLeft: 8 }, pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] }, note: { marginTop: 'auto', textAlign: 'center', color: '#9A889E', fontSize: 12 },
});
