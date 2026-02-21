import { db } from "../client";
import { wardrobeItems, wardrobeCollections } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// --- Items ---

export const getWardrobeItems = async (userId: string) => {
  return await db.query.wardrobeItems.findMany({
    where: eq(wardrobeItems.userId, userId),
    orderBy: [desc(wardrobeItems.createdAt)],
    with: {
      collection: true,
    },
  });
};

export const saveToWardrobe = async (
  data: typeof wardrobeItems.$inferInsert,
) => {
  const [newItem] = await db.insert(wardrobeItems).values(data).returning();

  // Increment collection count if applicable
  if (data.collectionId) {
    const collection = await db.query.wardrobeCollections.findFirst({
      where: eq(wardrobeCollections.id, data.collectionId),
    });

    if (collection) {
      await db
        .update(wardrobeCollections)
        .set({ itemCount: (collection.itemCount ?? 0) + 1 })
        .where(eq(wardrobeCollections.id, data.collectionId));
    }
  }

  return newItem;
};

export const deleteWardrobeItem = async (id: string) => {
  return await db.delete(wardrobeItems).where(eq(wardrobeItems.id, id));
};

// --- Collections ---

export const getCollections = async (userId: string) => {
  return await db.query.wardrobeCollections.findMany({
    where: eq(wardrobeCollections.userId, userId),
    orderBy: [desc(wardrobeCollections.createdAt)],
  });
};

export const createCollection = async (
  data: typeof wardrobeCollections.$inferInsert,
) => {
  const [newCollection] = await db
    .insert(wardrobeCollections)
    .values(data)
    .returning();
  return newCollection;
};
