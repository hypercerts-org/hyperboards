import React, { useState } from "react";
import { Center, Flex, Icon, Image, Spinner, Text } from "@chakra-ui/react";
import { useHypercertClient } from "@/components/providers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { sift } from "@/utils/sift";
import _ from "lodash";

import "../../styles/scrollbar.module.css";
import { BiChevronRight } from "react-icons/bi";
import { getEntriesDisplayData } from "@/hooks/useFetchHyperboardContents";
import { DefaultSponsorMetadataEntity } from "@/types/database-entities";
import { BlueprintTooltip } from "@/components/blueprint-tooltip";
import { NUMBER_OF_UNITS_IN_HYPERCERT } from "@/config";

interface OwnershipTableProps {
  hyperboardId: string;
  showHeader?: boolean;
  selectedRegistry?: string;
  onSelectRegistry?: (registryId: string | undefined) => void;
}

const useHyperboardOwnership = (hyperboardId: string) => {
  const client = useHypercertClient();

  return useQuery(["hyperboard-ownership", hyperboardId], async () => {
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
  const [selectedClaim, setSelectedClaim] = useState<string>();
  const [selectedBlueprint, setSelectedBlueprint] = useState<number>();

  if (!data) {
    return null;
  }

  const getClaimIds = () => {
    if (selectedClaim) {
      return {
        claimIds: [selectedClaim],
        blueprintIds: [],
      };
    }

    if (selectedBlueprint) {
      return {
        claimIds: [],
        blueprintIds: [selectedBlueprint],
      };
    }

    if (selectedRegistry) {
      const registry = data.find(
        (registry) =>
          registry.hyperboardRegistry.registry_id === selectedRegistry,
      );
      if (registry) {
        return {
          claimIds: registry.claims.map((claim) => claim.claim.id),
          blueprintIds: registry.blueprints.map((blueprint) => blueprint.id),
        };
      }
    }

    return {
      claimIds: [],
      blueprintIds: [],
    };
  };

  const { claimIds, blueprintIds } = getClaimIds();

  const indexOfSelectedRegistry = data.findIndex(
    (registry) => registry.hyperboardRegistry.registry_id === selectedRegistry,
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
          <ClaimOwnershipOverview
            claimIds={claimIds}
            blueprintIds={blueprintIds}
          />
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

const useClaimOwnership = (claimIds: string[], blueprintIds: number[]) => {
  const client = useHypercertClient();

  return useQuery(["claim-ownership", claimIds, blueprintIds], async () => {
    if (!client) {
      return null;
    }

    const [{ data: blueprintData }, { data: claimsFromSupabase }] =
      await Promise.all([
        supabase.from("blueprints").select("*").in("id", blueprintIds),
        supabase
          .from("claims")
          .select("*")
          .in("hypercert_id", [...claimIds])
          .throwOnError(),
      ]);

    if (!claimsFromSupabase?.length && !blueprintData?.length) {
      return null;
    }

    const results = await Promise.all(
      claimIds.map(async (claimId) => {
        const claimFromSupabase = claimsFromSupabase?.find(
          (claim) => claim.hypercert_id === claimId,
        );
        if (!claimFromSupabase) {
          throw new Error("Claim not found");
        }
        const fractions = await client.indexer.fractionsByClaim(claimId);

        return {
          claim: claimFromSupabase,
          fractions: fractions.claimTokens,
        };
      }),
    );
    const allFractions = results.flatMap((x) => x.fractions);
    const allOwnerIds = _.uniq([
      ...allFractions.map((fraction) => fraction.owner),
      ...(blueprintData || []).map((blueprint) => blueprint.minter_address),
    ]);

    const totalOfAllDisplaySizes = BigInt(
      _.sum([
        ...(claimsFromSupabase || [])?.map((claim) => claim.display_size),
        ...(blueprintData || [])?.map((blueprint) => blueprint.display_size),
      ]),
    );
    const totalUnitsInAllClaims =
      allFractions.reduce(
        (acc, fraction) => acc + BigInt(fraction.units || 0),
        0n,
      ) +
      BigInt(blueprintData?.length || 0) * NUMBER_OF_UNITS_IN_HYPERCERT;

    // Calculate the amount of surface per display size unit
    const displayPerUnit =
      (totalUnitsInAllClaims * 10n ** 18n) / totalOfAllDisplaySizes;

    const ownerMetadata = await getEntriesDisplayData(allOwnerIds);
    const metadataByAddress = _.keyBy(ownerMetadata.data, (metadata) =>
      metadata.address.toLowerCase(),
    );

    const fractionsResults = results.map(({ claim, fractions }) => {
      // The total number of 'display units' available for this claim
      const totalDisplayUnitsForClaim =
        BigInt(claim.display_size) * displayPerUnit;

      // The total number of units in this claim
      const totalUnitsInClaim = fractions.reduce(
        // @ts-ignore
        (acc, curr) => acc + BigInt(curr.units),
        0n,
      );

      // Calculate the number of units per display unit
      const displayUnitsPerUnit = totalDisplayUnitsForClaim / totalUnitsInClaim;

      // Calculate the relative number of units per fraction
      // @ts-ignore
      const newFractions = fractions.map((fraction) => ({
        ...fraction,
        unitsAdjustedForDisplaySize:
          (BigInt(fraction.units) * displayUnitsPerUnit) / 10n ** 14n,
      }));

      return {
        claim,
        fractions: newFractions,
      };
    });

    const blueprintsResults =
      blueprintData?.map((blueprint) => {
        const totalDisplayUnitsForBlueprint =
          BigInt(blueprint.display_size) * displayPerUnit;

        return {
          claim: {
            owner_id: blueprint.minter_address,
            display_size: blueprint.display_size,
          },
          fractions: [
            {
              unitsAdjustedForDisplaySize:
                totalDisplayUnitsForBlueprint / 10n ** 14n,
            },
          ],
        };
      }) || [];

    const data = _.chain([...fractionsResults, ...blueprintsResults])
      .groupBy((x) => x.claim.owner_id.toLowerCase())
      .mapValues((value, key) => ({
        total: value
          .flatMap((x) =>
            // @ts-ignore
            x.fractions.map((fraction) => fraction.unitsAdjustedForDisplaySize),
          )
          .reduce((acc, curr) => acc + curr, 0n),
        metadata: metadataByAddress[key],
      }))
      .sortBy((x) => x.total)
      .reverse()
      .toArray()
      .value();

    return {
      data,
      totalValueForAllFractions: data.reduce((acc, x) => acc + x.total, 0n),
    };
  });
};

const ClaimOwnershipOverview = ({
  claimIds,
  blueprintIds,
}: {
  claimIds: string[];
  blueprintIds: number[];
}) => {
  const { data, isLoading } = useClaimOwnership(claimIds, blueprintIds);

  if (data?.data.length === 0) {
    return (
      <Center height={"100%"} width={"100%"}>
        Select board to see ownership stats
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center height={"100%"} width={"100%"}>
        <Spinner />
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
      {data.data.map((ownership) => {
        const percentage =
          Number((ownership.total * 10000n) / data.totalValueForAllFractions) /
          100;
        return (
          <Flex key={ownership.metadata?.address} backgroundColor={"white"}>
            <Flex
              borderBottom={"1px solid rgba(0, 0, 0, 0.3)"}
              width={"100%"}
              justifyContent={"space-between"}
              mx={"20px"}
              py={1}
            >
              <Text>{formatMetadata(ownership.metadata)}</Text>
              <Text textStyle={"secondary"}>{percentage.toFixed(2)}%</Text>
            </Flex>
          </Flex>
        );
      })}
    </>
  );
};

const formatMetadata = (
  displayMetadata: DefaultSponsorMetadataEntity | null,
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
