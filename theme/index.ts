import { extendTheme, ThemeOverride } from "@chakra-ui/react";
import { ButtonTheme as Button } from "./ButtonTheme";
import { TagTheme as Tag } from "./TagTheme";
import { BadgeTheme as Badge } from "./BadgeTheme";

export const colors = {
  background: "#F1F1F1",
};

export const index: ThemeOverride = extendTheme({
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
    xxl: "48px",
    xl: "28px",
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
      variants: {
        gray: {
          field: {
            backgroundColor: "rgba(242,242,242,1)",
            borderRadius: "8px",
            textAlign: "right",
          },
          text: {},
        },
      },
      baseStyle: {
        field: {
          borderRadius: "0",
        },
        addon: {
          borderRadius: "0",
        },
      },
    },
    Modal: {
      defaultProps: {
        isCentered: true,
      },
    },
  },
} as ThemeOverride);
