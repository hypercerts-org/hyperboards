import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchDefaultSponsorMetadata = () => {
  return useQuery(["default-sponsor-metadata"], async () => {
    return supabase.from("default_sponsor_metadata").select("*");
  });
};
