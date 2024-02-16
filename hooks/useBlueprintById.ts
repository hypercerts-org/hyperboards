import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useBlueprintById = (blueprintId: number) => {
  return useQuery({
    queryKey: ["blueprint", blueprintId],
    queryFn: async () => {
      return supabase
        .from("blueprints")
        .select("*, registries (*)")
        .eq("id", blueprintId)
        .single();
    },
  });
};
