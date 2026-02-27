import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";

const DAILY_GLOBAL_LIMIT = parseInt(process.env.DAILY_GLOBAL_LIMIT ?? "250", 10);
const DAILY_PER_USER_LIMIT = parseInt(process.env.DAILY_PER_USER_LIMIT ?? "10", 10);

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { getTodayGlobalUsage, getTodayUserUsage } = await import(
      "@/lib/queries/differentiated-assignments"
    );

    const [globalUsed, userUsed] = await Promise.all([
      getTodayGlobalUsage(),
      getTodayUserUsage(user.id),
    ]);

    return NextResponse.json({
      used: userUsed,
      limit: DAILY_PER_USER_LIMIT,
      globalUsed,
      globalLimit: DAILY_GLOBAL_LIMIT,
    });
  } catch {
    // Database not available — return defaults
    return NextResponse.json({
      used: 0,
      limit: DAILY_PER_USER_LIMIT,
      globalUsed: 0,
      globalLimit: DAILY_GLOBAL_LIMIT,
    });
  }
}
