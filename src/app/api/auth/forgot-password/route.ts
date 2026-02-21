import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = forgotPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 422 });
    }

    const { email } = validatedFields.data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Security: Always return success even if user doesn't exist to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists, a reset link will be sent",
      });
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await db
      .insert(verificationTokens)
      .values({
        identifier: email,
        token,
        expires,
      })
      .onConflictDoUpdate({
        target: verificationTokens.token,
        set: { token, expires },
      });

    // TODO: Send email with Resend
    console.log(
      `Password reset link for ${email}: /reset-password?token=${token}`,
    );

    return NextResponse.json({
      message: "If an account exists, a reset link will be sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
