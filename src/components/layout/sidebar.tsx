"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  PenSquare,
  BookOpen,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
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
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-pinned");
    if (saved === "true") setIsPinned(true);
  }, []);

  const togglePin = () => {
    const next = !isPinned;
    setIsPinned(next);
    localStorage.setItem("sidebar-pinned", String(next));
  };

  const isExpanded = isPinned || isHovered;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 bg-eld-space-indigo text-eld-seashell sidebar-transition overflow-hidden",
        isExpanded ? "w-[290px]" : "w-[90px]"
      )}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-3 px-5 py-8 shrink-0",
          !isExpanded && "justify-center px-0"
        )}
      >
        <Image
          src="/eldlogo.png"
          alt="VAMS ELD"
          width={40}
          height={40}
          className="rounded-lg shrink-0"
        />
        <span
          className={cn(
            "text-lg font-bold text-eld-seashell whitespace-nowrap sidebar-transition",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
          )}
        >
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
                  : "text-eld-seashell/80 hover:bg-eld-dusty-grape/50 hover:text-white",
                !isExpanded && "justify-center px-0"
              )}
              title={!isExpanded ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap sidebar-transition",
                  isExpanded
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 overflow-hidden"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto shrink-0 border-t border-eld-lilac-ash/20 px-3 py-4 space-y-3">
        <UsageCounter used={0} limit={1000} isCollapsed={!isExpanded} />

        {/* Pin toggle */}
        <button
          onClick={togglePin}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-eld-seashell/60 hover:text-white hover:bg-eld-dusty-grape/50 transition-all duration-200 w-full",
            !isExpanded && "justify-center px-0"
          )}
          title={isPinned ? "Collapse sidebar" : "Pin sidebar open"}
        >
          {isPinned ? (
            <PanelLeftClose className="h-5 w-5 shrink-0" />
          ) : (
            <PanelLeftOpen className="h-5 w-5 shrink-0" />
          )}
          <span
            className={cn(
              "whitespace-nowrap sidebar-transition",
              isExpanded
                ? "opacity-100 w-auto"
                : "opacity-0 w-0 overflow-hidden"
            )}
          >
            {isPinned ? "Collapse" : "Pin Open"}
          </span>
        </button>
      </div>
    </aside>
  );
}
