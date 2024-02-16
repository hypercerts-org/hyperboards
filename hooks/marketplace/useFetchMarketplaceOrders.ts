import { useQuery } from "@tanstack/react-query";
import { supabaseHypercerts } from "@/lib/supabase";

export const useFetchMarketplaceOrders = () => {
  return useQuery({
    queryKey: ["available-orders"],
    queryFn: async () => {
      return supabaseHypercerts.from("marketplace-orders").select("*");
    },
  });
};
