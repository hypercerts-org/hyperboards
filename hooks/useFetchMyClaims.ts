import { useAddress } from "@/hooks/useAddress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchMyClaims = () => {
  const address = useAddress();

  return useQuery({
    queryKey: ["myClaims", address],
    queryFn: async () => {
      if (!address) {
        throw new Error("No address found");
      }
      return supabase.from("claims").select("*").eq("owner_id", address);
    },
    enabled: !!address,
  });
};
