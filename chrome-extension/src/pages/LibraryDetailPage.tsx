import React, { useState, useEffect } from "react";
import { useSupabase } from "../App";
import { ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useRoute, Link } from "wouter";
import type { DifferentiatedAssignment } from "../types";
import { formatDate } from "../lib/utils";

export default function LibraryDetailPage() {
    const [, params] = useRoute("/library/:id");
    const { supabase } = useSupabase();
    const [assignment, setAssignment] = useState<DifferentiatedAssignment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase || !params?.id) return;
        (async () => {
            const { data } = await supabase.from("differentiated_assignments").select("*").eq("id", params.id).single();
            if (data) setAssignment(data as DifferentiatedAssignment);
            setLoading(false);
        })();
    }, [supabase, params?.id]);

    if (loading) return <div className="p-6 text-center text-muted-foreground">Loading...</div>;
    if (!assignment) return <div className="p-6 text-center text-muted-foreground">Assignment not found.</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            <Link href="/library">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Library
                </Button>
            </Link>

            <div>
                <h1 className="scaffold-heading">{assignment.assignment_title}</h1>
                <p className="scaffold-description mt-1">
                    {assignment.el_level && `EL Level: ${assignment.el_level} · `}
                    Created {formatDate(assignment.created_at)}
                </p>
            </div>

            {assignment.scaffolds_applied && assignment.scaffolds_applied.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-eld-space-indigo dark:text-gray-200 mb-2">Scaffolds Applied:</p>
                        <div className="flex flex-wrap gap-2">
                            {assignment.scaffolds_applied.map((s, i) => (
                                <span key={i} className="inline-flex items-center rounded-full bg-eld-space-indigo/10 px-3 py-1 text-xs font-medium text-eld-space-indigo dark:bg-eld-dusty-grape/20 dark:text-eld-seashell">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {assignment.output_html && (
                <Card>
                    <CardContent className="p-6">
                        <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: assignment.output_html }} />
                    </CardContent>
                </Card>
            )}

            {assignment.teacher_instructions && (
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-eld-space-indigo dark:text-gray-200 mb-2">Teacher Instructions:</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{assignment.teacher_instructions}</p>
                    </CardContent>
                </Card>
            )}

            {assignment.google_doc_url && (
                <Button asChild variant="outline" className="gap-2">
                    <a href={assignment.google_doc_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4" />
                        Open in Google Docs
                    </a>
                </Button>
            )}
        </div>
    );
}