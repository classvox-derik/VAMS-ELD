export async function downloadPdf(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Preview element not found");
  }

  // Dynamic import to avoid SSR issues
  const html2pdf = (await import("html2pdf.js")).default;

  await html2pdf()
    .set({
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename,
      image: { type: "jpeg" as const, quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "mm" as const,
        format: "letter" as const,
        orientation: "portrait" as const,
      },
    })
    .from(element)
    .save();
}
