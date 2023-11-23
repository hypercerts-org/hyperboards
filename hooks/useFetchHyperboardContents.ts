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

// interface EntryDisplayData {
//   image: string;
//   address: string;
//   type: "person" | "company" | "speaker";
//   companyName?: string;
//   firstName: string;
//   lastName: string;
//   name: string;
// }

// interface RegistryContentItem {
//   fractions: Pick<
//     ClaimToken,
//     "id" | "chainName" | "owner" | "tokenID" | "units"
//   >[];
//   displayData: EntryDisplayData;
//   totalValue: number;
// }

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
  const allClaims = await Promise.all(
    registry.claims.map(async (claim) => {
      const claimData = await client.indexer.claimById(claim.hypercert_id);
      return {
        claim,
        claimData: claimData.claim,
      };
    }),
  );

  const totalUnitsInAllClaims =
    allClaims.reduce(
      (acc, curr) => acc + BigInt(curr.claimData?.totalUnits || 0),
      0n,
    ) *
    10n ** 18n;

  // Calculate the amount of surface per display size unit
  const displayPerUnit = totalUnitsInAllClaims / totalOfAllDisplaySizes;

  const fractionsResults = await Promise.all(
    registry.claims.map(async (claim) => {
      // The total number of 'display units' available for this claim
      const totalDisplayUnitsForClaim =
        BigInt(claim.display_size) * displayPerUnit;

      // Fetch all fractions for claim and calculate the total number of units
      const fractions = await client.indexer.fractionsByClaim(
        claim.hypercert_id,
      );
      const totalUnitsInClaim = fractions.claimTokens.reduce(
        (acc, curr) => acc + BigInt(curr.units),
        0n,
      );

      // Calculate the number of units per display unit
      const displayUnitsPerUnit = totalDisplayUnitsForClaim / totalUnitsInClaim;
      return fractions.claimTokens.map((fraction) => ({
        ...fraction,
        unitsAdjustedForDisplaySize:
          (BigInt(fraction.units) * displayUnitsPerUnit) / 10n ** 14n,
      }));
    }),
  );

  const fractions = _.flatMap(fractionsResults, (x) => x);
  const ownerAddresses = _.uniq(fractions.map((x) => x.owner)) as string[];

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
