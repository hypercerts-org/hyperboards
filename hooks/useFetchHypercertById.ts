import { useHypercertClient } from "@/components/providers";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import { ClaimByIdQuery } from "@hypercerts-org/sdk";

export const useFetchHypercertById = (hypercertId: string) => {
  const client = useHypercertClient();
  const chainId = useChainId();

  return useQuery(
    ["hypercert", "id", hypercertId, "chain", chainId],
    async () => {
      if (!client) {
        console.log("no client");
        return null;
      }

      if (!chainId) {
        console.log("no chainId");
        return null;
      }

      const claim = (await client.indexer.claimById(
        hypercertId,
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
    },
    {
      enabled: !!client && !!chainId,
    },
  );
};
