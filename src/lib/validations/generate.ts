import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "@/constants/ai";

const maxBase64Size = MAX_IMAGE_SIZE_MB * 1024 * 1024 * 1.37; // ~37% overhead for base64

const base64ImageSchema = z
  .string()
  .min(1, "Image data is required")
  .max(maxBase64Size, `Image must be under ${MAX_IMAGE_SIZE_MB}MB`);

const mimeTypeSchema = z.enum(ACCEPTED_IMAGE_TYPES as [string, ...string[]], {
  error: "Unsupported image type. Use JPEG, PNG, or WebP.",
});

/**
 * Schema for Virtual Try-On mode.
 * POST /api/generate/tryon
 */
export const tryOnSchema = z.object({
  userPhotoBase64: base64ImageSchema,
  userPhotoMimeType: mimeTypeSchema,
  itemPhotoBase64: base64ImageSchema,
  itemPhotoMimeType: mimeTypeSchema,
});

/**
 * Schema for Text Prompt mode.
 * POST /api/generate/from-prompt
 */
export const fromPromptSchema = z.object({
  prompt: z
    .string()
    .min(3, "Prompt must be at least 3 characters")
    .max(500, "Prompt must be at most 500 characters"),
});

/**
 * Schema for Photo + Text Description mode.
 * POST /api/generate/from-photo-text
 */
export const fromPhotoTextSchema = z.object({
  photoBase64: base64ImageSchema,
  photoMimeType: mimeTypeSchema,
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description must be at most 500 characters"),
});

export type TryOnInput = z.infer<typeof tryOnSchema>;
export type FromPromptInput = z.infer<typeof fromPromptSchema>;
export type FromPhotoTextInput = z.infer<typeof fromPhotoTextSchema>;
