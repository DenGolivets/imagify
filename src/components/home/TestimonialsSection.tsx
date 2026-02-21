"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const testimonials = [
  {
    name: "Elena Rossi",
    role: "Fashion Designer",
    content:
      "Imagify has completely changed how I prototype my collections. The virtual try-on is incredibly realistic.",
    rating: 5,
  },
  {
    name: "Marcus Thorne",
    role: "Tech Influencer",
    content:
      "The AI Style Advisor is like having a personal stylist in my pocket. It suggested things I never thought would look good!",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Enthusiast",
    content:
      "I saved so much money by virtually trying on outfits before buying them online. It's a game changer for retail.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Quote className="size-12 text-violet-500/20 mx-auto mb-4" />
          <h2 className="text-4xl font-display font-black text-white mb-4">
            Loved by Fashionistas
          </h2>
          <p className="text-zinc-400">
            Join thousands of users who are redefining their style with Imagify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-8 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-violet-500 text-violet-500"
                    />
                  ))}
                </div>
                <p className="text-zinc-300 italic mb-6 flex-1">
                  &quot;{testimonial.content}&quot;
                </p>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-violet-400 text-xs font-medium uppercase tracking-widest">
                    {testimonial.role}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
