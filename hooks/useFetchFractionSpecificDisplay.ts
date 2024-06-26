import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useHypercertClient } from "@/components/providers";
import { CONSTANTS } from "@hypercerts-org/sdk";
import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { getHypercertWithMetadata } from "@/hooks/useFetchHypercertById";

export const useFetchFractionSpecificDisplay = (
  claimIds: string[],
  chainId?: number,
) => {
  const client = useHypercertClient();
  const urqlClient = new Client({
    url: `${CONSTANTS.ENDPOINTS["test"]}/v1/graphql`,
    exchanges: [cacheExchange, fetchExchange],
  });

  return useQuery({
    queryKey: ["fraction-specific-display", claimIds, chainId],
    queryFn: async () => {
      if (!claimIds.length) return null;

      if (!client) {
        throw new Error("Hypercert client not available");
      }

      if (!chainId) {
        throw new Error("Chain ID not available");
      }

      const metadata = await Promise.all(
        claimIds.map(async (claimId) => {
          return getHypercertWithMetadata(claimId, urqlClient);
        }),
      );

      const fractionSponsorMetadata = await supabase
        .from("fraction_sponsor_metadata")
        .select("*")
        .in("hypercert_id", claimIds)
        .eq("chain_id", chainId)
        .throwOnError();

      return fractionSponsorMetadata.data?.map((data) => {
        const metadataForClaim = metadata.find(
          (m) => m?.hypercert_id === data.hypercert_id,
        );

        return {
          ...data,
          metadata: metadataForClaim?.metadata,
        };
      });
    },
    enabled: !!chainId,
  });
};
