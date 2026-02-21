export const APP_CONFIG = {
  NAME: "Imagify",
  DESCRIPTION: "AI-powered Virtual Try-On Platform",
  URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  MAX_IMAGE_SIZE: 4 * 1024 * 1024, // 4MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  THEME_COLOR: "#7C3AED",
} as const;
