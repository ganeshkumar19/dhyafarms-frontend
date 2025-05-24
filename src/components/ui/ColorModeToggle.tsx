// src/components/ui/ColorModeToggle.tsx
import { IconButton, useColorMode } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";

export const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={colorMode === "dark" ? <LuSun color="white"/> : <LuMoon/>}
      onClick={toggleColorMode}
      variant="ghost"
    />
  );
};