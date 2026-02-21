import Groq from "groq-sdk";
import { AI_MODELS, SYSTEM_PROMPTS } from "@/constants/ai";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Analyzes a photo and provides fashion style advice.
 */
export async function analyzeStyle(
  photoBase64?: string,
  photoMimeType?: string,
  userMessage?: string,
) {
  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: SYSTEM_PROMPTS.ADVISOR,
    },
  ];

  if (photoBase64 && photoMimeType) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userMessage || "What do you think of my style?" },
        {
          type: "image_url",
          image_url: {
            url: `data:${photoMimeType};base64,${photoBase64}`,
          },
        },
      ],
    });
  } else {
    messages.push({
      role: "user",
      content: userMessage || "Give me some general fashion advice.",
    });
  }

  const completion = await groq.chat.completions.create({
    messages,
    model: AI_MODELS.TEXT,
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    stream: false,
  });

  return completion.choices[0].message.content;
}

/**
 * Extracts a generation prompt from style advice.
 */
export async function extractPrompt(advice: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPTS.PROMPT_EXTRACTOR,
      },
      {
        role: "user",
        content: advice,
      },
    ],
    model: AI_MODELS.TEXT,
    temperature: 0.3,
  });

  return completion.choices[0].message.content;
}
