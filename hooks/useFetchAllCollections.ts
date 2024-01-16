import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useChainId } from "wagmi";

export const useFetchAllCollections = () => {
  const chainId = useChainId();
  return useQuery(
    ["collections", "all"],
    async () => {
      return supabase
        .from("registries")
        .select("*, claims(*)")
        .eq("chain_id", chainId);
    },
    {
      enabled: !!chainId,
    },
  );
};
