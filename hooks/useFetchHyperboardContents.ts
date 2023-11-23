import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

import { HypercertClient } from "@hypercerts-org/sdk";
import _ from "lodash";
import { HyperboardEntry } from "@/types/Hyperboard";
import { useHypercertClient } from "@/components/providers";
import { useToast } from "@chakra-ui/react";
import {
  ClaimEntity,
  DefaultSponsorMetadataEntity,
  RegistryEntity,
} from "@/types/database-entities";
import { sift } from "@/utils/sift";

export const useListRegistries = () => {
  return useQuery(["list-registries"], async () =>
    supabase.from("registries").select("*").neq("hidden", true),
  );
};

const processRegistryForDisplay = async (
  registry: RegistryEntity & { claims: ClaimEntity[] },
  label: string | null,
  totalOfAllDisplaySizes: bigint,
  client: HypercertClient,
) => {
  // Fetch all fractions per all claims
  const claimsAndFractions = await Promise.all(
    registry.claims.map(async (claim) => {
      const fractions = await client.indexer.fractionsByClaim(
        claim.hypercert_id,
      );

      return {
        claim,
        fractions: fractions.claimTokens,
      };
    }),
  );

  // Calculate the total number of units in all claims
  const totalUnitsInAllClaims = claimsAndFractions
    .map((claim) => claim.fractions)
    .flat()
    .reduce((acc, fraction) => acc + BigInt(fraction.units || 0), 0n);

  // Calculate the amount of surface per display size unit
  const displayPerUnit =
    (totalUnitsInAllClaims * 10n ** 18n) / totalOfAllDisplaySizes;

  const fractionsResults = claimsAndFractions.map(({ claim, fractions }) => {
    // The total number of 'display units' available for this claim
    const totalDisplayUnitsForClaim =
      BigInt(claim.display_size) * displayPerUnit;

    // The total number of units in this claim
    const totalUnitsInClaim = fractions.reduce(
      (acc, curr) => acc + BigInt(curr.units),
      0n,
    );

    // Calculate the number of units per display unit
    const displayUnitsPerUnit = totalDisplayUnitsForClaim / totalUnitsInClaim;

    // Calculate the relative number of units per fraction
    return fractions.map((fraction) => ({
      ...fraction,
      unitsAdjustedForDisplaySize:
        (BigInt(fraction.units) * displayUnitsPerUnit) / 10n ** 14n,
    }));
  });

  // Get a deduplicated list of all owners
  const fractions = fractionsResults.flat();
  const ownerAddresses = _.uniq(fractions.map((x) => x.owner)) as string[];

  // Fetch display data for all owners
  const claimDisplayDataResponse = await getEntriesDisplayData(ownerAddresses);
  const claimDisplayData = _.keyBy(claimDisplayDataResponse?.data || [], (x) =>
    x.address.toLowerCase(),
  );

  // Group by owner, merge with display data and calculate total value of all fractions per owner
  const content = _.chain(fractions)
    .groupBy((fraction) => fraction.owner)
    .mapValues((fractionsPerOwner, owner) => {
      return {
        fractions: fractionsPerOwner,
        displayData: claimDisplayData[owner],
        totalValue: fractionsPerOwner.reduce(
          (acc, curr) => acc + curr.unitsAdjustedForDisplaySize,
          0n,
        ),
      };
    })
    .value();

  return {
    content,
    registry,
    label,
  };
};

export const useFetchHyperboardContents = (hyperboardId: string) => {
  const toast = useToast();
  const client = useHypercertClient();

  return useQuery(
    ["hyperboard-contents", hyperboardId],
    async () => {
      if (!client) {
        toast({
          title: "Error",
          description: "No client found",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return null;
      }

      const { data: hyperboardData, error: hyperboardContentsError } =
        await supabase
          .from("hyperboards")
          .select(
            "*, hyperboard_registries ( *, registries ( *, claims ( * ) ) )",
          )
          .eq("id", hyperboardId)
          .single();

      if (hyperboardContentsError) {
        toast({
          title: "Error",
          description: hyperboardContentsError.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }

      if (!hyperboardData?.hyperboard_registries) {
        return null;
      }

      const totalOfAllDisplaySizes = _.sumBy(
        sift(
          hyperboardData.hyperboard_registries
            .map((registry) => registry.registries?.claims)
            .flat(),
        ),
        (x) => x.display_size,
      );

      const results = await Promise.all(
        hyperboardData.hyperboard_registries.map(async (registry) => {
          return await processRegistryForDisplay(
            registry.registries!,
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
    {
      enabled: !!hyperboardId && !!client,
    },
  );
};

export const getEntriesDisplayData = async (addresses: string[]) => {
  return supabase
    .from("default_sponsor_metadata")
    .select("*")
    .in("address", addresses);
};

export const registryContentItemToHyperboardEntry = (item: {
  displayData: DefaultSponsorMetadataEntity;
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
  };
};
