export const AI_MODELS = {
  IMAGE: "gemini-2.5-flash-image",
  TEXT: "meta-llama/llama-4-scout-17b-16e-instruct",
} as const;

export const GENERATION_LIMITS = {
  FREE: 5,
  PRO: 100,
} as const;

export const SYSTEM_PROMPTS = {
  ADVISOR: `You are an expert fashion stylist. Analyze the uploaded photo and provide detailed style advice.`,
  PROMPT_EXTRACTOR: `Extract a clear image generation prompt from the following style advice.`,
} as const;
