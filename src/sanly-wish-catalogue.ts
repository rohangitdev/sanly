import type { WishLanguage } from './sanly-wish-languages';
import type { WishStyle } from './sanly-wish-engine';
import { generateWish } from './sanly-wish-engine';
import type { WishCandidate } from './sanly-wish-rotation';

type Template = (name: string) => string;
type Catalogue = Partial<Record<WishLanguage, Partial<Record<WishStyle, Template[]>>>>;

/** Curated originals, not translations. More languages can be added without changing the picker. */
const catalogue: Catalogue = {
  English: {
    Heartfelt: [
      n => `Happy birthday, ${n}! Life feels brighter with you in it. Here's to more laughter, little adventures and memories together. ❤️`,
      n => `To ${n}: may you feel as loved today as you make everyone around you feel. Have a beautiful birthday! 🎂`,
      n => `Another trip around the sun, ${n}, and so many reasons to celebrate you. Wishing you peace, joy and wonderful surprises. ✨`,
      n => `Happy birthday, ${n}! I hope this year gives you more of what makes your heart happy and people who cheer you on. 💛`,
    ],
    Funny: [
      n => `Happy birthday, ${n}! You're not getting older, you're just becoming a limited edition. 🎉`,
      n => `Cake calories don't count today, ${n}. That's birthday science. Enjoy every slice! 🎂😄`,
      n => `Congratulations, ${n}! You've unlocked another year of wisdom and questionable decisions. 🥳`,
      n => `Happy birthday, ${n}! May your Wi-Fi be strong and your cake slice enormous. 🎈`,
    ],
    Warm: [
      n => `Happy birthday, ${n}! Hope your day is full of good company, delicious food and unexpected smiles. 🌷`,
      n => `Sending a big birthday hug your way, ${n}. Make today a lovely one! ❤️`,
      n => `Here's to sunshine, laughter and a brilliant year ahead, ${n}. Happy birthday! ☀️`,
      n => `Happy birthday, ${n}! Wishing you simple joys and a hundred little reasons to smile today. 🎉`,
    ],
  },
  Marathi: {
    Heartfelt: [
      n => `${n}, वाढदिवसाच्या मनापासून शुभेच्छा! तुझ्या आयुष्यातले छोटे छोटे क्षणही आनंदाने उजळून निघोत. ❤️`,
      n => `प्रिय ${n}, तुझ्या चेहऱ्यावरचं हसू असंच कायम राहो. येणारं वर्ष सुंदर आठवणींनी भरलेलं असो! 🎂`,
      n => `${n}, आजचा दिवस तुझ्यासारखाच खास असो! मनातली स्वप्नं पूर्ण होवोत आणि माणसांचं प्रेम सदैव सोबत राहो. ✨`,
      n => `वाढदिवसाच्या खूप शुभेच्छा, ${n}! आयुष्यात सुख, समाधान आणि मनापासून हसण्याची असंख्य कारणं मिळोत. 💛`,
    ],
    Funny: [
      n => `${n}, वाढदिवसाच्या शुभेच्छा! वय विचारणार नाही, पण केकचा मोठा तुकडा नक्की मागणार! 🎂😄`,
      n => `हॅपी बर्थडे, ${n}! आज डाएटला सुट्टी आणि केकला पूर्ण हजेरी! 🥳`,
      n => `${n}, अजून एक वर्ष अनुभवात जमा! आता पार्टी कुठे आहे तेवढंच सांग. 🎉`,
      n => `वाढदिवसाच्या शुभेच्छा, ${n}! मेणबत्त्या कितीही असोत, उत्साह मात्र कायम तरुण राहो! 🎈`,
    ],
    Warm: [
      n => `${n}, वाढदिवसाच्या खूप खूप शुभेच्छा! आजचा दिवस हसतखेळत आणि आपल्या माणसांसोबत छान जावो. 🌸`,
      n => `खूप प्रेम आणि शुभेच्छा, ${n}! येणारं वर्ष तुझ्यासाठी आनंदाचं ठरो. ❤️`,
      n => `${n}, आज मनसोक्त हस, आवडता केक खा आणि सुंदर आठवणी जमव! वाढदिवसाच्या शुभेच्छा! 🎂`,
      n => `वाढदिवसाच्या शुभेच्छा, ${n}! प्रत्येक नव्या सकाळीसोबत काहीतरी छान घडो. ☀️`,
    ],
  },
  Hindi: {
    Heartfelt: [
      n => `${n}, जन्मदिन की ढेर सारी शुभकामनाएँ! तुम्हारी मुस्कान यूँ ही सबका दिन रोशन करती रहे। ❤️`,
      n => `जन्मदिन मुबारक, ${n}! आने वाला साल तुम्हारे लिए प्यारी यादें और दिल से खुश होने के मौके लाए। 🎂`,
      n => `${n}, आज का दिन तुम्हारे नाम! हर सपना हिम्मत पाए और हर कदम पर अपनों का प्यार मिले। ✨`,
      n => `तुम्हें जन्मदिन की बहुत-बहुत बधाई, ${n}! ज़िंदगी की छोटी-छोटी खुशियाँ हमेशा साथ रहें। 💛`,
    ],
    Funny: [
      n => `${n}, जन्मदिन मुबारक! उम्र तो बस एक नंबर है, केक का टुकड़ा बड़ा होना चाहिए! 🎂😄`,
      n => `हैप्पी बर्थडे, ${n}! आज डाइट को छुट्टी और मिठाई को पूरी छूट! 🥳`,
      n => `${n}, एक साल और समझदार हो गए... पार्टी कहाँ है, ये बताना मत भूलना! 🎉`,
      n => `जन्मदिन मुबारक, ${n}! मोमबत्तियाँ बढ़ें, लेकिन मस्ती कभी कम न हो! 🎈`,
    ],
    Warm: [
      n => `जन्मदिन मुबारक, ${n}! आज का दिन हँसी, अपनों और ढेर सारी मिठास से भरा हो। 🌸`,
      n => `${n}, तुम्हारे लिए ढेर सारा प्यार और शुभकामनाएँ! नया साल बहुत खूबसूरत गुज़रे। ❤️`,
      n => `आज खूब मुस्कुराओ, मनपसंद केक खाओ और यादगार पल बनाओ, ${n}! 🎂`,
      n => `जन्मदिन की शुभकामनाएँ, ${n}! हर नई सुबह कोई नई खुशी लेकर आए। ☀️`,
    ],
  },
};

export function getWishCandidates(input: {
  name: string; occasionType: string; relationship: string;
  language: WishLanguage; style: WishStyle;
}): WishCandidate[] {
  const templates = input.occasionType === 'Birthday'
    ? catalogue[input.language]?.[input.style] : undefined;
  // Preserve existing behaviour for occasions and styles awaiting editorial review.
  if (!templates?.length) {
    return [0, 1, 2].map(variation => ({
      id: `legacy:${input.language}:${input.occasionType}:${input.style}:${variation}`,
      language: input.language, occasion: input.occasionType, style: input.style,
      text: generateWish({ ...input, variation }),
    }));
  }
  return templates.map((template, index) => ({
    id: `curated:v1:${input.language}:${input.occasionType}:${input.style}:${index}`,
    language: input.language, occasion: input.occasionType, style: input.style,
    text: template(input.name.trim() || 'Friend'),
  }));
}
