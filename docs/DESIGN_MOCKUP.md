# Imagify — Visual Design Specification

## 🎨 Visual Identity

**Theme:** Dark Mode Luxury Fashion AI  
**Palette:** Deep blacks + Electric Violet → Fuchsia gradients  
**Aesthetic:** Glass morphism panels, neon glows, editorial fashion photography style

---

## 🏠 Landing Page Layout

### Hero Section

```
┌──────────────────────────────────────────────────────────────────────┐
│  [HEADER] Logo           Studio  Generate  Advisor  [Login] [Try Free]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ✦ Three.js 3D animated background (floating particles / cloth)      │
│                                                                       │
│         "Try It On                                                    │
│          Before You                        ┌──────────────────┐      │
│          Buy It."                          │  🟣 RESULT CARD  │      │
│                                            │  ┌────┐ ┌────┐   │      │
│   The AI-powered virtual                  │  │ 👤 │→│ 👓 │   │      │
│   fitting room.                            │  └────┘ └────┘   │      │
│                                            │         ↓        │      │
│   [Try for Free →]  [Watch Demo]           │  ┌──────────┐    │      │
│                                            │  │  👤👓   │    │      │
│                                            │  │ (result) │    │      │
│                                            │  └──────────┘    │      │
│                                            └──────────────────┘      │
│                                                                       │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Hero Demo Card (right side):**

- Shows 3 items: user photo + item photo → AI result
- Animated "try-on" flow with connecting arrow/line animation
- Real-looking example: person without glasses → glasses isolated → person WITH glasses
- Glass morphism card with violet glow border
- Subtle floating animation (up/down, 3-4s loop)

---

## 🎨 Color Usage Map

| Element        | Color Token                 |
| -------------- | --------------------------- |
| Background     | `Colors.bg` (#09090B)       |
| Card/Panel     | `Colors.bgElevated` + glass |
| Primary CTA    | `Colors.gradients.primary`  |
| Accent text    | `Colors.primaryLight`       |
| Body text      | `Colors.textPrimary`        |
| Muted text     | `Colors.textSecondary`      |
| Borders        | `Colors.glassBorder`        |
| Glow effects   | `Colors.primaryGlow`        |
| Success states | `Colors.success`            |
| Error states   | `Colors.error`              |

---

## 🧩 Component Visual Specs

### Primary Button

```
Background: linear-gradient(135deg, #7C3AED → #D946EF)
Text: White, font-semibold
Padding: 14px 28px
Border-radius: 12px
Hover: scale(1.03) + stronger glow shadow
Active: scale(0.97)
Transition: 250ms ease
Glow: 0 0 30px rgba(124,58,237,0.4)
```

### Glass Card

```
Background: rgba(24,24,27,0.6)
Backdrop blur: 20px
Border: 1px solid rgba(255,255,255,0.08)
Border-radius: 24px
Box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)
Hover: border-color: rgba(124,58,237,0.3)
```

### Photo Drop Zone

```
Border: 2px dashed rgba(124,58,237,0.4)
Border-radius: 20px
Background: rgba(124,58,237,0.05)
Hover: border solid, rgba(124,58,237,0.7), background rgba(124,58,237,0.1)
Center: Icon (upload arrow) + "Drop your photo here" text
```

### Navigation Header

```
Background: rgba(9,9,11,0.8) + backdrop-blur(20px)
Border-bottom: 1px solid rgba(255,255,255,0.06)
Position: sticky top-0
Height: 72px
Logo: Gradient text "Imagify" using primary gradient
```

### Input Fields

```
Background: rgba(39,39,42,0.8)
Border: 1px solid rgba(255,255,255,0.1)
Border-radius: 10px
Focus border: Colors.primary
Text: Colors.textPrimary
Placeholder: Colors.textMuted
Transition: border-color 200ms
```

---

## 📱 Mobile Design

### Header (Mobile)

```
[ Logo ]                              [ ☰ ]
```

- Hamburger → Full screen overlay menu
- Slide-in from right
- Duration: 300ms spring

### Studio (Mobile)

```
┌─────────────────────────────┐
│  Your Photo                 │
│  ┌─────────────────────┐   │
│  │   [Drop Zone]       │   │
│  └─────────────────────┘   │
│                             │
│  Item Photo                 │
│  ┌─────────────────────┐   │
│  │   [Drop Zone]       │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │    ✨ Try On         │   │
│  └─────────────────────┘   │
│                             │
│  Result:                    │
│  ┌─────────────────────┐   │
│  │   [Generated Image] │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

### Bottom Navigation (Mobile Alternative)

Consider a sticky bottom tab bar on mobile:

- 🏠 Home | 🪞 Studio | ✨ Generate | 🤖 Advisor | 👗 Wardrobe

---

## 🌟 Special UI Effects

### Gradient Text

Used on hero headline:

```css
background: linear-gradient(135deg, #a78bfa 0%, #f0abfc 50%, #7c3aed 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Page Transition

Fade + slight upward motion between routes:

```typescript
// Framer Motion AnimatePresence in layout
initial: { opacity: 0, y: 10 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -10 }
transition: { duration: 0.3 }
```

### Feature Cards — Stagger Animation

On landing page scroll-into-view:

```
Card 1 → fade in (delay: 0ms)
Card 2 → fade in (delay: 100ms)
Card 3 → fade in (delay: 200ms)
```

### Loading State — AI Generation

While waiting for Gemini to generate:

1. Full overlay on result area
2. Animated gradient shimmer background
3. "✨ Imagify is working its magic..." text
4. Subtle pulsing glow border on the loading area
5. Progress-like dots animation

---

## 🗺️ Admin Panel Layout

```
┌──────────┬──────────────────────────────────────┐
│          │  📊 Dashboard                        │
│ 📊 Dash  │                                      │
│          │  ┌────────┐ ┌────────┐ ┌─────────┐  │
│ 👥 Users │  │Users:  │ │Gen:    │ │Pro:     │  │
│          │  │ 1,234  │ │ 5,678  │ │  234    │  │
│ 🖼️ Gens  │  └────────┘ └────────┘ └─────────┘  │
│          │                                      │
│ 📈 Stats │  Recent Activity...                  │
│          │                                      │
│ 🚪 Logout│                                      │
└──────────┴──────────────────────────────────────┘
```

Admin sidebar: dark, minimal, violet accent for active item.

---

## 🎬 Animation Inventory

| Animation           | Trigger          | Duration          | Library                |
| ------------------- | ---------------- | ----------------- | ---------------------- |
| Hero 3D scene       | Page load        | Continuous loop   | Three.js               |
| Hero card float     | Page load        | 4s infinite       | Framer Motion          |
| Section reveals     | Scroll into view | 0.6s              | Framer Motion          |
| Button hover glow   | Mouse enter      | 250ms             | CSS + Framer           |
| Page transitions    | Route change     | 300ms             | Framer AnimatePresence |
| Dropzone activate   | Drag over        | 200ms             | CSS                    |
| Generation loading  | API call         | Until resolved    | CSS shimmer            |
| Compare slider      | Drag             | Real-time         | CSS transform          |
| Mobile nav          | Hamburger click  | 300ms spring      | Framer Motion          |
| Feature cards       | Scroll           | 100ms stagger     | Framer Motion          |
| Notification toasts | Event            | 0.3s in, 0.2s out | react-hot-toast        |
