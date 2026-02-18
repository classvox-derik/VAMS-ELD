"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FileUploadTabProps {
  content: string;
  onChange: (content: string, fileName?: string) => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
};

export function FileUploadTab({ content, onChange }: FileUploadTabProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFileName(file.name);
      setFileSize(file.size);
      setParseError(null);
      setIsParsing(true);

      try {
        // For .txt files, read directly
        if (file.name.endsWith(".txt")) {
          const text = await file.text();
          onChange(text, file.name);
          setIsParsing(false);
          return;
        }

        // For PDF and DOCX, use client-side parsing via dynamic import
        const { parseFile } = await import("@/lib/parsers");
        const text = await parseFile(file);
        onChange(text, file.name);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not extract text. Try pasting the text manually.";
        setParseError(message);
        onChange("", undefined);
      } finally {
        setIsParsing(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED,
      maxSize: MAX_SIZE,
      maxFiles: 1,
    });

  function handleRemove() {
    setFileName(null);
    setFileSize(0);
    setParseError(null);
    onChange("", undefined);
  }

  const rejectionMessage = fileRejections[0]?.errors[0]?.code === "file-too-large"
    ? "File must be under 10MB."
    : fileRejections[0]?.errors[0]?.code === "file-invalid-type"
    ? "Only PDF, Word (.docx), and text files are supported."
    : fileRejections[0]?.errors[0]?.message;

  // Show extracted content for editing
  if (content && fileName && !isParsing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{fileName}</span>
            <span className="text-muted-foreground">
              ({(fileSize / 1024).toFixed(1)} KB)
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleRemove}
            aria-label="Remove file"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Extracted text shown below. You can edit it before proceeding.
        </p>
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value, fileName)}
          rows={12}
          className="resize-y min-h-[240px]"
        />
        <div className="text-right text-xs text-muted-foreground">
          {content.length.toLocaleString()} characters
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          isParsing && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} />
        {isParsing ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-sm font-medium">Processing {fileName}...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Extracting text from your document
            </p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop file here" : "Drag file here or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, Word (.docx), or text files up to 10MB
            </p>
          </>
        )}
      </div>

      {(parseError || rejectionMessage) && (
        <p className="text-sm text-destructive">
          {parseError || rejectionMessage}
        </p>
      )}
    </div>
  );
}
