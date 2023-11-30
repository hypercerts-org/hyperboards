import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchDefaultSponsorMetadataByAddress = (address?: string) => {
  return useQuery(["default-sponsor-metadata", address], async () => {
    if (!address) {
      return null;
    }
    return supabase
      .from("default_sponsor_metadata")
      .select("*")
      .eq("address", address)
      .maybeSingle();
  });
};
