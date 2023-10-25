import { PropsWithChildren } from "react";
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";

export const headerHeight = "80px";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      width={"100vw"}
      minHeight={"100vh"}
    >
      <Header />
      {children}
      {/*<Footer />*/}
    </Flex>
  );
};

const Header = () => {
  return (
    <Flex
      width={"100%"}
      height={headerHeight}
      alignItems={"center"}
      paddingX={"40px"}
      backgroundColor={"grey.300"}
    >
      <HStack>
        <Heading fontFamily="Switzer" size={"md"} mr={4}>
          Hyperboards
        </Heading>
        <HStack spacing={6}>
          <Link href={"/store"}>
            <Text fontFamily={"Switzer"}>Store</Text>
          </Link>
          <Link href={"/"}>
            <Text fontFamily={"Switzer"}>Board</Text>
          </Link>
          <Link href={"/events"}>
            <Text fontFamily={"Switzer"}>Events</Text>
          </Link>
        </HStack>
      </HStack>
      <Box ml={"auto"}>
        <ConnectButton />
      </Box>
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
