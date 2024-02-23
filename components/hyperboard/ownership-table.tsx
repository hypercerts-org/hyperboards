import React, { useState } from "react";
import { Center, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { useHypercertClient } from "@/components/providers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { sift } from "@/utils/sift";
import _ from "lodash";

import "../../styles/scrollbar.module.css";
import { BiChevronRight } from "react-icons/bi";
import { useFetchHyperboardContents } from "@/hooks/useFetchHyperboardContents";
import { DefaultSponsorMetadataEntity } from "@/types/database-entities";
import { BlueprintTooltip } from "@/components/blueprint-tooltip";

interface OwnershipTableProps {
  hyperboardId: string;
  showHeader?: boolean;
  selectedRegistry?: string;
  onSelectRegistry?: (registryId: string | undefined) => void;
}

const useHyperboardOwnership = (hyperboardId: string) => {
  const client = useHypercertClient();

  return useQuery({
    queryKey: ["hyperboard-ownership", hyperboardId],
    queryFn: async () => {
      if (!client) {
        return null;
      }

      const { data } = await supabase
        .from("hyperboards")
        .select(
          "*, hyperboard_registries ( *, registries ( *, claims ( * ), blueprints ( * ) ) )",
        )
        .eq("id", hyperboardId)
        .single();

      if (!data) {
        return null;
      }

      const results = await Promise.all(
        data.hyperboard_registries.map(async (hyperboardRegistry) => {
          if (!hyperboardRegistry.registries) {
            return null;
          }
          const claims = await Promise.all(
            sift(hyperboardRegistry.registries.claims).map(async (claim) => {
              const claimResult = await client.indexer.claimById(
                claim.hypercert_id,
              );
              if (claimResult.claim?.uri) {
                const metadata = await client.storage.getMetadata(
                  claimResult.claim.uri,
                );
                return {
                  claim: {
                    ...claim,
                    ...claimResult.claim,
                  },
                  metadata,
                };
              }
              return null;
            }),
          );

          const totalValueInRegistry = _.sum([
            ...sift(hyperboardRegistry.registries.claims).map(
              (claim) => claim.display_size,
            ),
            ...hyperboardRegistry.registries.blueprints.map(
              (blueprint) => blueprint.display_size,
            ),
          ]);

          return {
            label: hyperboardRegistry.label,
            totalValueInRegistry,
            claims: sift(claims),
            blueprints: hyperboardRegistry.registries.blueprints,
            hyperboardRegistry,
          };
        }),
      );

      return sift(results);
    },
  });
};

export const OwnershipTable = ({
  hyperboardId,
  showHeader = false,
  selectedRegistry,
  onSelectRegistry,
}: OwnershipTableProps) => {
  // TODO: Show blueprints in ownership table
  const { data } = useHyperboardOwnership(hyperboardId);
  const { data: hyperboardContentData } =
    useFetchHyperboardContents(hyperboardId);
  const [selectedClaim, setSelectedClaim] = useState<string>();
  const [selectedBlueprint, setSelectedBlueprint] = useState<number>();

  if (!data || !hyperboardContentData) {
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

    if (selectedRegistry) {
      const registry = hyperboardContentData.results.find(
        (registry) => registry.registry.id === selectedRegistry,
      );
      if (registry) {
        return {
          claimIds: Object.keys(registry.byClaim),
        };
      }
    }

    return {
      claimIds: [],
    };
  };

  const { claimIds } = getClaimIds();

  const indexOfSelectedRegistry = data.findIndex(
    (registry) => registry.hyperboardRegistry.registry_id === selectedRegistry,
  );

  const dataToShow = _.chain(hyperboardContentData.results)
    // Get all claims
    .map((registry) => registry.byClaim)
    // Filter out only for the selected claims
    .map((claimsById) =>
      _.pickBy(claimsById, (_, claimId) => claimIds.includes(claimId)),
    )
    // Create a flat list of all claims
    .flatMap((x) => Object.values(x))
    .flatMap((claim) => Object.values(claim))
    // Only show every owner once in the overview
    .groupBy((claim) => claim.displayData?.value)
    .mapValues((claims) => ({
      displayData: claims[0].displayData,
      total: claims.reduce((acc, x) => acc + x.totalValue, 0n),
    }))
    .values()
    // Sort by total ownership
    .sortBy((x) => -x.total)
    .value();

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
          {data.map((registry, index) => {
            const isRegistrySelected =
              !selectedClaim &&
              !selectedBlueprint &&
              selectedRegistry === registry.hyperboardRegistry.registry_id;
            const isFirstAfterSelected =
              indexOfSelectedRegistry !== -1 &&
              index === indexOfSelectedRegistry + 1;
            const isLastRegistry = index === data.length - 1;
            return (
              <div key={registry.hyperboardRegistry.registry_id}>
                <RegistryRow
                  isSelected={isRegistrySelected}
                  fadedBorder={isRegistrySelected}
                  text={registry.label || "No label"}
                  isFirstAfterSelected={isFirstAfterSelected}
                  percentage={100}
                  onClick={() => {
                    if (isRegistrySelected) {
                      onSelectRegistry?.(undefined);
                    } else {
                      setSelectedClaim(undefined);
                      setSelectedBlueprint(undefined);
                      onSelectRegistry?.(
                        registry.hyperboardRegistry.registry_id,
                      );
                    }
                  }}
                  icon={
                    <Image
                      alt={"Board icon"}
                      src={"/icons/board.svg"}
                      width={"24px"}
                    />
                  }
                />
                {selectedRegistry ===
                  registry.hyperboardRegistry.registry_id && (
                  <>
                    {registry.claims.map((claim, index) => {
                      const isClaimSelected = claim.claim.id === selectedClaim;
                      const isLastClaim =
                        !isLastRegistry && index === registry.claims.length - 1;
                      return (
                        <ClaimRow
                          key={claim.claim.id}
                          isSelected={isClaimSelected}
                          isLast={isLastClaim}
                          text={claim.metadata.name || "No name"}
                          percentage={(
                            (claim.claim.display_size /
                              registry.totalValueInRegistry) *
                            100
                          ).toPrecision(2)}
                          onClick={() => {
                            setSelectedBlueprint(undefined);
                            setSelectedClaim(claim.claim.id);
                          }}
                          icon={
                            <Image
                              alt={"Claim icon"}
                              src={"/icons/claim.svg"}
                              width={"12px"}
                            />
                          }
                        />
                      );
                    })}
                    {registry.blueprints.map((blueprint) => {
                      const isBlueprintSelected =
                        blueprint.id === selectedBlueprint;
                      return (
                        <ClaimRow
                          key={blueprint.id}
                          isSelected={isBlueprintSelected}
                          isLast={false}
                          text={
                            (
                              blueprint.form_values as unknown as {
                                name: string;
                              }
                            )?.name || "No name"
                          }
                          percentage={(
                            (blueprint.display_size /
                              registry.totalValueInRegistry) *
                            100
                          ).toPrecision(2)}
                          onClick={() => {
                            setSelectedClaim(undefined);
                            setSelectedBlueprint(blueprint.id);
                          }}
                          icon={
                            <BlueprintTooltip
                              width={"12p"}
                              alignItems={"center"}
                            />
                          }
                        />
                      );
                    })}
                  </>
                )}
              </div>
            );
          })}
        </Flex>
        <Flex
          flexBasis={["100%", "100%", "50%"]}
          flexDirection={"column"}
          border={"1px solid black"}
          borderLeft={"none"}
          overflowY={"auto"}
          className={"custom-scrollbar"}
        >
          <ClaimOwnershipOverview data={dataToShow} />
        </Flex>
      </Flex>
    </>
  );
};

