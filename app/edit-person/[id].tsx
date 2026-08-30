import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';

import { OccasionType, Relationship, useCelebrations, WishLanguage } from '@/src/celebrations-context';
import { useLanguage } from '@/src/language-context';
import { syncBirthdayReminders } from '@/src/notifications';

const relationships: Relationship[] = ['Friend', 'Family', 'Partner', 'Colleague'];
const languages: WishLanguage[] = ['Marathi', 'English'];
const occasions: OccasionType[] = ['Birthday','Anniversary','Engagement','Wedding','Graduation','New Job','Festival','Achievement','Other'];
const emoji: Record<OccasionType,string> = { Birthday:'🎂', Anniversary:'💞', Engagement:'💍', Wedding:'🥂', Graduation:'🎓', 'New Job':'💼', Festival:'🪔', Achievement:'🏆', Other:'🎁' };
const mrOccasion: Record<OccasionType,string> = { Birthday:'वाढदिवस', Anniversary:'वर्धापनदिन', Engagement:'साखरपुडा', Wedding:'लग्न', Graduation:'पदवीदान', 'New Job':'नवीन नोकरी', Festival:'सण', Achievement:'यश', Other:'इतर' };
const mrRelationship: Record<Relationship,string> = { Friend:'मित्र/मैत्रीण', Family:'कुटुंब', Partner:'जोडीदार', Colleague:'सहकारी' };
const fmt = (v:string) => { const d=v.replace(/\D/g,'').slice(0,4); return d.length<=2?d:`${d.slice(0,2)}/${d.slice(2)}`; };
const valid = (v:string) => /^\d{2}\/\d{2}$/.test(v) && (()=>{ const [d,m]=v.split('/').map(Number); return m>=1&&m<=12&&d>=1&&d<=new Date(2024,m,0).getDate(); })();

