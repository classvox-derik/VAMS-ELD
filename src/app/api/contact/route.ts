import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "dvandiest@brightstarschools.org";

export async function POST(req: NextRequest) {
  const { firstName, lastName, message } = await req.json();

  if (!firstName?.trim() || !lastName?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "First name, last name, and message are required." },
      { status: 400 }
    );
  }

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
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: `"VAMS ELD Platform" <${smtpUser}>`,
    to: RECIPIENT_EMAIL,
    subject: `Message from ${firstName.trim()} ${lastName.trim()} – VAMS ELD`,
    text: `You have a new message from ${firstName.trim()} ${lastName.trim()}:\n\n${message.trim()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22223b; border-bottom: 2px solid #22223b; padding-bottom: 8px;">
          New Message – VAMS ELD Platform
        </h2>
        <p style="color: #555; margin-bottom: 4px;"><strong>From:</strong> ${firstName.trim()} ${lastName.trim()}</p>
        <div style="background: #f5f5f5; border-left: 4px solid #22223b; padding: 16px; margin-top: 16px; border-radius: 4px;">
          <p style="margin: 0; white-space: pre-wrap; color: #333;">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Sent via the VAMS ELD Scaffolding Platform
        </p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
