import { db } from "../client";
import { generations } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const createGeneration = async (
  data: typeof generations.$inferInsert,
) => {
  const [newGen] = await db.insert(generations).values(data).returning();
  return newGen;
};

export const getGenerationsByUser = async (userId: string, limit = 50) => {
  return await db.query.generations.findMany({
    where: eq(generations.userId, userId),
    orderBy: [desc(generations.createdAt)],
    limit,
  });
};

export const updateGeneration = async (
  id: string,
  data: Partial<typeof generations.$inferInsert>,
) => {
  const [updatedGen] = await db
    .update(generations)
    .set(data)
    .where(eq(generations.id, id))
    .returning();
  return updatedGen;
};
