"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PenSquare,
  BookOpen,
  Settings,
  GraduationCap,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UsageCounter } from "./usage-counter";

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
  {
    title: "ELD Guide",
    href: "/eld-guide",
    icon: GraduationCap,
  },
  {
    title: "Scaffolds",
    href: "/eld-guide/scaffolds",
    icon: Layers,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-[290px] bg-[#4a4e69] dark:bg-eld-space-indigo overflow-hidden">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-5 py-6 shrink-0"
      >
        <Image
          src="/eldlogo.png"
          alt="Valor Academy Middle School"
          width={56}
          height={56}
          className="rounded-lg shrink-0"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-white dark:text-eld-seashell">
            Valor Academy
          </span>
          <span className="text-sm font-bold text-white dark:text-eld-seashell">
            Middle School
          </span>
          <span className="text-xs text-white/70 dark:text-eld-seashell/70">
            English Language Development
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar">
        <div className="space-y-1 dark:space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-theme-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-white dark:bg-eld-dusty-grape dark:text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1 dark:text-eld-seashell/80 dark:hover:bg-eld-dusty-grape/50 dark:hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto shrink-0 border-t border-white/20 dark:border-eld-lilac-ash/20 px-3 py-4">
        <UsageCounter used={0} limit={1000} isCollapsed={false} />
      </div>
    </aside>
  );
}
