import { db } from "../client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const getUserById = async (id: string) => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const getUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

export const createUser = async (data: typeof users.$inferInsert) => {
  const [newUser] = await db.insert(users).values(data).returning();
  return newUser;
};

export const updateUser = async (
  id: string,
  data: Partial<typeof users.$inferInsert>,
) => {
  const [updatedUser] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
};

export const updateUserTokens = async (id: string, amount: number) => {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");

  const [updatedUser] = await db
    .update(users)
    .set({
      tokens: (user.tokens ?? 0) + amount,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
};

export const deleteUser = async (id: string) => {
  return await db.delete(users).where(eq(users.id, id));
};
