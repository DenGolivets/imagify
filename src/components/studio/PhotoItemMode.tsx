"use client";

import { useState } from "react";
import { PhotoDropzone } from "./PhotoDropzone";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface PhotoItemModeProps {
  onGenerate: (
    userBase64: string,
    userMime: string,
    itemBase64: string,
    itemMime: string,
  ) => void;
  isLoading: boolean;
}

export function PhotoItemMode({ onGenerate, isLoading }: PhotoItemModeProps) {
  const [userPhoto, setUserPhoto] = useState<{
    base64: string;
    mimeType: string;
    preview: string;
  } | null>(null);
  const [itemPhoto, setItemPhoto] = useState<{
    base64: string;
    mimeType: string;
    preview: string;
  } | null>(null);

  const handleGenerate = () => {
    if (!userPhoto || !itemPhoto) return;
    onGenerate(
      userPhoto.base64,
      userPhoto.mimeType,
      itemPhoto.base64,
      itemPhoto.mimeType,
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PhotoDropzone
          label="Your Photo"
          description="Clear front-facing photo"
          value={userPhoto?.preview}
          onUpload={(base64, mimeType) =>
            setUserPhoto({
              base64,
              mimeType,
              preview: `data:${mimeType};base64,${base64}`,
            })
          }
          onRemove={() => setUserPhoto(null)}
          disabled={isLoading}
        />
        <PhotoDropzone
          label="Item Photo"
          description="Clothing or accessory"
          value={itemPhoto?.preview}
          onUpload={(base64, mimeType) =>
            setItemPhoto({
              base64,
              mimeType,
              preview: `data:${mimeType};base64,${base64}`,
            })
          }
          onRemove={() => setItemPhoto(null)}
          disabled={isLoading}
        />
      </div>

      <div className="text-center p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10">
        <p className="text-[11px] text-zinc-500">
          Our AI will realistically fit the item onto your photo, preserving
          lighting and style.
        </p>
      </div>

      <Button
        size="lg"
        onClick={handleGenerate}
        disabled={isLoading || !userPhoto || !itemPhoto}
        className="w-full h-16 text-lg font-bold rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-xl shadow-violet-500/20 group relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
      >
        <span className="relative z-10 flex items-center justify-center space-x-3">
          {isLoading ? (
            <>
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Fitting Item...</span>
            </>
          ) : (
            <>
              <Wand2 className="size-5 group-hover:rotate-12 transition-transform" />
              <span>Virtual Try-On</span>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>
    </div>
  );
}
