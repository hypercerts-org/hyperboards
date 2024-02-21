import { useQuery } from "@tanstack/react-query";
import { supabase, supabaseHypercerts } from "@/lib/supabase";

import {
  Claim,
  ClaimTokensByClaimQuery,
  HypercertClient,
} from "@hypercerts-org/sdk";
import _ from "lodash";
import { HyperboardEntry } from "@/types/Hyperboard";
import { useHypercertClient } from "@/components/providers";
import { useToast } from "@chakra-ui/react";
import {
  AllowlistCacheEntity,
  BlueprintEntity,
  ClaimEntity,
  DefaultSponsorMetadataEntity,
  RegistryEntity,
} from "@/types/database-entities";
import { sift } from "@/utils/sift";
import { NUMBER_OF_UNITS_IN_HYPERCERT } from "@/config";
import { useChainId } from "wagmi";

export const useListRegistries = () => {
  return useQuery({
    queryKey: ["list-registries"],
    queryFn: async () => {
      return supabase.from("registries").select("*").neq("hidden", true);
    },
  });
};

const processRegistryForDisplay = async (
  {
    blueprints,
    ...registry
  }: RegistryEntity & {
    claims: ClaimEntity[];
    blueprints: BlueprintEntity[];
  },
  allowlistEntries: (AllowlistCacheEntity & {
    claim: Claim;
  })[],
  label: string | null,
  totalOfAllDisplaySizes: bigint,
  client: HypercertClient,
) => {
  // Fetch all fractions per all claims
  const claimsAndFractions = await Promise.all(
    registry.claims.map(async (claim) => {
      const fractions = (await client.indexer.fractionsByClaim(
        claim.hypercert_id,
      )) as ClaimTokensByClaimQuery;

      return {
        claim,
        fractions: fractions.claimTokens,
      };
    }),
  );

  // Calculate the total number of units in all claims, allowlistEntries and blueprints combined
  const totalUnitsInAllowlistEntries = allowlistEntries.reduce(
    (acc, entry) => acc + BigInt(entry.claim?.totalUnits || 0),
    0n,
  );
  const totalUnitsInBlueprints =
    BigInt(blueprints.length) * NUMBER_OF_UNITS_IN_HYPERCERT;
  const totalUnitsInClaims = claimsAndFractions
    .map((claim) => claim.fractions)
    .flat()
    .reduce((acc, fraction) => acc + BigInt(fraction.units || 0), 0n);
  const totalUnits =
    totalUnitsInClaims + totalUnitsInBlueprints + totalUnitsInAllowlistEntries;

  // Calculate the amount of surface per display size unit
  const displayPerUnit = (totalUnits * 10n ** 18n) / totalOfAllDisplaySizes;

  const fractionsResults = claimsAndFractions.map(({ claim, fractions }) => {
    // The total number of 'display units' available for this claim
    const totalDisplayUnitsForClaim =
      BigInt(claim.display_size) * displayPerUnit;

    // The total number of units in this claim
    const totalUnitsInClaim = fractions.reduce(
      (acc, curr) => acc + BigInt(curr.units),
      0n,
    );

    if (totalUnitsInClaim === 0n) {
      return [];
    }

    // Calculate the number of units per display unit
    const displayUnitsPerUnit = totalDisplayUnitsForClaim / totalUnitsInClaim;

    // Calculate the relative number of units per fraction
    return fractions.map((fraction) => ({
      id: fraction.id,
      owner: fraction.owner.toLowerCase(),
      unitsAdjustedForDisplaySize:
        (BigInt(fraction.units) * displayUnitsPerUnit) / 10n ** 14n,
      isBlueprint: false,
      claim,
    }));
  });

  const allowlistResults = allowlistEntries.map((entry) => {
    const totalDisplayUnitsForClaim = displayPerUnit;

    // Calculate the number of units per display unit
    const displayUnitsPerUnit =
      totalDisplayUnitsForClaim / BigInt(entry.claim.totalUnits);
    return {
      owner: entry.address?.toLowerCase(),
      unitsAdjustedForDisplaySize:
        (BigInt(entry.claim.totalUnits) * displayUnitsPerUnit) / 10n ** 14n,
      isBlueprint: true,
    };
  });

  const blueprintResults = blueprints.map((blueprint) => {
    const totalDisplayUnitsForClaim =
      BigInt(blueprint.display_size) * displayPerUnit;

    // The total number of units in this claim

    // Calculate the number of units per display unit
    const displayUnitsPerUnit =
      totalDisplayUnitsForClaim / NUMBER_OF_UNITS_IN_HYPERCERT;
    return {
      owner: blueprint.minter_address.toLowerCase(),
      unitsAdjustedForDisplaySize:
        (NUMBER_OF_UNITS_IN_HYPERCERT * displayUnitsPerUnit) / 10n ** 14n,
      isBlueprint: true,
    };
  });

  // Get a deduplicated list of all owners
  const fractions = fractionsResults.flat();
  const ownerAddresses = _.uniq([
    ...fractions.map((x) => x.owner),
    ...allowlistResults.map((x) => x.owner),
    blueprints.map((b) => b.minter_address.toLowerCase()),
  ]) as string[];

  // Fetch display data for all owners
  const claimDisplayDataResponse = await getEntriesDisplayData(ownerAddresses);
  const claimDisplayData = _.keyBy(claimDisplayDataResponse?.data || [], (x) =>
    x.address.toLowerCase(),
  );

  // Fetch fallback display data
  const fractionSpecificDisplayDataResponse = await getFractionsDisplayData(
    claimsAndFractions
      .map((x) => x.fractions)
      .flat()
      .map((x) => x.id),
    registry.chain_id,
  );

  // Filter out all fractions with fraction specific display data
  const [fractionsOwnedByCreatorWithFallback, regularFractions] = _.partition(
    fractions,
    (fraction) =>
      fraction.owner === fraction.claim?.owner_id &&
      !!fractionSpecificDisplayDataResponse.data?.find(
        (x) => x.fraction_id === fraction.id,
      ),
  );

  const fractionSpecificContent = _.chain(fractionsOwnedByCreatorWithFallback)
    .map((fraction) => ({
      ...fraction,
      displayData: fractionSpecificDisplayDataResponse.data?.find(
        (x) => x.fraction_id === fraction.id,
      ),
    }))
    .groupBy((fraction) => fraction.displayData!.value)
    .mapValues((fractionsPerOwner) => {
      return {
        fractions: fractionsPerOwner,
        displayData: fractionsPerOwner[0].displayData,
        isBlueprint: fractionsPerOwner.every((x) => x.isBlueprint),
        totalValue: fractionsPerOwner.reduce(
          (acc, curr) => acc + curr.unitsAdjustedForDisplaySize,
          0n,
        ),
      };
    })
    .value();

  // Group by owner, merge with display data and calculate total value of all fractions per owner
  const content = _.chain({
    ...regularFractions,
    ...blueprintResults,
    ...allowlistResults,
  })
    .groupBy((fraction) => fraction.owner)
    .mapValues((fractionsPerOwner, owner) => {
      return {
        fractions: fractionsPerOwner,
        displayData: claimDisplayData[owner],
        isBlueprint: fractionsPerOwner.every((x) => x.isBlueprint),
        totalValue: fractionsPerOwner.reduce(
          (acc, curr) => acc + curr.unitsAdjustedForDisplaySize,
          0n,
        ),
      };
    })
    .merge(fractionSpecificContent)
    .value();

  return {
    content,
    registry,
    label,
  };
};

