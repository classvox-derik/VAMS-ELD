import React, { useState, useEffect } from "react";
import { useSupabase } from "../App";
import { BookOpen, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Link } from "wouter";
import { formatRelativeDate } from "../lib/utils";
import type { DifferentiatedAssignment } from "../types";

export default function LibraryPage() {
    const { supabase, session } = useSupabase();
    const [assignments, setAssignments] = useState<DifferentiatedAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!supabase || !session?.user?.id) return;
        (async () => {
            const { data } = await supabase
                .from("differentiated_assignments")
                .select("*")
                .eq("teacher_id", session.user.id)
                .order("created_at", { ascending: false });
            if (data) setAssignments(data as DifferentiatedAssignment[]);
            setLoading(false);
        })();
    }, [supabase, session?.user?.id]);

    const filtered = assignments.filter((a) =>
        a.assignment_title?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-6 text-center text-muted-foreground">Loading library...</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="scaffold-heading">Library</h1>
                <p className="scaffold-description mt-1">Your saved scaffolded assignments.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-eld-lilac-ash" />
                <Input
                    placeholder="Search saved scaffolds..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {filtered.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BookOpen className="mx-auto h-12 w-12 text-eld-lilac-ash/50 mb-4" />
                        <p className="text-muted-foreground">No saved scaffolds yet. Create your first assignment!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((assignment) => (
                        <Link key={assignment.id} href={`/library/${assignment.id}`} className="block">
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-base">{assignment.assignment_title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        {assignment.student_name && <p>Student: {assignment.student_name}</p>}
                                        {assignment.el_level && <p>EL Level: {assignment.el_level}</p>}
                                        <p className="flex items-center gap-1 text-xs">
                                            <BookOpen className="h-3 w-3" />
                                            {formatRelativeDate(assignment.created_at)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}