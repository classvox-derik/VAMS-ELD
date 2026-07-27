import React from "react";
import { CalendarDays, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const scheduleData = [
    { grade: 5, dates: "February 3-14, 2026", domains: ["Listening", "Reading", "Writing", "Speaking"] },
    { grade: 6, dates: "February 17-28, 2026", domains: ["Listening", "Reading", "Writing", "Speaking"] },
    { grade: 7, dates: "March 3-14, 2026", domains: ["Listening", "Reading", "Writing", "Speaking"] },
    { grade: 8, dates: "March 17-28, 2026", domains: ["Listening", "Reading", "Writing", "Speaking"] },
];

export default function ELPACSchedulePage() {
    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="scaffold-heading">ELPAC Test Schedule</h1>
                <p className="scaffold-description mt-1">2025-2026 ELPAC testing windows and information.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {scheduleData.map((item) => (
                    <Card key={item.grade}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-eld-space-indigo" />
                                Grade {item.grade}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-eld-lilac-ash" />
                                <span className="text-muted-foreground">{item.dates}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-eld-space-indigo dark:text-gray-300">Domains:</p>
                                <div className="flex flex-wrap gap-1">
                                    {item.domains.map((domain) => (
                                        <span key={domain} className="inline-flex items-center rounded-full bg-eld-space-indigo/10 px-2 py-0.5 text-xs text-eld-space-indigo dark:bg-eld-dusty-grape/20 dark:text-eld-seashell">
                                            {domain}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-eld-space-indigo" />
                        Testing Tips
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Ensure students are well-rested and have eaten breakfast before testing.</p>
                    <p>• Provide headphones for the Listening domain.</p>
                    <p>• Speaking domain requires a quiet environment for recording.</p>
                    <p>• Allow breaks between domains as needed.</p>
                    <p>• Review accommodations for students with IEPs or 504 plans.</p>
                </CardContent>
            </Card>
        </div>
    );
}