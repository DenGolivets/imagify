"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";

export function HeroDemo() {
  // Start with loader visible, result hidden
  const [isGenerating, setIsGenerating] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let loopTimer: NodeJS.Timeout;
    let innerTimer: NodeJS.Timeout;

    // Initial 5-second load before first reveal
    const initialTimer = setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);

      // After first reveal, loop: hide → loader 2s → show every 7s
      loopTimer = setInterval(() => {
        setShowResult(false);
        setIsGenerating(true);
        innerTimer = setTimeout(() => {
          setIsGenerating(false);
          setShowResult(true);
        }, 2000);
      }, 7000);
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(loopTimer);
      clearTimeout(innerTimer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
      className="relative"
    >
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-3xl bg-linear-to-br from-violet-500/40 to-fuchsia-500/40 blur-xl opacity-50 pointer-events-none" />

      <div className="relative rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl space-y-4">
        {/* ── TOP ROW: Person + Plus + Item ── */}
        <div className="flex items-end gap-3">
          {/* Person */}
          <div className="flex-1 space-y-1.5">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
              Your Photo
            </span>
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden border border-white/8 bg-zinc-800">
              <Image
                src="/hero/man(item).jpeg"
                alt="Person"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-zinc-900/60 to-transparent" />
            </div>
          </div>

          {/* Plus connector */}
          <div className="flex flex-col items-center gap-1 pb-6">
            <div className="size-8 rounded-full bg-violet-600 flex items-center justify-center shadow-[0_0_16px_rgba(124,58,237,0.6)] border-2 border-zinc-900">
              <Plus className="size-4 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Item — Glasses */}
          <div className="flex-1 space-y-1.5">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
              Try Item
            </span>
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden border border-violet-500/25 bg-white/5">
              <Image
                src="/hero/glasses(item).png"
                alt="Glasses"
                fill
                className="object-contain p-3"
              />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="block text-center text-[9px] font-bold text-violet-300 bg-violet-900/70 backdrop-blur-sm rounded-full py-0.5 px-2">
                  Sunglasses
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── DIVIDER with AI label ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-violet-500/40 to-transparent" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30">
            <Sparkles className="size-3 text-violet-400" />
            <span className="text-[9px] uppercase tracking-widest text-violet-400 font-extrabold">
              AI Try-On
            </span>
          </div>
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-violet-500/40 to-transparent" />
        </div>

        {/* ── RESULT CARD ── */}
        <div
          className="relative rounded-2xl overflow-hidden border border-violet-500/30 bg-zinc-800"
          style={{ aspectRatio: "4/3" }}
        >
          {/* Result image */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                <Image
                  src="/hero/response.jpeg"
                  alt="Person wearing glasses — AI result"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-white text-xs font-bold drop-shadow-sm">
                    ✓ Perfectly Fitted
                  </span>
                  <span className="text-[9px] text-violet-300 font-bold bg-violet-900/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    AI Generated
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generating overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/95 backdrop-blur-sm gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="size-9 rounded-full border-2 border-violet-500 border-t-transparent"
                />
                <span className="text-xs text-violet-300 font-medium tracking-wide">
                  Generating try-on…
                </span>
                {/* Scan lines for effect */}
                <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-0 right-0 h-px bg-violet-400"
                      style={{ top: `${i * 14 + 3}%` }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.15,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating badge */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-xl"
        >
          ✨ High Fidelity
        </motion.div>
      </div>
    </motion.div>
  );
}
