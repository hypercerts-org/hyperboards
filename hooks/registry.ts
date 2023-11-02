import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

import { ClaimToken } from "@hypercerts-org/sdk";
import _ from "lodash";
import { HyperboardEntry } from "@/types/Hyperboard";
import { useHypercertClient } from "@/components/providers";
import { useToast } from "@chakra-ui/react";
import { DefaultSponsorMetadataEntity } from "@/types/database-entities";

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
    supabase.from("registries").select("*").neq("hidden", true),
  );
};

export const useHyperboardContents = (hyperboardId: string) => {
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

      // Create one big list of all fractions, for all hypercerts in registry
      const claimIds = _.flatMap(
        hyperboardData?.hyperboard_registries,
        (x) => x.registries?.claims.map((y) => y.hypercert_id),
      ).filter((x) => !!x) as string[];

      // Get display data for all owners and convert to dictionary
      const allFractions = await Promise.all(
        claimIds.map((claimId) => {
          return client.indexer.fractionsByClaim(claimId);
        }),
      );

      const fractions = _.chain(allFractions)
        .flatMap((res) => res.claimTokens)
        .value();
      const ownerAddresses = _.uniq(fractions.map((x) => x.owner)) as string[];
      console.log("ownerAddresses", ownerAddresses);
      const claimDisplayDataResponse =
        await getEntryDisplayData(ownerAddresses);
      const claimDisplayData = _.keyBy(
        claimDisplayDataResponse?.data || [],
        (x) => x.address.toLowerCase(),
      );

      console.log("claimDisplayData", claimDisplayData);

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
        content,
        hyperboard: hyperboardData,
      };
    },
    {
      enabled: !!hyperboardId && !!client,
    },
  );
};

const getEntryDisplayData = async (addresses: string[]) => {
  return supabase
    .from("default_sponsor_metadata")
    .select("*")
    .in("address", addresses);
};

export const registryContentItemToHyperboardEntry = (item: {
  displayData: DefaultSponsorMetadataEntity;
  totalValue: number;
}): HyperboardEntry => {
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
