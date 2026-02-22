import { StudioUploader } from "@/components/studio/StudioUploader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Try-On Studio | Imagify",
  description:
    "The ultimate AI-powered fitting room. Upload your photo and any clothing item to see the perfect fit instantly.",
};

export default function StudioPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_50%)] pointer-events-none" />
      <StudioUploader />
    </main>
  );
}
