import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  varchar,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const generationModeEnum = pgEnum("generation_mode", [
  "tryon", // Photo + Item Photo
  "from_prompt", // Text prompt only
  "photo_text", // Photo + text description
]);

export const generationStatusEnum = pgEnum("generation_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const userPlanEnum = pgEnum("user_plan", ["free", "pro"]);

// --- Tables ---

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").default("user").notNull(),
  plan: userPlanEnum("plan").default("free").notNull(),

  // Token System
  tokens: integer("tokens").default(50).notNull(), // 50 for users, 1000 for admins (set in seed/logic)

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: text("session_token").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const generations = pgTable("generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mode: generationModeEnum("mode").notNull(),
  status: generationStatusEnum("status").default("pending").notNull(),

  // Input
  prompt: text("prompt"),
  userPhotoUrl: text("user_photo_url"),
  itemPhotoUrl: text("item_photo_url"),

  // Output
  resultImageBase64: text("result_image_base64"),
  aiPromptUsed: text("ai_prompt_used"),

  // Meta
  modelUsed: varchar("model_used", { length: 100 }),
  generationTimeMs: integer("generation_time_ms"),
  errorMessage: text("error_message"),

  savedToWardrobe: boolean("saved_to_wardrobe").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const wardrobeCollections = pgTable("wardrobe_collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  coverImageBase64: text("cover_image_base64"),
  itemCount: integer("item_count").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const wardrobeItems = pgTable("wardrobe_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  generationId: uuid("generation_id").references(() => generations.id, {
    onDelete: "set null",
  }),
  collectionId: uuid("collection_id").references(() => wardrobeCollections.id, {
    onDelete: "set null",
  }),

  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageBase64: text("image_base64").notNull(),
  tags: text("tags").array().default([]),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const advisorSessions = pgTable("advisor_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  userPhotoUrl: text("user_photo_url"),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  extractedPrompt: text("extracted_prompt"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
