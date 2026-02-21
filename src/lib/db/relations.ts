import { relations } from "drizzle-orm";
import {
  users,
  accounts,
  sessions,
  generations,
  wardrobeCollections,
  wardrobeItems,
  advisorSessions,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  generations: many(generations),
  wardrobeCollections: many(wardrobeCollections),
  wardrobeItems: many(wardrobeItems),
  advisorSessions: many(advisorSessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
  wardrobeItem: one(wardrobeItems, {
    fields: [generations.id],
    references: [wardrobeItems.generationId],
  }),
}));

export const wardrobeCollectionsRelations = relations(
  wardrobeCollections,
  ({ one, many }) => ({
    user: one(users, {
      fields: [wardrobeCollections.userId],
      references: [users.id],
    }),
    items: many(wardrobeItems),
  }),
);

export const wardrobeItemsRelations = relations(wardrobeItems, ({ one }) => ({
  user: one(users, {
    fields: [wardrobeItems.userId],
    references: [users.id],
  }),
  collection: one(wardrobeCollections, {
    fields: [wardrobeItems.collectionId],
    references: [wardrobeCollections.id],
  }),
  generation: one(generations, {
    fields: [wardrobeItems.generationId],
    references: [generations.id],
  }),
}));

export const advisorSessionsRelations = relations(
  advisorSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [advisorSessions.userId],
      references: [users.id],
    }),
  }),
);
