import { createBrowserClient } from "@supabase/ssr";

// Client-side Supabase client (used in "use client" components).
// Uses cookies to persist the auth session across page loads.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
