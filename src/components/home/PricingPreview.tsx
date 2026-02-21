"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for exploring AI fashion.",
    features: [
      "5 generations per day",
      "Standard processing speed",
      "Community support",
      "Basic style advice",
    ],
    cta: "Start for Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For true style innovators.",
    features: [
      "Unlimited generations",
      "Priority processing",
      "24/7 dedicated support",
      "Advanced style advisor",
      "High-res downloads",
      "Personalized wardrobe",
    ],
    cta: "Get Pro Access",
    href: "/register",
    popular: true,
  },
];

export function PricingPreview() {
  return (
    <section id="pricing" className="py-24 bg-zinc-950/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-display font-black text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-zinc-400">
            Choose the plan that fits your fashion journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-violet-600 text-white text-xs font-black uppercase tracking-widest z-20 shadow-lg">
                  Most Popular
                </div>
              )}

              <GlassCard
                className={`p-8 h-full flex flex-col border-2 ${plan.popular ? "border-violet-500/50 shadow-[0_0_40px_rgba(124,58,237,0.15)]" : "border-white/5"}`}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-zinc-500">/month</span>
                  </div>
                  <p className="text-zinc-400 mt-2 text-sm">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-zinc-300"
                    >
                      <div className="size-5 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                        <Check className="size-3 text-violet-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.popular ? "primary" : "glass"}
                  className="w-full h-12 text-base font-bold"
                >
                  <Link href={plan.href}>
                    {plan.popular && <Sparkles className="mr-2 size-4" />}
                    {plan.cta}
                  </Link>
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
