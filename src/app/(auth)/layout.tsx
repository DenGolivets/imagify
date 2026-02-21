"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SwingingLogo } from "@/components/layout/SwingingLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Forms */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 md:w-1/2 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right Side: Visual Showcase */}
      <div className="hidden w-1/2 flex-col items-center justify-center relative overflow-hidden bg-zinc-950 md:flex">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[url('/auth-bg.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-br from-violet-600/20 via-transparent to-fuchsia-600/20" />

        {/* Floating Glassmorphism Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 p-12 text-center"
        >
          <div className="mb-6 hidden justify-center md:flex">
            <Link href="/" className="my-14">
              <SwingingLogo className="scale-150" />
            </Link>
          </div>
          <h2 className="mt-12 text-4xl font-display font-bold text-white tracking-tight">
            Elevate Your Style with{" "}
            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-sm mx-auto">
            Experience the future of fashion. Try on anything, anywhere,
            instantly.
          </p>
        </motion.div>

        {/* Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>
    </div>
  );
}
