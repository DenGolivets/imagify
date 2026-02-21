import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_MODELS } from "@/constants/ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: AI_MODELS.IMAGE,
});

/**
 * Generates a virtual try-on image by merging a person photo and an item photo.
 */
export async function generateTryOn(
  userPhotoBase64: string,
  userPhotoMimeType: string,
  itemPhotoBase64: string,
  itemPhotoMimeType: string,
) {
  const prompt = `
    You are an AI virtual try-on assistant.
    The first image is a person. The second image is a clothing item or accessory.
    Please generate a high-quality image of the person wearing the item.
    Ensure the fit is natural, the lighting matches, and the person's identity is preserved.
    Return ONLY the image data.
  `;

  const result = await geminiModel.generateContent([
    prompt,
    {
      inlineData: {
        data: userPhotoBase64,
        mimeType: userPhotoMimeType,
      },
    },
    {
      inlineData: {
        data: itemPhotoBase64,
        mimeType: itemPhotoMimeType,
      },
    },
  ]);

  const response = result.response;
  return response;
}

/**
 * Generates an image based on a text prompt.
 */
export async function generateFromPrompt(prompt: string) {
  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  return response;
}
