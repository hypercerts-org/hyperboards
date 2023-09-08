import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hypercert-client";
import { Claim } from "@hypercerts-org/sdk";

export interface Offer {
  id: string;
  maxUnitsPerTrade: string;
  minUnitsPerTrade: string;
  status: "Open" | "Closed";
  unitsAvailable: string;
  acceptedTokens: {
    accepted: true;
    id: string;
    minimumAmountPerUnit: string;
  }[];
  fractionID: {
    id: string;
    owner: string;
    tokenID: string;
    units: string;
    claim: Claim;
  };
}

const offersQuery = `
{
  offers {
    id
    maxUnitsPerTrade
    minUnitsPerTrade
    status
    unitsAvailable
    acceptedTokens {
      accepted
      id
      minimumAmountPerUnit
    }
    fractionID {
      id
      owner
      tokenID
      units
      claim {
        creation
        contract
        creator
        id
        owner
        tokenID
        totalUnits
        uri
      }
    }
  }
}
`;

export const useStoreHypercerts = () => {
  return useQuery(["store-hypercerts"], async () => {
    const offers = await fetch(
      "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet",
      {
        method: "POST",
        body: JSON.stringify({
          query: offersQuery,
        }),
      },
    )
      .then((res) => res.json())
      .then((res) => res.data.offers as Offer[]);

    return supabase
      .from("hypercerts-store")
      .select("*")
      .then(async (res) => {
        if (!res.data) {
          return;
        }

        return await Promise.all(
          res.data
            .filter((x) => x.claimId)
            .map(({ claimId }) =>
              client.indexer.claimById(claimId!).then(async (res) => {
                // const metadata = await fetch(
                //   `https://ipfs.io/ipfs/${res.claim?.uri}`,
                // ).then((res) => res.json());
                const metadata = await client.storage.getMetadata(
                  res.claim?.uri || "",
                );
                return {
                  claim: res.claim,
                  metadata,
                  offer: offers.find(
                    (x) => x.fractionID?.claim?.id === claimId,
                  ),
                };
              }),
            ),
        );
      });
  });
};
