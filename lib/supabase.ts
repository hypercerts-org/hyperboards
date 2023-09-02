import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://clagjjfinooizoqdkvqc.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY!,
);
