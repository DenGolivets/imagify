"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Wand2, Download } from "lucide-react";

const steps = [
  {
    title: "Upload Photos",
    description:
      "Start by uploading your photo and the piece of clothing you want to try on or a text prompt.",
    icon: Upload,
  },
  {
    title: "AI Analysis",
    description:
      "Our advanced AI models analyze your body shape, lighting, and textures to ensure a perfect fit.",
    icon: Wand2,
  },
  {
    title: "Get Results",
    description:
      "In seconds, view your high-fidelity generation. Save it to your wardrobe or download it instantly.",
    icon: Download,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-zinc-950/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-display font-black text-white mb-4">
            How It Works
          </h2>
          <p className="text-zinc-400">
            A simple three-step process to transform your wardrobe with AI
            magic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
          {/* Animated Connectors (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-violet-500/20 to-transparent -translate-y-1/2 hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative flex flex-col items-center text-center space-y-6"
            >
              <div className="size-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-xl z-10 group-hover:border-violet-500/50 transition-colors">
                <step.icon className="size-8 text-violet-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step Number Badge */}
              <div className="absolute -top-4 -right-2 size-8 rounded-full bg-violet-600 text-white font-black text-xs flex items-center justify-center shadow-lg">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
