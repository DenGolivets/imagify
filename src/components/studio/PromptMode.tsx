"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

interface PromptModeProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptMode({ onGenerate, isLoading }: PromptModeProps) {
  const [prompt, setPrompt] = useState("");

  const suggestions = [
    "Cyberpunk streetwear collection 2025",
    "Royal vintage ballgown in velvet and gold",
    "Futuristic iridescent techwear outfit",
    "Minimalist linen summer outfit editorial",
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
          Describe the look
        </label>
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A cyberpunk jacket with glowing neon accents and high-end techwear details..."
            disabled={isLoading}
            className="w-full h-48 p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 outline-none resize-none text-white placeholder:text-zinc-600 font-medium"
          />
          <div className="absolute top-6 right-6">
            <Sparkles className="size-5 text-violet-500/40 group-focus-within:text-violet-500 group-focus-within:animate-pulse transition-colors" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">
          Quick Suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-zinc-900/60 border border-white/5 text-xs text-zinc-400 hover:text-white hover:border-violet-500/30 transition-all duration-300"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => onGenerate(prompt)}
        disabled={isLoading || prompt.trim().length < 3}
        className="w-full h-16 text-lg font-bold rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-xl shadow-violet-500/20 group relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
      >
        <span className="relative z-10 flex items-center justify-center space-x-3">
          {isLoading ? (
            <>
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="size-5 group-hover:rotate-12 transition-transform" />
              <span>Create Masterpiece</span>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>
    </div>
  );
}
