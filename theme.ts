import {
  defineStyleConfig,
  extendTheme,
  ThemeOverride,
} from "@chakra-ui/react";

export const colors = {
  background: "#F1F1F1",
};

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: "0",
    color: "white",
    background: "none",
  },
  variants: {
    blackAndWhite: {
      color: "white",
      background: "black",
      borderRadius: 16,
    },
    blackAndWhiteOutline: {
      color: "black",
      background: "white",
      border: "1px solid black",
      borderRadius: 16,
    },
  },
  defaultProps: {},
});

export const theme: ThemeOverride = extendTheme({
  fonts: {
    heading: `'Director-Variable', sans-serif`,
    body: `'Switzer', sans-serif`,
  },
  textStyles: {
    primary: {
      fontFamily: `'Switzer', sans-serif`,
    },
    secondary: {
      "font-family": `'Director-Variable', sans-serif`,
    },
  },
  fontSizes: {
    lg: "24px",
  },
  colors: {
    background: "#F1F1F1",
  },
  lineHeights: {},
  components: {
    Button,
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
