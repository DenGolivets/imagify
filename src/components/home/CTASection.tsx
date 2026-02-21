"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-96 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 size-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-[3rem] bg-linear-to-br from-violet-600 to-fuchsia-600 p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group"
        >
          {/* Animated Internal Glow */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-tight">
              Ready to Redefine <br /> Your Style?
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto font-medium">
              Join thousands of fashion innovators using AI to visualize their
              perfect wardrobe. Start your journey today for free.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-14 px-10 text-lg font-black bg-white text-violet-600 hover:bg-zinc-100 border-none shadow-xl"
              >
                <Link href="/register">Get Started Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-14 px-10 text-lg font-bold text-white border border-white/20 hover:bg-white/10"
              >
                <Link href="/pricing">View All Plans</Link>
              </Button>
            </div>
          </div>

          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
