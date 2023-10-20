import { extendTheme, ThemeOverride } from "@chakra-ui/react";

export const chakraTheme: ThemeOverride = extendTheme({
  fonts: {
    heading: `'Director-regular', sans-serif`,
    body: `'Switzer', sans-serif`,
  },
  fontSizes: {
    lg: "24px",
    md: "18px",
  },
  lineHeights: {
    base: "1",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "0",
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "0",
        },
        addon: {
          borderRadius: "0",
        },
      },
    },
  },
} as ThemeOverride);
