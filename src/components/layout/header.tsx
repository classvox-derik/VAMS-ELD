"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

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
    <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:px-6">
      {/* Left side - mobile menu button */}
      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right side - user email + theme toggle + sign out */}
      <div className="flex items-center gap-3">
        {email && (
          <span className="hidden text-sm text-muted-foreground sm:block">
            {email}
          </span>
        )}
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          title="Sign out"
          className="h-10 w-10 rounded-full text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
