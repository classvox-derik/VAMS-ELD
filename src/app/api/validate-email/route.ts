import { NextRequest, NextResponse } from "next/server";

// Server-side email validation endpoint.
// Call this before or during sign-up to double-check the domain.
// This blocks requests from non-Bright Star users even if they
// bypass the client-side form validation.

const ALLOWED_DOMAIN =
  process.env.ALLOWED_EMAIL_DOMAIN ?? "@brightstarschools.org";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { allowed: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.endsWith(ALLOWED_DOMAIN)) {
      return NextResponse.json(
        {
          allowed: false,
          message: "Please use your Bright Star Schools email to register.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ allowed: true });
  } catch {
    return NextResponse.json(
      { allowed: false, message: "Invalid request." },
      { status: 400 }
    );
  }
}
