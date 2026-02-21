# Imagify — Agent Development Guide

## ⚡ Purpose

This document instructs any AI coding agent working on the Imagify project. Follow every rule in this document without exception. It represents the **coding standards, patterns, and architecture** that must be maintained throughout the project.

---

## 🧠 Core Principles (NON-NEGOTIABLE)

### 1. Component Decomposition

- **No file should exceed ~150 lines of code** (excluding imports and types)
- Every page (`page.tsx`) is a **thin orchestrator** — it imports sections/features, never contains raw JSX logic
- Break components into smaller units whenever 2+ logical separations exist

### 2. Folder Separation of Concerns

Always place code in the right folder:
| Code type | Location |
|---|---|
| Custom React hooks | `src/hooks/` |
| Pure utility functions | `src/utils/` |
| App-wide constants | `src/constants/` |
| React contexts | `src/contexts/` |
| TypeScript interfaces/types | `src/types/` |
| Zod schemas | `src/lib/validations/` |
| DB queries | `src/lib/db/queries/` |
| AI API integrations | `src/lib/ai/` |
| Primitive UI components | `src/components/ui/` |
| Feature components | `src/components/[feature]/` |
| Layouts | `src/components/layout/` |

### 3. Server vs Client Components

- **Default: Server Component** — no `"use client"` unless needed
- Only add `"use client"` when component uses: hooks, event handlers, browser APIs, Framer Motion, Three.js
- Heavy client components (Three.js, charts) MUST use `dynamic()` with `ssr: false`

### 4. Performance Optimization Rules

Apply the following where appropriate:

- `React.memo()` — on components that receive stable props and re-render unnecessarily
- `useCallback()` — on all event handler functions passed as props
- `useMemo()` — on expensive computations or derived state
- `dynamic(() => import(...))` — for heavy components (Three.js, Recharts, rich editors)
- `next/image` — for ALL user-visible images (never plain `<img>` tags)
- `Suspense` — wrap every async data-fetching section
- `loading.tsx` — provide for every route that has async data

### 5. TypeScript Rules

- Strict TypeScript everywhere (`strict: true` in tsconfig)
- **No `any` type** — ever. Use `unknown` + type guards if needed
- Zod schemas are the single source of truth for data shapes — derive TS types from them:
  ```typescript
  const schema = z.object({ ... });
  type SchemaType = z.infer<typeof schema>;
  ```
- All API responses have typed return shapes

### 6. Import Conventions

Always use path aliases:

```typescript
// ✅ Correct
import { Button } from "@/components/ui/Button";
import { Colors } from "@/styles/theme";
import { db } from "@/lib/db/client";

// ❌ Wrong
import { Button } from "../../../components/ui/Button";
```

### 7. Naming Conventions

| Item             | Convention                               | Example                   |
| ---------------- | ---------------------------------------- | ------------------------- |
| Components       | PascalCase                               | `StudioUploader.tsx`      |
| Hooks            | camelCase with `use` prefix              | `useGenerate.ts`          |
| Utils            | camelCase                                | `formatDate.ts`           |
| Constants        | UPPER_SNAKE_CASE values, camelCase files | `const MAX_FILE_SIZE = 5` |
| Types/Interfaces | PascalCase with `I` or `Type` suffix     | `GenerationType`, `IUser` |
| CSS classes      | Tailwind utility classes only            |                           |
| Files            | kebab-case for non-components            | `drizzle.config.ts`       |

### 8. Styling Rules

- **Tailwind CSS v4** only — no inline styles
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes:
  ```typescript
  import { cn } from '@/utils/cn';
  className={cn('base-class', isActive && 'active-class', className)}
  ```
- All color values from `Colors` in `theme.ts` → mapped to Tailwind CSS variables in `globals.css`
- No hard-coded color hex values in components — always use Tailwind semantic classes

---

## 📚 Required Skills to Look Up

When implementing the following features, look for relevant community skills or patterns:

| Feature                     | Skill / Pattern to Follow                                        |
| --------------------------- | ---------------------------------------------------------------- |
| **Drag & Drop uploads**     | Use `react-dropzone` with proper MIME validation and size limits |
| **Image comparison slider** | `react-compare-image` or custom Framer Motion slider             |
| **3D hero animation**       | `@react-three/fiber` + `@react-three/drei` with `Canvas`         |
| **Smooth page transitions** | Framer Motion `AnimatePresence`                                  |
| **Infinite scroll**         | `react-intersection-observer` + React Query infinite queries     |
| **Toast notifications**     | `react-hot-toast` or Radix Toast                                 |
| **Form handling**           | React Hook Form + Zod resolver                                   |
| **Data tables (admin)**     | `@tanstack/react-table`                                          |
| **Charts (admin)**          | `recharts`                                                       |
| **Auth**                    | NextAuth.js v5 (Auth.js) — follow official App Router guide      |
| **Rate limiting**           | Upstash Ratelimit SDK                                            |

---

## 🔄 Development Workflow

### When adding a new feature:

1. Create the Zod validation schema in `src/lib/validations/`
2. Create/update Drizzle schema if DB change needed → run `npx drizzle-kit generate`
3. Create DB query functions in `src/lib/db/queries/`
4. Create API route handler in `src/app/api/`
5. Create custom hook in `src/hooks/`
6. Create UI components in `src/components/`
7. Update the page file

### When fixing a bug:

1. Identify the root cause (don't patch symptoms)
2. Check if it's a type error → fix the type definition
3. Check if it's a data shape mismatch → update Zod schema
4. Test both happy path and error path

---

## 🚀 Tech Stack Quick Reference

```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript 5.x (strict)",
  "styling": "Tailwind CSS v4",
  "database": "Neon PostgreSQL",
  "orm": "Drizzle ORM",
  "auth": "NextAuth.js v5 (Auth.js)",
  "ai_image": "Google Gemini 2.5 Flash",
  "ai_text": "Groq (meta-llama/llama-4-scout-17b-16e-instruct)",
  "animations": "Framer Motion",
  "3d": "@react-three/fiber + @react-three/drei",
  "state": "Zustand (global) + TanStack Query (server)",
  "forms": "React Hook Form + Zod",
  "ui_primitives": "shadcn/ui (copy-paste components built on Radix UI)",
  "icons": "Lucide React",
  "email": "Resend",
  "rate_limiting": "Upstash Redis",
  "file_storage": "Vercel Blob",
  "admin_tables": "@tanstack/react-table",
  "charts": "Recharts",
  "deployment": "Vercel"
}
```

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't use `fetch` in Server Components without caching** — always configure `cache` or `next.revalidate`
2. **Don't put secrets in client components** — only access `process.env.*` in Server Components or API routes
3. **Don't store large base64 images in client state** — stream/reference by ID
4. **Don't forget loading states** — every async operation needs a loading + error state
5. **Don't skip validation** — every API endpoint must validate input with Zod before processing
6. **Don't use `router.push` without loading state** — always show feedback during navigation
7. **Don't render the Three.js canvas on SSR** — always `dynamic(() => ..., { ssr: false })`

---

## 📋 Checklist Before Committing

- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint warnings (`npx eslint .`)
- [ ] All new components have proper prop types defined
- [ ] All API routes have Zod validation
- [ ] All new Drizzle schema changes have migration generated
- [ ] No secrets/API keys in code
- [ ] Mobile responsive (tested at 375px, 768px, 1280px widths)
- [ ] Loading and error states exist for async operations
- [ ] Proper `metadata` export on new pages
