"use client";

import { useAdvisor } from "@/hooks/useAdvisor";
import { AdvisorChat } from "@/components/advisor/AdvisorChat";
import { StyleCard } from "@/components/advisor/StyleCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, History as HistoryIcon, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function AdvisorPage() {
  const {
    analyze,
    fetchHistory,
    isLoading,
    history,
    currentAdvice,
    setCurrentAdvice,
  } = useAdvisor();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSend = async (
    message: string,
    photo?: { base64: string; mimeType: string },
  ) => {
    await analyze({
      message,
      photoBase64: photo?.base64,
      photoMimeType: photo?.mimeType,
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_50%)] pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <Sparkles className="size-4" />
          <span>Professional Fashion Intel</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight">
          Style{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">
            Advisor
          </span>
        </h1>

        <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed">
          Ask for tailored outfit recommendations, fashion trends, or color
          palettes. Optionally upload a photo for deep visual analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-12">
          {/* Active Advice / Welcome */}
          <div className="min-h-125">
            <AnimatePresence mode="wait">
              {currentAdvice ? (
                <div key="advice" className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <button
                      onClick={() => setCurrentAdvice(null)}
                      className="flex items-center text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      <ArrowLeft className="size-3 mr-2" />
                      New Consult
                    </button>
                  </div>
                  <StyleCard
                    advice={currentAdvice.advice}
                    generatedPrompt={currentAdvice.generatedPrompt}
                    isNew
                  />
                </div>
              ) : (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-8"
                >
                  <div className="size-24 rounded-[40px] bg-zinc-900 flex items-center justify-center border border-white/5 relative">
                    <Sparkles className="size-10 text-zinc-700" />
                    <div className="absolute inset-0 bg-violet-500/5 blur-3xl rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                      Your Digital Stylist is Ready
                    </h2>
                    <p className="text-zinc-600 text-sm max-w-xs">
                      Ask a question below to start your personal fashion
                      consult.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Input */}
          <AdvisorChat onSend={handleSend} isLoading={isLoading} />
        </div>

        {/* Sidebar / History */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center space-x-2 px-2">
            <HistoryIcon className="size-4 text-violet-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              Recent Consults
            </h3>
          </div>

          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((session) => (
                <button
                  key={session.id}
                  onClick={() =>
                    setCurrentAdvice({
                      sessionId: session.id,
                      advice: session.aiResponse,
                      generatedPrompt: session.extractedPrompt,
                      createdAt: session.createdAt,
                    })
                  }
                  className="w-full text-left p-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-violet-500/30 hover:bg-zinc-900/60 transition-all group"
                >
                  <p className="text-xs font-bold text-white line-clamp-2 mb-2 group-hover:text-violet-400">
                    {session.userMessage}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <div className="size-1.5 rounded-full bg-violet-500/40 group-hover:bg-violet-400" />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 rounded-3xl border border-dashed border-zinc-800 text-center space-y-3">
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                  No History Yet
                </p>
                <p className="text-[10px] text-zinc-700 uppercase tracking-tight">
                  Your style journey starts here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
