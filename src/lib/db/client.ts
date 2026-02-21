import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";
import * as relations from "@/lib/db/relations";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);

/**
 * Drizzle database client initialized with Neon serverless and app schema.
 */
export const db = drizzle(sql, {
  schema: { ...schema, ...relations },
});
