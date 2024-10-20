import { useQuery } from "@tanstack/react-query";
import { Client } from "@urql/core";
import { graphql, readFragment } from "@/graphql";
import { urqlClient } from "@/hooks/urqlClient";
import { ResultOf } from "gql.tada";

export const HyperboardFragment = graphql(`
  fragment HyperboardFragment on Hyperboard {
    admins {
      address
      chain_id
    }
    name
    background_image
    grayscale_images
    tile_border_color
    chain_ids
    sections {
      count
      data {
        label
        collection {
          name
          admins {
            address
            display_name
          }
          description
          id
        }
        entries {
          is_blueprint
          id
          percentage_of_section
          display_size
          name
          total_units
          owners {
            percentage
            address
            units
            avatar
            display_name
          }
        }
        owners {
          percentage_owned
          address
          display_name
          avatar
        }
      }
    }
  }
`);

const query = graphql(
  `
    query Hyperboard($id: UUID!) {
      hyperboards(where: { id: { eq: $id } }) {
        data {
          ...HyperboardFragment
        }
      }
    }
  `,
  [HyperboardFragment],
);

export type HyperboardFragment = ResultOf<typeof HyperboardFragment>;

export const getHyperboard = async (hyperboard_id: string, client: Client) => {
  const { data, error } = await client.query(query, {
    id: hyperboard_id,
  });

  if (error) {
    throw new Error(error.message);
  }

  const hyperboard = data?.hyperboards?.data?.[0];

  return readFragment(HyperboardFragment, hyperboard);
};

export const useFetchHyperboardById = (hyperboardId: string) => {
  return useQuery({
    queryKey: ["hyperboard", "id", hyperboardId],
    queryFn: async () => {
      return await getHyperboard(hyperboardId, urqlClient);
    },
  });
};
