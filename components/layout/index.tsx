import { PropsWithChildren } from "react";
import { Flex } from "@chakra-ui/react";
import { colors } from "@/theme";
import { Header } from "@/components/layout/header";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      width={"100vw"}
      minHeight={"100vh"}
      backgroundColor={colors.background}
    >
      <Header />
      {children}
      {/*<Footer />*/}
    </Flex>
  );
};
// const Footer = () => {
//   return (
//     <Flex width={"100%"} marginTop={"auto"}>
//       Footer
//     </Flex>
//   );
// };
