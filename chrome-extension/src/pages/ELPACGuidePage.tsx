import React from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

export default function ELPACGuidePage() {
    return (
        <div className="space-y-6 p-4 md:p-6">
            <Link href="/eld-guide">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to ELD Guide
                </Button>
            </Link>
            <h1 className="scaffold-heading">ELPAC Guide</h1>
            <p className="scaffold-description mt-1">Understanding the ELPAC assessment for English Learners.</p>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">What is the ELPAC?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>The English Language Proficiency Assessments for California (ELPAC) is the state's required test for students who are identified as English Learners (ELs).</p>
                    <p>The ELPAC assesses four domains: Listening, Reading, Writing, and Speaking.</p>
                    <p>Students receive an overall score from 1-4, with 4 being the highest proficiency level.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Score Levels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[
                        { level: 1, label: "Minimally Developed", desc: "Student struggles to understand and produce English", color: "bg-red-100 text-red-800" },
                        { level: 2, label: "Somewhat Developed", desc: "Student can communicate basic needs with support", color: "bg-orange-100 text-orange-800" },
                        { level: 3, label: "Moderately Developed", desc: "Student can communicate independently on familiar topics", color: "bg-yellow-100 text-yellow-800" },
                        { level: 4, label: "Well Developed", desc: "Student demonstrates grade-level English proficiency", color: "bg-green-100 text-green-800" },
                    ].map((item) => (
                        <div key={item.level} className="flex items-start gap-3 rounded-xl border border-eld-almond-silk/40 p-3 dark:border-gray-700">
                            <span className={`inline-flex items-center justify-center rounded-full h-8 w-8 text-sm font-bold shrink-0 ${item.color}`}>{item.level}</span>
                            <div>
                                <p className="text-sm font-medium text-eld-space-indigo dark:text-gray-200">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}