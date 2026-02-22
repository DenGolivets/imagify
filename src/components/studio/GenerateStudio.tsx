"use client";

import { useState } from "react";
import { GenerateModeTabs, GenerateMode } from "./GenerateModeTabs";
import { PromptMode } from "./PromptMode";
import { PhotoTextMode } from "./PhotoTextMode";
import { PhotoItemMode } from "./PhotoItemMode";
import { ResultPreview } from "./ResultPreview";
import { GenerateActions } from "./GenerateActions";
import { useGenerate } from "@/hooks/useGenerate";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export function GenerateStudio() {
  const [activeMode, setActiveMode] = useState<GenerateMode>("prompt");
  const { isLoading, result, fromPrompt, fromPhotoText, tryOn, reset } =
    useGenerate();

  // Keep track of the source image for CompareSlider (TryOn and PhotoText modes)
  const [beforeImage, setBeforeImage] = useState<string | undefined>(undefined);

  const handleModeChange = (mode: GenerateMode) => {
    setActiveMode(mode);
    reset();
    setBeforeImage(undefined);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium"
        >
          <Sparkles className="size-4" />
          <span>AI Creative Studio</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
          Imagify Your{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">
            Vision
          </span>
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Choose a mode and let our AI transform your fashion ideas into
          photorealistic reality.
        </p>
      </div>

      {/* Mode Switcher */}
      <GenerateModeTabs
        activeMode={activeMode}
        onModeChange={handleModeChange}
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Input Column */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {activeMode === "prompt" && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <PromptMode
                  isLoading={isLoading}
                  onGenerate={(prompt) => fromPrompt({ prompt })}
                />
              </motion.div>
            )}
            {activeMode === "photo_text" && (
              <motion.div
                key="photo_text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <PhotoTextMode
                  isLoading={isLoading}
                  onGenerate={(base64, mime, desc) => {
                    setBeforeImage(`data:${mime};base64,${base64}`);
                    fromPhotoText({
                      photoBase64: base64,
                      photoMimeType: mime,
                      description: desc,
                    });
                  }}
                />
              </motion.div>
            )}
            {activeMode === "tryon" && (
              <motion.div
                key="tryon"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <PhotoItemMode
                  isLoading={isLoading}
                  onGenerate={(uBase, uMime, iBase, iMime) => {
                    setBeforeImage(`data:${uMime};base64,${uBase}`);
                    tryOn({
                      userPhotoBase64: uBase,
                      userPhotoMimeType: uMime,
                      itemPhotoBase64: iBase,
                      itemPhotoMimeType: iMime,
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-6 sticky top-24">
          <AnimatePresence mode="wait">
            {!result && !isLoading ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="aspect-4/5 rounded-[40px] border border-dashed border-zinc-800 bg-zinc-900/10 flex flex-col items-center justify-center space-y-4"
              >
                <div className="size-20 rounded-3xl bg-zinc-900 flex items-center justify-center border border-white/5">
                  <Sparkles className="size-8 text-zinc-700" />
                </div>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest text-[10px]">
                  Your result will appear here
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <ResultPreview
                  isLoading={isLoading}
                  resultImage={result?.imageBase64}
                  beforeImage={beforeImage}
                  mode={activeMode}
                />

                {result && (
                  <GenerateActions
                    onReset={() => {
                      reset();
                      setBeforeImage(undefined);
                    }}
                    generationId={result.generationId}
                    imageBase64={result.imageBase64}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
