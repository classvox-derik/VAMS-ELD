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
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-[290px] bg-eld-space-indigo text-eld-seashell overflow-hidden">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-5 py-8 shrink-0"
      >
        <Image
          src="/eldlogo.png"
          alt="VAMS ELD"
          width={40}
          height={40}
          className="rounded-lg shrink-0"
        />
        <span className="text-lg font-bold text-eld-seashell whitespace-nowrap">
          VAMS ELD
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto custom-scrollbar">
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
                  ? "bg-eld-dusty-grape text-white"
                  : "text-eld-seashell/80 hover:bg-eld-dusty-grape/50 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto shrink-0 border-t border-eld-lilac-ash/20 px-3 py-4">
        <UsageCounter used={0} limit={1000} isCollapsed={false} />
      </div>
    </aside>
  );
}
