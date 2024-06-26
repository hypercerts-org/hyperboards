import { useQuery } from "@tanstack/react-query";
import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { CONSTANTS, parseClaimOrFractionId } from "@hypercerts-org/sdk";
import { graphql, readFragment } from "@/graphql";
import { getAddress } from "viem";

export const formatHypercertId = (hypercertId: string) => {
  const { id, contractAddress, chainId } = parseClaimOrFractionId(hypercertId);
  const formattedAddress = getAddress(contractAddress);
  const formattedId = `${chainId}-${formattedAddress}-${id}`;
  return formattedId;
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
      const urqlClient = new Client({
        url: `${CONSTANTS.ENDPOINTS["test"]}/v1/graphql`,
        exchanges: [cacheExchange, fetchExchange],
      });

      return await getHypercertWithMetadata(
        formatHypercertId(hypercertId),
        urqlClient,
      );
    },
  });
};