export default function EditPersonScreen(){
  const { id } = useLocalSearchParams<{id:string}>();
  const { celebrations, updateCelebration, deleteCelebration } = useCelebrations();
  const { language } = useLanguage(); const mr=language==='Marathi';
  const person = useMemo(()=>celebrations.find(x=>x.id===id),[celebrations,id]);
  const [name,setName]=useState(''); const [occasionType,setOccasionType]=useState<OccasionType>('Birthday'); const [date,setDate]=useState(''); const [relationship,setRelationship]=useState<Relationship>('Friend'); const [wishLanguage,setWishLanguage]=useState<WishLanguage>('Marathi');
  useEffect(()=>{ if(person){ setName(person.name); setOccasionType(person.occasionType); setDate(person.date); setRelationship(person.relationship); setWishLanguage(person.wishLanguage); } },[person]);
  if(!person) return <SafeAreaView style={styles.safe}><View style={styles.center}><Text>{mr?'हा खास दिवस सापडला नाही.':'Celebration not found.'}</Text></View></SafeAreaView>;
  const save=async()=>{ if(name.trim().length<2||!valid(date)) return; const input={name:name.trim(),occasionType,date,relationship,wishLanguage}; updateCelebration(person.id,input); const next=celebrations.map(x=>x.id===person.id?{...x,...input}:x); try{ await syncBirthdayReminders(next,language);}catch{} router.replace('/'); };
  const remove=()=>Alert.alert(mr?'हा दिवस काढून टाकायचा?':'Remove this celebration?',mr?`${person.name} ची आठवण SANLY मधून काढली जाईल.`:`${person.name} will be removed from SANLY.`,[{text:mr?'रद्द':'Cancel',style:'cancel'},{text:mr?'काढा':'Remove',style:'destructive',onPress:async()=>{ const next=celebrations.filter(x=>x.id!==person.id); deleteCelebration(person.id); try{ await syncBirthdayReminders(next,language);}catch{} router.replace('/'); }}]);
  return <SafeAreaView style={styles.safe} edges={['bottom']}><ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>{mr?'तपशील बदला':'Edit celebration'}</Text>
    <Text style={styles.label}>{mr?'त्यांचं नाव':'Their name'}</Text><TextInput value={name} onChangeText={setName} style={styles.input}/>
    <Text style={styles.label}>{mr?'प्रसंग':'Occasion'}</Text><View style={styles.grid}>{occasions.map(o=><Pressable key={o} onPress={()=>setOccasionType(o)} style={[styles.card,occasionType===o&&styles.active]}><Text style={styles.emoji}>{emoji[o]}</Text><Text style={[styles.cardText,occasionType===o&&styles.activeText]}>{mr?mrOccasion[o]:o}</Text></Pressable>)}</View>
    <Text style={styles.label}>{mr?'दिवस आणि महिना':'Day & month'}</Text><TextInput value={date} onChangeText={t=>setDate(fmt(t))} keyboardType="number-pad" maxLength={5} style={styles.input}/>
    <Text style={styles.label}>{mr?'तुमचं नातं':'Relationship'}</Text><View style={styles.rowWrap}>{relationships.map(r=><Pressable key={r} onPress={()=>setRelationship(r)} style={[styles.chip,relationship===r&&styles.active]}><Text style={[styles.chipText,relationship===r&&styles.activeText]}>{mr?mrRelationship[r]:r}</Text></Pressable>)}</View>
    <Text style={styles.label}>{mr?'शुभेच्छांची भाषा':'Wish language'}</Text><View style={styles.row}>{languages.map(l=><Pressable key={l} onPress={()=>setWishLanguage(l)} style={[styles.lang,wishLanguage===l&&styles.active]}><Text style={[styles.langText,wishLanguage===l&&styles.activeText]}>{l==='Marathi'?(mr?'मराठी':'Marathi'):(mr?'इंग्रजी':'English')}</Text></Pressable>)}</View>
    <Text style={styles.repeat}>{occasionType==='Birthday'||occasionType==='Anniversary'||occasionType==='Festival' ? (mr?'↻ हा प्रसंग दरवर्षी आठवण करून देईल.':'↻ This occasion repeats every year.') : (mr?'हा प्रसंग सध्या वार्षिक यादीत दिसेल.':'This occasion currently stays in the yearly list.')}</Text>
    <Pressable onPress={save} style={styles.save}><Text style={styles.saveText}>{mr?'बदल जतन करा':'Save changes'}</Text></Pressable>
    <Pressable onPress={remove} style={styles.delete}><Text style={styles.deleteText}>{mr?'हा खास दिवस काढा':'Remove this celebration'}</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#FFF9F5'},center:{flex:1,alignItems:'center',justifyContent:'center'},container:{padding:22,paddingBottom:40},title:{fontSize:28,fontWeight:'900',color:'#35143F',marginBottom:8},label:{fontSize:14,fontWeight:'900',color:'#35143F',marginTop:18,marginBottom:8},input:{minHeight:56,borderRadius:18,backgroundColor:'#FFF',borderWidth:1,borderColor:'#E9DDEF',paddingHorizontal:16,fontSize:17,color:'#2B2030'},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},card:{width:'31%',minHeight:82,borderRadius:17,backgroundColor:'#FFF',borderWidth:1,borderColor:'#E9DDEF',alignItems:'center',justifyContent:'center',padding:6},emoji:{fontSize:23},cardText:{fontSize:10,fontWeight:'800',color:'#756878',textAlign:'center',marginTop:4},active:{backgroundColor:'#F5EEFA',borderColor:'#6D28A8'},activeText:{color:'#6D28A8'},rowWrap:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{paddingHorizontal:14,paddingVertical:11,borderRadius:999,backgroundColor:'#FFF',borderWidth:1,borderColor:'#E9DDEF'},chipText:{fontWeight:'800',color:'#756878'},row:{flexDirection:'row',gap:10},lang:{flex:1,minHeight:50,borderRadius:16,backgroundColor:'#FFF',borderWidth:1,borderColor:'#E9DDEF',alignItems:'center',justifyContent:'center'},langText:{fontWeight:'900',color:'#756878'},repeat:{marginTop:18,fontSize:12,lineHeight:19,color:'#756878'},save:{marginTop:26,minHeight:56,borderRadius:18,backgroundColor:'#6D28A8',alignItems:'center',justifyContent:'center'},saveText:{color:'#FFF',fontWeight:'900',fontSize:16},delete:{marginTop:12,minHeight:52,borderRadius:18,backgroundColor:'#FFF0F3',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#F4CAD6'},deleteText:{color:'#C83F65',fontWeight:'900'}});
