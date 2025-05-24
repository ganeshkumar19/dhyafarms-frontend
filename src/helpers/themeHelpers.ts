export type ColorModeSetting = 'light' | 'dark' | 'auto';

let mediaQueryListener: (() => void) | null = null;

export const setThemeMode = (
  value: ColorModeSetting,
  setColorMode: (value: 'light' | 'dark') => void
) => {
  localStorage.setItem('chakra-ui-color-mode', value);

  // Clean up any existing listener
  if (mediaQueryListener) {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', mediaQueryListener);
    mediaQueryListener = null;
  }

  if (value === 'auto') {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateMode = (e?: MediaQueryListEvent) => {
      const prefersDark = e?.matches ?? media.matches;
      const newMode = prefersDark ? 'dark' : 'light';
      setColorMode(newMode);
    };

    updateMode(); // Set initial mode
    media.addEventListener('change', updateMode);
    mediaQueryListener = () => media.removeEventListener('change', updateMode);
  } else {
    setColorMode(value);
  }
};

export const apiThemeToColorMode = (apiTheme: string): ColorModeSetting => {
    switch (apiTheme.toUpperCase()) {
      case 'DARK':
        return 'dark';
      case 'LIGHT':
        return 'light';
      default:
        return 'auto';
    }
  };
  
  export const colorModeToApiTheme = (mode: ColorModeSetting): string => {
    return mode.toUpperCase(); // e.g., 'dark' => 'DARK'
  };
