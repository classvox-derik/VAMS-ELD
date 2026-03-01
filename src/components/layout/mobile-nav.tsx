"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PenSquare,
  BookOpen,
  Settings,
  GraduationCap,
  Layers,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Students", href: "/students", icon: Users },
  { title: "ELPAC", href: "/elpac-progress", icon: ClipboardList },
  { title: "Create", href: "/create", icon: PenSquare },
  { title: "Library", href: "/library", icon: BookOpen },
  { title: "Scaffolds", href: "/eld-guide/scaffolds", icon: Layers },
  { title: "ELD Guide", href: "/eld-guide", icon: GraduationCap },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-eld-almond-silk/30 bg-eld-seashell shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname?.startsWith(item.href + "/") &&
              !navItems.some(
                (other) => other.href !== item.href && pathname === other.href
              ));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors duration-200",
                isActive
                  ? "text-eld-space-indigo dark:text-eld-almond-silk"
                  : "text-eld-dusty-grape hover:text-eld-space-indigo dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
