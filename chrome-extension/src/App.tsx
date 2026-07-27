import React, { useState, useEffect, createContext, useContext, Suspense, lazy, useCallback } from "react";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Toaster } from "sonner";
import { createSupabaseClient, getSession, clearSession } from "./lib/supabase-client";
import { ThemeProvider } from "./lib/theme";
import { Layout } from "./components/layout/layout";
import type { SupabaseClient, Session } from "@supabase/supabase-js";

export const SupabaseContext = createContext<{
  supabase: SupabaseClient | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({ supabase: null, session: null, loading: true, signOut: async () => { } });

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabase must be used within SupabaseContext.Provider");
  return ctx;
}

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const StudentsPage = lazy(() => import("./pages/StudentsPage"));
const StudentDetailPage = lazy(() => import("./pages/StudentDetailPage"));
const CreatePage = lazy(() => import("./pages/CreatePage"));
const CreateResultPage = lazy(() => import("./pages/CreateResultPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const LibraryDetailPage = lazy(() => import("./pages/LibraryDetailPage"));
const ELDGuidePage = lazy(() => import("./pages/ELDGuidePage"));
const ScaffoldsGuidePage = lazy(() => import("./pages/ScaffoldsGuidePage"));
const ELPACGuidePage = lazy(() => import("./pages/ELPACGuidePage"));
const ELPACSchedulePage = lazy(() => import("./pages/ELPACSchedulePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

function App() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSessionState] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const client = createSupabaseClient();
        setSupabase(client);
        const saved = await getSession();
        if (saved) setSessionState(saved);
      } catch (err) {
        console.error("Failed to initialize Supabase:", err);
      }
      setLoading(false);
    })();
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    await clearSession();
    setSessionState(null);
  }, [supabase]);

  const renderPage = (Page: React.ComponentType) => {
    if (!session) return <AuthPage />;
    return (
      <Layout>
        <Page />
      </Layout>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Outfit, system-ui, sans-serif",
        background: "#f9f4ef",
        color: "#4a4e69",
        padding: "2rem",
        textAlign: "center"
      }}>
        <img src="/icons/icon128.png" alt="Logo" style={{ width: 64, height: 64, marginBottom: "1rem", borderRadius: 12 }} />
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>VAMS ELD</h2>
        <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>Loading...</p>
      </div>
    );
  }

  return (
    <SupabaseContext.Provider value={{ supabase, session, loading, signOut }}>
      <ThemeProvider>
        <Router hook={useHashLocation}>
          <Suspense fallback={<div style={{ padding: "1rem", fontFamily: "Outfit, sans-serif" }}>Loading page...</div>}>
            <Switch>
              <Route path="/">{renderPage(DashboardPage)}</Route>
              <Route path="/dashboard">{renderPage(DashboardPage)}</Route>
              <Route path="/students">{renderPage(StudentsPage)}</Route>
              <Route path="/students/:id">{renderPage(StudentDetailPage)}</Route>
              <Route path="/create">{renderPage(CreatePage)}</Route>
              <Route path="/create/result">{renderPage(CreateResultPage)}</Route>
              <Route path="/library">{renderPage(LibraryPage)}</Route>
              <Route path="/library/:id">{renderPage(LibraryDetailPage)}</Route>
              <Route path="/eld-guide">{renderPage(ELDGuidePage)}</Route>
              <Route path="/eld-guide/scaffolds">{renderPage(ScaffoldsGuidePage)}</Route>
              <Route path="/eld-guide/elpac">{renderPage(ELPACGuidePage)}</Route>
              <Route path="/elpac-schedule">{renderPage(ELPACSchedulePage)}</Route>
              <Route path="/settings">{renderPage(SettingsPage)}</Route>
              <Route path="/auth" component={AuthPage} />
              <Route path="/privacy">{renderPage(PrivacyPage)}</Route>
              <Route path="/terms">{renderPage(TermsPage)}</Route>
            </Switch>
          </Suspense>
        </Router>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </SupabaseContext.Provider>
  );
}

export default App;