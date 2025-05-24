// src/components/ui/color-mode.ts
import { useColorMode as useChakraColorMode, useColorModeValue as useChakraColorModeValue } from '@chakra-ui/react';

export type ColorMode = 'light' | 'dark';

export function useColorMode(): {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
} {
  const { colorMode, toggleColorMode } = useChakraColorMode();

  const setColorMode = (mode: ColorMode) => {
    if (mode !== colorMode) {
      toggleColorMode();
    }
  };

  return {
    colorMode: colorMode as ColorMode,
    setColorMode,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T): T {
  return useChakraColorModeValue(light, dark);
}