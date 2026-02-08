"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Home,
    Users,
    BookOpen,
    FileText,
    Menu,
    X,
    GraduationCap,
    MessageSquare
} from "lucide-react";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: GraduationCap },
        { name: "Students", href: "/students", icon: Users },
        { name: "Scaffolds", href: "/scaffolds", icon: BookOpen },
        { name: "Resources", href: "/resources", icon: FileText },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                    VAMS ELD
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">English Language Development</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium interactive"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg glass interactive"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden glass rounded-xl mt-4 p-4 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 interactive"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon className="w-5 h-5 text-primary-600" />
                                        <span className="text-gray-700 dark:text-gray-200 font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;