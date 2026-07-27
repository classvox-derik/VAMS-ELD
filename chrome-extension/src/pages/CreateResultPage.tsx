import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useLocation, useSearchParams } from "wouter";

interface ScaffoldResult {
    scaffolded_html?: string;
    word_bank?: { term: string; definition: string }[] | null;
    scaffolds_used?: string[];
    teacher_instructions?: string | null;
}

export default function CreateResultPage() {
    const [, navigate] = useLocation();
    const [result, setResult] = useState<ScaffoldResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            // Read result from sessionStorage (set by CreatePage)
            const stored = sessionStorage.getItem("scaffold-result");
            if (stored) {
                const parsed = JSON.parse(stored);
                setResult(parsed);
            }
        } catch { }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-eld-space-indigo" />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="space-y-6 p-4 md:p-6">
                <Button variant="ghost" onClick={() => navigate("/create")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Create
                </Button>
                <Card>
                    <CardContent className="p-12 text-center text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 text-eld-lilac-ash/50 mb-4" />
                        <p className="mb-2">No scaffold result found.</p>
                        <Button onClick={() => navigate("/create")}>Create a new assignment</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const html = result.scaffolded_html || "";
    const wordBank = result.word_bank;
    const scaffoldsUsed = result.scaffolds_used || [];
    const teacherInstructions = result.teacher_instructions;

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate("/create")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Create
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                        <Download className="h-4 w-4" />
                        Print / PDF
                    </Button>
                </div>
            </div>

            <div>
                <h1 className="scaffold-heading">Scaffolded Assignment</h1>
                <p className="scaffold-description mt-1">Your differentiated assignment is ready.</p>
            </div>

            {/* Scaffolds Applied */}
            {scaffoldsUsed.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-eld-space-indigo dark:text-gray-200 mb-2">
                            Scaffolds Applied:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {scaffoldsUsed.map((s, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-eld-space-indigo/10 px-3 py-1 text-xs font-medium text-eld-space-indigo dark:bg-eld-dusty-grape/20 dark:text-eld-seashell"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Scaffolded HTML */}
            {html && (
                <Card>
                    <CardContent className="p-6">
                        <div
                            className="prose max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Word Bank */}
            {wordBank && wordBank.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-eld-space-indigo dark:text-gray-200 mb-3">
                            Word Bank
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {wordBank.map((item, i) => (
                                <div key={i} className="rounded-lg border border-eld-almond-silk/40 p-3 dark:border-gray-700">
                                    <p className="text-sm font-medium text-eld-space-indigo dark:text-gray-200">
                                        {item.term}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{item.definition}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Teacher Instructions */}
            {teacherInstructions && (
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-eld-space-indigo dark:text-gray-200 mb-2">
                            Teacher Instructions:
                        </p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {teacherInstructions}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}