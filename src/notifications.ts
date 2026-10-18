import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AppLanguage } from '@/src/language-context';
import { Celebration } from '@/src/celebrations-context';
const REMINDER_HOUR=9;const CHANNEL_ID='sanly-special-days';
Notifications.setNotificationHandler({handleNotification:async()=>({shouldPlaySound:true,shouldSetBadge:false,shouldShowBanner:true,shouldShowList:true})});
async function ensureAndroidChannel(){if(Platform.OS!=='android')return;await Notifications.setNotificationChannelAsync(CHANNEL_ID,{name:'Special day reminders',importance:Notifications.AndroidImportance.DEFAULT,vibrationPattern:[0,250,150,250]});}
export async function ensureNotificationPermission(){await ensureAndroidChannel();const existing=await Notifications.getPermissionsAsync();if(existing.granted)return true;const requested=await Notifications.requestPermissionsAsync();return requested.granted;}
const occasionMr:Record<Celebration['occasionType'],string>={Birthday:'वाढदिवस',Anniversary:'लग्नाचा वाढदिवस',Engagement:'साखरपुडा',Wedding:'लग्न',Graduation:'पदवीदान','New Job':'नवीन नोकरी',Festival:'सण',Achievement:'यश',Other:'खास दिवस'};
const occasionHi:Record<Celebration['occasionType'],string>={Birthday:'जन्मदिन',Anniversary:'सालगिरह',Engagement:'सगाई',Wedding:'शादी',Graduation:'स्नातक','New Job':'नई नौकरी',Festival:'त्योहार',Achievement:'उपलब्धि',Other:'खास दिन'};
const occasionEmoji:Record<Celebration['occasionType'],string>={Birthday:'🎂',Anniversary:'💞',Engagement:'💍',Wedding:'🥂',Graduation:'🎓','New Job':'💼',Festival:'🪔',Achievement:'🏆',Other:'🎉'};
function specialDayContent(celebration:Celebration,language:AppLanguage|null){
 const {name,occasionType}=celebration;const emoji=occasionEmoji[occasionType];
 if(language==='Marathi')return{title:`आज ${name} यांचा ${occasionMr[occasionType]} आहे ${emoji}`,body:'SANLY उघडा आणि मनापासून शुभेच्छा पाठवा 💗'};
 if(language==='Hindi')return{title:`आज ${name} का ${occasionHi[occasionType]} है ${emoji}`,body:'SANLY खोलें और दिल से शुभकामना भेजें 💗'};
 return{title:occasionType==='Birthday'?`It's ${name}'s birthday ${emoji}`:`Today: ${name} — ${occasionType} ${emoji}`,body:'Open SANLY and send a thoughtful wish 💗'};
}
async function scheduleYearlyBirthday(celebration:Celebration,language:AppLanguage|null){const[day,month]=celebration.date.split('/').map(Number);const content=specialDayContent(celebration,language);return Notifications.scheduleNotificationAsync({content:{...content,data:{sanly:true,celebrationId:celebration.id,kind:'special-day'},sound:'default'},trigger:{type:Notifications.SchedulableTriggerInputTypes.YEARLY,month,day,hour:REMINDER_HOUR,minute:0,channelId:Platform.OS==='android'?CHANNEL_ID:undefined}});}
async function scheduleTodayCatchUp(celebration:Celebration,language:AppLanguage|null){const now=new Date();const today=`${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}`;if(celebration.date!==today||now.getHours()<REMINDER_HOUR)return;const content=specialDayContent(celebration,language);await Notifications.scheduleNotificationAsync({content:{...content,data:{sanly:true,celebrationId:celebration.id,kind:'special-day-today'},sound:'default'},trigger:{type:Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,seconds:3,channelId:Platform.OS==='android'?CHANNEL_ID:undefined}});}
export async function scheduleBirthdayReminder(celebration:Celebration,language:AppLanguage|null){const allowed=await ensureNotificationPermission();if(!allowed)return false;await scheduleYearlyBirthday(celebration,language);await scheduleTodayCatchUp(celebration,language);return true;}
export async function syncBirthdayReminders(celebrations:Celebration[],language:AppLanguage|null){const allowed=await ensureNotificationPermission();if(!allowed)return false;const scheduled=await Notifications.getAllScheduledNotificationsAsync();await Promise.all(scheduled.filter(item=>item.content.data?.sanly===true).map(item=>Notifications.cancelScheduledNotificationAsync(item.identifier)));for(const celebration of celebrations){await scheduleYearlyBirthday(celebration,language);await scheduleTodayCatchUp(celebration,language);}return true;}
export async function birthdayRemindersEnabled(){const permission=await Notifications.getPermissionsAsync();return permission.granted;}
export{Notifications};
