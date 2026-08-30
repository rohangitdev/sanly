import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLanguage, useLanguage } from '@/src/language-context';

export default function LanguageScreen() {
  const { language, setLanguage } = useLanguage();
  const choose = async (next: AppLanguage) => { await setLanguage(next); router.replace('/'); };
  const title = language === 'Marathi' ? 'तुमची भाषा निवडा' : language === 'Hindi' ? 'अपनी भाषा चुनें' : 'Choose your language';
  return <SafeAreaView style={styles.safe}><View style={styles.container}>
    <View><Text style={styles.brand}>SANLY</Text><Text style={styles.heart}>💗</Text></View>
    <View style={styles.copy}><Text style={styles.title}>{title}</Text><Text style={styles.body}>मराठी • हिन्दी • English{`\n`}You can change this anytime.</Text></View>
    <View style={styles.options}>
      <Pressable onPress={()=>choose('Marathi')} style={({pressed})=>[styles.option,styles.marathi,pressed&&styles.pressed]}><View style={styles.languageIcon}><Text style={styles.languageIconText}>म</Text></View><View style={styles.optionCopy}><Text style={styles.optionTitle}>मराठी</Text><Text style={styles.optionBody}>SANLY मराठीत वापरा</Text></View><Text style={styles.arrow}>›</Text></Pressable>
      <Pressable onPress={()=>choose('Hindi')} style={({pressed})=>[styles.option,styles.hindi,pressed&&styles.pressed]}><View style={[styles.languageIcon,styles.hindiIcon]}><Text style={styles.languageIconText}>हि</Text></View><View style={styles.optionCopy}><Text style={styles.optionTitle}>हिन्दी</Text><Text style={styles.optionBody}>SANLY हिन्दी में इस्तेमाल करें</Text></View><Text style={styles.arrow}>›</Text></Pressable>
      <Pressable onPress={()=>choose('English')} style={({pressed})=>[styles.option,pressed&&styles.pressed]}><View style={[styles.languageIcon,styles.englishIcon]}><Text style={styles.languageIconText}>A</Text></View><View style={styles.optionCopy}><Text style={styles.optionTitle}>English</Text><Text style={styles.optionBody}>Use SANLY in English</Text></View><Text style={styles.arrow}>›</Text></Pressable>
    </View>
    <Text style={styles.note}>You can change this later. • हे नंतर बदलता येईल. • इसे बाद में बदल सकते हैं।</Text>
  </View></SafeAreaView>;
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#FFF9F5'},container:{flex:1,paddingHorizontal:24,paddingTop:24,paddingBottom:28},brand:{fontSize:28,fontWeight:'900',letterSpacing:3,color:'#6D28A8'},heart:{position:'absolute',left:108,top:2,fontSize:22},copy:{marginTop:58},title:{fontSize:32,lineHeight:42,fontWeight:'900',color:'#35143F'},body:{marginTop:12,fontSize:15,lineHeight:25,color:'#756878'},options:{marginTop:28,gap:12},option:{minHeight:86,paddingHorizontal:18,borderRadius:24,backgroundColor:'#FFF',borderWidth:1,borderColor:'#E8DFF0',flexDirection:'row',alignItems:'center'},marathi:{backgroundColor:'#FFF5F8',borderColor:'#F2C7D8'},hindi:{backgroundColor:'#FFF8EE',borderColor:'#F3D5A6'},languageIcon:{width:50,height:50,borderRadius:17,backgroundColor:'#E85D8E',alignItems:'center',justifyContent:'center'},hindiIcon:{backgroundColor:'#F4A62A'},englishIcon:{backgroundColor:'#6D28A8'},languageIconText:{color:'#FFF',fontSize:21,fontWeight:'900'},optionCopy:{flex:1,marginLeft:15},optionTitle:{fontSize:19,fontWeight:'900',color:'#35143F'},optionBody:{marginTop:4,color:'#756878',fontSize:13},arrow:{fontSize:34,color:'#A98CB8',marginLeft:8},pressed:{opacity:.8,transform:[{scale:.99}]},note:{marginTop:'auto',textAlign:'center',color:'#9A889E',fontSize:11,lineHeight:17}});
