import React from "react";
import { HyperboardEntry } from "@/types/Hyperboard";
import { Center, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { BlueprintTooltip } from "@/components/blueprint-tooltip";
import { useHover } from "@uidotdev/usehooks";
import { isAddress } from "viem";
import { formatAddress } from "@/utils/formatting";
import { useEnsName } from "wagmi";

const borderRadius = "0px";
const logosAndText = "black";

const formatTooltipLabel = (id: string, displayName?: string | null) => {
  if (displayName === id) {
    return `${displayName}`;
  }

  const formattedId = isAddress(id) ? formatAddress(id) : id;

  if (!displayName) {
    return formattedId;
  }

  if (displayName === formattedId) {
    return `${displayName}`;
  }

  return `${displayName}, ${formattedId}`;
};

export const Tile = ({
  entry,
  padding,
  grayScale = true,
  ...wrapperProps
}: {
  entry: HyperboardEntry;
  width: number;
  height: number;
  top: number;
  left: number;
  padding: number;
  grayScale?: boolean;
  borderColor?: string;
}) => {
  const opacity = entry.isBlueprint ? 0.5 : 1;

  const { data: ensName, isLoading } = useEnsName({
    address: isAddress(entry.id) ? entry.id : undefined,
    chainId: 1,
  });
  const fallback = isAddress(entry.id) ? formatAddress(entry.id) : entry.id;

  if (isLoading) {
    return null;
  }

  const name = entry.displayName || ensName || fallback;
  const toolTipLabel = formatTooltipLabel(entry.id, name);
  const layout = getTileLayout(wrapperProps.width, wrapperProps.height);

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
        {entry?.avatar ? (
          <Tooltip label={toolTipLabel} aria-label={toolTipLabel}>
            <Image
              opacity={opacity}
              className={"company-logo"}
              maxWidth={"60%"}
              maxHeight={"80%"}
              src={entry.avatar}
              alt={name}
              filter={grayScale ? `grayScale(${opacity})` : undefined}
            />
          </Tooltip>
        ) : (
          <Center height={"100%"} width={"100%"}>
            <Tooltip label={toolTipLabel}>
              <Text color="black" opacity={0.99} fontSize={layout.font}>
                {name}
              </Text>
            </Tooltip>
          </Center>
        )}
      </Flex>
    </Wrapper>
  );
  //
  // if (entry.type === "person") {
  //   const layout = getTileLayout(wrapperProps.width, wrapperProps.height);
  //   return (
  //     <Wrapper {...wrapperProps}>
  //       {showBackupImage ? (
  //         <BackupForImage
  //           id={entry.id}
  //           fontSize={layout.font}
  //           toolTipLabel={toolTipLabel}
  //         />
  //       ) : (
  //         <Flex
  //           width={"100%"}
  //           position={"relative"}
  //           height={"100%"}
  //           justifyContent={"space-between"}
  //         >
  //           <>
  //             <Flex
  //               flexDirection={"column"}
  //               marginTop={"auto"}
  //               padding={padding}
  //             >
  //               <Text
  //                 fontSize={`${layout.font}px`}
  //                 color={logosAndText}
  //                 fontFamily={"Switzer"}
  //                 opacity={opacity}
  //               >
  //                 {entry.firstName}
  //               </Text>
  //               <Text
  //                 opacity={opacity}
  //                 fontSize={`${layout.font}px`}
  //                 color={logosAndText}
  //               >
  //                 {entry.lastName}
  //               </Text>
  //             </Flex>
  //             <Tooltip label={toolTipLabel} aria-label={toolTipLabel}>
  //               <Image
  //                 opacity={opacity}
  //                 borderTopRightRadius={borderRadius}
  //                 borderBottomLeftRadius={borderRadius}
  //                 marginBottom={"auto"}
  //                 src={entry.image}
  //                 alt={"Test alt"}
  //                 height={`${layout.image}px`}
  //                 width={`${layout.image}px`}
  //                 maxWidth={`${layout.image}px`}
  //                 maxHeight={`${layout.image}px`}
  //                 objectFit={"cover"}
  //                 filter={grayScale ? `grayScale(${opacity})` : undefined}
  //               />
  //             </Tooltip>
  //           </>
  //         </Flex>
  //       )}
  //       {entry.isBlueprint && (
  //         <BlueprintTooltip
  //           position={"absolute"}
  //           top={padding}
  //           left={padding}
  //         />
  //       )}
  //     </Wrapper>
  //   );
  // }
  //
  // if (entry.type === "speaker") {
  //   const layout = getTileLayout(wrapperProps.width, wrapperProps.height);
  //   return (
  //     <Wrapper {...wrapperProps}>
  //       <Flex
  //         width={"100%"}
  //         position={"relative"}
  //         height={"100%"}
  //         justifyContent={"space-between"}
  //       >
  //         <Flex flexDirection={"column"} marginTop={"auto"} padding={padding}>
  //           <Text
  //             fontSize={`${layout.font}px`}
  //             color={logosAndText}
  //             fontFamily={"Switzer"}
  //             fontWeight={600}
  //           >
  //             {entry.firstName} {entry.lastName}
  //           </Text>
  //           {entry.companyName && (
  //             <Text
  //               fontSize={`${layout.font}px`}
  //               color={logosAndText}
  //               opacity={"50%"}
  //               fontFamily={"Switzer"}
  //               noOfLines={1}
  //             >
  //               {entry.companyName}
  //             </Text>
  //           )}
  //         </Flex>
  //         {showBackupImage ? (
  //           <BackupForImage
  //             id={entry.id}
  //             fontSize={layout.font}
  //             toolTipLabel={toolTipLabel}
  //           />
  //         ) : (
  //           <Tooltip label={toolTipLabel} aria-label={toolTipLabel}>
  //             <Image
  //               position={"absolute"}
  //               right={0}
  //               top={0}
  //               borderTopRightRadius={borderRadius}
  //               borderBottomLeftRadius={borderRadius}
  //               marginBottom={"auto"}
  //               src={entry.image}
  //               alt={"Test alt"}
  //               height={`${layout.image}px`}
  //               width={`${layout.image}px`}
  //               maxWidth={`${layout.image}px`}
  //               maxHeight={`${layout.image}px`}
  //               filter={grayScale ? `grayScale(${opacity})` : undefined}
  //             />
  //           </Tooltip>
  //         )}
  //       </Flex>
  //     </Wrapper>
  //   );
  // }
  //
  // return (
  //   <Wrapper {...wrapperProps}>
  //     <BackupForImage
  //       id={entry.id}
  //       fontSize={layout.font}
  //       toolTipLabel={toolTipLabel}
  //     />
  //   </Wrapper>
  // );
};

