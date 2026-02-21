# Imagify — Phased Development Roadmap

> **How to use this file (READ THIS FIRST):**
>
> 1. Give the agent **one stage at a time** — never multiple stages at once.
> 2. Each stage has `📄 @[doc]` links — the agent **MUST** read those docs **before writing any code** for that stage.
> 3. After completing every stage, the agent **MUST** open `@[docs/PROGRESS.md]` and:
>    - Change the stage status from `🔲 Pending` → `✅ Done` in the overview table
>    - Fill in `Completed At` (current date/time), `npx tsc --noEmit` result, and any `Notes`
>    - **Do NOT proceed to the next stage without updating `PROGRESS.md` first**
> 4. Each stage ends with a mandatory `📋 Mark complete` step — this is a hard stop.

---

## 📦 Libraries & Stack Reference

- **UI Components:** shadcn/ui (built on Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **Framework:** Next.js 16 latest (App Router, TypeScript)
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Auth:** NextAuth.js v5 (Auth.js)
- **AI Image:** Google Gemini 2.5 Flash
- **AI Text:** Groq (LLaMA 4 Scout)
- **Animations:** Framer Motion + Three.js
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod

---

## ──────────────────────────────────────────────────────

## 🟣 STAGE 1 — Project Initialization & Dependencies

**Reference docs (MUST READ before starting):**

- 📄 @[docs/PROJECT_OVERVIEW.md] — stack, env vars, folder structure
- 📄 @[docs/ARCHITECTURE.md] — folder architecture (detailed)
- 📄 @[docs/AGENT_GUIDE.md] — coding standards
- 📄 @[docs/DESIGN_SYSTEM.md] — reference for custom colors and design tokens
- 📄 @[docs/theme.ts] — base color variables to be integrated

**Tasks:**

- [ ] Initialize Next.js 16 latest with TypeScript, Tailwind CSS, App Router, src/ dir, `@/*` alias
  ```bash
  npx create-next-app@latest ./ --typescript --tailwind --app --src-dir --import-alias "@/*" --eslint --yes
  ```
- [ ] Install all dependencies:
  ```bash
  npm install drizzle-orm drizzle-kit @neondatabase/serverless
  npm install next-auth@beta @auth/drizzle-adapter bcryptjs
  npm install @google/generative-ai groq-sdk
  npm install framer-motion three @react-three/fiber @react-three/drei
  npm install zustand @tanstack/react-query
  npm install react-hook-form @hookform/resolvers zod
  npm install lucide-react clsx tailwind-merge
  npm install react-dropzone react-hot-toast
  npm install @upstash/ratelimit @upstash/redis
  npm install resend
  npm install recharts @tanstack/react-table
  npm install -D @types/bcryptjs @types/three
  ```
- [ ] Initialize shadcn/ui:
  ```bash
  npx shadcn@latest init
  ```
  Choose: Dark theme, CSS variables, Zinc base color, `src/components/ui` path.
- [ ] 🎨 **Integrate Custom Colors:** Update the generated `globals.css` and Tailwind config to use the primary/secondary colors and gradients from `@[docs/theme.ts]` and `@[docs/DESIGN_SYSTEM.md]` instead of the default shadcn palette.
- [ ] Add needed shadcn/ui components:
  ```bash
  npx shadcn@latest add button input label card badge tabs dialog sheet tooltip dropdown-menu avatar separator progress skeleton textarea
  ```
- [ ] Create `.env.local` with all variables from `PROJECT_OVERVIEW.md`
- [ ] Create `vercel.json` with extended function timeouts (from `DEPLOYMENT.md`)
- [ ] 🎨 **Move/Verify `theme.ts`** — ensure `docs/theme.ts` (if exists) is moved to `src/styles/theme.ts` and correctly exports the theme tokens.
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 1 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 2 — Folder Structure & Core Utilities

**Reference docs (MUST READ):**

- 📄 @[docs/ARCHITECTURE.md] — the full folder tree to recreate exactly
- 📄 @[docs/AGENT_GUIDE.md] — naming conventions, folder rules

**Tasks:**

- [ ] Create all empty folders:  
       `src/hooks/`, `src/contexts/`, `src/utils/`, `src/constants/`, `src/types/`, `src/lib/db/queries/`, `src/lib/ai/`, `src/lib/auth/`, `src/lib/validations/`, `src/components/layout/`, `src/components/home/`, `src/components/studio/`, `src/components/generate/`, `src/components/advisor/`, `src/components/wardrobe/`, `src/components/profile/`, `src/components/admin/`
- [ ] `src/utils/cn.ts` — clsx + tailwind-merge utility
- [ ] `src/utils/image.ts` — base64 encode/decode/resize helpers, file-to-base64 browser util
- [ ] `src/utils/format.ts` — date formatter, number formatter, truncate text
- [ ] `src/constants/routes.ts` — all app route constants
- [ ] `src/constants/ai.ts` — AI model names, generation limits, accepted types
- [ ] `src/constants/app.ts` — app name, URL, max file size, plan limits
- [ ] `src/styles/theme.ts` — ✅ Already created. Verify it's in place.
- [ ] Update `src/app/globals.css` — map theme tokens to CSS variables, base dark theme, glassmorphism utility classes
- [ ] Update `tailwind.config.ts` — extend Tailwind with theme color tokens
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 2 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 3 — Database Schema & Connection

**Reference docs (MUST READ):**

- 📄 @[docs/DATABASE_SCHEMA.md] — all tables, enums, relations, indexes, migration commands

**Tasks:**

- [ ] `src/lib/db/client.ts` — Neon serverless + Drizzle client (from `DATABASE_SCHEMA.md`)
- [ ] `drizzle/schema.ts` — all tables: `users`, `accounts`, `sessions`, `verification_tokens`, `generations`, `wardrobe_items`, `wardrobe_collections`, `advisor_sessions`
- [ ] `drizzle/relations.ts` — all Drizzle relations
- [ ] `drizzle.config.ts` — Drizzle kit config pointing to Neon
- [ ] Run migration: `npx drizzle-kit push` (dev) or `npx drizzle-kit generate && npx drizzle-kit migrate`
- [ ] `src/lib/db/queries/users.ts` — `getUserById`, `getUserByEmail`, `createUser`, `updateUser`, `deleteUser`
- [ ] `src/lib/db/queries/generations.ts` — `createGeneration`, `getGenerationsByUser`, `updateGeneration`
- [ ] `src/lib/db/queries/wardrobe.ts` — `getWardrobeItems`, `saveToWardrobe`, `getCollections`, `createCollection`, `deleteWardrobeItem`
- [ ] `src/lib/db/queries/advisor.ts` — `createAdvisorSession`, `getAdvisorHistory`
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 3 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 4 — Authentication Setup

**Reference docs (MUST READ):**

- 📄 @[docs/AUTH.md] — full auth flow, NextAuth config, middleware, admin auth
- 📄 @[docs/API_ROUTES.md] — `/api/auth/**` endpoints

**Tasks:**

- [ ] `src/lib/auth/config.ts` — NextAuth config (Credentials + Google providers, jwt/session callbacks) — copy from `AUTH.md`
- [ ] `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- [ ] `src/middleware.ts` — route protection middleware (copy from `AUTH.md`, protect `/studio`, `/generate`, `/advisor`, `/wardrobe`, `/profile`, `/admin`)
- [ ] `src/lib/validations/auth.ts` — Zod schemas: `loginSchema`, `registerSchema`, `forgotPasswordSchema`, `resetPasswordSchema`
- [ ] `src/app/api/auth/register/route.ts` — registration endpoint (validate → check email → hash password → insert user → return session)
- [ ] `src/app/api/auth/forgot-password/route.ts`
- [ ] `src/app/api/auth/reset-password/route.ts`
- [ ] `src/types/auth.ts` — extended NextAuth types with `role`, `id`
- [ ] `scripts/seed-admin.ts` — CLI script to create first admin user
- [ ] `package.json` — add `"db:seed-admin"` script
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 4 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 5 — Root Layout, Fonts & Providers

**Reference docs (MUST READ):**

- 📄 @[docs/DESIGN_SYSTEM.md] — typography (Inter + Outfit), colors, glassmorphism
- 📄 @[docs/SEO.md] — root metadata config

**Tasks:**

- [ ] `src/app/layout.tsx` — root layout: load Inter + Outfit from `next/font/google`, apply font CSS vars, wrap with providers, global metadata from `SEO.md`
- [ ] `src/contexts/ThemeContext.tsx` — theme context (dark mode toggle if needed)
- [ ] `src/app/providers.tsx` — `QueryClientProvider` (TanStack Query) + Session Provider wrapper client component
- [ ] `src/app/sitemap.ts` — sitemap (from `SEO.md`)
- [ ] `src/app/robots.ts` — robots.txt (from `SEO.md`)
- [ ] `src/app/not-found.tsx` — 404 page (dark themed, with back-to-home button)
- [ ] `src/app/loading.tsx` — global loading (violet pulsing spinner)
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 5 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 6 — Shared UI Components (shadcn/ui + Custom)

**Reference docs (MUST READ):**

- 📄 @[docs/DESIGN_SYSTEM.md] — button spec, card spec, input spec, glass morphism, animations
- 📄 @[docs/DESIGN_MOCKUP.md] — component visual specs

> **Note:** shadcn/ui components live in `src/components/ui/` (auto-generated). Custom wrappers/extensions go in the same folder.

**Tasks:**

- [ ] Customize shadcn/ui Button with Imagify primary gradient variant
- [ ] Customize shadcn/ui Card with glass morphism style
- [ ] `src/components/ui/ImageUploader.tsx` — drag-drop zone using `react-dropzone` (photo drop, preview, remove button)
- [ ] `src/components/ui/GlassCard.tsx` — reusable glassmorphism card wrapper
- [ ] `src/components/ui/GradientText.tsx` — reusable gradient text component
- [ ] `src/components/ui/CompareSlider.tsx` — before/after image comparison slider
- [ ] `src/components/ui/LoadingOverlay.tsx` — AI generation loading state (shimmer + "Working magic…" text)
- [ ] `src/components/ui/PageTransition.tsx` — Framer Motion page transition wrapper
- [ ] `src/components/ui/AnimatedSection.tsx` — scroll-triggered fade-in-up wrapper (uses Framer Motion + Intersection Observer)
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 6 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 7 — Layout Components (Header, Footer, Nav)

**Reference docs (MUST READ):**

- 📄 @[docs/PAGES.md] — navigation links, header/footer description
- 📄 @[docs/DESIGN_MOCKUP.md] — header visual spec, mobile nav spec

**Tasks:**

- [ ] `src/components/layout/Header.tsx` — sticky glassmorphism navbar: Logo, nav links, auth buttons (Login/Register or Avatar dropdown), "Upgrade" badge for free users
- [ ] `src/components/layout/MobileNav.tsx` — hamburger → fullscreen slide-in overlay menu (Framer Motion)
- [ ] `src/components/layout/Footer.tsx` — dark footer with links, social icons, branding
- [ ] `src/components/layout/AdminSidebar.tsx` — sidebar nav for admin panel (Dashboard, Users, Generations, Analytics, Logout)
- [ ] `src/app/(main)/layout.tsx` — main app layout (renders Header + Footer)
- [ ] `src/app/(admin)/layout.tsx` — admin layout (renders AdminSidebar, checks admin role)
- [ ] `src/app/(auth)/layout.tsx` — auth pages layout (split-screen: form left, showcase right)
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 7 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 8 — Landing Page (Home)

**Reference docs (MUST READ):**

- 📄 @[docs/PAGES.md] — Landing page sections list
- 📄 @[docs/DESIGN_MOCKUP.md] — hero layout ASCII, hero demo card spec, animation inventory
- 📄 @[docs/DESIGN_SYSTEM.md] — gradients, animations, stagger variants

**Tasks:**

- [ ] `src/app/(main)/page.tsx` — thin orchestrator: import and render all sections
- [ ] `src/components/home/HeroSection.tsx` — full-screen hero with gradient headline, CTA buttons, `HeroDemo` card, 3D background
- [ ] `src/components/home/HeroCanvas.tsx` — Three.js `<Canvas>` scene (floating particles or cloth). Load with `dynamic(() => ..., { ssr: false })` in `HeroSection`
- [ ] `src/components/home/HeroDemo.tsx` — the before/after card: user photo + item photo → AI result (with animated connecting arrow)
- [ ] `src/components/home/FeaturesSection.tsx` — 3 glass cards with stagger animation
- [ ] `src/components/home/HowItWorksSection.tsx` — 3-step visual flow
- [ ] `src/components/home/TestimonialsSection.tsx` — testimonial carousel
- [ ] `src/components/home/PricingPreview.tsx` — free vs pro card comparison teaser + link to `/pricing`
- [ ] `src/components/home/CTASection.tsx` — full-width gradient CTA banner
- [ ] Add page metadata export (`SEO.md`)
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 8 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 9 — Auth Pages (Login, Register, Forgot Password)

**Reference docs (MUST READ):**

- 📄 @[docs/AUTH.md] — all auth flows step-by-step
- 📄 @[docs/DESIGN_MOCKUP.md] — auth page layout (split screen)
- 📄 @[docs/API_ROUTES.md] — `/api/auth/**` endpoints used by these pages

**Tasks:**

- [ ] `src/app/(auth)/login/page.tsx` + `LoginForm.tsx` — email/password + Google OAuth button
- [ ] `src/app/(auth)/register/page.tsx` + `RegisterForm.tsx` — name, email, password, confirm password, Google OAuth
- [ ] `src/app/(auth)/forgot-password/page.tsx` + form
- [ ] `src/hooks/useAuth.ts` — `useLogin`, `useRegister`, `useLogout` hooks wrapping NextAuth `signIn`/`signOut`
- [ ] Add proper metadata + structured data to each auth page
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 9 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 10 — AI Library Integrations

**Reference docs (MUST READ):**

- 📄 @[docs/AI_FEATURES.md] — full Gemini + Groq client code, all generation functions
- 📄 @[docs/API_ROUTES.md] — rate limiting pattern

**Tasks:**

- [ ] `src/lib/ai/gemini.ts` — `geminiFlashModel`, `generateTryOn()`, `generateFromPrompt()`, `generateFromPhotoWithText()` (copy from `AI_FEATURES.md`)
- [ ] `src/lib/ai/groq.ts` — `getStyleAdvice()`, `extractGeneratePrompt()` (copy from `AI_FEATURES.md`)
- [ ] `src/utils/rateLimit.ts` — Upstash Rate Limit helpers (pattern from `API_ROUTES.md`)
- [ ] `src/lib/validations/generate.ts` — Zod schemas for all generate inputs
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 10 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 11 — Generate API Routes

**Reference docs (MUST READ):**

- 📄 @[docs/API_ROUTES.md] — all generate endpoints with full input/output shapes
- 📄 @[docs/AI_FEATURES.md] — generation modes and AI function calls
- 📄 @[docs/DATABASE_SCHEMA.md] — `generations` table schema

**Tasks:**

- [ ] `src/app/api/generate/tryon/route.ts` — validate → rate limit → check limit → call `generateTryOn()` → save to DB → return result
- [ ] `src/app/api/generate/from-prompt/route.ts`
- [ ] `src/app/api/generate/from-photo-text/route.ts`
- [ ] All routes: `auth()` session check, generation limit enforcement, DB write with `createGeneration()`
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 11 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 12 — Virtual Try-On Studio Page

**Reference docs (MUST READ):**

- 📄 @[docs/PAGES.md] — Studio page section: components, flow, data
- 📄 @[docs/DESIGN_MOCKUP.md] — studio mobile layout, dropzone spec, loading spec

**Tasks:**

- [ ] `src/app/(main)/studio/page.tsx` — page + metadata
- [ ] `src/app/(main)/studio/loading.tsx` — skeleton
- [ ] `src/components/studio/StudioUploader.tsx` — main container managing both drops + generate action
- [ ] `src/components/studio/PhotoDropzone.tsx` — reusable (used for both user photo + item photo)
- [ ] `src/components/studio/ResultPreview.tsx` — shows result + actions
- [ ] `src/components/studio/GenerateActions.tsx` — "Try On" button, Save, Download, Share
- [ ] `src/hooks/useGenerate.ts` — `useTryOn()`, `useGenerateFromPrompt()`, `useGenerateFromPhotoText()` hooks (POST to API, handle loading/error)
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 12 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 13 — AI Generate Studio Page

**Reference docs (MUST READ):**

- 📄 @[docs/PAGES.md] — Generate page components and 3 modes
- 📄 @[docs/AI_FEATURES.md] — the 3 generation modes explained

**Tasks:**

- [ ] `src/app/(main)/generate/page.tsx` + metadata
- [ ] `src/components/generate/GenerateModeTabs.tsx` — tab switcher using shadcn Tabs
- [ ] `src/components/generate/PromptMode.tsx` — textarea + generate button
- [ ] `src/components/generate/PhotoTextMode.tsx` — dropzone + description textarea
- [ ] `src/components/generate/PhotoItemMode.tsx` — two dropzones (reuse `PhotoDropzone`)
- [ ] `src/components/generate/GenerateResult.tsx` — result image + save/download/share
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 13 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 14 — AI Style Advisor Page

**Reference docs (MUST READ):**

- 📄 @[docs/PAGES.md] — Advisor page components and flow
- 📄 @[docs/AI_FEATURES.md] — Groq LLaMA integration, style advice flow
- 📄 @[docs/API_ROUTES.md] — `/api/advisor/**` endpoints

**Tasks:**

- [ ] `src/app/api/advisor/analyze/route.ts` — validate → rate limit → call `getStyleAdvice()` + `extractGeneratePrompt()` → save session → return
- [ ] `src/app/api/advisor/history/route.ts` — paginated advisor history
- [ ] `src/app/(main)/advisor/page.tsx` + metadata
- [ ] `src/components/advisor/AdvisorPhotoUpload.tsx` — optional photo upload
- [ ] `src/components/advisor/AdvisorChat.tsx` — textarea for user question + submit → markdown response
- [ ] `src/components/advisor/StyleCard.tsx` — rendered markdown advice (use `react-markdown`)
- [ ] `src/components/advisor/PromptExport.tsx` — "Open in Generate Studio" button
- [ ] `src/hooks/useAdvisor.ts`
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 14 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 15 — Wardrobe API Routes & Page

**Reference docs (MUST READ):**

- 📄 @[docs/API_ROUTES.md] — all `/api/wardrobe/**` endpoints
- 📄 @[docs/PAGES.md] — Wardrobe page components
- 📄 @[docs/DATABASE_SCHEMA.md] — `wardrobe_items`, `wardrobe_collections` tables

**Tasks:**

- [ ] `src/app/api/wardrobe/route.ts` — GET (list) + POST (save)
- [ ] `src/app/api/wardrobe/[id]/route.ts` — PATCH + DELETE
- [ ] `src/app/api/wardrobe/collections/route.ts` — GET + POST
- [ ] `src/app/api/wardrobe/collections/[id]/route.ts` — DELETE
- [ ] `src/app/(main)/wardrobe/page.tsx` + metadata
- [ ] `src/app/(main)/wardrobe/[id]/page.tsx` — single look detail
- [ ] `src/components/wardrobe/WardrobeGrid.tsx` — responsive grid of looks
- [ ] `src/components/wardrobe/LookCard.tsx` — card with hover actions
- [ ] `src/components/wardrobe/CollectionSelector.tsx` — filter/create collections
- [ ] `src/components/wardrobe/LookDetail.tsx` — full-size modal view
- [ ] `src/hooks/useWardrobe.ts`
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 15 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 16 — Profile API Routes & Pages

**Reference docs (MUST READ):**

- 📄 @[docs/API_ROUTES.md] — all `/api/profile/**` endpoints
- 📄 @[docs/PAGES.md] — Profile page components

**Tasks:**

- [ ] `src/app/api/profile/route.ts` — GET (profile + stats) + PATCH (update)
- [ ] `src/app/api/profile/change-password/route.ts`
- [ ] `src/app/api/profile/route.ts` DELETE — account deletion
- [ ] `src/app/api/profile/history/route.ts` — paginated generation history
- [ ] `src/app/(main)/profile/page.tsx` + metadata
- [ ] `src/app/(main)/profile/settings/page.tsx`
- [ ] `src/app/(main)/profile/history/page.tsx`
- [ ] `src/components/profile/ProfileHeader.tsx` — avatar, name, email, plan badge
- [ ] `src/components/profile/ProfileStats.tsx` — stats cards
- [ ] `src/components/profile/ProfileSettings.tsx` — form with name, email, password change, avatar upload, danger zone (delete account)
- [ ] `src/components/profile/HistoryList.tsx` — paginated list of past generations
- [ ] `src/components/profile/SubscriptionBadge.tsx` — Free/Pro badge + upgrade CTA
- [ ] `src/hooks/useProfile.ts`
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 16 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 17 — Pricing Page

**Reference docs (MUST READ):**

- 📄 @[docs/PAGES.md] — Pricing page description
- 📄 @[docs/DESIGN_SYSTEM.md] — card design, gradient usage

**Tasks:**

- [ ] `src/app/(main)/pricing/page.tsx` + metadata
- [ ] `src/components/pricing/PricingCard.tsx` — individual plan card (Free / Pro)
- [ ] `src/components/pricing/PricingTable.tsx` — side-by-side comparison
- [ ] `src/components/pricing/FAQSection.tsx` — accordioned FAQ (shadcn Accordion)
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 17 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 18 — Admin Auth & Panel

**Reference docs (MUST READ):**

- 📄 @[docs/AUTH.md] — admin auth flow, admin session check
- 📄 @[docs/PAGES.md] — Admin panel pages: Dashboard, Users, Generations, Analytics
- 📄 @[docs/API_ROUTES.md] — `/api/admin/**` endpoints

**Tasks:**

- [ ] `src/app/(admin)/login/page.tsx` — admin login form (separate from main login)
- [ ] `src/app/api/admin/stats/route.ts`
- [ ] `src/app/api/admin/users/route.ts` — GET (paginated+filter) + PATCH
- [ ] `src/app/api/admin/users/[id]/route.ts` — PATCH (role/plan) + DELETE
- [ ] `src/app/api/admin/generations/route.ts`
- [ ] `src/app/(admin)/dashboard/page.tsx`
- [ ] `src/app/(admin)/users/page.tsx` + `[id]/page.tsx`
- [ ] `src/app/(admin)/generations/page.tsx`
- [ ] `src/app/(admin)/analytics/page.tsx`
- [ ] `src/components/admin/StatsCards.tsx`
- [ ] `src/components/admin/UsersTable.tsx` — `@tanstack/react-table`
- [ ] `src/components/admin/GenerationsLog.tsx`
- [ ] `src/components/admin/AnalyticsCharts.tsx` — Recharts line/bar charts
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 18 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 19 — SEO, Performance & Final Polish

**Reference docs (MUST READ):**

- 📄 @[docs/SEO.md] — metadata, JSON-LD, sitemap, robots, Core Web Vitals
- 📄 @[docs/AGENT_GUIDE.md] — performance checklist

**Tasks:**

- [ ] Verify every page has `metadata` export with title, description, OG, Twitter
- [ ] Add JSON-LD structured data to landing page
- [ ] Verify `sitemap.ts` and `robots.ts` are correct
- [ ] Run Lighthouse audit — hit LCP <2.5s, CLS <0.1
- [ ] Verify all images use `next/image`
- [ ] Verify all Three.js / heavy components use `dynamic()` with `ssr: false`
- [ ] Add `React.memo` where needed for stable list items
- [ ] Verify all forms have proper `aria-label` attributes
- [ ] Test all pages at 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] Run `npx tsc --noEmit` — zero TypeScript errors
- [ ] Run `npx eslint .` — zero warnings/errors
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 19 as `✅ Done`, fill in timestamp and tsc result

---

## 🟣 STAGE 20 — Deployment

**Reference docs (MUST READ):**

- 📄 @[docs/DEPLOYMENT.md] — full Vercel deployment guide, env vars, DB migration in CI

**Tasks:**

- [ ] Set all environment variables in Vercel dashboard (from `DEPLOYMENT.md`)
- [ ] Configure Vercel `functions` timeout in `vercel.json`
- [ ] Run production build locally: `npm run build` (must pass with zero errors)
- [ ] Deploy: `vercel --prod`
- [ ] Run `npx drizzle-kit migrate` against production Neon DB
- [ ] Run `npm run db:seed-admin` to create first admin
- [ ] Smoke-test all critical paths in production
- [ ] 📋 **Update `@[docs/PROGRESS.md]`** → mark Stage 20 as `✅ Done` — PROJECT COMPLETE! 🎉

---

## ✅ Stage Completion Protocol (MANDATORY)

After **every** stage the agent MUST, in this exact order:

1. Confirm all `[ ]` checklist items are checked off
2. Run `npx tsc --noEmit` — **must show zero errors** before proceeding
3. Open `@[docs/PROGRESS.md]` and update:
   - Stage status: `🔲 Pending` → `✅ Done`
   - `Completed At`: current date/time
   - `npx tsc --noEmit result`: paste output (or "✅ 0 errors")
   - `Notes`: any deviations, libraries swapped, issues encountered
4. Report back to the user with a summary of what was completed
5. **STOP** — await instruction before starting the next stage

> ⚠️ **If `npx tsc --noEmit` has errors — the stage is NOT complete.** Fix all errors first, then mark done.
