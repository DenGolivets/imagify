import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { advisorSchema } from "@/lib/validations/advisor";
import { advisorRateLimit } from "@/utils/rateLimit";
import { getStyleAdvice, extractGeneratePrompt } from "@/lib/ai/groq";
import { createAdvisorSession } from "@/lib/db/queries/advisor";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Rate limit check
    const { success, reset } = await advisorRateLimit.limit(userId);
    if (!success) {
      return NextResponse.json(
        { error: "rate_limited", retryAfter: reset },
        { status: 429 },
      );
    }

    // 3. Validate input
    const body = await req.json();
    const validatedFields = advisorSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten(),
        },
        { status: 422 },
      );
    }

    const { message, photoBase64, photoMimeType } = validatedFields.data;

    // 4. Call Groq for Style Advice
    const advice = await getStyleAdvice({
      userMessage: message,
      photoBase64,
      photoMimeType,
    });

    // 5. Extract a generation prompt from the advice
    const generatedPrompt = await extractGeneratePrompt(advice);

    // 6. Save session to DB
    const advisorSession = await createAdvisorSession({
      userId,
      userMessage: message,
      aiResponse: advice,
      extractedPrompt: generatedPrompt,
      userPhotoUrl: photoBase64, // Storing base64 for now as per simple session persistence
    });

    // 7. Return result
    return NextResponse.json({
      sessionId: advisorSession.id,
      advice,
      generatedPrompt,
      createdAt: advisorSession.createdAt,
    });
  } catch (error: unknown) {
    console.error("Advisor API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
