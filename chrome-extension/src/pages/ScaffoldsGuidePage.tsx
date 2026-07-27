import React from "react";
import { Layers, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

export default function ScaffoldsGuidePage() {
    return (
        <div className="space-y-6 p-4 md:p-6">
            <Link href="/eld-guide">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to ELD Guide
                </Button>
            </Link>
            <h1 className="scaffold-heading">Scaffolds Guide</h1>
            <p className="scaffold-description mt-1">Types of scaffolds and best practices for each EL level.</p>

            <div className="grid grid-cols-1 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Color Coding</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Highlight parts of speech (nouns, verbs, adjectives) or key vocabulary using different colors. Best for Emerging and Expanding students to help them identify text patterns.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Chunking</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Break longer texts into smaller, manageable sections with clear headings. Helps all EL levels process complex information.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Sentence Frames</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Provide sentence starters and frames that match the academic task. Essential for Emerging students, helpful for Expanding.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Word Banks</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Include key vocabulary with student-friendly definitions. Can be bilingual (English/Spanish) for Emerging students.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Visual Organizers</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Use graphic organizers like Venn diagrams, T-charts, and concept maps to help students organize their thinking visually.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}