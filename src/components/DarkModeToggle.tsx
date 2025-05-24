import {
  IconButton,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import {
  setThemeMode,
  ColorModeSetting,
  apiThemeToColorMode,
  colorModeToApiTheme,
} from '@/helpers/themeHelpers';
import { useAuthStore } from '@/hooks/useAuthStore';
import { updateUserSettings } from '@/api/preferences';
import { useThemeStore } from '@/store/useThemeStore';

const DarkModeToggle = () => {
  const { user } = useAuthStore();
  const { setColorMode } = useColorMode();

  const { theme: mode, setTheme: setMode } = useThemeStore();

  const [systemColorMode, setSystemColorMode] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  console.debug(systemColorMode)

  const nextMode: Record<ColorModeSetting, ColorModeSetting> = {
    light: 'dark',
    dark: 'auto',
    auto: 'light',
  };

  useEffect(() => {
    const initialMode = apiThemeToColorMode(user?.theme || 'AUTO');
    setMode(initialMode);
    setThemeMode(initialMode, setColorMode);
  }, [user?.theme, setColorMode]);

  const cycleMode = async () => {
    const newMode = nextMode[mode];
    setMode(newMode);
    setThemeMode(newMode, setColorMode);

    // Persist to backend
    await updateUserSettings({ theme: colorModeToApiTheme(newMode) });
  };

  // Auto mode system preference listener
  useEffect(() => {
    if (mode !== 'auto') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newColor = e.matches ? 'dark' : 'light';
      setSystemColorMode(newColor);
      setColorMode(newColor);
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [mode, setColorMode]);

  // Reactive icon based on current mode
  const icon = mode === 'auto' ? <FaDesktop /> : mode === 'dark' ? <FaMoon /> : <FaSun />;
  const label = `Switch to ${nextMode[mode]} mode`;

  return (
    <Tooltip label={label} hasArrow>
      <IconButton
        aria-label="Toggle Color Mode"
        icon={icon}
        onClick={cycleMode}
        size="sm"
        variant="ghost"
        isRound
        sx={{
          bg: useColorModeValue('gray.200', 'gray.700'),
          _hover: { bg: useColorModeValue('gray.300', 'gray.600') },
        }}
      />
    </Tooltip>
  );
};

export default DarkModeToggle;


