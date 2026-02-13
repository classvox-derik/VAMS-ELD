"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PenSquare,
  BookOpen,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
  },
  {
    title: "Create Assignment",
    href: "/create",
    icon: PenSquare,
  },
  {
    title: "Library",
    href: "/library",
    icon: BookOpen,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-50">
      <div className="flex flex-col flex-grow border-r bg-card px-4 py-6 overflow-y-auto">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
          <span className="text-lg font-bold text-foreground">VAMS ELD</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-4 border-t">
          <ThemeToggle />
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
