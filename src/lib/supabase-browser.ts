import { createBrowserClient } from "@supabase/ssr";

// Client-side Supabase client (used in "use client" components).
// Uses cookies to persist the auth session across page loads.
// Falls back to placeholder values during build/prerender when env vars are missing.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_anon_key";

  return createBrowserClient(url, key);
}
