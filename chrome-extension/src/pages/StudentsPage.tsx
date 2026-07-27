import React, { useState, useEffect } from "react";
import { useSupabase } from "../App";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Link } from "wouter";
import type { Student, ELLevel } from "../types";

const levelStyles: Record<string, string> = {
    Emerging: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Expanding: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    Bridging: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export default function StudentsPage() {
    const { supabase } = useSupabase();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!supabase) return;
        (async () => {
            const { data } = await supabase.from("students").select("*");
            if (data) setStudents(data as Student[]);
            setLoading(false);
        })();
    }, [supabase]);

    const filtered = students.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.homeroom.toLowerCase().includes(search.toLowerCase()) ||
            s.grade.toString().includes(search)
    );

    if (loading) return <div className="p-6 text-center text-muted-foreground">Loading students...</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="scaffold-heading">Students</h1>
                    <p className="scaffold-description mt-1">{students.length} total students</p>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-eld-lilac-ash" />
                <Input
                    placeholder="Search students by name, grade, or homeroom..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Student Roster</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-eld-almond-silk/40 dark:border-gray-700">
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th>
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Grade</th>
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Homeroom</th>
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">EL Level</th>
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">ELPAC</th>
                                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Language</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-b border-eld-almond-silk/20 dark:border-gray-800 hover:bg-eld-almond-silk/10 dark:hover:bg-gray-800/50 cursor-pointer"
                                        onClick={() => window.location.hash = `#/students/${student.id}`}
                                    >
                                        <td className="py-3 px-2 font-medium text-eld-space-indigo dark:text-gray-200">{student.name}</td>
                                        <td className="py-3 px-2 text-muted-foreground">{student.grade}</td>
                                        <td className="py-3 px-2 text-muted-foreground">{student.homeroom}</td>
                                        <td className="py-3 px-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelStyles[student.el_level] || ""}`}>
                                                {student.el_level}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-muted-foreground">{student.elpac_level || "-"}</td>
                                        <td className="py-3 px-2 text-muted-foreground">{student.primary_language}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}