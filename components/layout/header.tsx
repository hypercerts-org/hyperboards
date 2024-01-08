import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ConnectButton } from "@/components/ConnectButton";
import React from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { Pivot as Hamburger } from "hamburger-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ProfileInfo } from "@/components/profile-info";

export const headerHeight = "64px";

export const Header = () => {
  const { isConnected, address } = useAccount();
  return (
    <Flex
      width={"100%"}
      height={headerHeight}
      alignItems={"center"}
      paddingX={[0, 0, "40px"]}
      backgroundColor={"grey.300"}
      borderBottom={"1px solid"}
    >
      <HStack height={"100%"}>
        <Heading fontFamily="Switzer" size={"md"} mr={4} ml={[4, 4, 0]}>
          Hyperboards
        </Heading>
        <Show above={"md"}>
          <BrowseMenu />
        </Show>
      </HStack>
      <Flex ml={"auto"} alignItems={"center"} height={"100%"}>
        <Show above={"md"}>
          <ConnectButton />
        </Show>
        <Show below={"md"}>
          {isConnected && address && (
            <Flex
              px={4}
              borderLeft={"1px solid black"}
              backgroundColor={"white"}
              height={"100%"}
            >
              <ProfileInfo address={address} />
            </Flex>
          )}
          <Flex
            alignItems={"center"}
            borderLeft={"1px solid black"}
            height={"100%"}
          >
            <MobileMenuButton />
          </Flex>
        </Show>
      </Flex>
    </Flex>
  );
};

const MobileMenuButton = () => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <Flex
      backgroundColor={isOpen ? "white" : undefined}
      width={"100%"}
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      px={2}
    >
      <Hamburger onToggle={(toggled) => setOpen(toggled)} toggled={isOpen} />
      {isOpen && (
        <Box
          position={"absolute"}
          width={"100vw"}
          left={0}
          top={`calc(${headerHeight} - 1px)`}
        >
          <MobileMenuContent onClickOutside={() => setOpen(false)} />
        </Box>
      )}
    </Flex>
  );
};

const MobileMenuContent = ({
  onClickOutside,
}: {
  onClickOutside: () => void;
}) => {
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onClickOutside();
      }}
      minHeight={`calc(100vh - ${headerHeight})`}
      backgroundColor={"rgba(0, 0, 0, 0.2)"}
      position={"relative"}
      top={0}
      zIndex={1}
    >
      <Flex height={"fit-content"} width={"100%"} backgroundColor={"black"}>
        <VStack
          py={12}
          alignItems={"center"}
          flexDirection={"column"}
          width={"100%"}
          border={"1px solid black"}
          backgroundColor={"white"}
          borderRadius={4}
        >
          <VStack>
            <MobileMenuLink href="/hypercerts" text="hypercerts" />
            <MobileMenuLink href="/" text="hyperboards" />
          </VStack>
          <ConnectButton mt={12} borderRadius={6} />
        </VStack>
      </Flex>
    </Box>
  );
};

const MobileMenuLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <Link href={href}>
      <Heading
        textTransform={"uppercase"}
        textStyle={"secondary"}
        fontWeight={"100"}
      >
        {text}
      </Heading>
    </Link>
  );
};

const BrowseMenu = () => {
  const width = "250px";
  return (
    <Box
      width={width}
      textStyle={"secondary"}
      textTransform={"uppercase"}
      height={"100%"}
    >
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              height={"100%"}
              width={width}
              backgroundColor={"background"}
              borderLeft={"1px solid black"}
              borderRight={"1px solid black !important"}
              textTransform={"uppercase"}
              _hover={{ backgroundColor: "white" }}
              _focus={{ backgroundColor: "none" }}
              _active={{ backgroundColor: "none" }}
              as={Button}
              rightIcon={isOpen ? <BiChevronUp /> : <BiChevronDown />}
            >
              browse
            </MenuButton>
            <MenuList
              p={0}
              backgroundColor={"background"}
              width={width}
              borderRadius={0}
              textStyle={"secondary"}
              textTransform={"uppercase"}
              mt={-2}
              border={"1px solid black"}
            >
              <BrowseMenuItem text="hypercerts" href="/hypercerts" />
              <BrowseMenuItem text="hyperboards" href="/boards/" />
              <BrowseMenuItem text="admin" href="/admin/hyperboards" />
            </MenuList>
          </>
        )}
      </Menu>
    </Box>
  );
};

const BrowseMenuItem = ({ text, href }: { text: string; href: string }) => {
  return (
    <Box
      width={"100%"}
      borderBottom={"1px solid black"}
      _last={{ borderBottom: "none" }}
      height={headerHeight}
    >
      <Link href={href}>
        <MenuItem
          _hover={{ backgroundColor: "white" }}
          backgroundColor={"background"}
          width={"100%"}
          height={"100%"}
        >
          <Text textAlign={"center"} width={"100%"} textTransform={"uppercase"}>
            {text}
          </Text>
        </MenuItem>
      </Link>
    </Box>
  );
};
