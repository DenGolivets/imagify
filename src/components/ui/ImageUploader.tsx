"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  label?: string;
  maxSizeMB?: number;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-[3/4]" or "aspect-square"
}

export function ImageUploader({
  onImageSelect,
  onImageRemove,
  label = "Upload Image",
  maxSizeMB = 5,
  className,
  aspectRatio = "aspect-[3/4]",
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(`File is too large. Max size is ${maxSizeMB}MB.`);
        } else {
          setError(
            "Invalid file type. Please upload an image (JPG, PNG, WEBP).",
          );
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onImageSelect(file);
      }
    },
    [maxSizeMB, onImageSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageRemove?.();
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300",
          aspectRatio,
          isDragActive
            ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
            : "border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-white/10",
          preview && "border-none bg-transparent",
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-col items-center justify-center p-6 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <p className="font-display text-lg font-medium text-foreground">
                {label}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Drag & drop or click to upload
                <br />
                (Max {maxSizeMB}MB)
              </p>
              {error && (
                <p className="mt-4 text-xs font-medium text-destructive">
                  {error}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full w-full relative overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image
                src={preview}
                alt="Upload Preview"
                fill
                className="object-cover"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <Button
                  variant="glass"
                  size="icon"
                  onClick={handleRemove}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-100 border-red-500/30"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="rounded-full bg-violet-500 p-2 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-[10px] uppercase tracking-wider font-bold">
                  Image Ready
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
