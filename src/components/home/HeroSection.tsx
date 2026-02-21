"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "@/components/home/HeroDemo";

// Lazy load Three.js canvas to avoid SSR issues
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* 3D Background */}
      <HeroCanvas />

      {/* Radial Gradient for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-violet-600/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight leading-tight">
                Try It On <br />
                <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
                  Before You Buy It
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
            >
              Experience the future of personal style with Imagify. Our
              AI-powered virtual fitting room lets you merge your photo with any
              clothing item instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-lg font-bold group"
                variant="primary"
              >
                <Link href="/register">
                  Try for Free
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="glass"
                className="h-14 px-8 text-lg font-bold border-white/10 text-white hover:bg-white/5"
              >
                <Play className="mr-2 size-5 fill-white" />
                Watch Demo
              </Button>
            </motion.div>
          </div>

          {/* Right Visual Demo */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <HeroDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
