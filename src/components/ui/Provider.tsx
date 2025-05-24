// src/components/ui/Provider.tsx
// ✅ Correct
// ✅ Correct Chakra import
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ReactNode } from "react"

// Optional: Customize theme here
const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
})

interface ProviderProps {
  children: ReactNode
}

export const Provider = ({ children }: ProviderProps) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}