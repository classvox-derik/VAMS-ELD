"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkKey && clerkKey.length > 10 && clerkKey.startsWith("pk_");

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster richColors position="bottom-right" />
    </ThemeProvider>
  );

  if (!isClerkConfigured) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
