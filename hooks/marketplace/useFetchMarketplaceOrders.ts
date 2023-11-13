import { useQuery } from "@tanstack/react-query";
import { supabaseHypercerts } from "@/lib/supabase";

export const useFetchMarketplaceOrders = () => {
  return useQuery(["available-orders"], async () => {
    return supabaseHypercerts.from("marketplace-orders").select("*");
  });
};
