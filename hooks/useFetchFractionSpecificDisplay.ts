import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchFractionSpecificDisplay = (
  claimIds: string[],
  chainId: number,
) => {
  return useQuery({
    queryKey: ["fraction-specific-display", claimIds, chainId],
    queryFn: async () => {
      if (!claimIds.length) return null;
      return supabase
        .from("fraction_sponsor_metadata")
        .select("*")
        .in("hypercert_id", claimIds)
        .eq("chain_id", chainId)
        .throwOnError();
    },
    select: (data) => {
      return data?.data;
    },
  });
};
