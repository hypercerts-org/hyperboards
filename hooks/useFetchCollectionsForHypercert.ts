import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { sift } from "@/utils/sift";

export const useFetchCollectionsForHypercert = (hypercertId: string) => {
  return useQuery(["hypercert", "id", hypercertId, "collections"], async () => {
    const registriesResult = await supabase
      .from("claims")
      .select("*, registries (*, claims(count))")
      .eq("hypercert_id", hypercertId);
    const registries =
      registriesResult?.data?.map((claim) => claim.registries) || [];
    return sift(registries);
  });
};
