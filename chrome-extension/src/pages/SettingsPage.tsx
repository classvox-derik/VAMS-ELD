import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LogOut, Mail } from "lucide-react";
import { useSupabase } from "../App";
import { useLocation } from "wouter";

export default function SettingsPage() {
    const { session, signOut } = useSupabase();
    const [, navigate] = useLocation();

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="scaffold-heading">Settings</h1>
                <p className="scaffold-description mt-1">Your account information.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Mail className="h-5 w-5 text-eld-space-indigo" />
                        Account
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Signed in as:{" "}
                        <span className="font-medium text-eld-space-indigo">{session?.user?.email || "Unknown"}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Only Bright Star Schools email addresses are permitted.
                    </p>
                    <Button variant="destructive" onClick={handleSignOut} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}