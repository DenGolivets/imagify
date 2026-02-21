"use client";

import { motion } from "framer-motion";
import { Type, Image as ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type GenerateMode = "prompt" | "photo_text" | "tryon";

interface GenerateModeTabsProps {
  activeMode: GenerateMode;
  onModeChange: (mode: GenerateMode) => void;
  disabled?: boolean;
}

export function GenerateModeTabs({
  activeMode,
  onModeChange,
  disabled,
}: GenerateModeTabsProps) {
  const tabs = [
    { id: "prompt", label: "Prompt", icon: Type },
    { id: "photo_text", label: "Edit Photo", icon: ImageIcon },
    { id: "tryon", label: "Try-On", icon: Sparkles },
  ] as const;

  return (
    <div className="flex justify-center">
      <div className="inline-flex p-1.5 rounded-2xl bg-zinc-900/80 border border-white/5 backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = activeMode === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onModeChange(tab.id)}
              disabled={disabled}
              className={cn(
                "relative flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-violet-600 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={cn(
                  "size-4 relative z-10",
                  isActive && "animate-pulse",
                )}
              />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
