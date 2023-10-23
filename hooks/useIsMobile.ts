import { useMediaQuery } from "@chakra-ui/react";

export const useIsMobile = () => useMediaQuery("(max-width: 700px)")[0];
