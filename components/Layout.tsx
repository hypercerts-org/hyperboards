import { PropsWithChildren } from "react";
import { Box, Center, Flex, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      width={"100vw"}
      minHeight={"100vh"}
    >
      <Header />
      <Center maxWidth={"960px"}>{children}</Center>
      <Footer />
    </Flex>
  );
};

const Header = () => {
  return (
    <Flex
      width={"100%"}
      height={"80px"}
      alignItems={"center"}
      paddingX={"40px"}
      backgroundColor={"gray.300"}
    >
      <HStack>
        <Heading>Hyperboards</Heading>
        <Link href={"/store"}>Store</Link>
        <Link href={"/"}>Board</Link>
      </HStack>
      <Box ml={"auto"}>
        <ConnectButton />
      </Box>
    </Flex>
  );
};

const Footer = () => {
  return (
    <Flex width={"100%"} marginTop={"auto"}>
      Footer
    </Flex>
  );
};