export const useFetchHyperboardContents = (
  hyperboardId: string,
  options: { disableToast?: boolean } = { disableToast: false },
) => {
  const toast = useToast();
  const chainId = useChainId();
  const client = useHypercertClient();

  return useQuery({
    queryKey: ["hyperboard-contents", hyperboardId],
    queryFn: async () => {
      if (!client) {
        if (!options.disableToast) {
          toast({
            title: "Error",
            description: "No client found",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
        return null;
      }

      const { data: hyperboardData, error: hyperboardContentsError } =
        await supabase
          .from("hyperboards")
          .select(
            "*, hyperboard_registries ( *, registries ( *, claims ( * ), blueprints ( * ) ) )",
          )
          .eq("id", hyperboardId)
          .single();

      if (hyperboardContentsError) {
        if (!options.disableToast) {
          toast({
            title: "Error",
            description: hyperboardContentsError.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }

        throw hyperboardContentsError;
      }

      if (!hyperboardData?.hyperboard_registries) {
        return null;
      }

      const allClaimIds = sift(
        hyperboardData.hyperboard_registries
          .map((registry) => registry.registries?.claims)
          .flat()
          .map((claim) => claim?.hypercert_id),
      );
      const { data: allowlistData, error: allowlistError } =
        await supabaseHypercerts
          .from("allowlistCache-chainId")
          .select("*")
          .eq("chainId", chainId)
          .in("claimId", allClaimIds);

      if (allowlistError) {
        if (!options.disableToast) {
          toast({
            title: "Error",
            description: allowlistError.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }

      const allowlistEntriesWithClaims = sift(
        await Promise.all(
          allowlistData?.map(async (entry) => {
            const claim = await client.indexer.claimById(entry.claimId!);
            if (!claim.claim) {
              return null;
            }
            return { ...entry, claim: claim.claim };
          }) || [],
        ),
      );

      const totalOfAllDisplaySizes =
        _.sumBy(
          sift(
            hyperboardData.hyperboard_registries
              .map((registry) => registry.registries?.claims)
              .flat(),
          ),
          (x) => x.display_size,
        ) + allowlistEntriesWithClaims.length;

      const results = await Promise.all(
        hyperboardData.hyperboard_registries.map(async (registry) => {
          return await processRegistryForDisplay(
            registry.registries!,
            // @ts-ignore
            allowlistEntriesWithClaims || [],
            registry.label,
            BigInt(totalOfAllDisplaySizes),
            client,
          );
        }),
      );

      return {
        hyperboard: hyperboardData,
        results,
      };
    },
    enabled: !!hyperboardId && !!client,
    retry: false,
  });
};

export const getEntriesDisplayData = async (addresses: string[]) => {
  return supabase
    .from("default_sponsor_metadata")
    .select("*")
    .in("address", addresses);
};

export const getFractionsDisplayData = async (
  fractionIds: string[],
  chainId: number,
) => {
  return supabase
    .from("fraction_sponsor_metadata")
    .select("*")
    .in("fraction_id", fractionIds)
    .eq("chain_id", chainId);
};

export const registryContentItemToHyperboardEntry = ({
  isBlueprint,
  ...item
}: {
  displayData: DefaultSponsorMetadataEntity;
  isBlueprint: boolean;
  totalValue: bigint;
}): HyperboardEntry => {
  if (!item.displayData) {
    return {
      type: "person",
      companyName: null,
      lastName: null,
      firstName: null,
      image: "",
      value: item.totalValue,
      id: "",
      isBlueprint,
    };
  }
  return {
    type: item.displayData.type,
    companyName: item.displayData.companyName,
    lastName: item.displayData.lastName,
    firstName: item.displayData.firstName,
    image: item.displayData.image,
    value: item.totalValue,
    id: item.displayData.address,
    isBlueprint,
  };
};
