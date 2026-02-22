"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fileToBase64 } from "@/utils/image";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "@/constants/ai";

interface PhotoDropzoneProps {
  onUpload: (base64: string, mimeType: string) => void;
  onRemove: () => void;
  label: string;
  description?: string;
  value?: string; // preview URL
  disabled?: boolean;
}

export function PhotoDropzone({
  onUpload,
  onRemove,
  label,
  description,
  value,
  disabled,
}: PhotoDropzoneProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const base64 = await fileToBase64(file);
        onUpload(base64, file.type);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_IMAGE_TYPES.reduce(
        (acc, current) => ({ ...acc, [current]: [] }),
        {},
      ),
      maxFiles: 1,
      maxSize: MAX_IMAGE_SIZE_MB * 1024 * 1024,
      disabled,
    });

  const rejection = fileRejections[0];

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
        {label}
      </label>

      <div
        {...getRootProps()}
        className={cn(
          "relative aspect-4/5 rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer group",
          isDragActive
            ? "border-violet-500 bg-violet-500/10 scale-[0.98]"
            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80",
          value && "border-solid border-violet-500/50",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div className="flex items-center space-x-2 text-white text-sm font-medium">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>Image Uploaded</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute top-4 right-4 size-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors z-10"
              >
                <X className="size-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4"
            >
              <div className="relative">
                <div className="size-16 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="size-8 text-violet-400" />
                </div>
                <div className="absolute -inset-2 bg-violet-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase tracking-tight">
                  {isDragActive ? "Drop to upload" : "Click or drag to upload"}
                </p>
                {description && (
                  <p className="text-xs text-zinc-500 max-w-45">
                    {description}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {rejection && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 text-red-400 text-[11px] font-medium px-1"
        >
          <AlertCircle className="size-3 shrink-0" />
          <span>
            {rejection.errors[0].code === "file-too-large"
              ? `Max size is ${MAX_IMAGE_SIZE_MB}MB`
              : "Invalid image format"}
          </span>
        </motion.div>
      )}
    </div>
  );
}
