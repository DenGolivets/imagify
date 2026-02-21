"use client";

import { useState } from "react";
import { Download, Share2, Save, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface GenerateActionsProps {
  onReset: () => void;
  generationId: string;
  imageBase64: string;
}

export function GenerateActions({
  onReset,
  generationId,
  imageBase64,
}: GenerateActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageBase64;
    link.download = `imagify-look-${generationId.slice(0, 8)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId }),
      });

      if (!res.ok) throw new Error("Failed to save to wardrobe");

      setIsSaved(true);
      toast.success("Saved to your wardrobe!");
    } catch {
      toast.error("Failed to save. Try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My AI-Generated Look",
          text: "Check out this virtual generation from Imagify!",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(imageBase64);
        toast.success("Image data copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Button
        variant="glass"
        onClick={handleSave}
        disabled={isSaved || isSaving}
        className="h-14 rounded-2xl border-white/5 text-white hover:bg-white/10 bg-zinc-900/40"
      >
        {isSaved ? (
          <>
            <CheckCircle2 className="size-4 mr-2 text-emerald-400" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <Save className="size-4 mr-2 text-violet-400" />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </>
        )}
      </Button>

      <Button
        variant="glass"
        onClick={handleDownload}
        className="h-14 rounded-2xl border-white/5 text-white hover:bg-white/10 bg-zinc-900/40"
      >
        <Download className="size-4 mr-2 text-violet-400" />
        Download
      </Button>

      <Button
        variant="glass"
        onClick={handleShare}
        className="h-14 rounded-2xl border-white/5 text-white hover:bg-white/10 bg-zinc-900/40"
      >
        <Share2 className="size-4 mr-2 text-violet-400" />
        Share
      </Button>

      <Button
        variant="glass"
        onClick={onReset}
        className="h-14 rounded-2xl border-white/5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 bg-zinc-900/40 col-span-2 sm:col-span-1"
      >
        <Trash2 className="size-4 mr-2" />
        Try New
      </Button>
    </div>
  );
}
