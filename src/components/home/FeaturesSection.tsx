"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Brain, Shirt, Search, History } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const features = [
  {
    title: "Virtual Try-On",
    description:
      "Upload your photo and any clothing item to see an instant, high-fidelity preview of yourself wearing it.",
    icon: Shirt,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "AI Style Advisor",
    description:
      "Get personalized fashion advice and outfit recommendations from our advanced AI style consultant.",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Generate Studio",
    description:
      "Create stunning fashion content using text prompts or by modifying existing photos with AI precision.",
    icon: Sparkles,
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "Smart Search",
    description:
      "Find the perfect clothes that match your body type and personal style across thousands of brands.",
    icon: Search,
    color: "from-orange-500 to-yellow-500",
  },
  {
    title: "History & Wardrobe",
    description:
      "Save your favorite generations and build a digital wardrobe of looks you love.",
    icon: History,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Instant Results",
    description:
      "Our optimized AI pipeline delivers high-resolution results in seconds, not minutes.",
    icon: Zap,
    color: "from-red-500 to-orange-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-black text-white"
          >
            Powerful Features for <br />
            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Fashion Innovators
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg"
          >
            Everything you need to redefine your style and visualize fashion
            like never before.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <GlassCard className="h-full p-8 group hover:border-violet-500/30 transition-colors duration-500">
                <div
                  className={`size-12 rounded-xl bg-linear-to-br ${feature.color} p-2.5 mb-6 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500`}
                >
                  <feature.icon className="size-full text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
