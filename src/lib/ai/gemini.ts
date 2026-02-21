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
