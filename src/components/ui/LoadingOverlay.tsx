"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

export function LoadingOverlay({
  isLoading,
  text = "Imagify is working its magic...",
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[inherit] bg-background/80 backdrop-blur-sm"
        >
          <div className="relative mb-6 h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />
            <div className="absolute inset-6 rounded-full bg-background" />
          </div>

          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="font-display text-lg font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
          >
            {text}
          </motion.p>

          <div className="mt-4 flex gap-1">
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
                className="h-1.5 w-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
