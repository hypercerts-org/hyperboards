import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Claim } from "@hypercerts-org/sdk";
import { createPublicClient, getContract, http } from "viem";
import { goerli } from "viem/chains";
import { TRADER_CONTRACT } from "@/config";
import IHypercertTrader from "@/abi/IHypercertTrader.json";
import { useHypercertClient } from "@/components/providers";

export interface OfferFromContract {
  id: string;
  maxUnitsPerTrade: bigint;
  minUnitsPerTrade: bigint;
  status: 0 | 1;
  unitsAvailable: bigint;
  acceptedTokens: {
    token: string;
    minimumAmountPerUnit: bigint;
  }[];
  fractionID: bigint;
}

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
  const client = useHypercertClient();

  return useQuery(
    ["store-hypercerts"],
    async () => {
      if (!client) {
        return null;
      }
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

      const offersFromContract = await getOfferPrices(
        offers.map((offer) => parseInt(offer.id.split("-")[1], 10)),
      );

      return supabase
        .from("hypercerts-store")
        .select("*")
        .neq("hidden", true)
        .then(async (res) => {
          if (!res.data) {
            return;
          }

          return await Promise.all(
            res.data
              .filter((x) => x.claimId !== null)
              .map(async ({ claimId }) => {
                const [claim, fractions] = await Promise.all([
                  client.indexer.claimById(claimId!).then(async (res) => {
                    const metadata = await client.storage.getMetadata(
                      res.claim?.uri || "",
                    );
                    return {
                      claim: res.claim,
                      metadata,
                    };
                  }),
                  client.indexer
                    .fractionsByClaim(claimId!)
                    .then((res) => res.claimTokens),
                ]);

                return {
                  ...claim,
                  fractions,
                  offer: offers.find(
                    (offer) => offer.fractionID.claim.id === claimId,
                  ),
                  offerFromContract: offersFromContract.find((offer) =>
                    fractions
                      .map((fraction) =>
                        BigInt((fraction.id as string).split("-")[1]),
                      )
                      .includes(offer.fractionID),
                  ),
                };
              }),
          );
        });
    },
    {
      enabled: !!client,
    },
  );
};

const getOfferPrices = async (offerIds: number[]) => {
  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
    batch: {
      multicall: true,
    },
  });

  const contract = getContract({
    address: TRADER_CONTRACT,
    abi: IHypercertTrader,
    publicClient,
  });

  return Promise.all(
    offerIds.map(
      (offerId) =>
        contract.read.getOffer([offerId]) as Promise<OfferFromContract>,
    ),
  );
};
