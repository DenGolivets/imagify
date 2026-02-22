"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";

interface StyleCardProps {
  advice: string;
  generatedPrompt: string | null;
  date?: string;
  isNew?: boolean;
}

export function StyleCard({
  advice,
  generatedPrompt,
  date,
  isNew,
}: StyleCardProps) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 20, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative group h-full"
    >
      {/* Background Glow */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500" />

      <div className="relative h-full bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="size-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                AI Stylist Advice
              </h3>
              {date && (
                <div className="flex items-center text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">
                  <Calendar className="size-3 mr-1" />
                  {new Date(date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          {isNew && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
              New Insight
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <article
            className="prose prose-invert prose-sm max-w-none 
            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase prose-headings:mb-4
            prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-violet-400 prose-strong:font-bold
            prose-ul:list-disc prose-ul:pl-4 prose-ul:mb-6
            prose-li:text-zinc-400 prose-li:mb-2
            prose-hr:border-white/5 prose-hr:my-8"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{advice}</ReactMarkdown>
          </article>
        </div>

        {/* Footer / Actions */}
        {generatedPrompt && (
          <div className="p-6 bg-white/5 border-t border-white/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">
                <Wand2 className="size-3" />
                <span>Recommended Generation</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-zinc-400 font-medium italic leading-relaxed mb-4">
                &quot;{generatedPrompt}&quot;
              </div>
              <PromptExport prompt={generatedPrompt} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

import { Wand2 } from "lucide-react";
import { PromptExport } from "./PromptExport";
