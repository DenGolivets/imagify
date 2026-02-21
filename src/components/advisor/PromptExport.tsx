"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

interface PromptExportProps {
  prompt: string;
}

export function PromptExport({ prompt }: PromptExportProps) {
  const router = useRouter();

  const handleExport = () => {
    // We could use searchParams to pass the prompt, or just navigate
    // and let the user paste it (though passing is better UX)
    // For now, let's copy to clipboard and navigate with a Toast instruction

    const url = `/generate?prompt=${encodeURIComponent(prompt)}`;

    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied! Opening Studio...");

    router.push(url);
  };

  return (
    <Button
      onClick={handleExport}
      className="w-full h-14 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-violet-500/20 group relative overflow-hidden transition-all duration-300"
    >
      <span className="relative z-10 flex items-center justify-center space-x-2">
        <Sparkles className="size-4 group-hover:rotate-12 transition-transform" />
        <span>Try this Look in Studio</span>
        <ExternalLink className="size-3 ml-1 opacity-50" />
      </span>
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </Button>
  );
}
