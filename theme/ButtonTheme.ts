import { defineStyleConfig } from "@chakra-ui/react";

export const ButtonTheme = defineStyleConfig({
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
      _disabled: {
        backgroundColor: "rgba(0,0,0,0.3)",
        color: "white",
        _hover: {
          backgroundColor: "rgba(0,0,0,0.3) !important",
          color: "white",
        },
      },
    },
    blackAndWhiteOutline: {
      color: "black",
      background: "white",
      border: "1px solid black",
      borderRadius: "8px",
    },
    gray: {
      backgroundColor: "rgba(242,242,242,1)",
      color: "black",
      borderRadius: "8px",
    },
  },
  defaultProps: {},
});
