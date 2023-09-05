import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hypercert-client";

export const useStoreHypercerts = () => {
  return useQuery(["store-hypercerts"], async () => {
    return supabase
      .from("hypercerts-store")
      .select("*")
      .then(async (res) => {
        if (!res.data) {
          return;
        }

        const hypercerts = await Promise.all(
          res.data.map(({ claimId }) => client.indexer.claimById(claimId)),
        );

        return hypercerts;

        //   const hypercerts = await Promise.all(
        //     res.data.map(({ hypercertclient.indexer.claimById()
      });
  });
};
