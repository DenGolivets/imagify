# Imagify — API Routes Reference

## Overview

All API routes live under `src/app/api/`. They use **Next.js Route Handlers** (App Router).
All endpoints require authentication unless marked **Public**.
All inputs validated with **Zod**.
All mutating endpoints rate-limited via **Upstash Redis**.

---

## 🔑 Auth Routes

### `GET/POST /api/auth/[...nextauth]`

NextAuth.js handler — handles all OAuth callbacks, sign-in, sign-out.

### `POST /api/auth/register`

Register a new user.

```typescript
// Input
{ name: string, email: string, password: string }

// Response
{ user: { id, email, name }, message: "Account created" }

// Errors
400 - Email already exists
422 - Validation error
```

### `POST /api/auth/forgot-password`

```typescript
// Input
{
  email: string;
}
// Sends reset email if user exists. Always returns 200 (no email enumeration).
```

### `POST /api/auth/reset-password`

```typescript
// Input
{ token: string, password: string, confirmPassword: string }
// Resets password if token valid and not expired.
```

---

## 🎨 Generate Routes (Protected)

### `POST /api/generate/tryon`

Virtual Try-On — merge person photo with item photo.

```typescript
// Input (multipart or JSON with base64)
{
  userPhotoBase64: string,   // base64 encoded, max 5MB
  userPhotoMimeType: string,
  itemPhotoBase64: string,
  itemPhotoMimeType: string,
}

// Response
{
  generationId: string,
  imageBase64: string,        // data:image/jpeg;base64,...
  mode: 'tryon',
  createdAt: string,
}

// Errors
429 - Rate limit exceeded
429 - Generation limit reached (free plan)
500 - AI generation failed
```

### `POST /api/generate/from-prompt`

Generate image from text prompt only.

```typescript
// Input
{
  prompt: string;
} // max 500 chars

// Response (same as tryon)
```

### `POST /api/generate/from-photo-text`

Edit a photo based on text description.

```typescript
// Input
{
  photoBase64: string,
  photoMimeType: string,
  description: string,    // max 500 chars
}

// Response (same as tryon)
```

---

## 💬 Advisor Routes (Protected)

### `POST /api/advisor/analyze`

Get AI fashion advice based on photo + question.

```typescript
// Input
{
  photoBase64?: string,      // optional
  photoMimeType?: string,
  userMessage: string,       // max 1000 chars
}

// Response
{
  sessionId: string,
  advice: string,            // Markdown formatted text
  extractedPrompt: string,   // Ready-to-use generate prompt
  createdAt: string,
}
```

### `GET /api/advisor/history`

Get user's advisor session history.

```typescript
// Query params: page=1&limit=10

// Response
{
  sessions: AdvisorSession[],
  total: number,
  page: number,
}
```

---

## 👗 Wardrobe Routes (Protected)

### `GET /api/wardrobe`

Get user's wardrobe items.

```typescript
// Query: page=1&limit=20&collectionId=uuid&tags=casual,summer

// Response
{
  items: WardrobeItem[],
  total: number,
}
```

### `POST /api/wardrobe`

Save a generation to wardrobe.

```typescript
// Input
{
  generationId: string,
  title?: string,
  collectionId?: string,
  tags?: string[],
}
```

### `DELETE /api/wardrobe/[id]`

Delete a wardrobe item.

### `PATCH /api/wardrobe/[id]`

Update wardrobe item metadata (title, collection, tags).

### `GET /api/wardrobe/collections`

Get user's collections.

### `POST /api/wardrobe/collections`

Create a new collection.

```typescript
// Input
{
  name: string;
}
```

### `DELETE /api/wardrobe/collections/[id]`

Delete a collection (items kept, unassigned).

---

## 👤 Profile Routes (Protected)

### `GET /api/profile`

Get current user profile + stats.

```typescript
// Response
{
  user: {
    id, name, email, image, plan, role,
    generationsCount, generationsLimit,
    createdAt,
  },
  stats: {
    totalGenerations: number,
    savedLooks: number,
    advisorSessions: number,
  }
}
```

### `PATCH /api/profile`

Update profile.

```typescript
// Input (all optional)
{ name?: string, image?: string }
```

### `POST /api/profile/change-password`

```typescript
// Input
{ currentPassword: string, newPassword: string }
```

### `DELETE /api/profile`

Delete account + all data.

### `GET /api/profile/history`

Get generation history.

```typescript
// Query: page=1&limit=20&mode=tryon|from_prompt|photo_text

// Response
{ generations: Generation[], total: number }
```

---

## 🔧 Admin Routes (Admin Only)

### `GET /api/admin/stats`

Dashboard overview stats.

```typescript
// Response
{
  totalUsers: number,
  totalGenerations: number,
  generationsToday: number,
  proUsers: number,
  recentGenerations: Generation[],
}
```

### `GET /api/admin/users`

List all users with filters.

```typescript
// Query: page=1&limit=20&search=email&role=user|admin&plan=free|pro
```

### `PATCH /api/admin/users/[id]`

Update user (role, plan, limits).

### `DELETE /api/admin/users/[id]`

Delete user and all their data.

### `GET /api/admin/generations`

All generations log with filters.

```typescript
// Query: page=1&limit=20&mode=...&status=...&userId=...
```

---

## 🛡️ Rate Limiting

All generate endpoints are rate limited:

```typescript
// src/utils/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const generateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 requests per 60 seconds
  prefix: "imagify:generate",
});

export const advisorRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "imagify:advisor",
});
```

Usage in route handler:

```typescript
const { success, remaining, reset } = await generateRateLimit.limit(userId);
if (!success) {
  return Response.json(
    { error: "rate_limited", retryAfter: reset },
    { status: 429 },
  );
}
```
