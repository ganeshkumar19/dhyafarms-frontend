// theme.config.ts
import { defineConfig } from "@pandacss/dev"

export const config = defineConfig({
  theme: {
    extend: {
      recipes: {
        button: {
          base: {
            fontWeight: "medium",
            borderRadius: "md",
            _hover: {
              opacity: "0.9",
            },
          },
          variants: {
            primary: {
              backgroundColor: { value: "{colors.brand.500}" },
              color: { value: "{colors.white}" },
            },
            secondary: {
              backgroundColor: { value: "{colors.gray.200}" },
              color: { value: "{colors.black}" },
            },
          },
        },
      },
    },
  },
  include: ["./src/**/*.{ts,tsx}"],
  outdir: "styled-system",
})

export default config