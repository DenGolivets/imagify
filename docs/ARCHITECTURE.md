# Imagify — System Architecture

## 📐 Architecture Overview

Imagify is a **monolithic Next.js 16 fullstack application** deployed on Vercel, using:

- **App Router** for file-system routing and React Server Components
- **Route Handlers** (`app/api/`) for REST-like endpoints called from client components
- **Server Actions** for form submissions and mutations
- **Neon PostgreSQL** via **Drizzle ORM** as the only database
- **Vercel Blob** for temporary user upload storage
- **External AI APIs** for image generation and text generation

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT                        │
│   Next.js React Client Components + Three.js + Framer Motion │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP / Server Actions
┌─────────────────────▼───────────────────────────────────────┐
│                   VERCEL EDGE / NODE RUNTIME                 │
│              Next.js 15 App Router                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ RSC Pages   │  │ API Routes   │  │  Server Actions    │  │
│  │ (SSR/SSG)   │  │ /api/**      │  │  (form mutations)  │  │
│  └─────────────┘  └──────┬───────┘  └─────────┬──────────┘  │
│                          │                     │             │
│  ┌───────────────────────▼─────────────────────▼──────────┐  │
│  │                   Service Layer                         │  │
│  │  lib/ai/gemini.ts  |  lib/ai/groq.ts  |  lib/auth/    │  │
│  │  lib/db/queries.ts |  lib/validations/                 │  │
│  └───────┬─────────────────────┬────────────────┬─────────┘  │
└──────────┼─────────────────────┼────────────────┼────────────┘
           │                     │                │
    ┌──────▼──────┐    ┌─────────▼──────┐  ┌─────▼──────────┐
    │  Neon.tech   │    │ Google Gemini  │  │   Groq API     │
    │  PostgreSQL  │    │ 2.5 Flash      │  │ LLaMA 4 Scout  │
    │  (Drizzle)   │    │ Image Gen API  │  │ Text Gen API   │
    └─────────────┘    └────────────────┘  └────────────────┘
           │
    ┌──────▼──────────┐
    │  Vercel Blob    │
    │  (temp uploads) │
    └─────────────────┘
```

---

## 🧩 Microservices / External Services (Minimal)

> **Design principle**: Keep it simple. We use Next.js as the single backend. External services are API integrations, not separate servers.

| Service           | Provider                | Purpose                                    |
| ----------------- | ----------------------- | ------------------------------------------ |
| **Database**      | Neon.tech (Postgres)    | All persistent data storage                |
| **Image AI**      | Google Gemini 2.5 Flash | Virtual try-on + image generation          |
| **Text AI**       | Groq (LLaMA 4 Scout)    | Style advice text generation               |
| **Auth**          | NextAuth.js v5          | Session management, credentials + OAuth    |
| **File Upload**   | Vercel Blob             | Temporary storage for user-uploaded photos |
| **Rate Limiting** | Upstash Redis           | Prevent API abuse (free tier, serverless)  |
| **Email**         | Resend                  | Welcome emails, password reset             |

---

## 🔄 Data Flow — Virtual Try-On

```
User uploads:
  [My Photo]  +  [Item Photo]
        │              │
        ▼              ▼
  Vercel Blob     Vercel Blob
  (temp URL)      (temp URL)
        │              │
        └──────┬────────┘
               ▼
    POST /api/generate/tryon
               │
               ▼
    Gemini 2.5 Flash API
    (image editing / inpainting)
               │
               ▼
    Base64 result image
               │
      ┌────────┴───────┐
      ▼                ▼
  Save to DB       Return to UI
  (generations     (display result)
   table)
               │
               ▼
    User optionally saves to Wardrobe
```

---

## 🔄 Data Flow — AI Style Advisor

```
User uploads: [My Photo] + [Text Prompt / question]
        │
        ▼
  POST /api/advisor/analyze
        │
        ▼
  Groq API (LLaMA 4 Scout)
  - Accepts vision input (photo)
  - Returns fashion style recommendations
        │
        ▼
  Markdown text rendered in UI
        │
        ▼
  User can copy generated prompt
  → Paste into Generate Studio
```

---

## 🔄 Data Flow — AI Generate Studio (3 modes)

```
Mode 1: Text-only prompt
  [User writes prompt]
        │
        ▼
  POST /api/generate/from-prompt
        │
        ▼
  Gemini 2.5 Flash (text-to-image)
        │
        ▼
  Generated image → save to DB

Mode 2: Photo + Description
  [My Photo] + [What I want to see]
        │
        ▼
  POST /api/generate/from-photo-text
        │
        ▼
  Gemini 2.5 Flash (image editing with instruction)
        │
        ▼
  Generated image → save to DB

Mode 3: Photo + Item Photo (Virtual Try-On)
  [My Photo] + [Item Photo]
        (same as Try-On flow above)
```

---

## 🔐 Authentication Architecture

See `docs/AUTH.md` for full details.

**Summary:**

- NextAuth.js v5 (Auth.js) handles all auth
- Credentials provider for email/password
- Google OAuth provider (optional social login)
- Sessions stored server-side (JWT strategy)
- Admin users distinguished by `role: 'admin'` in DB
- Middleware protects all `/studio`, `/generate`, `/advisor`, `/wardrobe`, `/profile` routes
- Admin middleware protects all `/admin/**` routes separately

---

## 📦 Folder Architecture (Detailed)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx              # Main layout (Header + Footer)
│   │   ├── page.tsx                # Home / Landing page
│   │   ├── studio/
│   │   │   └── page.tsx            # Virtual Try-On Studio
│   │   ├── generate/
│   │   │   └── page.tsx            # AI Generate Studio
│   │   ├── advisor/
│   │   │   └── page.tsx            # AI Style Advisor
│   │   ├── wardrobe/
│   │   │   ├── page.tsx            # Wardrobe grid view
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Single look detail
│   │   ├── profile/
│   │   │   ├── page.tsx            # Profile overview
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── history/
│   │   │       └── page.tsx
│   │   └── pricing/
│   │       └── page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx              # Admin layout (sidebar nav)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── generations/
│   │   │   └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts
│       ├── generate/
│       │   ├── tryon/
│       │   │   └── route.ts
│       │   ├── from-prompt/
│       │   │   └── route.ts
│       │   └── from-photo-text/
│       │       └── route.ts
│       ├── advisor/
│       │   └── analyze/
│       │       └── route.ts
│       ├── wardrobe/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       └── admin/
│           ├── users/
│           │   └── route.ts
│           └── stats/
│               └── route.ts
├── components/
│   ├── ui/                         # Base UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Tabs.tsx
│   │   └── ImageUploader.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── AdminSidebar.tsx
│   ├── home/
│   │   ├── HeroSection.tsx         # 3D animated hero
│   │   ├── HeroDemo.tsx            # Before/After photo demo
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── PricingPreview.tsx
│   │   └── CTASection.tsx
│   ├── studio/
│   │   ├── StudioUploader.tsx
│   │   ├── PhotoDropzone.tsx
│   │   ├── ResultPreview.tsx
│   │   ├── CompareSlider.tsx
│   │   └── GenerateActions.tsx
│   ├── generate/
│   │   ├── GenerateModeTabs.tsx
│   │   ├── PromptMode.tsx
│   │   ├── PhotoTextMode.tsx
│   │   ├── PhotoItemMode.tsx
│   │   └── GenerateResult.tsx
│   ├── advisor/
│   │   ├── AdvisorChat.tsx
│   │   ├── AdvisorPhotoUpload.tsx
│   │   ├── StyleCard.tsx
│   │   └── PromptExport.tsx
│   ├── wardrobe/
│   │   ├── WardrobeGrid.tsx
│   │   ├── LookCard.tsx
│   │   ├── CollectionSelector.tsx
│   │   └── LookDetail.tsx
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileStats.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── HistoryList.tsx
│   │   └── SubscriptionBadge.tsx
│   └── admin/
│       ├── StatsCards.tsx
│       ├── UsersTable.tsx
│       ├── GenerationsLog.tsx
│       └── AnalyticsCharts.tsx
├── hooks/
│   ├── useGenerate.ts
│   ├── useAdvisor.ts
│   ├── useWardrobe.ts
│   ├── useProfile.ts
│   ├── useUpload.ts
│   ├── useImageCompare.ts
│   └── useDebounce.ts
├── contexts/
│   ├── ThemeContext.tsx
│   └── GenerateContext.tsx
├── lib/
│   ├── db/
│   │   ├── client.ts               # Neon + Drizzle client
│   │   ├── queries/
│   │   │   ├── users.ts
│   │   │   ├── generations.ts
│   │   │   └── wardrobe.ts
│   │   └── schema.ts               # Drizzle schema (re-export)
│   ├── auth/
│   │   ├── config.ts               # NextAuth config
│   │   └── middleware.ts
│   ├── ai/
│   │   ├── gemini.ts               # Gemini client + helpers
│   │   └── groq.ts                 # Groq client + helpers
│   └── validations/
│       ├── auth.ts
│       ├── generate.ts
│       └── profile.ts
├── utils/
│   ├── image.ts                    # Base64, resize, format helpers
│   ├── format.ts                   # Date, number formatters
│   ├── cn.ts                       # Tailwind classnames merger (clsx+twMerge)
│   └── rateLimit.ts                # Upstash rate limit helpers
├── constants/
│   ├── routes.ts
│   ├── ai.ts                       # Model names, prompts
│   └── app.ts                      # App-wide constants
├── styles/
│   └── theme.ts                    # Design tokens
└── types/
    ├── auth.ts
    ├── generation.ts
    ├── wardrobe.ts
    └── admin.ts
```

---

## ⚡ Performance Architecture

| Strategy               | Implementation                                                           |
| ---------------------- | ------------------------------------------------------------------------ |
| **RSC by default**     | All pages are Server Components unless interactive                       |
| **Code splitting**     | `dynamic()` for heavy client components (Three.js, Framer Motion scenes) |
| **Image optimization** | `next/image` for all user-facing images                                  |
| **Caching**            | `unstable_cache` for DB queries, ISR for public pages                    |
| **Streaming**          | Suspense boundaries for async data sections                              |
| **Bundle size**        | Tree-shaking, import aliasing, minimal client JS                         |
