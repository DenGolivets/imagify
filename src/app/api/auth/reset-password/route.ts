import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = body;

    const validatedFields = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 422 });
    }

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const dbToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });

    if (!dbToken || dbToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db
      .update(users)
      .set({ passwordHash: hashedPassword })
      .where(eq(users.email, dbToken.identifier));

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
