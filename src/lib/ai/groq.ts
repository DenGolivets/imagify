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
