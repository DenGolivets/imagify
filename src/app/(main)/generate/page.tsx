import { GenerateStudio } from "@/components/studio/GenerateStudio";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Creative Studio | Imagify",
  description:
    "Create, edit, and try on fashion items using advanced AI. From text-to-image to virtual try-ons.",
};

export default function GeneratePage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_50%)] pointer-events-none" />
      <GenerateStudio />
    </main>
  );
}
