import { WISH_LANGUAGES, type WishLanguage } from './sanly-wish-languages';

export const supportedWishLanguages = WISH_LANGUAGES;
export const WISH_STYLES = ['Heartfelt', 'Warm', 'Funny', 'Short & Sweet', 'Traditional', 'Inspirational', 'Poetic', 'Playful', 'Aussie Casual'] as const;
export type WishStyle = typeof WISH_STYLES[number];

export type WishInput = {
  name: string;
  occasionType: string;
  relationship: string;
  language: WishLanguage;
  style: WishStyle;
  variation?: number;
};

type Phrases = { birthday: string; congratulations: string; joy: string; future: string; celebrate: string };
const phrases: Record<WishLanguage, Phrases> = {
  English: { birthday: 'Happy birthday', congratulations: 'Congratulations on your special occasion', joy: 'Wishing you happiness and beautiful memories', future: 'May the year ahead bring health, love and success', celebrate: 'Have a wonderful celebration' },
  Marathi: { birthday: 'वाढदिवसाच्या हार्दिक शुभेच्छा', congratulations: 'या खास प्रसंगी मनःपूर्वक शुभेच्छा', joy: 'आनंद आणि सुंदर आठवणी लाभोत', future: 'पुढील वर्ष आरोग्य, प्रेम आणि यश घेऊन येवो', celebrate: 'हा खास दिवस आनंदात साजरा करा' },
  Hindi: { birthday: 'जन्मदिन की हार्दिक शुभकामनाएँ', congratulations: 'इस खास अवसर पर हार्दिक बधाई', joy: 'खुशियाँ और खूबसूरत यादें मिलें', future: 'आने वाला साल सेहत, प्यार और सफलता लाए', celebrate: 'इस खास दिन का भरपूर आनंद लें' },
  Gujarati: { birthday: 'જન્મદિવસની હાર્દિક શુભેચ્છાઓ', congratulations: 'આ ખાસ પ્રસંગે ખૂબ ખૂબ અભિનંદન', joy: 'આનંદ અને સુંદર યાદો મળે', future: 'આવનાર વર્ષ આરોગ્ય, પ્રેમ અને સફળતા લાવે', celebrate: 'આ ખાસ દિવસ આનંદથી ઉજવો' },
  Telugu: { birthday: 'పుట్టినరోజు శుభాకాంక్షలు', congratulations: 'ఈ ప్రత్యేక సందర్భంలో అభినందనలు', joy: 'ఆనందం మరియు మధుర జ్ఞాపకాలు కలగాలి', future: 'రాబోయే సంవత్సరం ఆరోగ్యం, ప్రేమ, విజయాన్ని తేవాలి', celebrate: 'ఈ ప్రత్యేక రోజును ఆనందంగా జరుపుకోండి' },
  Tamil: { birthday: 'இனிய பிறந்தநாள் வாழ்த்துகள்', congratulations: 'இந்தச் சிறப்பான நாளில் வாழ்த்துகள்', joy: 'மகிழ்ச்சியும் இனிய நினைவுகளும் நிறையட்டும்', future: 'வரும் ஆண்டு ஆரோக்கியம், அன்பு, வெற்றி தரட்டும்', celebrate: 'இந்தச் சிறப்பான நாளை மகிழ்ச்சியாகக் கொண்டாடுங்கள்' },
  Kannada: { birthday: 'ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು', congratulations: 'ಈ ವಿಶೇಷ ಸಂದರ್ಭದಲ್ಲಿ ಅಭಿನಂದನೆಗಳು', joy: 'ಸಂತೋಷ ಮತ್ತು ಸುಂದರ ನೆನಪುಗಳು ದೊರೆಯಲಿ', future: 'ಮುಂದಿನ ವರ್ಷ ಆರೋಗ್ಯ, ಪ್ರೀತಿ ಮತ್ತು ಯಶಸ್ಸು ತರಲಿ', celebrate: 'ಈ ವಿಶೇಷ ದಿನವನ್ನು ಸಂತೋಷದಿಂದ ಆಚರಿಸಿ' },
  Bengali: { birthday: 'শুভ জন্মদিন', congratulations: 'এই বিশেষ উপলক্ষে আন্তরিক অভিনন্দন', joy: 'আনন্দ আর সুন্দর স্মৃতিতে ভরে উঠুক', future: 'আগামী বছর সুস্বাস্থ্য, ভালোবাসা ও সাফল্য নিয়ে আসুক', celebrate: 'এই বিশেষ দিনটি আনন্দে উদ্‌যাপন করো' },
  Punjabi: { birthday: 'ਜਨਮਦਿਨ ਦੀਆਂ ਲੱਖ ਲੱਖ ਵਧਾਈਆਂ', congratulations: 'ਇਸ ਖਾਸ ਮੌਕੇ ਤੇ ਦਿਲੋਂ ਵਧਾਈਆਂ', joy: 'ਖੁਸ਼ੀਆਂ ਅਤੇ ਸੋਹਣੀਆਂ ਯਾਦਾਂ ਮਿਲਣ', future: 'ਆਉਣ ਵਾਲਾ ਸਾਲ ਸਿਹਤ, ਪਿਆਰ ਅਤੇ ਕਾਮਯਾਬੀ ਲਿਆਵੇ', celebrate: 'ਇਸ ਖਾਸ ਦਿਨ ਨੂੰ ਖੁਸ਼ੀ ਨਾਲ ਮਨਾਓ' },
  Bhojpuri: { birthday: 'जनमदिन के ढेर सारा बधाई', congratulations: 'एह खास मौका पर ढेर सारा बधाई', joy: 'खुशी आ सुन्दर याद मिलो', future: 'आवे वाला साल सेहत, प्यार आ सफलता लेके आवे', celebrate: 'एह खास दिन के खूब आनंद लीं' },
  German: { birthday: 'Alles Gute zum Geburtstag', congratulations: 'Herzlichen Glückwunsch zu diesem besonderen Anlass', joy: 'Ich wünsche dir Freude und wunderschöne Erinnerungen', future: 'Möge das kommende Jahr Gesundheit, Liebe und Erfolg bringen', celebrate: 'Genieße diesen besonderen Tag' },
  French: { birthday: 'Joyeux anniversaire', congratulations: 'Félicitations pour cette belle occasion', joy: 'Je te souhaite du bonheur et de merveilleux souvenirs', future: 'Que cette nouvelle année apporte santé, amour et réussite', celebrate: 'Profite pleinement de cette belle journée' },
  Japanese: { birthday: 'お誕生日おめでとうございます', congratulations: 'この特別な日を心からお祝いします', joy: '幸せと素敵な思い出に恵まれますように', future: 'これからの一年が健康と愛と成功に満ちますように', celebrate: '素敵な一日をお過ごしください' },
};

