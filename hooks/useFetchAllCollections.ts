import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchAllCollections = () => {
  return useQuery(["collections", "all"], async () => {
    return supabase.from("registries").select("*, claims(*)");
  });
};
