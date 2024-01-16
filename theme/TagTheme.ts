import { defineStyleConfig } from "@chakra-ui/react";

export const TagTheme = defineStyleConfig({
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
