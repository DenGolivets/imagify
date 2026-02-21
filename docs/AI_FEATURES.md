# Imagify — AI Features Integration

## Overview

Imagify uses two AI providers:

1. **Google Gemini 2.5 Flash** — Image generation, editing, virtual try-on
2. **Groq API (LLaMA 4 Scout)** — Fashion advice text generation, style recommendations

---

## 🖼️ Gemini 2.5 Flash — Image AI

### Client Setup

File: `src/lib/ai/gemini.ts`

```typescript
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiFlashModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

export async function generateTryOn(
  userPhotoBase64: string,
  itemPhotoBase64: string,
  userMimeType: string = "image/jpeg",
  itemMimeType: string = "image/jpeg",
): Promise<string> {
  const prompt = `You are a virtual try-on assistant. 
  The first image is a person's photo. 
  The second image is a clothing item or accessory.
  Generate a photorealistic image of the person wearing/using the item from the second image.
  Preserve the person's face, body proportions, and background exactly.
  Only change the clothing/accessory to the item shown.
  Return a high-quality, realistic result.`;

  const result = await geminiFlashModel.generateContent([
    { inlineData: { mimeType: userMimeType, data: userPhotoBase64 } },
    { inlineData: { mimeType: itemMimeType, data: itemPhotoBase64 } },
    { text: prompt },
  ]);

  const response = result.response;
  // Extract base64 image from response
  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData,
  );
  if (!imagePart?.inlineData) throw new Error("No image generated");
  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

export async function generateFromPrompt(prompt: string): Promise<string> {
  const enhancedPrompt = `Create a high-quality, photorealistic fashion image: ${prompt}. 
  Style: editorial fashion photography, professional lighting, sharp details.`;

  const result = await geminiFlashModel.generateContent([
    { text: enhancedPrompt },
  ]);
  const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData,
  );
  if (!imagePart?.inlineData) throw new Error("No image generated");
  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

export async function generateFromPhotoWithText(
  photoBase64: string,
  description: string,
  mimeType: string = "image/jpeg",
): Promise<string> {
  const prompt = `Edit this photo to match the following description: ${description}.
  Preserve the person's face and identity. Make the changes look photorealistic and natural.`;

  const result = await geminiFlashModel.generateContent([
    { inlineData: { mimeType, data: photoBase64 } },
    { text: prompt },
  ]);

  const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData,
  );
  if (!imagePart?.inlineData) throw new Error("No image generated");
  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}
```

---

## 💬 Groq (LLaMA 4 Scout) — Text AI

### Client Setup

File: `src/lib/ai/groq.ts`

```typescript
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export interface StyleAdviceInput {
  userMessage: string;
  photoBase64?: string;
  photoMimeType?: string;
}

export async function getStyleAdvice(input: StyleAdviceInput): Promise<string> {
  const systemPrompt = `You are Imagify's AI Style Advisor — a professional fashion stylist with expertise in personal styling, color theory, and trend awareness.
When given a photo and/or question about style, you:
1. Analyze the person's body type, skin tone, and current style (if photo provided)
2. Give specific, actionable clothing recommendations
3. Suggest color palettes that complement them
4. Mention specific clothing items, brands style, and occasion-appropriate outfits
5. End with a "Try-On Prompt" section with 2-3 ready-to-use prompts for the AI Generate Studio
Format your response in clean markdown with sections.`;

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
  ];

  if (input.photoBase64) {
    messages.push({
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: `data:${input.photoMimeType ?? "image/jpeg"};base64,${input.photoBase64}`,
          },
        },
        { type: "text", text: input.userMessage },
      ],
    });
  } else {
    messages.push({ role: "user", content: input.userMessage });
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 2048,
    temperature: 0.7,
  });

  return (
    completion.choices[0]?.message?.content ??
    "Sorry, I could not generate advice at this time."
  );
}

export async function extractGeneratePrompt(
  styleAdvice: string,
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `From the following style advice, extract the most useful image generation prompt that can be used with an AI image generator to create the recommended look. Return ONLY the prompt, nothing else:\n\n${styleAdvice}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.3,
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}
```

---

## 🎨 Generate Studio — 3 Modes

### Mode 1: From Prompt

```
Endpoint: POST /api/generate/from-prompt
Input: { prompt: string }
Process:
  1. Validate input (Zod)
  2. Rate limit check (Upstash)
  3. Check user generation limit
  4. Call generateFromPrompt(prompt)
  5. Save to generations table
  6. Increment user generationsCount
  7. Return { imageBase64, generationId }
```

### Mode 2: Photo + Text Description

```
Endpoint: POST /api/generate/from-photo-text
Input: { photoBase64: string, description: string }
Process:
  1. Validate + rate limit
  2. Check limit
  3. Call generateFromPhotoWithText(photo, description)
  4. Save to generations table
  5. Increment count
  6. Return result
```

### Mode 3: Virtual Try-On (Photo + Item Photo)

```
Endpoint: POST /api/generate/tryon
Input: { userPhotoBase64: string, itemPhotoBase64: string }
Process:
  1. Validate + rate limit
  2. Check limit
  3. Call generateTryOn(userPhoto, itemPhoto)
  4. Save to generations table
  5. Increment count
  6. Return result
```

---

## 🧥 Virtual Try-On Studio (Hero Feature)

The Studio page (`/studio`) provides the quickest try-on experience:

- **Drag & drop** two photos side by side
- Click **"Try On"** → loading state with animation
- Result appears as a **slider comparison** (before/after)
- **Save to Wardrobe** button
- **Share / Download** buttons

This mirrors the hero section demo on the landing page.

---

## 🤖 AI Constants

File: `src/constants/ai.ts`

```typescript
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
```

---

## ⚠️ Error Handling

All AI API calls are wrapped with try/catch and return user-friendly errors:

- `limit_exceeded` → Show Upgrade modal
- `rate_limited` → "Please wait 60 seconds"
- `content_violation` → "Image not allowed"
- `generation_failed` → "Try again" with retry button
- All errors logged with generation details for admin review