interface SelectionRowProps {
  isSelected: boolean;
  text: string;
  percentage: number | string;
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

const ClaimRow = ({
  icon,
  isSelected,
  text,
  percentage,
  onClick,
  isLast,
}: SelectionRowProps & { isLast?: boolean }) => {
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
        borderRight={isSelected ? "none" : "1px solid black"}
        ml={"42px"}
        py={"14px"}
        pr={"20px"}
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
    displayData: Partial<DefaultSponsorMetadataEntity> & { value: string };
    total: bigint;
  }[];
}) => {
  const totalValueForAllFractions = data.reduce((acc, x) => acc + x.total, 0n);
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
        const percentage =
          Number((ownership.total * 10000n) / totalValueForAllFractions) / 100;
        return (
          <Flex key={ownership.displayData?.value} backgroundColor={"white"}>
            <Flex
              borderBottom={"1px solid rgba(0, 0, 0, 0.3)"}
              width={"100%"}
              justifyContent={"space-between"}
              mx={"20px"}
              py={1}
            >
              <Text>{formatMetadata(ownership.displayData)}</Text>
              <Text textStyle={"secondary"}>{percentage.toFixed(2)}%</Text>
            </Flex>
          </Flex>
        );
      })}
    </>
  );
};

const formatMetadata = (
  displayMetadata: Partial<DefaultSponsorMetadataEntity>,
) => {
  if (!displayMetadata) {
    return "Unknown";
  }
  const { companyName, type, firstName, lastName } = displayMetadata;

  if (type === "company") {
    return companyName;
  }

  return `${firstName} ${lastName}`;
};