const BackupForImage = ({
  id,
  fontSize,
  toolTipLabel,
}: {
  id: string;
  fontSize: number;
  toolTipLabel: string;
}) => {
  const { data, isLoading } = useEnsName({
    address: isAddress(id) ? id : undefined,
    chainId: 1,
  });
  const fallback = isAddress(id) ? formatAddress(id) : id;

  if (isLoading) {
    return null;
  }

  return (
    <Center height={"100%"} width={"100%"}>
      <Tooltip label={toolTipLabel}>
        <Text color="black" opacity={0.99} fontSize={fontSize}>
          {data || fallback}
        </Text>
      </Tooltip>
    </Center>
  );
};

const Wrapper = ({
  width,
  height,
  top,
  left,
  children,
  borderColor = "white",
}: {
  width: number;
  height: number;
  top: number;
  left: number;
  borderColor?: string;
} & React.PropsWithChildren) => {
  const [ref, isHover] = useHover();
  return (
    <Flex
      ref={ref}
      overflow={"hidden"}
      position="absolute"
      width={width}
      height={height}
      top={top}
      left={left}
      borderRadius={borderRadius}
      border={`1.2px solid ${borderColor}`}
    >
      <Background hovering={isHover} />
      {children}
    </Flex>
  );
};

const Background = ({ hovering }: { hovering: boolean }) => {
  return (
    <Flex
      position={"absolute"}
      width={"100%"}
      height={"100%"}
      backgroundColor={"white"}
      borderRadius={borderRadius}
      opacity={hovering ? 0.8 : 0.5}
    />
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
