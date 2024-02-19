import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchFractionSpecificDisplay = (
  claimId: string,
  chainId: number,
) => {
  return useQuery({
    queryKey: ["fraction-specific-display", claimId, chainId],
    queryFn: async () => {
      if (!claimId) return null;
      return supabase
        .from("fraction_sponsor_metadata")
        .select("*")
        .eq("hypercert_id", claimId)
        .eq("chain_id", chainId)
        .throwOnError();
    },
    select: (data) => {
      return data?.data;
    },
  });
};
