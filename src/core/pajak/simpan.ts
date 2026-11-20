import { createClient } from "@supabase/supabase-js";

export function klien(): unknown {
  return createClient("https://x.supabase.co", "anon");
}
