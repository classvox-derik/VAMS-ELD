import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createClient() {
  if (!supabaseUrl || supabaseUrl === "https://placeholder.supabase.co") {
    console.warn(
      "[Supabase Server] Using placeholder credentials. Database operations will not work."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
}
