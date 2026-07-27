import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";

const supabaseUrl = "https://bogllcjeaqoghabmbxhy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2xsY2plYXFvZ2hhYm1ieGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NDg2NzEsImV4cCI6MjA4NzEyNDY3MX0.GvPG8ZpZiDvwm1VsFcw_aQXUmAgT_RU6P3vSdfMUgEE";

export function createSupabaseClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async (key) => {
          try {
            const r = await chrome.storage.session.get(key);
            return r[key] ?? null;
          } catch {
            return null;
          }
        },
        setItem: async (key, value) => {
          try {
            await chrome.storage.session.set({ [key]: value });
          } catch { }
        },
        removeItem: async (key) => {
          try {
            await chrome.storage.session.remove(key);
          } catch { }
        },
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export async function getSession(): Promise<Session | null> {
  try {
    const r = await chrome.storage.session.get("supabase-session");
    return r["supabase-session"] ?? null;
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  try {
    await chrome.storage.session.set({ "supabase-session": session });
  } catch { }
}

export async function clearSession(): Promise<void> {
  try {
    await chrome.storage.session.remove("supabase-session");
  } catch { }
}

export async function getCurrentUser(): Promise<{ id: string; email?: string; user_metadata?: Record<string, unknown> } | null> {
  try {
    const s = await getSession();
    if (!s?.user) return null;
    return { id: s.user.id, email: s.user.email, user_metadata: s.user.user_metadata };
  } catch {
    return null;
  }
}