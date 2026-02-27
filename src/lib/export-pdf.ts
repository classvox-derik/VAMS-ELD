export interface ScaffoldPdfOptions {
  html: string;
  title: string;
  elLevel?: string;
  wordBank?: { term: string; definition: string }[];
  teacherInstructions?: string;
  filename: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build a complete PDF-ready HTML document from scaffold data.
 */
function buildPdfHtml(opts: ScaffoldPdfOptions): string {
  const parts: string[] = [];

  // Title + EL level header
  parts.push(
    `<h1 style="font-size:18pt;font-weight:700;margin:0 0 4px;color:#1a1a2e;">${esc(opts.title)}</h1>`
  );
  if (opts.elLevel) {
    parts.push(
      `<p style="font-size:10pt;color:#666;margin:0 0 12px;">EL Level: ${esc(opts.elLevel)}</p>`
    );
  }
  parts.push(
    `<hr style="border:none;border-top:1px solid #ccc;margin:0 0 16px;" />`
  );

  // Scaffolded content (preserves inline styles from Gemini for color-coding, chunking, etc.)
  parts.push(
    `<div style="font-size:12pt;line-height:1.7;">${opts.html}</div>`
  );

  // Word bank
  if (opts.wordBank?.length) {
    parts.push(`
      <div style="margin-top:24px;padding:16px;border:2px solid #2563eb;border-radius:8px;background:#eff6ff;page-break-inside:avoid;">
        <h2 style="font-size:14pt;font-weight:700;margin:0 0 10px;color:#1e40af;">Word Bank</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${opts.wordBank
            .map(
              (w) => `
            <tr>
              <td style="padding:4px 12px 4px 0;font-weight:600;color:#1e40af;white-space:nowrap;vertical-align:top;">${esc(w.term)}</td>
              <td style="padding:4px 0;color:#333;">${esc(w.definition)}</td>
            </tr>`
            )
            .join("")}
        </table>
      </div>
    `);
  }

  // Teacher instructions
  if (opts.teacherInstructions) {
    parts.push(`
      <div style="margin-top:24px;padding:16px;border:1px solid #d1d5db;border-radius:8px;background:#f9fafb;page-break-inside:avoid;">
        <h2 style="font-size:12pt;font-weight:600;margin:0 0 6px;color:#374151;">Teacher Instructions</h2>
        <p style="font-size:11pt;color:#4b5563;line-height:1.5;margin:0;">${esc(opts.teacherInstructions)}</p>
      </div>
    `);
  }

  return parts.join("\n");
}

/**
 * Download a scaffolded assignment as a PDF.
 *
 * Creates a temporary element positioned within the viewport (at 0,0 behind
 * all other content) so html2canvas can reliably capture it.  Elements placed
 * at left:-9999px fall outside html2canvas's 800px virtual viewport and
 * produce blank pages.
 */
export async function downloadScaffoldPdf(
  opts: ScaffoldPdfOptions
): Promise<void> {
  const fullHtml = buildPdfHtml(opts);

  const container = document.createElement("div");
  const tempId = `pdf-export-${Date.now()}`;
  container.id = tempId;
  // Position within viewport at (0,0) behind everything.
  // html2canvas captures elements based on computed styles regardless of
  // z-index stacking, so this renders correctly even behind other content.
  container.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "width:800px",
    "padding:32px",
    "background:white",
    "color:#111",
    "z-index:-9999",
    "font-family:'Segoe UI',system-ui,-apple-system,sans-serif",
    "overflow:visible",
  ].join(";");
  container.innerHTML = fullHtml;
  document.body.appendChild(container);

  try {
    // Let the browser paint the element before capture
    await new Promise((r) => setTimeout(r, 50));
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );

    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf()
      .set({
        margin: [12, 12, 12, 12] as [number, number, number, number],
        filename: opts.filename,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
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
        // Use CSS-based page breaks only; "avoid-all" can push long content
        // off the page entirely.
        pagebreak: { mode: "css" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .from(container)
      .save();
  } finally {
    const el = document.getElementById(tempId);
    if (el) document.body.removeChild(el);
  }
}
