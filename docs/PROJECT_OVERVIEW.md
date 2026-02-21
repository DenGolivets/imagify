# Imagify — Project Overview

> **An AI-powered Online Virtual Try-On Platform**  
> Try clothes, accessories, and devices on your own photo — from anywhere.

---

## 🎯 Vision

Imagify lets users upload their own photo and virtually try on any clothing item, accessory, or wearable device using state-of-the-art AI image generation (Gemini 2.5 Flash). The platform also provides an AI fashion stylist powered by Groq/LLaMA that analyzes your photo and gives personalized style recommendations.

---

## 🚀 Core Feature Modules

| Module                    | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| **Virtual Try-On Studio** | Upload photo + item photo → AI generates your look              |
| **AI Style Advisor**      | Upload your photo → LLaMA generates personalized fashion advice |
| **AI Generate Studio**    | 3-mode image generation (prompt / photo+desc / photo+item)      |
| **Wardrobe**              | Save generated looks, organize into collections                 |
| **User Profile**          | History, saved looks, preferences, subscription                 |
| **Admin Panel**           | User management, content moderation, analytics                  |

---

## 🛠️ Technology Stack

### Frontend

| Layer              | Technology                                            |
| ------------------ | ----------------------------------------------------- |
| **Framework**      | Next.js 16 (App Router)                               |
| **Language**       | TypeScript 5.x                                        |
| **Styling**        | Tailwind CSS v4 + CSS Variables                       |
| **Animations**     | Framer Motion + Three.js (3D hero)                    |
| **State**          | Zustand (global) + React Query (server state)         |
| **Forms**          | React Hook Form + Zod validation                      |
| **UI Primitives**  | shadcn/ui (built on Radix UI — copy-paste components) |
| **Icons**          | Lucide React                                          |
| **Image Handling** | Next/Image + react-dropzone                           |
| **3D**             | Three.js + @react-three/fiber + @react-three/drei     |

### Backend (Next.js API Routes — App Router)

| Layer             | Technology                                                            |
| ----------------- | --------------------------------------------------------------------- |
| **Runtime**       | Next.js 15 Server Actions + Route Handlers                            |
| **Database**      | Neon.tech (PostgreSQL)                                                |
| **ORM**           | Drizzle ORM                                                           |
| **Auth**          | NextAuth.js v5 (Auth.js) — credentials + OAuth                        |
| **File Storage**  | Neon DB (base64 blobs for generated images) + Vercel Blob for uploads |
| **Email**         | Resend (transactional emails)                                         |
| **AI — Image**    | Google Gemini 2.5 Flash (image generation/editing)                    |
| **AI — Text**     | Groq API — `meta-llama/llama-4-scout-17b-16e-instruct`                |
| **Rate Limiting** | Upstash Redis (free tier)                                             |
| **Validation**    | Zod (shared front+back)                                               |

### Infrastructure / DevOps

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| **Hosting**  | Vercel                                      |
| **Database** | Neon.tech (serverless Postgres)             |
| **CI/CD**    | Vercel GitHub integration                   |
| **ENV**      | `.env.local` → Vercel Environment Variables |

---

## 🏗️ Project Repository Structure

