import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

import { ClaimToken } from "@hypercerts-org/sdk";
import _ from "lodash";
import { HyperboardEntry } from "@/types/Hyperboard";
import { client } from "@/lib/hypercert-client";

interface RegistryWithClaims {
  id: string;
  name: string;
  "hyperboard-claims": {
    id: string;
    hypercert_id: string;
  }[];
}

interface EntryDisplayData {
  image: string;
  address: string;
  type: "person" | "company" | "speaker";
  companyName?: string;
  firstName: string;
  lastName: string;
  name: string;
}

interface RegistryContentItem {
  fractions: Pick<
    ClaimToken,
    "id" | "chainName" | "owner" | "tokenID" | "units"
  >[];
  displayData: EntryDisplayData;
  totalValue: number;
}

export const useListRegistries = () => {
  return useQuery(["list-registries"], async () =>
    supabase.from("registries-optimism").select("*").neq("hidden", true),
  );
};

export const useRegistryContents = (registryId: string) => {
  return useQuery(["registry", registryId], async () => {
    return getRegistryWithClaims(registryId).then(async (registry) => {
      if (!registry?.data) {
        return null;
      }

      // Create one big list of all fractions, for all hypercerts in registry
      const allFractions = await Promise.all(
        registry.data["hyperboard-claims"].map((claim) => {
          return client.indexer.fractionsByClaim(claim.hypercert_id);
        }),
      );
      const fractions = _.chain(allFractions)
        .flatMap((res) => res.claimTokens)
        .value();

      // Get display data for all owners and convert to dictionary
      const ownerAddresses = _.uniq(fractions.map((x) => x.owner)) as string[];
      const claimDisplayDataResponse =
        await getEntryDisplayData(ownerAddresses);
      const claimDisplayData = _.keyBy(
        claimDisplayDataResponse?.data || [],
        (x) => x.address.toLowerCase(),
      );

      // Group by owner, merge with display data and calculate total value of all fractions per owner
      const content = _.chain(fractions)
        .groupBy((fraction) => fraction.owner)
        .mapValues((fractionsPerOwner, owner) => {
          return {
            fractions: fractionsPerOwner,
            displayData: claimDisplayData[owner],
            totalValue: _.sum(
              fractionsPerOwner.map((x) => parseInt(x.units, 10)),
            ),
          };
        })
        .value();

      return {
        registry: registry.data,
        content,
      };
    });
  });
};

const getRegistryWithClaims = async (registryId: string) =>
  supabase
    .from("registries-optimism")
    .select("*, hyperboard-claims ( * )")
    .eq("id", registryId)
    .single<RegistryWithClaims>();

const getEntryDisplayData = async (addresses: string[]) => {
  return supabase
    .from("hyperboard-sponsor-metadata")
    .select<"*", EntryDisplayData>("*")
    .in("address", addresses);
};

export const registryContentItemToHyperboardEntry = (
  item: RegistryContentItem,
): HyperboardEntry => {
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
