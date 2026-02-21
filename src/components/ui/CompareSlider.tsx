"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-square"
}

export function CompareSlider({
  beforeImage,
  afterImage,
  className,
  aspectRatio = "aspect-square",
}: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      setContainerWidth(containerRef.current?.offsetWidth || 0);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percentage);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging.current) {
        handleMove(e.clientX);
      }
    },
    [handleMove],
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging.current) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove],
  );

  const onEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [onMouseMove, onTouchMove, onEnd]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "glass-card relative overflow-hidden select-none touch-none",
        aspectRatio,
        className,
      )}
      onMouseDown={() => (isDragging.current = true)}
      onTouchStart={() => (isDragging.current = true)}
    >
      {/* After Image (Background) */}
      <Image
        src={afterImage}
        alt="After"
        fill
        className="object-cover"
        draggable={false}
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div
          style={{
            width: containerWidth,
            height: "100%",
            position: "relative",
          }}
        >
          <Image
            src={beforeImage}
            alt="Before"
            fill
            className="object-cover"
            draggable={false}
          />
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute bottom-0 top-0 z-10 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 8 4 4-4 4" />
            <path d="m6 8-4 4 4 4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm pointer-events-none">
        Original
      </div>
      <div className="absolute bottom-4 right-4 rounded-md bg-violet-600/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm pointer-events-none">
        Generated
      </div>
    </div>
  );
}
