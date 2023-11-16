import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { Database as HypercertsDatabase } from "@/types/hypercerts-database";
import {
  SUPABASE_HYPERCERTS_ANON_KEY,
  SUPABASE_HYPERCERTS_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "@/config";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getSupabaseAuthenticatedClient = (token: string) => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

export const supabaseHypercerts = createClient<HypercertsDatabase>(
  SUPABASE_HYPERCERTS_URL,
  SUPABASE_HYPERCERTS_ANON_KEY,
);
