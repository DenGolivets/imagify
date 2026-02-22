import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getAdvisorHistory } from "@/lib/db/queries/advisor";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const history = await getAdvisorHistory(session.user.id, limit);

    return NextResponse.json(history);
  } catch (error: unknown) {
    console.error("Advisor History API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
