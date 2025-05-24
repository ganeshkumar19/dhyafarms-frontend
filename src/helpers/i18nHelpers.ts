import { updateUserSettings } from '@/api/preferences';
import { useAuthStore } from '@/hooks/useAuthStore';
import i18n from 'i18next';

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
];

export const handleChangeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await updateUserSettings({ language: lang });
  
    // ✅ Update in-memory user store
    const { user, setUser } = useAuthStore.getState();
    if (setUser && user) {
      setUser({ ...user, language: lang });
    }
  };
  