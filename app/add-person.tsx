import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Relationship, useCelebrations, WishLanguage } from '@/src/celebrations-context';

const relationships: Relationship[] = ['Friend', 'Family', 'Partner', 'Colleague'];
const languages: WishLanguage[] = ['Marathi', 'English'];

export default function AddPersonScreen() {
  const { addCelebration } = useCelebrations();
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('Friend');
  const [wishLanguage, setWishLanguage] = useState<WishLanguage>('Marathi');

  const canSave = name.trim().length > 1 && /^\d{2}\/\d{2}$/.test(birthday);

  const save = () => {
    if (!canSave) return;
    addCelebration({ name: name.trim(), birthday, relationship, wishLanguage });
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.kicker}>A tiny detail today, a meaningful moment later.</Text>

          <Text style={styles.label}>Who is this for?</Text>
          <TextInput
            autoFocus
            value={name}
            onChangeText={setName}
            placeholder="Their name"
            placeholderTextColor="#B8A29D"
            style={styles.input}
            returnKeyType="next"
          />

          <Text style={styles.label}>Birthday</Text>
          <TextInput
            value={birthday}
            onChangeText={(text) => setBirthday(text.replace(/[^0-9/]/g, '').slice(0, 5))}
            placeholder="DD/MM"
            placeholderTextColor="#B8A29D"
            style={styles.input}
            keyboardType="number-pad"
            maxLength={5}
          />
          <Text style={styles.helper}>No year needed.</Text>

          <Text style={styles.label}>They’re my…</Text>
          <View style={styles.chips}>
            {relationships.map((item) => (
              <Pressable key={item} onPress={() => setRelationship(item)} style={[styles.chip, relationship === item && styles.chipActive]}>
                <Text style={[styles.chipText, relationship === item && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Wish language</Text>
          <View style={styles.languageRow}>
            {languages.map((item) => (
              <Pressable key={item} onPress={() => setWishLanguage(item)} style={[styles.languageCard, wishLanguage === item && styles.languageCardActive]}>
                <Text style={styles.languageEmoji}>{item === 'Marathi' ? 'म' : 'A'}</Text>
                <Text style={[styles.languageText, wishLanguage === item && styles.languageTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable disabled={!canSave} onPress={save} style={({ pressed }) => [styles.save, !canSave && styles.saveDisabled, pressed && canSave && styles.pressed]}>
            <Text style={styles.saveText}>Remember this birthday</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safe: { flex: 1, backgroundColor: '#FFF9F4' },
  container: { padding: 22, paddingBottom: 36 },
  kicker: { fontSize: 18, lineHeight: 26, color: '#755D59', marginBottom: 28 },
  label: { fontSize: 15, fontWeight: '800', color: '#492C2A', marginBottom: 9, marginTop: 16 },
  input: { minHeight: 58, borderRadius: 18, paddingHorizontal: 18, backgroundColor: '#FFFFFF', fontSize: 18, color: '#492C2A', borderWidth: 1, borderColor: '#F1E2D9' },
  helper: { marginTop: 7, marginLeft: 3, fontSize: 12, color: '#A28781' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEDDD4' },
  chipActive: { backgroundColor: '#FCE9DE', borderColor: '#C75D43' },
  chipText: { fontWeight: '700', color: '#755D59' }, chipTextActive: { color: '#A74731' },
  languageRow: { flexDirection: 'row', gap: 12 },
  languageCard: { flex: 1, minHeight: 92, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#EEDDD4', alignItems: 'center', justifyContent: 'center' },
  languageCardActive: { backgroundColor: '#FCE9DE', borderColor: '#C75D43' },
  languageEmoji: { fontSize: 24, fontWeight: '900', color: '#C75D43', marginBottom: 5 },
  languageText: { fontSize: 14, fontWeight: '800', color: '#755D59' }, languageTextActive: { color: '#A74731' },
  save: { marginTop: 34, minHeight: 56, borderRadius: 18, backgroundColor: '#C75D43', alignItems: 'center', justifyContent: 'center' },
  saveDisabled: { opacity: 0.35 }, saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.85 },
});
