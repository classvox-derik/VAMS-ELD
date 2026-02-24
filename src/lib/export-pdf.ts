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
      margin: [12, 12, 12, 12] as [number, number, number, number],
      filename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        // Render at 800px wide so the canvas matches the PDF content area,
        // preventing text from being scaled down and overlapping.
        windowWidth: 800,
        scrollX: 0,
        scrollY: 0,
        logging: false,
      },
      jsPDF: {
        unit: "mm" as const,
        format: "letter" as const,
        orientation: "portrait" as const,
      },
      // Prevent text and elements from being cut across page boundaries.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pagebreak: { mode: ["avoid-all", "css"] },
    } as any)
    .from(element)
    .save();
}
