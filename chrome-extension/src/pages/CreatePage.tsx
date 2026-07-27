import React, { useState, useRef } from "react";
import { ArrowRight, Check, Loader2, Upload, File } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { cn } from "../lib/utils";
import { useLocation } from "wouter";
import { toast } from "sonner";

const steps = [
    { number: 1, label: "Input Assignment" },
    { number: 2, label: "Assignment Details" },
    { number: 3, label: "Select & Generate" },
];

const scaffoldOptions = [
    { id: "color_coding", label: "Color Coding", description: "Highlight parts of speech or key vocabulary" },
    { id: "chunking", label: "Chunking", description: "Break text into smaller, manageable sections" },
    { id: "sentence_frames", label: "Sentence Frames", description: "Provide sentence starters and frames" },
    { id: "word_banks", label: "Word Banks", description: "Include vocabulary with definitions" },
    { id: "visual_organizers", label: "Visual Organizers", description: "Add graphic organizers and tables" },
];

function extractJsonFromText(text: string): Record<string, unknown> | null {
    let cleaned = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    try {
        const parsed = JSON.parse(cleaned);
        if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, unknown>;
    } catch { }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
            const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
            if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, unknown>;
        } catch { }
    }
    return null;
}

export default function CreatePage() {
    const [, navigate] = useLocation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [content, setContent] = useState("");
    const [fileName, setFileName] = useState("");
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("ELA");
    const [gradeLevel, setGradeLevel] = useState(6);
    const [selectedScaffolds, setSelectedScaffolds] = useState<string[]>([]);
    const [generating, setGenerating] = useState(false);

    const canProceedToStep2 = content.length >= 50;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        try {
            const text = await file.text();
            // Handle .docx files would need mammoth - for now handle .txt and plain text
            setContent(text);
            toast.success(`Loaded "${file.name}" (${text.length} characters)`);
        } catch {
            toast.error("Failed to read file. Try pasting the content directly.");
        }
    };

    const handleGenerate = async () => {
        if (selectedScaffolds.length === 0) {
            toast.error("Please select at least one scaffold type.");
            return;
        }
        setGenerating(true);
        try {
            const response = await chrome.runtime.sendMessage({
                type: "generateScaffold",
                prompt: `Create a scaffolded assignment for ELD students.\n\nTitle: ${title}\nSubject: ${subject}\nGrade: ${gradeLevel}\n\nScaffolds to apply: ${selectedScaffolds.join(", ")}\n\nOriginal content:\n${content}`,
                systemPrompt: "You are an expert ELD scaffolding specialist. Generate a differentiated assignment with the requested scaffolds. Return ONLY valid JSON with no markdown fences. Fields: scaffolded_html (string with full HTML content), word_bank (array of {term, definition} or null), scaffolds_used (string array), teacher_instructions (string or null).",
                maxTokens: 16384,
            });

            if (response?.success && response.data) {
                // Parse the OpenRouter response
                const openRouterResult = response.data;
                const rawContent = openRouterResult.choices?.[0]?.message?.content;
                if (!rawContent) {
                    toast.error("AI returned empty response");
                    setGenerating(false);
                    return;
                }

                // Try to extract JSON
                const parsed = extractJsonFromText(rawContent);
                if (!parsed) {
                    toast.error("Failed to parse AI response. Please try again.");
                    setGenerating(false);
                    return;
                }

                // Build the result in the expected format
                const result = {
                    scaffolded_html: (parsed.scaffolded_html || parsed.html || rawContent) as string,
                    word_bank: (parsed.word_bank || parsed.wordBank || null) as { term: string; definition: string }[] | null,
                    scaffolds_used: (parsed.scaffolds_used || parsed.scaffoldsUsed || selectedScaffolds) as string[],
                    teacher_instructions: (parsed.teacher_instructions || parsed.teacherInstructions || null) as string | null,
                };

                // Store result in sessionStorage for the result page
                sessionStorage.setItem("scaffold-result", JSON.stringify(result));
                navigate("/create/result");
            } else {
                toast.error(response?.error || "Generation failed");
            }
        } catch (err) {
            toast.error("Failed to generate scaffold. Please try again.");
        }
        setGenerating(false);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="scaffold-heading">Create Assignment</h1>
                <p className="scaffold-description mt-1">Input your assignment, add details, then select scaffolds to apply.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
                {steps.map((step, idx) => (
                    <div key={step.number} className="flex items-center gap-2">
                        <button
                            onClick={() => { if (step.number < currentStep) setCurrentStep(step.number); }}
                            disabled={step.number > currentStep}
                            className={cn(
                                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                                step.number === currentStep
                                    ? "bg-eld-space-indigo/15 text-eld-space-indigo font-bold dark:bg-eld-dusty-grape dark:text-white"
                                    : step.number < currentStep
                                        ? "bg-eld-space-indigo/10 text-eld-space-indigo cursor-pointer dark:bg-eld-dusty-grape/20 dark:text-eld-seashell"
                                        : "bg-eld-almond-silk/20 text-eld-space-indigo/50 dark:bg-gray-800 dark:text-gray-500"
                            )}
                        >
                            {step.number < currentStep ? <Check className="h-3 w-3" /> : <span>{step.number}</span>}
                            <span className="hidden sm:inline">{step.label}</span>
                        </button>
                        {idx < steps.length - 1 && (
                            <div className={cn("h-0.5 w-8 sm:w-12", step.number < currentStep ? "bg-eld-space-indigo dark:bg-eld-dusty-grape" : "bg-eld-almond-silk/40 dark:bg-gray-700")} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: Input */}
            {currentStep === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Step 1: Input Your Assignment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* File upload */}
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt,.docx,.doc,.pdf,.html,.htm"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="gap-2 w-full"
                            >
                                <Upload className="h-4 w-4" />
                                Upload File (.txt, .docx, .pdf)
                            </Button>
                            {fileName && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Loaded: {fileName}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-eld-almond-silk/40" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground dark:bg-gray-900">or paste text</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Assignment Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your assignment text here... (minimum 50 characters)"
                                className="min-h-[200px]"
                            />
                            <p className="text-xs text-muted-foreground">{content.length} characters</p>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2} className="gap-2">
                                Continue to Details <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Step 2: Assignment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Assignment Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chapter 3 Reading Response" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <select
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="flex h-11 w-full rounded-xl border border-eld-almond-silk/60 bg-white px-3 py-2 text-sm text-eld-space-indigo dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                >
                                    {["ELA", "ELD", "IST", "Math", "Science", "Social Studies", "Other"].map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="grade">Grade Level</Label>
                                <select
                                    id="grade"
                                    value={gradeLevel}
                                    onChange={(e) => setGradeLevel(Number(e.target.value))}
                                    className="flex h-11 w-full rounded-xl border border-eld-almond-silk/60 bg-white px-3 py-2 text-sm text-eld-space-indigo dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                >
                                    {[5, 6, 7, 8].map((g) => (
                                        <option key={g} value={g}>Grade {g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between pt-2">
                            <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                            <Button onClick={() => setCurrentStep(3)} className="gap-2" disabled={!title}>
                                Continue to Scaffolds <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Select & Generate */}
            {currentStep === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Step 3: Select Scaffolds & Generate</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {scaffoldOptions.map((scaffold) => (
                                <label
                                    key={scaffold.id}
                                    className={cn(
                                        "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
                                        selectedScaffolds.includes(scaffold.id)
                                            ? "border-eld-space-indigo bg-eld-space-indigo/5 dark:border-eld-dusty-grape dark:bg-eld-dusty-grape/10"
                                            : "border-eld-almond-silk/40 hover:border-eld-almond-silk dark:border-gray-700"
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedScaffolds.includes(scaffold.id)}
                                        onChange={() => {
                                            setSelectedScaffolds((prev) =>
                                                prev.includes(scaffold.id) ? prev.filter((s) => s !== scaffold.id) : [...prev, scaffold.id]
                                            );
                                        }}
                                        className="mt-1 h-4 w-4 rounded border-eld-almond-silk text-eld-space-indigo focus:ring-eld-space-indigo"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-eld-space-indigo dark:text-gray-200">{scaffold.label}</p>
                                        <p className="text-xs text-muted-foreground">{scaffold.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-between pt-2">
                            <Button variant="ghost" onClick={() => setCurrentStep(2)}>Back</Button>
                            <Button onClick={handleGenerate} disabled={generating || selectedScaffolds.length === 0} className="gap-2">
                                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {generating ? "Generating..." : "Generate Scaffolded Assignment"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}