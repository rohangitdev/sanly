import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Relationship = 'Friend' | 'Family' | 'Partner' | 'Colleague';
export type WishLanguage = 'Marathi' | 'English';

export type Celebration = {
  id: string;
  name: string;
  birthday: string;
  relationship: Relationship;
  wishLanguage: WishLanguage;
};

type CelebrationContextValue = {
  celebrations: Celebration[];
  addCelebration: (celebration: Omit<Celebration, 'id'>) => Celebration;
};

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);

  const value = useMemo<CelebrationContextValue>(() => ({
    celebrations,
    addCelebration: (input) => {
      const celebration = { ...input, id: `${Date.now()}` };
      setCelebrations((current) => [...current, celebration]);
      return celebration;
    },
  }), [celebrations]);

  return <CelebrationContext.Provider value={value}>{children}</CelebrationContext.Provider>;
}

export function useCelebrations() {
  const context = useContext(CelebrationContext);
  if (!context) throw new Error('useCelebrations must be used inside CelebrationProvider');
  return context;
}
