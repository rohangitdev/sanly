import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type AppLanguage = 'Marathi' | 'English';

type LanguageContextValue = {
  language: AppLanguage | null;
  hydrated: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: keyof typeof copy.English) => string;
};

const STORAGE_KEY = '@sanly/app-language-v1';

const copy = {
  English: {
    tagline: 'Don’t forget to wish your loved ones.', today: 'Today', comingUp: 'Coming up', addSomeone: '+ Add someone special',
    wish: 'Wish', noToday: 'No special day today — yet ✨', noTodayBody: 'We’ll put today’s birthdays and celebrations right here when they arrive.',
    oneTodayBody: 'A thoughtful wish takes seconds — make it count.', manyToday: 'people to celebrate today 🎉',
    specialDay: 'special day', specialMoment: 'special moment', specialMoments: 'special moments', loading: 'Remembering your celebrations…',
    emptyTitle: 'Your celebration circle starts here', emptyBody: 'Add someone special and an occasion. SANLY keeps it privately on this phone.',
    allTodayTitle: 'Everything saved is happening today!', allTodayBody: 'Enjoy the celebrations — you can add another special person anytime.',
    marathiNote: 'Don’t forget to wish your loved ones. 💜', changeLanguage: 'Language', chooseLanguage: 'Choose your language',
    chooseLanguageBody: 'SANLY will use this language for the app. You can still choose a different language for each wish.',
  },
  Marathi: {
    tagline: 'आपल्या माणसांना शुभेच्छा द्यायला विसरू नका.', today: 'आज', comingUp: 'लवकरच', addSomeone: '+ खास व्यक्ती जोडा',
    wish: 'शुभेच्छा द्या', noToday: 'आज कोणताही खास दिवस नाही — अजून तरी ✨', noTodayBody: 'आजचा वाढदिवस किंवा खास प्रसंग आला की SANLY तो इथे दाखवेल.',
    oneTodayBody: 'मनापासून शुभेच्छा द्यायला फक्त काही क्षण लागतात.', manyToday: 'जणांचा आज खास दिवस आहे 🎉',
    specialDay: 'चा आज खास दिवस आहे', specialMoment: 'खास क्षण', specialMoments: 'खास क्षण', loading: 'तुमचे खास दिवस आठवत आहोत…',
    emptyTitle: 'तुमच्या खास माणसांपासून सुरुवात करा', emptyBody: 'एखादी खास व्यक्ती आणि प्रसंग जोडा. SANLY ही माहिती या फोनवरच सुरक्षित ठेवते.',
    allTodayTitle: 'आज सगळ्यांचाच खास दिवस आहे!', allTodayBody: 'आजचे क्षण आनंदाने साजरे करा — आणखी एखादी खास व्यक्ती कधीही जोडू शकता.',
    marathiNote: 'आपल्या माणसांना शुभेच्छा द्यायला विसरू नका. 💜', changeLanguage: 'भाषा', chooseLanguage: 'तुमची भाषा निवडा',
    chooseLanguageBody: 'SANLY चे सर्व पर्याय या भाषेत दिसतील. प्रत्येक शुभेच्छेसाठी वेगळी भाषा निवडता येईल.',
  },
} as const;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => { if (value === 'Marathi' || value === 'English') setLanguageState(value); })
      .finally(() => setHydrated(true));
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    hydrated,
    setLanguage: async (next) => { setLanguageState(next); await AsyncStorage.setItem(STORAGE_KEY, next); },
    t: (key) => copy[language ?? 'English'][key],
  }), [language, hydrated]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
