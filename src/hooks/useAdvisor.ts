"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { AdvisorInput } from "@/lib/validations/advisor";

export interface AdvisorSession {
  sessionId: string;
  advice: string;
  generatedPrompt: string | null;
  createdAt: string | Date;
}

export interface AdvisorSessionRow {
  id: string;
  userId: string;
  userPhotoUrl: string | null;
  userMessage: string;
  aiResponse: string;
  extractedPrompt: string | null;
  createdAt: string | Date;
}

export function useAdvisor() {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<AdvisorSessionRow[]>([]);
  const [currentAdvice, setCurrentAdvice] = useState<AdvisorSession | null>(
    null,
  );

  const analyze = async (data: AdvisorInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/advisor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        let message = result.error || "Failed to get advice";
        if (result.error === "rate_limited") {
          message = "You're asking too fast! Please wait a moment.";
        }
        throw new Error(message);
      }

      setCurrentAdvice(result);
      // Refresh history implicitly or manually
      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = useCallback(async (limit = 20) => {
    try {
      const res = await fetch(`/api/advisor/history?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Fetch history error:", error);
    }
  }, []);

  return {
    analyze,
    fetchHistory,
    isLoading,
    history,
    currentAdvice,
    setCurrentAdvice,
  };
}
