import { google } from "googleapis";
import { createClient as createServiceClient } from "@/lib/supabase-server";

const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const redirectUri =
  process.env.GOOGLE_REDIRECT_URI ??
  "http://localhost:3000/api/google-auth/callback";

const SCOPES = [
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function isGoogleConfigured(): boolean {
  return (
    !!clientId &&
    clientId !== "placeholder_client_id" &&
    clientId.length > 10 &&
    !!clientSecret &&
    clientSecret !== "placeholder_client_secret" &&
    clientSecret.length > 10
  );
}

export function getOAuthClient() {
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl(): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent select_account",
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getAuthenticatedClient(refreshToken: string) {
  const client = getOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  // Force a token refresh to ensure we have a valid access token
  await client.getAccessToken();
  return client;
}

export async function getUserEmail(refreshToken: string): Promise<string | null> {
  try {
    const client = await getAuthenticatedClient(refreshToken);
    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const { data } = await oauth2.userinfo.get();
    return data.email ?? null;
  } catch {
    return null;
  }
}

// Cookie name for storing the refresh token
export const GOOGLE_TOKEN_COOKIE = "vams-google-token";

// ---------------------------------------------------------------------------
// Database persistence helpers  (google_tokens table)
// ---------------------------------------------------------------------------

/** Save (or update) the Google refresh token for a user. */
export async function saveGoogleToken(
  userId: string,
  refreshToken: string,
  googleEmail: string | null
) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("google_tokens").upsert(
    {
      user_id: userId,
      refresh_token: refreshToken,
      google_email: googleEmail,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) console.error("Failed to save Google token:", error.message);
}

/** Load the stored Google refresh token for a user (returns null if none). */
export async function loadGoogleToken(
  userId: string
): Promise<{ refreshToken: string; googleEmail: string | null } | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("google_tokens")
    .select("refresh_token, google_email")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return { refreshToken: data.refresh_token, googleEmail: data.google_email };
}

/** Delete the stored Google token when a user disconnects. */
export async function deleteGoogleToken(userId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("google_tokens")
    .delete()
    .eq("user_id", userId);
  if (error) console.error("Failed to delete Google token:", error.message);
}
