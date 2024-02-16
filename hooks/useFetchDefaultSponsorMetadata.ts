import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchDefaultSponsorMetadata = () => {
  return useQuery({
    queryKey: ["default-sponsor-metadata"],
    queryFn: async () => {
      return supabase.from("default_sponsor_metadata").select("*");
    },
  });
};
