import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const getSupabaseAuthenticatedClient = (token: string) => {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, token);
};
