import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchRegistryById = (registryId?: string) => {
  return useQuery(["registry", registryId], async () => {
    if (!registryId) return null;
    return supabase
      .from("registries")
      .select("*, blueprints (*)")
      .eq("id", registryId)
      .single();
  });
};
