import { useHypercertClient } from "@/components/providers";
import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export const useFetchHypercertFractionsByHypercertId = (
  hypercertId: string,
) => {
  const client = useHypercertClient();
  const chainId = useChainId();

  return useQuery(
    ["hypercert", "id", hypercertId, "chain", chainId, "fractions"],
    async () => {
      if (!client) {
        console.log("no client");
        return null;
      }

      if (!chainId) {
        console.log("no chainId");
        return null;
      }

      const fractions = await client.indexer.fractionsByClaim(hypercertId);
      return fractions.claimTokens;
    },
    {
      enabled: !!client && !!chainId,
    },
  );
};
