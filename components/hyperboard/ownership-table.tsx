import React, { useMemo, useState } from "react";
import { Center, Flex, Icon, Image, Text } from "@chakra-ui/react";
import _ from "lodash";

import "../../styles/scrollbar.module.css";
import { BiChevronRight } from "react-icons/bi";
import { BlueprintTooltip } from "@/components/blueprint-tooltip";
import { useFetchHypercertById } from "@/hooks/useFetchHypercertById";
import { formatAddress } from "@/utils/formatting";
import { useFetchHyperboardById } from "@/hooks/useFetchHyperboardContents2";

interface OwnershipTableProps {
  hyperboardId: string;
  showHeader?: boolean;
  selectedCollection?: string;
  onSelectCollection?: (registryId: string | undefined) => void;
}

export const OwnershipTable = ({
  hyperboardId,
  showHeader = false,
  selectedCollection,
  onSelectCollection,
}: OwnershipTableProps) => {
  const { data: hyperboardContentData } = useFetchHyperboardById(hyperboardId);
  const [selectedClaim, setSelectedClaim] = useState<string>();
  const [selectedBlueprint, setSelectedBlueprint] = useState<number>();

  const dataToShow = useMemo(() => {
    const getData = () => {
      if (!hyperboardContentData) {
        return [];
      }

      if (selectedClaim) {
        return hyperboardContentData.sections.data
          .flatMap((section) => section.entries)
          .find((entry) => entry.id === selectedClaim)?.owners;
      }

      if (selectedBlueprint) {
        return hyperboardContentData.sections.data
          .flatMap((section) => section.entries)
          .find((entry) => entry.id === selectedBlueprint.toString())?.owners;
      }

      if (selectedCollection) {
        const section = hyperboardContentData.sections.data.find(
          (collection) => collection.collection.id === selectedCollection,
        );
        if (section) {
          return section.owners.map((owner) => ({
            ...owner,
            percentage: owner.percentage_owned,
          }));
        }
      }

      return hyperboardContentData.owners.map((owner) => ({
        ...owner,
        percentage: owner.percentage_owned,
      }));
    };
    const data = getData();
    return (data || []).sort((a, b) => b.percentage - a.percentage);
  }, [selectedCollection, selectedClaim]);

  if (!hyperboardContentData) {
    return null;
  }

  const getClaimIds = () => {
    if (selectedClaim) {
      return {
        claimIds: [selectedClaim],
      };
    }

    if (selectedBlueprint) {
      return {
        claimIds: [selectedBlueprint.toString()],
      };
    }

    if (selectedCollection) {
      const section = hyperboardContentData.sections.data.find(
        (collection) => collection.collection.id === selectedCollection,
      );
      if (section) {
        return {
          claimIds: section.entries.map((entry) => entry.id),
        };
      }
    }

    return {
      claimIds: [],
    };
  };

  const { claimIds } = getClaimIds();

  const indexOfSelectedRegistry = hyperboardContentData.sections.data.findIndex(
    (registry) => registry.collection.id === selectedCollection,
  );

  return (
    <>
      {showHeader && (
        <Center
          width={"100%"}
          border={"1px solid black"}
          borderBottom={"none"}
          py={10}
        >
          <Text textStyle={"secondary"} textTransform={"uppercase"}>
            {selectedClaim ? "hypercert ownership" : "hyperboard ownership"}
          </Text>
        </Center>
      )}
      <Flex
        width={"100%"}
        height={["fit-content", "fit-content", "360px"]}
        flexDirection={["column", "column", "row"]}
      >
        <Flex
          flexBasis={["100%", "100%", "50%"]}
          flexDirection={"column"}
          border={"1px solid black"}
          borderRight={"none"}
          overflowY={"auto"}
          className={"custom-scrollbar"}
        >
          {hyperboardContentData.sections.data.map(
            ({ label, collection: { id }, entries }, index) => {
              if (!entries) {
                return null;
              }
              const sortedEntries = _.sortBy(
                entries,
                (entry) => -entry.percentage_of_section,
              );

              const isRegistrySelected =
                !selectedClaim &&
                !selectedBlueprint &&
                selectedCollection === id;
              const isFirstAfterSelected =
                indexOfSelectedRegistry !== -1 &&
                index === indexOfSelectedRegistry + 1;
              const isLastRegistry =
                index === hyperboardContentData.sections.data.length - 1;
              const isSingleSection =
                hyperboardContentData.sections.data.length === 1;
              return (
                <div key={id}>
                  {!isSingleSection && (
                    <RegistryRow
                      isSelected={isRegistrySelected}
                      fadedBorder={isRegistrySelected}
                      text={label || "No label"}
                      isFirstAfterSelected={isFirstAfterSelected}
                      percentage={100}
                      onClick={() => {
                        if (isRegistrySelected) {
                          onSelectCollection?.(undefined);
                        } else {
                          setSelectedClaim(undefined);
                          setSelectedBlueprint(undefined);
                          onSelectCollection?.(id);
                        }
                      }}
                      icon={
                        <Image
                          alt={"Board icon"}
                          src={
                            "https://staging.hyperboards.org/icons/board.svg"
                          }
                          width={"24px"}
                        />
                      }
                    />
                  )}
                  {selectedCollection === id && (
                    <>
                      {sortedEntries.map((claim, index) => {
                        const isClaimSelected = claim.id === selectedClaim;
                        const isLastClaim =
                          !isLastRegistry && index === sortedEntries.length - 1;

                        if (claim.is_blueprint) {
                          const isBlueprintSelected =
                            Number(claim.id) === selectedBlueprint;
                          return (
                            <ClaimRow
                              isSingleSection={isSingleSection}
                              key={claim.id}
                              isSelected={isBlueprintSelected}
                              isLast={false}
                              text={claim.name || "No name"}
                              percentage={claim.percentage_of_section}
                              onClick={() => {
                                if (isBlueprintSelected) {
                                  setSelectedBlueprint(undefined);
                                  setSelectedClaim(undefined);
                                } else {
                                  setSelectedClaim(undefined);
                                  setSelectedBlueprint(Number(claim.id));
                                }
                              }}
                              icon={
                                <BlueprintTooltip
                                  width={"12p"}
                                  alignItems={"center"}
                                />
                              }
                            />
                          );
                        }
                        return (
                          <HypercertClaimRow
                            key={claim.id}
                            isSingleSection={isSingleSection}
                            isSelected={isClaimSelected}
                            isLast={isLastClaim}
                            hypercertId={claim.id}
                            percentage={claim.percentage_of_section}
                            onClick={() => {
                              if (isClaimSelected) {
                                setSelectedBlueprint(undefined);
                                setSelectedClaim(undefined);
                              } else {
                                setSelectedBlueprint(undefined);
                                setSelectedClaim(claim.id);
                              }
                            }}
                            icon={
                              <Image
                                alt={"Claim icon"}
                                src={
                                  "https://staging.hyperboards.org/icons/board.svg"
                                }
                                width={"12px"}
                              />
                            }
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              );
            },
          )}
        </Flex>
        <Flex
          flexBasis={["100%", "100%", "50%"]}
          flexDirection={"column"}
          border={"1px solid black"}
          borderLeft={"none"}
          overflowY={"auto"}
          className={"custom-scrollbar"}
        >
          {/*
          //@ts-ignore */}
          <ClaimOwnershipOverview data={dataToShow} />
        </Flex>
      </Flex>
    </>
  );
};

interface SelectionRowProps {
  isSelected: boolean;
  text: string;
  percentage: number;
  onClick: () => void;
  icon: React.JSX.Element;
}

const RegistryRow = ({
  icon,
  isSelected,
  text,
  percentage,
  onClick,
  fadedBorder,
  isFirstAfterSelected,
}: SelectionRowProps & {
  fadedBorder?: boolean;
  isFirstAfterSelected?: boolean;
}) => {
  return (
    <Flex
      cursor={"pointer"}
      onClick={onClick}
      pl={"20px"}
      backgroundColor={isSelected ? "white" : undefined}
      _hover={{ backgroundColor: "white" }}
    >
      <Flex
        width={"100%"}
        borderTop={isFirstAfterSelected ? "1px solid black" : "none"}
        borderBottom={
          isSelected ? "1px solid rgba(0, 0, 0, 0.3)" : "1px solid black"
        }
        borderRight={fadedBorder ? "none" : "1px solid black"}
        py={"14px"}
        pr={"52px"}
        position={"relative"}
      >
        {icon}
        <Text ml={4}>{text}</Text>
        <Text textStyle={"secondary"} ml={"auto"}>
          {percentage}%
        </Text>
        {isSelected && <SelectedIcon />}
      </Flex>
    </Flex>
  );
};

const HypercertClaimRow = ({
  hypercertId,
  ...props
}: Omit<SelectionRowProps, "text"> & {
  isLast?: boolean;
  hypercertId: string;
  isSingleSection?: boolean;
}) => {
  const { data: claim } = useFetchHypercertById(hypercertId);

  if (!claim) {
    return null;
  }

  return (
    <ClaimRow
      {...props}
      text={claim?.metadata?.name || "No name"}
      icon={
        <Image
          alt={"Claim icon"}
          src={"https://staging.hyperboards.org/icons/claim.svg"}
          width={"12px"}
        />
      }
    />
  );
};

const ClaimRow = ({
  icon,
  isSelected,
  text,
  percentage,
  onClick,
  isLast,
  isSingleSection = false,
}: SelectionRowProps & { isLast?: boolean; isSingleSection?: boolean }) => {
  return (
    <Flex
      cursor={"pointer"}
      onClick={onClick}
      pl={"20px"}
      backgroundColor={isSelected ? "white" : undefined}
      _hover={{ backgroundColor: "white" }}
    >
      <Flex
        width={"100%"}
        borderBottom={!isLast ? "1px solid rgba(0, 0, 0, 0.3)" : "none"}
        borderRight={isSelected ? "1px solid transparent" : "1px solid black"}
        ml={isSingleSection ? "0px" : "42px"}
        py={"14px"}
        pr={"20px"}
        position={"relative"}
        alignItems={"center"}
      >
        {icon}
        <Text ml={4}>{text}</Text>
        <Text textStyle={"secondary"} ml={"auto"}>
          {percentage.toFixed(2)}%
        </Text>
        {isSelected && <SelectedIcon />}
      </Flex>
    </Flex>
  );
};

const SelectedIcon = () => (
  <Icon
    as={BiChevronRight}
    position={"absolute"}
    right={"0px"}
    mt={1}
    height={"18px"}
    width={"18px"}
  />
);

const ClaimOwnershipOverview = ({
  data,
}: {
  data: {
    display_name?: string;
    address: string;
    avatar?: string;
    percentage: number;
  }[];
}) => {
  if (data.length === 0) {
    return (
      <Center height={"100%"} width={"100%"}>
        Select board to see ownership stats
      </Center>
    );
  }

  if (!data) {
    return (
      <Center height={"100%"} width={"100%"}>
        No data
      </Center>
    );
  }

  return (
    <>
      {data.map((ownership) => {
        return (
          <Flex key={ownership.address} backgroundColor={"white"}>
            <Flex
              borderBottom={"1px solid rgba(0, 0, 0, 0.3)"}
              width={"100%"}
              justifyContent={"space-between"}
              mx={"20px"}
              py={1}
            >
              <Text>{formatMetadata(ownership)}</Text>
              <Text textStyle={"secondary"}>
                {ownership.percentage.toFixed(2)}%
              </Text>
            </Flex>
          </Flex>
        );
      })}
    </>
  );
};

const formatMetadata = (displayMetadata: {
  display_name?: string;
  address: string;
  avatar?: string;
}) => {
  if (!displayMetadata) {
    return "Unknown";
  }
  const { address, display_name } = displayMetadata;

  return display_name || formatAddress(address) || "Unknown";
};
