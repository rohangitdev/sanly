import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCelebrations } from '@/src/celebrations-context';

const emojiChoices = ['🎂', '🎉', '🎈', '❤️', '✨', '🥳'];

export default function CustomWishScreen() {
  const { id, draft } = useLocalSearchParams<{ id: string; draft?: string }>();
  const { celebrations } = useCelebrations();
  const person = celebrations.find((item) => item.id === id);
  const [message, setMessage] = useState(draft ?? '');

  const addEmoji = (emoji: string) => setMessage((current) => `${current}${current ? ' ' : ''}${emoji}`);
  const share = async () => Share.share({ message });
  const whatsapp = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    if (await Linking.canOpenURL(url)) await Linking.openURL(url); else await share();
  };

  if (!person) return <SafeAreaView style={styles.safe}><View style={styles.center}><Text>Celebration not found.</Text></View></SafeAreaView>;

  const marathi = person.wishLanguage === 'Marathi';
  const copy = marathi ? {
    kicker: `${person.occasionType} • मराठी`,
    title: 'तुमच्या शब्दांत लिहा 💜',
    subtitle: `${person.name} साठी मनापासून शुभेच्छा लिहा.`,
    placeholder: 'तुमची शुभेच्छा येथे लिहा…',
    keyboardHint: 'मराठी कीबोर्ड वापरून थेट मराठीत लिहू शकता — अगदी WhatsApp सारखे.',
    emojiLabel: 'थोडा आनंद जोडा',
    share: 'शेअर करा',
  } : {
    kicker: `${person.occasionType} • English`,
    title: 'Make it yours 💜',
    subtitle: `Write exactly what you want ${person.name} to feel.`,
    placeholder: `Write something special for ${person.name}…`,
    keyboardHint: 'Use your normal phone keyboard to write naturally.',
    emojiLabel: 'Add a little celebration',
    share: 'Share',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <Text style={styles.kicker}>{copy.kicker}</Text>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          <View style={styles.languageHint}>
            <Text style={styles.languageBadge}>{marathi ? 'म' : 'A'}</Text>
            <Text style={styles.languageHintText}>{copy.keyboardHint}</Text>
          </View>

          <TextInput
            autoFocus
            multiline
            value={message}
            onChangeText={setMessage}
            placeholder={copy.placeholder}
            placeholderTextColor="#AA9AAE"
            style={[styles.editor, marathi && styles.marathiEditor]}
            textAlignVertical="top"
            maxLength={600}
            autoCorrect
            spellCheck={false}
            autoCapitalize="sentences"
          />
          <Text style={styles.count}>{message.length}/600</Text>

          <Text style={styles.emojiLabel}>{copy.emojiLabel}</Text>
          <View style={styles.emojis}>{emojiChoices.map((emoji) => (
            <Pressable key={emoji} onPress={() => addEmoji(emoji)} style={styles.emojiChip}><Text style={styles.emoji}>{emoji}</Text></Pressable>
          ))}</View>

          <View style={styles.spacer} />
          <View style={styles.actions}>
            <Pressable disabled={!message.trim()} onPress={share} style={[styles.share, !message.trim() && styles.disabled]}><Ionicons name="share-outline" size={20} color="#7650A8" /><Text style={styles.shareText}>{copy.share}</Text></Pressable>
            <Pressable disabled={!message.trim()} onPress={whatsapp} style={[styles.whatsapp, !message.trim() && styles.disabled]}><Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" /><Text style={styles.whatsappText}>WhatsApp</Text></Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F4' }, flex: { flex: 1 }, container: { flex: 1, padding: 22, paddingBottom: 22 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontSize: 12, fontWeight: '900', color: '#7650A8', textTransform: 'uppercase', letterSpacing: 0.8 }, title: { fontSize: 28, fontWeight: '900', color: '#3F2C53', marginTop: 5 }, subtitle: { marginTop: 7, fontSize: 14, lineHeight: 21, color: '#837487' },
  languageHint: { marginTop: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 17, backgroundColor: '#F5EBFC', padding: 12 }, languageBadge: { width: 34, height: 34, borderRadius: 17, textAlign: 'center', textAlignVertical: 'center', lineHeight: Platform.OS === 'ios' ? 34 : undefined, fontSize: 18, fontWeight: '900', color: '#7650A8', backgroundColor: '#FFFFFF', marginRight: 10 }, languageHintText: { flex: 1, fontSize: 12, lineHeight: 18, color: '#6D5A74' },
  editor: { marginTop: 14, minHeight: 210, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E9DCF0', padding: 18, fontSize: 17, lineHeight: 27, color: '#45374C' }, marathiEditor: { fontSize: 18, lineHeight: 31 }, count: { textAlign: 'right', fontSize: 11, color: '#A18FA5', marginTop: 6, marginRight: 4 },
  emojiLabel: { marginTop: 15, fontSize: 13, fontWeight: '800', color: '#65566A' }, emojis: { flexDirection: 'row', gap: 8, marginTop: 9, flexWrap: 'wrap' }, emojiChip: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F5EBFC', alignItems: 'center', justifyContent: 'center' }, emoji: { fontSize: 21 },
  spacer: { flex: 1 }, actions: { flexDirection: 'row', gap: 11 }, share: { flex: 1, minHeight: 54, borderRadius: 18, backgroundColor: '#F0E5F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, shareText: { color: '#7650A8', fontWeight: '900' }, whatsapp: { flex: 1.3, minHeight: 54, borderRadius: 18, backgroundColor: '#2F7D55', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, whatsappText: { color: '#FFFFFF', fontWeight: '900' }, disabled: { opacity: 0.35 },
});