```
imagify/
├── public/                        # Static assets
│   └── images/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth route group (login, register, forgot-password)
│   │   ├── (main)/                # Main app route group
│   │   │   ├── page.tsx           # Home / Landing
│   │   │   ├── studio/            # Virtual Try-On Studio
│   │   │   ├── generate/          # AI Generate Studio
│   │   │   ├── advisor/           # AI Style Advisor
│   │   │   ├── wardrobe/          # User Wardrobe
│   │   │   └── profile/           # User Profile
│   │   ├── (admin)/               # Admin panel route group
│   │   │   ├── login/
│   │   │   └── dashboard/
│   │   ├── api/                   # API Route Handlers
│   │   │   ├── auth/
│   │   │   ├── generate/
│   │   │   ├── advisor/
│   │   │   └── wardrobe/
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global CSS
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                    # Reusable headless UI primitives
│   │   ├── layout/                # Header, Footer, Sidebar, Nav
│   │   ├── studio/                # Virtual Try-On specific components
│   │   ├── generate/              # Generate Studio components
│   │   ├── advisor/               # AI Advisor components
│   │   ├── wardrobe/              # Wardrobe components
│   │   ├── profile/               # Profile components
│   │   └── admin/                 # Admin panel components
│   ├── hooks/                     # Custom React hooks
│   ├── contexts/                  # React contexts + providers
│   ├── lib/                       # Core library integrations
│   │   ├── db/                    # Drizzle + Neon client
│   │   ├── auth/                  # NextAuth config
│   │   ├── ai/                    # Gemini + Groq clients
│   │   └── validations/           # Zod schemas
│   ├── utils/                     # Pure utility functions
│   ├── constants/                 # App-wide constants
│   ├── styles/
│   │   └── theme.ts               # Design tokens (Colors.primary etc.)
│   └── types/                     # Shared TypeScript types/interfaces
├── drizzle/
│   ├── schema.ts                  # Database schema
│   ├── migrations/                # Auto-generated migrations
│   └── drizzle.config.ts
├── docs/                          # All documentation (this folder)
├── .env.local                     # Environment variables (not committed)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📋 Key Design Principles (Agent Must Follow)

1. **Component Decomposition** — No component/page file exceeds ~150 lines. Break everything into sub-components.
2. **Separation of Concerns** — Hooks → `hooks/`, utils → `utils/`, constants → `constants/`, contexts → `contexts/`, types → `types/`
3. **Reusable UI** — All common UI elements live in `components/ui/`. Never duplicate primitives.
4. **Performance First** — Use `React.memo`, `useCallback`, `useMemo`, `dynamic()` (lazy loading), `next/image`, `Suspense` consistently.
5. **Type Safety** — Strict TypeScript everywhere. No `any`. Shared Zod schemas for runtime + type validation.
6. **Server-First** — Prefer React Server Components (RSC). Only use `"use client"` when necessary for interactivity.
7. **Clean Code** — Readable variable names, JSDoc on complex functions, consistent formatting (Prettier + ESLint).
8. **SEO** — Every page has proper `metadata` export, OpenGraph, Twitter cards, structured data where applicable.
9. **Accessibility** — ARIA labels, keyboard navigation, proper semantic HTML via Radix UI.
10. **Mobile First** — All designs start mobile, scale up. Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`).

---

## 🔑 Environment Variables Required

```env
# Database
DATABASE_URL=                        # Neon PostgreSQL connection string

# Auth
NEXTAUTH_SECRET=                     # Random secret
NEXTAUTH_URL=                        # App URL
GOOGLE_CLIENT_ID=                    # OAuth (optional)
GOOGLE_CLIENT_SECRET=                # OAuth (optional)

# AI
GEMINI_API_KEY=                      # Google Gemini API
GROQ_API_KEY=                        # Groq API

# Storage
BLOB_READ_WRITE_TOKEN=               # Vercel Blob

# Rate Limiting
UPSTASH_REDIS_REST_URL=              # Upstash Redis
UPSTASH_REDIS_REST_TOKEN=            # Upstash Redis

# Email
RESEND_API_KEY=                      # Resend

# Admin
ADMIN_EMAIL=                         # Default admin email
ADMIN_PASSWORD_HASH=                 # Bcrypt hash of default admin password
```

---

## 🗺️ Site Pages Map

| Route                | Page                  | Auth       |
| -------------------- | --------------------- | ---------- |
| `/`                  | Landing / Home        | Public     |
| `/studio`            | Virtual Try-On Studio | Protected  |
| `/generate`          | AI Generate Studio    | Protected  |
| `/advisor`           | AI Style Advisor      | Protected  |
| `/wardrobe`          | My Wardrobe           | Protected  |
| `/profile`           | User Profile          | Protected  |
| `/profile/settings`  | Account Settings      | Protected  |
| `/profile/history`   | Generation History    | Protected  |
| `/pricing`           | Pricing / Plans       | Public     |
| `/login`             | Login                 | Guest only |
| `/register`          | Register              | Guest only |
| `/forgot-password`   | Forgot Password       | Guest only |
| `/admin/login`       | Admin Login           | Admin only |
| `/admin/dashboard`   | Admin Dashboard       | Admin only |
| `/admin/users`       | User Management       | Admin only |
| `/admin/generations` | Generations Log       | Admin only |
| `/admin/analytics`   | Analytics             | Admin only |
