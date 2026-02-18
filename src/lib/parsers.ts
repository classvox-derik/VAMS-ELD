export async function parseWord(buffer: ArrayBuffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value.trim();
  } catch (error) {
    console.error("Word parse error:", error);
    throw new Error("Failed to parse Word document. Try pasting the text manually.");
  }
}

export async function parsePDFViaAPI(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/parse-pdf", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(data.error || "Failed to parse PDF.");
  }

  const data = await response.json();
  return data.text;
}

export async function parseFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return parsePDFViaAPI(file);
    case "docx":
    case "doc": {
      const buffer = await file.arrayBuffer();
      return parseWord(buffer);
    }
    case "txt": {
      const text = await file.text();
      return text.trim();
    }
    default:
      throw new Error(`Unsupported file type: .${ext}. Use PDF, Word, or text files.`);
  }
}
