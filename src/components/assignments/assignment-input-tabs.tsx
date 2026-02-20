"use client";

import { useState } from "react";
import { FileText, Upload, Link2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TextInputTab } from "./text-input-tab";
import { FileUploadTab } from "./file-upload-tab";
import { GoogleLinkTab } from "./google-link-tab";
import type { SourceType } from "@/lib/hooks/use-assignment-form";

interface AssignmentInputTabsProps {
  content: string;
  sourceType: SourceType;
  onContentChange: (content: string, sourceType: SourceType, fileName?: string) => void;
}

export function AssignmentInputTabs({
  content,
  sourceType,
  onContentChange,
}: AssignmentInputTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(sourceType);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="text" className="gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Type or Paste</span>
          <span className="sm:hidden">Text</span>
        </TabsTrigger>
        <TabsTrigger value="upload" className="gap-2">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload File</span>
          <span className="sm:hidden">Upload</span>
        </TabsTrigger>
        <TabsTrigger value="google_doc" className="gap-2">
          <Link2 className="h-4 w-4" />
          <span className="hidden sm:inline">Google Docs</span>
          <span className="sm:hidden">Google</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="text">
        <TextInputTab
          content={activeTab === "text" ? content : ""}
          onChange={(text) => onContentChange(text, "text")}
        />
      </TabsContent>

      <TabsContent value="upload">
        <FileUploadTab
          content={activeTab === "upload" ? content : ""}
          onChange={(text, fileName) =>
            onContentChange(text, "upload", fileName)
          }
        />
      </TabsContent>

      <TabsContent value="google_doc">
        <GoogleLinkTab
          content={activeTab === "google_doc" ? content : ""}
          onChange={(text) => onContentChange(text, "google_doc")}
        />
      </TabsContent>
    </Tabs>
  );
}
