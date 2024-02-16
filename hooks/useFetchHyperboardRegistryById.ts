import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchHyperboardRegistryById = (
  hyperboardId: string,
  registryId?: string,
) => {
  return useQuery({
    queryKey: ["hyperboard-registry", registryId],
    queryFn: async () => {
      if (!registryId) return null;
      return supabase
        .from("hyperboard_registries")
        .select("*")
        .eq("hyperboard_id", hyperboardId)
        .eq("registry_id", registryId)
        .single();
    },
  });
};
