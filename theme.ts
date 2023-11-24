import {
  defineStyleConfig,
  extendTheme,
  ThemeOverride,
} from "@chakra-ui/react";

export const colors = {
  background: "#F1F1F1",
};

const Badge = defineStyleConfig({
  baseStyle: {
    backgroundColor: "black",
    color: "white",
  },
});

const Tag = defineStyleConfig({
  baseStyle: {
    container: {
      border: "1px solid black",
      background: "transparent",
    },
  },
  defaultProps: {
    size: "lg",
  },
});

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
      borderRadius: "8px",
    },
    blackAndWhiteOutline: {
      color: "black",
      background: "white",
      border: "1px solid black",
      borderRadius: "8px",
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
      fontFamily: `'Director-Variable', sans-serif`,
      fontWeight: 100,
      textTransform: "uppercase",
    },
  },
  fontSizes: {
    lg: "24px",
  },
  colors: {
    background: "#F1F1F1",
  },
  components: {
    Button,
    Badge,
    Tag,
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
