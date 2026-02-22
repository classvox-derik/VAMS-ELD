"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useIsAdmin } from "@/lib/hooks/use-admin";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const router = useRouter();
  const supabase = createClient();
  const { isAdmin } = useIsAdmin();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-[#4a4e69]/20 bg-[#4a4e69] px-4 py-3 lg:px-6">
      {/* Left side - mobile menu button */}
      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right side - user email + theme toggle + sign out */}
      <div className="flex items-center gap-3">
        {isAdmin && (
          <span className="hidden items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white sm:flex">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        )}
        {email && (
          <span className="hidden text-sm text-white/80 sm:block">
            {email}
          </span>
        )}
        <ThemeToggle />
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
