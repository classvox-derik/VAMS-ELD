import { BookOpen } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scaffold-heading">Library</h1>
        <p className="scaffold-description mt-1">
          Your saved scaffolded assignments will appear here.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <BookOpen className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground">No saved assignments yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Scaffolded assignments will be saved here after generation.
        </p>
      </div>
    </div>
  );
}
