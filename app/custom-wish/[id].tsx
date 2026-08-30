import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Celebration, useCelebrations } from '@/src/celebrations-context';
import { useLanguage } from '@/src/language-context';

const emojiChoices = ['🎂', '🎉', '🎈', '❤️', '✨', '🥳'];
const occasionMr: Record<Celebration['occasionType'], string> = { Birthday: 'वाढदिवस', Anniversary: 'वर्धापनदिन', Engagement: 'साखरपुडा', Wedding: 'लग्न', Graduation: 'पदवीदान', 'New Job': 'नवीन नोकरी', Festival: 'सण', Achievement: 'यश', Other: 'खास प्रसंग' };

export default function CustomWishScreen() {
  const { id, draft } = useLocalSearchParams<{ id: string; draft?: string }>();
  const { celebrations } = useCelebrations();
  const { language } = useLanguage();
  const uiMarathi = language === 'Marathi';
  const person = celebrations.find((item) => item.id === id);
  const [message, setMessage] = useState(draft ?? '');

  const addEmoji = (emoji: string) => setMessage((current) => `${current}${current ? ' ' : ''}${emoji}`);
  const share = async () => { Keyboard.dismiss(); await Share.share({ message }); };
  const whatsapp = async () => { Keyboard.dismiss(); const url = `whatsapp://send?text=${encodeURIComponent(message)}`; if (await Linking.canOpenURL(url)) await Linking.openURL(url); else await share(); };

  if (!person) return <SafeAreaView style={styles.safe}><View style={styles.center}><Text>{uiMarathi ? 'हा खास दिवस सापडला नाही.' : 'Celebration not found.'}</Text></View></SafeAreaView>;

  const wishIsMarathi = person.wishLanguage === 'Marathi';
  const copy = uiMarathi ? {
    kicker: `${occasionMr[person.occasionType]} • ${wishIsMarathi ? 'मराठी' : 'इंग्रजी'}`,
    title: 'तुमच्या शब्दांत लिहा 💜',
    subtitle: `${person.name} साठी मनापासून शुभेच्छा लिहा.`,
    placeholder: wishIsMarathi ? 'तुमची शुभेच्छा येथे लिहा…' : `Write something special for ${person.name}…`,
    share: 'शेअर करा', done: 'झाले', hint: wishIsMarathi ? 'तुमच्या फोनवरील मराठी कीबोर्ड वापरू शकता.' : 'या शुभेच्छेची भाषा इंग्रजी आहे.',
  } : {
    kicker: `${person.occasionType} • ${person.wishLanguage}`,
    title: 'Make it yours 💜',
    subtitle: `Write exactly what you want ${person.name} to feel.`,
    placeholder: wishIsMarathi ? 'तुमची शुभेच्छा येथे लिहा…' : `Write something special for ${person.name}…`,
    share: 'Share', done: 'Done', hint: wishIsMarathi ? 'You can type naturally with your Marathi keyboard.' : 'Make it sound like you.',
  };

  return <SafeAreaView style={styles.safe} edges={['bottom']}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" showsVerticalScrollIndicator={false}>
    <Text style={styles.kicker}>{copy.kicker}</Text><Text style={styles.title}>{copy.title}</Text><Text style={styles.subtitle}>{copy.subtitle}</Text><Text style={styles.hint}>{copy.hint}</Text>
    <View style={styles.editorWrap}><TextInput autoFocus multiline value={message} onChangeText={setMessage} placeholder={copy.placeholder} placeholderTextColor="#AA9AAE" style={[styles.editor,wishIsMarathi&&styles.marathiEditor]} textAlignVertical="top" maxLength={600} autoCorrect spellCheck={false} autoCapitalize="sentences"/><View style={styles.editorFooter}><Text style={styles.count}>{message.length}/600</Text><Pressable onPress={Keyboard.dismiss} style={styles.doneButton}><Text style={styles.doneText}>{copy.done}</Text></Pressable></View></View>
    <View style={styles.emojis}>{emojiChoices.map((emoji)=><Pressable key={emoji} onPress={()=>addEmoji(emoji)} style={styles.emojiChip}><Text style={styles.emoji}>{emoji}</Text></Pressable>)}</View>
    <View style={styles.actions}><Pressable disabled={!message.trim()} onPress={share} style={[styles.share,!message.trim()&&styles.disabled]}><Ionicons name="share-outline" size={20} color="#6D28A8"/><Text style={styles.shareText}>{copy.share}</Text></Pressable><Pressable disabled={!message.trim()} onPress={whatsapp} style={[styles.whatsapp,!message.trim()&&styles.disabled]}><Ionicons name="logo-whatsapp" size={20} color="#FFFFFF"/><Text style={styles.whatsappText}>WhatsApp</Text></Pressable></View>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#FFF9F5'},flex:{flex:1},container:{padding:22,paddingBottom:36},center:{flex:1,alignItems:'center',justifyContent:'center'},kicker:{fontSize:12,fontWeight:'900',color:'#6D28A8',letterSpacing:.8},title:{fontSize:28,fontWeight:'900',color:'#35143F',marginTop:5},subtitle:{marginTop:7,fontSize:14,lineHeight:21,color:'#756878'},hint:{marginTop:7,fontSize:12,lineHeight:18,color:'#9A879C'},editorWrap:{marginTop:18,borderRadius:24,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E9DCF0',overflow:'hidden'},editor:{minHeight:235,padding:18,fontSize:17,lineHeight:27,color:'#2B2030'},marathiEditor:{fontSize:18,lineHeight:31},editorFooter:{minHeight:48,borderTopWidth:1,borderTopColor:'#F0E7F4',paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},count:{fontSize:11,color:'#A18FA5'},doneButton:{minHeight:36,minWidth:62,paddingHorizontal:13,borderRadius:12,backgroundColor:'#F5EEFA',alignItems:'center',justifyContent:'center'},doneText:{color:'#6D28A8',fontWeight:'900'},emojis:{flexDirection:'row',gap:8,marginTop:16,flexWrap:'wrap'},emojiChip:{width:44,height:44,borderRadius:14,backgroundColor:'#F5EEFA',alignItems:'center',justifyContent:'center'},emoji:{fontSize:21},actions:{flexDirection:'row',gap:11,marginTop:24},share:{flex:1,minHeight:56,borderRadius:18,backgroundColor:'#F0E5F8',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},shareText:{color:'#6D28A8',fontWeight:'900'},whatsapp:{flex:1.3,minHeight:56,borderRadius:18,backgroundColor:'#2F7D55',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},whatsappText:{color:'#FFFFFF',fontWeight:'900'},disabled:{opacity:.35}});
