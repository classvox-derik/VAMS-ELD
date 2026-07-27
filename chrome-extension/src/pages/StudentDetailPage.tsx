import React, { useState, useEffect } from "react";
import { useSupabase } from "../App";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useRoute } from "wouter";
import type { Student } from "../types";

export default function StudentDetailPage() {
    const [, params] = useRoute("/students/:id");
    const { supabase } = useSupabase();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase || !params?.id) return;
        (async () => {
            const { data } = await supabase.from("students").select("*").eq("id", params.id).single();
            if (data) setStudent(data as Student);
            setLoading(false);
        })();
    }, [supabase, params?.id]);

    if (loading) return <div className="p-6 text-center text-muted-foreground">Loading student...</div>;
    if (!student) return <div className="p-6 text-center text-muted-foreground">Student not found.</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            <Button variant="ghost" onClick={() => window.location.hash = "#/students"} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Students
            </Button>

            <div>
                <h1 className="scaffold-heading">{student.name}</h1>
                <p className="scaffold-description mt-1">Grade {student.grade} &middot; {student.homeroom}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Student Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">EL Level</span>
                            <span className="font-medium">{student.el_level}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Primary Language</span>
                            <span className="font-medium">{student.primary_language}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">SSID</span>
                            <span className="font-medium">{student.ssid}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Custom Scaffolds</span>
                            <span className="font-medium">{(student.custom_scaffolds || []).join(", ") || "None"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">ELPAC Scores</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Overall Level</span>
                            <span className="font-medium">{student.overall_level || "-"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Oral Language</span>
                            <span className="font-medium">{student.oral_language_level || "-"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Written Language</span>
                            <span className="font-medium">{student.written_language_level || "-"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">ELPAC Score</span>
                            <span className="font-medium">{student.elpac_score || "-"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">ELPAC Level</span>
                            <span className="font-medium">{student.elpac_level || "-"}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {student.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{student.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}