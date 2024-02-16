import React from "react";
import { HyperboardEntry } from "@/types/Hyperboard";
import { Flex, Image, Text } from "@chakra-ui/react";
import { BlueprintTooltip } from "@/components/blueprint-tooltip";

const borderRadius = "8px";
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
  const opacity = entry.isBlueprint ? 0.5 : 1;
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
        >
          <Image
            opacity={opacity}
            className={"company-logo"}
            maxWidth={"60%"}
            maxHeight={"80%"}
            src={entry.image}
            alt={entry.image}
          />
        </Flex>
      </Wrapper>
    );
  }

  if (entry.type === "person") {
    const layout = getTileLayout(wrapperProps.width, wrapperProps.height);
    return (
      <Wrapper {...wrapperProps}>
        <Flex
          width={"100%"}
          position={"relative"}
          height={"100%"}
          justifyContent={"space-between"}
          backgroundColor={entry.isBlueprint ? "gray.100" : undefined}
        >
          <Flex flexDirection={"column"} marginTop={"auto"} padding={padding}>
            <Text
              fontSize={`${layout.font}px`}
              color={logosAndText}
              fontFamily={"Switzer"}
              opacity={opacity}
            >
              {entry.firstName}
            </Text>
            <Text
              opacity={opacity}
              fontSize={`${layout.font}px`}
              color={logosAndText}
            >
              {entry.lastName}
            </Text>
          </Flex>
          <Image
            opacity={opacity}
            borderTopRightRadius={borderRadius}
            borderBottomLeftRadius={borderRadius}
            marginBottom={"auto"}
            src={entry.image}
            alt={"Test alt"}
            height={`${layout.image}px`}
            width={`${layout.image}px`}
            maxWidth={`${layout.image}px`}
            maxHeight={`${layout.image}px`}
            objectFit={"cover"}
          />
        </Flex>
        {entry.isBlueprint && (
          <BlueprintTooltip
            position={"absolute"}
            top={padding}
            left={padding}
          />
        )}
      </Wrapper>
    );
  }

  if (entry.type === "speaker") {
    const layout = getTileLayout(wrapperProps.width, wrapperProps.height);
    return (
      <Wrapper {...wrapperProps}>
        <Flex
          width={"100%"}
          position={"relative"}
          height={"100%"}
          justifyContent={"space-between"}
          backgroundColor={entry.isBlueprint ? "gray.100" : undefined}
        >
          <Flex flexDirection={"column"} marginTop={"auto"} padding={padding}>
            <Text
              fontSize={`${layout.font}px`}
              color={logosAndText}
              fontFamily={"Switzer"}
              fontWeight={600}
            >
              {entry.firstName} {entry.lastName}
            </Text>
            {entry.companyName && (
              <Text
                fontSize={`${layout.font}px`}
                color={logosAndText}
                opacity={"50%"}
                fontFamily={"Switzer"}
                noOfLines={1}
              >
                {entry.companyName}
              </Text>
            )}
          </Flex>
          <Image
            position={"absolute"}
            right={0}
            top={0}
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
      overflow={"hidden"}
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
        image: imageMedium,
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

  throw new Error(`Unknown tile layout for ${width}x${height}`);
};
