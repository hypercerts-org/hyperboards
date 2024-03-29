import { useAddress } from "@/hooks/useAddress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchMyHyperboards = () => {
  const address = useAddress();

  return useQuery({
    queryKey: ["myHyperboards", address],
    queryFn: async () => {
      if (!address) {
        throw new Error("No address found");
      }
      return supabase
        .from("hyperboards")
        .select("*, hyperboard_registries!hyperboard_id (*, registries (*))")
        .eq("admin_id", address);
    },
    enabled: !!address,
  });
};
