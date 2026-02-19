import { google } from "googleapis";

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
    prompt: "consent",
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
