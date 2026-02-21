# Imagify — Design System & Visual Identity

## 🎨 Brand Identity

**Name:** Imagify  
**Tagline:** "Try it on before you buy it."  
**Aesthetic:** Dark luxury fashion — deep blacks + electric purple/violet gradients, glass morphism panels, subtle neon accents  
**Mood:** Premium, futuristic, editorial fashion magazine meets cutting-edge AI tech

---

## 🌈 Color System

File: `src/styles/theme.ts`

```typescript
export const Colors = {
  // Primary brand — Electric Violet
  primary: "#7C3AED", // Violet 700
  primaryLight: "#A78BFA", // Violet 400
  primaryDark: "#5B21B6", // Violet 800
  primaryGlow: "rgba(124, 58, 237, 0.3)", // Glow effect

  // Secondary — Fuchsia accent
  secondary: "#D946EF", // Fuchsia 500
  secondaryLight: "#F0ABFC", // Fuchsia 300
  secondaryDark: "#A21CAF", // Fuchsia 700

  // Backgrounds (Dark theme)
  bg: "#09090B", // Zinc 950 — main background
  bgElevated: "#18181B", // Zinc 900 — cards, panels
  bgMuted: "#27272A", // Zinc 800 — subtle elevation

  // Glass morphism
  glass: "rgba(24, 24, 27, 0.6)",
  glassBorder: "rgba(255, 255, 255, 0.08)",

  // Text
  textPrimary: "#FAFAFA", // Near white
  textSecondary: "#A1A1AA", // Zinc 400
  textMuted: "#52525B", // Zinc 600
  textInverse: "#09090B", // For light backgrounds

  // Status colors
  success: "#10B981", // Emerald 500
  successLight: "#D1FAE5",
  warning: "#F59E0B", // Amber 500
  warningLight: "#FEF3C7",
  error: "#EF4444", // Red 500
  errorLight: "#FEE2E2",
  info: "#3B82F6", // Blue 500
  infoLight: "#DBEAFE",

  // Borders
  border: "rgba(255, 255, 255, 0.1)",
  borderHover: "rgba(124, 58, 237, 0.5)",
  borderFocus: "#7C3AED",

  // Gradient strings
  gradients: {
    primary: "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)",
    primarySubtle:
      "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(217,70,239,0.2) 100%)",
    hero: "linear-gradient(135deg, #09090B 0%, #1a0533 50%, #09090B 100%)",
    card: "linear-gradient(145deg, rgba(124,58,237,0.1) 0%, rgba(217,70,239,0.05) 100%)",
    glow: "radial-gradient(ellipse at center, rgba(124,58,237,0.4) 0%, transparent 70%)",
  },

  // Overlays
  overlay: "rgba(0, 0, 0, 0.6)",
  overlayLight: "rgba(0, 0, 0, 0.3)",
} as const;

export const Typography = {
  fontSans: "var(--font-inter)", // Inter — body text
  fontDisplay: "var(--font-outfit)", // Outfit — headings, display

  // Scale (rem)
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px

  // Weights
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

export const Spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const;

export const BorderRadius = {
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  "3xl": "2rem", // 32px
  full: "9999px",
} as const;

export const Shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
  md: "0 4px 12px rgba(0, 0, 0, 0.4)",
  lg: "0 10px 40px rgba(0, 0, 0, 0.5)",
  glow: "0 0 30px rgba(124, 58, 237, 0.4)",
  glowStrong: "0 0 60px rgba(124, 58, 237, 0.6)",
  card: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
} as const;

export const Animations = {
  fast: "150ms ease",
  normal: "250ms ease",
  slow: "400ms ease",
  spring: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const Breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
```

---

## 🖋️ Typography

**Fonts (Google Fonts):**

- **Outfit** — Display/Headings: Bold, impactful, modern geometric
- **Inter** — Body text: Clean, highly readable, widely used

```typescript
// src/app/layout.tsx
import { Inter, Outfit } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
```

**Heading Scale:**
| Tag | Size | Weight | Font |
|---|---|---|---|
| H1 | 4.5rem–7.5rem (hero) | 900 | Outfit |
| H2 | 2.25rem–3.75rem | 800 | Outfit |
| H3 | 1.5rem–1.875rem | 700 | Outfit |
| H4 | 1.25rem | 600 | Inter |
| Body | 1rem | 400 | Inter |
| Small | 0.875rem | 400 | Inter |
| Caption | 0.75rem | 400 | Inter |

---

## 🪟 Glass Morphism Style

Used throughout the UI for cards, modals, navigation:

```css
.glass-card {
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
```

---

## ✨ Animations

**Framer Motion variants used across components:**

```typescript
// Fade in up (section reveals)
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Stagger children
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

// Scale in (cards, modals)
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Glow pulse (hero CTA button)
export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(124, 58, 237, 0.3)",
      "0 0 50px rgba(124, 58, 237, 0.6)",
      "0 0 20px rgba(124, 58, 237, 0.3)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};
```

**Three.js 3D Hero:**

- Floating 3D particles/cloth simulation in hero background
- Subtle rotation and drift animation
- Loaded lazily with `dynamic()` — no SSR

---

## 📐 Layout System

- **Max width**: 1280px (`max-w-7xl`)
- **Page padding**: `px-4 sm:px-6 lg:px-8`
- **Section spacing**: `py-16 sm:py-24 lg:py-32`
- **Grid**: 12-column CSS grid via Tailwind

---

## 🧩 Component Design Patterns

### Buttons

```typescript
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "glass";
type ButtonSize = "sm" | "md" | "lg" | "xl";
```

- **Primary**: Gradient violet→fuchsia, white text, glow on hover
- **Secondary**: Glass background, violet border, violet text
- **Ghost**: Transparent, subtle hover bg
- **Glass**: Glass morphism style
- **All buttons**: Smooth scale transition (105% on hover, 98% on press)

### Cards

- Glass morphism background
- Subtle gradient border on hover
- Slight lift shadow on hover (`translateY(-4px)`)

### Image Uploader

- Large drag-drop zone with dashed gradient border
- Animated upload icon
- Preview with remove button
- Progress bar for upload state

---

## 🌐 Responsive Design

**Mobile First approach:**

- Navigation: hamburger → full-screen slide-in menu
- Studio: vertical stack on mobile vs. side-by-side on desktop
- Wardrobe grid: 2 columns → 3 → 4
- Profile: card stack on mobile vs. sidebar layout on desktop
- All modals: bottom sheet on mobile, centered dialog on desktop
