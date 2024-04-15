import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useChainId } from "wagmi";

export const useFetchAllCollections = () => {
  const chainId = useChainId();
  return useQuery({
    queryKey: ["collections", "all"],
    queryFn: async () => {
      return supabase.from("registries").select("*, claims(*)");
    },
    enabled: !!chainId,
  });
};
