import { handleChangeLanguage, languages } from '@/helpers/i18nHelpers';
import {
  Box,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Select,
  useColorMode,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { setThemeMode, ColorModeSetting, apiThemeToColorMode, colorModeToApiTheme } from '@/helpers/themeHelpers';
import { useAuthStore } from '@/hooks/useAuthStore';
import { updateUserSettings } from '@/api/preferences';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/useThemeStore';

const SettingsPreferences = () => {
  const { user, setUser} = useAuthStore();
  const { t } = useTranslation('settings');
  const { setColorMode } = useColorMode();
  const { theme, setTheme } = useThemeStore();

    const [language, setLanguage] = useState(() =>
        user?.language || 'en' // <-- initialize from user.language
      );
    

      const handleThemeChange = async (value: ColorModeSetting) => {
        setTheme(value);
        setThemeMode(value, setColorMode);
      
        const apiValue = colorModeToApiTheme(value);
        await updateUserSettings({ theme: apiValue });
        
        if (setUser && user) {
          setUser({ ...user, theme: apiValue });
        }
      };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setLanguage(selected);
    await handleChangeLanguage(selected);
  };

  useEffect(() => {
    if (user?.theme) {
      const initial = apiThemeToColorMode(user.theme);
      setTheme(initial);
      setThemeMode(initial, setColorMode);
    }
  }, [user?.theme, setTheme, setColorMode]);

  useEffect(() => {
    console.log('running')
    if (user?.language) {
      setLanguage(user.language);
    }
  }, [user?.language]);


  return (
    <Box
      border="1px solid"
      borderColor="manualBorderColor"
      maxW="2xl"
      mx="auto"
      mt={1}
      p={6}
      borderRadius="lg"
      bg="cardBg"
      boxShadow="md"
    >
      <Heading size="md">{t('appPreferences')}</Heading>
      <Box my={4}>
        <Heading size="sm" mb={2}>
          {t('theme')}
        </Heading>
        <RadioGroup value={theme} onChange={handleThemeChange}>
          <Stack direction="row">
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
            <Radio value="auto">Auto</Radio>
          </Stack>
        </RadioGroup>
      </Box>
      <Box my={4}>
        <Heading size="md" mb={4}>
        {t('language')}
        </Heading>
        <Select value={language} onChange={handleLanguageChange}>
          {languages.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default SettingsPreferences;
