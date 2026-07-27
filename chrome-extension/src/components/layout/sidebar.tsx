import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import {
    LayoutDashboard,
    Users,
    PenSquare,
    BookOpen,
    GraduationCap,
    Layers,
    CalendarDays,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    ChevronDown,
    Image,
} from "lucide-react";

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Students", href: "/students", icon: Users },
    { title: "Create Assignment", href: "/create", icon: PenSquare, divider: true },
    { title: "Library", href: "/library", icon: BookOpen },
    {
        title: "ELD Guide",
        icon: GraduationCap,
        children: [
            { title: "Overview", href: "/eld-guide" },
            { title: "Scaffolds Guide", href: "/eld-guide/scaffolds" },
            { title: "ELPAC Guide", href: "/eld-guide/elpac" },
        ],
    },
    { title: "ELPAC Schedule", href: "/elpac-schedule", icon: CalendarDays, divider: true },
    { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const [location] = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(true);
    const [eldGuideOpen, setEldGuideOpen] = useState(false);

    const isActive = (href: string) => location === href || location?.startsWith(href + "/");

    return (
        <>
            {/* Toggle button when collapsed */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="fixed left-0 top-3 z-50 flex h-8 w-8 items-center justify-center rounded-r-lg bg-eld-space-indigo text-white shadow-lg hover:bg-eld-dusty-grape transition-all"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            )}

            {/* Overlay for mobile when expanded */}
            {!collapsed && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 flex h-full flex-col bg-eld-space-indigo text-white shadow-xl transition-all duration-300",
                    collapsed ? "w-0 overflow-hidden" : "w-[250px]"
                )}
            >
                {/* Logo & collapse */}
                <div className="flex items-center justify-between px-4 py-4 shrink-0">
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <img src="/icons/icon32.png" alt="VAMS ELD" className="h-8 w-8 rounded" />
                            <span className="text-sm font-bold leading-tight">VAMS ELD</span>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(true)}
                        className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-2 pb-4">
                    {navItems.map((item) => {
                        if ("children" in item && item.children) {
                            const anyChildActive = item.children.some((c) => isActive(c.href));
                            return (
                                <div key={item.title}>
                                    <button
                                        onClick={() => setEldGuideOpen(!eldGuideOpen)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                            anyChildActive
                                                ? "bg-white/15 text-white"
                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className="flex-1 text-left">{item.title}</span>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 transition-transform",
                                                eldGuideOpen && "rotate-180"
                                            )}
                                        />
                                    </button>
                                    {eldGuideOpen && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setCollapsed(true)}
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                                        isActive(child.href)
                                                            ? "bg-white/15 text-white"
                                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                                    )}
                                                >
                                                    {child.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const Icon = item.icon!;
                        return (
                            <div key={item.href}>
                                {item.divider && (
                                    <hr className="my-2 border-white/15" />
                                )}
                                <Link
                                    href={item.href}
                                    onClick={() => setCollapsed(true)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                        isActive(item.href)
                                            ? "bg-white/15 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span>{item.title}</span>
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom: theme toggle */}
                <div className="shrink-0 border-t border-white/20 px-3 py-3">
                    <button
                        onClick={toggleTheme}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5 shrink-0" />
                        ) : (
                            <Moon className="h-5 w-5 shrink-0" />
                        )}
                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                </div>
            </aside>
        </>
    );
}