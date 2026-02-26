import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "dvandiest@brightstarschools.org";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function row(label: string, value: string | undefined) {
  if (!value?.trim()) return "";
  return `
    <tr>
      <td style="padding: 8px 12px; font-weight: 600; color: #444; background: #f0f0f4; white-space: nowrap; vertical-align: top; border-bottom: 1px solid #e0e0e8;">${label}</td>
      <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #e0e0e8; white-space: pre-wrap;">${escapeHtml(value.trim())}</td>
    </tr>`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    reporterName,
    reporterEmail,
    category,
    severity,
    affectedPage,
    description,
    stepsToReproduce,
    expectedBehavior,
    actualBehavior,
    browserDevice,
    additionalNotes,
  } = body as Record<string, string | undefined>;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: "Email service is not configured. Please contact your administrator." },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const severityColor: Record<string, string> = {
    Critical: "#dc2626",
    High: "#ea580c",
    Medium: "#d97706",
    Low: "#16a34a",
  };
  const sev = severity?.trim() ?? "Not specified";
  const sevColor = severityColor[sev] ?? "#555";

  const subjectName = reporterName?.trim() ? reporterName.trim() : "Anonymous";
  const subjectCategory = category?.trim() ? ` [${category.trim()}]` : "";

  await transporter.sendMail({
    from: `"VAMS ELD Platform" <${smtpUser}>`,
    to: RECIPIENT_EMAIL,
    subject: `Bug Report${subjectCategory} from ${subjectName} – VAMS ELD`,
    text: [
      `Bug Report – VAMS ELD Platform`,
      `---`,
      reporterName ? `Reporter: ${reporterName.trim()}` : "",
      reporterEmail ? `Email: ${reporterEmail.trim()}` : "",
      category ? `Category: ${category.trim()}` : "",
      severity ? `Severity: ${severity.trim()}` : "",
      affectedPage ? `Affected Page: ${affectedPage.trim()}` : "",
      description ? `Description:\n${description.trim()}` : "",
      stepsToReproduce ? `Steps to Reproduce:\n${stepsToReproduce.trim()}` : "",
      expectedBehavior ? `Expected Behavior:\n${expectedBehavior.trim()}` : "",
      actualBehavior ? `Actual Behavior:\n${actualBehavior.trim()}` : "",
      browserDevice ? `Browser / Device:\n${browserDevice.trim()}` : "",
      additionalNotes ? `Additional Notes:\n${additionalNotes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    html: `
      <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; color: #333;">
        <h2 style="color: #22223b; border-bottom: 3px solid #22223b; padding-bottom: 10px; margin-bottom: 20px;">
          🐛 Bug Report – VAMS ELD Platform
        </h2>

        <div style="margin-bottom: 16px;">
          <span style="display: inline-block; background: ${sevColor}; color: #fff; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 12px; letter-spacing: 0.05em;">
            ${escapeHtml(sev)} Severity
          </span>
          ${category?.trim() ? `<span style="display: inline-block; background: #e8e8f0; color: #22223b; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 12px; margin-left: 6px;">${escapeHtml(category.trim())}</span>` : ""}
        </div>

        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e0e0e8; border-radius: 6px; overflow: hidden; margin-bottom: 24px;">
          ${row("Reporter", reporterName)}
          ${row("Email", reporterEmail)}
          ${row("Category", category)}
          ${row("Severity", severity)}
          ${row("Affected Page", affectedPage)}
          ${row("Browser / Device", browserDevice)}
        </table>

        ${description?.trim() ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #22223b; font-size: 14px; margin-bottom: 6px;">Description</h3>
          <div style="background: #f5f5f5; border-left: 4px solid #22223b; padding: 14px 16px; border-radius: 4px; white-space: pre-wrap; font-size: 14px;">${escapeHtml(description.trim())}</div>
        </div>` : ""}

        ${stepsToReproduce?.trim() ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #22223b; font-size: 14px; margin-bottom: 6px;">Steps to Reproduce</h3>
          <div style="background: #f5f5f5; border-left: 4px solid #6366f1; padding: 14px 16px; border-radius: 4px; white-space: pre-wrap; font-size: 14px;">${escapeHtml(stepsToReproduce.trim())}</div>
        </div>` : ""}

        ${expectedBehavior?.trim() || actualBehavior?.trim() ? `
        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
          ${expectedBehavior?.trim() ? `
          <div style="flex: 1;">
            <h3 style="color: #16a34a; font-size: 14px; margin-bottom: 6px;">Expected Behavior</h3>
            <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 14px; border-radius: 4px; white-space: pre-wrap; font-size: 14px;">${escapeHtml(expectedBehavior.trim())}</div>
          </div>` : ""}
          ${actualBehavior?.trim() ? `
          <div style="flex: 1;">
            <h3 style="color: #dc2626; font-size: 14px; margin-bottom: 6px;">Actual Behavior</h3>
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 14px; border-radius: 4px; white-space: pre-wrap; font-size: 14px;">${escapeHtml(actualBehavior.trim())}</div>
          </div>` : ""}
        </div>` : ""}

        ${additionalNotes?.trim() ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #22223b; font-size: 14px; margin-bottom: 6px;">Additional Notes</h3>
          <div style="background: #f5f5f5; border-left: 4px solid #94a3b8; padding: 14px 16px; border-radius: 4px; white-space: pre-wrap; font-size: 14px;">${escapeHtml(additionalNotes.trim())}</div>
        </div>` : ""}

        <p style="color: #999; font-size: 12px; margin-top: 28px; border-top: 1px solid #e0e0e8; padding-top: 12px;">
          Submitted via the VAMS ELD Scaffolding Platform Bug Report form
        </p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
