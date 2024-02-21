import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useFetchHyperboardData = (hyperboardId: string) =>
  useQuery({
    queryKey: ["hyperboard", hyperboardId],
    queryFn: async () =>
      await supabase
        .from("hyperboards")
        .select(
          "*, hyperboard_registries ( *, registries ( *, claims ( * ), blueprints ( * ) ) )",
        )
        .eq("id", hyperboardId)
        .single()
        .throwOnError()
        .then((x) => x.data),
  });
