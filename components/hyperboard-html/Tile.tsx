import React from "react";
import { HyperboardEntry } from "@/types/Hyperboard";
import { Flex, Image, Text } from "@chakra-ui/react";

const borderRadius = 10;
const logosAndText = "black";
const background = "white";

export const Tile = ({
  entry,
  padding,
  ...wrapperProps
}: {
  entry: HyperboardEntry;
  width: number;
  height: number;
  top: number;
  left: number;
  padding: number;
}) => {
  if (entry.type === "company") {
    return (
      <Wrapper {...wrapperProps}>
        <Flex
          color={"red"}
          fill={"red"}
          width={"100%"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          filter={
            "invert(0%) sepia(0%) saturate(1081%) hue-rotate(270deg) brightness(101%) contrast(106%)"
          }
        >
          <Image
            filter={
              "invert(0%) sepia(0%) saturate(1081%) hue-rotate(270deg) brightness(101%) contrast(106%) !important"
            }
            className={"company-logo"}
            maxWidth={"60%"}
            src={entry.image}
            alt={entry.image}
          />
        </Flex>
      </Wrapper>
    );
  }

  if (entry.type === "person") {
    const layout = getTileLayout(wrapperProps.width, wrapperProps.height);
    console.log(layout);
    return (
      <Wrapper {...wrapperProps}>
        <Flex
          width={"100%"}
          position={"relative"}
          height={"100%"}
          justifyContent={"space-between"}
        >
          <Flex flexDirection={"column"} marginTop={"auto"} padding={padding}>
            <Text
              lineHeight={"28px"}
              fontSize={layout.font}
              color={logosAndText}
              fontFamily={"Switzer"}
            >
              {entry.firstName}
            </Text>
            <Text
              lineHeight={"28px"}
              fontSize={layout.font}
              color={logosAndText}
            >
              {entry.lastName}
            </Text>
          </Flex>
          <Image
            borderTopRightRadius={borderRadius}
            borderBottomLeftRadius={borderRadius}
            marginBottom={"auto"}
            src={entry.image}
            alt={"Test alt"}
            height={`${layout.image}px`}
            width={`${layout.image}px`}
            maxWidth={`${layout.image}px`}
            maxHeight={`${layout.image}px`}
          />
        </Flex>
      </Wrapper>
    );
  }
};

const Wrapper = ({
  width,
  height,
  top,
  left,
  children,
}: {
  width: number;
  height: number;
  top: number;
  left: number;
} & React.PropsWithChildren) => {
  return (
    <Flex
      position="absolute"
      width={width}
      height={height}
      top={top}
      left={left}
      backgroundColor={background}
      borderRadius={borderRadius}
      _hover={{
        backgroundColor: "gray.100",
      }}
    >
      {children}
    </Flex>
  );
};

const getTileLayout = (width: number, height: number) => {
  const fontLarge = 28;
  const fontMedium = 18;
  const fontSmall = 12;

  const imageLarge = 128;
  const imageMedium = 88;
  const imageSmall = 64;
  const imageNone = 0;

  if (height > 190) {
    if (width > 348) {
      return {
        font: fontLarge,
        image: imageLarge,
      };
    }

    if (width <= 348 && width > 220) {
      return {
        font: fontLarge,
        image: imageLarge,
      };
    }

    if (width <= 220 && width > 150) {
      return {
        font: fontMedium,
        image: imageLarge,
      };
    }

    if (width <= 150 && width >= 64) {
      return {
        font: fontSmall,
        image: imageSmall,
      };
    }

    if (width < 64) {
      return {
        font: fontSmall,
        image: imageNone,
      };
    }
  }

  if (height > 120 && height <= 190) {
    if (width > 348) {
      return {
        font: fontLarge,
        image: imageLarge,
      };
    }

    if (width <= 348 && width > 220) {
      return {
        font: fontMedium,
        image: imageMedium,
      };
    }

    if (width <= 220 && width > 150) {
      return {
        font: fontSmall,
        image: fontMedium,
      };
    }

    if (width <= 150 && width >= 64) {
      return {
        font: fontSmall,
        image: imageSmall,
      };
    }

    if (width < 64) {
      return {
        font: fontSmall,
        image: imageNone,
      };
    }
  }

  if (height <= 120) {
    if (width > 348) {
      return {
        font: fontLarge,
        image: imageMedium,
      };
    }

    if (width <= 348 && width > 220) {
      return {
        font: fontLarge,
        image: imageSmall,
      };
    }

    if (width <= 220 && width > 150) {
      return {
        font: fontSmall,
        image: imageSmall,
      };
    }

    if (width <= 150 && width >= 64) {
      return {
        font: fontSmall,
        image: imageSmall,
      };
    }

    if (width < 64) {
      return {
        font: fontSmall,
        image: imageNone,
      };
    }
  }

  throw new Error("Unknown tile layout");
};
