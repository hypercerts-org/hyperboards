import { useAddress } from "@/hooks/useAddress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useMyRegistries = () => {
  const address = useAddress();

  return useQuery(
    ["myRegistries", address],
    async () => {
      if (!address) {
        throw new Error("No address found");
      }
      return supabase
        .from("registries")
        .select("*, claims ( * )")
        .eq("admin_id", address);
    },
    {
      enabled: !!address,
    },
  );
};
