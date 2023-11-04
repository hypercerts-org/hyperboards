import React, { useState } from "react";
import { Center, Flex, Icon, Image, Spinner, Text } from "@chakra-ui/react";
import { useHypercertClient } from "@/components/providers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { sift } from "@/utils/sift";
import _ from "lodash";

import "../../styles/scrollbar.module.css";
import { BiChevronRight } from "react-icons/bi";
import { getEntriesDisplayData } from "@/hooks/registry";
import { DefaultSponsorMetadataEntity } from "@/types/database-entities";

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
      .select("*, hyperboard_registries ( *, registries ( *, claims ( * ) ) )")
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
                claim: claimResult.claim,
                metadata,
              };
            }
            return null;
          }),
        );

        const totalValueInRegistry = _.sum(
          sift(claims).map((claim) => parseInt(claim.claim.totalUnits, 10)),
        );

        return {
          label: hyperboardRegistry.label,
          totalValueInRegistry,
          claims: sift(claims),
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
  // const data = [];
  const { data } = useHyperboardOwnership(hyperboardId);
  const [selectedClaim, setSelectedClaim] = useState<string>();

  if (!data) {
    return null;
  }

  const getClaimIds = () => {
    if (selectedClaim) {
      return [selectedClaim];
    }

    if (selectedRegistry) {
      const registry = data.find(
        (registry) =>
          registry.hyperboardRegistry.registry_id === selectedRegistry,
      );
      if (registry) {
        return registry.claims.map((claim) => claim.claim.id);
      }
    }

    return [];
  };

  const claimIds = getClaimIds();

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
            hyperboard ownership
          </Text>
        </Center>
      )}
      <Flex width={"100%"} height={"360px"}>
        <Flex
          flexBasis={"50%"}
          flexDirection={"column"}
          border={"1px solid black"}
          borderRight={"none"}
          overflowY={"auto"}
        >
          {data.map((registry, index) => {
            const isRegistrySelected =
              !selectedClaim &&
              selectedRegistry === registry.hyperboardRegistry.registry_id;
            const isFirstAfterSelected = index === indexOfSelectedRegistry + 1;
            return (
              <>
                <RegistryRow
                  key={registry.hyperboardRegistry.registry_id}
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
                {selectedRegistry === registry.hyperboardRegistry.registry_id &&
                  registry.claims.map((claim, index) => {
                    const isClaimSelected = claim.claim.id === selectedClaim;
                    const isLastClaim = index === registry.claims.length - 1;
                    return (
                      <ClaimRow
                        key={claim.claim.id}
                        isSelected={isClaimSelected}
                        isLast={isLastClaim}
                        text={claim.metadata.name || "No name"}
                        percentage={(
                          (parseInt(claim.claim.totalUnits, 10) /
                            registry.totalValueInRegistry) *
                          100
                        ).toPrecision(2)}
                        onClick={() => {
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
              </>
            );
          })}
        </Flex>
        <Flex
          flexBasis={"50%"}
          flexDirection={"column"}
          border={"1px solid black"}
          borderLeft={"none"}
          overflowY={"auto"}
        >
          <ClaimOwnershipOverview claimIds={claimIds} />
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
      onClick={onClick}
      pl={"20px"}
      backgroundColor={isSelected ? "white" : undefined}
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
      onClick={onClick}
      pl={"20px"}
      backgroundColor={isSelected ? "white" : undefined}
    >
      <Flex
        width={"100%"}
        borderBottom={!isLast ? "1px solid rgba(0, 0, 0, 0.3)" : "none"}
        borderRight={isSelected ? "none" : "2px solid black"}
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

const useClaimOwnership = (claimIds: string[]) => {
  const client = useHypercertClient();

  return useQuery(["claim-ownership", claimIds], async () => {
    if (!client) {
      return null;
    }

    const results = await Promise.all(
      claimIds.map(async (claimId) => {
        const fractions = await client.indexer.fractionsByClaim(claimId);

        return fractions.claimTokens;
      }),
    );

    const allFractions = results.flat();
    const allOwnerIds = _.uniq(allFractions.map((fraction) => fraction.owner));

    const ownerMetadata = await getEntriesDisplayData(allOwnerIds);

    const metadataByAddress = _.keyBy(ownerMetadata.data, (metadata) =>
      metadata.address.toLowerCase(),
    );

    const totalValueForAllFractions = _.sum(
      allFractions.map((fraction) => parseInt(fraction.units, 10)),
    );

    const data = _.chain(allFractions)
      .groupBy((x) => x.owner)
      .mapValues((value, key) => ({
        total: _.sum(value.map((x) => parseInt(x.units, 10))),
        metadata: metadataByAddress[key],
      }))
      .sortBy((x) => x.total)
      .reverse()
      .toArray()
      .value();

    return {
      data,
      totalValueForAllFractions,
    };
  });
};

const ClaimOwnershipOverview = ({ claimIds }: { claimIds: string[] }) => {
  const { data, isLoading } = useClaimOwnership(claimIds);

  if (isLoading) {
    return (
      <Center height={"100%"} width={"100%"}>
        <Spinner />
      </Center>
    );
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <>
      {data.data.map((ownership) => {
        const percentage =
          (ownership.total / data.totalValueForAllFractions) * 100;
        return (
          <Flex key={ownership.metadata?.id} backgroundColor={"white"}>
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
