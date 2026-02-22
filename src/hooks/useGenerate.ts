"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface GenerateResponse {
  generationId: string;
  imageBase64: string;
  mode: string;
  createdAt: string;
}

interface TryOnParams {
  userPhotoBase64: string;
  userPhotoMimeType: string;
  itemPhotoBase64: string;
  itemPhotoMimeType: string;
}

interface FromPromptParams {
  prompt: string;
}

interface FromPhotoTextParams {
  photoBase64: string;
  photoMimeType: string;
  description: string;
}

export function useGenerate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const generate = async (endpoint: string, data: unknown) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resultData = await res.json();

      if (!res.ok) {
        let message = resultData.error || "Generation failed";
        if (resultData.error === "rate_limited") {
          message = "Slow down! You're generating too fast.";
        } else if (resultData.error === "limit_exceeded") {
          message =
            "You've reached your generation limit. Upgrade to Pro for more!";
        }
        throw new Error(message);
      }

      setResult(resultData);
      return resultData;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const tryOn = (params: TryOnParams) =>
    generate("/api/generate/tryon", params);
  const fromPrompt = (params: FromPromptParams) =>
    generate("/api/generate/from-prompt", params);
  const fromPhotoText = (params: FromPhotoTextParams) =>
    generate("/api/generate/from-photo-text", params);

  const reset = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    result,
    tryOn,
    fromPrompt,
    fromPhotoText,
    reset,
  };
}