/** Offline, deterministic wish generator. No API key, network access or paid AI call required. */
export function generateWish(input: WishInput): string {
  const p = phrases[input.language] ?? phrases.English;
  const name = input.name.trim() || 'Friend';
  const opener = input.occasionType === 'Birthday' ? p.birthday : p.congratulations;
  const variation = Math.abs(Math.trunc(input.variation ?? 0)) % 3;
  if (input.style === 'Aussie Casual' && input.language === 'English') {
    return [
      `Happy ${input.occasionType === 'Birthday' ? 'birthday' : input.occasionType.toLowerCase()}, ${name}! Hope you have an absolute ripper of a day, mate! 🎉`,
      `Cheers, ${name}! Have a cracking celebration and enjoy every minute! 🥳`,
      `Big cheers, ${name}! Here's to good times and plenty of laughs. 🎂`,
    ][variation];
  }
  const endings: Record<Exclude<WishStyle, 'Aussie Casual'>, string[]> = {
    Heartfelt: [p.joy, p.future, p.celebrate],
    Warm: [p.future, p.joy, p.celebrate],
    Funny: [p.celebrate + ' 🎂😄', p.joy + ' 🥳', p.celebrate + ' 🎉'],
    'Short & Sweet': [p.celebrate, p.joy, p.future],
    Traditional: [p.future, p.joy, p.celebrate],
    Inspirational: [p.future, p.joy, p.future],
    Poetic: [p.joy, p.future, p.joy],
    Playful: [p.celebrate + ' 🎈', p.joy + ' ✨', p.celebrate + ' 🥳'],
  };
  const style = input.style === 'Aussie Casual' ? 'Warm' : input.style;
  return `${name}, ${opener}! ${endings[style][variation]}. ${variation === 1 ? '❤️' : variation === 2 ? '✨' : '🎉'}`;
}
