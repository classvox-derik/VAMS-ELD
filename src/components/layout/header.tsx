"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const router = useRouter();
  const supabase = createClient();
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
    <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-eld-dusty-grape/20 bg-eld-dusty-grape px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:px-6">
      {/* Left side - mobile menu button */}
      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right side - user email + theme toggle + sign out */}
      <div className="flex items-center gap-3">
        {email && (
          <span className="hidden text-sm text-white/80 dark:text-gray-400 sm:block">
            {email}
          </span>
        )}
        <ThemeToggle />
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-red-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
