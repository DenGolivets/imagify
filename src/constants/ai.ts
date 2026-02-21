export const AI_MODELS = {
  IMAGE: "gemini-2.5-flash-preview-05-20",
  TEXT: "meta-llama/llama-4-scout-17b-16e-instruct",
} as const;

export const GENERATION_LIMITS = {
  FREE: 10,
  PRO: Infinity,
} as const;

export const RATE_LIMITS = {
  GENERATE_PER_MINUTE: 3,
  ADVISOR_PER_MINUTE: 5,
} as const;

export const MAX_IMAGE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
