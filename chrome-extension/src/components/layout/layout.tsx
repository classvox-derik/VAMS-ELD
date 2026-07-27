import React from "react";
import { Sidebar } from "./sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="flex min-h-screen flex-col">
                <main className="flex-1">
                    <div className="mx-auto max-w-screen-2xl">{children}</div>
                </main>
            </div>
        </div>
    );
}