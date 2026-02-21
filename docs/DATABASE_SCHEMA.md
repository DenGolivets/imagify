# Imagify — Database Schema (Neon PostgreSQL + Drizzle ORM)

## Overview

All data is stored in **Neon.tech PostgreSQL**. We use **Drizzle ORM** for type-safe schema definition, migrations, and queries.

Images are stored as:

- **Uploaded user photos**: Temporary URL via Vercel Blob (short TTL)
- **Generated result images**: Base64 data URI stored in the `generations` table

---

## 📦 Schema Tables

### 1. `users`

```typescript
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: text("password_hash"), // null for OAuth users
  image: text("image"), // Profile photo URL
  role: varchar("role", { length: 20 }).default("user").notNull(), // 'user' | 'admin'
  plan: varchar("plan", { length: 20 }).default("free").notNull(), // 'free' | 'pro'

  // Token System
  tokens: integer("tokens").default(50).notNull(), // 50 for users, 1000 for admins

  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
```

---

### 2. `accounts` (NextAuth OAuth)

```typescript
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: varchar("token_type", { length: 50 }),
  scope: text("scope"),
  idToken: text("id_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

### 3. `sessions` (NextAuth)

```typescript
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: text("session_token").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});
```

---

### 4. `generations`

Stores every AI generation (try-on, prompt-based, photo-text).

```typescript
export const GenerationMode = pgEnum("generation_mode", [
  "tryon", // Photo + Item Photo
  "from_prompt", // Text prompt only
  "photo_text", // Photo + text description
]);

export const GenerationStatus = pgEnum("generation_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const generations = pgTable("generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mode: GenerationMode("mode").notNull(),
  status: GenerationStatus("status").default("pending").notNull(),

  // Input data
  prompt: text("prompt"), // User text prompt (modes 1, 2)
  userPhotoUrl: text("user_photo_url"), // Original user upload (Blob URL or base64)
  itemPhotoUrl: text("item_photo_url"), // Item/clothing upload (for tryon mode)

  // AI output
  resultImageBase64: text("result_image_base64"), // Generated image as base64 data URI
  aiPromptUsed: text("ai_prompt_used"), // Actual prompt sent to Gemini

  // Metadata
  modelUsed: varchar("model_used", { length: 100 }), // 'gemini-2.5-flash'
  generationTimeMs: integer("generation_time_ms"), // How long it took
  errorMessage: text("error_message"), // If status = failed

  savedToWardrobe: boolean("saved_to_wardrobe").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

### 5. `wardrobe_items`

Saved looks / generated images that user wants to keep.

```typescript
export const wardrobe_items = pgTable("wardrobe_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  generationId: uuid("generation_id").references(() => generations.id, {
    onDelete: "set null",
  }),

  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageBase64: text("image_base64").notNull(), // The saved look image

  collectionId: uuid("collection_id").references(
    () => wardrobe_collections.id,
    { onDelete: "set null" },
  ),
  tags: text("tags").array().default([]),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
```

---

### 6. `wardrobe_collections`

User-defined groupings for wardrobe items (e.g., "Summer 2025", "Formal").

```typescript
export const wardrobe_collections = pgTable("wardrobe_collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  coverImageBase64: text("cover_image_base64"),
  itemCount: integer("item_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

### 7. `advisor_sessions`

Stores AI Style Advisor conversation history.

```typescript
export const advisor_sessions = pgTable("advisor_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  userPhotoUrl: text("user_photo_url"), // Photo user uploaded
  userMessage: text("user_message").notNull(), // User's style question
  aiResponse: text("ai_response").notNull(), // LLaMA generated advice (markdown)
  extractedPrompt: text("extracted_prompt"), // Extracted prompt for Generate Studio

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

### 8. `verification_tokens` (NextAuth)

```typescript
export const verification_tokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});
```

---

## 🔗 Relations

```typescript
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  generations: many(generations),
  wardrobeItems: many(wardrobe_items),
  wardrobeCollections: many(wardrobe_collections),
  advisorSessions: many(advisor_sessions),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, { fields: [generations.userId], references: [users.id] }),
  wardrobeItem: one(wardrobe_items, {
    fields: [generations.id],
    references: [wardrobe_items.generationId],
  }),
}));

export const wardrobeItemsRelations = relations(wardrobe_items, ({ one }) => ({
  user: one(users, { fields: [wardrobe_items.userId], references: [users.id] }),
  collection: one(wardrobe_collections, {
    fields: [wardrobe_items.collectionId],
    references: [wardrobe_collections.id],
  }),
  generation: one(generations, {
    fields: [wardrobe_items.generationId],
    references: [generations.id],
  }),
}));
```

---

## ⚙️ Drizzle Config

File: `drizzle/drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## 🗄️ Neon Client Setup

File: `src/lib/db/client.ts`

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
```

---

## 📊 Indexes for Performance

```sql
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_items_collection_id ON wardrobe_items(collection_id);
CREATE INDEX idx_advisor_sessions_user_id ON advisor_sessions(user_id);
```

---

## 🔑 Migration Commands

```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

# Open Drizzle Studio (visual DB explorer)
npx drizzle-kit studio

# Push schema directly (dev only, no migration files)
npx drizzle-kit push
```
