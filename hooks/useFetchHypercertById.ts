import { useQuery } from "@tanstack/react-query";
import { Client } from "@urql/core";
import { parseClaimOrFractionId } from "@hypercerts-org/sdk";
import { graphql, readFragment } from "@/graphql";
import { getAddress } from "viem";
import { urqlClient } from "@/hooks/urqlClient";
import { ResultOf } from "gql.tada";

export const formatHypercertId = (hypercertId?: string) => {
  if (!hypercertId) {
    return undefined;
  }
  const { id, contractAddress, chainId } = parseClaimOrFractionId(hypercertId);
  const formattedAddress = getAddress(contractAddress);
  return `${chainId}-${formattedAddress}-${id}`;
};

const HypercertFragment = graphql(`
  fragment HypercertFragment on Hypercert {
    hypercert_id
    creator_address
    units
    uri
    metadata {
      name
      external_url
      description
      work_timeframe_to
      work_timeframe_from
      work_scope
      contributors
    }
  }
`);

const hypercertWithMetadataQuery = graphql(
  `
    query hypercertWithMetadata($hypercert_id: String!) {
      hypercerts(where: { hypercert_id: { eq: $hypercert_id } }) {
        data {
          ...HypercertFragment
        }
      }
    }
  `,
  [HypercertFragment],
);

export type HypercertFragment = ResultOf<typeof HypercertFragment>;

export const getHypercertWithMetadata = async (
  hypercert_id: string,
  client: Client,
) => {
  const { data, error } = await client.query(hypercertWithMetadataQuery, {
    hypercert_id,
  });

  if (error) {
    throw new Error(error.message);
  }

  const hypercert = data?.hypercerts?.data?.[0];

  return readFragment(HypercertFragment, hypercert);
};

export const useFetchHypercertById = (hypercertId: string) => {
  return useQuery({
    queryKey: ["hypercert", "id", formatHypercertId(hypercertId)],
    queryFn: async () => {
      const formattedHypercertId = formatHypercertId(hypercertId);
      if (!formattedHypercertId) {
        console.error("Invalid hypercertId", hypercertId);
        return null;
      }
      return await getHypercertWithMetadata(formattedHypercertId, urqlClient);
    },
  });
};
