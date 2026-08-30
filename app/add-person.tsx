import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OccasionType, Relationship, useCelebrations, WishLanguage } from '@/src/celebrations-context';

const relationships: Relationship[] = ['Friend', 'Family', 'Partner', 'Colleague'];
const languages: WishLanguage[] = ['Marathi', 'English'];
const occasions: { type: OccasionType; emoji: string }[] = [
  { type: 'Birthday', emoji: '🎂' }, { type: 'Anniversary', emoji: '💞' }, { type: 'Engagement', emoji: '💍' },
  { type: 'Wedding', emoji: '🥂' }, { type: 'Graduation', emoji: '🎓' }, { type: 'New Job', emoji: '💼' },
  { type: 'Festival', emoji: '🪔' }, { type: 'Achievement', emoji: '🏆' }, { type: 'Other', emoji: '🎁' },
];

const formatDateInput = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const isValidDate = (value: string) => {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;
  const [day, month] = value.split('/').map(Number);
  if (month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = new Date(2024, month, 0).getDate();
  return day <= daysInMonth;
};

export default function AddPersonScreen() {
  const { addCelebration } = useCelebrations();
  const [name, setName] = useState('');
  const [occasionType, setOccasionType] = useState<OccasionType>('Birthday');
  const [date, setDate] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('Friend');
  const [wishLanguage, setWishLanguage] = useState<WishLanguage>('Marathi');

  const canSave = name.trim().length > 1 && isValidDate(date);
  const save = () => {
    if (!canSave) return;
    addCelebration({ name: name.trim(), occasionType, date, relationship, wishLanguage });
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.introCard}>
            <Text style={styles.introEmoji}>🎈✨</Text>
            <Text style={styles.kicker}>Who are we celebrating?</Text>
            <Text style={styles.introBody}>Add someone special now. SANLY will help you remember the moment later.</Text>
          </View>

          <Text style={styles.label}>What are we celebrating?</Text>
          <View style={styles.occasionGrid}>
            {occasions.map(({ type, emoji }) => (
              <Pressable key={type} onPress={() => setOccasionType(type)} style={[styles.occasionCard, occasionType === type && styles.occasionActive]}>
                <Text style={styles.occasionEmoji}>{emoji}</Text>
                <Text style={[styles.occasionText, occasionType === type && styles.occasionTextActive]}>{type}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Who is this for?</Text>
          <TextInput autoFocus value={name} onChangeText={setName} placeholder="Their name" placeholderTextColor="#A89AAA" style={styles.input} />

          <Text style={styles.label}>Date</Text>
          <TextInput value={date} onChangeText={(text) => setDate(formatDateInput(text))} placeholder="DD/MM" placeholderTextColor="#A89AAA" style={styles.input} keyboardType="number-pad" maxLength={5} />
          <Text style={styles.helper}>Just type 0208 — SANLY will format it as 02/08.</Text>

          <Text style={styles.label}>They’re my…</Text>
          <View style={styles.chips}>{relationships.map((item) => (
            <Pressable key={item} onPress={() => setRelationship(item)} style={[styles.chip, relationship === item && styles.chipActive]}>
              <Text style={[styles.chipText, relationship === item && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          ))}</View>

          <Text style={styles.label}>Wish language</Text>
          <View style={styles.languageRow}>{languages.map((item) => (
            <Pressable key={item} onPress={() => setWishLanguage(item)} style={[styles.languageCard, wishLanguage === item && styles.languageCardActive]}>
              <Text style={styles.languageEmoji}>{item === 'Marathi' ? 'म' : 'A'}</Text>
              <Text style={[styles.languageText, wishLanguage === item && styles.languageTextActive]}>{item}</Text>
            </Pressable>
          ))}</View>

          <Pressable disabled={!canSave} onPress={save} style={({ pressed }) => [styles.save, !canSave && styles.saveDisabled, pressed && canSave && styles.pressed]}>
            <Text style={styles.saveText}>Save celebration 🎉</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safe: { flex: 1, backgroundColor: '#FFF9F5' }, container: { padding: 22, paddingBottom: 36 },
  introCard: { backgroundColor: '#F5EEFA', borderRadius: 26, padding: 20, marginBottom: 4, borderWidth: 1, borderColor: '#E8DDF0' }, introEmoji: { fontSize: 26, marginBottom: 8 }, kicker: { fontSize: 24, lineHeight: 30, fontWeight: '900', color: '#35143F' }, introBody: { marginTop: 7, color: '#756878', lineHeight: 21 }, label: { fontSize: 15, fontWeight: '900', color: '#35143F', marginBottom: 9, marginTop: 18 },
  occasionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, occasionCard: { width: '31%', minHeight: 90, borderRadius: 19, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EDE3F1', alignItems: 'center', justifyContent: 'center', padding: 8 },
  occasionActive: { backgroundColor: '#F5EEFA', borderColor: '#6D28A8' }, occasionEmoji: { fontSize: 26, marginBottom: 6 }, occasionText: { textAlign: 'center', fontSize: 11, fontWeight: '800', color: '#756878' }, occasionTextActive: { color: '#6D28A8' },
  input: { minHeight: 58, borderRadius: 18, paddingHorizontal: 18, backgroundColor: '#FFFFFF', fontSize: 18, color: '#2B2030', borderWidth: 1, borderColor: '#EDE3F1' }, helper: { marginTop: 7, marginLeft: 3, fontSize: 12, lineHeight: 18, color: '#8D7E90' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, chip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EDE3F1' }, chipActive: { backgroundColor: '#F5EEFA', borderColor: '#6D28A8' }, chipText: { fontWeight: '700', color: '#756878' }, chipTextActive: { color: '#6D28A8' },
  languageRow: { flexDirection: 'row', gap: 12 }, languageCard: { flex: 1, minHeight: 94, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#EDE3F1', alignItems: 'center', justifyContent: 'center' }, languageCardActive: { backgroundColor: '#F5EEFA', borderColor: '#6D28A8' }, languageEmoji: { fontSize: 24, fontWeight: '900', color: '#6D28A8', marginBottom: 5 }, languageText: { fontSize: 14, fontWeight: '800', color: '#756878' }, languageTextActive: { color: '#6D28A8' },
  save: { marginTop: 34, minHeight: 58, borderRadius: 18, backgroundColor: '#6D28A8', alignItems: 'center', justifyContent: 'center' }, saveDisabled: { opacity: 0.35 }, saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' }, pressed: { transform: [{ scale: 0.99 }], opacity: 0.85 },
});
