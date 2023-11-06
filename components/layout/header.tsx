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
  Text,
} from "@chakra-ui/react";
import { ConnectButton } from "@/components/ConnectButton";
import React from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export const headerHeight = "64px";

export const Header = () => {
  return (
    <Flex
      width={"100%"}
      height={headerHeight}
      alignItems={"center"}
      paddingX={"40px"}
      backgroundColor={"grey.300"}
      borderBottom={"1px solid"}
    >
      <HStack height={"100%"}>
        <Heading fontFamily="Switzer" size={"md"} mr={4}>
          Hyperboards
        </Heading>
        <BrowseMenu />
      </HStack>
      <Box ml={"auto"}>
        <ConnectButton />
      </Box>
    </Flex>
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
              <BrowseMenuItem text="hypercerts" />
              <BrowseMenuItem text="hyperboards" />
            </MenuList>
          </>
        )}
      </Menu>
    </Box>
  );
};

const BrowseMenuItem = ({ text }: { text: string }) => {
  return (
    <MenuItem
      height={headerHeight}
      backgroundColor={"background"}
      width={"100%"}
      borderBottom={"1px solid black"}
      _hover={{ backgroundColor: "white" }}
      _last={{ borderBottom: "none" }}
    >
      <Text textAlign={"center"} width={"100%"} textTransform={"uppercase"}>
        {text}
      </Text>
    </MenuItem>
  );
};
