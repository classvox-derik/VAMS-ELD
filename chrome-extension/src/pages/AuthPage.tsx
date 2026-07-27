import React, { useState } from "react";
import { useLocation } from "wouter";
import { createSupabaseClient, setSession } from "../lib/supabase-client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AuthPage() {
    const [, navigate] = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const supabase = createSupabaseClient();
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
                return;
            }

            if (data.session) {
                await setSession(data.session);
            }

            navigate("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-eld-seashell to-white dark:from-gray-900 dark:to-gray-950">
            <div className="w-full max-w-md px-4">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4">
                        <img
                            src="/icons/icon128.png"
                            alt="Valor Academy Middle School Logo"
                            className="h-16 w-auto mx-auto"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Valor Academy Middle School</h1>
                    <p className="mt-2 text-muted-foreground">English Language Development</p>
                </div>

                <div className="rounded-2xl border border-eld-almond-silk/40 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@brightstarschools.org"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-eld-lilac-ash hover:text-eld-space-indigo dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign in
                        </Button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-eld-lilac-ash dark:text-gray-500">
                    &copy; {new Date().getFullYear()} Valor Academy Middle School &mdash; VAMS ELD
                </p>
            </div>
        </div>
    );
}