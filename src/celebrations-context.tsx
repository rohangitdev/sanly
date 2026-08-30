import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Relationship = 'Friend' | 'Family' | 'Partner' | 'Colleague';
export type WishLanguage = 'Marathi' | 'English';
export type OccasionType = 'Birthday' | 'Anniversary' | 'Engagement' | 'Wedding' | 'Graduation' | 'New Job' | 'Festival' | 'Achievement' | 'Other';

export type Celebration = {
  id: string;
  name: string;
  occasionType: OccasionType;
  date: string;
  relationship: Relationship;
  wishLanguage: WishLanguage;
};

type CelebrationContextValue = {
  celebrations: Celebration[];
  hydrated: boolean;
  addCelebration: (celebration: Omit<Celebration, 'id'>) => Celebration;
};

const STORAGE_KEY = '@sanly/celebrations-v1';
const CelebrationContext = createContext<CelebrationContextValue | null>(null);

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setCelebrations(JSON.parse(raw));
      } catch (error) {
        console.warn('SANLY could not load saved celebrations', error);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(celebrations)).catch((error) =>
      console.warn('SANLY could not save celebrations', error),
    );
  }, [celebrations, hydrated]);

  const value = useMemo<CelebrationContextValue>(() => ({
    celebrations,
    hydrated,
    addCelebration: (input) => {
      const celebration = { ...input, id: `${Date.now()}` };
      setCelebrations((current) => [...current, celebration]);
      return celebration;
    },
  }), [celebrations, hydrated]);

  return <CelebrationContext.Provider value={value}>{children}</CelebrationContext.Provider>;
}

export function useCelebrations() {
  const context = useContext(CelebrationContext);
  if (!context) throw new Error('useCelebrations must be used inside CelebrationProvider');
  return context;
}
