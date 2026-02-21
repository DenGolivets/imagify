export const Colors = {
  // ─── Primary Brand — Electric Violet ───────────────────────────────────────
  primary: "#7C3AED", // Violet 700
  primaryLight: "#A78BFA", // Violet 400
  primaryDark: "#5B21B6", // Violet 800
  primaryGlow: "rgba(124, 58, 237, 0.3)",

  // ─── Secondary — Fuchsia Accent ────────────────────────────────────────────
  secondary: "#D946EF", // Fuchsia 500
  secondaryLight: "#F0ABFC", // Fuchsia 300
  secondaryDark: "#A21CAF", // Fuchsia 700

  // ─── Backgrounds (Dark Theme) ──────────────────────────────────────────────
  bg: "#09090B", // Zinc 950 — main background
  bgElevated: "#18181B", // Zinc 900 — cards, panels
  bgMuted: "#27272A", // Zinc 800 — subtle elevation

  // ─── Glass Morphism ────────────────────────────────────────────────────────
  glass: "rgba(24, 24, 27, 0.6)",
  glassBorder: "rgba(255, 255, 255, 0.08)",

  // ─── Text ──────────────────────────────────────────────────────────────────
  textPrimary: "#FAFAFA", // Near white
  textSecondary: "#A1A1AA", // Zinc 400
  textMuted: "#52525B", // Zinc 600
  textInverse: "#09090B", // For light backgrounds

  // ─── Status ────────────────────────────────────────────────────────────────
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  info: "#3B82F6",
  infoLight: "#DBEAFE",

  // ─── Borders ───────────────────────────────────────────────────────────────
  border: "rgba(255, 255, 255, 0.1)",
  borderHover: "rgba(124, 58, 237, 0.5)",
  borderFocus: "#7C3AED",

  // ─── Gradients ─────────────────────────────────────────────────────────────
  gradients: {
    primary: "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)",
    primarySubtle:
      "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(217,70,239,0.2) 100%)",
    hero: "linear-gradient(135deg, #09090B 0%, #1a0533 50%, #09090B 100%)",
    card: "linear-gradient(145deg, rgba(124,58,237,0.1) 0%, rgba(217,70,239,0.05) 100%)",
    glow: "radial-gradient(ellipse at center, rgba(124,58,237,0.4) 0%, transparent 70%)",
  },

  // ─── Overlays ──────────────────────────────────────────────────────────────
  overlay: "rgba(0, 0, 0, 0.6)",
  overlayLight: "rgba(0, 0, 0, 0.3)",
} as const;

export const Typography = {
  fontSans: "var(--font-sans)",
  fontDisplay: "var(--font-display)",

  // ─── Size Scale ────────────────────────────────────────────────────────────
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",

  // ─── Font Weights ──────────────────────────────────────────────────────────
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

export const Spacing = {
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
} as const;

export const BorderRadius = {
  none: "0",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

export const Shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
  md: "0 4px 12px rgba(0, 0, 0, 0.4)",
  lg: "0 10px 40px rgba(0, 0, 0, 0.5)",
  xl: "0 20px 60px rgba(0, 0, 0, 0.6)",
  glow: "0 0 30px rgba(124, 58, 237, 0.4)",
  glowStrong: "0 0 60px rgba(124, 58, 237, 0.6)",
  glowFuchsia: "0 0 40px rgba(217, 70, 239, 0.4)",
  card: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
  inner: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
} as const;

export const Animations = {
  fast: "150ms ease",
  normal: "250ms ease",
  slow: "400ms ease",
  spring: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  easeOut: "400ms cubic-bezier(0.22, 1, 0.36, 1)",
  easeIn: "300ms cubic-bezier(0.4, 0, 1, 1)",
} as const;

export const ZIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
} as const;

export const Breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ─── Semantic Aliases (for readability in components) ──────────────────────────
export const Theme = {
  color: Colors,
  font: Typography,
  spacing: Spacing,
  radius: BorderRadius,
  shadow: Shadows,
  animation: Animations,
  zIndex: ZIndex,
  breakpoint: Breakpoints,
} as const;

export type ColorKey = keyof typeof Colors;
export type SpacingKey = keyof typeof Spacing;
export type ThemeType = typeof Theme;
