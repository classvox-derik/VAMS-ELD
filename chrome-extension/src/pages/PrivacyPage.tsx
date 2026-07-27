import React from "react";
import { Card, CardContent } from "../components/ui/card";

export default function PrivacyPage() {
    return (
        <div className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto">
            <h1 className="scaffold-heading">Privacy Policy</h1>
            <Card>
                <CardContent className="p-6 space-y-4 text-sm text-muted-foreground">
                    <p>Last updated: 2026</p>
                    <h3 className="font-semibold text-eld-space-indigo dark:text-gray-200">Information We Collect</h3>
                    <p>VAMS ELD collects only the information necessary to provide our ELD scaffolding services:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Email address and name (for authentication)</li>
                        <li>Student data you upload (names, EL levels, scores)</li>
                        <li>Assignment content you provide for scaffolding</li>
                    </ul>
                    <h3 className="font-semibold text-eld-space-indigo dark:text-gray-200">How We Use Your Information</h3>
                    <p>Your information is used solely to provide and improve the ELD scaffolding platform. We do not sell, trade, or share your personal information with third parties.</p>
                    <h3 className="font-semibold text-eld-space-indigo dark:text-gray-200">Data Storage</h3>
                    <p>Data is stored securely in Supabase, a HIPAA-compliant database service. Student data is scoped to individual teachers and is never shared across school accounts.</p>
                    <h3 className="font-semibold text-eld-space-indigo dark:text-gray-200">Contact</h3>
                    <p>For privacy concerns, please contact your school administration.</p>
                </CardContent>
            </Card>
        </div>
    );
}