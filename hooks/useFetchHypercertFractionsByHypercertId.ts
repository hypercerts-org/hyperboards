import { useHypercertClient } from "@/components/providers";
import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { ClaimTokensByClaimQuery } from "@hypercerts-org/sdk";

export const useFetchHypercertFractionsByHypercertId = (
  hypercertId: string,
) => {
  const client = useHypercertClient();
  const chainId = useChainId();

  return useQuery({
    queryKey: ["hypercert", "id", hypercertId, "chain", chainId, "fractions"],
    queryFn: async () => {
      if (!client) {
        console.log("no client");
        return null;
      }

      if (!chainId) {
        console.log("no chainId");
        return null;
      }

      const fractions = (await client.indexer.fractionsByClaim(
        hypercertId,
      )) as ClaimTokensByClaimQuery;
      const totalUnitsForAllFractions = fractions.claimTokens.reduce(
        (acc, cur) => acc + BigInt(cur.units),
        0n,
      );
      return fractions.claimTokens.map((fraction) => ({
        ...fraction,
        percentage: Number(
          (BigInt(fraction.units) * 100n) / totalUnitsForAllFractions,
        ),
      }));
    },
    enabled: !!client && !!chainId,
  });
};
