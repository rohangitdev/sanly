import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCelebrations } from '@/src/celebrations-context';

const emojiChoices = ['🎂', '🎉', '🎈', '❤️', '✨', '🥳'];

export default function CustomWishScreen() {
  const { id, draft } = useLocalSearchParams<{ id: string; draft?: string }>();
  const { celebrations } = useCelebrations();
  const person = celebrations.find((item) => item.id === id);
  const [message, setMessage] = useState(draft ?? '');

  const addEmoji = (emoji: string) => setMessage((current) => `${current}${current ? ' ' : ''}${emoji}`);
  const share = async () => {
    Keyboard.dismiss();
    await Share.share({ message });
  };
  const whatsapp = async () => {
    Keyboard.dismiss();
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
    emojiLabel: 'इमोजी',
    share: 'शेअर करा',
    done: 'झाले',
  } : {
    kicker: `${person.occasionType} • English`,
    title: 'Make it yours 💜',
    subtitle: `Write exactly what you want ${person.name} to feel.`,
    placeholder: `Write something special for ${person.name}…`,
    emojiLabel: 'Emoji',
    share: 'Share',
    done: 'Done',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.kicker}>{copy.kicker}</Text>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          <View style={styles.editorWrap}>
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
            <View style={styles.editorFooter}>
              <Text style={styles.count}>{message.length}/600</Text>
              <Pressable onPress={Keyboard.dismiss} style={styles.doneButton}>
                <Text style={styles.doneText}>{copy.done}</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.emojiLabel}>{copy.emojiLabel}</Text>
          <View style={styles.emojis}>{emojiChoices.map((emoji) => (
            <Pressable key={emoji} onPress={() => addEmoji(emoji)} style={styles.emojiChip}><Text style={styles.emoji}>{emoji}</Text></Pressable>
          ))}</View>

          <View style={styles.actions}>
            <Pressable disabled={!message.trim()} onPress={share} style={[styles.share, !message.trim() && styles.disabled]}><Ionicons name="share-outline" size={20} color="#6D28A8" /><Text style={styles.shareText}>{copy.share}</Text></Pressable>
            <Pressable disabled={!message.trim()} onPress={whatsapp} style={[styles.whatsapp, !message.trim() && styles.disabled]}><Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" /><Text style={styles.whatsappText}>WhatsApp</Text></Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F5' }, flex: { flex: 1 }, container: { padding: 22, paddingBottom: 36 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontSize: 12, fontWeight: '900', color: '#6D28A8', textTransform: 'uppercase', letterSpacing: 0.8 }, title: { fontSize: 28, fontWeight: '900', color: '#35143F', marginTop: 5 }, subtitle: { marginTop: 7, fontSize: 14, lineHeight: 21, color: '#756878' },
  editorWrap: { marginTop: 18, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E9DCF0', overflow: 'hidden' }, editor: { minHeight: 235, padding: 18, fontSize: 17, lineHeight: 27, color: '#2B2030' }, marathiEditor: { fontSize: 18, lineHeight: 31 }, editorFooter: { minHeight: 48, borderTopWidth: 1, borderTopColor: '#F0E7F4', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, count: { fontSize: 11, color: '#A18FA5' }, doneButton: { minHeight: 36, minWidth: 62, paddingHorizontal: 13, borderRadius: 12, backgroundColor: '#F5EEFA', alignItems: 'center', justifyContent: 'center' }, doneText: { color: '#6D28A8', fontWeight: '900' },
  emojiLabel: { marginTop: 18, fontSize: 13, fontWeight: '900', color: '#65566A' }, emojis: { flexDirection: 'row', gap: 8, marginTop: 9, flexWrap: 'wrap' }, emojiChip: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F5EEFA', alignItems: 'center', justifyContent: 'center' }, emoji: { fontSize: 21 },
  actions: { flexDirection: 'row', gap: 11, marginTop: 24 }, share: { flex: 1, minHeight: 56, borderRadius: 18, backgroundColor: '#F0E5F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, shareText: { color: '#6D28A8', fontWeight: '900' }, whatsapp: { flex: 1.3, minHeight: 56, borderRadius: 18, backgroundColor: '#2F7D55', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, whatsappText: { color: '#FFFFFF', fontWeight: '900' }, disabled: { opacity: 0.35 },
});
