import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { getToken } from "@/hooks/useLogin";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
);

export const getSupabaseAuthenticated = () => {
  const token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, token);
};
