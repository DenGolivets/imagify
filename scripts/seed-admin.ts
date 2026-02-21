import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../src/lib/db/schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const sql = neon(url);
const db = drizzle(sql);

async function seedAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";

  if (!email || !password) {
    console.error("Usage: npm run db:seed-admin <email> <password> [name]");
    process.exit(1);
  }

  console.log(`Seeding admin user: ${email}...`);

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash: hashedPassword,
        role: "admin",
        plan: "pro",
        tokens: 1000,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          role: "admin",
          tokens: 1000,
          passwordHash: hashedPassword,
        },
      });

    console.log("✅ Admin user created/updated successfully with 1000 tokens!");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
