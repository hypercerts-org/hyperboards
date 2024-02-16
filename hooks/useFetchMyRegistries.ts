import { useAddress } from "@/hooks/useAddress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchMyRegistries = () => {
  const address = useAddress();

  return useQuery({
    queryKey: ["myRegistries", address],
    queryFn: async () => {
      if (!address) {
        throw new Error("No address found");
      }
      return supabase
        .from("registries")
        .select("*, claims ( * ), blueprints ( * )")
        .eq("admin_id", address);
    },
    enabled: !!address,
  });
};
