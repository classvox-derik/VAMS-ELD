import React from "react";
import { GraduationCap, BookOpen, Layers, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "wouter";

export default function ELDGuidePage() {
    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="scaffold-heading">ELD Guide</h1>
                <p className="scaffold-description mt-1">English Language Development resources and strategies.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link href="/eld-guide">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <GraduationCap className="h-5 w-5 text-eld-space-indigo" />
                                ELD Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Understanding ELD levels and standards for middle school.</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/eld-guide/scaffolds">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Layers className="h-5 w-5 text-eld-space-indigo" />
                                Scaffolds Guide
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Types of scaffolds and when to use them for each EL level.</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/eld-guide/elpac">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="h-5 w-5 text-eld-space-indigo" />
                                ELPAC Guide
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">ELPAC test structure, scoring, and preparation strategies.</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">ELD Levels Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
                        <h3 className="font-semibold text-red-800 dark:text-red-300">Emerging</h3>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            Students at the Emerging level communicate basic information with support. They understand simple phrases and sentences, and can produce short responses with scaffolding.
                        </p>
                    </div>
                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/30 dark:bg-orange-900/10">
                        <h3 className="font-semibold text-orange-800 dark:text-orange-300">Expanding</h3>
                        <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                            Students at the Expanding level communicate with increasing independence. They understand more complex text and can express ideas with developing academic language.
                        </p>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                        <h3 className="font-semibold text-green-800 dark:text-green-300">Bridging</h3>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                            Students at the Bridging level communicate with near-native proficiency. They understand grade-level academic text and can produce sophisticated written and oral responses.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}