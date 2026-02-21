import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PricingPreview } from "@/components/home/PricingPreview";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Imagify | AI Virtual Try-On for Fashion",
  description:
    "The AI-powered virtual fitting room. Try it on before you buy it. Experience the future of fashion with high-precision AI generation.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingPreview />
      <CTASection />
    </div>
  );
}
