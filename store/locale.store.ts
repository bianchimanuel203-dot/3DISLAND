import { create } from 'zustand';

interface LocaleState {
  locale: string;
  setLocale: (newLocale: string) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'es', // Por defecto lo dejamos en español, igual que en tu request.ts
  setLocale: (newLocale) => set({ locale: newLocale }),
}));