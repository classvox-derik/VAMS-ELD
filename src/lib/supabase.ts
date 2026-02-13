import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  if (!supabaseUrl || supabaseUrl === "https://placeholder.supabase.co") {
    console.warn(
      "[Supabase] Using placeholder credentials. Database operations will not work."
    );
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
