"use client";

import { useState } from "react";
import { PhotoDropzone } from "./PhotoDropzone";
import { Button } from "@/components/ui/button";
import { Wand2, Type } from "lucide-react";

interface PhotoTextModeProps {
  onGenerate: (
    photoBase64: string,
    photoMimeType: string,
    description: string,
  ) => void;
  isLoading: boolean;
}

export function PhotoTextMode({ onGenerate, isLoading }: PhotoTextModeProps) {
  const [photo, setPhoto] = useState<{
    base64: string;
    mimeType: string;
    preview: string;
  } | null>(null);
  const [description, setDescription] = useState("");

  const handleGenerate = () => {
    if (!photo || !description.trim()) return;
    onGenerate(photo.base64, photo.mimeType, description);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <PhotoDropzone
          label="Base Photo"
          description="Upload a photo to edit"
          value={photo?.preview}
          onUpload={(base64, mimeType) =>
            setPhoto({
              base64,
              mimeType,
              preview: `data:${mimeType};base64,${base64}`,
            })
          }
          onRemove={() => setPhoto(null)}
          disabled={isLoading}
        />

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Instructions
            </label>
            <div className="relative group">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Change the color of the jacket to deep red and add gold embroidery..."
                disabled={isLoading}
                className="w-full h-48 p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 outline-none resize-none text-white placeholder:text-zinc-600 font-medium"
              />
              <div className="absolute top-6 right-6 text-zinc-700 group-focus-within:text-violet-500/50">
                <Type className="size-5" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed px-1">
            <span className="text-violet-400 font-bold mr-1">Pro Tip:</span>
            Describe the specific changes you want to see. AI works best with
            clear requests like &quot;Change the color of X to Y&quot; or
            &quot;Add a Z pattern to the shirt&quot;.
          </p>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleGenerate}
        disabled={isLoading || !photo || description.trim().length < 3}
        className="w-full h-16 text-lg font-bold rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-xl shadow-violet-500/20 group relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
      >
        <span className="relative z-10 flex items-center justify-center space-x-3">
          {isLoading ? (
            <>
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Editing Photo...</span>
            </>
          ) : (
            <>
              <Wand2 className="size-5 group-hover:rotate-12 transition-transform" />
              <span>Apply Changes</span>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>
    </div>
  );
}
