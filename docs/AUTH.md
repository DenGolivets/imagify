# Imagify — Authentication & Authorization

## Overview

Authentication is handled by **NextAuth.js v5 (Auth.js)** with:

- **Credentials Provider** — email + password (bcrypt)
- **Google OAuth Provider** — social login
- **Admin Auth** — special credentials route with role check

Authorization is enforced via **Next.js Middleware** at the edge.

---

## 🔐 User Auth Flow

### Registration

```
1. User fills register form (name, email, password)
2. Client validates via Zod schema
3. POST /api/auth/register (Server Action)
4. Server: check email unique → hash password (bcryptjs, 12 rounds)
5. Insert user row (role: 'user', plan: 'free')
6. Send welcome email via Resend
7. Auto sign-in via NextAuth credentials
8. Redirect → /studio
```

### Login (Credentials)

```
1. User fills login form (email, password)
2. POST → NextAuth credentials provider
3. Query user by email from DB
4. bcrypt.compare(inputPassword, passwordHash)
5. Return user object → JWT token created
6. Session cookie set
7. Redirect → /studio (or intended page)
```

### Login (Google OAuth)

```
1. User clicks "Continue with Google"
2. Redirect to Google OAuth consent
3. Google callback → NextAuth handles token exchange
4. Check if user exists by email
   - Exists: link account, update session
   - New: create user row (no passwordHash), create account row
5. Session created → Redirect → /studio
```

### Password Reset

```
1. User requests reset → POST /api/auth/forgot-password
2. Generate secure token → store in verification_tokens table
3. Send email with reset link: /reset-password?token=xxx
4. User submits new password → POST /api/auth/reset-password
5. Validate token (exists + not expired) → hash new password
6. Update user.passwordHash → delete verification_token
7. Redirect → /login
```

---

## 🛡️ Admin Auth Flow

```
1. Admin navigates to /admin/login
2. Separate login form (email + password)
3. POST /api/admin/auth/login (Server Action)
4. Query user by email → verify role === 'admin'
5. bcrypt.compare password
6. Set admin session (separate cookie or admin flag in JWT)
7. Redirect → /admin/dashboard
```

### Admin User Creation

Admin users are created manually via:

- Drizzle Studio (database direct edit)
- CLI seed script: `npm run db:seed-admin`
- Or by another admin in `/admin/users` (promote existing user)

---

## ⚙️ NextAuth Configuration

File: `src/lib/auth/config.ts`

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db/client";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = loginSchema.parse(credentials);
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
});
```

---

## 🚧 Proxy — Route Protection

File: `src/proxy.ts`

```typescript
import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/studio",
  "/generate",
  "/advisor",
  "/wardrobe",
  "/profile",
];
const ADMIN_ROUTES = ["/admin"];
const GUEST_ONLY_ROUTES = ["/login", "/register", "/forgot-password"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  // Admin routes → must have role: admin
  if (
    ADMIN_ROUTES.some((r) => pathname.startsWith(r)) &&
    pathname !== "/admin/login"
  ) {
    if (!session || session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protected routes → must be authenticated
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Guest only routes → redirect if already logged in
  if (GUEST_ONLY_ROUTES.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/studio", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 🔑 Generation Limits (Free vs Pro)

| Plan     | Generations/month | Features                                |
| -------- | ----------------- | --------------------------------------- |
| **Free** | 10/month          | Basic try-on, advisor                   |
| **Pro**  | Unlimited         | All features, priority queue, HD output |

**Enforcement:**

```typescript
// In API route handler before calling Gemini:
const user = await getUserById(userId);
if (user.plan === "free" && user.generationsCount >= user.generationsLimit) {
  return new Response(JSON.stringify({ error: "limit_exceeded" }), {
    status: 429,
  });
}
// After successful generation:
await db
  .update(users)
  .set({ generationsCount: sql`${users.generationsCount} + 1` })
  .where(eq(users.id, userId));
```

---

## 🔒 Security Best Practices

- Passwords hashed with `bcryptjs` (12 rounds)
- CSRF protection via NextAuth built-in tokens
- HTTP-only cookies for sessions
- Rate limiting on `/api/auth/register` and `/api/auth/login` via Upstash Redis
- Environment secrets never exposed to client
- Admin routes triple-checked: middleware + server component Session check + API role check
