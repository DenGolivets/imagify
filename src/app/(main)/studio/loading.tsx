import { Sparkles } from "lucide-react";

export default function StudioLoading() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-8">
        {/* Animated Icon */}
        <div className="relative">
          <div className="size-20 rounded-3xl bg-zinc-900 flex items-center justify-center border border-white/5 relative z-10">
            <Sparkles className="size-8 text-violet-500 animate-pulse" />
          </div>
          {/* Background Glow */}
          <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full animate-pulse" />
        </div>

        {/* Shimmering Text */}
        <div className="space-y-3 text-center">
          <div className="h-6 w-48 bg-zinc-800 rounded-lg animate-pulse mx-auto" />
          <div className="h-4 w-64 bg-zinc-800/50 rounded-lg animate-pulse mx-auto" />
        </div>

        {/* Skeleton Grid for UI Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-12 opacity-50">
          <div className="h-96 rounded-[40px] bg-zinc-900/50 border border-white/5 animate-pulse" />
          <div className="h-96 rounded-[40px] bg-zinc-900/50 border border-white/5 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
