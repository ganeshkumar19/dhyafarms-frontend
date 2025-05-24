import { create } from 'zustand';
import { ColorModeSetting } from '@/helpers/themeHelpers';

type ThemeStore = {
  theme: ColorModeSetting;
  setTheme: (theme: ColorModeSetting) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'auto',
  setTheme: (theme) => set({ theme }),
}));