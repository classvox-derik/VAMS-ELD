"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Settings,
  Link2,
  Link2Off,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Palette,
  Info,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useUserProfile } from "@/lib/hooks/use-user-profile";

interface GoogleStatus {
  configured: boolean;
  connected: boolean;
  email: string | null;
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const [googleStatus, setGoogleStatus] = useState<GoogleStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { profile, saveProfile, isLoaded, isSaving } = useUserProfile();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (isLoaded) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
    }
  }, [isLoaded, profile.firstName, profile.lastName]);

  async function handleSaveProfile() {
    const ok = await saveProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
    if (ok) {
      toast.success("Profile saved!");
    } else {
      toast.error("Failed to save profile. Please try again.");
    }
  }

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/google-auth/status");
        const data = await res.json();
        setGoogleStatus(data);
      } catch {
        setGoogleStatus({ configured: false, connected: false, email: null });
      } finally {
        setIsLoading(false);
      }
    }
    checkStatus();
  }, []);

  // Handle redirect params from OAuth callback
  useEffect(() => {
    if (searchParams.get("connected") === "true") {
      toast.success("Google account connected successfully!");
      // Re-check status to get email
      fetch("/api/google-auth/status")
        .then((r) => r.json())
        .then((data) => setGoogleStatus(data))
        .catch(() => {});
    }
    const googleError = searchParams.get("google_error");
    if (googleError) {
      const messages: Record<string, string> = {
        access_denied: "Google account connection was cancelled.",
        no_refresh_token:
          "Could not get a refresh token. Please try again and grant offline access.",
        token_exchange_failed:
          "Failed to exchange authorization code. Please try again.",
      };
      toast.error(messages[googleError] ?? "Google connection failed.");
    }
  }, [searchParams]);

  async function handleDisconnect() {
    setIsDisconnecting(true);
    try {
      await fetch("/api/google-auth/disconnect", { method: "POST" });
      setGoogleStatus((prev) =>
        prev ? { ...prev, connected: false, email: null } : prev
      );
      toast.success("Google account disconnected.");
    } catch {
      toast.error("Failed to disconnect. Please try again.");
    } finally {
      setIsDisconnecting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="scaffold-heading">Settings</h1>
        <p className="scaffold-description mt-1">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your name is used for personalized greetings on the dashboard.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  placeholder="e.g. Maria"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  placeholder="e.g. Garcia"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSaveProfile} size="sm" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Google Account Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            Google Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking connection status...
            </div>
          ) : !googleStatus?.configured ? (
            /* Google OAuth not configured */
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Google OAuth Not Configured
                  </p>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                    To enable Google Docs export, add your Google OAuth
                    credentials to{" "}
                    <code className="rounded bg-amber-100 px-1 py-0.5 text-xs dark:bg-amber-900/50">
                      .env.local
                    </code>
                    :
                  </p>
                  <pre className="mt-2 rounded bg-amber-100 p-2 text-xs text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                    {`GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-auth/callback`}
                  </pre>
                </div>
              </div>
            </div>
          ) : googleStatus.connected ? (
            /* Connected */
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Connected
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {googleStatus.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="gap-1.5"
                >
                  {isDisconnecting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Link2Off className="h-3.5 w-3.5" />
                  )}
                  Disconnect
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You can export scaffolded assignments directly to Google Docs.
              </p>
            </div>
          ) : (
            /* Configured but not connected */
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your Google account to export scaffolded assignments
                directly to Google Docs.
              </p>
              <Button asChild className="gap-2">
                <a href="/api/google-auth/authorize">
                  <Link2 className="h-4 w-4" />
                  Connect Google Account
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                We&apos;ll request access to create Google Docs on your behalf.
                You can disconnect at any time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">
                Choose your preferred color scheme.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <div className="flex justify-between py-3 border-b border-eld-almond-silk/40 dark:border-gray-800">
              <span className="text-muted-foreground">Application</span>
              <span className="font-medium">VAMS ELD Scaffolding Platform</span>
            </div>
            <div className="flex justify-between py-3 border-b border-eld-almond-silk/40 dark:border-gray-800">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-muted-foreground">School</span>
              <span className="font-medium">Valor Academy Middle School</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-eld-space-indigo border-t-transparent dark:border-eld-dusty-grape dark:border-t-transparent" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
