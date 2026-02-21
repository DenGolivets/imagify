# Imagify — Pages & Components Breakdown

## Overview

This document describes every page in the Imagify application, its purpose, key components used, and data requirements.

---

## 🏠 1. Landing Page (`/`)

**Purpose:** Convert visitors. Showcase the product, build trust, drive sign-ups.

### Sections (in order):

1. **Navbar** — Logo + links + auth CTA (`components/layout/Header.tsx`)
2. **Hero Section** (`components/home/HeroSection.tsx`)
   - 3D animated background (Three.js cloth/particles)
   - Large headline with gradient text
   - CTA buttons (Try Free, See Demo)
   - **HeroDemo** sub-component: Split-view showing:
     - Top: Photo of person wearing glasses (AI-generated result)
     - Bottom left: Person's photo (original)
     - Bottom right: Glasses photo (the item)
     - Arrow/animation connecting them
3. **Features Section** (`components/home/FeaturesSection.tsx`)
   - 3 cards: Virtual Try-On, AI Style Advisor, Generate Studio
4. **How It Works** (`components/home/HowItWorksSection.tsx`)
   - 3-step visual flow with icons and animated connectors
5. **Testimonials** (`components/home/TestimonialsSection.tsx`)
   - Sliding/carousel cards with avatar, quote, stars
6. **Pricing Preview** (`components/home/PricingPreview.tsx`)
   - Free vs Pro comparison table
   - Link to `/pricing` full page
7. **CTA Section** (`components/home/CTASection.tsx`)
   - Full-width gradient banner with "Start for Free"
8. **Footer** (`components/layout/Footer.tsx`)

**Data**: No server data needed (static + animations).

---

## 🪞 2. Virtual Try-On Studio (`/studio`)

**Purpose:** Core product feature — upload photo + item → see yourself in it.

### Components:

- `components/studio/StudioUploader.tsx` — Main container
- `components/studio/PhotoDropzone.tsx` — Reusable drag-drop upload zone (used for user photo + item photo)
- `components/studio/ResultPreview.tsx` — Shows generated image
- `components/studio/CompareSlider.tsx` — Swipe to compare before/after
- `components/studio/GenerateActions.tsx` — Generate, Save, Share, Download buttons
- `components/ui/Spinner.tsx` — Loading state during generation

### Flow:

1. User drops/uploads their photo → preview shown
2. User drops/uploads item photo (clothing, glasses, etc.) → preview shown
3. Click "Try On" → loading animation → result appears
4. Result shown with CompareSlider
5. Options: Save to Wardrobe | Download | Share | Try another item

**Data**: `POST /api/generate/tryon` | `POST /api/wardrobe`

---

## 🎨 3. AI Generate Studio (`/generate`)

**Purpose:** 3-mode AI image generation for fashion content.

### Components:

- `components/generate/GenerateModeTabs.tsx` — Tab switcher for 3 modes
- `components/generate/PromptMode.tsx` — Text-only prompt input
- `components/generate/PhotoTextMode.tsx` — Photo upload + text description
- `components/generate/PhotoItemMode.tsx` — Tryon mode (same as Studio)
- `components/generate/GenerateResult.tsx` — Result display + actions

### 3 Modes:

1. **Prompt Mode**: Textarea → Generate → Image result
2. **Photo + Description Mode**: Upload photo → Describe what you want → Generate
3. **Photo + Item Mode**: Upload 2 photos → Generate (same API as Studio)

**Data**: Multiple `POST /api/generate/**` endpoints

---

## 🤖 4. AI Style Advisor (`/advisor`)

**Purpose:** Chat-like interface where user asks fashion questions + uploads their photo.

### Components:

- `components/advisor/AdvisorPhotoUpload.tsx` — Photo upload (optional)
- `components/advisor/AdvisorChat.tsx` — Chat UI with message history
- `components/advisor/StyleCard.tsx` — Displays AI advice as a styled card
- `components/advisor/PromptExport.tsx` — "Use in Studio" button that copies the extracted prompt

### Flow:

1. User optionally uploads their photo
2. User types their question (e.g., "What outfit would suit me for a summer wedding?")
3. AI responds with markdown-formatted fashion advice
4. At the bottom: "Ready-to-use Prompt" with "Open in Generate Studio" button
5. History of past advisor sessions shown below

**Data**: `POST /api/advisor/analyze` | `GET /api/advisor/history`

---

## 👗 5. Wardrobe (`/wardrobe`)

**Purpose:** Personal digital closet of saved AI-generated looks.

### Components:

- `components/wardrobe/WardrobeGrid.tsx` — Masonry or uniform grid of looks
- `components/wardrobe/LookCard.tsx` — Individual look with hover actions
- `components/wardrobe/CollectionSelector.tsx` — Filter/create collections
- `components/wardrobe/LookDetail.tsx` — Expanded modal view of a look

### Features:

- Grid view of all saved looks
- Filter by collection, date, tags
- Collections sidebar/tabs
- Hover card: View full size, Edit tags, Delete, Share, Download
- Create collection / Move to collection

**Data**: `GET /api/wardrobe` | `GET /api/wardrobe/collections`

---

## 👤 6. Profile (`/profile`)

**Purpose:** User's account overview and quick stats.

### Components:

- `components/profile/ProfileHeader.tsx` — Avatar, name, email, join date
- `components/profile/ProfileStats.tsx` — Stats cards: total generations, saved looks, advisor sessions
- `components/profile/SubscriptionBadge.tsx` — Free/Pro badge with upgrade CTA

### Sub-pages:

- `/profile/settings` — Name, email, password, avatar, delete account
- `/profile/history` — All generation history with filters, re-generate actions

**Data**: `GET /api/profile`

---

## 💎 7. Pricing (`/pricing`)

**Purpose:** Convert free users to Pro.

### Features:

- Two pricing tiers with feature list comparison
- Animated feature highlight on hover
- "Most Popular" badge on Pro
- FAQ accordion section

---

## 🔐 8. Auth Pages (`/login`, `/register`, `/forgot-password`)

### Design:

- Split screen: left = form, right = animated product preview / showcase
- Glass morphism card for the form
- Google OAuth button
- Smooth transition animations between pages

---

## 🛡️ 9. Admin Panel (`/admin/**`)

**Purpose:** Platform management for administrators.

### Pages:

#### `/admin/dashboard`

- Stats overview cards (total users, generations today, pro subscribers)
- Recent activity feed
- Quick actions

#### `/admin/users`

- Searchable, filterable user table
- Actions: view, promote to admin, change plan, delete
- User detail drawer

#### `/admin/generations`

- All generations log
- Filter by mode, status, user, date range
- Preview generated images
- Flag/remove inappropriate content

#### `/admin/analytics`

- Charts: generations over time, popular modes, user growth
- Built with Recharts

### Components:

- `components/admin/StatsCards.tsx`
- `components/admin/UsersTable.tsx`
- `components/admin/GenerationsLog.tsx`
- `components/admin/AnalyticsCharts.tsx`

---

## 🗺️ Navigation

### Header (main app):

- Logo → `/`
- Studio → `/studio`
- Generate → `/generate`
- Advisor → `/advisor`
- Wardrobe → `/wardrobe` (auth required)
- Profile avatar → dropdown (Profile, Settings, History, Logout)
- "Upgrade" badge (if free plan)

### Footer:

- Product links, legal links, social links
- Theme is dark with subtle animated gradient border at top

### Admin Sidebar:

- Dashboard, Users, Generations, Analytics
- Logout button at bottom
