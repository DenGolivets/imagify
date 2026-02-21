# Imagify — Deployment Guide

## 🌐 Hosting: Vercel

Imagify is deployed on **Vercel** — the native platform for Next.js.

---

## 📦 Required Services Setup

### 1. Neon.tech — PostgreSQL Database

1. Create account at [neon.tech](https://neon.tech)
2. Create new project → "imagify-prod"
3. Copy the connection string (pooled)
4. Add to Vercel env: `DATABASE_URL`

### 2. Google Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create API key
3. Add to Vercel env: `GEMINI_API_KEY`

### 3. Groq API

1. Go to [console.groq.com](https://console.groq.com)
2. Create API key
3. Add to Vercel env: `GROQ_API_KEY`

### 4. NextAuth Secret

```bash
# Generate random secret:
openssl rand -base64 32
```

Add to Vercel env: `NEXTAUTH_SECRET`

### 5. Google OAuth (optional)

1. [Google Cloud Console](https://console.cloud.google.com) → Create project
2. APIs & Services → Credentials → OAuth 2.0 Client IDs
3. Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`
4. Add to Vercel env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 6. Vercel Blob

1. In Vercel dashboard → Storage → Create Blob store
2. Auto-adds `BLOB_READ_WRITE_TOKEN` to env

### 7. Upstash Redis

1. [console.upstash.com](https://console.upstash.com) → Create Redis database
2. Add to Vercel env: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### 8. Resend (Email)

1. [resend.com](https://resend.com) → Create account
2. Verify your sending domain
3. Create API key
4. Add to Vercel env: `RESEND_API_KEY`

---

## ⚙️ Environment Variables Reference

```env
# ─── Required ────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=https://your-domain.vercel.app
GEMINI_API_KEY=AIza...
GROQ_API_KEY=gsk_...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=A...

# ─── Optional ─────────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
RESEND_API_KEY=re_...
GOOGLE_SITE_VERIFICATION=...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# ─── Admin ────────────────────────────────────────────────────────────────────
# Set via Drizzle Studio or seed script, not env vars
# ADMIN_EMAIL and ADMIN_PASSWORD created via: npm run db:seed-admin
```

---

## 🚀 Deployment Steps

### First Deploy

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Link project
vercel

# 3. Set environment variables (or set via Vercel dashboard)
vercel env add DATABASE_URL production

# 4. Run DB migrations
npx drizzle-kit migrate

# 5. Seed admin user
npm run db:seed-admin

# 6. Deploy
vercel --prod
```

### Subsequent Deploys

Automatic via GitHub integration — push to `main` → Vercel auto-deploys.

---

## 🗄️ Database Migrations in CI

Add to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed-admin": "ts-node -e \"require('./scripts/seed-admin')\"",
    "build": "npm run db:migrate && next build"
  }
}
```

**Note**: Running `db:migrate` in build ensures migrations are applied before app starts.

---

## 📊 Vercel Configuration

File: `vercel.json`

```json
{
  "functions": {
    "src/app/api/generate/**": {
      "maxDuration": 60
    },
    "src/app/api/advisor/**": {
      "maxDuration": 30
    }
  }
}
```

> AI generation routes need extended timeout (default is 10s on Vercel Hobby, 60s on Pro).

---

## 🏗️ Local Development Setup

```bash
# 1. Clone/init project
git clone <repo>
cd imagify
npm install

# 2. Copy env template
cp .env.example .env.local
# Fill in your values

# 3. Run DB migrations
npx drizzle-kit push  # (push for local dev, migrate for production)

# 4. Start dev server
npm run dev

# App runs at http://localhost:3000
```

---

## 📈 Monitoring

- **Vercel Analytics**: Built-in performance + web vitals monitoring
- **Vercel Logs**: Real-time function logs in Vercel dashboard
- **Error tracking**: Consider adding Sentry (`@sentry/nextjs`) in future phases
