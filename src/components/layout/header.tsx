"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  LogOut,
  Shield,
  MessageSquare,
  LayoutDashboard,
  Users,
  PenSquare,
  BookOpen,
  Settings,
  GraduationCap,
  Layers,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useIsAdmin } from "@/lib/hooks/use-admin";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Students", href: "/students", icon: Users, divider: true },
  { title: "Create Assignment", href: "/create", icon: PenSquare },
  { title: "Library", href: "/library", icon: BookOpen },
  { title: "Scaffolds", href: "/eld-guide/scaffolds", icon: Layers, divider: true },
  { title: "ELD Guide", href: "/eld-guide", icon: GraduationCap },
  { title: "Settings", href: "/settings", icon: Settings, divider: true },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { isAdmin } = useIsAdmin();
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, [supabase.auth]);

  // Close drawer on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-white/10 bg-[#22223b] px-4 py-3 lg:px-6">
        {/* Left side - mobile menu button */}
        <div className="flex items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(true)}
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
          <Link
            href="/contact"
            title="Message the ELD Teacher"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <MessageSquare className="h-5 w-5" />
          </Link>
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

      {/* Mobile nav drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#4a4e69] shadow-2xl lg:hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-5">
              <Link
                href="/dashboard"
                className="flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src="/eldlogo.png"
                  alt="Valor Academy Middle School"
                  width={44}
                  height={44}
                  className="rounded-lg shrink-0"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-white">Valor Academy</span>
                  <span className="text-sm font-bold text-white">Middle School</span>
                  <span className="text-xs text-white/70">English Language Development</span>
                </div>
              </Link>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-3 pb-6">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (pathname?.startsWith(item.href + "/") &&
                      !navItems.some(
                        (other) => other.href !== item.href && pathname === other.href
                      ));
                  return (
                    <div key={item.href}>
                      {item.divider && (
                        <hr className="my-2 border-white/15" />
                      )}
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-white/15 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* Drawer footer */}
            <div className="border-t border-white/20 px-4 py-4">
              {email && (
                <p className="mb-3 truncate text-xs text-white/60">{email}</p>
              )}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-red-300 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
