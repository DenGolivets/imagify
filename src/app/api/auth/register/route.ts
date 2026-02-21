import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.flatten() },
        { status: 422 },
      );
    }

    const { email, password, name } = validatedFields.data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user - initial tokens are 50 by default in DB schema
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash: hashedPassword,
        role: "user",
        plan: "free",
        tokens: 50, // Explicitly setting though it's default
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    return NextResponse.json(
      { user: newUser, message: "Account created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
