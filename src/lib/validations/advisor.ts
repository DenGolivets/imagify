import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "@/constants/ai";

const maxBase64Size = MAX_IMAGE_SIZE_MB * 1024 * 1024 * 1.37;

export const advisorSchema = z.object({
  message: z
    .string()
    .min(3, "Message must be at least 3 characters")
    .max(2000, "Message must be at most 2000 characters"),
  photoBase64: z
    .string()
    .max(maxBase64Size, `Image must be under ${MAX_IMAGE_SIZE_MB}MB`)
    .optional(),
  photoMimeType: z
    .enum(ACCEPTED_IMAGE_TYPES as [string, ...string[]])
    .optional(),
});

export type AdvisorInput = z.infer<typeof advisorSchema>;
