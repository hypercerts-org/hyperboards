import { useHypercertClient } from "@/components/providers";
import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { CONSTANTS } from "@hypercerts-org/sdk";
import { graphql, readFragment } from "@/graphql";
import { ResultOf } from "gql.tada";
import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { formatHypercertId } from "@/hooks/useFetchHypercertById";

export const FractionStateFragment = graphql(`
  fragment FractionStateFragment on Fraction {
    creation_block_number
    creation_block_timestamp
    fraction_id
    hypercert_id
    last_update_block_number
    last_update_block_timestamp
    owner_address
    units
  }
`);

export type FractionStateFragment = ResultOf<typeof FractionStateFragment>;

const query = graphql(
  `
    query Fraction($hypercert_id: String!) {
      fractions(where: { hypercert_id: { eq: $hypercert_id } }, count: COUNT) {
        count
        data {
          ...FractionStateFragment
        }
      }
    }
  `,
  [FractionStateFragment],
);

export async function getFractionsByHypercert(
  hypercertId: string,
  client: Client,
) {
  const res = await client.query(query, {
    hypercert_id: formatHypercertId(hypercertId),
  });

  if (!res.data?.fractions?.data) {
    return undefined;
  }

  const processedFragments = res.data.fractions.data.map((fraction) => {
    return readFragment(FractionStateFragment, fraction);
  });

  return {
    count: res.data.fractions.count,
    data: processedFragments,
  };
}

export const useFetchHypercertFractionsByHypercertId = (
  hypercertId: string,
) => {
  const client = useHypercertClient();
  const chainId = useChainId();
  const urqlClient = new Client({
    url: `${CONSTANTS.ENDPOINTS["test"]}/v1/graphql`,
    exchanges: [cacheExchange, fetchExchange],
  });

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

      const fractions = await getFractionsByHypercert(hypercertId, urqlClient);

      const totalUnitsForAllFractions =
        fractions?.data.reduce(
          (acc, cur) => acc + BigInt(cur?.units || 0),
          0n,
        ) || 1n;
      return fractions?.data.map((fraction) => ({
        ...fraction,
        percentage: Number(
          (BigInt(fraction.units || 0) * 100n) / totalUnitsForAllFractions,
        ),
      }));
    },
    enabled: !!client && !!chainId,
  });
};

export const useFetchHypercertFractionsByHypercertIds = (
  hypercertIds: string[],
) => {
  const client = useHypercertClient();
  const chainId = useChainId();
  const urqlClient = new Client({
    url: `${CONSTANTS.ENDPOINTS["test"]}/v1/graphql`,
    exchanges: [cacheExchange, fetchExchange],
  });

  return useQuery({
    queryKey: ["hypercert", "ids", hypercertIds, "chain", chainId, "fractions"],
    queryFn: async () => {
      if (!client) {
        console.log("no client");
        return null;
      }

      if (!chainId) {
        console.log("no chainId");
        return null;
      }

      return Promise.all(
        hypercertIds.map(async (hypercertId) => {
          const fractions = await getFractionsByHypercert(
            hypercertId,
            urqlClient,
          );

          const totalUnitsForAllFractions =
            fractions?.data.reduce(
              (acc, cur) => acc + BigInt(cur?.units || 0),
              0n,
            ) || 1n;
          return fractions?.data.map((fraction) => ({
            ...fraction,
            percentage: Number(
              (BigInt(fraction.units || 0) * 100n) / totalUnitsForAllFractions,
            ),
          }));
        }),
      );
    },
    enabled: !!client && !!chainId,
    select: (data) => {
      return data?.flat();
    },
  });
};
