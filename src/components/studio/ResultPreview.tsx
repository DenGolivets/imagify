"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { CompareSlider } from "@/components/ui/CompareSlider";

interface ResultPreviewProps {
  isLoading: boolean;
  resultImage?: string;
  beforeImage?: string;
  mode?: string;
}

export function ResultPreview({
  isLoading,
  resultImage,
  beforeImage,
  mode,
}: ResultPreviewProps) {
  if (isLoading) {
    return (
      <div className="relative aspect-4/5 rounded-[40px] overflow-hidden bg-zinc-950 border border-white/5 flex items-center justify-center">
        {/* Shimmer Background */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 animate-pulse" />

        <div className="relative z-10 flex flex-col items-center space-y-8">
          {/* Animated Loader */}
          <div className="relative">
            <div className="size-24 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="size-8 text-violet-400 animate-pulse" />
            </div>
            {/* Pulsing Glow */}
            <div className="absolute -inset-4 bg-violet-500/20 blur-3xl rounded-full animate-pulse" />
          </div>

          <div className="text-center space-y-3">
            <h3 className="text-2xl font-display font-black text-white tracking-tight">
              Working its Magic...
            </h3>
            <p className="text-sm text-zinc-500 max-w-60 mx-auto uppercase tracking-[0.2em]">
              Imagifying your {mode === "tryon" ? "fit" : "look"}
            </p>
          </div>

          {/* Progress simulation dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="size-2 rounded-full bg-violet-500"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!resultImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative aspect-4/5 rounded-[40px] overflow-hidden bg-zinc-950 border border-white/10 group shadow-2xl shadow-black/50"
    >
      {beforeImage && (mode === "tryon" || mode === "photo_text") ? (
        <CompareSlider
          beforeImage={beforeImage}
          afterImage={resultImage}
          aspectRatio="aspect-4/5"
        />
      ) : (
        <Image
          src={resultImage}
          alt="AI Result"
          fill
          className="object-cover"
        />
      )}

      {/* Floating Badge */}
      <div className="absolute top-6 right-6">
        <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center space-x-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            AI Perfect Fit
          </span>
        </div>
      </div>
    </motion.div>
  );
}
