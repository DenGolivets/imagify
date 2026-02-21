import { db } from "../client";
import { advisorSessions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const createAdvisorSession = async (
  data: typeof advisorSessions.$inferInsert,
) => {
  const [newSession] = await db
    .insert(advisorSessions)
    .values(data)
    .returning();
  return newSession;
};

export const getAdvisorHistory = async (userId: string, limit = 20) => {
  return await db.query.advisorSessions.findMany({
    where: eq(advisorSessions.userId, userId),
    orderBy: [desc(advisorSessions.createdAt)],
    limit,
  });
};
