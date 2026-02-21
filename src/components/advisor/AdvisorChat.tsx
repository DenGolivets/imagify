"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PhotoDropzone } from "@/components/studio/PhotoDropzone";
import Image from "next/image";

interface AdvisorChatProps {
  onSend: (
    message: string,
    photo?: { base64: string; mimeType: string },
  ) => void;
  isLoading: boolean;
}

export function AdvisorChat({ onSend, isLoading }: AdvisorChatProps) {
  const [message, setMessage] = useState("");
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photo, setPhoto] = useState<{
    base64: string;
    mimeType: string;
    preview: string;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    onSend(
      message,
      photo ? { base64: photo.base64, mimeType: photo.mimeType } : undefined,
    );
    setMessage("");
    setPhoto(null);
    setShowPhotoUpload(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative group">
        {/* Border Glow */}
        <div className="absolute -inset-0.5 bg-linear-to-r from-violet-500/20 to-fuchsia-500/20 rounded-[32px] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />

        <div className="relative bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 shadow-2xl">
          {/* Photo Preview Strip */}
          <AnimatePresence>
            {photo && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="relative inline-block group/photo">
                  <div className="relative size-24 rounded-2xl border border-violet-500/30 overflow-hidden">
                    <Image
                      src={photo.preview}
                      alt="Attached"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 py-1 bg-black/60 text-[8px] text-white text-center font-black uppercase tracking-widest z-10">
                      Context Photo
                    </div>
                  </div>
                  <button
                    onClick={() => setPhoto(null)}
                    className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your fashion consultant anything..."
                rows={1}
                disabled={isLoading}
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-500 py-3 resize-none max-h-60 custom-scrollbar font-medium"
              />
            </div>

            <div className="flex items-center space-x-2 pb-1.5">
              <button
                type="button"
                onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                disabled={isLoading}
                className={cn(
                  "size-11 rounded-2xl flex items-center justify-center transition-all duration-300",
                  showPhotoUpload
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10",
                )}
              >
                <ImageIcon className="size-5" />
              </button>

              <Button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="size-11 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all duration-300 shadow-xl"
              >
                {isLoading ? (
                  <Sparkles className="size-5 animate-pulse" />
                ) : (
                  <Send className="size-5" />
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Floating Photo Upload Dialog */}
        <AnimatePresence>
          {showPhotoUpload && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 -top-110 z-50 bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">
                  Attach Visual Context
                </h4>
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="h-70">
                <PhotoDropzone
                  label="Context Photo"
                  description="Show the AI what you're talking about"
                  value={photo?.preview}
                  onUpload={(base64, mimeType) => {
                    setPhoto({
                      base64,
                      mimeType,
                      preview: `data:${mimeType};base64,${base64}`,
                    });
                    setShowPhotoUpload(false);
                  }}
                  onRemove={() => setPhoto(null)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
        Powered by LLaMA 4 Scout • Intelligent Fashion Reasoning
      </p>
    </div>
  );
}
