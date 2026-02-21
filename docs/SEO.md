# Imagify — SEO Strategy

## Overview

Imagify uses **Next.js 15 Metadata API** for all SEO. Every page exports a `metadata` object or uses `generateMetadata()` for dynamic pages.

---

## 🌐 Global SEO Config

File: `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Imagify — AI Virtual Try-On | Try Clothes Online",
    template: "%s | Imagify",
  },
  description:
    "Imagify is an AI-powered virtual try-on platform. Upload your photo and try on any clothing, accessory, or device instantly using advanced AI image generation.",
  keywords: [
    "virtual try-on",
    "AI fashion",
    "try clothes online",
    "virtual fitting room",
    "AI image generation",
    "fashion AI",
    "outfit try on",
    "AI stylist",
  ],
  authors: [{ name: "Imagify" }],
  creator: "Imagify",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://imagify.app",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imagify.app",
    siteName: "Imagify",
    title: "Imagify — AI Virtual Try-On",
    description:
      "Try on clothes, accessories, and devices with AI. Upload your photo and see yourself in any outfit instantly.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Imagify — AI Virtual Try-On Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imagify — AI Virtual Try-On",
    description:
      "Try on clothes with AI. Upload your photo and see yourself in any outfit.",
    images: ["/og-image.jpg"],
    creator: "@imagifyapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};
```

---

## 📄 Per-Page Metadata

### Home (`/`)

```typescript
export const metadata: Metadata = {
  title: "Imagify — AI Virtual Try-On | Try Clothes Online",
  description:
    "The #1 AI virtual try-on platform. Upload your photo and try on any outfit, accessory, or device in seconds.",
};
```

### Studio (`/studio`)

```typescript
export const metadata: Metadata = {
  title: "Virtual Try-On Studio",
  description:
    "Try on any clothing or accessory using your own photo. AI-powered virtual fitting room.",
};
```

### Generate (`/generate`)

```typescript
export const metadata: Metadata = {
  title: "AI Generate Studio",
  description:
    "Generate fashion photos using AI. Create from prompts, edit your photo, or virtual try-on.",
};
```

### Advisor (`/advisor`)

```typescript
export const metadata: Metadata = {
  title: "AI Style Advisor",
  description:
    "Get personalized fashion advice from our AI stylist. Upload your photo for a style analysis.",
};
```

### Pricing (`/pricing`)

```typescript
export const metadata: Metadata = {
  title: "Pricing Plans",
  description:
    "Choose your Imagify plan. Free tier available. Upgrade to Pro for unlimited AI generations.",
};
```

---

## 🗺️ Sitemap

File: `src/app/sitemap.ts`

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://imagify.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/studio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/generate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/advisor`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
```

---

## 🤖 Robots.txt

File: `src/app/robots.ts`

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/studio", "/generate", "/advisor", "/pricing"],
        disallow: ["/admin/", "/api/", "/profile/", "/wardrobe/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
```

---

## 📊 Structured Data (JSON-LD)

Add to landing page for rich search results:

```typescript
// In src/app/(main)/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Imagify",
  applicationCategory: "LifestyleApplication",
  description: "AI-powered virtual try-on platform for fashion",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available",
  },
  featureList: [
    "Virtual Try-On",
    "AI Style Advisor",
    "AI Generate Studio",
    "Digital Wardrobe",
  ],
};
```

---

## ⚡ Core Web Vitals Targets

| Metric                         | Target  |
| ------------------------------ | ------- |
| LCP (Largest Contentful Paint) | < 2.5s  |
| FID / INP                      | < 100ms |
| CLS (Cumulative Layout Shift)  | < 0.1   |

### Optimizations:

- `next/image` with `priority` on hero images
- Font preloading (Inter + Outfit via `next/font`)
- Three.js loaded with `dynamic()` (no SSR)
- Framer Motion: use `LazyMotion` + `domAnimation` feature bundle
- Route prefetching via Next.js Link component
