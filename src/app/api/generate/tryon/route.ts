import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { tryOnSchema } from "@/lib/validations/generate";
import { generateRateLimit } from "@/utils/rateLimit";
import { generateTryOn } from "@/lib/ai/gemini";
import { createGeneration } from "@/lib/db/queries/generations";
import { getUserById, updateUserTokens } from "@/lib/db/queries/users";
import { AI_MODELS } from "@/constants/ai";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Validate input
    const body = await req.json();
    const validatedFields = tryOnSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten(),
        },
        { status: 422 },
      );
    }

    const {
      userPhotoBase64,
      userPhotoMimeType,
      itemPhotoBase64,
      itemPhotoMimeType,
    } = validatedFields.data;

    // 3. Rate limit check
    const { success, reset } = await generateRateLimit.limit(userId);
    if (!success) {
      return NextResponse.json(
        { error: "rate_limited", retryAfter: reset },
        { status: 429 },
      );
    }

    // 4. Verify tokens/limit
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan !== "pro" && (user.tokens ?? 0) <= 0) {
      return NextResponse.json({ error: "limit_exceeded" }, { status: 429 });
    }

    // 5. Call AI service
    const startTime = Date.now();
    let resultImageBase64: string;

    try {
      resultImageBase64 = await generateTryOn(
        userPhotoBase64,
        itemPhotoBase64,
        userPhotoMimeType,
        itemPhotoMimeType,
      );
    } catch (error: unknown) {
      console.error("AI Generation Error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "AI generation failed";

      // Save failed generation to DB for audit
      await createGeneration({
        userId,
        mode: "tryon",
        status: "failed",
        errorMessage,
        modelUsed: AI_MODELS.IMAGE,
      });

      return NextResponse.json(
        { error: "generation_failed", message: errorMessage },
        { status: 500 },
      );
    }

    const duration = Date.now() - startTime;

    // 6. Save successful generation to DB
    const generation = await createGeneration({
      userId,
      mode: "tryon",
      status: "completed",
      resultImageBase64,
      modelUsed: AI_MODELS.IMAGE,
      generationTimeMs: duration,
    });

    // 7. Deduct token if not pro
    if (user.plan !== "pro") {
      await updateUserTokens(userId, -1);
    }

    // 8. Return result
    return NextResponse.json({
      generationId: generation.id,
      imageBase64: resultImageBase64,
      mode: "tryon",
      createdAt: generation.createdAt,
    });
  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
