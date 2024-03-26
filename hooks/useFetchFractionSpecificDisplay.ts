import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useHypercertClient } from "@/components/providers";
import { ClaimByIdQuery } from "@hypercerts-org/sdk";

export const useFetchFractionSpecificDisplay = (
  claimIds: string[],
  chainId?: number,
) => {
  const client = useHypercertClient();

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
          const claim = (await client.indexer.claimById(
            `${chainId}-${claimId}`,
          )) as ClaimByIdQuery;

          if (!claim?.claim?.uri) {
            console.log("no claim");
            return null;
          }

          const metadata = await client.storage.getMetadata(claim.claim.uri);

          return {
            ...claim.claim,
            metadata,
          };
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
          (m) => m?.id === data.hypercert_id,
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
