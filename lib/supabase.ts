import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

export const supabase = createClient<Database>(
  "https://clagjjfinooizoqdkvqc.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
);
