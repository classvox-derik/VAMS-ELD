import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Creates and returns a Supabase client configured for the Chrome extension context.
 */
export function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL and Anon Key must be set via VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.',
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async (key: string): Promise<string | null> => {
          try {
            const result = await chrome.storage.session.get(key);
            return result[key] ?? null;
          } catch {
            return null;
          }
        },
        setItem: async (key: string, value: string): Promise<void> => {
          try {
            await chrome.storage.session.set({ [key]: value });
          } catch {
          }
        },
        removeItem: async (key: string): Promise<void> => {
          try {
            await chrome.storage.session.remove(key);
          } catch {
          }
        },
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Retrieves the current Supabase session from chrome.storage.session.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const result = await chrome.storage.session.get('supabase-session');
    return result['supabase-session'] ?? null;
  } catch {
    return null;
  }
}

/**
 * Stores a Supabase session in chrome.storage.session.
 */
export async function setSession(session: Session): Promise<void> {
  try {
    await chrome.storage.session.set({ 'supabase-session': session });
  } catch {
  }
}

/**
 * Clears the Supabase session from chrome.storage.session.
 */
export async function clearSession(): Promise<void> {
  try {
    await chrome.storage.session.remove('supabase-session');
  } catch {
  }
}

/**
 * Gets the currently authenticated user from the stored session.
 */
export async function getCurrentUser(): Promise<{
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
} | null> {
  try {
    const session = await getSession();
    if (!session?.user) {
      return null;
    }
    return {
      id: session.user.id,
      email: session.user.email,
      user_metadata: session.user.user_metadata,
    };
  } catch {
    return null;
  }
}
