import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useRegistry = (registryId: string) => {
  return useQuery(["registry", registryId], async () => {
    return supabase.from("registries-optimism").select("*");
  });
};
